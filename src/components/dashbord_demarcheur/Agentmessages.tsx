import { useState, useMemo, useCallback } from 'react';
import styles from './AgentMessages.module.css';
import { useMessages } from '@/hooks/useMessages';
import { useAuthContext } from '../../context/AuthContext';
import type { Conversation, Message } from '@/hooks/useMessages';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

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

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DotsVerticalIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

/* ==========================================
   HELPER FUNCTIONS
========================================== */

/** Generate initials from a full name (e.g., "Mamadou Diallo" -> "MD") */
function getInitials(fullName: string | null | undefined): string {
  if (!fullName) return '??';
  const words = fullName.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return fullName.substring(0, 2).toUpperCase();
}

/** Format a date string for conversation list display (e.g., "14:32", "Hier", "Lun", "28 Jan") */
function formatConversationTime(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Same day: show time
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  // Yesterday
  if (diffDays === 1) return 'Hier';

  // Within the last week: show short day name
  if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');
  }

  // Older: show day + month
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

/** Format a date string for message time display (e.g., "14:32") */
function formatMessageTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

/** Format a date string for date separator (e.g., "Aujourd'hui", "Hier", "15 janvier 2025") */
function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();

  if (date.toDateString() === now.toDateString()) return "Aujourd'hui";

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return 'Hier';

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Build property summary string from conversation data */
function buildPropertySummary(conv: Conversation): string | undefined {
  if (!conv.property_title && !conv.property_price) return undefined;
  const parts: string[] = [];
  if (conv.property_title) parts.push(conv.property_title);
  if (conv.property_price) parts.push(conv.property_price);
  return parts.join(' \u2022 ');
}

/** Map a Conversation from the hook to the shape expected by ConversationsPanel */
function mapConversation(conv: Conversation) {
  const name = conv.other_participant?.full_name || 'Utilisateur';
  return {
    id: conv.id,
    name,
    initials: getInitials(conv.other_participant?.full_name),
    type: 'prospect' as const,
    typeLabel: 'Prospect',
    phone: '',
    time: formatConversationTime(conv.last_message?.created_at || conv.updated_at),
    property: buildPropertySummary(conv),
    preview: conv.last_message?.content || 'Aucun message',
    unread: (conv.unread_count ?? 0) > 0,
    online: false,
    propertyDetails: conv.property_title
      ? { title: conv.property_title + (conv.property_location ? ' \u2022 ' + conv.property_location : ''), price: conv.property_price || '' }
      : undefined,
  };
}

interface ChatMessageItem {
  type?: 'date';
  text: string;
  direction?: 'sent' | 'received';
  time?: string;
  read?: boolean;
}

/** Map raw messages into the format expected by ChatPanel (with date separators) */
function mapMessagesToChat(msgs: Message[], currentUserId: string | undefined): ChatMessageItem[] {
  if (!currentUserId) return [];
  const result: ChatMessageItem[] = [];
  let lastDateStr = '';

  for (const msg of msgs) {
    const msgDate = new Date(msg.created_at);
    const dateKey = msgDate.toDateString();

    if (dateKey !== lastDateStr) {
      result.push({ type: 'date', text: formatDateSeparator(msg.created_at) });
      lastDateStr = dateKey;
    }

    result.push({
      direction: msg.sender_id === currentUserId ? 'sent' : 'received',
      text: msg.content,
      time: formatMessageTime(msg.created_at),
      read: msg.sender_id === currentUserId ? msg.read_at !== null : undefined,
    });
  }

  return result;
}

/* ==========================================
   MOCK FALLBACK DATA
========================================== */

