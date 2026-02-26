/**
 * ARIA LangGraph Workflow — Orchestrateur IA
 *
 * Flux : Message → Classify → Route → Analyze/Chat → Score → Act → Respond
 *
 * Nœuds :
 *  1. classify    : Détecte le type de demande (chat, report, relance, analysis, scan)
 *  2. enrichContext : Injecte les données plateforme
 *  3. routeToAI   : Appelle Gemini Flash (léger) ou Claude Sonnet (avancé)
 *  4. scoreProspect : Calcul du score prospect si applicable
 *  5. executeAction : Crée visite, envoie relance, met à jour score
 *  6. formatResponse : Formate la réponse finale pour l'agent
 */

import { StateGraph, START, END } from '@/lib/langgraph';
import { supabase } from '@/integrations/supabase/client';

/* ── Gemini Flash config ── */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ── Claude Sonnet config ── */
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

/* ══════════════════════════════════════════
   Types du graphe
   ══════════════════════════════════════════ */

export type MessageIntent =
  | 'chat'            // Question/discussion simple
  | 'report'          // Rapport d'activité
  | 'relance'         // Rédiger une relance
  | 'analyze'         // Analyser un prospect/conversation
  | 'scan'            // Scanner les conversations
  | 'score'           // Évaluer un prospect
  | 'property'        // Question sur un bien
  | 'coaching';       // Conseil stratégique

export type AIModel = 'gemini-flash' | 'claude-sonnet' | 'claude-sonnet-thinking';

export interface ProspectScore {
  name: string;
  score: 'hot' | 'warm' | 'cold';
  reason: string;
  action: string;
  probability: number; // Probabilité de signature 0-100
}

export interface ActionResult {
  type: 'visit_created' | 'visit_updated' | 'relance_sent' | 'score_updated' | 'none';
  details: string;
}

export type AriaGraphState = {
  // Input
  userId: string;
  agentName: string;
  userMessage: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;

  // Classification
  intent: MessageIntent;
  requiresAdvancedAI: boolean;

  // Context (données plateforme)
  platformContext: string;
  prospects: ProspectScore[];
  hasRelevantData: boolean;

  // AI Response
  aiModel: AIModel;
  aiResponse: string;
  tokensUsed: number;

  // Scoring
  detectedProspects: ProspectScore[];

  // Actions
  actionsExecuted: ActionResult[];

  // Final
  finalResponse: string;
  error: string | null;
};

/* ══════════════════════════════════════════
   Helpers API
   ══════════════════════════════════════════ */

async function callGeminiFlash(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens = 1024,
): Promise<{ text: string; tokensUsed: number }> {
  if (!GEMINI_API_KEY) throw new Error('Clé API Gemini non configurée');

  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Compris. Je suis ARIA, prête à aider.' }] },
    ...messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents, generationConfig: { maxOutputTokens: maxTokens, temperature: 0.7 } }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini Flash (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  return {
    text: data.candidates?.[0]?.content?.parts?.[0]?.text || '',
    tokensUsed: (data.usageMetadata?.promptTokenCount || 0) + (data.usageMetadata?.candidatesTokenCount || 0),
  };
}

async function callClaude(
  systemPrompt: string,
  messages: Array<{ role: string; content: string }>,
  maxTokens = 1024,
  useThinking = false,
): Promise<{ text: string; tokensUsed: number }> {
  if (!CLAUDE_API_KEY) throw new Error('Clé API Claude non configurée');

  const body: Record<string, unknown> = {
    model: CLAUDE_MODEL,
    max_tokens: useThinking ? maxTokens + 10000 : maxTokens,
    system: systemPrompt,
    messages: messages.map(m => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: m.content })),
  };

  if (useThinking) {
    body.thinking = { type: 'enabled', budget_tokens: 10000 };
  }

  const res = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Claude Sonnet (${res.status}): ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  let text = '';
  if (Array.isArray(data.content)) {
    for (const block of data.content) {
      if (block.type === 'text') text += block.text;
    }
  }

  return {
    text,
    tokensUsed: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
  };
}

