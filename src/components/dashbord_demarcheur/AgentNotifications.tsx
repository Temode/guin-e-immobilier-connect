import { useState, useEffect, useCallback } from 'react';
import styles from './AgentNotifications.module.css';
import { useAuthContext } from '@/context/AuthContext';
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  type NotificationData,
} from '@/services/notificationService';
import { downloadReceipt } from '@/services/receiptService';

/* ==========================================
   INLINE ICONS (from maquette)
========================================== */
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const LightningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const NotificationBellIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const PaymentIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ==========================================
   HELPERS
========================================== */

/** Map notification type to an icon type for styling */
function getIconType(type: string): string {
  if (type === 'payment_confirmed' || type === 'payment_received') return type;
  if (type === 'admin_payment_alert') return 'admin_payment_alert';
  return 'info';
}

/** Map notification type to icon component */
function getIconComponent(type: string) {
  if (type === 'payment_confirmed' || type === 'payment_received') return CheckCircleIcon;
  if (type === 'admin_payment_alert') return PaymentIcon;
  return InfoIcon;
}

/** Format relative time from ISO date string */
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);

  if (diffMin < 1) return "A l'instant";
  if (diffMin < 60) return `Il y a ${diffMin}min`;
  if (diffH < 24) return `Il y a ${diffH}h`;
  if (diffD === 1) return 'Hier';
  if (diffD < 7) return `Il y a ${diffD}j`;

  return date.toLocaleDateString('fr-GN', { day: 'numeric', month: 'short' });
}

/** Group notifications by day */
function groupByDay(notifications: NotificationData[]): { title: string; items: NotificationData[] }[] {
  const groups: Map<string, NotificationData[]> = new Map();
  const now = new Date();
  const todayKey = now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toDateString();

  for (const n of notifications) {
    const d = new Date(n.created_at);
    const key = d.toDateString();
    let label: string;

    if (key === todayKey) {
      label = "Aujourd'hui";
    } else if (key === yesterdayKey) {
      label = 'Hier';
    } else {
      label = d.toLocaleDateString('fr-GN', { weekday: 'long', day: 'numeric', month: 'long' });
    }

    const existing = groups.get(label);
    if (existing) {
      existing.push(n);
    } else {
      groups.set(label, [n]);
    }
  }

  return Array.from(groups.entries()).map(([title, items]) => ({ title, items }));
}

