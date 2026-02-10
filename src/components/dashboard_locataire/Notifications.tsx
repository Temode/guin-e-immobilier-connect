import React, { useState } from 'react';
import styles from './Notifications.module.css';

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

const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const VerifiedBadgeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UploadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ReceiptIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
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
        <span className={styles.breadcrumbCurrent}>Notifications</span>
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
   PAGE HEADER COMPONENT
========================================== */
const PageHeader = ({ newCount, onMarkAllRead }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderLeft}>
        <h1>
          Notifications
          <span className={styles.pageTitleBadge}>{newCount} nouvelles</span>
        </h1>
        <p>Restez informé de toutes les activités liées à votre location</p>
      </div>
      <div className={styles.pageActions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onMarkAllRead}>
          <CheckIcon />
          Tout marquer comme lu
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   URGENT BANNER COMPONENT
========================================== */
const UrgentBanner = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className={styles.urgentBanner}>
      <div className={styles.urgentIcon}>
        <WarningIcon />
      </div>
      <div className={styles.urgentContent}>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <button className={styles.urgentAction} onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
};

/* ==========================================
   FILTERS COMPONENT
========================================== */
const NotificationFilters = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className={styles.notificationsFilters}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
          <span className={styles.count}>{filter.count}</span>
        </button>
      ))}
    </div>
  );
};

