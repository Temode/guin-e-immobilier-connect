/**
 * Edge Function: ai-analyze-conversation
 * Analyse une conversation agent-locataire (prospect scoring, visite auto).
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

const ANALYZE_PROMPT = `Tu es ARIA, l'IA d'analyse de la plateforme Guin-e Immobilier.
Tu analyses une conversation entre un agent immobilier et un prospect/locataire.

Retourne UNIQUEMENT un JSON strict :
{
  "prospect_score": "hot" | "warm" | "cold",
  "score_reason": "Explication courte",
  "should_create_visit": true | false,
  "suggested_visit": { "type": "visit"|"contre-visite"|"signature", "lead_name": "Nom", "lead_phone": "Tel ou null", "lead_notes": "Résumé besoins", "suggested_date": "Date ou null", "address": "Adresse ou null" },
  "needs_identified": { "budget": "ou null", "property_type": "ou null", "location": "ou null", "family_size": "ou null", "special_requirements": "ou null" },
  "next_action": "Recommandation",
  "summary": "Résumé 2-3 phrases"
}
Retourne UNIQUEMENT le JSON.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return new Response(JSON.stringify({ error: 'Non authentifié' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabaseUser = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } });
    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) return new Response(JSON.stringify({ error: 'Token invalide' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { conversationId } = await req.json();
    if (!conversationId) return new Response(JSON.stringify({ error: 'conversationId requis' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const supabaseAdmin = getSupabaseAdmin();

    const { data: participant } = await supabaseAdmin.from('conversation_participants').select('user_id').eq('conversation_id', conversationId).eq('user_id', user.id).single();
    if (!participant) return new Response(JSON.stringify({ error: 'Conversation non trouvée' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: messages, error: mError } = await supabaseAdmin.from('messages').select('sender_id, content, created_at').eq('conversation_id', conversationId).order('created_at', { ascending: true }).limit(50);
    if (mError || !messages?.length) return new Response(JSON.stringify({ error: 'Aucun message' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const { data: participants } = await supabaseAdmin.from('conversation_participants').select('user_id').eq('conversation_id', conversationId);
    const otherUserId = participants?.find(p => p.user_id !== user.id)?.user_id;
    const { data: agentProfile } = await supabaseAdmin.from('profiles').select('full_name').eq('id', user.id).single();
    let prospectName = 'Prospect';
    if (otherUserId) {
      const { data: pp } = await supabaseAdmin.from('profiles').select('full_name').eq('id', otherUserId).single();
      prospectName = pp?.full_name || 'Prospect';
    }

    const conversationText = messages.map(m => {
      const role = m.sender_id === user.id ? `Agent (${agentProfile?.full_name || 'Agent'})` : `Prospect (${prospectName})`;
      return `[${new Date(m.created_at).toLocaleString('fr-FR')}] ${role}: ${m.content}`;
    }).join('\n');

    const geminiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiKey) return new Response(JSON.stringify({ error: 'Clé API Gemini non configurée' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const geminiRes = await fetch(`${GEMINI_BASE}/gemini-2.5-pro:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: ANALYZE_PROMPT }] },
        contents: [{ role: 'user', parts: [{ text: `Analyse cette conversation :\n\n${conversationText}` }] }],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    });

    if (!geminiRes.ok) throw new Error(`Gemini API error: ${geminiRes.status}`);
    const geminiData = await geminiRes.json();
    const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    const tokensUsed = (geminiData.usageMetadata?.promptTokenCount || 0) + (geminiData.usageMetadata?.candidatesTokenCount || 0);

    let analysis;
    try {
      const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { prospect_score: 'unknown', score_reason: 'Analyse non disponible', should_create_visit: false, suggested_visit: null, needs_identified: {}, next_action: 'Relancer manuellement', summary: 'Analyse auto impossible.' };
    }

    await supabaseAdmin.rpc('increment_ai_usage', { p_agent_id: user.id, p_is_advanced: true, p_tokens: tokensUsed });
    await supabaseAdmin.from('ai_conversations').insert([
      { agent_id: user.id, role: 'user', content: `[ANALYSE] Conversation avec ${prospectName}`, metadata: { type: 'conversation_analysis', conversation_id: conversationId } },
      { agent_id: user.id, role: 'assistant', content: `📊 **Analyse — ${prospectName}**\nScore: ${analysis.prospect_score === 'hot' ? '🔥 Chaud' : analysis.prospect_score === 'warm' ? '🟡 Tiède' : '❄️ Froid'}\n${analysis.score_reason}\n\n**Résumé:** ${analysis.summary}\n**Action:** ${analysis.next_action}${analysis.should_create_visit ? '\n✅ Visite recommandée.' : ''}`, metadata: { type: 'conversation_analysis', model: 'gemini-2.5-pro', tokens_used: tokensUsed } },
    ]);

    return new Response(JSON.stringify({ analysis, prospectName, tokensUsed }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('ai-analyze-conversation error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur interne' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
