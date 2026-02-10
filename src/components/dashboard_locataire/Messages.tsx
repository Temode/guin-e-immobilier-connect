// @ts-nocheck
import React, { useState } from 'react';
import styles from './Messages.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const HomeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DashboardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const PaymentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const NotificationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const VerifiedBadgeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const DotsVerticalIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const AttachmentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const SendIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const QuestionIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ date }) => {
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb}>
        <a href="#">Tableau de bord</a>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Messages</span>
      </nav>
      <div className={styles.headerRight}>
        <span className={styles.headerDate}>{date}</span>
        <button className={styles.headerBtn}>
          <SettingsIcon />
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   CONVERSATIONS PANEL COMPONENT
========================================== */
const ConversationsPanel = ({ 
  conversations, 
  activeConversationId, 
  onSelectConversation,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  unreadCount
}) => {
  const filters = ['Tous', 'Non lus', 'Agents', 'Support'];

  return (
    <div className={styles.conversationsPanel}>
      <div className={styles.conversationsHeader}>
        <h2>
          Conversations
          <span className={styles.unreadCount}>{unreadCount} non lus</span>
        </h2>
        <div className={styles.searchConversations}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.conversationsFilters}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterTab} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className={styles.conversationsList}>
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.conversationItem} ${conv.id === activeConversationId ? styles.active : ''} ${conv.unread ? styles.unread : ''}`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <div className={`${styles.conversationAvatar} ${styles[conv.avatarType]}`}>
              <span>{conv.initials}</span>
              <span className={`${styles.avatarStatus} ${conv.online ? styles.online : styles.offline}`}></span>
            </div>
            <div className={styles.conversationContent}>
              <div className={styles.conversationHeader}>
                <span className={styles.conversationName}>
                  {conv.name}
                  {conv.verified && <VerifiedBadgeIcon className={styles.verifiedIcon} />}
                </span>
                <span className={styles.conversationTime}>{conv.time}</span>
              </div>
              <p className={styles.conversationPreview}>
                {conv.badge && (
                  <span className={`${styles.conversationBadge} ${styles[conv.badge.type]}`}>
                    {conv.badge.label}
                  </span>
                )}
                {conv.preview}
              </p>
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
const ChatPanel = ({ activeContact, messages, onSendMessage }) => {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.chatPanel}>
      <div className={styles.chatHeader}>
        <div className={styles.chatHeaderLeft}>
          <div className={styles.chatAvatar}>{activeContact.initials}</div>
          <div className={styles.chatInfo}>
            <h3>
              {activeContact.name}
              {activeContact.verified && <VerifiedBadgeIcon className={styles.verifiedIcon} />}
            </h3>
            <p>
              <span className={styles.statusDot}></span>
              {activeContact.status} • {activeContact.role}
            </p>
          </div>
        </div>
        <div className={styles.chatHeaderActions}>
          <button className={styles.chatActionBtn}>
            <PhoneIcon />
          </button>
          <button className={styles.chatActionBtn}>
            <DotsVerticalIcon />
          </button>
        </div>
      </div>

      <div className={styles.chatMessages}>
        {messages.map((group, groupIndex) => (
          <React.Fragment key={groupIndex}>
            {group.dateSeparator && (
              <div className={styles.messageDateSeparator}>
                <span>{group.dateSeparator}</span>
              </div>
            )}
            {group.items.map((msg, msgIndex) => (
              <div key={msgIndex} className={`${styles.message} ${styles[msg.type]}`}>
                <div className={styles.messageAvatar}>{msg.initials}</div>
                <div className={styles.messageContent}>
                  <div className={styles.messageBubble}>{msg.text}</div>
                  {msg.attachment && (
                    <div className={styles.messageAttachment}>
                      <div className={styles.attachmentIcon}>
                        <ImageIcon />
                      </div>
                      <div className={styles.attachmentInfo}>
                        <p className={styles.attachmentName}>{msg.attachment.name}</p>
                        <p className={styles.attachmentSize}>{msg.attachment.size}</p>
                      </div>
                      <button className={styles.attachmentDownload}>
                        <DownloadIcon />
                      </button>
                    </div>
                  )}
                  <div className={styles.messageMeta}>
                    <span>{msg.time}</span>
                    {msg.status && (
                      <span className={`${styles.messageStatus} ${styles[msg.status]}`}>
                        <CheckIcon />
                        {msg.status === 'read' && <CheckIcon style={{ marginLeft: '-8px' }} />}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      <div className={styles.chatInputContainer}>
        <div className={styles.chatInputWrapper}>
          <div className={styles.chatInputActions}>
            <button className={styles.inputActionBtn}>
              <AttachmentIcon />
            </button>
            <button className={styles.inputActionBtn}>
              <ImageIcon />
            </button>
          </div>
          <textarea
            className={styles.chatInput}
            rows="1"
            placeholder="Écrivez votre message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button 
            className={styles.sendBtn} 
            onClick={handleSend}
            disabled={!messageText.trim()}
          >
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   QUICK ACTIONS PANEL COMPONENT
========================================== */
const QuickActionsPanel = ({ contact, templates, sharedFiles, onTemplateClick }) => {
  return (
    <div className={styles.quickActionsPanel}>
      <div className={styles.quickActionsHeader}>
        <h3>Informations</h3>
      </div>
      <div className={styles.quickActionsContent}>
        <div className={styles.contactCard}>
          <div className={styles.contactCardAvatar}>{contact.initials}</div>
          <h4>{contact.name}</h4>
          <p className={styles.contactCardRole}>{contact.role}</p>
          <span className={styles.contactCardVerified}>
            <VerifiedBadgeIcon />
            Identité vérifiée
          </span>
          <div className={styles.contactCardActions}>
            <button className={`${styles.contactCardBtn} ${styles.secondary}`}>
              <PhoneIcon />
              Appeler
            </button>
            <button className={`${styles.contactCardBtn} ${styles.primary}`}>
              <UserIcon />
              Profil
            </button>
          </div>
        </div>

        <div className={styles.quickTemplates}>
          <h4>Réponses rapides</h4>
          {templates.map((template, index) => {
            const IconComponent = {
              check: CheckIcon,
              clock: ClockIcon,
              warning: WarningIcon,
              question: QuestionIcon,
            }[template.icon] || CheckIcon;

            return (
              <button
                key={index}
                className={`${styles.templateBtn} ${template.gold ? styles.gold : ''}`}
                onClick={() => onTemplateClick(template.text)}
              >
                <IconComponent />
                {template.label}
              </button>
            );
          })}
        </div>

        <div className={styles.sharedFiles}>
          <h4>Fichiers partagés</h4>
          {sharedFiles.map((file, index) => (
            <div key={index} className={styles.sharedFileItem}>
              <div className={`${styles.sharedFileIcon} ${styles[file.type]}`}>
                {file.type === 'img' ? <ImageIcon /> : <FileIcon />}
              </div>
              <div className={styles.sharedFileInfo}>
                <p className={styles.sharedFileName}>{file.name}</p>
                <p className={styles.sharedFileMeta}>{file.size} • {file.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const Messages = () => {
  const [activeConversationId, setActiveConversationId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');

  // Données mock
  const mockData = {
    user: {
      name: 'Mamadou Bah',
      role: 'Locataire',
      verified: true,
    },
    conversations: [
      {
        id: 1,
        name: 'Abdoulaye Diallo',
        initials: 'AD',
        avatarType: 'agent',
        verified: true,
        online: true,
        time: '10:32',
        preview: "D'accord, je vais programmer l'intervention...",
        badge: { type: 'agent', label: 'Agent' },
        unread: false,
      },
      {
        id: 2,
        name: 'Support ImmoGN',
        initials: 'SP',
        avatarType: 'support',
        verified: false,
        online: true,
        time: 'Hier',
        preview: "Votre document d'identité expire bientôt...",
        badge: { type: 'urgent', label: 'Urgent' },
        unread: true,
      },
      {
        id: 3,
        name: 'M. Sow (Propriétaire)',
        initials: 'MS',
        avatarType: 'owner',
        verified: false,
        online: false,
        time: '28 Jan',
        preview: 'Merci pour votre paiement régulier...',
        badge: null,
        unread: true,
      },
      {
        id: 4,
        name: 'Abdoulaye Diallo',
        initials: 'AD',
        avatarType: 'agent',
        verified: false,
        online: false,
        time: '15 Jan',
        preview: 'Votre état des lieux a été validé ✓',
        badge: null,
        unread: false,
      },
    ],
    activeContact: {
      name: 'Abdoulaye Diallo',
      initials: 'AD',
      verified: true,
      status: 'En ligne',
      role: 'Agent immobilier',
    },
    messages: [
      {
        dateSeparator: "Aujourd'hui",
        items: [
          {
            type: 'received',
            initials: 'AD',
            text: "Bonjour M. Bah, j'espère que vous allez bien. J'ai bien reçu votre signalement concernant la fuite d'eau dans la salle de bain.",
            time: '09:45',
          },
          {
            type: 'received',
            initials: 'AD',
            text: "Pouvez-vous m'envoyer une photo du problème pour que je puisse contacter le plombier avec tous les détails ?",
            time: '09:46',
          },
          {
            type: 'sent',
            initials: 'MB',
            text: 'Bonjour M. Diallo, merci pour votre réponse rapide. Voici les photos de la fuite sous le lavabo.',
            time: '10:15',
            status: 'read',
            attachment: {
              name: 'fuite_lavabo.jpg',
              size: '2.4 Mo',
            },
          },
          {
            type: 'received',
            initials: 'AD',
            text: "Merci pour les photos, c'est très clair. Je vois le problème. D'accord, je vais programmer l'intervention du plombier pour demain matin entre 9h et 11h. Est-ce que ça vous convient ?",
            time: '10:32',
          },
        ],
      },
    ],
    templates: [
      { icon: 'check', label: 'Oui, ça me convient', text: 'Oui, ça me convient parfaitement.' },
      { icon: 'clock', label: "Je préfère l'après-midi", text: "Je préfère l'après-midi si possible." },
      { icon: 'warning', label: 'Signaler un problème urgent', text: "J'ai un problème urgent à signaler.", gold: true },
      { icon: 'question', label: "J'ai une question", text: "J'aurais une question à vous poser." },
    ],
    sharedFiles: [
      { type: 'img', name: 'fuite_lavabo.jpg', size: '2.4 Mo', date: "Aujourd'hui" },
      { type: 'pdf', name: 'etat_des_lieux.pdf', size: '1.2 Mo', date: '15 Jan' },
    ],
  };

  const handleSendMessage = (text) => {
    console.log('Send message:', text);
  };

  const handleTemplateClick = (text) => {
    console.log('Template clicked:', text);
  };

  const unreadCount = mockData.conversations.filter(c => c.unread).length;

  return (
    <>
      <Header date="Dim. 2 Février 2026" />

      <div className={styles.messagesContainer}>
        <ConversationsPanel
          conversations={mockData.conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          unreadCount={unreadCount}
        />

        <ChatPanel
          activeContact={mockData.activeContact}
          messages={mockData.messages}
          onSendMessage={handleSendMessage}
        />

        <QuickActionsPanel
          contact={mockData.activeContact}
          templates={mockData.templates}
          sharedFiles={mockData.sharedFiles}
          onTemplateClick={handleTemplateClick}
        />
      </div>
    </>
  );
};

export default Messages;