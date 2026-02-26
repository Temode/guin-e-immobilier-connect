/**
 * Hook CopilotKit — Injecte les données ARIA + définit les actions
 *
 * useCopilotReadable : données plateforme en lecture (biens, visites, conversations…)
 * useCopilotAction   : actions que l'IA peut déclencher (rapport, relance, scan…)
 */

import { useEffect, useState, useCallback } from 'react';
import { useCopilotReadable, useCopilotAction } from '@copilotkit/react-core';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  generateDailyReport,
  generateSmartRelance,
  scanConversationsForVisits,
} from '@/services/aiAgentChatService';
import { runAriaWorkflow, type ProspectScore } from '@/services/ariaGraph';

/* ══════════════════════════════════════════
   Types pour les données plateforme
   ══════════════════════════════════════════ */

interface VisitData {
  id: string;
  lead_name: string;
  lead_phone: string | null;
  lead_notes: string | null;
  type: string;
  status: string;
  scheduled_at: string;
  ai_prospect_score: string;
  follow_up_required: boolean;
  property?: { title: string; city: string; price?: number } | null;
}

interface PropertyData {
  id: string;
  title: string;
  type: string;
  transaction_type: string;
  price: number;
  city: string;
  commune: string | null;
  status: string;
  bedrooms: number | null;
}