/* ══════════════════════════════════════════
   System Prompts
   ══════════════════════════════════════════ */

const CLASSIFIER_PROMPT = `Tu es un classificateur de messages pour ARIA, l'IA immobilière.
Analyse le message de l'agent et retourne UNIQUEMENT un JSON (sans backticks) :
{"intent":"chat|report|relance|analyze|scan|score|property|coaching","requires_advanced":true|false,"detected_prospect_names":["nom1","nom2"]}

Règles de classification :
- "report" : demande de rapport, bilan, stats, résumé
- "relance" : rédiger un message de relance pour un prospect
- "analyze" : analyser une conversation, un prospect, évaluer
- "scan" : scanner toutes les conversations, vérifier les prospects
- "score" : évaluer/identifier prospects chauds, tièdes, froids
- "property" : question sur un bien, prix, disponibilité
- "coaching" : conseil de vente, technique de négociation, closing
- "chat" : tout le reste

requires_advanced = true si : analyse stratégique, scoring, rapport, coaching personnalisé, relance complexe
requires_advanced = false si : question simple, chat, info basique, relance standard`;

const SCORING_PROMPT = `Tu es le moteur de scoring de prospects d'ARIA.
Analyse les données prospect fournies et retourne UNIQUEMENT un JSON (sans backticks) :
[{"name":"Nom","score":"hot|warm|cold","reason":"Raison courte","action":"Action recommandée","probability":75}]

Critères de scoring :
- HOT (probability 70-100) : Budget confirmé, critères précis, réponses rapides, contre-visite faite
- WARM (probability 30-69) : Intéressé mais hésite, budget approximatif, délai de réponse 24-72h
- COLD (probability 0-29) : Peu de réponses, budget flou, pas de critères précis

probability = estimation % de la probabilité de signature dans les 30 prochains jours`;

/* ══════════════════════════════════════════
   Nœuds du graphe
   ══════════════════════════════════════════ */

/** 1. Classifier le message de l'agent */
async function classifyMessage(state: AriaGraphState): Promise<Partial<AriaGraphState>> {
  try {
    const { text } = await callGeminiFlash(
      CLASSIFIER_PROMPT,
      [{ role: 'user', content: state.userMessage }],
      256,
    );

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return {
      intent: parsed.intent || 'chat',
      requiresAdvancedAI: parsed.requires_advanced || false,
    };
  } catch {
    // Fallback : classification heuristique par mots-clés
    const msg = state.userMessage.toLowerCase();
    let intent: MessageIntent = 'chat';
    let requiresAdvancedAI = false;

    if (/rapport|bilan|stats|résumé|performance/.test(msg)) {
      intent = 'report';
      requiresAdvancedAI = true;
    } else if (/relance|relancer|message.*prospect/.test(msg)) {
      intent = 'relance';
    } else if (/analyse|analyser|conversation/.test(msg)) {
      intent = 'analyze';
      requiresAdvancedAI = true;
    } else if (/scan|scanner|vérifier/.test(msg)) {
      intent = 'scan';
      requiresAdvancedAI = true;
    } else if (/prospect.*chaud|score|scoring|identifier|prioris/.test(msg)) {
      intent = 'score';
      requiresAdvancedAI = true;
    } else if (/bien|propriété|appartement|villa|prix|loyer/.test(msg)) {
      intent = 'property';
    } else if (/conseil|technique|négoci|closing|convert/.test(msg)) {
      intent = 'coaching';
      requiresAdvancedAI = true;
    }

    return { intent, requiresAdvancedAI };
  }
}

