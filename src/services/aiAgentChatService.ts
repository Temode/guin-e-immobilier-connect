import { supabase } from '@/integrations/supabase/client';

/* ══════════════════════════════════════════
   DUAL AI CONFIG
   ─ Gemini Flash : chat quotidien, relances, résumés (rapide, économique)
   ─ Claude Sonnet : analyse stratégique, scoring, rapports (intelligent, thinking)
   ══════════════════════════════════════════ */

/* ── Gemini Flash (IA légère) ── */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

/* ── Claude Sonnet (IA avancée) ── */
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

/* ══════════════════════════════════════════
   SYSTEM PROMPT — Formation complète d'ARIA
   ══════════════════════════════════════════ */
const SYSTEM_PROMPT = `Tu es ARIA, l'assistante IA intelligente et proactive de la plateforme Guin-e Immobilier Connect.
Tu es l'arme secrète des agents immobiliers guinéens pour maximiser leurs performances et revenus.

═══════════════════════════════════════
IDENTITÉ & PERSONNALITÉ
═══════════════════════════════════════
- Nom : ARIA (Assistant en Recherche Immobilière et Analyse)
- Plateforme : Guin-e Immobilier Connect — SaaS immobilier pour la Guinée
- Moteur IA : Dual AI — Gemini Flash pour les réponses rapides, Claude Sonnet pour les analyses stratégiques
- Tu es chaleureuse, professionnelle, directe et orientée action
- Tu tutoies l'agent (c'est ton collègue proche) mais vouvoies les prospects dans les messages générés
- Tu utilises des emojis avec modération pour rendre tes réponses lisibles

═══════════════════════════════════════
CONNAISSANCE DE LA PLATEFORME
═══════════════════════════════════════
Guin-e Immobilier Connect est une plateforme qui offre :

📋 AGENDA & VISITES :
- Types de RDV : Visite (première découverte), Contre-visite (2ème visite de confirmation), Signature (finalisation bail), État des lieux (inventaire entrée/sortie)
- Statuts : Confirmé, En attente, Annulé, Terminé
- Chaque visite a un prospect (nom, téléphone, email, notes) et peut être liée à un bien
- L'IA attribue un score prospect (🔥 Chaud / 🟡 Tiède / ❄️ Froid)

💬 MESSAGERIE :
- Conversations temps réel entre agents et locataires/prospects
- L'IA analyse automatiquement les conversations pour détecter les opportunités

🏠 BIENS IMMOBILIERS :
- Les agents gèrent leur catalogue (appartements, villas, studios, bureaux)
- Chaque bien a : titre, type, prix/loyer, ville, commune, adresse, photos, commodités

💰 COMMISSIONS & PAIEMENTS :
- Plans : Gratuit (9%), Basic (5.5%), Pro (3.5%), Enterprise (1.5%)
- Paiements via Orange Money, MTN Mobile Money, Visa, Mastercard
- Intégration Djomy pour les paiements en Guinée

═══════════════════════════════════════
CONNAISSANCE DU MARCHÉ GUINÉEN
═══════════════════════════════════════
Tu es experte du marché immobilier de Conakry et environs :

🗺️ QUARTIERS & COMMUNES :
- Kaloum (centre-ville, affaires) : 1-3M GNF studios, 3-8M bureaux
- Dixinn (résidentiel aisé) : 2-5M appartements, 5-15M villas
- Matam/Cosa (populaire, commercial) : 500K-2M studios, 1-3M appartements
- Ratoma (Kipé, Nongo, Lambanyi, Cosa) : Zone en pleine expansion, 1-4M appartements, 3-10M villas
- Matoto (aéroport, industrie) : 800K-2.5M, bon rapport qualité-prix

💡 TENDANCES :
- Forte demande F2-F3 meublés pour jeunes professionnels (1.5-3M GNF)
- Marché locatif dominant (peu d'accession à la propriété)
- Saison haute : septembre-décembre (rentrée, expatriés)
- Critères clés : eau courante, électricité/groupe électrogène, parking, sécurité
- Négociation : les locataires négocient souvent 10-20% du prix affiché

═══════════════════════════════════════
SCORING PROSPECTS (ta méthodologie)
═══════════════════════════════════════
🔥 CHAUD (Score élevé → Proposer signature dans les 48h) :
  - Budget confirmé et réaliste par rapport au marché
  - Type de bien et quartier clairement définis
  - Disponibilités données pour visite/signature
  - Réponses rapides (< 24h) aux messages
  - A déjà fait une contre-visite ou demandé les conditions du bail
  → ACTION : Proposer une contre-visite ou directement la signature

🟡 TIÈDE (Score moyen → Relancer avec un argument fort) :
  - Intéressé mais hésite entre plusieurs biens
  - Budget approximatif ou légèrement en-dessous
  - Répond mais avec délai (24-72h)
  - Pose beaucoup de questions sans s'engager
  → ACTION : Envoyer une relance personnalisée avec un argument (exclusivité, baisse prix, nouveau bien similaire)

❄️ FROID (Score bas → Maintenir contact léger) :
  - Peu ou pas de réponses depuis 3+ jours
  - Budget flou ou irréaliste
  - Pas de critères précis
  - "Je regarde juste" / "Je ne suis pas pressé"
  → ACTION : Un message léger tous les 7-10 jours, proposer des alternatives

═══════════════════════════════════════
TES CAPACITÉS ACTIVES
═══════════════════════════════════════
1. 💬 CHAT : Répondre aux questions de l'agent, donner des conseils stratégiques
2. 📊 RAPPORTS : Générer le rapport d'activité quotidien (visites, conversions, actions)
3. ✉️ RELANCES : Rédiger des messages multi-canal (WhatsApp, Email, SMS)
4. 🔍 ANALYSE : Scorer les prospects et identifier les opportunités
5. 📅 AGENDA : CRÉER, MODIFIER et SUPPRIMER des visites/rendez-vous dans l'agenda de l'agent
6. 💡 COACHING : Conseiller sur les techniques de négociation et de closing

═══════════════════════════════════════
ACTIONS EXÉCUTABLES (TRÈS IMPORTANT)
═══════════════════════════════════════
Tu peux DIRECTEMENT exécuter des actions sur la plateforme. Quand tu veux créer ou modifier une visite,
inclus un bloc d'action dans ta réponse au format suivant :

Pour CRÉER une visite :
[ACTION:CREATE_VISIT]{"lead_name":"Nom du prospect","lead_phone":"+224...","lead_notes":"Notes","type":"visit","scheduled_at":"2026-03-01T10:00:00","address":"Adresse","ai_prospect_score":"hot"}[/ACTION]

Pour MODIFIER une visite existante (utilise l'ID de la visite si disponible dans le contexte) :
[ACTION:UPDATE_VISIT]{"visit_id":"uuid","scheduled_at":"2026-03-01T14:00:00","status":"confirmed","lead_notes":"Notes","ai_prospect_score":"hot"}[/ACTION]

RÈGLES D'ACTION :
- Quand l'agent te demande d'ajouter un créneau/visite → CRÉE-LA avec CREATE_VISIT
- Quand l'agent te demande de déplacer/modifier une visite → MODIFIE-LA avec UPDATE_VISIT
- Tu peux exécuter plusieurs actions dans la même réponse
- Confirme TOUJOURS à l'agent ce que tu as fait après l'action
- NE DEMANDE PAS à l'agent de le faire lui-même — TU LE FAIS

═══════════════════════════════════════
FORMAT DE TES RÉPONSES
═══════════════════════════════════════
- Commence TOUJOURS par l'essentiel (pas de bavardage)
- Utilise des listes à puces pour la clarté
- Termine par une ACTION CONCRÈTE que l'agent peut faire maintenant
- Si l'agent demande une relance → propose les 3 canaux (WhatsApp, Email, SMS)
- Si l'agent parle d'un prospect → donne ton évaluation du score
- Si c'est le matin → propose de générer le rapport quotidien
- Maximum 500 mots par réponse sauf pour les rapports (ne jamais couper une réponse en cours)

Réponds toujours en français sauf si l'agent écrit dans une autre langue.`;

