import React, { useState } from 'react';
import styles from './Mes_Paiements.module.css';

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

const DotsVerticalIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
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

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CreditCardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ date, hasNotifications }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <nav className={styles.breadcrumb}>
          <a href="#">Tableau de bord</a>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>Mes paiements</span>
        </nav>
      </div>
      <div className={styles.headerRight}>
        <span className={styles.headerDate}>{date}</span>
        <button className={styles.headerBtn}>
          <NotificationIcon />
          {hasNotifications && <span className={styles.notificationDot}></span>}
        </button>
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
const PageHeader = ({ onExport, onManualPay }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderLeft}>
        <h1>Mes paiements</h1>
        <p>Consultez l'historique de vos paiements et gérez vos moyens de paiement</p>
      </div>
      <div className={styles.pageActions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onExport}>
          <DownloadIcon />
          Exporter tout
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onManualPay}>
          <PlusIcon />
          Payer manuellement
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }) => {
  const iconMap = {
    payment: PaymentIcon,
    check: CheckCircleIcon,
    calendar: CalendarIcon,
    document: DocumentIcon,
  };

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconType] || PaymentIcon;
        return (
          <div 
            key={index} 
            className={`${styles.statCard} ${stat.highlight ? styles.highlight : ''}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className={styles.statHeader}>
              <div className={`${styles.statIcon} ${styles[stat.iconColor] || ''}`}>
                <IconComponent />
              </div>
              {stat.trend && (
                <span className={`${styles.statTrend} ${styles[stat.trendType] || ''}`}>
                  {stat.trendIcon && <CheckIcon />}
                  {stat.trend}
                </span>
              )}
            </div>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================
   NEXT PAYMENT CARD COMPONENT
========================================== */
const NextPaymentCard = ({ payment }) => {
  return (
    <div className={styles.nextPaymentCard}>
      <div className={styles.nextPaymentHeader}>
        <span className={styles.nextPaymentLabel}>Prochain prélèvement automatique</span>
        <span className={styles.nextPaymentStatus}>
          <ClockIcon />
          Programmé
        </span>
      </div>
      <p className={styles.nextPaymentAmount}>
        {payment.amount}<span>{payment.currency}</span>
      </p>
      <p className={styles.nextPaymentDue}>
        Prévu le <strong>{payment.dueDate}</strong> — {payment.description}
      </p>
      <div className={styles.nextPaymentFooter}>
        <div className={styles.countdownDisplay}>
          <span className={styles.countdownNumber}>{payment.daysRemaining}</span>
          <span className={styles.countdownText}>jours restants</span>
        </div>
        <div className={styles.paymentMethodMini}>
          <div className={styles.paymentMethodMiniIcon}>OM</div>
          <div className={styles.paymentMethodMiniText}>
            {payment.method}
            <span>{payment.methodNumber}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({ activeFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const filters = ['Tous', 'Payés', 'En attente', 'Échoués'];

  return (
    <div className={styles.filtersBar}>
      <div className={styles.filtersLeft}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => onFilterChange(filter)}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className={styles.filtersRight}>
        <div className={styles.searchInput}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   PAYMENT TABLE COMPONENT
========================================== */
const PaymentTable = ({ payments, onDownload }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return CheckIcon;
      case 'pending': return ClockIcon;
      case 'failed': return XIcon;
      default: return CheckIcon;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'success': return 'Payé';
      case 'pending': return 'En attente';
      case 'failed': return 'Échoué';
      default: return status;
    }
  };

  return (
    <div className={styles.paymentTable}>
      <div className={styles.paymentTableHeader}>
        <span>Transaction</span>
        <span>Date</span>
        <span>Montant</span>
        <span>Statut</span>
        <span>Reçu</span>
      </div>

      {payments.map((payment, index) => {
        const StatusIcon = getStatusIcon(payment.status);
        return (
          <div key={index} className={styles.paymentTableRow}>
            <div className={styles.paymentInfo}>
              <div className={`${styles.paymentIcon} ${styles[payment.status]}`}>
                <StatusIcon />
              </div>
              <div className={styles.paymentDetails}>
                <h4>{payment.title}</h4>
                <p>{payment.method}</p>
              </div>
            </div>
            <span className={styles.paymentDate}>{payment.date}</span>
            <span className={styles.paymentAmount}>{payment.amount}</span>
            <span className={`${styles.paymentStatusBadge} ${styles[payment.status]}`}>
              <StatusIcon />
              {getStatusLabel(payment.status)}
            </span>
            <div className={styles.paymentActions}>
              <button 
                className={styles.downloadBtn}
                onClick={() => onDownload(payment.id)}
              >
                <DownloadIcon />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>
        Affichage {startItem}-{endItem} sur {totalItems} paiements
      </span>
      <div className={styles.paginationButtons}>
        <button
          className={styles.paginationBtn}
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeftIcon />
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`${styles.paginationBtn} ${currentPage === index + 1 ? styles.active : ''}`}
            onClick={() => onPageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className={styles.paginationBtn}
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   PAYMENT METHOD CARD COMPONENT
========================================== */
const PaymentMethodCard = ({ method, onEdit, onAdd }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <CreditCardIcon />
          Moyen de paiement
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.paymentMethodCardInner}>
          <div className={styles.paymentMethodHeader}>
            <span className={styles.paymentMethodTitle}>Compte principal</span>
            <span className={styles.paymentMethodBadge}>
              <CheckIcon />
              Actif
            </span>
          </div>
          <div className={styles.paymentMethodContent}>
            <div className={styles.paymentMethodIcon}>OM</div>
            <div className={styles.paymentMethodInfo}>
              <p className={styles.paymentMethodName}>{method.name}</p>
              <p className={styles.paymentMethodNumber}>{method.number}</p>
            </div>
          </div>
          <div className={styles.paymentMethodActions}>
            <button className={`${styles.paymentMethodBtn} ${styles.edit}`} onClick={onEdit}>
              Modifier
            </button>
            <button className={`${styles.paymentMethodBtn} ${styles.add}`} onClick={onAdd}>
              + Ajouter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   YEARLY CHART COMPONENT
========================================== */
const YearlyChart = ({ data }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <ChartIcon />
          Historique annuel
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.chartContainer}>
          {data.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.chartBar} ${item.current ? styles.current : ''}`}
            >
              <div 
                className={styles.chartBarFill} 
                style={{ height: `${item.percentage}%` }}
              ></div>
              <span className={styles.chartBarLabel}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   QUICK ACTIONS COMPONENT
========================================== */
const QuickActions = ({ actions }) => {
  const iconMap = {
    document: DocumentIcon,
    message: MessageIcon,
    settings: SettingsIcon,
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <LightningIcon />
          Actions rapides
        </h3>
      </div>
      <div className={styles.cardBodyNoPaddingTop}>
        <div className={styles.quickActionList}>
          {actions.map((action, index) => {
            const IconComponent = iconMap[action.iconType] || DocumentIcon;
            return (
              <a key={index} href={action.href} className={styles.quickActionItem}>
                <div className={`${styles.quickActionIcon} ${styles[action.iconColor]}`}>
                  <IconComponent />
                </div>
                <div className={styles.quickActionContent}>
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
                <span className={styles.quickActionArrow}>
                  <ChevronRightIcon />
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const Mes_Paiements = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Données mock
  const mockData = {
    user: {
      name: 'Mamadou Bah',
      role: 'Locataire',
      verified: true,
    },
    stats: [
      {
        iconType: 'payment',
        iconColor: '',
        value: '16 000 000 GNF',
        label: 'Total payé depuis Juin 2025',
        trend: 'À jour',
        trendType: 'up',
        trendIcon: true,
        highlight: true,
      },
      {
        iconType: 'check',
        iconColor: 'green',
        value: '8',
        label: 'Paiements effectués',
        trend: 'Stable',
        trendType: 'neutral',
      },
      {
        iconType: 'calendar',
        iconColor: 'orange',
        value: '12 jours',
        label: 'Avant prochain loyer',
      },
      {
        iconType: 'document',
        iconColor: 'blue',
        value: '8',
        label: 'Reçus disponibles',
      },
    ],
    nextPayment: {
      amount: '2 000 000',
      currency: 'GNF',
      dueDate: '1er Février 2026',
      description: 'Loyer de Février',
      daysRemaining: 12,
      method: 'Orange Money',
      methodNumber: '620 ** ** 45',
    },
    payments: [
      { id: 1, title: 'Loyer Janvier 2026', method: 'Orange Money • Auto', date: '1 Jan 2026', amount: '2 000 000 GNF', status: 'success' },
      { id: 2, title: 'Loyer Décembre 2025', method: 'Orange Money • Auto', date: '1 Déc 2025', amount: '2 000 000 GNF', status: 'success' },
      { id: 3, title: 'Loyer Novembre 2025', method: 'Orange Money • Auto', date: '1 Nov 2025', amount: '2 000 000 GNF', status: 'success' },
      { id: 4, title: 'Loyer Octobre 2025', method: 'Orange Money • Auto', date: '1 Oct 2025', amount: '2 000 000 GNF', status: 'success' },
      { id: 5, title: 'Loyer Septembre 2025', method: 'Orange Money • Manuel', date: '3 Sep 2025', amount: '2 000 000 GNF', status: 'success' },
    ],
    paymentMethod: {
      name: 'Orange Money',
      number: '620 ** ** 45',
    },
    chartData: [
      { month: 'Juin', percentage: 100 },
      { month: 'Juil', percentage: 100 },
      { month: 'Août', percentage: 100 },
      { month: 'Sep', percentage: 100 },
      { month: 'Oct', percentage: 100 },
      { month: 'Nov', percentage: 100 },
      { month: 'Déc', percentage: 100 },
      { month: 'Jan', percentage: 100, current: true },
      { month: 'Fév', percentage: 0 },
      { month: 'Mar', percentage: 0 },
      { month: 'Avr', percentage: 0 },
      { month: 'Mai', percentage: 0 },
    ],
    quickActions: [
      { iconType: 'document', iconColor: 'green', title: 'Télécharger tous les reçus', description: 'Format ZIP • 8 fichiers', href: '#' },
      { iconType: 'message', iconColor: 'blue', title: 'Contacter le support', description: 'Problème de paiement ?', href: '#' },
      { iconType: 'settings', iconColor: 'orange', title: 'Paramètres paiement', description: 'Notifications, rappels...', href: '#' },
    ],
  };

  return (
    <>
      <Header date="Dim. 1 Février 2026" hasNotifications />

      <main className={styles.mainContent}>
        <PageHeader
          onExport={() => console.log('Export all')}
          onManualPay={() => console.log('Manual pay')}
        />

        <StatsGrid stats={mockData.stats} />

        <div className={styles.paymentsLayout}>
          <div className={styles.paymentsMain}>
            <NextPaymentCard payment={mockData.nextPayment} />

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <ClockIcon />
                  Historique des paiements
                </h3>
              </div>
              <div className={styles.cardBody}>
                <FiltersBar
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                <PaymentTable
                  payments={mockData.payments}
                  onDownload={(id) => console.log('Download receipt', id)}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={2}
                  totalItems={8}
                  itemsPerPage={5}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>

          <div className={styles.paymentsSide}>
            <PaymentMethodCard
              method={mockData.paymentMethod}
              onEdit={() => console.log('Edit method')}
              onAdd={() => console.log('Add method')}
            />

            <YearlyChart data={mockData.chartData} />

            <QuickActions actions={mockData.quickActions} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Mes_Paiements;