/* ==========================================
   NOTIFICATION ITEM COMPONENT
========================================== */
const NotificationItem = ({ notification, onAction }) => {
  const iconMap = {
    payment: CheckCircleIcon,
    document: DocumentIcon,
    message: MessageIcon,
    system: InfoIcon,
    alert: ClockIcon,
    receipt: ReceiptIcon,
  };

  const IconComponent = iconMap[notification.iconType] || InfoIcon;

  return (
    <div
      className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''} ${notification.urgent ? styles.urgent : ''}`}
    >
      <div className={`${styles.notificationIcon} ${styles[notification.iconType]}`}>
        <IconComponent />
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <span className={styles.notificationTitle}>
            {notification.title}
            {notification.badge && (
              <span className={`${styles.notificationBadge} ${styles[notification.badge.type]}`}>
                {notification.badge.label}
              </span>
            )}
          </span>
          <span className={styles.notificationTime}>{notification.time}</span>
        </div>
        <p className={styles.notificationText}>{notification.text}</p>
        {notification.actions && notification.actions.length > 0 && (
          <div className={styles.notificationActions}>
            {notification.actions.map((action, index) => (
              <button
                key={index}
                className={`${styles.notifActionBtn} ${styles[action.type]}`}
                onClick={() => onAction(notification.id, action.action)}
              >
                {action.icon === 'upload' && <UploadIcon />}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ==========================================
   NOTIFICATION GROUP COMPONENT
========================================== */
const NotificationGroup = ({ title, notifications, onAction }) => {
  return (
    <div className={styles.notificationGroup}>
      <h3 className={styles.notificationGroupTitle}>{title}</h3>
      <div className={styles.notificationsList}>
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notification={notif} onAction={onAction} />
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   SUMMARY WIDGET COMPONENT
========================================== */
const SummaryWidget = ({ stats }) => {
  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h3 className={`${styles.widgetTitle} ${styles.gold}`}>
          <ChartIcon />
          Résumé
        </h3>
      </div>
      <div className={styles.widgetBody}>
        <div className={styles.summaryStats}>
          {stats.map((stat, index) => (
            <div key={index} className={`${styles.summaryStat} ${stat.highlight ? styles.highlight : ''}`}>
              <div className={styles.summaryStatValue}>{stat.value}</div>
              <div className={styles.summaryStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   PREFERENCES WIDGET COMPONENT
========================================== */
const PreferencesWidget = ({ preferences, onToggle }) => {
  const iconMap = {
    payment: PaymentIcon,
    document: DocumentIcon,
    message: MessageIcon,
    system: InfoIcon,
  };

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <SettingsIcon />
          Préférences
        </h3>
      </div>
      <div className={styles.widgetBody}>
        {preferences.map((pref, index) => {
          const IconComponent = iconMap[pref.type] || InfoIcon;
          return (
            <div key={index} className={styles.prefItem}>
              <div className={styles.prefInfo}>
                <div className={`${styles.prefIcon} ${styles[pref.type]}`}>
                  <IconComponent />
                </div>
                <span className={styles.prefLabel}>{pref.label}</span>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={pref.enabled}
                  onChange={() => onToggle(pref.type)}
                />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================
   QUICK ACTIONS WIDGET COMPONENT
========================================== */
const QuickActionsWidget = ({ actions, onAction }) => {
  const iconMap = {
    upload: UploadIcon,
    message: MessageIcon,
    download: DownloadIcon,
  };

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <LightningIcon />
          Actions rapides
        </h3>
      </div>
      <div className={styles.widgetBody}>
        {actions.map((action, index) => {
          const IconComponent = iconMap[action.icon] || InfoIcon;
          return (
            <div
              key={index}
              className={`${styles.quickActionItem} ${action.gold ? styles.gold : ''}`}
              onClick={() => onAction(action.action)}
            >
              <div className={styles.quickActionIcon}>
                <IconComponent />
              </div>
              <span className={styles.quickActionText}>{action.label}</span>
              <span className={styles.quickActionArrow}>
                <ChevronRightIcon />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [preferences, setPreferences] = useState([
    { type: 'payment', label: 'Paiements', enabled: true },
    { type: 'document', label: 'Documents', enabled: true },
    { type: 'message', label: 'Messages', enabled: true },
    { type: 'system', label: 'Système', enabled: false },
  ]);

  // Données mock
  const mockData = {
    user: {
      name: 'Mamadou Bah',
      role: 'Locataire',
      verified: true,
    },
    filters: [
      { id: 'all', label: 'Toutes', count: 12 },
      { id: 'unread', label: 'Non lues', count: 5 },
      { id: 'payment', label: 'Paiements', count: 4 },
      { id: 'document', label: 'Documents', count: 2 },
      { id: 'message', label: 'Messages', count: 3 },
    ],
    urgentBanner: {
      title: 'Action requise : Document expirant',
      description: "Votre carte d'identité nationale expire dans 15 jours. Veuillez la renouveler pour maintenir votre dossier à jour.",
      actionLabel: 'Renouveler maintenant',
    },
    notificationGroups: [
      {
        title: "Aujourd'hui",
        notifications: [
          {
            id: 1,
            iconType: 'document',
            title: "Carte d'identité expirant bientôt",
            text: "Votre carte d'identité nationale expire le 17 février 2026. Veuillez télécharger une nouvelle version pour maintenir votre dossier complet.",
            time: 'Il y a 2h',
            unread: true,
            urgent: true,
            badge: { type: 'urgent', label: 'Urgent' },
            actions: [
              { type: 'gold', label: 'Mettre à jour', action: 'update', icon: 'upload' },
              { type: 'secondary', label: 'Plus tard', action: 'dismiss' },
            ],
          },
          {
            id: 2,
            iconType: 'message',
            title: 'Nouveau message de votre agent',
            text: "Abdoulaye Diallo vous a envoyé un message concernant l'intervention du plombier prévue demain matin.",
            time: 'Il y a 4h',
            unread: true,
            badge: { type: 'new', label: 'Nouveau' },
            actions: [
              { type: 'primary', label: 'Voir le message', action: 'view' },
            ],
          },
        ],
      },
      {
        title: 'Hier',
        notifications: [
          {
            id: 3,
            iconType: 'payment',
            title: 'Loyer de Février prélevé avec succès',
            text: 'Votre loyer de 2 000 000 GNF a été prélevé avec succès via Orange Money. Votre reçu est disponible.',
            time: 'Hier, 09:00',
            unread: true,
            actions: [
              { type: 'primary', label: 'Télécharger le reçu', action: 'download' },
              { type: 'secondary', label: 'Voir les détails', action: 'details' },
            ],
          },
          {
            id: 4,
            iconType: 'receipt',
            title: 'Nouveau reçu de loyer disponible',
            text: 'Votre reçu de loyer pour Février 2026 a été généré automatiquement et ajouté à vos documents.',
            time: 'Hier, 09:05',
            unread: true,
            actions: [
              { type: 'secondary', label: 'Voir dans Documents', action: 'documents' },
            ],
          },
        ],
      },
      {
        title: 'Cette semaine',
        notifications: [
          {
            id: 5,
            iconType: 'alert',
            title: 'Rappel : Prélèvement automatique',
            text: "Votre prochain prélèvement est prévu pour le 1er Février 2026. Assurez-vous d'avoir un solde suffisant sur Orange Money.",
            time: '28 Jan',
            unread: false,
          },
          {
            id: 6,
            iconType: 'system',
            title: 'Mise à jour des conditions générales',
            text: "Les conditions générales d'utilisation ont été mises à jour. Nous vous invitons à les consulter.",
            time: '25 Jan',
            unread: false,
            actions: [
              { type: 'secondary', label: 'Consulter', action: 'view' },
            ],
          },
        ],
      },
    ],
    summaryStats: [
      { value: '5', label: 'Non lues', highlight: true },
      { value: '1', label: 'Actions' },
      { value: '12', label: 'Ce mois' },
      { value: '47', label: 'Total' },
    ],
    quickActions: [
      { icon: 'upload', label: "Mettre à jour ma pièce d'identité", action: 'updateId', gold: true },
      { icon: 'message', label: 'Répondre à mon agent', action: 'replyAgent' },
      { icon: 'download', label: 'Télécharger mon reçu', action: 'downloadReceipt' },
    ],
  };

  const handleTogglePreference = (type) => {
    setPreferences((prev) =>
      prev.map((p) => (p.type === type ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleNotificationAction = (notifId, action) => {
    console.log('Notification action:', notifId, action);
  };

  const handleQuickAction = (action) => {
    console.log('Quick action:', action);
  };

  const unreadCount = mockData.notificationGroups
    .flatMap((g) => g.notifications)
    .filter((n) => n.unread).length;

  return (
    <>
      <Header date="Dim. 2 Février 2026" />

      <main className={styles.mainContent}>
        <PageHeader newCount={unreadCount} onMarkAllRead={() => console.log('Mark all read')} />

        <div className={styles.notificationsLayout}>
          <div className={styles.notificationsMain}>
            <UrgentBanner {...mockData.urgentBanner} onAction={() => console.log('Urgent action')} />

            <NotificationFilters
              filters={mockData.filters}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {mockData.notificationGroups.map((group, index) => (
              <NotificationGroup
                key={index}
                title={group.title}
                notifications={group.notifications}
                onAction={handleNotificationAction}
              />
            ))}
          </div>

          <div className={styles.notificationsSidebar}>
            <SummaryWidget stats={mockData.summaryStats} />
            <PreferencesWidget preferences={preferences} onToggle={handleTogglePreference} />
            <QuickActionsWidget actions={mockData.quickActions} onAction={handleQuickAction} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Notifications;