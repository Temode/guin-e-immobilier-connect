import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  metadata?: {
    model?: string;
    tokens_used?: number;
    type?: string;
  };
}

export interface AIUsage {
  advanced_used: number;
  advanced_limit: number;
  free_used: number;
  limit_reached: boolean;
}

export interface ConversationAnalysis {
  prospect_score: 'hot' | 'warm' | 'cold';
  score_reason: string;
  should_create_visit: boolean;
  suggested_visit: {
    type: string;
    lead_name: string;
    lead_phone: string | null;
    lead_notes: string;
    suggested_date: string | null;
    address: string | null;
  } | null;
  needs_identified: Record<string, string | null>;
  next_action: string;
  summary: string;
}

export interface RelanceMessages {
  whatsapp: string;
  email_subject: string;
  email_body: string;
  sms: string;
}

/* ──────────────────────────────────────────
   Helper: call an Edge Function with auth
   ────────────────────────────────────────── */
async function callEdgeFunction(
  functionName: string,
  body: Record<string, unknown>,
): Promise<{ data: any; error: Error | null }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { data: null, error: new Error('Non authentifié — veuillez vous reconnecter.') };

  try {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body,
    });

    if (error) {
      // FunctionsHttpError — the Edge Function returned a non-2xx status
      // FunctionsRelayError — relay/network issue
      // FunctionsFetchError — could not reach the server
      const msg = error.message || 'Erreur de la fonction IA';
      return { data: null, error: new Error(msg) };
    }

    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erreur réseau';
    return { data: null, error: new Error(message) };
  }
}

/* ──────────────────────────────────────────
   Chat — Envoyer un message à ARIA
   ────────────────────────────────────────── */
export async function sendMessageToAria(
  message: string,
  useAdvancedModel = false,
  contextData?: Record<string, unknown>,
): Promise<{ data: { message: string; model: string; tokensUsed: number } | null; error: Error | null }> {
  return callEdgeFunction('ai-agent-chat', { message, useAdvancedModel, contextData });
}

/* ──────────────────────────────────────────
   Chat — Historique des conversations
   ────────────────────────────────────────── */
export async function loadChatHistory(limit = 40): Promise<{ data: ChatMessage[]; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: new Error('Non authentifié') };

  try {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('id, role, content, created_at, metadata')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.warn('[ARIA] Table ai_conversations non disponible:', error.message);
      return { data: [], error: null };
    }
    return { data: (data || []) as ChatMessage[], error: null };
  } catch {
    return { data: [], error: null };
  }
}

/* ──────────────────────────────────────────
   Chat — Effacer l'historique
   ────────────────────────────────────────── */
export async function clearChatHistory(): Promise<{ error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Non authentifié') };

  try {
    const { error } = await supabase
      .from('ai_conversations')
      .delete()
      .eq('agent_id', user.id);

    if (error) console.warn('[ARIA] Erreur clearChatHistory:', error.message);
    return { error };
  } catch {
    return { error: null };
  }
}

/* ──────────────────────────────────────────
   Relance IA — Générer un message multi-canal
   ────────────────────────────────────────── */
export async function generateSmartRelance(visitId: string): Promise<{
  data: { messages: RelanceMessages; visit: { lead_name: string; lead_phone: string; lead_email: string } } | null;
  error: Error | null;
}> {
  return callEdgeFunction('ai-smart-relance', { visitId });
}

/* ──────────────────────────────────────────
   Analyse — Analyser une conversation agent-locataire
   ────────────────────────────────────────── */
export async function analyzeConversation(conversationId: string): Promise<{
  data: { analysis: ConversationAnalysis; prospectName: string; tokensUsed: number } | null;
  error: Error | null;
}> {
  return callEdgeFunction('ai-analyze-conversation', { conversationId });
}

/* ──────────────────────────────────────────
   Rapport — Générer le rapport quotidien
   ────────────────────────────────────────── */
export async function generateDailyReport(): Promise<{
  data: { report: string; tokensUsed: number; stats: Record<string, number> } | null;
  error: Error | null;
}> {
  return callEdgeFunction('ai-daily-report', {});
}

/* ──────────────────────────────────────────
   Usage — Compteur crédits IA mensuel
   ────────────────────────────────────────── */
export async function getMonthlyUsage(): Promise<{ data: AIUsage | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Non authentifié') };

  const ADVANCED_LIMIT = 50; // Limite plan free
  const defaultUsage: AIUsage = {
    advanced_used: 0,
    advanced_limit: ADVANCED_LIMIT,
    free_used: 0,
    limit_reached: false,
  };

  try {
    const monthYear = new Date().toISOString().slice(0, 7); // '2026-02'

    const { data, error } = await supabase
      .from('ai_monthly_usage')
      .select('advanced_messages_count, free_messages_count')
      .eq('agent_id', user.id)
      .eq('month_year', monthYear)
      .maybeSingle();

    if (error) {
      console.warn('[ARIA] Table ai_monthly_usage non disponible:', error.message);
      return { data: defaultUsage, error: null };
    }

    return {
      data: {
        advanced_used: data?.advanced_messages_count || 0,
        advanced_limit: ADVANCED_LIMIT,
        free_used: data?.free_messages_count || 0,
        limit_reached: (data?.advanced_messages_count || 0) >= ADVANCED_LIMIT,
      },
      error: null,
    };
  } catch {
    return { data: defaultUsage, error: null };
  }
}
