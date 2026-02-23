/**
 * Edge Function: ai-daily-report
 *
 * Génère un rapport d'activité quotidien pour l'agent.
 * Peut être appelé manuellement ou via cron (8h chaque matin).
 *
 * Le rapport inclut :
 * - Visites de la veille et leur statut
 * - Visites du jour à venir
 * - Taux de conversion et de réactivité
 * - Recommandations personnalisées
 * - Prévisions de revenus
 *
 * Utilise Qwent (Qwen3-Max) — analyse stratégique avancée.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

const REPORT_PROMPT = `Tu es ARIA, l'assistante IA de Guin-e Immobilier.
Tu génères le rapport d'activité quotidien d'un agent immobilier.

Le rapport doit être :
- Clair et structuré avec des emojis pour la lisibilité
- Actionnable — chaque section propose une action concrète
- Encourageant — valorise les succès de l'agent
- Rédigé en français, adapté au contexte guinéen

Format du rapport :
📅 RAPPORT DU [date] — [Nom agent]

📊 RÉSUMÉ DE LA VEILLE
[Stats visites terminées, confirmées, annulées]

📋 VISITES DU JOUR
[Liste des visites avec heure, prospect, bien]

🔥 PROSPECTS CHAUDS
[Prospects à scorer 'hot' et actions à prendre]

⚡ ACTIONS PRIORITAIRES
[3-5 actions concrètes classées par priorité]

📈 PERFORMANCES
[Taux de conversion, réactivité, tendance]

💡 RECOMMANDATIONS ARIA
[2-3 conseils personnalisés basés sur les données]

Sois concis mais complet. Maximum 500 mots.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
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
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Calculate date ranges
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Fetch data in parallel
    const [profileRes, todayVisitsRes, yesterdayVisitsRes, weekVisitsRes, hotProspectsRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('full_name, subscription_plan').eq('id', user.id).single(),
      supabaseAdmin.from('visits')
        .select('lead_name, lead_phone, type, status, scheduled_at, address, ai_prospect_score, lead_notes, property:property_id(title, city, rent_amount)')
        .eq('agent_id', user.id).gte('scheduled_at', `${todayStr}T00:00:00`).lte('scheduled_at', `${todayStr}T23:59:59`)
        .neq('status', 'cancelled').order('scheduled_at'),
      supabaseAdmin.from('visits')
        .select('lead_name, type, status, ai_prospect_score')
        .eq('agent_id', user.id).gte('scheduled_at', `${yesterdayStr}T00:00:00`).lte('scheduled_at', `${yesterdayStr}T23:59:59`),
      supabaseAdmin.from('visits')
        .select('status, type, relance_sent_at')
        .eq('agent_id', user.id).gte('scheduled_at', weekAgo.toISOString()),
      supabaseAdmin.from('visits')
        .select('lead_name, lead_phone, type, status, scheduled_at, ai_prospect_score')
        .eq('agent_id', user.id).eq('ai_prospect_score', 'hot').in('status', ['confirmed', 'pending'])
        .gte('scheduled_at', now.toISOString()).order('scheduled_at').limit(5),
    ]);

    const agentName = profileRes.data?.full_name || 'Agent';
    const todayVisits = todayVisitsRes.data || [];
    const yesterdayVisits = yesterdayVisitsRes.data || [];
    const weekVisits = weekVisitsRes.data || [];
    const hotProspects = hotProspectsRes.data || [];

    // Calculate stats
    const weekCompleted = weekVisits.filter(v => v.status === 'completed').length;
    const weekSignatures = weekVisits.filter(v => v.type === 'signature' && v.status === 'completed').length;
    const weekRelanced = weekVisits.filter(v => v.relance_sent_at).length;
    const weekTotal = weekVisits.length;
    const conversionRate = weekTotal > 0 ? Math.round((weekSignatures / weekTotal) * 100) : 0;

    // Build context for Qwen
    const reportContext = `
Données de l'agent "${agentName}" au ${now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} :

VISITES HIER (${yesterdayStr}):
${yesterdayVisits.length > 0 ? yesterdayVisits.map(v => `- ${v.lead_name} (${v.type}) → ${v.status}`).join('\n') : 'Aucune visite hier'}

VISITES AUJOURD'HUI :
${todayVisits.length > 0 ? todayVisits.map(v => `- ${new Date(v.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} : ${v.lead_name} (${v.type}, ${v.status}) — ${v.property?.title || 'Bien non spécifié'} à ${v.property?.city || v.address || 'Conakry'}${v.lead_notes ? ` [Note: ${v.lead_notes}]` : ''}`).join('\n') : 'Aucune visite prévue aujourd\'hui'}

STATS SEMAINE (7 derniers jours):
- Total visites : ${weekTotal}
- Terminées : ${weekCompleted}
- Signatures : ${weekSignatures}
- Relances envoyées : ${weekRelanced}
- Taux de conversion : ${conversionRate}%

PROSPECTS CHAUDS :
${hotProspects.length > 0 ? hotProspects.map(v => `- 🔥 ${v.lead_name} (${v.type}, ${new Date(v.scheduled_at).toLocaleDateString('fr-FR')})`).join('\n') : 'Aucun prospect chaud identifié'}

VISITES EN ATTENTE :
${todayVisits.filter(v => v.status === 'pending').length} visite(s) en attente de confirmation aujourd'hui
`;

    const qwenApiKey = Deno.env.get('QWEN_API_KEY');
    if (!qwenApiKey) {
      return new Response(JSON.stringify({ error: 'Clé API IA non configurée' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use Qwen3-Max for the daily report (strategic analysis)
    const qwenRes = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qwenApiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-max',
        max_tokens: 1500,
        messages: [
          { role: 'system', content: REPORT_PROMPT },
          { role: 'user', content: reportContext },
        ],
      }),
    });

    if (!qwenRes.ok) {
      throw new Error(`Qwen API error: ${qwenRes.status}`);
    }

    const qwenData = await qwenRes.json();
    const report = qwenData.choices?.[0]?.message?.content || 'Rapport non disponible.';
    const tokensUsed = (qwenData.usage?.prompt_tokens || 0) + (qwenData.usage?.completion_tokens || 0);

    // Save report to AI conversations
    await supabaseAdmin.from('ai_conversations').insert([
      {
        agent_id: user.id,
        role: 'user',
        content: '[RAPPORT QUOTIDIEN] Génération du rapport du matin',
        metadata: { type: 'daily_report', date: todayStr },
      },
      {
        agent_id: user.id,
        role: 'assistant',
        content: report,
        metadata: { type: 'daily_report', model: 'qwen-max', tokens_used: tokensUsed, date: todayStr },
      },
    ]);

    // Track usage
    await supabaseAdmin.rpc('increment_ai_usage', {
      p_agent_id: user.id,
      p_is_advanced: true,
      p_tokens: tokensUsed,
    });

    return new Response(
      JSON.stringify({ report, tokensUsed, stats: { weekTotal, weekCompleted, weekSignatures, conversionRate } }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('ai-daily-report error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
