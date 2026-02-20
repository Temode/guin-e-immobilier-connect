// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Messages.module.css';
import { useAuthContext } from '@/context/AuthContext';
import {
  getUserConversations,
  getConversationMessages,
  sendMessage,
  markMessagesAsRead,
  subscribeToMessages,
  subscribeToConversations,
  getOrCreateConversation,
  type Conversation,
  type Message,
} from '@/services/messagingService';

/* ==========================================
   ICONS COMPONENTS
========================================== */
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

const SendIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const VerifiedBadgeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmptyIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

/* ==========================================
   HELPERS
========================================== */
function getInitials(name: string | null): string {
  if (!name) return '?';
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

function formatDateSeparator(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Aujourd'hui";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Hier';
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
}

function groupMessagesByDate(messages: Message[]): Array<{ type: 'date'; text: string } | { type: 'message'; msg: Message }> {
  const result: Array<{ type: 'date'; text: string } | { type: 'message'; msg: Message }> = [];
  let lastDate = '';
  for (const msg of messages) {
    const date = new Date(msg.created_at).toDateString();
    if (date !== lastDate) {
      result.push({ type: 'date', text: formatDateSeparator(msg.created_at) });
      lastDate = date;
    }
    result.push({ type: 'message', msg });
  }
  return result;
}

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ date }) => (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <nav className={styles.breadcrumb}>
        <span>ImmoGN</span>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Messages</span>
      </nav>
      <h1 className={styles.pageTitle}>Messages</h1>
    </div>
    <div className={styles.headerRight}>
      <span className={styles.headerDate}>{date}</span>
      <button className={styles.headerBtn}><SettingsIcon /></button>
    </div>
  </header>
);