/** Format current date for header */
function formatHeaderDate(): string {
  return new Date().toLocaleDateString('fr-GN', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* ==========================================
   SUB-COMPONENTS
========================================== */

const Header = ({ date }: { date: string }) => (
  <header className={styles.header}>
    <nav className={styles.breadcrumb}>
      <a href="/dashbord-agent">Tableau de bord</a>
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

const PageHeader = ({ newCount, onMarkAllRead }: { newCount: number; onMarkAllRead: () => void }) => (
  <div className={styles.pageHeader}>
    <div className={styles.pageHeaderLeft}>
      <h1>
        Notifications
        {newCount > 0 && <span className={styles.pageTitleBadge}>{newCount} nouvelles</span>}
      </h1>
      <p>Restez informé de toutes les activités liées à vos biens</p>
    </div>
    <div className={styles.pageActions}>
      <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onMarkAllRead}>
        <CheckIcon />
        Tout marquer comme lu
      </button>
    </div>
  </div>
);

interface FilterDef {
  id: string;
  label: string;
  count: number;
}

const NotificationFilters = ({
  filters,
  activeFilter,
  onFilterChange,
}: {
  filters: FilterDef[];
  activeFilter: string;
  onFilterChange: (id: string) => void;
}) => (
  <div className={styles.notificationsFilters}>
    {filters.map((f) => (
      <button
        key={f.id}
        className={`${styles.filterBtn} ${activeFilter === f.id ? styles.active : ''}`}
        onClick={() => onFilterChange(f.id)}
      >
        {f.label}
        <span className={styles.count}>{f.count}</span>
      </button>
    ))}
  </div>
);

const NotificationItem = ({
  notification,
  onClickItem,
  onDownloadReceipt,
}: {
  notification: NotificationData;
  onClickItem: (n: NotificationData) => void;
  onDownloadReceipt: (transactionId: string) => void;
}) => {
  const iconType = getIconType(notification.type);
  const IconComp = getIconComponent(notification.type);
  const hasTransaction = !!(notification.metadata as Record<string, unknown>)?.transaction_id;

  return (
    <div
      className={`${styles.notificationItem} ${!notification.read ? styles.unread : ''}`}
      onClick={() => onClickItem(notification)}
    >
      <div className={`${styles.notificationIcon} ${styles[iconType]}`}>
        <IconComp />
      </div>
      <div className={styles.notificationContent}>
        <div className={styles.notificationHeader}>
          <span className={styles.notificationTitle}>
            {notification.title}
            {!notification.read && (
              <span className={`${styles.notificationBadge} ${styles.new}`}>Nouveau</span>
            )}
          </span>
          <span className={styles.notificationTime}>{formatRelativeTime(notification.created_at)}</span>
        </div>
        <p className={styles.notificationText}>{notification.message}</p>
        {hasTransaction && (
          <div className={styles.notificationActions}>
            <button
              className={`${styles.notifActionBtn} ${styles.primary}`}
              onClick={(e) => {
                e.stopPropagation();
                onDownloadReceipt((notification.metadata as Record<string, string>).transaction_id);
              }}
            >
              <DownloadIcon />
              Voir le reçu
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const NotificationGroup = ({
  title,
  notifications,
  onClickItem,
  onDownloadReceipt,
}: {
  title: string;
  notifications: NotificationData[];
  onClickItem: (n: NotificationData) => void;
  onDownloadReceipt: (transactionId: string) => void;
}) => (
  <div className={styles.notificationGroup}>
    <h3 className={styles.notificationGroupTitle}>{title}</h3>
    <div className={styles.notificationsList}>
      {notifications.map((n) => (
        <NotificationItem
          key={n.id}
          notification={n}
          onClickItem={onClickItem}
          onDownloadReceipt={onDownloadReceipt}
        />
      ))}
    </div>
  </div>
);

const SummaryWidget = ({ stats }: { stats: { value: string; label: string; highlight?: boolean }[] }) => (
  <div className={styles.widget}>
    <div className={styles.widgetHeader}>
      <h3 className={`${styles.widgetTitle} ${styles.gold}`}>
        <ChartIcon />
        Résumé
      </h3>
    </div>
    <div className={styles.widgetBody}>
      <div className={styles.summaryStats}>
        {stats.map((s, i) => (
          <div key={i} className={`${styles.summaryStat} ${s.highlight ? styles.highlight : ''}`}>
            <div className={styles.summaryStatValue}>{s.value}</div>
            <div className={styles.summaryStatLabel}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PreferencesWidget = ({
  preferences,
  onToggle,
}: {
  preferences: { type: string; label: string; enabled: boolean }[];
  onToggle: (type: string) => void;
}) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    payment: PaymentIcon,
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
        {preferences.map((pref, i) => {
          const Icon = iconMap[pref.type] || InfoIcon;
          return (
            <div key={i} className={styles.prefItem}>
              <div className={styles.prefInfo}>
                <div className={`${styles.prefIcon} ${styles[pref.type]}`}>
                  <Icon />
                </div>
                <span className={styles.prefLabel}>{pref.label}</span>
              </div>
              <label className={styles.toggle}>
                <input type="checkbox" checked={pref.enabled} onChange={() => onToggle(pref.type)} />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const QuickActionsWidget = ({ onAction }: { onAction: (action: string) => void }) => {
  const actions = [
    { icon: DownloadIcon, label: 'Télécharger le dernier reçu', action: 'downloadLastReceipt', gold: true },
    { icon: NotificationBellIcon, label: 'Tout marquer comme lu', action: 'markAllRead' },
  ];

  return (
    <div className={styles.widget}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.widgetTitle}>
          <LightningIcon />
          Actions rapides
        </h3>
      </div>
      <div className={styles.widgetBody}>
        {actions.map((a, i) => (
          <div
            key={i}
            className={`${styles.quickActionItem} ${a.gold ? styles.gold : ''}`}
            onClick={() => onAction(a.action)}
          >
            <div className={styles.quickActionIcon}>
              <a.icon />
            </div>
            <span className={styles.quickActionText}>{a.label}</span>
            <span className={styles.quickActionArrow}>
              <ChevronRightIcon />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentNotifications = () => {
  const { user } = useAuthContext();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [preferences, setPreferences] = useState([
    { type: 'payment', label: 'Paiements reçus', enabled: true },
    { type: 'system', label: 'Notifications système', enabled: true },
  ]);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const typeFilter = activeFilter === 'all' || activeFilter === 'unread' ? undefined : activeFilter;
    const unreadOnly = activeFilter === 'unread';

    const [result, count] = await Promise.all([
      getUserNotifications(user.id, { limit: 50, unreadOnly, type: typeFilter }),
      getUnreadCount(user.id),
    ]);

    setNotifications(result.data);
    setUnreadCount(count);
    setTotalCount(result.data.length);
    setLoading(false);
  }, [user, activeFilter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleClickNotification = async (n: NotificationData) => {
    if (!n.read) {
      await markAsRead(n.id);
      setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, read: true } : item)));
      setUnreadCount((c) => Math.max(0, c - 1));
    }
  };

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      await downloadReceipt(transactionId);
    } catch (err) {
      console.error('[AgentNotifications] Receipt download error:', err);
    }
  };

  const handleQuickAction = (action: string) => {
    if (action === 'markAllRead') {
      handleMarkAllRead();
    } else if (action === 'downloadLastReceipt') {
      const lastPayment = notifications.find(
        (n) => (n.type === 'payment_received' || n.type === 'payment_confirmed') && (n.metadata as Record<string, unknown>)?.transaction_id
      );
      if (lastPayment) {
        handleDownloadReceipt((lastPayment.metadata as Record<string, string>).transaction_id);
      }
    }
  };

  const handleTogglePreference = (type: string) => {
    setPreferences((prev) => prev.map((p) => (p.type === type ? { ...p, enabled: !p.enabled } : p)));
  };

  // Build filter counts
  const allNotifs = notifications;
  const paymentCount = allNotifs.filter((n) => n.type === 'payment_received' || n.type === 'payment_confirmed').length;
  const adminCount = allNotifs.filter((n) => n.type === 'admin_payment_alert').length;

  const filters: FilterDef[] = [
    { id: 'all', label: 'Toutes', count: totalCount },
    { id: 'unread', label: 'Non lues', count: unreadCount },
    { id: 'payment_received', label: 'Paiements', count: paymentCount },
    { id: 'admin_payment_alert', label: 'Alertes admin', count: adminCount },
  ];

  const groups = groupByDay(notifications);

  const summaryStats = [
    { value: String(unreadCount), label: 'Non lues', highlight: true },
    { value: String(paymentCount), label: 'Paiements' },
    { value: String(totalCount), label: 'Ce mois' },
    { value: String(notifications.length), label: 'Affichées' },
  ];

  return (
    <>
      <Header date={formatHeaderDate()} />

      <main className={styles.mainContent}>
        <PageHeader newCount={unreadCount} onMarkAllRead={handleMarkAllRead} />

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner} />
            <p>Chargement des notifications...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <NotificationBellIcon />
            </div>
            <h3>Aucune notification</h3>
            <p>Vous recevrez ici les alertes de paiement et les mises à jour importantes.</p>
          </div>
        ) : (
          <div className={styles.notificationsLayout}>
            <div className={styles.notificationsMain}>
              <NotificationFilters
                filters={filters}
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />

              {groups.map((group, i) => (
                <NotificationGroup
                  key={i}
                  title={group.title}
                  notifications={group.items}
                  onClickItem={handleClickNotification}
                  onDownloadReceipt={handleDownloadReceipt}
                />
              ))}
            </div>

            <div className={styles.notificationsSidebar}>
              <SummaryWidget stats={summaryStats} />
              <PreferencesWidget preferences={preferences} onToggle={handleTogglePreference} />
              <QuickActionsWidget onAction={handleQuickAction} />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default AgentNotifications;
