-- =============================================
-- PHASE 4 : PAIEMENT - Fonctions RPC SECURITY DEFINER
-- Contournement RLS pour les opérations inter-wallets
-- =============================================

-- -----------------------------------------------
-- Fonction : complete_sandbox_payment
-- Appelée après la simulation du paiement mobile
-- Marque la transaction comme complétée et crédite
-- le portefeuille du destinataire de manière atomique
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_sandbox_payment(
  p_transaction_id UUID,
  p_is_success BOOLEAN
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx RECORD;
  v_receiver_balance NUMERIC;
  v_final_status TEXT;
  v_failure_reason TEXT;
BEGIN
  -- Récupérer la transaction
  SELECT * INTO v_tx FROM public.transactions WHERE id = p_transaction_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Transaction introuvable');
  END IF;

  -- Vérifier que c'est le payer qui appelle
  IF v_tx.payer_id != auth.uid() THEN
    RETURN jsonb_build_object('success', false, 'error', 'Non autorisé');
  END IF;

  v_final_status := CASE WHEN p_is_success THEN 'completed' ELSE 'failed' END;
  v_failure_reason := CASE WHEN p_is_success THEN NULL ELSE 'Solde insuffisant (simulation)' END;

  -- Mettre à jour le statut de la transaction
  UPDATE public.transactions
  SET
    status = v_final_status,
    metadata = metadata || jsonb_build_object(
      'processed_at', now()::text,
      'failure_reason', v_failure_reason
    ),
    updated_at = now()
  WHERE id = p_transaction_id;

  -- Si succès : créditer le wallet du destinataire
  IF p_is_success THEN
    -- Créer le wallet si inexistant
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (v_tx.receiver_id, v_tx.amount, v_tx.currency)
    ON CONFLICT (user_id) DO UPDATE
      SET balance = wallets.balance + EXCLUDED.balance,
          updated_at = now();
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'status', v_final_status,
    'transaction_id', p_transaction_id
  );
END;
$$;

-- -----------------------------------------------
-- Fonction : process_rent_payment
-- Paiement complet du loyer avec répartition
-- commission agent / propriétaire (Phase 4.2)
-- En sandbox : simule sans vrai prélèvement mobile
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.process_rent_payment(
  p_rental_id UUID,
  p_payment_method TEXT DEFAULT 'orange_money',
  p_phone_number TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rental RECORD;
  v_agent_commission NUMERIC;
  v_agent_amount NUMERIC;
  v_owner_amount NUMERIC;
  v_reference TEXT;
  v_tx_tenant_to_owner UUID;
  v_tx_commission UUID;
  v_is_success BOOLEAN;
BEGIN
  -- Récupérer les infos de la location
  SELECT r.*,
         p.agent_commission_percent
  INTO v_rental
  FROM public.rentals r
  LEFT JOIN public.properties p ON p.id = r.property_id
  WHERE r.id = p_rental_id
    AND r.tenant_id = auth.uid()
    AND r.status = 'active';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Location introuvable ou non active');
  END IF;

  -- Calcul de la répartition
  v_agent_commission := COALESCE(v_rental.agent_commission_percent, 0);
  v_agent_amount := ROUND(v_rental.rent_amount * v_agent_commission / 100);
  v_owner_amount := v_rental.rent_amount - v_agent_amount;

  -- Générer une référence unique
  v_reference := upper(p_payment_method) || '-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6);

  -- Simuler succès (90%)
  v_is_success := (random() > 0.1);

  -- Transaction principale : locataire → propriétaire
  INSERT INTO public.transactions (
    rental_id, payer_id, receiver_id,
    amount, currency, payment_method, payment_reference,
    type, status, description,
    metadata
  ) VALUES (
    p_rental_id, v_rental.tenant_id, v_rental.owner_id,
    v_owner_amount, v_rental.currency, p_payment_method, v_reference,
    'rent_payment',
    CASE WHEN v_is_success THEN 'completed' ELSE 'failed' END,
    'Loyer - ' || to_char(now(), 'Month YYYY'),
    jsonb_build_object(
      'sandbox', true,
      'phone_number', p_phone_number,
      'processed_at', now()::text,
      'full_rent', v_rental.rent_amount,
      'agent_commission_pct', v_agent_commission
    )
  )
  RETURNING id INTO v_tx_tenant_to_owner;

  -- Transaction commission : locataire → agent (si agent existe)
  IF v_rental.agent_id IS NOT NULL AND v_agent_amount > 0 AND v_is_success THEN
    INSERT INTO public.transactions (
      rental_id, payer_id, receiver_id,
      amount, currency, payment_method, payment_reference,
      type, status, description,
      metadata
    ) VALUES (
      p_rental_id, v_rental.tenant_id, v_rental.agent_id,
      v_agent_amount, v_rental.currency, p_payment_method, v_reference || '-COM',
      'commission',
      'completed',
      'Commission agent - ' || to_char(now(), 'Month YYYY'),
      jsonb_build_object('sandbox', true, 'parent_transaction', v_tx_tenant_to_owner)
    )
    RETURNING id INTO v_tx_commission;
  END IF;

  -- Créditer les wallets si succès
  IF v_is_success THEN
    -- Wallet propriétaire
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (v_rental.owner_id, v_owner_amount, v_rental.currency)
    ON CONFLICT (user_id) DO UPDATE
      SET balance = wallets.balance + EXCLUDED.balance,
          updated_at = now();

    -- Wallet agent
    IF v_rental.agent_id IS NOT NULL AND v_agent_amount > 0 THEN
      INSERT INTO public.wallets (user_id, balance, currency)
      VALUES (v_rental.agent_id, v_agent_amount, v_rental.currency)
      ON CONFLICT (user_id) DO UPDATE
        SET balance = wallets.balance + EXCLUDED.balance,
            updated_at = now();
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'success', v_is_success,
    'status', CASE WHEN v_is_success THEN 'completed' ELSE 'failed' END,
    'transaction_id', v_tx_tenant_to_owner,
    'owner_amount', v_owner_amount,
    'agent_amount', v_agent_amount,
    'failure_reason', CASE WHEN NOT v_is_success THEN 'Solde insuffisant (simulation)' ELSE NULL END
  );