const REPORT_PROMPT = `Tu es ARIA, l'assistante IA de Guin-e Immobilier Connect.
Tu génères le rapport d'activité quotidien d'un agent immobilier en Guinée (Conakry).

Le rapport doit être clair, structuré avec des emojis, actionnable et encourageant.
Langue : français. Contexte : marché immobilier guinéen.

FORMAT STRICT :
📅 RAPPORT DU [date] — [Nom agent]

📊 RÉSUMÉ DE LA VEILLE
- Nombre de visites effectuées hier, résultats
- Taux de complétion

📋 VISITES DU JOUR
- Liste chronologique avec heure, prospect, type, statut
- Si aucune visite : suggère des actions de prospection

🔥 PROSPECTS CHAUDS
- Liste des prospects avec score élevé + raison
- Action recommandée pour chacun

⚡ ACTIONS PRIORITAIRES (3-5 actions concrètes)
- Classées par impact/urgence
- Chaque action commence par un verbe d'action

📈 PERFORMANCES DE LA SEMAINE
- Taux de conversion (signatures / visites totales)
- Réactivité aux messages
- Comparaison avec objectifs

💡 RECOMMANDATIONS ARIA (2-3 conseils personnalisés)
- Basées sur les données réelles
- Orientées résultats

Maximum 500 mots. Sois direct et motivant.`;

const RELANCE_PROMPT = `Tu es ARIA, assistante IA de Guin-e Immobilier Connect.
L'agent te demande de rédiger un message de relance professionnel pour un prospect.

Instructions :
- Ton chaleureux et professionnel, adapté au contexte guinéen
- Vouvoie le prospect
- Message court (2-3 phrases max pour WhatsApp/SMS, 4-5 pour email)
- Mentionne le bien visité et la prochaine étape
- Propose un créneau ou demande confirmation
- Ne sois pas insistant, sois courtois et naturel
- Intègre des éléments contextuels (quartier, type de bien)

Retourne UNIQUEMENT un JSON strict (sans markdown, sans backticks) :
{"whatsapp":"Message WhatsApp court","email_subject":"Objet email","email_body":"Corps email","sms":"SMS max 160 caractères"}`;

const CONVERSATION_SCAN_PROMPT = `Tu es ARIA, l'IA d'analyse de Guin-e Immobilier Connect.
Tu analyses une conversation entre un agent immobilier et un prospect/locataire en Guinée.

Tu dois détecter :
1. Le niveau d'intérêt du prospect (hot/warm/cold)
2. Si une visite devrait être programmée ou mise à jour
3. Si un changement d'horaire a été mentionné
4. Les besoins identifiés du prospect

Retourne UNIQUEMENT un JSON strict (sans markdown, sans backticks) :
{"prospect_score":"hot"|"warm"|"cold","score_reason":"Explication courte","should_create_visit":true|false,"suggested_visit":{"type":"visit"|"contre-visite"|"signature","lead_name":"Nom","lead_phone":"Tel ou null","lead_notes":"Résumé besoins","suggested_date":"YYYY-MM-DD ou null","address":"Adresse ou null"},"schedule_change":{"detected":false,"new_date":"YYYY-MM-DD ou null","new_time":"HH:MM ou null","reason":"ou null"},"needs_identified":{"budget":"ou null","property_type":"ou null","location":"ou null","family_size":"ou null","special_requirements":"ou null"},"next_action":"Recommandation concrète","summary":"Résumé 2-3 phrases"}`;

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
  schedule_change?: {
    detected: boolean;
    new_date: string | null;
    new_time: string | null;
    reason: string | null;
  };
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

