// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import {
  sendMessageToAria,
  loadChatHistory,
  clearChatHistory,
  generateDailyReport,
  getMonthlyUsage,
  type ChatMessage,
  type AIUsage,
} from '@/services/aiAgentChatService';
import styles from './AgentIAChat.module.css';

/* ─── Welcome suggestion cards ─── */
const SUGGESTIONS = [
  {
    icon: '📋',
    title: 'Rapport du jour',
    desc: 'Visites, prospects et actions prioritaires',
    action: '__DAILY_REPORT__',
  },
  {
    icon: '🔥',
    title: 'Prospects chauds',
    desc: 'Qui est prêt à signer ?',
    action: 'Analyse mes prospects actuels et identifie ceux qui sont prêts à signer.',
  },
  {
    icon: '✉️',
    title: 'Relance prospect',
    desc: 'Message pro multi-canal',
    action: 'Rédige un message de relance professionnel pour un prospect qui n\'a pas répondu depuis 3 jours.',
  },
  {
    icon: '💡',
    title: 'Conseils',
    desc: 'Améliorer mes conversions',
    action: 'Quelles sont tes recommandations pour améliorer mon taux de conversion cette semaine ?',
  },
];

/* ─── Quick-prompt chips (shown in chat mode) ─── */
const QUICK_PROMPTS = [
  { label: '📋 Rapport', text: '__DAILY_REPORT__' },
  { label: '🔥 Prospects', text: 'Analyse mes prospects actuels et identifie ceux qui sont prêts à signer.' },
  { label: '✉️ Relance', text: 'Rédige un message de relance professionnel pour un prospect qui n\'a pas répondu depuis 3 jours.' },
  { label: '📊 Stats', text: 'Donne-moi un bilan de mes performances de la semaine : visites, signatures, taux de conversion.' },
  { label: '📅 Agenda', text: 'Montre-moi mon agenda du jour et les visites prévues.' },
];

/* ─── Helpers ─── */
function fmtTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ─── SVG Icons ─── */
const AriaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const ScanIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

