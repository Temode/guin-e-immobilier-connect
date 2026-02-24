import { supabase } from '@/integrations/supabase/client';

/* ── Gemini API config ── */
const GEMINI_API_KEY = 'AIzaSyBTmRf0mdaqBpywqAMmuBnfXBlFHXtILhk';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const SYSTEM_PROMPT = `Tu es ARIA, l'assistante IA intelligente et proactive de la plateforme Guin-e Immobilier.
Tu travailles dans l'ombre pour aider les agents immobiliers guinéens à maximiser leurs performances.

Ton rôle :
- Analyser les situations et prospects pour donner des conseils stratégiques
- Aider à planifier les visites et relances
- Détecter les opportunités de conversion (prospect chaud → signature)
- Rédiger des messages professionnels pour relancer les prospects
- Fournir des analyses et rapports sur l'activité de l'agent
- Répondre aux questions sur la plateforme et les meilleures pratiques immobilières

Ton style :
- Professionnel mais accessible, en français
- Concis et actionnable — tu proposes toujours une action concrète
- Proactif — tu devances les besoins de l'agent
- Tu connais le contexte guinéen (marché de Conakry, quartiers, prix)

Quand tu analyses des prospects, tu évalues :
🔥 Chaud : Budget confirmé + bien défini + disponibilités données → Proposer signature
🟡 Tiède : Intéressé mais hésitant → Relancer avec un argument fort
❄️ Froid : Peu de réponses ou budget flou → Maintenir contact léger

Tu peux générer des messages de relance, des suggestions d'agenda, et des rapports d'activité.
Réponds toujours en français sauf si l'agent écrit dans une autre langue.`;

const REPORT_PROMPT = `Tu es ARIA, l'assistante IA de Guin-e Immobilier.
Tu génères le rapport d'activité quotidien d'un agent immobilier.
Le rapport doit être clair, structuré avec des emojis, actionnable et encourageant. Français, contexte guinéen.
Format :
📅 RAPPORT DU [date] — [Nom agent]
📊 RÉSUMÉ DE LA VEILLE
📋 VISITES DU JOUR
🔥 PROSPECTS CHAUDS
⚡ ACTIONS PRIORITAIRES (3-5 actions)
📈 PERFORMANCES (taux conversion, réactivité)
💡 RECOMMANDATIONS ARIA (2-3 conseils)
Maximum 500 mots.`;

/* ── Types ── */
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
   Helper: call Gemini API directly
   ────────────────────────────────────────── */