const MOCK_CONVERSATIONS = [
  {
    id: 'mock-1',
    name: 'Mamadou Diallo',
    initials: 'MD',
    type: 'prospect' as const,
    typeLabel: 'Prospect',
    phone: '+224 620 12 34 56',
    time: '14:32',
    property: 'F3 Kip\u00e9 \u2022 2,5M GNF',
    preview: 'Bonjour, le F3 est toujours disponible ?',
    unread: true,
    online: true,
    propertyDetails: { title: 'Appartement F3 Meubl\u00e9 \u2022 Kip\u00e9', price: '2 500 000 GNF/mois' },
  },
  {
    id: 'mock-2',
    name: 'Aissatou Barry',
    initials: 'AB',
    type: 'prospect' as const,
    typeLabel: 'Prospect',
    phone: '+224 622 45 67 89',
    time: '13:45',
    property: 'Villa Lambanyi \u2022 4,8M GNF',
    preview: "D'accord pour jeudi 10h, \u00e0 bient\u00f4t !",
    unread: true,
    online: false,
    propertyDetails: { title: 'Villa F4 \u2022 Lambanyi', price: '4 800 000 GNF/mois' },
  },
  {
    id: 'mock-3',
    name: 'S\u00e9kou Camara',
    initials: 'SC',
    type: 'owner' as const,
    typeLabel: 'Proprio',
    phone: '+224 621 98 76 54',
    time: '11:20',
    property: '3 biens en gestion',
    preview: "Avez-vous trouv\u00e9 un locataire pour la villa ?",
    unread: false,
    online: false,
  },
  {
    id: 'mock-4',
    name: 'Ibrahima Bah',
    initials: 'IB',
    type: 'prospect' as const,
    typeLabel: 'Prospect',
    phone: '+224 625 11 22 33',
    time: 'Hier',
    property: 'Studio Nongo \u2022 1,2M GNF',
    preview: "Merci pour la visite, je r\u00e9fl\u00e9chis encore",
    unread: false,
    online: false,
    propertyDetails: { title: 'Studio \u2022 Nongo', price: '1 200 000 GNF/mois' },
  },
  {
    id: 'mock-5',
    name: 'Fatoumata Keita',
    initials: 'FK',
    type: 'prospect' as const,
    typeLabel: 'Nouveau',
    phone: '+224 628 44 55 66',
    time: 'Hier',
    preview: "Bonjour, je cherche un appartement F2...",
    unread: true,
    online: false,
  },
  {
    id: 'mock-6',
    name: 'Ibrahima Sow',
    initials: 'IS',
    type: 'tenant' as const,
    typeLabel: 'Locataire',
    phone: '+224 626 33 44 55',
    time: 'Lun',
    property: 'Villa F5 Kip\u00e9 \u2022 6,5M GNF',
    preview: "Le robinet de la cuisine fuit toujours...",
    unread: false,
    online: false,
    propertyDetails: { title: 'Villa F5 \u2022 Kip\u00e9', price: '6 500 000 GNF/mois' },
  },
  {
    id: 'mock-7',
    name: 'Oumar Diallo',
    initials: 'OD',
    type: 'owner' as const,
    typeLabel: 'Proprio',
    phone: '+224 627 88 99 00',
    time: 'Dim',
    property: 'Studio Cosa \u2022 800K GNF',
    preview: "Ok pour le renouvellement du mandat",
    unread: false,
    online: false,
  },
  {
    id: 'mock-8',
    name: 'Alpha Keita',
    initials: 'AK',
    type: 'prospect' as const,
    typeLabel: 'Prospect',
    phone: '+224 629 11 22 33',
    time: '28 Jan',
    property: 'Duplex Ratoma \u2022 3,2M GNF',
    preview: "Je vous recontacte le mois prochain",
    unread: false,
    online: false,
    propertyDetails: { title: 'Duplex \u2022 Ratoma', price: '3 200 000 GNF/mois' },
  },
];

const MOCK_MESSAGES: ChatMessageItem[] = [
  { type: 'date', text: 'Hier' },
  { direction: 'received', text: "Bonjour Monsieur l'agent, je suis int\u00e9ress\u00e9 par l'appartement F3 \u00e0 Kip\u00e9 que j'ai vu sur ImmoGN.", time: '16:42' },
  { direction: 'sent', text: "Bonjour M. Diallo ! Merci pour votre int\u00e9r\u00eat. Oui, cet appartement est toujours disponible. Il est meubl\u00e9 avec 3 chambres, salon, cuisine \u00e9quip\u00e9e et 2 salles de bain.", time: '16:45', read: true },
  { direction: 'received', text: "Tr\u00e8s bien ! C'est combien le loyer mensuel ? Et il y a des charges en plus ?", time: '16:48' },
  { direction: 'sent', text: "Le loyer est de 2 500 000 GNF par mois. Les charges (eau, \u00e9lectricit\u00e9) sont \u00e0 la charge du locataire. Il y a aussi une caution de 2 mois \u00e0 pr\u00e9voir.", time: '16:52', read: true },
  { direction: 'received', text: "D'accord, c'est dans mon budget. Est-ce que je peux visiter l'appartement ?", time: '17:05' },
  { direction: 'sent', text: "Bien s\u00fbr ! Je suis disponible demain mardi \u00e0 9h ou jeudi \u00e0 14h. Quelle date vous convient le mieux ?", time: '17:10', read: true },
  { direction: 'received', text: "Demain mardi 9h me convient parfaitement. Vous pouvez m'envoyer l'adresse exacte ?", time: '17:15' },
  { direction: 'sent', text: "Parfait ! L'adresse est : Cit\u00e9 Chemin de Fer, Immeuble B, 3\u00e8me \u00e9tage, Kip\u00e9. Je vous enverrai ma position sur WhatsApp demain matin. \u00c0 demain !", time: '17:20', read: true },
  { type: 'date', text: "Aujourd'hui" },
  { direction: 'received', text: "Bonjour, le F3 est toujours disponible ? Je voulais confirmer notre rendez-vous de ce matin.", time: '14:32' },
];