/* ─── Main component ─── */
export default function AgentIAChat() {
  const { user, profile } = useAuthContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [usage, setUsage] = useState<AIUsage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const agentName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Agent';
  const firstName = agentName.includes('@') ? 'Agent' : agentName.split(' ')[0];
  const initials = agentName.includes('@')
    ? '?'
    : agentName.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  /* Load history + usage on mount */
  useEffect(() => {
    if (!user) return;
    loadChatHistory(40).then(({ data }) => {
      setMessages(data);
      setHistoryLoaded(true);
    });
    getMonthlyUsage().then(({ data }) => {
      if (data) setUsage(data);
    });
  }, [user]);

  /* Scroll to bottom on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /* Auto-resize textarea */
  const adjustTextarea = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextarea();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* Refresh usage after each AI call */
  const refreshUsage = useCallback(async () => {
    const { data } = await getMonthlyUsage();
    if (data) setUsage(data);
  }, []);

  /* Handle daily report */
  const handleDailyReport = useCallback(async () => {
    if (isLoading) return;
    setError(null);
    setIsTyping(true);
    setIsLoading(true);

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: 'Génère mon rapport d\'activité du jour',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { data, error: apiError } = await generateDailyReport();

      if (apiError || !data) {
        setError(apiError?.message || 'Impossible de générer le rapport.');
        return;
      }

      const assistantMsg: ChatMessage = {
        id: `ai-report-${Date.now()}`,
        role: 'assistant',
        content: data.report,
        created_at: new Date().toISOString(),
        metadata: { tokens_used: data.tokensUsed, type: 'daily_report' },
      };

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
        const realUserMsg: ChatMessage = { ...tempUserMsg, id: `u-report-${Date.now()}` };
        return [...withoutTemp, realUserMsg, assistantMsg];
      });

      refreshUsage();
    } catch (err) {
      console.error('[ARIA] handleDailyReport error:', err);
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [isLoading, refreshUsage]);

  /* Handle send message */
  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    if (text === '__DAILY_REPORT__') {
      handleDailyReport();
      return;
    }

    setError(null);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Auto-detect write/strategic requests
      const writeKeywords = /\b(ajouter|ajout|créer|crée|planifier|planifie|modifier|modifie|déplacer|déplace|supprimer|supprime|annuler|annule|mettre.*agenda|placer.*agenda|dans.*l.agenda|dans.*agenda|nouveau.*client|ajouter.*client|analyse|rapport|scoring|stratégi)\b/i;
      const forceAdvanced = writeKeywords.test(text);

      const { data, error: apiError } = await sendMessageToAria(text, forceAdvanced);

      if (apiError || !data) {
        setError(apiError?.message || 'ARIA n\'a pas pu répondre. Réessayez.');
        return;
      }

      // Build response content
      let responseContent = data.message;
      if (data.actionsExecuted?.length) {
        responseContent += '\n\n' + data.actionsExecuted.join('\n');
      }

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        created_at: new Date().toISOString(),
        metadata: { tokens_used: data.tokensUsed },
      };

      setMessages((prev) => {
        const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
        const realUserMsg: ChatMessage = { ...tempUserMsg, id: `u-${Date.now()}` };
        return [...withoutTemp, realUserMsg, assistantMsg];
      });

      refreshUsage();
    } catch (err) {
      console.error('[ARIA] handleSend error:', err);
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [input, isLoading, handleDailyReport, refreshUsage]);

  const handleQuickPrompt = (text: string) => {
    if (text === '__DAILY_REPORT__') {
      handleDailyReport();
      return;
    }
    setInput(text);
    setTimeout(() => handleSend(text), 50);
  };

  const handleClear = async () => {
    if (!window.confirm('Effacer l\'historique de conversation ?')) return;
    await clearChatHistory();
    setMessages([]);
  };

  const showWelcome = historyLoaded && messages.length === 0 && !isTyping;

  return (
    <div className={styles.page}>
      {/* ─── Header ─── */}
      <div className={styles.header}>
        <div className={styles.ariaAvatar}>
          <AriaIcon />
        </div>
        <div className={styles.ariaInfo}>
          <h1 className={styles.ariaName}>ARIA</h1>
          <span className={styles.ariaStatus}>En ligne</span>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.btnIcon}
            onClick={() => handleQuickPrompt('[SCAN IA CONVERSATIONS]')}
            title="Scanner les conversations"
            disabled={isLoading}
          >
            <ScanIcon />
          </button>
          <button
            className={`${styles.btnIcon} ${styles.danger}`}
            onClick={handleClear}
            title="Effacer l'historique"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* ─── Quick prompts bar (only when in chat) ─── */}
      {!showWelcome && (
        <div className={styles.quickBar}>
          {QUICK_PROMPTS.map((qp) => (
            <button
              key={qp.label}
              className={styles.quickBtn}
              onClick={() => handleQuickPrompt(qp.text)}
              disabled={isLoading}
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* ─── Error banner ─── */}
      {error && (
        <div className={styles.errorBanner}>
          <span>&#9888;&#65039; {error}</span>
          <button onClick={() => setError(null)}>&#10005;</button>
        </div>
      )}

      {/* ─── Messages ─── */}
      <div className={styles.messagesArea}>
        {showWelcome ? (
          <div className={styles.welcomeState}>
            <div className={styles.welcomeAvatarLarge}>
              <AriaIcon />
            </div>
            <h2 className={styles.welcomeTitle}>Bonjour {firstName} !</h2>
            <p className={styles.welcomeSubtitle}>
              Je suis <strong>ARIA</strong>, ton assistante personnelle. Agenda, prospects, relances — je gère tout pour toi.
            </p>
            <div className={styles.suggestionsGrid}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s.title}
                  className={styles.suggestionCard}
                  onClick={() => handleQuickPrompt(s.action)}
                >
                  <span className={styles.suggestionCardIcon}>{s.icon}</span>
                  <span className={styles.suggestionCardTitle}>{s.title}</span>
                  <span className={styles.suggestionCardDesc}>{s.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${msg.role === 'user' ? styles.user : styles.assistant}`}
              >
                {msg.role === 'assistant' && (
                  <div className={`${styles.bubbleAvatar} ${styles.aria}`}>
                    <AriaIcon />
                  </div>
                )}

                <div>
                  <div className={styles.bubble}>
                    {msg.content}
                  </div>
                  <span className={styles.bubbleMeta}>
                    {fmtTime(msg.created_at)}
                  </span>
                </div>

                {msg.role === 'user' && (
                  <div className={`${styles.bubbleAvatar} ${styles.userAvt}`}>{initials}</div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className={styles.typingRow}>
                <div className={`${styles.bubbleAvatar} ${styles.aria}`}>
                  <AriaIcon />
                </div>
                <div className={styles.typingBubble}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ─── Input area ─── */}
      <div className={styles.inputArea}>
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            className={styles.textarea}
            rows={1}
            placeholder="Message à ARIA..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            title="Envoyer"
          >
            <SendIcon />
          </button>
        </div>
        <p className={styles.inputHint}>
          Entrée pour envoyer · Maj+Entrée pour saut de ligne
        </p>
      </div>
    </div>
  );
}
