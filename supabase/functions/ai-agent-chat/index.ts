/**
 * Edge Function: ai-agent-chat
 *
 * Chat IA pour l'agent immobilier — utilise Claude (Anthropic API).
 * L'IA a accès au contexte de l'agent : visites du jour, prospects,
 * statistiques, et peut analyser les situations et donner des conseils.
 *
 * Modèle : claude-haiku-4-5-20251001 (rapide, économique)
 * Escalade : claude-sonnet-4-5-20250929 pour les analyses stratégiques
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    // Verify caller is authenticated
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

    // Build context injection
    const contextMessage = agentContext.todayVisits?.length > 0
      ? `\n\n[CONTEXTE AGENT - ${agentContext.currentTime}]\nAgent: ${agentContext.agentName} (plan ${agentContext.plan})\nVisites aujourd'hui: ${JSON.stringify(agentContext.todayVisits, null, 2)}`
      : `\n\n[CONTEXTE AGENT - ${agentContext.currentTime}]\nAgent: ${agentContext.agentName || 'Agent'}\nAucune visite programmée aujourd'hui.`;

    // Select model based on request type
    const model = useAdvancedModel
      ? 'claude-sonnet-4-5-20250929'
      : 'claude-haiku-4-5-20251001';

    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicKey) {
      return new Response(JSON.stringify({ error: 'Clé API IA non configurée' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Build messages array for Claude
    const messages = [
      ...conversationHistory.map((m) => ({ role: m.role, content: m.content })),
      {
        role: 'user',
        content: message + (conversationHistory.length === 0 ? contextMessage : ''),
      },
    ];

    // Call Claude API
    const claudeRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        system: SYSTEM_PROMPT + contextMessage,
        messages,
      }),
    });

    if (!claudeRes.ok) {
      const errBody = await claudeRes.text();
      throw new Error(`Claude API error (${claudeRes.status}): ${errBody}`);
    }

    const claudeData = await claudeRes.json();
    const assistantMessage = claudeData.content?.[0]?.text || 'Je n\'ai pas pu générer une réponse.';
    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens || 0;

    // Save user message and assistant response to DB
    await supabaseAdmin.from('ai_conversations').insert([
      {
        agent_id: user.id,
        role: 'user',
        content: message,
        metadata: { model },
      },
      {
        agent_id: user.id,
        role: 'assistant',
        content: assistantMessage,
        metadata: { model, tokens_used: tokensUsed },
      },
    ]);

    return new Response(
      JSON.stringify({
        message: assistantMessage,
        model,
        tokensUsed,
      }),
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
