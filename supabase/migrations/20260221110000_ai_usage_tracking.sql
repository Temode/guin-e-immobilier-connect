-- =============================================
-- AI Usage Tracking + Extensions
-- =============================================

-- Table pour le suivi des crédits IA payante par agent/mois
CREATE TABLE IF NOT EXISTS public.ai_monthly_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- '2026-02'
  advanced_messages_count INTEGER NOT NULL DEFAULT 0,
  advanced_tokens_used INTEGER NOT NULL DEFAULT 0,
  free_messages_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (agent_id, month_year)
);

ALTER TABLE public.ai_monthly_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can view their own AI usage"
  ON public.ai_monthly_usage FOR ALL
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE INDEX IF NOT EXISTS idx_ai_monthly_usage_agent
  ON public.ai_monthly_usage (agent_id, month_year);

-- Trigger updated_at
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ai_monthly_usage_updated_at') THEN
    CREATE TRIGGER ai_monthly_usage_updated_at BEFORE UPDATE ON public.ai_monthly_usage
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Fonction atomique pour incrémenter l'usage IA
CREATE OR REPLACE FUNCTION increment_ai_usage(
  p_agent_id UUID,
  p_is_advanced BOOLEAN DEFAULT false,
  p_tokens INTEGER DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_month TEXT;
  v_record ai_monthly_usage%ROWTYPE;
  v_limit INTEGER := 50; -- Limite mensuelle messages avancés (plan free)
BEGIN
  v_month := to_char(now(), 'YYYY-MM');

  -- Upsert usage record
  INSERT INTO ai_monthly_usage (agent_id, month_year, advanced_messages_count, advanced_tokens_used, free_messages_count)
  VALUES (
    p_agent_id,
    v_month,
    CASE WHEN p_is_advanced THEN 1 ELSE 0 END,
    CASE WHEN p_is_advanced THEN p_tokens ELSE 0 END,
    CASE WHEN NOT p_is_advanced THEN 1 ELSE 0 END
  )
  ON CONFLICT (agent_id, month_year) DO UPDATE SET
    advanced_messages_count = ai_monthly_usage.advanced_messages_count + CASE WHEN p_is_advanced THEN 1 ELSE 0 END,
    advanced_tokens_used = ai_monthly_usage.advanced_tokens_used + CASE WHEN p_is_advanced THEN p_tokens ELSE 0 END,
    free_messages_count = ai_monthly_usage.free_messages_count + CASE WHEN NOT p_is_advanced THEN 1 ELSE 0 END,
    updated_at = now()
  RETURNING * INTO v_record;

  -- Vérifier si la limite est atteinte (pour le plan free)
  RETURN jsonb_build_object(
    'advanced_used', v_record.advanced_messages_count,
    'advanced_limit', v_limit,
    'free_used', v_record.free_messages_count,
    'limit_reached', v_record.advanced_messages_count >= v_limit
  );
END;
$$;
