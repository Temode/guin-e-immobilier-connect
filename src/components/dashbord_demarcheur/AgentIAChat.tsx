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

/* ─── Quick-prompt suggestions ─── */
const QUICK_PROMPTS = [
  { label: '📋 Rapport du matin', text: '__DAILY_REPORT__' },
  { label: '🔥 Prospects chauds', text: 'Analyse mes prospects actuels et identifie ceux qui sont prêts à signer.' },
  { label: '✉️ Message de relance', text: 'Rédige un message de relance professionnel pour un prospect qui n\'a pas répondu depuis 3 jours.' },
  { label: '📊 Stats semaine', text: 'Donne-moi un bilan de mes performances de la semaine : visites, signatures, taux de conversion.' },
  { label: '💡 Conseils', text: 'Quelles sont tes recommandations pour améliorer mon taux de conversion cette semaine ?' },
];

/* ─── Welcome suggestion chips ─── */
const WELCOME_CHIPS = [
  'Rapport du matin',
  'Analyser mes prospects',
  'Rédiger une relance',
  'Conseils de la semaine',
];

/* ─── Format time ─── */
function fmtTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/* ─── Model label ─── */
function modelLabel(model: string): string {
  if (!model) return '';
  if (model.includes('qwen-max')) return 'Qwen3-Max';
  if (model.includes('qwen-plus')) return 'Qwen3-Plus';
  return model;
}

/* ─── SVG Icons ─── */
const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
  </svg>
);

const SparkleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
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
  const [useAdvanced, setUseAdvanced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [usage, setUsage] = useState<AIUsage | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const agentName = profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Agent';
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

  /* Handle daily report (special quick prompt) */
  const handleDailyReport = useCallback(async () => {
    if (isLoading) return;
    setError(null);
    setIsTyping(true);
    setIsLoading(true);

    // Add a user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: 'Génère mon rapport d\'activité du matin',
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    const { data, error: apiError } = await generateDailyReport();

    setIsTyping(false);
    setIsLoading(false);

    if (apiError || !data) {
      setError(apiError?.message || 'Erreur lors de la génération du rapport.');
      return;
    }

    const assistantMsg: ChatMessage = {
      id: `ai-report-${Date.now()}`,
      role: 'assistant',
      content: data.report,
      created_at: new Date().toISOString(),
      metadata: { model: 'qwen-max', tokens_used: data.tokensUsed, type: 'daily_report' },
    };

    setMessages((prev) => {
      const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
      const realUserMsg: ChatMessage = { ...tempUserMsg, id: `u-report-${Date.now()}` };
      return [...withoutTemp, realUserMsg, assistantMsg];
    });

    refreshUsage();
  }, [isLoading, refreshUsage]);

  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isLoading) return;

    // Handle special daily report trigger
    if (text === '__DAILY_REPORT__') {
      handleDailyReport();
      return;
    }

    setError(null);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Optimistic user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsTyping(true);
    setIsLoading(true);

    const { data, error: apiError } = await sendMessageToAria(text, useAdvanced);

    setIsTyping(false);
    setIsLoading(false);

    if (apiError || !data) {
      setError(apiError?.message || 'Erreur lors de la communication avec ARIA.');
      return;
    }

    // Add assistant response
    const assistantMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: data.message,
      created_at: new Date().toISOString(),
      metadata: { model: data.model, tokens_used: data.tokensUsed },
    };

    // Replace temp user message + add assistant (history already saved server-side)
    setMessages((prev) => {
      const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
      const realUserMsg: ChatMessage = {
        ...tempUserMsg,
        id: `u-${Date.now()}`,
      };
      return [...withoutTemp, realUserMsg, assistantMsg];
    });

    refreshUsage();
  }, [input, isLoading, useAdvanced, handleDailyReport, refreshUsage]);

  const handleQuickPrompt = (text: string) => {
    if (text === '__DAILY_REPORT__') {
      handleDailyReport();
      return;
    }
    setInput(text);
    setTimeout(() => handleSend(text), 50);
  };

  const handleClear = async () => {
    if (!window.confirm('Effacer tout l\'historique de conversation avec ARIA ?')) return;
    await clearChatHistory();
    setMessages([]);
  };

  const handleToggleAdvanced = () => {
    if (!useAdvanced && usage?.limit_reached) {
      setError('Limite de crédits Qwen3-Max atteinte ce mois-ci. Utilisez le mode Rapide (Qwen3-Plus).');
      return;
    }
    setUseAdvanced((v) => !v);
  };

  const showWelcome = historyLoaded && messages.length === 0 && !isTyping;

  return (
    <div className={styles.page}>
      {/* ─── Header ─── */}
      <div className={styles.header}>
        <div className={styles.ariaAvatar}>✨</div>
        <div className={styles.ariaInfo}>
          <h1 className={styles.ariaName}>ARIA — Assistante IA</h1>
          <span className={styles.ariaStatus}>En ligne · Propulsée par Qwent</span>
        </div>

        {/* Usage counter */}
        {usage && (
          <div
            className={styles.usageCounter}
            title={`${usage.advanced_used}/${usage.advanced_limit} messages Qwen3-Max utilisés ce mois`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: '0.75rem',
              fontWeight: 600,
              background: usage.limit_reached ? 'var(--color-error-50, #fef2f2)' : 'var(--color-neutral-50, #f9fafb)',
              color: usage.limit_reached ? 'var(--color-error-600, #dc2626)' : 'var(--color-neutral-600, #4b5563)',
              border: `1px solid ${usage.limit_reached ? 'var(--color-error-200, #fecaca)' : 'var(--color-neutral-200, #e5e7eb)'}`,
            }}
          >
            <span>{usage.limit_reached ? '🚫' : '⚡'}</span>
            <span>{usage.advanced_used}/{usage.advanced_limit}</span>
          </div>
        )}

        {/* Model toggle */}
        <button
          className={`${styles.modelToggle} ${useAdvanced ? styles.advanced : ''}`}
          onClick={handleToggleAdvanced}
          title={useAdvanced ? 'Mode Stratégique (Qwen3-Max) — cliquer pour basculer' : 'Mode Rapide (Qwen3-Plus) — cliquer pour basculer'}
        >
          <SparkleIcon />
          <span>{useAdvanced ? 'Stratégique' : 'Rapide'}</span>
        </button>

        {/* Clear history */}
        <button
          className={`${styles.btnIcon} ${styles.danger}`}
          onClick={handleClear}
          title="Effacer l'historique"
        >
          <TrashIcon />
        </button>
      </div>

      {/* ─── Quick prompts bar ─── */}
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

      {/* ─── Error banner ─── */}
      {error && (
        <div className={styles.errorBanner}>
          ⚠️ {error}
        </div>
      )}

      {/* ─── Messages ─── */}
      <div className={styles.messagesArea}>
        {showWelcome ? (
          <div className={styles.welcomeState}>
            <div className={styles.welcomeIcon}>✨</div>
            <h2>Bonjour {agentName.split(' ')[0]} !</h2>
            <p>
              Je suis <strong>ARIA</strong>, votre assistante IA dédiée propulsée par Qwent. Je connais votre agenda,
              vos prospects et le marché immobilier guinéen. Comment puis-je vous aider aujourd'hui ?
            </p>
            <div className={styles.welcomeSuggestions}>
              {WELCOME_CHIPS.map((chip) => (
                <button
                  key={chip}
                  className={styles.suggestionChip}
                  onClick={() => {
                    const found = QUICK_PROMPTS.find((q) => q.label.includes(chip.split(' ')[0]));
                    handleQuickPrompt(found ? found.text : chip);
                  }}
                >
                  {chip}
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
                {/* Avatar */}
                {msg.role === 'assistant' && (
                  <div className={`${styles.bubbleAvatar} ${styles.aria}`}>✨</div>
                )}

                <div>
                  <div className={styles.bubble}>
                    {msg.content}
                  </div>
                  <span className={styles.bubbleMeta}>
                    {fmtTime(msg.created_at)}
                    {msg.role === 'assistant' && msg.metadata?.model && (
                      <> · {modelLabel(msg.metadata.model)}</>
                    )}
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
                <div className={`${styles.bubbleAvatar} ${styles.aria}`}>✨</div>
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
            placeholder="Écrivez un message à ARIA… (Entrée pour envoyer)"
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
          Mode : {useAdvanced ? '⚡ Stratégique (Qwen3-Max)' : '🚀 Rapide (Qwen3-Plus)'}
          {usage && ` · ${usage.advanced_used}/${usage.advanced_limit} avancés`}
          {' '}· Maj+Entrée pour saut de ligne
        </p>
      </div>
    </div>
  );
}