/* ==========================================
   CONVERSATIONS PANEL
========================================== */
const ConversationsPanel = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  unreadCount,
  currentUserId,
}) => {
  const filters = [
    { id: 'Tous', label: 'Tous' },
    { id: 'Non lus', label: `Non lus${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
    { id: 'Agents', label: 'Agents' },
  ];

  const filtered = conversations.filter((conv) => {
    const otherParticipant = conv.participants?.find((p) => p.user_id !== currentUserId);
    const name = otherParticipant?.profile?.full_name || '';
    const lastMsg = conv.last_message_text || '';

    const matchesSearch = !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lastMsg.toLowerCase().includes(searchQuery.toLowerCase());

    // For filter - we'll treat all as 'Agents' since tenant talks to agent
    const matchesFilter =
      activeFilter === 'Tous' ||
      (activeFilter === 'Non lus' /* TODO: track unread per conv */) ||
      activeFilter === 'Agents';

    return matchesSearch;
  });

  return (
    <div className={styles.conversationsPanel}>
      <div className={styles.conversationsHeader}>
        <h3>Conversations</h3>
      </div>
      <div className={styles.searchBar}>
        <SearchIcon />
        <input
          type="text"
          placeholder="Rechercher un message..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className={styles.filterTabs}>
        {filters.map((f) => (
          <button
            key={f.id}
            className={`${styles.filterTab} ${activeFilter === f.id ? styles.activeTab : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className={styles.convList}>
        {filtered.length === 0 ? (
          <div className={styles.emptyConv}>
            <EmptyIcon />
            <p>Aucune conversation</p>
          </div>
        ) : (
          filtered.map((conv) => {
            const other = conv.participants?.find((p) => p.user_id !== currentUserId);
            const name = other?.profile?.full_name || 'Utilisateur';
            const initials = getInitials(name);
            const isActive = conv.id === activeConversationId;
            return (
              <div
                key={conv.id}
                className={`${styles.convItem} ${isActive ? styles.convActive : ''}`}
                onClick={() => onSelectConversation(conv.id)}
              >
                <div className={styles.convAvatar}>
                  {other?.profile?.avatar_url ? (
                    <img src={other.profile.avatar_url} alt={name} />
                  ) : (
                    <span>{initials}</span>
                  )}
                  <div className={styles.onlineDot}></div>
                </div>
                <div className={styles.convInfo}>
                  <div className={styles.convTopRow}>
                    <span className={styles.convName}>{name}</span>
                    <span className={styles.convTime}>
                      {conv.last_message_at ? formatTime(conv.last_message_at) : ''}
                    </span>
                  </div>
                  <p className={styles.convPreview}>
                    {conv.last_message_text || 'Démarrez la conversation'}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

/* ==========================================
   CHAT PANEL
========================================== */
const ChatPanel = ({ conversation, messages, currentUserId, onSendMessage, loading, otherParticipant }) => {
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const otherName = otherParticipant?.profile?.full_name || 'Utilisateur';
  const otherInitials = getInitials(otherName);
  const grouped = groupMessagesByDate(messages);

  if (!conversation) {
    return (
      <div className={styles.chatPanel}>
        <div className={styles.noChatSelected}>
          <EmptyIcon />
          <p>Sélectionnez une conversation pour afficher les messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderInfo}>
          <div className={styles.chatAvatar}>
            {otherParticipant?.profile?.avatar_url ? (
              <img src={otherParticipant.profile.avatar_url} alt={otherName} />
            ) : (
              <span>{otherInitials}</span>
            )}
          </div>
          <div>
            <p className={styles.chatName}>{otherName}</p>
            <p className={styles.chatStatus}>Agent immobilier</p>
          </div>
        </div>
        <div className={styles.chatHeaderActions}>
          {otherParticipant?.profile?.phone && (
            <a href={`tel:${otherParticipant.profile.phone}`} className={styles.headerBtn}>
              <PhoneIcon />
            </a>
          )}
        </div>
      </div>

      <div className={styles.chatMessages}>
        {loading ? (
          <div className={styles.chatLoading}>Chargement...</div>
        ) : grouped.length === 0 ? (
          <div className={styles.chatEmpty}>
            <p>Démarrez la conversation en envoyant un message</p>
          </div>
        ) : (
          grouped.map((item, i) => {
            if (item.type === 'date') {
              return <div key={i} className={styles.dateSeparator}><span>{item.text}</span></div>;
            }
            const msg = item.msg;
            const isSent = msg.sender_id === currentUserId;
            return (
              <div key={msg.id} className={`${styles.messageGroup} ${isSent ? styles.sent : styles.received}`}>
                {!isSent && (
                  <div className={styles.msgAvatar}>
                    {otherParticipant?.profile?.avatar_url ? (
                      <img src={otherParticipant.profile.avatar_url} alt={otherName} />
                    ) : (
                      <span>{otherInitials}</span>
                    )}
                  </div>
                )}
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>{msg.content}</div>
                  <span className={styles.messageTime}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {isSent && <span className={styles.readStatus}>{msg.read ? ' ✓✓' : ' ✓'}</span>}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.chatInputBar}>
        <textarea
          className={styles.chatInput}
          placeholder="Écrire un message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button className={styles.sendBtn} onClick={handleSend} disabled={!text.trim()}>
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN MESSAGES COMPONENT
========================================== */
const Messages = () => {
  const { user } = useAuthContext();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const pendingContactRef = useRef(false);

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  // Load conversations
  const loadConversations = async () => {
    if (!user) return;
    const { data } = await getUserConversations(user.id);
    setConversations(data || []);
    setLoadingConvs(false);
    return data || [];
  };

  // Handle navigation from PropertyDetail — auto-create/open conversation with agent
  useEffect(() => {
    if (!user || pendingContactRef.current) return;
    const state = location.state as { agentId?: string } | null;
    if (!state?.agentId) return;

    pendingContactRef.current = true;
    (async () => {
      const { data: convId } = await getOrCreateConversation(user.id, state.agentId);
      const convs = await loadConversations();
      if (convId) {
        setActiveConversationId(convId);
      } else if (convs.length > 0) {
        setActiveConversationId(convs[0].id);
      }
      // Clear navigation state so it doesn't re-trigger
      window.history.replaceState({}, '');
    })();
  }, [user, location.state]);

  // Load conversations on mount
  useEffect(() => {
    if (!user) return;
    loadConversations().then((data) => {
      if (data && data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    });

    const unsub = subscribeToConversations(user.id, () => loadConversations());
    return unsub;
  }, [user]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId || !user) return;
    setLoadingMsgs(true);
    getConversationMessages(activeConversationId).then(({ data }) => {
      setMessages(data || []);
      setLoadingMsgs(false);
      markMessagesAsRead(activeConversationId, user.id);
    });

    const unsub = subscribeToMessages(activeConversationId, (newMsg) => {
      setMessages((prev) => {
        // Avoid duplicates (realtime can echo our own sent message)
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
      if (newMsg.sender_id !== user.id) {
        markMessagesAsRead(activeConversationId, user.id);
      }
    });

    return unsub;
  }, [activeConversationId, user]);

  const handleSendMessage = async (text: string) => {
    if (!user || !activeConversationId) return;
    await sendMessage(activeConversationId, user.id, text);
    // Realtime subscription will pick up the new message — no manual push needed
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;
  const otherParticipant = activeConversation?.participants?.find((p) => p.user_id !== user?.id);
  const unreadCount = 0; // TODO: track per-conversation

  return (
    <>
      <Header date={today} />
      <div className={styles.messagesContainer}>
        <ConversationsPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          unreadCount={unreadCount}
          currentUserId={user?.id}
        />
        <ChatPanel
          conversation={activeConversation}
          messages={messages}
          currentUserId={user?.id}
          onSendMessage={handleSendMessage}
          loading={loadingMsgs}
          otherParticipant={otherParticipant}
        />
      </div>
    </>
  );
};

export default Messages;
