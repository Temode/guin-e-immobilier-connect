// @ts-nocheck
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
  subscribeToConversations,
  getUnreadCount,
  getOrCreateConversation,
  searchUsers,
  type Conversation,
  type Message,
} from '@/services/messagingService';
import styles from './AgentMessages.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const MessageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const DoubleCheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 7.21a1 1 0 00-1.42 0l-7.45 7.46-3.13-3.14a1 1 0 00-1.42 1.42l3.84 3.84a1 1 0 001.42 0l8.16-8.16a1 1 0 000-1.42z"/>
    <path d="M12.71 7.21a1 1 0 00-1.42 0L3.84 14.67a1 1 0 101.42 1.42l7.45-7.46 1.42 1.42a1 1 0 001.42-1.42l-1.84-1.42z"/>
  </svg>
);

const PaperClipIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const EmojiIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ==========================================
   HELPERS
========================================== */
function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Hier';
  } else if (diffDays < 7) {
    return d.toLocaleDateString('fr-FR', { weekday: 'short' });
  }
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatDateSeparator(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function groupMessagesByDate(messages: Message[]): Array<{ type: 'date'; text: string } | { type: 'message'; msg: Message }> {
  const items: Array<{ type: 'date'; text: string } | { type: 'message'; msg: Message }> = [];
  let lastDate = '';

  for (const msg of messages) {
    const dateKey = new Date(msg.created_at).toDateString();
    if (dateKey !== lastDate) {
      items.push({ type: 'date', text: formatDateSeparator(msg.created_at) });
      lastDate = dateKey;
    }
    items.push({ type: 'message', msg });
  }
  return items;
}

/* ==========================================
   NEW CONVERSATION MODAL
========================================== */
const NewConversationModal = ({ currentUserId, onClose, onConversationCreated }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      const { data } = await searchUsers(query, currentUserId);
      setResults(data || []);
      setLoading(false);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, currentUserId]);

  const handleSelect = async (userId) => {
    setCreating(userId);
    const { data: convId } = await getOrCreateConversation(currentUserId, userId);
    setCreating(null);
    if (convId) {
      onConversationCreated(convId);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: 'white', borderRadius: '16px', width: '400px', maxWidth: '90vw',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', overflow: 'hidden',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0F172A', margin: 0 }}>Nouvelle conversation</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center' }}>
            <CloseIcon style={{ width: 20, height: 20 }} />
          </button>
        </div>
        <div style={{ padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: 10, background: '#F8FAFC', marginBottom: 12 }}>
            <SearchIcon style={{ width: 18, height: 18, color: '#94A3B8', flexShrink: 0 }} />
            <input
              autoFocus
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.9rem', color: '#1E293B', width: '100%' }}
            />
          </div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {loading && <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem', padding: '16px 0' }}>Recherche...</p>}
            {!loading && query.length >= 2 && results.length === 0 && (
              <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem', padding: '16px 0' }}>Aucun utilisateur trouvé</p>
            )}
            {!loading && query.length < 2 && (
              <p style={{ textAlign: 'center', color: '#CBD5E1', fontSize: '0.85rem', padding: '16px 0' }}>Tapez au moins 2 caractères</p>
            )}
            {results.map(user => (
              <div key={user.id}
                onClick={() => !creating && handleSelect(user.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                  borderRadius: 10, cursor: creating ? 'wait' : 'pointer',
                  opacity: creating === user.id ? 0.7 : 1,
                  transition: '150ms',
                  background: creating === user.id ? '#FFF7ED' : 'transparent',
                }}
                onMouseEnter={e => { if (!creating) e.currentTarget.style.background = '#F8FAFC'; }}
                onMouseLeave={e => { if (!creating) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #F97316, #9A3412)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 600, fontSize: '0.9rem',
                }}>
                  {user.avatar_url ? <img src={user.avatar_url} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} alt="" /> : getInitials(user.full_name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: '#1E293B', margin: 0, fontSize: '0.9rem' }}>{user.full_name || 'Utilisateur'}</p>
                  {user.phone && <p style={{ color: '#64748B', margin: 0, fontSize: '0.8rem' }}>{user.phone}</p>}
                </div>
                {creating === user.id && <span style={{ fontSize: '0.8rem', color: '#F97316' }}>...</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => (
  <header className={styles.topBar}>
    <div className={styles.topBarLeft}>
      <h1 className={styles.pageTitle}>Messages</h1>
    </div>
    <div className={styles.topBarRight}>
      <button className={styles.iconBtn}>
        <SettingsIcon />
      </button>
    </div>
  </header>
);

/* ==========================================
   CONVERSATIONS PANEL COMPONENT
========================================== */
const ConversationsPanel = ({ conversations, activeConversationId, onSelectConversation, searchQuery, onSearchChange, currentUserId, onNewConversation }) => {
  const filtered = conversations.filter(c => {
    const otherParticipant = c.participants?.find(p => p.user_id !== currentUserId);
    const name = otherParticipant?.profile?.full_name || '';
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={styles.conversationsPanel}>
      <div className={styles.conversationsHeader}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className={styles.conversationsSearch}>
            <SearchIcon />
            <input
              type="text"
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <button
            onClick={onNewConversation}
            title="Nouvelle conversation"
            style={{
              width: 34, height: 34, borderRadius: 8, flexShrink: 0, marginLeft: 8,
              border: '1px solid #E2E8F0', background: 'white',
              color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: '150ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#FFF7ED'}
            onMouseLeave={e => e.currentTarget.style.background = 'white'}
          >
            <PlusIcon style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>

      <div className={styles.conversationsList}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
            Aucune conversation
          </div>
        )}
        {filtered.map((conv) => {
          const otherParticipant = conv.participants?.find(p => p.user_id !== currentUserId);
          const name = otherParticipant?.profile?.full_name || 'Utilisateur';
          const initials = getInitials(name);
          const avatarUrl = otherParticipant?.profile?.avatar_url || null;

          return (
            <div
              key={conv.id}
              className={`${styles.conversationItem} ${activeConversationId === conv.id ? styles.active : ''}`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className={styles.convAvatar}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className={styles.convContent}>
                <div className={styles.convHeader}>
                  <span className={styles.convName}>{name}</span>
                  <span className={styles.convTime}>{conv.last_message_at ? formatTime(conv.last_message_at) : ''}</span>
                </div>
                <div className={styles.convPreview}>
                  {conv.last_message_text || 'Nouvelle conversation'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================
   CHAT PANEL COMPONENT
========================================== */
const ChatPanel = ({ conversation, messages, currentUserId, onSendMessage, loading }) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;
    onSendMessage(text);
    setMessageText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!conversation) {
    return (
      <div className={styles.chatPanel}>
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <MessageIcon />
          </div>
          <h3>Sélectionnez une conversation</h3>
          <p>Choisissez une conversation dans la liste ou démarrez-en une nouvelle avec le bouton "+".</p>
        </div>
      </div>
    );
  }

  const otherParticipant = conversation.participants?.find(p => p.user_id !== currentUserId);
  const otherName = otherParticipant?.profile?.full_name || 'Utilisateur';
  const otherInitials = getInitials(otherName);
  const otherPhone = otherParticipant?.profile?.phone || null;
  const otherAvatar = otherParticipant?.profile?.avatar_url || null;

  const grouped = groupMessagesByDate(messages);

  return (
    <div className={styles.chatPanel}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatContact}>
          <div className={styles.chatAvatar}>
            {otherAvatar ? (
              <img src={otherAvatar} alt={otherName} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              otherInitials
            )}
          </div>
          <div className={styles.chatContactInfo}>
            <h3>{otherName}</h3>
            {otherPhone && (
              <p>
                <PhoneIcon />
                {otherPhone}
              </p>
            )}
          </div>
        </div>
        <div className={styles.chatActions}>
          {otherPhone && (
            <a href={`tel:${otherPhone}`} className={`${styles.chatActionBtn} ${styles.call}`}>
              <PhoneIcon />
            </a>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className={styles.chatMessages}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8' }}>Chargement...</div>
        ) : messages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
            Aucun message. Envoyez le premier !
          </div>
        ) : (
          grouped.map((item, index) => {
            if (item.type === 'date') {
              return (
                <div key={`date-${index}`} className={styles.dateSeparator}>
                  <div className={styles.dateSeparatorLine}></div>
                  <span className={styles.dateSeparatorText}>{item.text}</span>
                  <div className={styles.dateSeparatorLine}></div>
                </div>
              );
            }

            const msg = item.msg;
            const direction = msg.sender_id === currentUserId ? 'sent' : 'received';

            return (
              <div key={msg.id} className={`${styles.messageGroup} ${styles[direction]}`}>
                <div className={`${styles.message} ${styles[direction]}`}>
                  {msg.content}
                </div>
                <span className={styles.messageTime}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  {direction === 'sent' && msg.read && (
                    <span className={`${styles.messageStatus} ${styles.read}`}>
                      <DoubleCheckIcon />
                    </span>
                  )}
                </span>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className={styles.chatInputContainer}>
        <div className={styles.chatInputWrapper}>
          <div className={styles.chatInput}>
            <textarea
              placeholder="Écrire un message..."
              rows={1}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className={styles.chatInputActions}>
              <button className={styles.inputActionBtn} title="Joindre un fichier">
                <PaperClipIcon />
              </button>
              <button className={styles.inputActionBtn} title="Emoji">
                <EmojiIcon />
              </button>
            </div>
          </div>
          <button className={styles.sendBtn} onClick={handleSend}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentMessages = () => {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewConvModal, setShowNewConvModal] = useState(false);

  const loadConversations = useCallback(async () => {
    if (!user) return [];
    const { data } = await getUserConversations(user.id);
    setConversations(data || []);
    return data || [];
  }, [user]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations().then((data) => {
      if (data && data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    });
  }, [loadConversations]);

  // Subscribe to conversation updates
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToConversations(user.id, loadConversations);
    return unsub;
  }, [user, loadConversations]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId || !user) return;

    setMessagesLoading(true);
    getConversationMessages(activeConversationId).then(({ data }) => {
      setMessages(data || []);
      setMessagesLoading(false);
      markMessagesAsRead(activeConversationId, user.id);
    });
  }, [activeConversationId, user]);

  // Subscribe to new messages in active conversation
  useEffect(() => {
    if (!activeConversationId || !user) return;

    const unsub = subscribeToMessages(activeConversationId, (newMsg) => {
      setMessages(prev => {
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (newMsg.sender_id !== user.id) {
        markMessagesAsRead(activeConversationId, user.id);
      }
    });

    return unsub;
  }, [activeConversationId, user]);

  const activeConversation = conversations.find(c => c.id === activeConversationId) || null;

  const handleSendMessage = async (text: string) => {
    if (!activeConversationId || !user) return;
    await sendMessage(activeConversationId, user.id, text);
  };

  const handleNewConversationCreated = async (convId: string) => {
    await loadConversations();
    setActiveConversationId(convId);
  };

  return (
    <>
      {showNewConvModal && user && (
        <NewConversationModal
          currentUserId={user.id}
          onClose={() => setShowNewConvModal(false)}
          onConversationCreated={handleNewConversationCreated}
        />
      )}
      <TopBar />
      <div className={styles.messagingContainer}>
        <ConversationsPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUserId={user?.id}
          onNewConversation={() => setShowNewConvModal(true)}
        />
        <ChatPanel
          conversation={activeConversation}
          messages={messages}
          currentUserId={user?.id || ''}
          onSendMessage={handleSendMessage}
          loading={messagesLoading}
        />
      </div>
    </>
  );
};

export default AgentMessages;
