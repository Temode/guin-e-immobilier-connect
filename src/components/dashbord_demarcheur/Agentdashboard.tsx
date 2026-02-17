import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { getProperties } from '@/services/propertyService';
import { getAgentRentals } from '@/services/rentalService';
import styles from './AgentDashboard.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const NotificationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
  </svg>
);

const TrendUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z" clipRule="evenodd" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const UserPlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = ({ date, weather, onAddProperty }: { date: string; weather: string; onAddProperty: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.pageContext}>
          <span className={styles.pageDate}>
            {date}
            <span className={styles.weather}>
              <SunIcon />
              {weather}
            </span>
          </span>
          <h1 className={styles.pageTitle}>Tableau de bord</h1>
        </div>
      </div>
      <div className={styles.topBarRight}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher un bien, client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className={styles.iconBtn}>
          <NotificationIcon />
          <span className={styles.notificationBadge}>3</span>
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onAddProperty}>
          <PlusIcon />
          Ajouter un bien
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   ALERT BANNER COMPONENT
========================================== */
const AlertBanner = ({ alert }: { alert: { title: string; text: string; time: string } | null }) => {
  if (!alert) return null;
  return (
    <div className={styles.alertBanner}>
      <div className={styles.alertBannerIcon}>
        <ClockIcon />
      </div>
      <div className={styles.alertBannerContent}>
        <p className={styles.alertBannerTitle}>{alert.title}</p>
        <p className={styles.alertBannerText}>{alert.text}</p>
      </div>
      <div className={styles.alertBannerTime}>
        <ClockIcon />
        {alert.time}
      </div>
    </div>
  );
};

/* ==========================================
   KPI CARD COMPONENT
========================================== */
const KpiCard = ({ kpi, staggerIndex }: { kpi: any; staggerIndex: number }) => {
  const icons: Record<string, any> = {
    building: BuildingIcon,
    calendar: CalendarIcon,
    users: UsersIcon,
    currency: CurrencyIcon,
  };
  const IconComponent = icons[kpi.icon] || BuildingIcon;

  return (
    <div
      className={`${styles.kpiCard} ${kpi.gold ? styles.gold : ''} ${styles.fadeInUp}`}
      style={{ animationDelay: `${staggerIndex * 0.05}s` }}
    >
      <div className={styles.kpiHeader}>
        <div className={`${styles.kpiIcon} ${styles[kpi.iconStyle]}`}>
          <IconComponent />
        </div>
        {kpi.trend && (
          <span className={`${styles.kpiTrend} ${styles.up}`}>
            <TrendUpIcon />
            {kpi.trend}
          </span>
        )}
      </div>
      <p className={styles.kpiValue}>
        {kpi.value}
        {kpi.suffix && <span className={styles.suffix}>{kpi.suffix}</span>}
      </p>
      <p className={styles.kpiLabel}>{kpi.label}</p>
      {kpi.footer && <div className={styles.kpiFooter} dangerouslySetInnerHTML={{ __html: kpi.footer }} />}
    </div>
  );
};

