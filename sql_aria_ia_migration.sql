-- =============================================
-- MIGRATION ARIA IA : Tables + Fonctions
-- À exécuter dans le SQL Editor de Lovable/Supabase
-- =============================================

-- -----------------------------------------------
-- 1. Table : visits
-- Visites et rendez-vous programmés par l'agent
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,

  -- Prospect / client
  lead_name TEXT NOT NULL,
  lead_phone TEXT,
  lead_email TEXT,
  lead_notes TEXT,

  -- Type et statut
  type TEXT NOT NULL DEFAULT 'visit'
    CHECK (type IN ('visit', 'contre-visite', 'signature', 'etat-lieux')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),

  -- Planification
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  address TEXT,

  -- Suivi
  follow_up_required BOOLEAN DEFAULT false,
  relance_sent_at TIMESTAMP WITH TIME ZONE,
  agent_notes TEXT,

  -- IA
  ai_prospect_score TEXT DEFAULT 'unknown'
    CHECK (ai_prospect_score IN ('hot', 'warm', 'cold', 'unknown')),
  ai_suggested BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'visits' AND policyname = 'Agents can manage their own visits'
  ) THEN
    CREATE POLICY "Agents can manage their own visits"
      ON public.visits FOR ALL
      USING (auth.uid() = agent_id)
      WITH CHECK (auth.uid() = agent_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_visits_agent_id ON public.visits (agent_id);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled_at ON public.visits (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits (agent_id, status);

-- -----------------------------------------------
-- 2. Table : ai_conversations
-- Historique des conversations Agent <-> IA
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_conversations' AND policyname = 'Agents can manage their own AI conversations'
  ) THEN
    CREATE POLICY "Agents can manage their own AI conversations"
      ON public.ai_conversations FOR ALL
      USING (auth.uid() = agent_id)
      WITH CHECK (auth.uid() = agent_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_conversations_agent
  ON public.ai_conversations (agent_id, created_at DESC);

-- -----------------------------------------------
-- 3. Table : ai_monthly_usage
-- Suivi crédits IA avancée par agent/mois
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_monthly_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL,
  advanced_messages_count INTEGER NOT NULL DEFAULT 0,
  advanced_tokens_used INTEGER NOT NULL DEFAULT 0,
  free_messages_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (agent_id, month_year)
);

ALTER TABLE public.ai_monthly_usage ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'ai_monthly_usage' AND policyname = 'Agents can view their own AI usage'
  ) THEN
    CREATE POLICY "Agents can view their own AI usage"
      ON public.ai_monthly_usage FOR ALL
      USING (auth.uid() = agent_id)
      WITH CHECK (auth.uid() = agent_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_ai_monthly_usage_agent
  ON public.ai_monthly_usage (agent_id, month_year);

-- -----------------------------------------------
-- 4. Trigger updated_at
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'visits_updated_at') THEN
    CREATE TRIGGER visits_updated_at BEFORE UPDATE ON public.visits
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'ai_monthly_usage_updated_at') THEN
    CREATE TRIGGER ai_monthly_usage_updated_at BEFORE UPDATE ON public.ai_monthly_usage
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- -----------------------------------------------
-- 5. Fonction : increment_ai_usage
-- Compteur atomique crédits IA
-- -----------------------------------------------
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
  v_limit INTEGER := 50;
BEGIN
  v_month := to_char(now(), 'YYYY-MM');

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

  RETURN jsonb_build_object(
    'advanced_used', v_record.advanced_messages_count,
    'advanced_limit', v_limit,
    'free_used', v_record.free_messages_count,
    'limit_reached', v_record.advanced_messages_count >= v_limit
  );
END;
$$;

-- -----------------------------------------------
-- 6. Realtime
-- -----------------------------------------------
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
