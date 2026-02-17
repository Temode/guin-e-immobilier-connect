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
  type Conversation,
  type Message,
} from '@/services/messagingService';
import styles from './AgentMessages.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const SendIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const DoubleCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 7.21a1 1 0 00-1.42 0l-7.45 7.46-3.13-3.14a1 1 0 00-1.42 1.42l3.84 3.84a1 1 0 001.42 0l8.16-8.16a1 1 0 000-1.42z"/>
    <path d="M12.71 7.21a1 1 0 00-1.42 0L3.84 14.67a1 1 0 101.42 1.42l7.45-7.46 1.42 1.42a1 1 0 001.42-1.42l-1.84-1.42z"/>
  </svg>
);

const PaperClipIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const EmojiIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

/** Group messages by date for date separators */
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
interface ConvPanelProps {
  conversations: Array<{
    id: string;
    name: string;
    initials: string;
    phone: string | null;
    preview: string | null;
    time: string;
    unreadCount: number;
    avatarUrl: string | null;
  }>;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const ConversationsPanel = ({ conversations, activeConversationId, onSelectConversation, searchQuery, onSearchChange }: ConvPanelProps) => {
  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.conversationsPanel}>
      <div className={styles.conversationsHeader}>
        <div className={styles.conversationsSearch}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.conversationsList}>
        {filtered.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8', fontSize: '0.875rem' }}>
            Aucune conversation
          </div>
        )}
        {filtered.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.conversationItem} ${activeConversationId === conv.id ? styles.active : ''} ${conv.unreadCount > 0 ? styles.unread : ''}`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className={styles.convAvatar}>
              {conv.avatarUrl ? (
                <img src={conv.avatarUrl} alt={conv.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <span>{conv.initials}</span>
              )}
            </div>
            <div className={styles.convContent}>
              <div className={styles.convHeader}>
                <span className={styles.convName}>{conv.name}</span>
                <span className={styles.convTime}>{conv.time}</span>
              </div>
              <div className={styles.convPreview}>
                {conv.unreadCount > 0 && <span className={styles.unreadDot}></span>}
                {conv.preview || 'Nouvelle conversation'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   CHAT PANEL COMPONENT
========================================== */
interface ChatPanelProps {
  conversation: ConvPanelProps['conversations'][0] | null;
  messages: Message[];
  currentUserId: string;
  onSendMessage: (text: string) => void;
  loading: boolean;
}

const ChatPanel = ({ conversation, messages, currentUserId, onSendMessage, loading }: ChatPanelProps) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;
    onSendMessage(text);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          <p>Choisissez une conversation dans la liste pour commencer à discuter.</p>
        </div>
      </div>
    );
  }

  const grouped = groupMessagesByDate(messages);

  return (
    <div className={styles.chatPanel}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatContact}>
          <div className={styles.chatAvatar}>
            {conversation.avatarUrl ? (
              <img src={conversation.avatarUrl} alt={conversation.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              conversation.initials
            )}
          </div>
          <div className={styles.chatContactInfo}>
            <h3>{conversation.name}</h3>
            {conversation.phone && (
              <p>
                <PhoneIcon />
                {conversation.phone}
              </p>
            )}
          </div>
        </div>
        <div className={styles.chatActions}>
          {conversation.phone && (
            <a href={`tel:${conversation.phone}`} className={`${styles.chatActionBtn} ${styles.call}`}>
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
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  const loadConversations = useCallback(async () => {
    if (!user) return;
    const { data } = await getUserConversations(user.id);
    setConversations(data);

    // Load unread counts
    const counts: Record<string, number> = {};
    for (const conv of data) {
      counts[conv.id] = await getUnreadCount(conv.id, user.id);
    }
    setUnreadCounts(counts);
  }, [user]);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
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
      setMessages(data);
      setMessagesLoading(false);
      markMessagesAsRead(activeConversationId, user.id);
      setUnreadCounts(prev => ({ ...prev, [activeConversationId]: 0 }));
    });
  }, [activeConversationId, user]);

  // Subscribe to new messages in active conversation
  useEffect(() => {
    if (!activeConversationId || !user) return;

    const unsub = subscribeToMessages(activeConversationId, (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
      if (newMsg.sender_id !== user.id) {
        markMessagesAsRead(activeConversationId, user.id);
      }
    });

    return unsub;
  }, [activeConversationId, user]);

  // Build conversation list for panel
  const convList = conversations.map(conv => {
    const otherParticipant = conv.participants.find(p => p.user_id !== user?.id);
    const name = otherParticipant?.profile?.full_name || 'Utilisateur';
    return {
      id: conv.id,
      name,
      initials: getInitials(name),
      phone: otherParticipant?.profile?.phone || null,
      preview: conv.last_message_text,
      time: conv.last_message_at ? formatTime(conv.last_message_at) : '',
      unreadCount: unreadCounts[conv.id] || 0,
      avatarUrl: otherParticipant?.profile?.avatar_url || null,
    };
  });

  const activeConvData = convList.find(c => c.id === activeConversationId) || null;

  const handleSendMessage = async (text: string) => {
    if (!activeConversationId || !user) return;
    await sendMessage(activeConversationId, user.id, text);
  };

  return (
    <>
      <TopBar />
      <div className={styles.messagingContainer}>
        <ConversationsPanel
          conversations={convList}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <ChatPanel
          conversation={activeConvData}
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
