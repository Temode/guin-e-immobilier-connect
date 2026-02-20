-- Fix process_rent_payment: agent_commission_percent is on rentals, not properties
CREATE OR REPLACE FUNCTION public.process_rent_payment(p_rental_id uuid, p_payment_method text DEFAULT 'orange_money'::text, p_phone_number text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  -- agent_commission_percent is directly on rentals (not on properties)
  SELECT r.*
  INTO v_rental
  FROM public.rentals r
  WHERE r.id = p_rental_id AND r.tenant_id = auth.uid() AND r.status = 'active';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Location introuvable ou non active');
  END IF;

  v_agent_commission := COALESCE(v_rental.agent_commission_percent, 0);
  v_agent_amount := ROUND(v_rental.rent_amount * v_agent_commission / 100);
  v_owner_amount := v_rental.rent_amount - v_agent_amount;
  v_reference := upper(p_payment_method) || '-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6);
  v_is_success := (random() > 0.1);

  INSERT INTO public.transactions (
    rental_id, payer_id, receiver_id, amount, currency, payment_method, payment_reference,
    type, status, description, metadata
  ) VALUES (
    p_rental_id, v_rental.tenant_id, v_rental.owner_id,
    v_owner_amount, v_rental.currency, p_payment_method, v_reference,
    'rent_payment', CASE WHEN v_is_success THEN 'completed' ELSE 'failed' END,
    'Loyer - ' || to_char(now(), 'Month YYYY'),
    jsonb_build_object('sandbox', true, 'phone_number', p_phone_number, 'processed_at', now()::text,
      'full_rent', v_rental.rent_amount, 'agent_commission_pct', v_agent_commission)
  ) RETURNING id INTO v_tx_tenant_to_owner;

  IF v_rental.agent_id IS NOT NULL AND v_agent_amount > 0 AND v_is_success THEN
    INSERT INTO public.transactions (
      rental_id, payer_id, receiver_id, amount, currency, payment_method, payment_reference,
      type, status, description, metadata
    ) VALUES (
      p_rental_id, v_rental.tenant_id, v_rental.agent_id,
      v_agent_amount, v_rental.currency, p_payment_method, v_reference || '-COM',
      'commission', 'completed', 'Commission agent - ' || to_char(now(), 'Month YYYY'),
      jsonb_build_object('sandbox', true, 'parent_transaction', v_tx_tenant_to_owner)
    ) RETURNING id INTO v_tx_commission;
  END IF;

  IF v_is_success THEN
    INSERT INTO public.wallets (user_id, balance, currency)
    VALUES (v_rental.owner_id, v_owner_amount, v_rental.currency)
    ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + EXCLUDED.balance, updated_at = now();

    IF v_rental.agent_id IS NOT NULL AND v_agent_amount > 0 THEN
      INSERT INTO public.wallets (user_id, balance, currency)
      VALUES (v_rental.agent_id, v_agent_amount, v_rental.currency)
      ON CONFLICT (user_id) DO UPDATE SET balance = wallets.balance + EXCLUDED.balance, updated_at = now();
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
$function$;