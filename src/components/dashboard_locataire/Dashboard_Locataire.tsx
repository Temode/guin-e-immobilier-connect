// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { getTenantActiveRental, daysUntilNextPayment, formatPaymentMethod, monthsRemaining, type RentalWithDetails } from '@/services/rentalService';
import styles from './Dashboard_Locataire.module.css';

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

const BuildingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

const UserIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ title, date, hasNotifications }) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>
      <div className={styles.headerRight}>
        <span className={styles.headerDate}>{date}</span>
        <button className={styles.headerBtn}>
          <SearchIcon />
        </button>
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
   WELCOME BANNER COMPONENT
========================================== */
const WelcomeBanner = ({ userName, property }) => {
  return (
    <div className={styles.welcomeBanner}>
      <div className={styles.welcomeContent}>
        <p className={styles.welcomeGreeting}>Bonjour {userName} 👋</p>
        <h2 className={styles.welcomeTitle}>Bienvenue sur votre espace locataire</h2>
        <p className={styles.welcomeSubtitle}>
          Gérez votre loyer, consultez vos documents et communiquez facilement avec votre agent.
        </p>
      </div>
      <div className={styles.welcomeHome}>
        <div className={styles.homeThumb}>
          <BuildingIcon />
        </div>
        <div className={styles.homeDetails}>
          <h4>{property.type} • {property.surface}</h4>
          <p>{property.address}</p>
          <span className={styles.homeBadge}>
            <span className={styles.homeBadgeDot}></span>
            {property.status}
          </span>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   RENT CARD COMPONENT
========================================== */
const RentCard = ({ rent, paymentMethod, onEditPaymentMethod }) => {
  const getStatusClass = (status) => {
    switch (status) {
      case 'paid': return styles.statusPaid;
      case 'pending': return styles.statusPending;
      case 'failed': return styles.statusFailed;
      default: return '';
    }
  };

  const formatAmount = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <div className={styles.rentCard}>
      <div className={styles.rentCardHeader}>
        <span className={styles.rentLabel}>{rent.label}</span>
        <span className={`${styles.rentStatus} ${getStatusClass(rent.status)}`}>
          {rent.status === 'paid' && <CheckIcon />}
          {rent.statusText}
        </span>
      </div>
      <div className={styles.rentCardBody}>
        <div className={styles.rentAmountRow}>
          <div className={styles.rentAmount}>
            {formatAmount(rent.amount)}<span>{rent.currency}</span>
          </div>
          <div className={styles.rentCountdown}>
            <p className={styles.countdownLabel}>Prochain prélèvement dans</p>
            <div className={styles.countdownValue}>
              <span className={styles.countdownNumber}>{rent.daysUntilNext}</span>
              <span className={styles.countdownText}>jours</span>
            </div>
          </div>
        </div>

        <div className={styles.rentDueInfo}>
          <div className={styles.dueDetail}>
            <span className={styles.dueLabel}>Date d'échéance</span>
            <span className={styles.dueValue}>{rent.dueDate}</span>
          </div>
          <div className={styles.dueDetail}>
            <span className={styles.dueLabel}>Mode de paiement</span>
            <span className={styles.dueValue}>{rent.paymentMode}</span>
          </div>
        </div>

        <div className={styles.rentPaymentMethod}>
          <div className={styles.paymentIcon}>{paymentMethod.iconText}</div>
          <div className={styles.paymentInfo}>
            <p className={styles.paymentLabel}>Compte de prélèvement</p>
            <p className={styles.paymentValue}>{paymentMethod.label}</p>
          </div>
          {paymentMethod.isActive && (
            <span className={styles.paymentStatus}>
              <CheckIcon />
              Actif
            </span>
          )}
          <button className={styles.paymentEditBtn} onClick={onEditPaymentMethod}>
            Modifier
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   QUICK ACTIONS COMPONENT
========================================== */
const QuickActions = ({ actions }) => {
  const defaultActions = [
    { id: 'contact', icon: MessageIcon, iconStyle: 'iconContact', title: "Contacter l'agent", description: 'Envoyer un message', href: '#' },
    { id: 'problem', icon: WarningIcon, iconStyle: 'iconProblem', title: 'Signaler un problème', description: 'Fuite, panne, dégât...', href: '#' },
    { id: 'receipt', icon: DocumentIcon, iconStyle: 'iconReceipt', title: 'Télécharger un reçu', description: 'Dernier paiement', href: '#' },
    { id: 'contract', icon: DocumentIcon, iconStyle: 'iconContract', title: 'Voir mon contrat', description: 'Bail en cours', href: '#' },
  ];

  const items = actions || defaultActions;

  return (
    <div className={styles.quickActionsGrid}>
      {items.map((action) => (
        <a key={action.id} href={action.href} className={styles.quickAction}>
          <div className={`${styles.quickActionIcon} ${styles[action.iconStyle]}`}>
            <action.icon />
          </div>
          <div className={styles.quickActionContent}>
            <h4>{action.title}</h4>
            <p>{action.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

/* ==========================================
   CARD COMPONENT
========================================== */
const Card = ({ title, icon: Icon, actionLabel, actionHref, children, noPaddingTop }) => {
  return (
    <div className={styles.card}>
      {title && (
        <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            {Icon && <Icon />}
            {title}
          </h3>
          {actionLabel && (
            <a href={actionHref || '#'} className={styles.cardAction}>
              {actionLabel}
              <ChevronRightIcon />
            </a>
          )}
        </div>
      )}
      <div className={noPaddingTop ? styles.cardBodyNoPaddingTop : styles.cardBody}>
        {children}
      </div>
    </div>
  );
};

/* ==========================================
   AGENT CARD COMPONENT
========================================== */
const AgentCard = ({ agent, onMessage, onCall }) => {
  const getInitials = (name) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  return (
    <Card title="Votre agent" icon={UserIcon}>
      <div className={styles.agentCard}>
        <div className={styles.agentAvatar}>{getInitials(agent.name)}</div>
        <div className={styles.agentInfo}>
          <p className={styles.agentRole}>{agent.role}</p>
          <p className={styles.agentName}>{agent.name}</p>
          {agent.verified && (
            <span className={styles.agentVerified}>
              <VerifiedBadgeIcon />
              Identité vérifiée
            </span>
          )}
        </div>
        <div className={styles.agentActions}>
          <button className={`${styles.agentBtn} ${styles.primary}`} aria-label="Envoyer un message" onClick={onMessage}>
            <MessageIcon />
          </button>
          {agent.phone && (
            <button className={`${styles.agentBtn} ${styles.secondary}`} aria-label="Appeler" onClick={onCall}>
              <PhoneIcon />
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

/* ==========================================
   HOUSING DETAILS COMPONENT
========================================== */
const HousingDetails = ({ housing }) => {
  const details = [
    { label: 'Type', value: housing.type },
    { label: 'Surface', value: housing.surface },
    { label: 'Début bail', value: housing.startDate },
    { label: 'Fin bail', value: housing.endDate },
  ];

  return (
    <Card title="Détails du logement" icon={BuildingIcon} actionLabel="Voir plus" actionHref="#">
      <div className={styles.housingGrid}>
        {details.map((detail, index) => (
          <div key={index} className={styles.housingStat}>
            <p className={styles.housingStatLabel}>{detail.label}</p>
            <p className={styles.housingStatValue}>{detail.value}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ==========================================
   NOTIFICATIONS COMPONENT
========================================== */
const Notifications = ({ notifications }) => {
  const iconMap = {
    success: CheckIcon,
    info: MessageIcon,
    warning: ClockIcon,
  };

  return (
    <Card title="Notifications récentes" icon={NotificationIcon} actionLabel="Voir tout" actionHref="#" noPaddingTop>
      <div className={styles.notificationList}>
        {notifications.map((notification, index) => {
          const IconComponent = iconMap[notification.type] || CheckIcon;
          return (
            <div key={index} className={`${styles.notificationItem} ${notification.unread ? styles.unread : ''}`}>
              <div className={`${styles.notificationIcon} ${styles[notification.type]}`}>
                <IconComponent />
              </div>
              <div className={styles.notificationContent}>
                <p className={styles.notificationText}>
                  <strong>{notification.title}</strong> — {notification.message}
                </p>
                <p className={styles.notificationTime}>{notification.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/* ==========================================
   NO RENTAL STATE COMPONENT
========================================== */
const NoRentalState = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.mainContent}>
      <div className={styles.noRentalState}>
        <BuildingIcon />
        <h2>Aucune location active</h2>
        <p>Vous n'avez pas encore de logement loué. Commencez par rechercher un bien qui vous correspond.</p>
        <button className={styles.searchBtn} onClick={() => navigate('/dashboard-locataire/recherche')}>
          <SearchIcon /> Rechercher un logement
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN DASHBOARD COMPONENT
========================================== */
const Dashboard_Locataire = () => {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const [rental, setRental] = useState<RentalWithDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data } = await getTenantActiveRental(user.id);
      setRental(data);
      setLoading(false);
    })();
  }, [user]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
  const firstName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Utilisateur';

  if (loading) {
    return (
      <>
        <Header title="Tableau de bord" date={dateStr} hasNotifications={false} />
        <div className={styles.mainContent}>
          <div className={styles.loadingState}>Chargement...</div>
        </div>
      </>
    );
  }

  // No active rental → show empty state
  if (!rental) {
    return (
      <>
        <Header title="Tableau de bord" date={dateStr} hasNotifications={false} />
        <NoRentalState />
      </>
    );
  }

  // Build data from rental
  const property = rental.property;
  const agentOrOwner = rental.agent_profile || rental.owner_profile;
  const agentName = agentOrOwner?.full_name || 'Propriétaire';
  const agentPhone = agentOrOwner?.phone || null;
  const agentVerified = agentOrOwner?.kyc_status === 'verified';

  const remainingMonths = monthsRemaining(rental.end_date);
  const propertyData = {
    type: property ? `${property.type} ${property.bedrooms ? `T${property.bedrooms}` : ''}`.trim() : 'Logement',
    surface: property?.area ? `${property.area}m²` : '—',
    address: property ? [property.quartier, property.commune, property.city].filter(Boolean).join(', ') : '—',
    status: rental.end_date
      ? `Bail actif • Expire dans ${remainingMonths ?? '?'} mois`
      : 'Bail actif • Durée indéterminée',
  };

  const paymentDay = rental.payment_day_of_month;
  const daysLeft = daysUntilNextPayment(paymentDay);
  const nextDate = new Date();
  if (nextDate.getDate() >= paymentDay) {
    nextDate.setMonth(nextDate.getMonth() + 1);
  }
  nextDate.setDate(paymentDay);
  const nextDateStr = nextDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const paymentMethodInfo = formatPaymentMethod(rental.payment_method);

  const rentData = {
    label: `Loyer du mois`,
    amount: rental.rent_amount,
    currency: rental.currency,
    status: 'pending',
    statusText: 'En attente',
    daysUntilNext: daysLeft,
    dueDate: nextDateStr,
    paymentMode: paymentMethodInfo.label,
  };

  const paymentMethodData = {
    iconText: paymentMethodInfo.iconText,
    label: paymentMethodInfo.label,
    isActive: !!rental.payment_method,
  };

  const housingData = {
    type: propertyData.type,
    surface: propertyData.surface,
    startDate: new Date(rental.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
    endDate: rental.end_date
      ? new Date(rental.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Indéterminée',
  };

  const agentData = {
    name: agentName,
    role: rental.agent_id ? 'Agent immobilier' : 'Propriétaire',
    verified: agentVerified,
    phone: agentPhone,
  };

  const notifications = [
    { type: 'info', title: 'Location active', message: `Votre bail a commencé le ${housingData.startDate}.`, time: 'Récent', unread: true },
    ...(remainingMonths !== null && remainingMonths <= 3
      ? [{ type: 'warning', title: 'Rappel', message: `Votre bail expire dans ${remainingMonths} mois.`, time: 'Récent', unread: false }]
      : []),
  ];

  const handleEditPaymentMethod = () => console.log('Edit payment method');
  const handleMessageAgent = () => navigate('/dashboard-locataire/messages');
  const handleCallAgent = () => { if (agentPhone) window.open(`tel:${agentPhone}`); };

  return (
    <>
      <Header title="Tableau de bord" date={dateStr} hasNotifications={notifications.length > 0} />

      <main className={styles.mainContent}>
        <WelcomeBanner userName={firstName} property={propertyData} />

        <div className={styles.dashboardGrid}>
          <div className={styles.dashboardMain}>
            <RentCard
              rent={rentData}
              paymentMethod={paymentMethodData}
              onEditPaymentMethod={handleEditPaymentMethod}
            />
            <QuickActions />
          </div>

          <div className={styles.dashboardSide}>
            <AgentCard agent={agentData} onMessage={handleMessageAgent} onCall={handleCallAgent} />
            <HousingDetails housing={housingData} />
            <Notifications notifications={notifications} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard_Locataire;
