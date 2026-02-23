/**
 * Edge Function: ai-agent-chat
 *
 * Chat IA pour l'agent immobilier — utilise Gemini API.
 * Modèle rapide  : gemini-2.5-flash — conversations courantes
 * Modèle avancé  : gemini-2.5-pro   — analyses stratégiques
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Token invalide' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, useAdvancedModel, contextData } = await req.json();

    if (!message?.trim()) {
      return new Response(JSON.stringify({ error: 'Message vide' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch conversation history (last 20 messages)
    const { data: history } = await supabaseAdmin
      .from('ai_conversations')
      .select('role, content')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    const conversationHistory = (history || []).reverse();

    // Fetch agent context if not provided
    let agentContext = contextData || {};
    if (!contextData) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const [visitsRes, profileRes] = await Promise.all([
        supabaseAdmin
          .from('visits')
          .select('lead_name, lead_phone, type, status, scheduled_at, lead_notes, ai_prospect_score')
          .eq('agent_id', user.id)
          .gte('scheduled_at', `${todayStr}T00:00:00`)
          .lte('scheduled_at', `${todayStr}T23:59:59`)
          .neq('status', 'cancelled')
          .order('scheduled_at'),
        supabaseAdmin
          .from('profiles')
          .select('full_name, subscription_plan')
          .eq('id', user.id)
          .single(),
      ]);

      agentContext = {
        agentName: profileRes.data?.full_name || 'Agent',
        plan: profileRes.data?.subscription_plan || 'free',
        todayVisits: visitsRes.data || [],
        currentTime: new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Conakry' }),
      };
    }

    const contextMessage = agentContext.todayVisits?.length > 0
      ? `\n\n[CONTEXTE AGENT - ${agentContext.currentTime}]\nAgent: ${agentContext.agentName} (plan ${agentContext.plan})\nVisites aujourd'hui: ${JSON.stringify(agentContext.todayVisits, null, 2)}`
      : `\n\n[CONTEXTE AGENT - ${agentContext.currentTime}]\nAgent: ${agentContext.agentName || 'Agent'}\nAucune visite programmée aujourd'hui.`;

    const isAdvanced = !!useAdvancedModel;
    const model = isAdvanced ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) {
      return new Response(JSON.stringify({ error: 'Clé API Gemini non configurée' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build contents for Gemini (role: user/model)
    const contents = [
      ...conversationHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    // Call Gemini API
    const geminiRes = await fetch(
      `${GEMINI_BASE}/${model}:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT + contextMessage }] },
          contents,
          generationConfig: { maxOutputTokens: 1024 },
        }),
      },
    );

    if (!geminiRes.ok) {
      const errBody = await geminiRes.text();
      throw new Error(`Gemini API error (${geminiRes.status}): ${errBody}`);
    }

    const geminiData = await geminiRes.json();
    const assistantMessage =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Je n\'ai pas pu générer une réponse.';
    const tokensUsed =
      (geminiData.usageMetadata?.promptTokenCount || 0) +
      (geminiData.usageMetadata?.candidatesTokenCount || 0);

    // Save to DB
    await supabaseAdmin.from('ai_conversations').insert([
      { agent_id: user.id, role: 'user', content: message, metadata: { model } },
      { agent_id: user.id, role: 'assistant', content: assistantMessage, metadata: { model, tokens_used: tokensUsed } },
    ]);

    // Track usage
    await supabaseAdmin.rpc('increment_ai_usage', {
      p_agent_id: user.id,
      p_is_advanced: isAdvanced,
      p_tokens: tokensUsed,
    });

    return new Response(
      JSON.stringify({ message: assistantMessage, model, tokensUsed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erreur interne';
    console.error('ai-agent-chat error:', error);
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
