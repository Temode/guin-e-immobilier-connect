import { supabase } from '@/integrations/supabase/client';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  metadata?: {
    model?: string;
    tokens_used?: number;
  };
}

/**
 * Send a message to the ARIA AI assistant via the Edge Function.
 */
export async function sendMessageToAria(
  message: string,
  useAdvancedModel = false,
  contextData?: Record<string, unknown>,
): Promise<{ data: { message: string; model: string; tokensUsed: number } | null; error: Error | null }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { data: null, error: new Error('Non authentifié') };
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-agent-chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ message, useAdvancedModel, contextData }),
      },
    );

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: new Error(json.error || `Erreur ${res.status}`) };
    }

    return { data: json, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error('Erreur réseau') };
  }
}

/**
 * Load conversation history for the current agent.
 */
export async function loadChatHistory(limit = 40): Promise<{ data: ChatMessage[]; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], error: new Error('Non authentifié') };

  const { data, error } = await supabase
    .from('ai_conversations')
    .select('id, role, content, created_at, metadata')
    .eq('agent_id', user.id)
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error || !data) return { data: [], error };
  return { data: data as ChatMessage[], error: null };
}

/**
 * Clear conversation history for the current agent.
 */
export async function clearChatHistory(): Promise<{ error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: new Error('Non authentifié') };

  const { error } = await supabase
    .from('ai_conversations')
    .delete()
    .eq('agent_id', user.id);

  return { error };
}
