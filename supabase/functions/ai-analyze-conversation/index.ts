/**
 * Edge Function: ai-analyze-conversation
 *
 * Analyse une conversation agent-locataire pour :
 * - Détecter le score prospect (chaud/tiède/froid)
 * - Suggérer la création d'une visite
 * - Identifier les besoins (budget, type bien, localisation)
 * - Recommander la prochaine action
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

const ANALYZE_PROMPT = `Tu es ARIA, l'IA d'analyse de la plateforme Guin-e Immobilier.
Tu analyses une conversation entre un agent immobilier et un prospect/locataire.

Ton analyse doit identifier :
1. Le score du prospect : "hot", "warm" ou "cold"
2. Si une visite devrait être créée dans l'agenda
3. Les besoins identifiés du prospect
4. La prochaine action recommandée

Retourne UNIQUEMENT un JSON strict avec ce format :
{
  "prospect_score": "hot" | "warm" | "cold",
  "score_reason": "Explication courte du score",
  "should_create_visit": true | false,
  "suggested_visit": {
    "type": "visit" | "contre-visite" | "signature",
    "lead_name": "Nom du prospect",
    "lead_phone": "Numéro si mentionné ou null",
    "lead_notes": "Résumé des besoins : budget, type, localisation",
    "suggested_date": "Date mentionnée dans la conversation ou null",
    "address": "Adresse mentionnée ou null"
  },
  "needs_identified": {
    "budget": "Budget mentionné ou null",
    "property_type": "Type de bien recherché ou null",
    "location": "Zone géographique souhaitée ou null",
    "family_size": "Nombre de personnes ou null",
    "special_requirements": "Parking, jardin, etc. ou null"
  },
  "next_action": "Recommandation d'action pour l'agent",
  "summary": "Résumé de l'analyse en 2-3 phrases"
}

Retourne UNIQUEMENT le JSON, pas de texte autour.`;

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

    const { conversationId } = await req.json();
    if (!conversationId) {
      return new Response(JSON.stringify({ error: 'conversationId requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Verify agent is a participant
    const { data: participant } = await supabaseAdmin
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id)
      .single();

    if (!participant) {
      return new Response(JSON.stringify({ error: 'Conversation non trouvée' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch conversation messages (last 50)
    const { data: messages, error: mError } = await supabaseAdmin
      .from('messages')
      .select('sender_id, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (mError || !messages || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'Aucun message dans cette conversation' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch participants to know who is who
    const { data: participants } = await supabaseAdmin
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId);

    const otherUserId = participants?.find(p => p.user_id !== user.id)?.user_id;

    // Fetch profiles
    const { data: agentProfile } = await supabaseAdmin
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();

    let prospectName = 'Prospect';
    if (otherUserId) {
      const { data: prospectProfile } = await supabaseAdmin
        .from('profiles')
        .select('full_name, phone')
        .eq('id', otherUserId)
        .single();
      prospectName = prospectProfile?.full_name || 'Prospect';
    }

    // Format conversation for analysis
    const conversationText = messages.map(m => {
      const role = m.sender_id === user.id ? `Agent (${agentProfile?.full_name || 'Agent'})` : `Prospect (${prospectName})`;
      return `[${new Date(m.created_at).toLocaleString('fr-FR')}] ${role}: ${m.content}`;
    }).join('\n');

    const qwenApiKey = Deno.env.get('QWEN_API_KEY');
    if (!qwenApiKey) {
      return new Response(JSON.stringify({ error: 'Clé API IA non configurée' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use Qwen3-Max for strategic analysis
    const qwenRes = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qwenApiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-max',
        max_tokens: 1024,
        messages: [
          { role: 'system', content: ANALYZE_PROMPT },
          {
            role: 'user',
            content: `Analyse cette conversation entre l'agent et le prospect :\n\n${conversationText}`,
          },
        ],
      }),
    });

    if (!qwenRes.ok) {
      throw new Error(`Qwen API error: ${qwenRes.status}`);
    }

    const qwenData = await qwenRes.json();
    const rawText = qwenData.choices?.[0]?.message?.content || '{}';
    const tokensUsed = (qwenData.usage?.prompt_tokens || 0) + (qwenData.usage?.completion_tokens || 0);

    let analysis;
    try {
      analysis = JSON.parse(rawText);
    } catch {
      analysis = {
        prospect_score: 'unknown',
        score_reason: 'Analyse non disponible',
        should_create_visit: false,
        suggested_visit: null,
        needs_identified: {},
        next_action: 'Relancer le prospect manuellement',
        summary: 'L\'analyse automatique n\'a pas pu être effectuée.',
      };
    }

    // Track usage (advanced model)
    await supabaseAdmin.rpc('increment_ai_usage', {
      p_agent_id: user.id,
      p_is_advanced: true,
      p_tokens: tokensUsed,
    });

    // Save analysis to AI conversations for history
    await supabaseAdmin.from('ai_conversations').insert([
      {
        agent_id: user.id,
        role: 'user',
        content: `[ANALYSE AUTO] Analyse de la conversation avec ${prospectName}`,
        metadata: { type: 'conversation_analysis', conversation_id: conversationId },
      },
      {
        agent_id: user.id,
        role: 'assistant',
        content: `📊 **Analyse de votre conversation avec ${prospectName}**\n\nScore prospect : ${analysis.prospect_score === 'hot' ? '🔥 Chaud' : analysis.prospect_score === 'warm' ? '🟡 Tiède' : '❄️ Froid'}\n${analysis.score_reason}\n\n**Résumé :** ${analysis.summary}\n\n**Action recommandée :** ${analysis.next_action}${analysis.should_create_visit ? '\n\n✅ Je recommande de créer une visite dans l\'agenda.' : ''}`,
        metadata: { type: 'conversation_analysis', model: 'qwen-max', tokens_used: tokensUsed },
      },
    ]);

    return new Response(
      JSON.stringify({ analysis, prospectName, tokensUsed }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('ai-analyze-conversation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