const QUICK_REPLIES = [
  { text: '\u2705 Oui, disponible' },
  { text: '\ud83d\udcc5 Confirmer RDV', gold: true },
  { text: '\ud83d\udccd Envoyer adresse' },
  { text: '\ud83d\ude4f Merci, \u00e0 bient\u00f4t' },
  { text: '\ud83d\udcb0 Infos prix' },
  { text: '\ud83d\udcde Je vous appelle' },
];

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
const ConversationsPanel = ({ conversations, activeConversationId, onSelectConversation, tabs, activeTab, onTabChange }) => (
  <div className={styles.conversationsPanel}>
    <div className={styles.conversationsHeader}>
      <div className={styles.conversationsSearch}>
        <SearchIcon />
        <input type="text" placeholder="Rechercher une conversation..." />
      </div>
      <div className={styles.conversationsTabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.convTab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
            <span className={styles.tabBadge}>{tab.count}</span>
          </button>
        ))}
      </div>
    </div>

    <div className={styles.conversationsList}>
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={`${styles.conversationItem} ${activeConversationId === conv.id ? styles.active : ''} ${conv.unread ? styles.unread : ''}`}
          onClick={() => onSelectConversation(conv.id)}
        >
          <div className={`${styles.convAvatar} ${styles[conv.type]}`}>
            <span>{conv.initials}</span>
            {conv.online && <span className={styles.onlineDot}></span>}
          </div>
          <div className={styles.convContent}>
            <div className={styles.convHeader}>
              <span className={styles.convName}>
                {conv.name}
                <span className={`${styles.convTypeBadge} ${styles[conv.type]}`}>
                  {conv.typeLabel}
                </span>
              </span>
              <span className={styles.convTime}>{conv.time}</span>
            </div>
            {conv.property && (
              <div className={styles.convProperty}>
                <HomeIcon />
                {conv.property}
              </div>
            )}
            <div className={styles.convPreview}>
              {conv.unread && <span className={styles.unreadDot}></span>}
              {conv.preview}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ==========================================
   CHAT PANEL COMPONENT
