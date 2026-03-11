-- =============================================
-- POST-PAYMENT : Trigger de notifications automatiques
-- Déclenché quand une transaction passe en 'completed' (type = 'rent_payment')
-- Crée des notifications pour : locataire, agent, propriétaire, admins
-- =============================================

-- -----------------------------------------------
-- Fonction trigger : notify_on_payment_completed
-- SECURITY DEFINER pour accéder aux tables profiles et user_roles
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.notify_on_payment_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rental RECORD;
  v_tenant_name TEXT;
  v_property_title TEXT;
  v_rent_period TEXT;
  v_fmt_amount TEXT;
  v_admin RECORD;
BEGIN
  -- Ne se déclenche que pour les paiements de loyer passant en 'completed'
  IF NEW.type != 'rent_payment' THEN
    RETURN NEW;
  END IF;

  IF NEW.status != 'completed' THEN
    RETURN NEW;
  END IF;

  -- Vérifier que l'ancien statut n'était pas déjà 'completed' (éviter les doublons)
  IF TG_OP = 'UPDATE' AND OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  -- Charger le contexte : location, locataire, bien
  IF NEW.rental_id IS NULL THEN
    RETURN NEW;
  END IF;

  SELECT r.tenant_id, r.owner_id, r.agent_id, r.property_id
  INTO v_rental
  FROM public.rentals r
  WHERE r.id = NEW.rental_id;

  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  -- Nom du locataire
  SELECT COALESCE(full_name, 'Locataire') INTO v_tenant_name
  FROM public.profiles WHERE id = v_rental.tenant_id;

  -- Titre du bien
  SELECT COALESCE(title, 'Logement') INTO v_property_title
  FROM public.properties WHERE id = v_rental.property_id;

  -- Période du loyer
  v_rent_period := to_char(NEW.created_at, 'Month YYYY');

  -- Formater le montant
  v_fmt_amount := to_char(NEW.amount, 'FM999G999G999') || ' ' || COALESCE(NEW.currency, 'GNF');

  -- 1. Notification locataire
  INSERT INTO public.notifications (user_id, title, message, type, metadata)
  VALUES (
    v_rental.tenant_id,
    'Paiement confirmé',
    'Votre loyer de ' || v_fmt_amount || ' pour "' || v_property_title || '" (' || trim(v_rent_period) || ') a été payé avec succès. Votre reçu est disponible.',
    'payment_confirmed',
    jsonb_build_object(
      'transaction_id', NEW.id,
      'amount', NEW.amount,
      'currency', NEW.currency,
      'payment_reference', NEW.payment_reference,
      'property_title', v_property_title,
      'role', 'tenant'
    )
  );

  -- 2. Notification agent (s'il existe et est différent du propriétaire)
  IF v_rental.agent_id IS NOT NULL THEN
    INSERT INTO public.notifications (user_id, title, message, type, metadata)
    VALUES (
      v_rental.agent_id,
      'Paiement de loyer reçu',
      v_tenant_name || ' a payé son loyer de ' || v_fmt_amount || ' pour "' || v_property_title || '". Votre commission a été créditée.',
      'payment_received',
      jsonb_build_object(
        'transaction_id', NEW.id,
        'amount', NEW.amount,
        'currency', NEW.currency,
        'payer_id', v_rental.tenant_id,
        'property_title', v_property_title,
        'role', 'agent'
      )
    );
  END IF;

  -- 3. Notification propriétaire (si différent de l'agent)
  IF v_rental.owner_id IS DISTINCT FROM v_rental.agent_id THEN
    INSERT INTO public.notifications (user_id, title, message, type, metadata)
    VALUES (
      v_rental.owner_id,
      'Loyer encaissé',
      'Le loyer de ' || v_fmt_amount || ' pour "' || v_property_title || '" a été payé par ' || v_tenant_name || '.',
      'payment_received',
      jsonb_build_object(
        'transaction_id', NEW.id,
        'amount', NEW.amount,
        'currency', NEW.currency,
        'payer_id', v_rental.tenant_id,
        'property_title', v_property_title,
        'role', 'owner'
      )
    );
  END IF;

  -- 4. Notifications admins
  FOR v_admin IN
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
  LOOP
    -- Ne pas notifier si l'admin est aussi agent ou propriétaire (éviter les doublons)
    IF v_admin.user_id != COALESCE(v_rental.agent_id, '00000000-0000-0000-0000-000000000000')
       AND v_admin.user_id != v_rental.owner_id
       AND v_admin.user_id != v_rental.tenant_id
    THEN
      INSERT INTO public.notifications (user_id, title, message, type, metadata)
      VALUES (
        v_admin.user_id,
        'Paiement de loyer effectué',
        v_tenant_name || ' a payé ' || v_fmt_amount || ' pour "' || v_property_title || '".',
        'admin_payment_alert',
        jsonb_build_object(
          'transaction_id', NEW.id,
          'amount', NEW.amount,
          'currency', NEW.currency,
          'payer_id', v_rental.tenant_id,
          'property_title', v_property_title,
          'role', 'admin'
        )
      );
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$;

-- -----------------------------------------------
-- Trigger : sur INSERT ou UPDATE de transactions
-- Se déclenche AFTER pour ne pas bloquer le paiement
-- -----------------------------------------------
DROP TRIGGER IF EXISTS trg_notify_payment_completed ON public.transactions;

CREATE TRIGGER trg_notify_payment_completed
  AFTER INSERT OR UPDATE OF status
  ON public.transactions
  FOR EACH ROW
  WHEN (NEW.status = 'completed' AND NEW.type = 'rent_payment')
  EXECUTE FUNCTION public.notify_on_payment_completed();

-- -----------------------------------------------
-- Index pour accélérer les requêtes de notifications
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_notifications_user_read
  ON public.notifications (user_id, read)
  WHERE read = false;

CREATE INDEX IF NOT EXISTS idx_notifications_user_created
  ON public.notifications (user_id, created_at DESC);

-- -----------------------------------------------
-- Index pour accélérer la recherche de transactions
-- par rental_id et status
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_transactions_rental_status
  ON public.transactions (rental_id, status)
  WHERE type = 'rent_payment';