END;
$$;

-- -----------------------------------------------
-- Fonction : withdraw_funds
-- Retrait depuis le wallet avec frais plateforme
-- Calcul selon le plan d'abonnement (Phase 4.2)
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.withdraw_funds(
  p_amount NUMERIC,
  p_method TEXT,
  p_phone_number TEXT DEFAULT NULL,
  p_bank_account TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_wallet RECORD;
  v_subscription_plan TEXT;
  v_commission_rate NUMERIC;
  v_platform_fee NUMERIC;
  v_net_amount NUMERIC;
  v_reference TEXT;
  v_is_success BOOLEAN;
  v_tx_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Non authentifié');
  END IF;

  -- Récupérer le wallet
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Portefeuille introuvable');
  END IF;

  IF v_wallet.balance < p_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 'Solde insuffisant');
  END IF;

  -- Récupérer le plan d'abonnement
  SELECT subscription_plan INTO v_subscription_plan
  FROM public.profiles WHERE id = v_user_id;

  -- Calcul commission selon plan (Phase 4.2 spec)
  v_commission_rate := CASE v_subscription_plan
    WHEN 'enterprise' THEN 0.015  -- 1.5%
    WHEN 'pro'        THEN 0.035  -- 3.5%
    WHEN 'basic'      THEN 0.055  -- 5.5%
    ELSE                   0.09   -- 9% (free)
  END;

  v_platform_fee := ROUND(p_amount * v_commission_rate);
  v_net_amount := p_amount - v_platform_fee;

  -- Générer référence
  v_reference := upper(p_method) || '-WD-' || extract(epoch from now())::bigint;

  -- Simuler succès (85%)
  v_is_success := (random() > 0.15);

  -- Créer la transaction de retrait
  INSERT INTO public.transactions (
    payer_id, receiver_id,
    amount, currency,
    payment_method, payment_reference,
    type, status, description,
    metadata
  ) VALUES (
    v_user_id, v_user_id,
    p_amount, v_wallet.currency,
    p_method, v_reference,
    'withdrawal',
    CASE WHEN v_is_success THEN 'completed' ELSE 'failed' END,
    'Retrait de fonds',
    jsonb_build_object(
      'sandbox', true,
      'phone_number', p_phone_number,
      'bank_account', p_bank_account,
      'platform_fee', v_platform_fee,
      'net_amount', v_net_amount,
      'commission_rate', v_commission_rate,
      'subscription_plan', COALESCE(v_subscription_plan, 'free'),
      'processed_at', now()::text,
      'failure_reason', CASE WHEN NOT v_is_success THEN 'Échec du transfert (simulation)' ELSE NULL END
    )
  )
  RETURNING id INTO v_tx_id;

  -- Débiter le wallet si succès
  IF v_is_success THEN
    UPDATE public.wallets
    SET balance = balance - p_amount,
        updated_at = now()
    WHERE user_id = v_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', v_is_success,
    'status', CASE WHEN v_is_success THEN 'completed' ELSE 'failed' END,
    'transaction_id', v_tx_id,
    'gross_amount', p_amount,
    'platform_fee', v_platform_fee,
    'net_amount', v_net_amount,
    'failure_reason', CASE WHEN NOT v_is_success THEN 'Échec du transfert (simulation)' ELSE NULL END
  );
END;
$$;

-- -----------------------------------------------
-- Permettre à tous les users authentifiés d'appeler
-- ces fonctions (elles vérifient les permissions en interne)
-- -----------------------------------------------
GRANT EXECUTE ON FUNCTION public.complete_sandbox_payment(UUID, BOOLEAN) TO authenticated;
GRANT EXECUTE ON FUNCTION public.process_rent_payment(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.withdraw_funds(NUMERIC, TEXT, TEXT, TEXT) TO authenticated;
