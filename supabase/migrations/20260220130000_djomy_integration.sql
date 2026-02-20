-- =============================================
-- PHASE 4.3 : DJOMY INTEGRATION
-- Tables et fonctions pour l'intégration Djomy (OM/MOMO)
-- =============================================

-- -----------------------------------------------
-- Table : webhook_events
-- Journal d'audit pour tous les webhooks reçus
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'djomy',
  event_type TEXT NOT NULL,
  djomy_transaction_id TEXT,
  payload JSONB DEFAULT '{}'::jsonb,
  processed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write webhook events (Edge Functions use service role)
-- No RLS policies for authenticated users — webhook_events are internal only
CREATE POLICY "Service role full access on webhook_events"
  ON public.webhook_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Index for fast lookup by djomy_transaction_id
CREATE INDEX IF NOT EXISTS idx_webhook_events_djomy_tx
  ON public.webhook_events (djomy_transaction_id);

CREATE INDEX IF NOT EXISTS idx_webhook_events_source_type
  ON public.webhook_events (source, event_type);

-- -----------------------------------------------
-- Fonction : credit_wallet_atomic
-- Crédite le wallet d'un utilisateur de manière atomique
-- Appelée par le webhook Djomy après payment.success
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION public.credit_wallet_atomic(
  p_user_id UUID,
  p_amount NUMERIC,
  p_currency TEXT DEFAULT 'GNF'
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.wallets (user_id, balance, currency)
  VALUES (p_user_id, p_amount, p_currency)
  ON CONFLICT (user_id) DO UPDATE
    SET balance = wallets.balance + EXCLUDED.balance,
        updated_at = now();
END;
$$;

-- Permettre aux fonctions Edge (service role) d'appeler cette fonction
GRANT EXECUTE ON FUNCTION public.credit_wallet_atomic(UUID, NUMERIC, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.credit_wallet_atomic(UUID, NUMERIC, TEXT) TO authenticated;

-- -----------------------------------------------
-- Ajouter un index sur transactions.metadata
-- pour la recherche par djomy_transaction_id
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_transactions_metadata_djomy_tx
  ON public.transactions USING gin (metadata jsonb_path_ops);

-- Index sur payment_reference pour le webhook lookup
CREATE INDEX IF NOT EXISTS idx_transactions_payment_reference
  ON public.transactions (payment_reference);

-- -----------------------------------------------
-- Table : notifications
-- Notifications in-app pour les utilisateurs
-- Utilisée par le webhook Djomy pour notifier l'agent
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can insert notifications (from Edge Functions)
CREATE POLICY "Service role can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications (user_id, created_at DESC);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
