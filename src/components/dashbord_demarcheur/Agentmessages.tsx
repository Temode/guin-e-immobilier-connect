import { useState } from 'react';
import styles from './AgentMessages.module.css';

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

const BuildingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

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

const WhatsAppIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const DotsVerticalIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

/* ==========================================
   SIDEBAR COMPONENT
========================================== */
const Sidebar = ({ agent }) => {
  const navSections = [
    {
      title: 'Menu principal',
      items: [
        { icon: DashboardIcon, label: 'Tableau de bord', href: '#' },
        { icon: BuildingIcon, label: 'Mes biens', badge: 12, badgeGold: true },
        { icon: UsersIcon, label: 'Mes clients', badge: 47 },
        { icon: CalendarIcon, label: 'Agenda & Visites', badge: 3 },
      ],
    },
    {
      title: 'Communication',
      items: [
        { icon: MessageIcon, label: 'Messages', active: true, badge: 8, badgeUrgent: true },
      ],
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <a href="#" className={styles.logo}>
          <div className={styles.logoIcon}>
            <HomeIcon />
          </div>
          <span className={styles.logoText}>
            Immo<span>GN</span>
          </span>
        </a>
      </div>

      <div className={styles.agentProfileMini}>
        <div className={styles.agentAvatarMini}>{agent.initials}</div>
        <div className={styles.agentInfoMini}>
          <h4>{agent.name}</h4>
          <p>Agent Certifié</p>
        </div>
      </div>

      <nav className={styles.sidebarNav}>
        {navSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className={styles.navSection}>
            <span className={styles.navSectionTitle}>{section.title}</span>
            {section.items.map((item, itemIndex) => (
              <a
                key={itemIndex}
                href={item.href || '#'}
                className={`${styles.navItem} ${item.active ? styles.active : ''}`}
              >
                <item.icon />
                {item.label}
                {item.badge && (
                  <span className={`${styles.badge} ${item.badgeUrgent ? styles.urgent : ''} ${item.badgeGold ? styles.gold : ''}`}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
      </nav>
    </aside>
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
const ChatPanel = ({ conversation, messages, quickReplies }) => {
  const [messageText, setMessageText] = useState('');

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
          <button className={styles.sendBtn}>
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
  const [activeTab, setActiveTab] = useState('all');
  const [activeConversationId, setActiveConversationId] = useState(1);

  // Mock Data
  const mockData = {
    agent: {
      name: 'Abdoulaye Diallo',
      initials: 'AD',
    },
    tabs: [
      { id: 'all', label: 'Tous', count: 8 },
      { id: 'prospects', label: 'Prospects', count: 5 },
      { id: 'owners', label: 'Proprios', count: 2 },
      { id: 'tenants', label: 'Locataires', count: 1 },
    ],
    conversations: [
      {
        id: 1,
        name: 'Mamadou Diallo',
        initials: 'MD',
        type: 'prospect',
        typeLabel: 'Prospect',
        phone: '+224 620 12 34 56',
        time: '14:32',
        property: 'F3 Kipé • 2,5M GNF',
        preview: 'Bonjour, le F3 est toujours disponible ?',
        unread: true,
        online: true,
        propertyDetails: {
          title: 'Appartement F3 Meublé • Kipé',
          price: '2 500 000 GNF/mois',
        },
      },
      {
        id: 2,
        name: 'Aissatou Barry',
        initials: 'AB',
        type: 'prospect',
        typeLabel: 'Prospect',
        phone: '+224 622 45 67 89',
        time: '13:45',
        property: 'Villa Lambanyi • 4,8M GNF',
        preview: 'D\'accord pour jeudi 10h, à bientôt !',
        unread: true,
        online: false,
        propertyDetails: {
          title: 'Villa F4 • Lambanyi',
          price: '4 800 000 GNF/mois',
        },
      },
      {
        id: 3,
        name: 'Sékou Camara',
        initials: 'SC',
        type: 'owner',
        typeLabel: 'Proprio',
        phone: '+224 621 98 76 54',
        time: '11:20',
        property: '3 biens en gestion',
        preview: 'Avez-vous trouvé un locataire pour la villa ?',
        unread: false,
        online: false,
      },
      {
        id: 4,
        name: 'Ibrahima Bah',
        initials: 'IB',
        type: 'prospect',
        typeLabel: 'Prospect',
        phone: '+224 625 11 22 33',
        time: 'Hier',
        property: 'Studio Nongo • 1,2M GNF',
        preview: 'Merci pour la visite, je réfléchis encore',
        unread: false,
        online: false,
        propertyDetails: {
          title: 'Studio • Nongo',
          price: '1 200 000 GNF/mois',
        },
      },
      {
        id: 5,
        name: 'Fatoumata Keita',
        initials: 'FK',
        type: 'prospect',
        typeLabel: 'Nouveau',
        phone: '+224 628 44 55 66',
        time: 'Hier',
        preview: 'Bonjour, je cherche un appartement F2...',
        unread: true,
        online: false,
      },
      {
        id: 6,
        name: 'Ibrahima Sow',
        initials: 'IS',
        type: 'tenant',
        typeLabel: 'Locataire',
        phone: '+224 626 33 44 55',
        time: 'Lun',
        property: 'Villa F5 Kipé • 6,5M GNF',
        preview: 'Le robinet de la cuisine fuit toujours...',
        unread: false,
        online: false,
        propertyDetails: {
          title: 'Villa F5 • Kipé',
          price: '6 500 000 GNF/mois',
        },
      },
      {
        id: 7,
        name: 'Oumar Diallo',
        initials: 'OD',
        type: 'owner',
        typeLabel: 'Proprio',
        phone: '+224 627 88 99 00',
        time: 'Dim',
        property: 'Studio Cosa • 800K GNF',
        preview: 'Ok pour le renouvellement du mandat',
        unread: false,
        online: false,
      },
      {
        id: 8,
        name: 'Alpha Keita',
        initials: 'AK',
        type: 'prospect',
        typeLabel: 'Prospect',
        phone: '+224 629 11 22 33',
        time: '28 Jan',
        property: 'Duplex Ratoma • 3,2M GNF',
        preview: 'Je vous recontacte le mois prochain',
        unread: false,
        online: false,
        propertyDetails: {
          title: 'Duplex • Ratoma',
          price: '3 200 000 GNF/mois',
        },
      },
    ],
    messages: [
      { type: 'date', text: 'Hier' },
      {
        direction: 'received',
        text: 'Bonjour Monsieur l\'agent, je suis intéressé par l\'appartement F3 à Kipé que j\'ai vu sur ImmoGN.',
        time: '16:42',
      },
      {
        direction: 'sent',
        text: 'Bonjour M. Diallo ! Merci pour votre intérêt. Oui, cet appartement est toujours disponible. Il est meublé avec 3 chambres, salon, cuisine équipée et 2 salles de bain.',
        time: '16:45',
        read: true,
      },
      {
        direction: 'received',
        text: 'Très bien ! C\'est combien le loyer mensuel ? Et il y a des charges en plus ?',
        time: '16:48',
      },
      {
        direction: 'sent',
        text: 'Le loyer est de 2 500 000 GNF par mois. Les charges (eau, électricité) sont à la charge du locataire. Il y a aussi une caution de 2 mois à prévoir.',
        time: '16:52',
        read: true,
      },
      {
        direction: 'received',
        text: 'D\'accord, c\'est dans mon budget. Est-ce que je peux visiter l\'appartement ?',
        time: '17:05',
      },
      {
        direction: 'sent',
        text: 'Bien sûr ! Je suis disponible demain mardi à 9h ou jeudi à 14h. Quelle date vous convient le mieux ?',
        time: '17:10',
        read: true,
      },
      {
        direction: 'received',
        text: 'Demain mardi 9h me convient parfaitement. Vous pouvez m\'envoyer l\'adresse exacte ?',
        time: '17:15',
      },
      {
        direction: 'sent',
        text: 'Parfait ! L\'adresse est : Cité Chemin de Fer, Immeuble B, 3ème étage, Kipé. Je vous enverrai ma position sur WhatsApp demain matin. À demain !',
        time: '17:20',
        read: true,
      },
      { type: 'date', text: 'Aujourd\'hui' },
      {
        direction: 'received',
        text: 'Bonjour, le F3 est toujours disponible ? Je voulais confirmer notre rendez-vous de ce matin.',
        time: '14:32',
      },
    ],
    quickReplies: [
      { text: '✅ Oui, disponible' },
      { text: '📅 Confirmer RDV', gold: true },
      { text: '📍 Envoyer adresse' },
      { text: '🙏 Merci, à bientôt' },
      { text: '💰 Infos prix' },
      { text: '📞 Je vous appelle' },
    ],
  };

  const activeConversation = mockData.conversations.find(c => c.id === activeConversationId);

  return (
    <div className={styles.appLayout}>
      <Sidebar agent={mockData.agent} />

      <main className={styles.mainContent}>
        <TopBar />

        <div className={styles.messagingContainer}>
          <ConversationsPanel
            conversations={mockData.conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversationId}
            tabs={mockData.tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <ChatPanel
            conversation={activeConversation}
            messages={mockData.messages}
            quickReplies={mockData.quickReplies}
          />
        </div>
      </main>
    </div>
  );
};

export default AgentMessages;