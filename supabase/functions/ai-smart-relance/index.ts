/**
 * Edge Function: ai-smart-relance
 *
 * Génère un message de relance IA personnalisé pour un prospect.
 * Le message est prêt à être envoyé par WhatsApp, SMS ou email.
 * Met à jour le statut de relance dans la DB.
 *
 * Utilise Qwent (Qwen3-Plus) — rapide et gratuit.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const QWEN_API_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';

const RELANCE_PROMPT = `Tu es ARIA, assistante IA de la plateforme Guin-e Immobilier.
L'agent te demande de rédiger un message de relance professionnel pour un prospect.

Instructions :
- Ton chaleureux et professionnel, adapté au contexte guinéen
- Message court (2-3 phrases max pour WhatsApp, 4-5 pour email)
- Mentionne le bien visité et la prochaine étape
- Propose un créneau ou demande confirmation
- Ne sois pas insistant, sois courtois

Tu dois retourner un JSON strict avec ce format :
{
  "whatsapp": "Message court pour WhatsApp (2-3 phrases)",
  "email_subject": "Objet de l'email",
  "email_body": "Corps de l'email (4-5 phrases)",
  "sms": "Message SMS très court (1-2 phrases, max 160 caractères)"
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

    const { visitId } = await req.json();
    if (!visitId) {
      return new Response(JSON.stringify({ error: 'visitId requis' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Fetch visit details
    const { data: visit, error: vError } = await supabaseAdmin
      .from('visits')
      .select('*, property:property_id(title, type, city, rent_amount, address)')
      .eq('id', visitId)
      .eq('agent_id', user.id)
      .single();

    if (vError || !visit) {
      return new Response(JSON.stringify({ error: 'Visite non trouvée' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch agent profile
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user.id)
      .single();

    const agentName = profile?.full_name || 'Votre agent';

    // Build context for Qwen
    const visitContext = `
Informations de la visite :
- Prospect : ${visit.lead_name}
- Téléphone : ${visit.lead_phone || 'non renseigné'}
- Type : ${visit.type === 'visit' ? 'Visite' : visit.type === 'contre-visite' ? 'Contre-visite' : visit.type === 'signature' ? 'Signature' : 'État des lieux'}
- Statut actuel : ${visit.status === 'pending' ? 'En attente de confirmation' : visit.status}
- Date prévue : ${new Date(visit.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
- Bien : ${visit.property?.title || 'Non spécifié'} (${visit.property?.type || ''}) à ${visit.property?.city || visit.address || 'Conakry'}
- Loyer : ${visit.property?.rent_amount ? `${Number(visit.property.rent_amount).toLocaleString('fr-GN')} GNF/mois` : 'Non renseigné'}
- Notes prospect : ${visit.lead_notes || 'Aucune note'}
- Nom de l'agent : ${agentName}
- Dernière relance : ${visit.relance_sent_at ? new Date(visit.relance_sent_at).toLocaleDateString('fr-FR') : 'Jamais'}
`;

    const qwenApiKey = Deno.env.get('QWEN_API_KEY');
    if (!qwenApiKey) {
      return new Response(JSON.stringify({ error: 'Clé API IA non configurée' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Call Qwen API (Qwen3-Plus — free tier)
    const qwenRes = await fetch(QWEN_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${qwenApiKey}`,
      },
      body: JSON.stringify({
        model: 'qwen-plus',
        max_tokens: 512,
        messages: [
          { role: 'system', content: RELANCE_PROMPT },
          { role: 'user', content: visitContext },
        ],
      }),
    });

    if (!qwenRes.ok) {
      throw new Error(`Qwen API error: ${qwenRes.status}`);
    }

    const qwenData = await qwenRes.json();
    const rawText = qwenData.choices?.[0]?.message?.content || '{}';

    // Parse the JSON response
    let messages;
    try {
      messages = JSON.parse(rawText);
    } catch {
      messages = {
        whatsapp: `Bonjour ${visit.lead_name}, c'est ${agentName}. Je souhaitais confirmer notre rendez-vous. Êtes-vous toujours disponible ? Merci !`,
        email_subject: `Confirmation de votre visite - ${visit.property?.title || 'Bien immobilier'}`,
        email_body: `Bonjour ${visit.lead_name},\n\nJe me permets de revenir vers vous concernant notre rendez-vous.\nÊtes-vous toujours disponible ?\n\nCordialement,\n${agentName}`,
        sms: `${visit.lead_name}, confirmez-vous notre RDV ? ${agentName} - Guin-e Immobilier`,
      };
    }

    // Update relance status in DB
    await supabaseAdmin
      .from('visits')
      .update({
        relance_sent_at: new Date().toISOString(),
        follow_up_required: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', visitId);

    // Track usage (free model)
    const tokensUsed = (qwenData.usage?.prompt_tokens || 0) + (qwenData.usage?.completion_tokens || 0);
    await supabaseAdmin.rpc('increment_ai_usage', {
      p_agent_id: user.id,
      p_is_advanced: false,
      p_tokens: tokensUsed,
    });

    return new Response(
      JSON.stringify({
        messages,
        visit: {
          lead_name: visit.lead_name,
          lead_phone: visit.lead_phone,
          lead_email: visit.lead_email,
        },
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('ai-smart-relance error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
