/**
 * Edge Function: ai-daily-report
 * Rapport d'activité quotidien pour l'agent.
 * Utilise Gemini 2.5 Pro — analyse stratégique.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

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

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabaseUser = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const weekAgo = new Date(now); weekAgo.setDate(weekAgo.getDate() - 7);

    const [profileRes, todayVisitsRes, yesterdayVisitsRes, weekVisitsRes, hotProspectsRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('full_name, subscription_plan').eq('id', user.id).single(),
      supabaseAdmin.from('visits').select('lead_name, lead_phone, type, status, scheduled_at, address, ai_prospect_score, lead_notes, property:property_id(title, city, rent_amount)').eq('agent_id', user.id).gte('scheduled_at', `${todayStr}T00:00:00`).lte('scheduled_at', `${todayStr}T23:59:59`).neq('status', 'cancelled').order('scheduled_at'),
      supabaseAdmin.from('visits').select('lead_name, type, status, ai_prospect_score').eq('agent_id', user.id).gte('scheduled_at', `${yesterdayStr}T00:00:00`).lte('scheduled_at', `${yesterdayStr}T23:59:59`),
      supabaseAdmin.from('visits').select('status, type, relance_sent_at').eq('agent_id', user.id).gte('scheduled_at', weekAgo.toISOString()),
      supabaseAdmin.from('visits').select('lead_name, lead_phone, type, status, scheduled_at, ai_prospect_score').eq('agent_id', user.id).eq('ai_prospect_score', 'hot').in('status', ['confirmed', 'pending']).gte('scheduled_at', now.toISOString()).order('scheduled_at').limit(5),
    ]);

    const agentName = profileRes.data?.full_name || 'Agent';
    const todayVisits = todayVisitsRes.data || [];
    const yesterdayVisits = yesterdayVisitsRes.data || [];
    const weekVisits = weekVisitsRes.data || [];
    const hotProspects = hotProspectsRes.data || [];
    const weekCompleted = weekVisits.filter(v => v.status === 'completed').length;
    const weekSignatures = weekVisits.filter(v => v.type === 'signature' && v.status === 'completed').length;
    const weekRelanced = weekVisits.filter(v => v.relance_sent_at).length;
    const weekTotal = weekVisits.length;
    const conversionRate = weekTotal > 0 ? Math.round((weekSignatures / weekTotal) * 100) : 0;

    const reportContext = `Données agent "${agentName}" au ${now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} :

VISITES HIER: ${yesterdayVisits.length > 0 ? yesterdayVisits.map(v => `${v.lead_name} (${v.type}) → ${v.status}`).join(', ') : 'Aucune'}
VISITES AUJOURD'HUI: ${todayVisits.length > 0 ? todayVisits.map((v: any) => `${new Date(v.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}: ${v.lead_name} (${v.type}, ${v.status}) — ${v.property?.title || 'Bien'} à ${v.property?.city || v.address || 'Conakry'}`).join(' | ') : 'Aucune'}
STATS SEMAINE: ${weekTotal} visites, ${weekCompleted} terminées, ${weekSignatures} signatures, ${weekRelanced} relances, ${conversionRate}% conversion
PROSPECTS CHAUDS: ${hotProspects.length > 0 ? hotProspects.map(v => `🔥 ${v.lead_name} (${v.type})`).join(', ') : 'Aucun'}
EN ATTENTE: ${todayVisits.filter(v => v.status === 'pending').length} visite(s) à confirmer`;

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) return new Response(JSON.stringify({ error: 'Clé API Gemini non configurée' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const geminiRes = await fetch(`${GEMINI_BASE}/gemini-2.5-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: REPORT_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: reportContext }] }],
        generationConfig: { maxOutputTokens: 1500 },
      }),
    });

    if (!geminiRes.ok) throw new Error(`Gemini API error: ${geminiRes.status}`);
    const geminiData = await geminiRes.json();
    const report = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'Rapport non disponible.';
    const tokensUsed = (geminiData.usageMetadata?.promptTokenCount || 0) + (geminiData.usageMetadata?.candidatesTokenCount || 0);

    await supabaseAdmin.from('ai_conversations').insert([
      { agent_id: user.id, role: 'user', content: '[RAPPORT QUOTIDIEN]', metadata: { type: 'daily_report', date: todayStr } },
      { agent_id: user.id, role: 'assistant', content: report, metadata: { type: 'daily_report', model: 'gemini-2.5-pro', tokens_used: tokensUsed, date: todayStr } },
    ]);
    await supabaseAdmin.rpc('increment_ai_usage', { p_agent_id: user.id, p_is_advanced: true, p_tokens: tokensUsed });

    return new Response(JSON.stringify({ report, tokensUsed, stats: { weekTotal, weekCompleted, weekSignatures, conversionRate } }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('ai-daily-report error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur interne' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