/** 2. Enrichir le contexte avec les données plateforme */
async function enrichContext(state: AriaGraphState): Promise<Partial<AriaGraphState>> {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const parts: string[] = [];
  const prospects: ProspectScore[] = [];

  parts.push(`[CONTEXTE: ${now.toLocaleString('fr-FR', { timeZone: 'Africa/Conakry' })} — Agent: ${state.agentName}]`);

  // ── Visites du jour ──
  try {
    const { data: visits } = await supabase
      .from('visits')
      .select('lead_name, lead_phone, lead_notes, type, status, scheduled_at, address, ai_prospect_score, property:property_id(title, city)')
      .gte('scheduled_at', `${todayStr}T00:00:00`)
      .lte('scheduled_at', `${todayStr}T23:59:59`)
      .neq('status', 'cancelled')
      .order('scheduled_at');

    if (visits?.length) {
      parts.push(`[AGENDA DU JOUR: ${visits.map(v =>
        `${new Date(v.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ${v.lead_name} (${v.type}, ${v.status}${v.ai_prospect_score !== 'unknown' ? `, score:${v.ai_prospect_score}` : ''}) — ${v.property?.title || v.address || 'Lieu non précisé'}${v.lead_notes ? ` — Notes: ${v.lead_notes}` : ''}`
      ).join(' | ')}]`);
    } else {
      parts.push('[AGENDA DU JOUR: Aucune visite prévue]');
    }
  } catch { /* Tables not ready */ }

  // ── Tous les prospects à venir ──
  try {
    const in30days = new Date(now);
    in30days.setDate(in30days.getDate() + 30);

    const { data: allVisits } = await supabase
      .from('visits')
      .select('lead_name, lead_phone, lead_email, lead_notes, type, status, scheduled_at, ai_prospect_score, follow_up_required, relance_sent_at, property:property_id(title, city, type, price)')
      .gte('scheduled_at', now.toISOString())
      .lte('scheduled_at', in30days.toISOString())
      .neq('status', 'cancelled')
      .order('scheduled_at');

    if (allVisits?.length) {
      const hot = allVisits.filter(v => v.ai_prospect_score === 'hot');
      const warm = allVisits.filter(v => v.ai_prospect_score === 'warm');
      const cold = allVisits.filter(v => v.ai_prospect_score === 'cold');
      const needsRelance = allVisits.filter(v => v.follow_up_required && !v.relance_sent_at);

      parts.push(`[PROSPECTS — ${allVisits.length} visite(s) à venir :`);
      if (hot.length) parts.push(`  🔥 CHAUDS (${hot.length}): ${hot.map(v => `${v.lead_name} (${v.type}, ${new Date(v.scheduled_at).toLocaleDateString('fr-FR')})${v.lead_phone ? ` tel:${v.lead_phone}` : ''}${v.lead_notes ? ` — ${v.lead_notes}` : ''}${v.property ? ` — Bien: ${v.property.title} ${v.property.city} ${v.property.price?.toLocaleString('fr-FR')} GNF` : ''}`).join(' | ')}`);
      if (warm.length) parts.push(`  🟡 TIÈDES (${warm.length}): ${warm.map(v => `${v.lead_name} (${v.type}, ${new Date(v.scheduled_at).toLocaleDateString('fr-FR')})${v.lead_notes ? ` — ${v.lead_notes}` : ''}${v.property ? ` — Bien: ${v.property.title} ${v.property.city}` : ''}`).join(' | ')}`);
      if (cold.length) parts.push(`  ❄️ FROIDS (${cold.length}): ${cold.map(v => `${v.lead_name} (${v.type})`).join(', ')}`);
      if (needsRelance.length) parts.push(`  📩 À RELANCER (${needsRelance.length}): ${needsRelance.map(v => v.lead_name).join(', ')}`);
      parts.push(']');

      // Convertir en ProspectScore pour le scoring
      for (const v of allVisits) {
        if (v.ai_prospect_score && v.ai_prospect_score !== 'unknown') {
          prospects.push({
            name: v.lead_name,
            score: v.ai_prospect_score as 'hot' | 'warm' | 'cold',
            reason: v.lead_notes || '',
            action: v.follow_up_required ? 'Relancer' : 'Suivre',
            probability: v.ai_prospect_score === 'hot' ? 80 : v.ai_prospect_score === 'warm' ? 45 : 15,
          });
        }
      }
    }
  } catch { /* Tables not ready */ }

  // ── Conversations récentes ──
  try {
    const { data: participations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', state.userId);

    if (participations?.length) {
      const conversationSummaries: string[] = [];
      for (const { conversation_id: convId } of participations.slice(0, 8)) {
        const { data: otherParticipants } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', convId)
          .neq('user_id', state.userId);

        let otherName = 'Inconnu';
        if (otherParticipants?.[0]?.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', otherParticipants[0].user_id)
            .single();
          otherName = profile?.full_name || 'Inconnu';
        }

        const { data: msgs } = await supabase
          .from('messages')
          .select('sender_id, content, created_at')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: false })
          .limit(6);

        if (msgs?.length) {
          const formatted = msgs.reverse().map(m => {
            const who = m.sender_id === state.userId ? 'Agent' : otherName;
            return `[${new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}] ${who}: ${m.content.slice(0, 200)}`;
          }).join('\n    ');
          conversationSummaries.push(`  💬 ${otherName}:\n    ${formatted}`);
        }
      }

      if (conversationSummaries.length) {
        parts.push(`[CONVERSATIONS RÉCENTES (${conversationSummaries.length}):\n${conversationSummaries.join('\n')}\n]`);
      }
    }
  } catch { /* Tables not ready */ }

  // ── Biens de l'agent ──
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('title, type, transaction_type, price, currency, city, commune, quartier, bedrooms, bathrooms, area, furnished, status, amenities')
      .eq('owner_id', state.userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (properties?.length) {
      parts.push(`[BIENS DE L'AGENT (${properties.length}):\n${properties.map(p =>
        `  🏠 ${p.title} — ${p.type} ${p.transaction_type === 'rent' ? 'Location' : 'Vente'} — ${p.price?.toLocaleString('fr-FR')} ${p.currency || 'GNF'} — ${p.city}${p.commune ? `/${p.commune}` : ''}${p.quartier ? `/${p.quartier}` : ''} — ${p.bedrooms || '?'}ch/${p.bathrooms || '?'}sdb${p.area ? `/${p.area}m²` : ''} — ${p.furnished ? 'Meublé' : 'Non meublé'} — Statut: ${p.status}`
      ).join('\n')}\n]`);
    }
  } catch { /* Tables not ready */ }

  // ── Locations actives ──
  try {
    const { data: rentals } = await supabase
      .from('rentals')
      .select('rent_amount, currency, start_date, status, payment_method, property:property_id(title, city), tenant:tenant_id(full_name)')
      .or(`owner_id.eq.${state.userId},agent_id.eq.${state.userId}`)
      .eq('status', 'active')
      .limit(10);

    if (rentals?.length) {
      parts.push(`[LOCATIONS ACTIVES (${rentals.length}):\n${rentals.map(r =>
        `  🔑 ${(r.property as any)?.title || 'Bien'} — Locataire: ${(r.tenant as any)?.full_name || '?'} — ${r.rent_amount?.toLocaleString('fr-FR')} ${r.currency || 'GNF'}/mois — Paiement: ${r.payment_method || 'non défini'}`
      ).join('\n')}\n]`);
    }
  } catch { /* Tables not ready */ }

  // ── Alertes ──
  try {
    const { data: pending } = await supabase
      .from('visits')
      .select('id')
      .eq('status', 'pending')
      .gte('scheduled_at', now.toISOString());

    const { data: unread } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', state.userId)
      .eq('read', false);

    const alerts: string[] = [];
    if (pending?.length) alerts.push(`${pending.length} visite(s) en attente`);
    if (unread?.length) alerts.push(`${unread.length} notification(s) non lue(s)`);
    if (alerts.length) parts.push(`[ALERTES: ${alerts.join(' | ')}]`);
  } catch { /* Tables not ready */ }

  return {
    platformContext: parts.join('\n'),
    prospects,
    hasRelevantData: parts.length > 1,
  };
}

/** 3. Appeler l'IA appropriée */
async function routeToAI(state: AriaGraphState): Promise<Partial<AriaGraphState>> {
  const SYSTEM_PROMPT = `Tu es ARIA, l'assistante IA de Guin-e Immobilier Connect.
Tu es experte du marché immobilier guinéen (Conakry). Tu tutoies l'agent.
Tu as accès aux données de la plateforme ci-dessous.
Réponds en français, sois directe et orientée action.
Termine TOUJOURS par une ACTION CONCRÈTE.
Maximum 300 mots sauf pour les rapports.

${state.platformContext}`;

  const messages = [
    ...state.conversationHistory,
    { role: 'user', content: state.userMessage },
  ];

  let aiModel: AIModel;
  let text: string;
  let tokensUsed: number;

  if (state.requiresAdvancedAI) {
    // Claude Sonnet (avec thinking si analyse/rapport)
    const useThinking = ['analyze', 'report', 'scan', 'score'].includes(state.intent);
    try {
      const result = await callClaude(SYSTEM_PROMPT, messages, 1500, useThinking);
      text = result.text;
      tokensUsed = result.tokensUsed;
      aiModel = useThinking ? 'claude-sonnet-thinking' : 'claude-sonnet';
    } catch (err) {
      // Fallback Gemini
      console.warn('[ARIA Graph] Claude failed, fallback Gemini:', err);
      const result = await callGeminiFlash(SYSTEM_PROMPT, messages, 1500);
      text = result.text;
      tokensUsed = result.tokensUsed;
      aiModel = 'gemini-flash';
    }
  } else {
    // Gemini Flash
    try {
      const result = await callGeminiFlash(SYSTEM_PROMPT, messages, 1024);
      text = result.text;
      tokensUsed = result.tokensUsed;
      aiModel = 'gemini-flash';
    } catch (err) {
      // Fallback Claude
      console.warn('[ARIA Graph] Gemini failed, fallback Claude:', err);
      const result = await callClaude(SYSTEM_PROMPT, messages, 1024, false);
      text = result.text;
      tokensUsed = result.tokensUsed;
      aiModel = 'claude-sonnet';
    }
  }

  return { aiModel, aiResponse: text, tokensUsed };
}

/** 4. Scorer les prospects (si applicable) */
async function scoreProspects(state: AriaGraphState): Promise<Partial<AriaGraphState>> {
  if (!['score', 'analyze', 'scan'].includes(state.intent)) {
    return { detectedProspects: state.prospects };
  }

  // Utiliser Claude pour un scoring précis
  const prospectsText = state.prospects.length > 0
    ? state.prospects.map(p => `- ${p.name}: score actuel=${p.score}, notes="${p.reason}"`).join('\n')
    : 'Aucun prospect scoré actuellement.';

  try {
    const { text } = await callClaude(
      SCORING_PROMPT,
      [{ role: 'user', content: `Données prospects à scorer :\n${prospectsText}\n\nContexte conversations :\n${state.platformContext}` }],
      512,
      false,
    );

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const scored = JSON.parse(cleaned) as ProspectScore[];
    return { detectedProspects: scored };
  } catch {
    return { detectedProspects: state.prospects };
  }
}

/** 5. Exécuter des actions automatiques */
async function executeActions(state: AriaGraphState): Promise<Partial<AriaGraphState>> {
  const actions: ActionResult[] = [];

  // Mettre à jour les scores des prospects dans la DB
  if (state.detectedProspects.length > 0 && ['score', 'scan'].includes(state.intent)) {
    for (const prospect of state.detectedProspects) {
      try {
        const { data: visits } = await supabase
          .from('visits')
          .select('id')
          .ilike('lead_name', `%${prospect.name}%`)
          .in('status', ['confirmed', 'pending'])
          .gte('scheduled_at', new Date().toISOString());

        if (visits?.length) {
          for (const v of visits) {
            await supabase.from('visits').update({
              ai_prospect_score: prospect.score,
              updated_at: new Date().toISOString(),
            }).eq('id', v.id);
          }
          actions.push({
            type: 'score_updated',
            details: `Score de ${prospect.name} mis à jour → ${prospect.score} (${prospect.probability}%)`,
          });
        }
      } catch { /* silent */ }
    }
  }

  if (actions.length === 0) {
    actions.push({ type: 'none', details: '' });
  }

  return { actionsExecuted: actions };
}

/** 6. Formater la réponse finale */
async function formatResponse(state: AriaGraphState): Promise<Partial<AriaGraphState>> {
  let response = state.aiResponse;

  // Ajouter un résumé des actions exécutées
  const realActions = state.actionsExecuted.filter(a => a.type !== 'none');
  if (realActions.length > 0) {
    response += '\n\n---\n📋 **Actions effectuées automatiquement :**\n';
    response += realActions.map(a => `• ${a.details}`).join('\n');
  }

  // Ajouter les scores détectés si pertinent
  if (state.detectedProspects.length > 0 && ['score', 'scan'].includes(state.intent)) {
    const hasNewScores = state.detectedProspects.some(p => p.probability > 0);
    if (hasNewScores) {
      response += '\n\n📊 **Probabilités de signature :**\n';
      response += state.detectedProspects
        .sort((a, b) => b.probability - a.probability)
        .map(p => `• ${p.score === 'hot' ? '🔥' : p.score === 'warm' ? '🟡' : '❄️'} ${p.name}: ${p.probability}% — ${p.action}`)
        .join('\n');
    }
  }

  return { finalResponse: response };
}

/* ══════════════════════════════════════════
   Construction du graphe
   ══════════════════════════════════════════ */

function shouldScore(state: AriaGraphState): string {
  return ['score', 'analyze', 'scan'].includes(state.intent) ? 'scoreProspects' : 'executeActions';
}

function shouldExecute(state: AriaGraphState): string {
  return ['score', 'scan', 'analyze'].includes(state.intent) ? 'executeActions' : 'formatResponse';
}

export function buildAriaGraph() {
  const graph = new StateGraph<AriaGraphState>()
    .addNode('classify', classifyMessage)
    .addNode('enrichContext', enrichContext)
    .addNode('routeToAI', routeToAI)
    .addNode('scoreProspects', scoreProspects)
    .addNode('executeActions', executeActions)
    .addNode('formatResponse', formatResponse)

    // Flux : START → classify → enrichContext → routeToAI → (score?) → (execute?) → format → END
    .addEdge(START, 'classify')
    .addEdge('classify', 'enrichContext')
    .addEdge('enrichContext', 'routeToAI')
    .addConditionalEdge('routeToAI', shouldScore, {
      scoreProspects: 'scoreProspects',
      executeActions: 'executeActions',
    })
    .addConditionalEdge('scoreProspects', shouldExecute, {
      executeActions: 'executeActions',
      formatResponse: 'formatResponse',
    })
    .addEdge('executeActions', 'formatResponse')
    .addEdge('formatResponse', END);

  return graph.compile();
}

/* ══════════════════════════════════════════
   API publique — Exécuter le workflow
   ══════════════════════════════════════════ */

const ariaWorkflow = buildAriaGraph();

export async function runAriaWorkflow(
  userId: string,
  agentName: string,
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  onStep?: (step: string, state: AriaGraphState) => void,
): Promise<{
  response: string;
  model: AIModel;
  tokensUsed: number;
  intent: MessageIntent;
  prospects: ProspectScore[];
  actions: ActionResult[];
}> {
  const initialState: AriaGraphState = {
    userId,
    agentName,
    userMessage,
    conversationHistory,
    intent: 'chat',
    requiresAdvancedAI: false,
    platformContext: '',
    prospects: [],
    hasRelevantData: false,
    aiModel: 'gemini-flash',
    aiResponse: '',
    tokensUsed: 0,
    detectedProspects: [],
    actionsExecuted: [],
    finalResponse: '',
    error: null,
  };

  const finalState = onStep
    ? await ariaWorkflow.stream(initialState, onStep)
    : await ariaWorkflow.invoke(initialState);

  return {
    response: finalState.finalResponse || finalState.aiResponse,
    model: finalState.aiModel,
    tokensUsed: finalState.tokensUsed,
    intent: finalState.intent,
    prospects: finalState.detectedProspects,
    actions: finalState.actionsExecuted.filter(a => a.type !== 'none'),
  };
}
