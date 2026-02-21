-- =============================================
-- Agenda & Visites + IA Chat Agent
-- =============================================

-- -----------------------------------------------
-- Table : visits
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
  lead_notes TEXT,          -- Budget, critères, nombre de personnes, etc.

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

CREATE POLICY "Agents can manage their own visits"
  ON public.visits FOR ALL
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE INDEX IF NOT EXISTS idx_visits_agent_id ON public.visits (agent_id);
CREATE INDEX IF NOT EXISTS idx_visits_scheduled_at ON public.visits (scheduled_at);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits (agent_id, status);

-- -----------------------------------------------
-- Table : ai_conversations
-- Historique des conversations Agent <-> IA
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,   -- tokens, model, context, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents can manage their own AI conversations"
  ON public.ai_conversations FOR ALL
  USING (auth.uid() = agent_id)
  WITH CHECK (auth.uid() = agent_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_agent
  ON public.ai_conversations (agent_id, created_at DESC);

-- Trigger pour updated_at sur visits
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

-- Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