export interface ScanResult {
  conversationId: string;
  prospectName: string;
  analysis: ConversationAnalysis;
  visitCreated: boolean;
  visitUpdated: boolean;
}

/* ══════════════════════════════════════════════════════
   GEMINI FLASH — IA légère (chat quotidien, relances)
   Rapide, économique, usage fréquent
   ══════════════════════════════════════════════════════ */
async function callGeminiFlash(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens = 1024,
): Promise<{ text: string; tokensUsed: number }> {
  if (!GEMINI_API_KEY) {
    throw new Error('Clé API Gemini non configurée. Ajoutez VITE_GEMINI_API_KEY dans votre fichier .env');
  }

  // Convert messages to Gemini format
  const contents = [
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: 'Compris. Je suis ARIA, prête à aider.' }] },
    ...messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
  ];

  const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Erreur Gemini Flash (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tokensUsed =
    (data.usageMetadata?.promptTokenCount || 0) +
    (data.usageMetadata?.candidatesTokenCount || 0);

  return { text, tokensUsed };
}

/* ══════════════════════════════════════════════════════
   CLAUDE SONNET — IA avancée (analyse, scoring, rapports)
   Extended thinking pour les analyses stratégiques
   ══════════════════════════════════════════════════════ */
async function callClaude(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens = 1024,
  useExtendedThinking = false,
): Promise<{ text: string; tokensUsed: number }> {
  if (!CLAUDE_API_KEY) {
    throw new Error('Clé API Claude non configurée. Ajoutez VITE_CLAUDE_API_KEY dans votre fichier .env');
  }

  const body: Record<string, unknown> = {
    model: CLAUDE_MODEL,
    max_tokens: useExtendedThinking ? maxTokens + 10000 : maxTokens,
    system: systemPrompt,
    messages,
  };

  // Extended thinking for advanced/strategic mode
  if (useExtendedThinking) {
    body.thinking = {
      type: 'enabled',
      budget_tokens: 10000,
    };
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
    throw new Error(`Erreur Claude Sonnet (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();

  // Extract text from response content blocks (skip thinking blocks)
  let text = '';
  if (Array.isArray(data.content)) {
    for (const block of data.content) {
      if (block.type === 'text') {
        text += block.text;
      }
    }
  }

  const tokensUsed =
    (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0);

  return { text, tokensUsed };
}

/* ──────────────────────────────────────────
   Smart AI Router — Choisit le bon modèle
   avec fallback automatique
   ────────────────────────────────────────── */
type AITask = 'chat' | 'chat-advanced' | 'relance' | 'analysis' | 'report' | 'scan';

async function callAI(
  task: AITask,
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens = 1024,
): Promise<{ text: string; tokensUsed: number; model: string }> {
  const useAdvanced = task === 'chat-advanced' || task === 'analysis' || task === 'report' || task === 'scan';
  const useThinking = task === 'analysis' || task === 'report' || task === 'scan';

  // Strategy: advanced tasks → Claude, light tasks → Gemini Flash
  if (useAdvanced) {
    // Try Claude first for advanced tasks
    try {
      const result = await callClaude(systemPrompt, messages, maxTokens, useThinking);
      return { ...result, model: useThinking ? 'claude-sonnet-thinking' : 'claude-sonnet' };
    } catch (claudeErr) {
      // Fallback to Gemini Flash if Claude fails
      console.warn('[ARIA] Claude failed, falling back to Gemini Flash:', claudeErr);
      try {
        const result = await callGeminiFlash(systemPrompt, messages, maxTokens);
        return { ...result, model: 'gemini-flash-fallback' };
      } catch {
        throw claudeErr; // Throw original Claude error if both fail
      }
    }
  } else {
    // Try Gemini Flash first for light tasks
    try {
      const result = await callGeminiFlash(systemPrompt, messages, maxTokens);
      return { ...result, model: 'gemini-flash' };
    } catch (geminiErr) {
      // Fallback to Claude if Gemini fails
      console.warn('[ARIA] Gemini Flash failed, falling back to Claude:', geminiErr);
      try {
        const result = await callClaude(systemPrompt, messages, maxTokens, false);
        return { ...result, model: 'claude-sonnet-fallback' };
      } catch {
        throw geminiErr; // Throw original Gemini error if both fail
      }
    }
  }
}

/* ──────────────────────────────────────────
   Helper: parse JSON from AI response
   ────────────────────────────────────────── */
function parseAIJSON<T>(rawText: string, fallback: T): T {
  try {
    const cleaned = rawText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    return JSON.parse(cleaned);
  } catch {
    return fallback;
  }
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
   Helper: build rich context for ARIA
   Injecte TOUTES les données plateforme en
   lecture pour que l'IA puisse répondre sur
   les prospects, biens, conversations, etc.
   ────────────────────────────────────────── */
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<T>((resolve) => {
    timer = setTimeout(() => resolve(fallback), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function buildAgentContext(userId: string, agentName: string): Promise<string> {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const parts: string[] = [];

  parts.push(`[CONTEXTE: ${now.toLocaleString('fr-FR', { timeZone: 'Africa/Conakry' })} — Agent: ${agentName}]`);

  // ── 1. AGENDA : Visites du jour ──
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
  } catch {
    // Tables not ready
  }

  // ── 2. TOUS LES PROSPECTS : Visites à venir (prochains 30 jours) ──
  try {
    const in30days = new Date(now);
    in30days.setDate(in30days.getDate() + 30);

    const { data: allVisits } = await supabase
      .from('visits')
      .select('lead_name, lead_phone, lead_email, lead_notes, type, status, scheduled_at, address, ai_prospect_score, follow_up_required, relance_sent_at, property:property_id(title, city, type, price)')
      .gte('scheduled_at', now.toISOString())
      .lte('scheduled_at', in30days.toISOString())
      .neq('status', 'cancelled')
      .order('scheduled_at');

    if (allVisits?.length) {
      const hot = allVisits.filter(v => v.ai_prospect_score === 'hot');
      const warm = allVisits.filter(v => v.ai_prospect_score === 'warm');
      const cold = allVisits.filter(v => v.ai_prospect_score === 'cold');
      const pending = allVisits.filter(v => v.status === 'pending');
      const needsRelance = allVisits.filter(v => v.follow_up_required && !v.relance_sent_at);

      parts.push(`[PROSPECTS — ${allVisits.length} visite(s) à venir :`);
      if (hot.length) parts.push(`  🔥 CHAUDS (${hot.length}): ${hot.map(v => `${v.lead_name} (${v.type}, ${new Date(v.scheduled_at).toLocaleDateString('fr-FR')})${v.lead_phone ? ` tel:${v.lead_phone}` : ''}${v.lead_notes ? ` — ${v.lead_notes}` : ''}${v.property ? ` — Bien: ${v.property.title} ${v.property.city} ${v.property.price?.toLocaleString('fr-FR')} GNF` : ''}`).join(' | ')}`);
      if (warm.length) parts.push(`  🟡 TIÈDES (${warm.length}): ${warm.map(v => `${v.lead_name} (${v.type}, ${new Date(v.scheduled_at).toLocaleDateString('fr-FR')})${v.lead_notes ? ` — ${v.lead_notes}` : ''}${v.property ? ` — Bien: ${v.property.title} ${v.property.city}` : ''}`).join(' | ')}`);
      if (cold.length) parts.push(`  ❄️ FROIDS (${cold.length}): ${cold.map(v => `${v.lead_name} (${v.type})`).join(', ')}`);
      if (pending.length) parts.push(`  ⏳ EN ATTENTE CONFIRMATION (${pending.length}): ${pending.map(v => v.lead_name).join(', ')}`);
      if (needsRelance.length) parts.push(`  📩 À RELANCER (${needsRelance.length}): ${needsRelance.map(v => v.lead_name).join(', ')}`);
      parts.push(']');
    }
  } catch {
    // Tables not ready
  }

  // ── 3. CONVERSATIONS RÉCENTES avec prospects/locataires ──
  try {
    // Get conversations where this agent participates
    const { data: participations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    if (participations?.length) {
      const convIds = participations.map(p => p.conversation_id);

      // For each conversation, get recent messages + other participant name
      const conversationSummaries: string[] = [];
      for (const convId of convIds.slice(0, 8)) { // Limit to 8 conversations
        // Get the other participant
        const { data: otherParticipants } = await supabase
          .from('conversation_participants')
          .select('user_id')
          .eq('conversation_id', convId)
          .neq('user_id', userId);

        let otherName = 'Inconnu';
        if (otherParticipants?.[0]?.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', otherParticipants[0].user_id)
            .single();
          otherName = profile?.full_name || 'Inconnu';
        }

        // Get last 6 messages of this conversation
        const { data: msgs } = await supabase
          .from('messages')
          .select('sender_id, content, created_at')
          .eq('conversation_id', convId)
          .order('created_at', { ascending: false })
          .limit(6);

        if (msgs?.length) {
          const formatted = msgs.reverse().map(m => {
            const who = m.sender_id === userId ? 'Agent' : otherName;
            return `[${new Date(m.created_at).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}] ${who}: ${m.content.slice(0, 200)}`;
          }).join('\n    ');

          conversationSummaries.push(`  💬 ${otherName}:\n    ${formatted}`);
        }
      }

      if (conversationSummaries.length) {
        parts.push(`[CONVERSATIONS RÉCENTES (${conversationSummaries.length}):\n${conversationSummaries.join('\n')}\n]`);
      }
    }
  } catch {
    // Tables not ready
  }

  // ── 4. BIENS IMMOBILIERS de l'agent ──
  try {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, title, type, transaction_type, price, currency, city, commune, quartier, bedrooms, bathrooms, area, furnished, status, amenities')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (properties?.length) {
      parts.push(`[BIENS DE L'AGENT (${properties.length}):\n${properties.map(p =>
        `  🏠 ${p.title} — ${p.type} ${p.transaction_type === 'rent' ? 'Location' : 'Vente'} — ${p.price?.toLocaleString('fr-FR')} ${p.currency || 'GNF'} — ${p.city}${p.commune ? `/${p.commune}` : ''}${p.quartier ? `/${p.quartier}` : ''} — ${p.bedrooms || '?'}ch/${p.bathrooms || '?'}sdb${p.area ? `/${p.area}m²` : ''} — ${p.furnished ? 'Meublé' : 'Non meublé'} — Statut: ${p.status}${(p.amenities as string[])?.length ? ` — Commodités: ${(p.amenities as string[]).join(', ')}` : ''}`
      ).join('\n')}\n]`);
    } else {
      parts.push('[BIENS DE L\'AGENT: Aucun bien enregistré]');
    }
  } catch {
    // Tables not ready
  }

  // ── 5. LOCATIONS ACTIVES ──
  try {
    const { data: rentals } = await supabase
      .from('rentals')
      .select('rent_amount, currency, start_date, end_date, status, payment_method, property:property_id(title, city), tenant:tenant_id(full_name)')
      .or(`owner_id.eq.${userId},agent_id.eq.${userId}`)
      .eq('status', 'active')
      .limit(10);

    if (rentals?.length) {
      parts.push(`[LOCATIONS ACTIVES (${rentals.length}):\n${rentals.map(r =>
        `  🔑 ${(r.property as any)?.title || 'Bien'} — Locataire: ${(r.tenant as any)?.full_name || '?'} — ${r.rent_amount?.toLocaleString('fr-FR')} ${r.currency || 'GNF'}/mois — Depuis: ${r.start_date} — Paiement: ${r.payment_method || 'non défini'}`
      ).join('\n')}\n]`);
    }
  } catch {
    // Tables not ready
  }

  // ── 6. ALERTES ──
  try {
    const { data: pending } = await supabase
      .from('visits')
      .select('id')
      .eq('status', 'pending')
      .gte('scheduled_at', now.toISOString());

    const { data: unread } = await supabase
      .from('notifications')
      .select('id')
      .eq('user_id', userId)
      .eq('read', false);

    const alerts: string[] = [];
    if (pending?.length) alerts.push(`${pending.length} visite(s) en attente de confirmation`);
    if (unread?.length) alerts.push(`${unread.length} notification(s) non lue(s)`);

    if (alerts.length) {
      parts.push(`[ALERTES: ${alerts.join(' | ')}]`);
    }
  } catch {
    // Tables not ready
  }

  return '\n\n' + parts.join('\n');
}

/* ══════════════════════════════════════════════════════
   Chat — Envoyer un message à ARIA
   Mode standard → Gemini Flash (rapide, économique)
   Mode avancé → Claude Sonnet + Extended Thinking
   ══════════════════════════════════════════════════════ */
/** Parse and execute action blocks from ARIA's response */
async function executeAriaActions(responseText: string, userId: string): Promise<{ cleanedText: string; actionsExecuted: string[] }> {
  const actionsExecuted: string[] = [];
  let cleanedText = responseText;

  // Parse CREATE_VISIT actions
  const createRegex = /\[ACTION:CREATE_VISIT\](.*?)\[\/ACTION\]/gs;
  let match;
  while ((match = createRegex.exec(responseText)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      const { error } = await (supabase as any).from('visits').insert({
        agent_id: userId,
        lead_name: data.lead_name || 'Prospect',
        lead_phone: data.lead_phone || null,
        lead_email: data.lead_email || null,
        lead_notes: data.lead_notes || null,
        type: data.type || 'visit',
        status: 'pending',
        scheduled_at: data.scheduled_at || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration_minutes: data.duration_minutes || 60,
        address: data.address || null,
        ai_prospect_score: data.ai_prospect_score || 'unknown',
        ai_suggested: true,
        property_id: data.property_id || null,
      });
      if (!error) {
        actionsExecuted.push(`✅ Visite créée pour ${data.lead_name}`);
      } else {
        actionsExecuted.push(`⚠️ Erreur création visite: ${error.message}`);
      }
    } catch (e) {
      console.warn('[ARIA] Failed to parse CREATE_VISIT action:', e);
    }
    cleanedText = cleanedText.replace(match[0], '');
  }

  // Parse UPDATE_VISIT actions
  const updateRegex = /\[ACTION:UPDATE_VISIT\](.*?)\[\/ACTION\]/gs;
  while ((match = updateRegex.exec(responseText)) !== null) {
    try {
      const data = JSON.parse(match[1]);
      if (!data.visit_id) continue;
      const updatePayload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (data.scheduled_at) updatePayload.scheduled_at = data.scheduled_at;
      if (data.status) updatePayload.status = data.status;
      if (data.lead_notes) updatePayload.lead_notes = data.lead_notes;
      if (data.ai_prospect_score) updatePayload.ai_prospect_score = data.ai_prospect_score;
      if (data.agent_notes) updatePayload.agent_notes = data.agent_notes;

      const { error } = await (supabase as any).from('visits').update(updatePayload).eq('id', data.visit_id).eq('agent_id', userId);
      if (!error) {
        actionsExecuted.push(`✅ Visite mise à jour`);
      } else {
        actionsExecuted.push(`⚠️ Erreur mise à jour: ${error.message}`);
      }
    } catch (e) {
      console.warn('[ARIA] Failed to parse UPDATE_VISIT action:', e);
    }
    cleanedText = cleanedText.replace(match[0], '');
  }

  return { cleanedText: cleanedText.trim(), actionsExecuted };
}

export async function sendMessageToAria(
  message: string,
  useAdvancedModel = false,
): Promise<{ data: { message: string; model: string; tokensUsed: number; actionsExecuted?: string[] } | null; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Non authentifié — veuillez vous reconnecter.') };

    const agentName = user.user_metadata?.full_name || user.email || 'Agent';

    // Load recent history for context (last 10 messages)
    let historyMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    try {
      const { data: history } = await supabase
        .from('ai_conversations')
        .select('role, content')
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (history) {
        historyMessages = history.reverse().map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));
      }
    } catch {
      // Tables not ready — continue without history
    }

    // Build rich context (timeout 8s to avoid hanging)
    const contextSuffix = await withTimeout(buildAgentContext(user.id, agentName), 8000, `\n\n[CONTEXTE: ${new Date().toLocaleString('fr-FR')} — Agent: ${agentName}]\n[Chargement contexte incomplet — données partielles]`);

    // Build messages array
    const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [
      ...historyMessages,
      { role: 'user', content: message },
    ];

    // Auto-escalate to advanced for write requests (agenda, clients, visits)
    const writeIntent = /\b(ajouter|ajout|créer|crée|planifier|planifie|modifier|modifie|déplacer|supprimer|annuler|mettre.*agenda|placer.*agenda|dans.*l.agenda|nouveau.*client)\b/i.test(message);
    const task: AITask = (useAdvancedModel || writeIntent) ? 'chat-advanced' : 'chat';
    // 2048 tokens for regular chat (~1500 words), 4096 for advanced (actions + long analysis)
    const maxTokens = task === 'chat-advanced' ? 4096 : 2048;
    const { text: rawResponse, tokensUsed, model } = await callAI(
      task,
      SYSTEM_PROMPT + contextSuffix,
      messages,
      maxTokens,
    );

    if (!rawResponse) {
      return { data: null, error: new Error('ARIA n\'a pas pu générer de réponse.') };
    }

    // Execute any action blocks in the response
    const { cleanedText: assistantMessage, actionsExecuted } = await executeAriaActions(rawResponse, user.id);

    // Save to DB (non-blocking)
    saveToHistory(user.id, message, assistantMessage, model, tokensUsed);

    return {
      data: { message: assistantMessage, model, tokensUsed, actionsExecuted },
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
    const { data, error } = await (supabase as any)
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
    const { error } = await (supabase as any)
      .from('ai_conversations')
      .delete()
      .eq('agent_id', user.id);

    if (error) console.warn('[ARIA] Erreur clearChatHistory:', error.message);
    return { error };
  } catch {
    return { error: null };
  }
}

/* ══════════════════════════════════════════════════════
   Relance IA — Générer un message multi-canal
   Utilise Gemini Flash (tâche légère) avec fallback
   ══════════════════════════════════════════════════════ */
export async function generateSmartRelance(visitId: string): Promise<{
  data: { messages: RelanceMessages; visit: { lead_name: string; lead_phone: string; lead_email: string } } | null;
  error: Error | null;
}> {
  // Try Edge Function first
  try {
    const { data, error } = await supabase.functions.invoke('ai-smart-relance', { body: { visitId } });
    if (!error && data) return { data, error: null };
  } catch {
    // Edge function not deployed — fallback to client-side
  }

  // Fallback: call AI directly from client
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Non authentifié') };

    // Fetch visit data
    const { data: visit, error: vError } = await supabase
      .from('visits')
      .select('*, property:property_id(title, type, city, address)')
      .eq('id', visitId)
      .single();

    if (vError || !visit) return { data: null, error: new Error('Visite non trouvée') };

    const agentName = user.user_metadata?.full_name || user.email || 'Agent';
    const visitContext = `Informations de la visite :
- Prospect : ${visit.lead_name}
- Téléphone : ${visit.lead_phone || 'non renseigné'}
- Type : ${visit.type === 'visit' ? 'Visite' : visit.type === 'contre-visite' ? 'Contre-visite' : visit.type === 'signature' ? 'Signature' : 'État des lieux'}
- Statut : ${visit.status === 'pending' ? 'En attente' : visit.status}
- Date prévue : ${new Date(visit.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
- Bien : ${visit.property?.title || 'Non spécifié'} à ${visit.property?.city || visit.address || 'Conakry'}
- Notes : ${visit.lead_notes || 'Aucune'}
- Agent : ${agentName}
- Dernière relance : ${visit.relance_sent_at ? new Date(visit.relance_sent_at).toLocaleDateString('fr-FR') : 'Jamais'}`;

    const { text: rawText } = await callAI(
      'relance',
      RELANCE_PROMPT,
      [{ role: 'user', content: visitContext }],
      512,
    );

    const fallbackMessages: RelanceMessages = {
      whatsapp: `Bonjour ${visit.lead_name}, c'est ${agentName} de Guin-e Immobilier. Je souhaitais confirmer notre rendez-vous. Êtes-vous toujours disponible ? Merci !`,
      email_subject: `Confirmation de votre visite - ${visit.property?.title || 'Bien immobilier'}`,
      email_body: `Bonjour ${visit.lead_name},\n\nJe me permets de revenir vers vous concernant notre rendez-vous.\nÊtes-vous toujours disponible ?\n\nCordialement,\n${agentName}`,
      sms: `${visit.lead_name}, confirmez-vous notre RDV ? ${agentName} - Guin-e Immobilier`,
    };

    const messages = parseAIJSON<RelanceMessages>(rawText, fallbackMessages);

    // Mark relance as sent
    await supabase
      .from('visits')
      .update({ relance_sent_at: new Date().toISOString(), follow_up_required: false, updated_at: new Date().toISOString() })
      .eq('id', visitId);

    return {
      data: {
        messages,
        visit: {
          lead_name: visit.lead_name,
          lead_phone: visit.lead_phone || '',
          lead_email: visit.lead_email || '',
        },
      },
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur génération relance';
    return { data: null, error: new Error(msg) };
  }
}

/* ══════════════════════════════════════════════════════
   Analyse — Analyser une conversation
   Utilise Claude Sonnet + Extended Thinking (tâche avancée)
   ══════════════════════════════════════════════════════ */
export async function analyzeConversation(conversationId: string): Promise<{
  data: { analysis: ConversationAnalysis; prospectName: string; tokensUsed: number } | null;
  error: Error | null;
}> {
  // Try Edge Function first
  try {
    const { data, error } = await supabase.functions.invoke('ai-analyze-conversation', { body: { conversationId } });
    if (!error && data) return { data, error: null };
  } catch {
    // Edge function not deployed — fallback
  }

  // Fallback: call AI directly with Claude for deep analysis
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: new Error('Non authentifié') };

    // Fetch messages
    const { data: messages } = await supabase
      .from('messages')
      .select('sender_id, content, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(50);

    if (!messages?.length) return { data: null, error: new Error('Aucun message dans cette conversation') };

    // Get participant names
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id')
      .eq('conversation_id', conversationId);

    const otherUserId = participants?.find(p => p.user_id !== user.id)?.user_id;
    let prospectName = 'Prospect';
    if (otherUserId) {
      const { data: pp } = await supabase.from('profiles').select('full_name').eq('id', otherUserId).single();
      prospectName = pp?.full_name || 'Prospect';
    }

    const agentName = user.user_metadata?.full_name || user.email || 'Agent';
    const conversationText = messages.map(m => {
      const role = m.sender_id === user.id ? `Agent (${agentName})` : `Prospect (${prospectName})`;
      return `[${new Date(m.created_at).toLocaleString('fr-FR')}] ${role}: ${m.content}`;
    }).join('\n');

    const { text: rawText, tokensUsed } = await callAI(
      'analysis',
      CONVERSATION_SCAN_PROMPT,
      [{ role: 'user', content: `Analyse cette conversation :\n\n${conversationText}` }],
      1024,
    );

    const fallbackAnalysis: ConversationAnalysis = {
      prospect_score: 'cold',
      score_reason: 'Analyse automatique non disponible',
      should_create_visit: false,
      suggested_visit: null,
      needs_identified: {},
      next_action: 'Relancer manuellement',
      summary: 'Analyse non disponible.',
    };

    const analysis = parseAIJSON<ConversationAnalysis>(rawText, fallbackAnalysis);

    return { data: { analysis, prospectName, tokensUsed }, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur analyse conversation';
    return { data: null, error: new Error(msg) };
  }
}

/* ══════════════════════════════════════════════════════
   Rapport — Générer le rapport quotidien (enrichi)
   Utilise Claude Sonnet + Extended Thinking (analyse approfondie)
   ══════════════════════════════════════════════════════ */
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
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    // Fetch all data in parallel
    const [todayVisitsRes, yesterdayVisitsRes, weekVisitsRes, hotProspectsRes] = await Promise.all([
      supabase
        .from('visits')
        .select('lead_name, lead_phone, type, status, scheduled_at, address, ai_prospect_score, lead_notes, property:property_id(title, city)')
        .gte('scheduled_at', `${todayStr}T00:00:00`)
        .lte('scheduled_at', `${todayStr}T23:59:59`)
        .neq('status', 'cancelled')
        .order('scheduled_at'),
      supabase
        .from('visits')
        .select('lead_name, type, status, ai_prospect_score')
        .gte('scheduled_at', `${yesterdayStr}T00:00:00`)
        .lte('scheduled_at', `${yesterdayStr}T23:59:59`),
      supabase
        .from('visits')
        .select('status, type, relance_sent_at')
        .gte('scheduled_at', weekAgo.toISOString()),
      supabase
        .from('visits')
        .select('lead_name, lead_phone, type, status, scheduled_at, ai_prospect_score')
        .eq('ai_prospect_score', 'hot')
        .in('status', ['confirmed', 'pending'])
        .gte('scheduled_at', now.toISOString())
        .order('scheduled_at')
        .limit(5),
    ]);

    const todayVisits = todayVisitsRes.data || [];
    const yesterdayVisits = yesterdayVisitsRes.data || [];
    const weekVisits = weekVisitsRes.data || [];
    const hotProspects = hotProspectsRes.data || [];

    // Compute stats
    const weekCompleted = weekVisits.filter(v => v.status === 'completed').length;
    const weekSignatures = weekVisits.filter(v => v.type === 'signature' && v.status === 'completed').length;
    const weekRelanced = weekVisits.filter(v => v.relance_sent_at).length;
    const weekTotal = weekVisits.length;
    const conversionRate = weekTotal > 0 ? Math.round((weekSignatures / weekTotal) * 100) : 0;

    const reportContext = `Données agent "${agentName}" au ${now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} :

VISITES HIER: ${yesterdayVisits.length > 0 ? yesterdayVisits.map(v => `${v.lead_name} (${v.type}) → ${v.status}`).join(', ') : 'Aucune'}
VISITES AUJOURD'HUI: ${todayVisits.length > 0 ? todayVisits.map(v => `${new Date(v.scheduled_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}: ${v.lead_name} (${v.type}, ${v.status}) — ${v.property?.title || 'Bien'} à ${v.property?.city || v.address || 'Conakry'}`).join(' | ') : 'Aucune'}
STATS SEMAINE: ${weekTotal} visites, ${weekCompleted} terminées, ${weekSignatures} signatures, ${weekRelanced} relances, ${conversionRate}% conversion
PROSPECTS CHAUDS: ${hotProspects.length > 0 ? hotProspects.map(v => `🔥 ${v.lead_name} (${v.type})`).join(', ') : 'Aucun'}
EN ATTENTE: ${todayVisits.filter(v => v.status === 'pending').length} visite(s) à confirmer`;

    const { text: report, tokensUsed, model } = await callAI(
      'report',
      REPORT_PROMPT,
      [{ role: 'user', content: reportContext }],
      1500,
    );

    // Save to history
    saveToHistory(user.id, '[RAPPORT QUOTIDIEN]', report, model, tokensUsed);

    return {
      data: {
        report,
        tokensUsed,
        stats: { weekTotal, weekCompleted, weekSignatures, conversionRate },
      },
      error: null,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur génération rapport';
    return { data: null, error: new Error(msg) };
  }
}

/* ══════════════════════════════════════════════════════
   Scan IA — Analyser les conversations et auto-créer/
   mettre à jour les visites dans l'agenda
   Utilise Claude Sonnet (analyse stratégique)
   ══════════════════════════════════════════════════════ */
export async function scanConversationsForVisits(): Promise<{
  data: ScanResult[];
  error: Error | null;
}> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], error: new Error('Non authentifié') };

    // Get conversations where the agent is a participant
    const { data: participations } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', user.id);

    if (!participations?.length) return { data: [], error: null };

    const conversationIds = participations.map(p => p.conversation_id);
    const results: ScanResult[] = [];

    // Analyze each conversation (limit to 5 most recent active ones)
    for (const convId of conversationIds.slice(0, 5)) {
      // Check if this conversation has recent messages (last 48h)
      const cutoff = new Date();
      cutoff.setHours(cutoff.getHours() - 48);

      const { data: recentMsgs } = await supabase
        .from('messages')
        .select('id')
        .eq('conversation_id', convId)
        .gte('created_at', cutoff.toISOString())
        .limit(1);

      if (!recentMsgs?.length) continue;

      // Analyze the conversation
      const { data: analysisData, error: analysisError } = await analyzeConversation(convId);
      if (analysisError || !analysisData) continue;

      const { analysis, prospectName } = analysisData;
      let visitCreated = false;
      let visitUpdated = false;

      // Auto-create visit if recommended
      if (analysis.should_create_visit && analysis.suggested_visit) {
        const sv = analysis.suggested_visit;

        // Check if a similar visit doesn't already exist
        const { data: existing } = await supabase
          .from('visits')
          .select('id')
          .eq('lead_name', sv.lead_name)
          .in('status', ['confirmed', 'pending'])
          .gte('scheduled_at', new Date().toISOString())
          .limit(1);

        if (!existing?.length) {
          const scheduledAt = sv.suggested_date
            ? new Date(`${sv.suggested_date}T10:00:00`).toISOString()
            : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // +2 days default

          await supabase.from('visits').insert({
            agent_id: user.id,
            lead_name: sv.lead_name || prospectName,
            lead_phone: sv.lead_phone || null,
            lead_notes: sv.lead_notes || analysis.summary,
            type: (sv.type as 'visit' | 'contre-visite' | 'signature' | 'etat-lieux') || 'visit',
            status: 'pending',
            scheduled_at: scheduledAt,
            duration_minutes: 60,
            address: sv.address || null,
            ai_prospect_score: analysis.prospect_score,
            ai_suggested: true,
          });

          visitCreated = true;
        }
      }

      // Update prospect score on existing visits for this prospect
      if (analysis.prospect_score) {
        const { data: existingVisits } = await supabase
          .from('visits')
          .select('id')
          .ilike('lead_name', `%${prospectName}%`)
          .in('status', ['confirmed', 'pending'])
          .gte('scheduled_at', new Date().toISOString());

        if (existingVisits?.length) {
          for (const v of existingVisits) {
            await supabase.from('visits').update({
              ai_prospect_score: analysis.prospect_score,
              updated_at: new Date().toISOString(),
            }).eq('id', v.id);
          }
          visitUpdated = true;
        }
      }

      // Handle schedule changes
      if (analysis.schedule_change?.detected && analysis.schedule_change.new_date) {
        const { data: matchingVisits } = await supabase
          .from('visits')
          .select('id')
          .ilike('lead_name', `%${prospectName}%`)
          .in('status', ['confirmed', 'pending'])
          .gte('scheduled_at', new Date().toISOString())
          .order('scheduled_at', { ascending: true })
          .limit(1);

        if (matchingVisits?.length) {
          const newDateTime = analysis.schedule_change.new_time
            ? `${analysis.schedule_change.new_date}T${analysis.schedule_change.new_time}:00`
            : `${analysis.schedule_change.new_date}T10:00:00`;

          await supabase.from('visits').update({
            scheduled_at: new Date(newDateTime).toISOString(),
            agent_notes: `[ARIA] Horaire mis à jour suite à conversation : ${analysis.schedule_change.reason || ''}`,
            updated_at: new Date().toISOString(),
          }).eq('id', matchingVisits[0].id);

          visitUpdated = true;
        }
      }

      results.push({
        conversationId: convId,
        prospectName,
        analysis,
        visitCreated,
        visitUpdated,
      });
    }

    // Save scan results summary to AI history
    if (results.length > 0) {
      const created = results.filter(r => r.visitCreated).length;
      const updated = results.filter(r => r.visitUpdated).length;
      const hot = results.filter(r => r.analysis.prospect_score === 'hot').length;

      const summary = `📡 **Scan IA terminé**
${results.length} conversation(s) analysée(s)
${created > 0 ? `✅ ${created} visite(s) créée(s) automatiquement` : ''}
${updated > 0 ? `🔄 ${updated} visite(s) mise(s) à jour` : ''}
${hot > 0 ? `🔥 ${hot} prospect(s) chaud(s) détecté(s)` : ''}

${results.map(r => `• ${r.prospectName}: ${r.analysis.prospect_score === 'hot' ? '🔥' : r.analysis.prospect_score === 'warm' ? '🟡' : '❄️'} ${r.analysis.score_reason}`).join('\n')}`;

      saveToHistory(user.id, '[SCAN IA CONVERSATIONS]', summary, 'claude-sonnet-thinking', 0);
    }

    return { data: results, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur scan IA';
    return { data: [], error: new Error(msg) };
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

    const { data, error } = await (supabase as any)
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
