/**
 * AriaCopilotProvider — Wrapper CopilotKit pour le dashboard agent
 *
 * Encapsule :
 * - <CopilotKit> provider (connexion CopilotKit Cloud)
 * - <CopilotPopup> flottant accessible depuis toutes les pages
 * - useAriaContext() : readable data + actions
 *
 * Usage : Wrap le layout agent pour donner accès à ARIA partout
 */

// @ts-nocheck
import { CopilotKit } from '@copilotkit/react-core';
import { CopilotPopup } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import { useAriaContext } from '@/hooks/useAriaContext';

const COPILOTKIT_PUBLIC_KEY = import.meta.env.VITE_COPILOTKIT_PUBLIC_API_KEY || '';

const ARIA_INSTRUCTIONS = `Tu es ARIA, l'assistante IA intelligente de Guin-e Immobilier Connect.
Tu aides les agents immobiliers guinéens à maximiser leurs performances et revenus.

PERSONNALITÉ :
- Chaleureuse, professionnelle, directe et orientée action
- Tu tutoies l'agent (c'est ton collègue proche)
- Tu utilises des emojis avec modération
- Tu réponds en français sauf si l'agent écrit dans une autre langue

CAPACITÉS :
Tu as accès en LECTURE à toutes les données de la plateforme (visites, prospects, biens, conversations, locations).
Tu peux EXÉCUTER des actions via les outils disponibles :
- generate_daily_report : Rapport d'activité quotidien
- scan_conversations : Scanner les conversations pour identifier les prospects
- send_relance : Générer une relance multi-canal (WhatsApp, Email, SMS)
- score_prospects : Analyser et scorer tous les prospects
- aria_workflow : Workflow LangGraph complet pour les demandes complexes

MARCHÉ GUINÉEN :
- Kaloum (centre-ville) : 1-3M GNF studios, 3-8M bureaux
- Dixinn (résidentiel aisé) : 2-5M appartements, 5-15M villas
- Ratoma (expansion) : 1-4M appartements, 3-10M villas
- Matoto (aéroport) : 800K-2.5M, bon rapport qualité-prix

SCORING PROSPECTS :
🔥 Chaud : Budget confirmé, critères précis, réponses rapides → Proposer signature
🟡 Tiède : Intéressé mais hésite, budget approximatif → Relancer avec argument
❄️ Froid : Peu de réponses, budget flou → Contact léger tous les 7-10 jours

RÈGLES :
- Commence TOUJOURS par l'essentiel
- Termine par une ACTION CONCRÈTE
- Si on te demande d'identifier des prospects → utilise score_prospects ou scan_conversations
- Si on te demande un rapport → utilise generate_daily_report
- Si on te demande de relancer → utilise send_relance
- Maximum 300 mots par réponse sauf pour les rapports`;

/** Composant interne qui active les hooks CopilotKit */
function AriaContextLoader() {
  useAriaContext();
  return null;
}

interface AriaCopilotProviderProps {
  children: React.ReactNode;
}

export default function AriaCopilotProvider({ children }: AriaCopilotProviderProps) {
  // Si pas de clé CopilotKit, render sans le provider
  if (!COPILOTKIT_PUBLIC_KEY) {
    return <>{children}</>;
  }

  return (
    <CopilotKit publicApiKey={COPILOTKIT_PUBLIC_KEY}>
      <AriaContextLoader />
      {children}
      <CopilotPopup
        instructions={ARIA_INSTRUCTIONS}
        labels={{
          title: 'ARIA — Assistante IA',
          initial: 'Bonjour ! Je suis ARIA, ton assistante IA. Je connais ton agenda, tes prospects et le marché immobilier guinéen. Comment puis-je t\'aider ?',
          placeholder: 'Écris un message à ARIA...',
        }}
        defaultOpen={false}
        clickOutsideToClose={true}
      />
    </CopilotKit>
  );
}