/* ==========================================
   ACTIVITY SECTION COMPONENT
========================================== */
const ActivitySection = ({ activities }: { activities: any[] }) => {
  const icons: Record<string, any> = {
    contract: CheckCircleIcon,
    visit: CalendarIcon,
    lead: UserPlusIcon,
    message: MessageIcon,
    property: BuildingIcon,
  };

  return (
    <section className={`${styles.card} ${styles.activitySection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Activité récente</h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.activityList}>
          {activities.length === 0 && (
            <p style={{ color: 'var(--color-neutral-500)', textAlign: 'center', padding: '2rem' }}>
              Aucune activité récente
            </p>
          )}
          {activities.map((activity, index) => {
            const IconComponent = icons[activity.type] || CheckCircleIcon;
            return (
              <div key={index} className={styles.activityItem}>
                <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                  <IconComponent />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityTitle}>
                    {activity.title}
                    {activity.amount && <span className={styles.amount}>{activity.amount}</span>}
                  </p>
                  <p className={styles.activityDescription}>{activity.description}</p>
                </div>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   ALERTS SECTION COMPONENT
========================================== */
const AlertsSection = ({ alerts }: { alerts: any[] }) => {
  const icons: Record<string, any> = {
    warning: ClockIcon,
    error: WarningIcon,
    info: InfoIcon,
  };

  if (alerts.length === 0) return null;

  return (
    <section className={`${styles.card} ${styles.alertsSection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Biens nécessitant attention</h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.alertsGrid}>
          {alerts.map((alert, index) => {
            const IconComponent = icons[alert.type] || InfoIcon;
            return (
              <div key={index} className={`${styles.alertCard} ${styles[alert.type]}`}>
                <div className={styles.alertCardIcon}>
                  <IconComponent />
                </div>
                <div className={styles.alertCardContent}>
                  <p className={styles.alertCardTitle}>{alert.title}</p>
                  <p className={styles.alertCardText}>{alert.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   QUICK ACTIONS SECTION COMPONENT
========================================== */
const QuickActionsSection = ({ onAddProperty }: { onAddProperty: () => void }) => {
  const navigate = useNavigate();
  const actions = [
    { icon: PlusIcon, iconStyle: 'primary', title: 'Ajouter un bien', description: 'Publier une nouvelle annonce', onClick: onAddProperty },
    { icon: CalendarIcon, iconStyle: 'gold', title: 'Mon agenda', description: 'Voir mes rendez-vous', onClick: () => navigate('/dashbord-agent/agenda') },
    { icon: UsersIcon, iconStyle: 'neutral', title: 'Mes clients', description: 'Gérer mes locataires', onClick: () => navigate('/dashbord-agent/mes-clients') },
    { icon: MessageIcon, iconStyle: 'primary', title: 'Messages', description: 'Voir mes conversations', onClick: () => navigate('/dashbord-agent/messages') },
  ];

  return (
    <section className={styles.quickActionsSection}>
      <div className={styles.quickActionsGrid}>
        {actions.map((action, index) => {
          const IconComponent = action.icon;
          return (
            <button key={index} className={styles.quickActionCard} onClick={action.onClick}>
              <div className={`${styles.quickActionIcon} ${styles[action.iconStyle]}`}>
                <IconComponent />
              </div>
              <div className={styles.quickActionContent}>
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentDashboard = () => {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    availableProperties: 0,
    rentedProperties: 0,
    draftProperties: 0,
    totalClients: 0,
    activeRentals: 0,
    monthlyCommissions: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch properties and rentals in parallel
      const [propertiesRes, rentalsRes] = await Promise.all([
        getProperties({ owner_id: user.id }),
        getAgentRentals(user.id),
      ]);

      const properties = propertiesRes.data || [];
      const rentals = rentalsRes.data || [];

      const available = properties.filter(p => p.status === 'available').length;
      const rented = properties.filter(p => p.status === 'rented').length;
      const drafts = properties.filter(p => p.status === 'draft').length;
      const activeRentals = rentals.filter(r => r.status === 'active');
      const uniqueTenants = new Set(activeRentals.map(r => r.tenant_id)).size;

      // Calculate monthly commissions from active rentals
      const monthlyComm = activeRentals.reduce((sum, r) => {
        const commission = (r.rent_amount * (r.agent_commission_percent || 10)) / 100;
        return sum + commission;
      }, 0);

      setStats({
        totalProperties: properties.length,
        availableProperties: available,
        rentedProperties: rented,
        draftProperties: drafts,
        totalClients: uniqueTenants,
        activeRentals: activeRentals.length,
        monthlyCommissions: monthlyComm,
      });

      // Build activities from recent data
      const recentActivities: any[] = [];
      
      // Recent properties
      properties.slice(0, 3).forEach(p => {
        recentActivities.push({
          type: 'property',
          title: `Bien ajouté : ${p.title}`,
          description: `${p.type} à ${p.city} — ${p.status === 'available' ? 'Disponible' : p.status}`,
          time: p.created_at ? new Date(p.created_at as string).toLocaleDateString('fr-FR') : '',
        });
      });

      // Recent rentals
      activeRentals.slice(0, 2).forEach(r => {
        const tenantName = r.tenant_profile?.full_name || 'Locataire';
        recentActivities.push({
          type: 'contract',
          title: `Location active`,
          amount: `${(r.rent_amount).toLocaleString('fr-FR')} GNF/mois`,
          description: `${tenantName} — depuis le ${new Date(r.start_date).toLocaleDateString('fr-FR')}`,
          time: new Date(r.created_at).toLocaleDateString('fr-FR'),
        });
      });

      setActivities(recentActivities);

      // Build alerts
      const alertsList: any[] = [];
      if (drafts > 0) {
        alertsList.push({
          type: 'warning',
          title: `${drafts} bien(s) en brouillon`,
          text: 'Publiez-les pour les rendre visibles aux locataires.',
        });
      }
      const noImageProps = properties.filter(p => !p.images || (p.images as any[]).length === 0);
      if (noImageProps.length > 0) {
        alertsList.push({
          type: 'info',
          title: `${noImageProps.length} bien(s) sans photo`,
          text: 'Ajoutez des photos pour attirer plus de locataires.',
        });
      }
      setAlerts(alertsList);

    } catch (err) {
      console.error('Erreur chargement dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const firstName = profile?.full_name?.split(' ')[0] || 'Agent';

  const handleAddProperty = () => {
    navigate('/dashbord-agent/mes-biens');
  };

  const kpis = [
    {
      icon: 'building',
      iconStyle: 'primary',
      value: stats.totalProperties.toString(),
      label: 'Biens en portefeuille',
      trend: null,
      footer: `<span class="highlight">${stats.availableProperties}</span> disponibles · <span>${stats.rentedProperties}</span> loués`,
    },
    {
      icon: 'users',
      iconStyle: 'primary',
      value: stats.totalClients.toString(),
      label: 'Locataires actifs',
      trend: null,
      footer: `<span class="highlight">${stats.activeRentals}</span> locations actives`,
    },
    {
      icon: 'currency',
      iconStyle: 'gold',
      value: formatAmount(stats.monthlyCommissions),
      suffix: ' GNF',
      label: 'Commissions / mois',
      trend: null,
      footer: `Commission sur <span class="highlight">${stats.activeRentals}</span> locations`,
      gold: true,
    },
    {
      icon: 'building',
      iconStyle: 'info',
      value: stats.draftProperties.toString(),
      label: 'Brouillons',
      trend: null,
      footer: 'À publier pour plus de visibilité',
    },
  ];

  if (loading) {
    return (
      <>
        <TopBar date={dateStr} weather="Conakry" onAddProperty={handleAddProperty} />
        <div className={styles.pageContent}>
          <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-neutral-500)' }}>
            Chargement du tableau de bord...
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar date={dateStr} weather="Conakry" onAddProperty={handleAddProperty} />

      <div className={styles.pageContent}>
        {/* KPIs */}
        <div className={styles.kpiGrid}>
          {kpis.map((kpi, index) => (
            <KpiCard key={index} kpi={kpi} staggerIndex={index + 1} />
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          <ActivitySection activities={activities} />
          <AlertsSection alerts={alerts} />
          <QuickActionsSection onAddProperty={handleAddProperty} />
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;