interface ConversationData {
  id: string;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

/* ══════════════════════════════════════════
   Hook principal
   ══════════════════════════════════════════ */

export function useAriaContext() {
  const { user, profile } = useAuthContext();

  const [visits, setVisits] = useState<VisitData[]>([]);
  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [conversations, setConversations] = useState<ConversationData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const agentName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Agent';

  /* ── Chargement initial des données ── */
  const refreshData = useCallback(async () => {
    if (!user) return;

    // Visites à venir (30 jours)
    try {
      const now = new Date();
      const in30 = new Date(now);
      in30.setDate(in30.getDate() + 30);

      const { data } = await supabase
        .from('visits')
        .select('id, lead_name, lead_phone, lead_notes, type, status, scheduled_at, ai_prospect_score, follow_up_required, property:property_id(title, city, price)')
        .gte('scheduled_at', now.toISOString())
        .lte('scheduled_at', in30.toISOString())
        .neq('status', 'cancelled')
        .order('scheduled_at');

      if (data) setVisits(data as unknown as VisitData[]);
    } catch { /* */ }

    // Biens
    try {
      const { data } = await supabase
        .from('properties')
        .select('id, title, type, transaction_type, price, city, commune, status, bedrooms')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data) setProperties(data as unknown as PropertyData[]);
    } catch { /* */ }

    // Conversations
    try {
      const { data: participations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (participations?.length) {
        const convList: ConversationData[] = [];
        for (const p of participations.slice(0, 10)) {
          const { data: others } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', p.conversation_id)
            .neq('user_id', user.id);

          let participantName = 'Inconnu';
          if (others?.[0]?.user_id) {
            const { data: prof } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', others[0].user_id)
              .single();
            participantName = prof?.full_name || 'Inconnu';
          }

          const { data: conv } = await supabase
            .from('conversations')
            .select('last_message_text, last_message_at')
            .eq('id', p.conversation_id)
            .single();

          const { data: unreadMsgs } = await supabase
            .from('messages')
            .select('id')
            .eq('conversation_id', p.conversation_id)
            .eq('read', false)
            .neq('sender_id', user.id);

          convList.push({
            id: p.conversation_id,
            participantName,
            lastMessage: conv?.last_message_text || '',
            lastMessageAt: conv?.last_message_at || '',
            unreadCount: unreadMsgs?.length || 0,
          });
        }
        setConversations(convList);
      }
    } catch { /* */ }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /* ══════════════════════════════════════════
     CopilotKit Readable — Données en lecture
     ══════════════════════════════════════════ */

  // Identité de l'agent
  useCopilotReadable({
    description: "Identité de l'agent immobilier connecté",
    value: {
      name: agentName,
      email: user?.email,
      plan: profile?.subscription_plan || 'free',
      kycStatus: profile?.kyc_status || 'pending',
    },
  });

  // Visites / Prospects
  useCopilotReadable({
    description: "Visites et prospects de l'agent (prochains 30 jours). Inclut le nom du prospect, téléphone, notes, type de visite, statut, score IA (hot/warm/cold), bien associé.",
    value: visits.map(v => ({
      prospect: v.lead_name,
      phone: v.lead_phone,
      notes: v.lead_notes,
      visitType: v.type,
      status: v.status,
      date: v.scheduled_at,
      score: v.ai_prospect_score,
      needsRelance: v.follow_up_required,
      property: v.property ? `${v.property.title} à ${v.property.city}${v.property.price ? ` (${v.property.price.toLocaleString('fr-FR')} GNF)` : ''}` : null,
    })),
  });

  // Biens immobiliers
  useCopilotReadable({
    description: "Catalogue de biens immobiliers de l'agent (titre, type, prix, ville, statut)",
    value: properties.map(p => ({
      title: p.title,
      type: p.type,
      transactionType: p.transaction_type === 'rent' ? 'Location' : 'Vente',
      price: `${p.price?.toLocaleString('fr-FR')} GNF`,
      city: p.city,
      commune: p.commune,
      bedrooms: p.bedrooms,
      status: p.status,
    })),
  });

  // Conversations
  useCopilotReadable({
    description: "Conversations récentes de l'agent avec les prospects/locataires (nom du contact, dernier message, messages non lus)",
    value: conversations.map(c => ({
      contact: c.participantName,
      lastMessage: c.lastMessage,
      lastMessageAt: c.lastMessageAt,
      unreadCount: c.unreadCount,
    })),
  });

  // Stats résumées
  useCopilotReadable({
    description: "Statistiques résumées : nombre de prospects par score, biens disponibles, conversations actives",
    value: {
      prospectsChauds: visits.filter(v => v.ai_prospect_score === 'hot').length,
      prospectsTiedes: visits.filter(v => v.ai_prospect_score === 'warm').length,
      prospectsFroids: visits.filter(v => v.ai_prospect_score === 'cold').length,
      totalVisites: visits.length,
      visitesAujourdhui: visits.filter(v => new Date(v.scheduled_at).toDateString() === new Date().toDateString()).length,
      biensDisponibles: properties.filter(p => p.status === 'available').length,
      totalBiens: properties.length,
      conversationsActives: conversations.length,
      messagesNonLus: conversations.reduce((sum, c) => sum + c.unreadCount, 0),
    },
  });

  /* ══════════════════════════════════════════
     CopilotKit Actions — Ce que l'IA peut faire
     ══════════════════════════════════════════ */

  // Action : Générer le rapport quotidien
  useCopilotAction({
    name: 'generate_daily_report',
    description: "Génère le rapport d'activité quotidien de l'agent avec stats, visites du jour, prospects chauds et recommandations",
    parameters: [],
    handler: async () => {
      setIsLoading(true);
      try {
        const { data, error } = await generateDailyReport();
        if (error) return `Erreur : ${error.message}`;
        refreshData();
        return data?.report || 'Rapport non disponible';
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Action : Scanner les conversations
  useCopilotAction({
    name: 'scan_conversations',
    description: "Scanne toutes les conversations récentes pour identifier les prospects chauds, créer des visites automatiquement et mettre à jour les scores",
    parameters: [],
    handler: async () => {
      setIsLoading(true);
      try {
        const { data, error } = await scanConversationsForVisits();
        if (error) return `Erreur : ${error.message}`;
        refreshData();

        if (!data.length) return 'Aucune conversation récente à analyser.';

        const created = data.filter(r => r.visitCreated).length;
        const updated = data.filter(r => r.visitUpdated).length;
        const hot = data.filter(r => r.analysis.prospect_score === 'hot').length;

        return `📡 Scan terminé : ${data.length} conversation(s) analysée(s)\n${created > 0 ? `✅ ${created} visite(s) créée(s)\n` : ''}${updated > 0 ? `🔄 ${updated} visite(s) mise(s) à jour\n` : ''}${hot > 0 ? `🔥 ${hot} prospect(s) chaud(s)\n` : ''}\n${data.map(r => `• ${r.prospectName}: ${r.analysis.prospect_score === 'hot' ? '🔥' : r.analysis.prospect_score === 'warm' ? '🟡' : '❄️'} ${r.analysis.score_reason}`).join('\n')}`;
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Action : Relancer un prospect
  useCopilotAction({
    name: 'send_relance',
    description: "Génère un message de relance multi-canal (WhatsApp, Email, SMS) pour un prospect spécifique. Fournir l'ID de la visite.",
    parameters: [
      {
        name: 'visitId',
        type: 'string' as const,
        description: "L'identifiant de la visite du prospect à relancer",
        required: true,
      },
    ],
    handler: async ({ visitId }: { visitId: string }) => {
      setIsLoading(true);
      try {
        const { data, error } = await generateSmartRelance(visitId);
        if (error) return `Erreur : ${error.message}`;
        if (!data) return 'Relance non générée';
        refreshData();
        return `✉️ Relance générée pour ${data.visit.lead_name} :\n\n📱 WhatsApp : ${data.messages.whatsapp}\n\n📧 Email : ${data.messages.email_subject}\n${data.messages.email_body}\n\n💬 SMS : ${data.messages.sms}`;
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Action : Scorer les prospects via LangGraph
  useCopilotAction({
    name: 'score_prospects',
    description: "Analyse et score tous les prospects actifs (Chaud 🔥, Tiède 🟡, Froid ❄️) avec probabilité de signature et actions recommandées. Utilise le workflow LangGraph avancé.",
    parameters: [],
    handler: async () => {
      if (!user) return 'Non authentifié';
      setIsLoading(true);
      try {
        const result = await runAriaWorkflow(
          user.id,
          agentName,
          'Analyse et score tous mes prospects actuels. Identifie les chauds, tièdes et froids avec les probabilités de signature.',
        );
        refreshData();
        return result.response;
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Action : Exécuter le workflow LangGraph complet
  useCopilotAction({
    name: 'aria_workflow',
    description: "Exécute le workflow ARIA complet via LangGraph : classification → enrichissement → IA → scoring → actions. Utilisé pour les demandes complexes nécessitant orchestration multi-étapes.",
    parameters: [
      {
        name: 'message',
        type: 'string' as const,
        description: "Le message ou la demande de l'agent à traiter via le workflow complet",
        required: true,
      },
    ],
    handler: async ({ message }: { message: string }) => {
      if (!user) return 'Non authentifié';
      setIsLoading(true);
      try {
        const result = await runAriaWorkflow(user.id, agentName, message);
        refreshData();
        return result.response;
      } finally {
        setIsLoading(false);
      }
    },
  });

  return {
    visits,
    properties,
    conversations,
    isLoading,
    refreshData,
    agentName,
  };
}