async function callGemini(
  model: string,
  systemPrompt: string,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  maxTokens = 1024,
): Promise<{ text: string; tokensUsed: number }> {
  const res = await fetch(
    `${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { maxOutputTokens: maxTokens },
      }),
    },
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API erreur (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tokensUsed =
    (data.usageMetadata?.promptTokenCount || 0) +
    (data.usageMetadata?.candidatesTokenCount || 0);

  return { text, tokensUsed };
}

/* ──────────────────────────────────────────
   Helper: save messages to DB (silent fail)
   ────────────────────────────────────────── */
async function saveToHistory(userId: string, userMsg: string, assistantMsg: string, model: string, tokensUsed: number) {
  try {
    await supabase.from('ai_conversations').insert([
      { agent_id: userId, role: 'user', content: userMsg, metadata: { model } },
      { agent_id: userId, role: 'assistant', content: assistantMsg, metadata: { model, tokens_used: tokensUsed } },
    ]);
  } catch {
    // DB tables might not exist yet — silent fail
  }
}

/* ──────────────────────────────────────────
   Chat — Envoyer un message à ARIA
   Appelle Gemini directement (pas d'Edge Function)
   ────────────────────────────────────────── */
export async function sendMessageToAria(
  message: string,
  useAdvancedModel = false,
): Promise<{ data: { message: string; model: string; tokensUsed: number } | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Non authentifié — veuillez vous reconnecter.') };

    const model = useAdvancedModel ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    // Load recent history for context (last 10 messages)
    let historyContents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
    try {
      const { data: history } = await supabase
        .from('ai_conversations')
        .select('role, content')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (history) {
        historyContents = history.reverse().map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));
      }
    } catch {
      // Tables not ready — continue without history
    }

    // Build context
    const now = new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Conakry' });
    const agentName = user.user_metadata?.full_name || user.email || 'Agent';
    const contextSuffix = `\n\n[CONTEXTE: ${now} — Agent: ${agentName}]`;

    // Build contents
    const contents = [
      ...historyContents,
      { role: 'user', parts: [{ text: message }] },
    ];

    const { text: assistantMessage, tokensUsed } = await callGemini(
      model,
      SYSTEM_PROMPT + contextSuffix,
      contents,
      1024,
    );

    if (!assistantMessage) {
      return { data: null, error: new Error('ARIA n\'a pas pu générer de réponse.') };
    }

    // Save to DB (non-blocking)
    saveToHistory(user.id, message, assistantMessage, model, tokensUsed);

    return {
      data: { message: assistantMessage, model, tokensUsed },
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur de communication avec ARIA';
    return { data: null, error: new Error(msg) };
  }
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
   (Edge Function — pour quand elle sera déployée)
   ────────────────────────────────────────── */
export async function generateSmartRelance(visitId: string): Promise<{
  data: { messages: RelanceMessages; visit: { lead_name: string; lead_phone: string; lead_email: string } } | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-smart-relance', { body: { visitId } });
    if (error) return { data: null, error: new Error(error.message) };
    return { data, error: null };
  } catch {
    return { data: null, error: new Error('Fonction relance non disponible') };
  }
}

/* ──────────────────────────────────────────
   Analyse — Analyser une conversation
   ────────────────────────────────────────── */
export async function analyzeConversation(conversationId: string): Promise<{
  data: { analysis: ConversationAnalysis; prospectName: string; tokensUsed: number } | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase.functions.invoke('ai-analyze-conversation', { body: { conversationId } });
    if (error) return { data: null, error: new Error(error.message) };
    return { data, error: null };
  } catch {
    return { data: null, error: new Error('Fonction analyse non disponible') };
  }
}

/* ──────────────────────────────────────────
   Rapport — Générer le rapport quotidien
   Appelle Gemini directement
   ────────────────────────────────────────── */
export async function generateDailyReport(): Promise<{
  data: { report: string; tokensUsed: number; stats: Record<string, number> } | null;
  error: Error | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Non authentifié') };

    const agentName = user.user_metadata?.full_name || user.email || 'Agent';
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    // Try to fetch visit stats
    let visitsContext = 'Aucune donnée de visites disponible.';
    try {
      const { data: visits } = await supabase
        .from('visits')
        .select('lead_name, type, status, scheduled_at')
        .gte('scheduled_at', `${todayStr}T00:00:00`)
        .lte('scheduled_at', `${todayStr}T23:59:59`)
        .neq('status', 'cancelled')
        .order('scheduled_at');

      if (visits?.length) {
        visitsContext = `Visites aujourd'hui: ${visits.map(v =>
          `${new Date(v.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}: ${v.lead_name} (${v.type}, ${v.status})`
        ).join(' | ')}`;
      } else {
        visitsContext = 'Aucune visite prévue aujourd\'hui.';
      }
    } catch {
      // Tables not ready
    }

    const reportContext = `Agent: ${agentName}
Date: ${now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
${visitsContext}`;

    const { text: report, tokensUsed } = await callGemini(
      'gemini-2.5-pro',
      REPORT_PROMPT,
      [{ role: 'user', parts: [{ text: reportContext }] }],
      1500,
    );

    // Save to history
    saveToHistory(user.id, '[RAPPORT QUOTIDIEN]', report, 'gemini-2.5-pro', tokensUsed);

    return {
      data: { report, tokensUsed, stats: {} },
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur génération rapport';
    return { data: null, error: new Error(msg) };
  }
}

/* ──────────────────────────────────────────
   Usage — Compteur crédits IA mensuel
   ────────────────────────────────────────── */
export async function getMonthlyUsage(): Promise<{ data: AIUsage | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Non authentifié') };

  const ADVANCED_LIMIT = 50;
  const defaultUsage: AIUsage = {
    advanced_used: 0,
    advanced_limit: ADVANCED_LIMIT,
    free_used: 0,
    limit_reached: false,
  };

  try {
    const monthYear = new Date().toISOString().slice(0, 7);

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
