import { useState } from 'react';
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
const TopBar = ({ date, weather, onAddProperty }) => {
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
const AlertBanner = ({ alert }) => {
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
      <div className={styles.alertBannerActions}>
        <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
          Voir détails
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}>
          Appeler le client
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   KPI CARD COMPONENT
========================================== */
const KpiCard = ({ kpi, staggerIndex }) => {
  const icons = {
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
        <span className={`${styles.kpiTrend} ${styles.up}`}>
          <TrendUpIcon />
          {kpi.trend}
        </span>
      </div>
      <p className={styles.kpiValue}>
        {kpi.value}
        {kpi.suffix && <span className={styles.suffix}>{kpi.suffix}</span>}
      </p>
      <p className={styles.kpiLabel}>{kpi.label}</p>
      <div className={styles.kpiFooter} dangerouslySetInnerHTML={{ __html: kpi.footer }} />
    </div>
  );
};

/* ==========================================
   AGENDA SECTION COMPONENT
========================================== */
const AgendaSection = ({ items }) => {
  return (
    <section className={`${styles.card} ${styles.agendaSection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          Agenda du jour <span className={styles.cardTitleBadge}>{items.length} RDV</span>
        </h2>
        <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Voir tout</button>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.agendaTimeline}>
          {items.map((item, index) => (
            <div key={index} className={`${styles.agendaItem} ${styles[item.status]}`}>
              <div className={styles.agendaTime}>
                <span>{item.time}</span>
              </div>
              <div className={styles.agendaDot}></div>
              <div className={styles.agendaCard}>
                <div className={styles.agendaCardHeader}>
                  <span className={styles.agendaCardType}>{item.type}</span>
                  <span className={styles.agendaCardStatus}>{item.statusLabel}</span>
                </div>
                <p className={styles.agendaCardTitle}>{item.title}</p>
                <p className={styles.agendaCardMeta}>
                  <UserIcon />
                  {item.client}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   ACTIVITY SECTION COMPONENT
========================================== */
const ActivitySection = ({ activities }) => {
  const icons = {
    contract: CheckCircleIcon,
    visit: CalendarIcon,
    lead: UserPlusIcon,
    message: MessageIcon,
  };

  return (
    <section className={`${styles.card} ${styles.activitySection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Activité récente</h2>
        <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>Voir tout</button>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.activityList}>
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
   PERFORMANCE SECTION COMPONENT
========================================== */
const PerformanceSection = ({ data }) => {
  const [activeTab, setActiveTab] = useState('30j');
  const tabs = ['7j', '30j', '3m'];

  return (
    <section className={`${styles.card} ${styles.performanceSection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Performance mensuelle</h2>
        <div className={styles.tabPills}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabPill} ${activeTab === tab ? styles.active : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.chartHeader}>
          <div className={styles.chartLegend}>
            <div className={styles.chartLegendItem}>
              <span className={`${styles.chartLegendDot} ${styles.primary}`}></span>
              Visites
            </div>
            <div className={styles.chartLegendItem}>
              <span className={`${styles.chartLegendDot} ${styles.gold}`}></span>
              Contrats signés
            </div>
          </div>
        </div>
        <div className={styles.chartContainer}>
          {data.weeks.map((week, index) => (
            <div key={index} className={styles.chartBarGroup}>
              <div className={styles.chartBars}>
                <div
                  className={`${styles.chartBar} ${styles.primary}`}
                  style={{ height: `${week.visits}%` }}
                ></div>
                <div
                  className={`${styles.chartBar} ${styles.gold}`}
                  style={{ height: `${week.contracts}%` }}
                ></div>
              </div>
              <span className={styles.chartBarLabel}>{week.label}</span>
            </div>
          ))}
        </div>
        <div className={styles.chartSummary}>
          <div className={styles.chartSummaryItem}>
            <p className={styles.chartSummaryValue}>{data.summary.visits}</p>
            <p className={styles.chartSummaryLabel}>Visites effectuées</p>
          </div>
          <div className={styles.chartSummaryItem}>
            <p className={styles.chartSummaryValue}>{data.summary.contracts}</p>
            <p className={styles.chartSummaryLabel}>Contrats signés</p>
          </div>
          <div className={styles.chartSummaryItem}>
            <p className={`${styles.chartSummaryValue} ${styles.gold}`}>
              {data.summary.conversionRate}%
            </p>
            <p className={styles.chartSummaryLabel}>Taux conversion</p>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ==========================================
   OBJECTIVES SECTION COMPONENT
========================================== */
const ObjectivesSection = ({ objectives, month }) => {
  const icons = {
    locations: CheckCircleIcon,
    commissions: CurrencyIcon,
    clients: UserPlusIcon,
    visits: EyeIcon,
  };

  return (
    <section className={`${styles.card} ${styles.objectivesSection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>
          Objectifs du mois <span className={`${styles.cardTitleBadge} ${styles.gold}`}>{month}</span>
        </h2>
      </div>
      <div className={styles.cardContent}>
        <div className={styles.objectiveList}>
          {objectives.map((obj, index) => {
            const IconComponent = icons[obj.type] || CheckCircleIcon;
            return (
              <div
                key={index}
                className={`${styles.objectiveItem} ${obj.style ? styles[obj.style] : ''}`}
              >
                <div className={styles.objectiveHeader}>
                  <span className={styles.objectiveLabel}>
                    <IconComponent />
                    {obj.label}
                  </span>
                  <span className={styles.objectiveValue}>{obj.value}</span>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={`${styles.progressFill} ${styles[obj.fillStyle]}`}
                    style={{ width: `${obj.percentage}%` }}
                  ></div>
                </div>
                <div className={styles.objectiveMeta}>
                  {obj.completed ? (
                    <span className={styles.success}>
                      <CheckCircleFilledIcon />
                      Objectif atteint !
                    </span>
                  ) : (
                    <span>{obj.percentage}% atteint</span>
                  )}
                  <span>{obj.remaining}</span>
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
   ALERTS SECTION COMPONENT
========================================== */
const AlertsSection = ({ alerts }) => {
  const icons = {
    warning: ClockIcon,
    error: WarningIcon,
    info: InfoIcon,
  };

  return (
    <section className={`${styles.card} ${styles.alertsSection}`}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>Biens nécessitant attention</h2>
        <button className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}>
          Voir tous les biens
        </button>
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
const QuickActionsSection = ({ actions }) => {
  const icons = {
    plus: PlusIcon,
    calendar: CalendarIcon,
    userPlus: UserPlusIcon,
    document: DocumentChartIcon,
  };

  return (
    <section className={styles.quickActionsSection}>
      <div className={styles.quickActionsGrid}>
        {actions.map((action, index) => {
          const IconComponent = icons[action.icon] || PlusIcon;
          return (
            <a key={index} href="#" className={styles.quickActionCard}>
              <div className={`${styles.quickActionIcon} ${styles[action.iconStyle]}`}>
                <IconComponent />
              </div>
              <div className={styles.quickActionContent}>
                <h4>{action.title}</h4>
                <p>{action.description}</p>
              </div>
            </a>
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
  // Mock Data
  const mockData = {
    alert: {
      title: 'Visite prévue dans 2 heures',
      text: 'Appartement F3 à Kipé avec Mme Aissatou Barry',
      time: '15h00',
    },
    kpis: [
      {
        icon: 'building',
        iconStyle: 'primary',
        value: '12',
        label: 'Biens en portefeuille',
        trend: '+3',
        footer: '<span class="highlight">8</span> actifs · <span>4</span> en attente',
      },
      {
        icon: 'calendar',
        iconStyle: 'info',
        value: '3',
        label: "Visites aujourd'hui",
        trend: '+2',
        footer: 'Prochaine : <span class="highlight">15h00</span>',
      },
      {
        icon: 'users',
        iconStyle: 'primary',
        value: '23',
        label: 'Prospects actifs',
        trend: '+5',
        footer: '<span class="highlight">7</span> chauds · <span>16</span> en nurturing',
      },
      {
        icon: 'currency',
        iconStyle: 'gold',
        value: '4.8',
        suffix: 'M GNF',
        label: 'Commissions ce mois',
        trend: '+18%',
        footer: 'Objectif : <span class="highlight">6M GNF</span> (80%)',
        gold: true,
      },
    ],
    agendaItems: [
      {
        time: '09:30',
        type: 'Visite',
        status: 'completed',
        statusLabel: 'Terminée',
        title: 'Villa F4 - Lambanyi',
        client: 'Mamadou Camara',
      },
      {
        time: '15:00',
        type: 'Visite',
        status: 'active',
        statusLabel: 'Dans 2h',
        title: 'Appartement F3 - Kipé',
        client: 'Aissatou Barry',
      },
      {
        time: '17:30',
        type: 'Rendez-vous',
        status: 'upcoming',
        statusLabel: 'Planifié',
        title: 'Signature contrat - Studio Cosa',
        client: 'Oumar Diallo',
      },
    ],
    activities: [
      {
        type: 'contract',
        title: 'Contrat signé',
        amount: '+1.2M GNF',
        description: 'Villa F4 Kipé - Fatoumata Barry a signé le bail',
        time: 'Il y a 2h',
      },
      {
        type: 'visit',
        title: 'Visite confirmée',
        description: 'Appt F3 Nongo - Mamadou Camara pour demain 10h',
        time: 'Il y a 4h',
      },
      {
        type: 'lead',
        title: 'Nouveau prospect',
        description: 'Ibrahima Sow - Cherche F2/F3 à Ratoma, budget 2M GNF',
        time: 'Il y a 6h',
      },
      {
        type: 'message',
        title: 'Message de Mme Diallo',
        description: 'Question sur le renouvellement du mandat',
        time: 'Hier',
      },
    ],
    performance: {
      weeks: [
        { label: 'S1', visits: 60, contracts: 30 },
        { label: 'S2', visits: 75, contracts: 45 },
        { label: 'S3', visits: 90, contracts: 60 },
        { label: 'S4', visits: 85, contracts: 50 },
      ],
      summary: {
        visits: 18,
        contracts: 5,
        conversionRate: 28,
      },
    },
    objectives: [
      {
        type: 'locations',
        label: 'Locations finalisées',
        value: '5 / 6',
        percentage: 83,
        fillStyle: 'primary',
        remaining: '1 restant',
      },
      {
        type: 'commissions',
        label: 'Commissions',
        value: '4.8M / 6M',
        percentage: 80,
        fillStyle: 'gold',
        style: 'gold',
        remaining: '1.2M GNF restant',
      },
      {
        type: 'clients',
        label: 'Nouveaux clients',
        value: '8 / 8',
        percentage: 100,
        fillStyle: 'complete',
        style: 'complete',
        completed: true,
        remaining: '',
      },
      {
        type: 'visits',
        label: 'Visites effectuées',
        value: '18 / 25',
        percentage: 72,
        fillStyle: 'primary',
        remaining: '7 restantes',
      },
    ],
    propertyAlerts: [
      {
        type: 'warning',
        title: '2 mandats expirent bientôt',
        text: 'Villa Kipé et Appt Nongo - Dans 15 jours',
      },
      {
        type: 'error',
        title: '1 bien sans visite depuis 14j',
        text: 'Studio Cosa - Envisager réduction prix',
      },
      {
        type: 'info',
        title: '3 prospects en attente',
        text: 'Messages non lus depuis 24h+',
      },
    ],
    quickActions: [
      {
        icon: 'plus',
        iconStyle: 'primary',
        title: 'Ajouter un bien',
        description: 'Publier une nouvelle annonce',
      },
      {
        icon: 'calendar',
        iconStyle: 'gold',
        title: 'Planifier une visite',
        description: 'Organiser un rendez-vous',
      },
      {
        icon: 'userPlus',
        iconStyle: 'neutral',
        title: 'Ajouter un client',
        description: 'Enregistrer un prospect',
      },
      {
        icon: 'document',
        iconStyle: 'primary',
        title: 'Générer un rapport',
        description: 'Export mensuel PDF',
      },
    ],
  };

  const handleAddProperty = () => {
    console.log('Add property clicked');
  };

  return (
    <>
      <TopBar
        date="Mardi 4 février 2025"
        weather="28°C Conakry"
        onAddProperty={handleAddProperty}
      />

      <div className={styles.pageContent}>
        <AlertBanner alert={mockData.alert} />

        {/* KPIs */}
        <div className={styles.kpiGrid}>
          {mockData.kpis.map((kpi, index) => (
            <KpiCard key={index} kpi={kpi} staggerIndex={index + 1} />
          ))}
        </div>

        {/* Main Dashboard Grid */}
        <div className={styles.dashboardGrid}>
          <AgendaSection items={mockData.agendaItems} />
          <ActivitySection activities={mockData.activities} />
          <PerformanceSection data={mockData.performance} />
          <ObjectivesSection objectives={mockData.objectives} month="Février" />
          <AlertsSection alerts={mockData.propertyAlerts} />
          <QuickActionsSection actions={mockData.quickActions} />
        </div>
      </div>
    </>
  );
};

export default AgentDashboard;