========================================== */
const ChatPanel = ({ conversation, messages, quickReplies, onSend }: {
  conversation: any;
  messages: ChatMessageItem[];
  quickReplies: { text: string; gold?: boolean }[];
  onSend?: (content: string) => void;
}) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    const text = messageText.trim();
    if (!text) return;
    if (onSend) onSend(text);
    setMessageText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (text: string) => {
    if (onSend) onSend(text);
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

  return (
    <div className={styles.chatPanel}>
      {/* Chat Header */}
      <div className={styles.chatHeader}>
        <div className={styles.chatContact}>
          <div className={`${styles.chatAvatar} ${styles[conversation.type]}`}>
            {conversation.initials}
          </div>
          <div className={styles.chatContactInfo}>
            <h3>
              {conversation.name}
              <span className={`${styles.convTypeBadge} ${styles[conversation.type]}`}>
                {conversation.typeLabel}
              </span>
            </h3>
            <p>
              <PhoneIcon />
              {conversation.phone} • {conversation.online ? 'En ligne' : 'Hors ligne'}
            </p>
          </div>
        </div>
        <div className={styles.chatActions}>
          <a href={`tel:${conversation.phone}`} className={`${styles.chatActionBtn} ${styles.call}`}>
            <PhoneIcon />
          </a>
          <a href={`https://wa.me/${conversation.phone.replace(/\s/g, '')}`} className={`${styles.chatActionBtn} ${styles.whatsapp}`}>
            <WhatsAppIcon />
          </a>
          <a href="#" className={styles.chatActionBtn}>
            <UserIcon />
          </a>
          <button className={styles.chatActionBtn}>
            <DotsVerticalIcon />
          </button>
        </div>
      </div>

      {/* Property Context */}
      {conversation.propertyDetails && (
        <div className={styles.chatPropertyContext}>
          <div className={styles.chatPropertyInfo}>
            <div className={styles.chatPropertyIcon}>
              <HomeIcon />
            </div>
            <div className={styles.chatPropertyDetails}>
              <h4>{conversation.propertyDetails.title}</h4>
              <p>{conversation.propertyDetails.price}</p>
            </div>
          </div>
          <a href="#" className={styles.chatPropertyLink}>
            Voir le bien
            <ChevronRightIcon />
          </a>
        </div>
      )}

      {/* Messages */}
      <div className={styles.chatMessages}>
        {messages.map((item, index) => {
          if (item.type === 'date') {
            return (
              <div key={index} className={styles.dateSeparator}>
                <div className={styles.dateSeparatorLine}></div>
                <span className={styles.dateSeparatorText}>{item.text}</span>
                <div className={styles.dateSeparatorLine}></div>
              </div>
            );
          }

          return (
            <div key={index} className={`${styles.messageGroup} ${styles[item.direction]}`}>
              <div className={`${styles.message} ${styles[item.direction]}`}>
                {item.text}
              </div>
              <span className={styles.messageTime}>
                {item.time}
                {item.direction === 'sent' && item.read && (
                  <span className={`${styles.messageStatus} ${styles.read}`}>
                    <DoubleCheckIcon />
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>

      {/* Quick Replies */}
      <div className={styles.quickReplies}>
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className={`${styles.quickReply} ${reply.gold ? styles.gold : ''}`}
            onClick={() => handleQuickReply(reply.text)}
          >
            {reply.text}
          </button>
        ))}
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
  const {
    conversations: realConversations,
    messages: realMessages,
    activeConversationId: hookActiveConversationId,
    loading,
    setActiveConversationId: hookSetActiveConversationId,
    sendMessage,
    markAsRead,
  } = useMessages();

  const [activeTab, setActiveTab] = useState('all');

  // Determine whether we are using real data or mock fallback
  const useRealData = realConversations.length > 0;

  // Map real conversations to the UI format
  const mappedConversations = useMemo(() => {
    if (!useRealData) return MOCK_CONVERSATIONS;
    return realConversations.map(mapConversation);
  }, [useRealData, realConversations]);

  // Map real messages to the UI format (with date separators)
  const mappedMessages = useMemo(() => {
    if (!useRealData) return MOCK_MESSAGES;
    return mapMessagesToChat(realMessages, user?.id);
  }, [useRealData, realMessages, user?.id]);

  // Active conversation ID: use the hook's value when real data is present,
  // otherwise fall back to the first mock conversation
  const [mockActiveId, setMockActiveId] = useState<string>(MOCK_CONVERSATIONS[0]?.id || '');
  const activeConversationId = useRealData ? hookActiveConversationId : mockActiveId;

  // Select conversation handler
  const handleSelectConversation = useCallback(
    (id: string) => {
      if (useRealData) {
        hookSetActiveConversationId(id);
        markAsRead(id);
      } else {
        setMockActiveId(id);
      }
    },
    [useRealData, hookSetActiveConversationId, markAsRead]
  );

  // Find the active conversation object
  const activeConversation = mappedConversations.find(
    (c) => c.id === activeConversationId
  ) || null;

  // Compute tab counts from mapped conversations
  const tabs = useMemo(() => {
    const all = mappedConversations.length;
    const prospects = mappedConversations.filter((c) => c.type === 'prospect').length;
    const owners = mappedConversations.filter((c) => c.type === 'owner').length;
    const tenants = mappedConversations.filter((c) => c.type === 'tenant').length;
    return [
      { id: 'all', label: 'Tous', count: all },
      { id: 'prospects', label: 'Prospects', count: prospects },
      { id: 'owners', label: 'Proprios', count: owners },
      { id: 'tenants', label: 'Locataires', count: tenants },
    ];
  }, [mappedConversations]);

  // Filter conversations based on the active tab
  const filteredConversations = useMemo(() => {
    if (activeTab === 'all') return mappedConversations;
    const typeMap: Record<string, string> = {
      prospects: 'prospect',
      owners: 'owner',
      tenants: 'tenant',
    };
    const filterType = typeMap[activeTab];
    if (!filterType) return mappedConversations;
    return mappedConversations.filter((c) => c.type === filterType);
  }, [mappedConversations, activeTab]);

  // Send message handler
  const handleSend = useCallback(
    (content: string) => {
      if (useRealData) {
        sendMessage(content);
      }
      // In mock mode, sending is a no-op (messages are static demo data)
    },
    [useRealData, sendMessage]
  );

  // Loading state
  if (loading) {
    return (
      <>
        <TopBar />
        <div className={styles.messagingContainer}>
          <div className={styles.chatPanel}>
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <MessageIcon />
              </div>
              <h3>Chargement...</h3>
              <p>{"R\u00e9cup\u00e9ration de vos conversations en cours."}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />

      <div className={styles.messagingContainer}>
        <ConversationsPanel
          conversations={filteredConversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <ChatPanel
          conversation={activeConversation}
          messages={mappedMessages}
          quickReplies={QUICK_REPLIES}
          onSend={handleSend}
        />
      </div>
    </>
  );
};

export default AgentMessages;