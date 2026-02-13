import { useState } from 'react';
import styles from './AgentAgenda.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const NotificationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const LightBulbIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ListIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const DotsVerticalIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => (
  <header className={styles.topBar}>
    <div className={styles.topBarLeft}>
      <div className={styles.pageContext}>
        <span className={styles.pageDate}>
          Mardi 4 février 2025
          <span className={styles.weather}>
            <SunIcon />
            28°C Conakry
          </span>
        </span>
        <h1 className={styles.pageTitle}>Agenda & Visites</h1>
      </div>
    </div>
    <div className={styles.topBarRight}>
      <button className={styles.iconBtn}>
        <NotificationIcon />
        <span className={styles.notificationBadge}>3</span>
      </button>
      <button className={`${styles.btn} ${styles.btnPrimary}`}>
        <PlusIcon />
        Nouvelle visite
      </button>
    </div>
  </header>
);

/* ==========================================
   HERO NEXT RDV COMPONENT
========================================== */
const HeroNextRdv = ({ nextRdv }) => (
  <div className={styles.heroNextRdv}>
    <div className={styles.heroHeader}>
      <div className={styles.heroLabel}>
        <ClockIcon />
        Prochain rendez-vous
      </div>
      <div className={`${styles.heroCountdown} ${nextRdv.isUrgent ? styles.urgent : ''}`}>
        <ClockIcon />
        {nextRdv.countdown}
      </div>
    </div>
    <div className={styles.heroBody}>
      <div className={styles.heroImage}>
        <div className={styles.heroImagePlaceholder}>
          <HomeIcon />
        </div>
      </div>
      <div className={styles.heroInfo}>
        <div className={styles.heroType}>
          <HomeIcon />
          {nextRdv.type}
        </div>
        <h2 className={styles.heroTitle}>{nextRdv.property.title}</h2>
        <p className={styles.heroPrice}>{nextRdv.property.price.toLocaleString('fr-GN')} GNF / mois</p>
        <div className={styles.heroClient}>
          <div className={styles.heroClientAvatar}>{nextRdv.client.initials}</div>
          <span className={styles.heroClientName}>{nextRdv.client.name}</span>
        </div>
        <div className={styles.heroAddress}>
          <LocationIcon />
          <span>{nextRdv.property.address}</span>
        </div>
      </div>
    </div>
    <div className={styles.heroActions}>
      <a href={`tel:${nextRdv.client.phone}`} className={styles.heroAction}>
        <PhoneIcon />
        Appeler
      </a>
      <a href={`https://wa.me/${nextRdv.client.phone.replace(/\D/g, '')}`} className={`${styles.heroAction} ${styles.whatsapp}`}>
        <WhatsAppIcon />
        WhatsApp
      </a>
      <a href={`https://maps.google.com/?q=${encodeURIComponent(nextRdv.property.address)}`} className={`${styles.heroAction} ${styles.maps}`}>
        <MapIcon />
        Itinéraire
      </a>
    </div>
    {nextRdv.note && (
      <div className={styles.heroNote}>
        <div className={styles.heroNoteLabel}>
          <LightBulbIcon />
          Note client
        </div>
        <p className={styles.heroNoteText}>"{nextRdv.note}"</p>
      </div>
    )}
  </div>
);

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }) => {
  const icons = {
    calendar: CalendarIcon,
    clipboard: ClipboardIcon,
    warning: WarningIcon,
    check: CheckCircleIcon,
  };

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => {
        const IconComponent = icons[stat.icon] || CalendarIcon;
        return (
          <div key={index} className={`${styles.statCard} ${stat.variant ? styles[stat.variant] : ''}`}>
            <div className={`${styles.statIcon} ${styles[stat.iconStyle]}`}>
              <IconComponent />
            </div>
            <div className={styles.statContent}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================
   ALERT BANNER COMPONENT
========================================== */
const AlertBanner = ({ alert }) => (
  <div className={styles.alertBanner}>
    <div className={styles.alertBannerIcon}>
      <WarningIcon />
    </div>
    <div className={styles.alertBannerContent}>
      <h4>{alert.title}</h4>
      <p>{alert.description}</p>
    </div>
    <button className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`}>
      <RefreshIcon />
      Relancer
    </button>
  </div>
);

/* ==========================================
   VIEW CONTROLS COMPONENT
========================================== */
const ViewControls = ({ activeTab, onTabChange, currentDate, viewMode, onViewModeChange }) => (
  <div className={styles.viewControls}>
    <div className={styles.viewTabs}>
      {['Aujourd\'hui', 'Semaine', 'Mois'].map((tab) => (
        <button
          key={tab}
          className={`${styles.viewTab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
    <div className={styles.viewOptions}>
      <div className={styles.dateNav}>
        <button className={styles.dateNavBtn}>
          <ChevronLeftIcon />
        </button>
        <span className={styles.dateDisplay}>{currentDate}</span>
        <button className={styles.dateNavBtn}>
          <ChevronRightIcon />
        </button>
      </div>
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => onViewModeChange('list')}
          title="Vue liste"
        >
          <ListIcon />
        </button>
        <button
          className={`${styles.viewToggleBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
          onClick={() => onViewModeChange('calendar')}
          title="Vue calendrier"
        >
          <CalendarIcon />
        </button>
      </div>
    </div>
  </div>
);

/* ==========================================
   VISIT CARD COMPONENT
========================================== */
const VisitCard = ({ visit }) => {
  const typeIcons = {
    visit: HomeIcon,
    'contre-visite': RefreshIcon,
    signature: PencilIcon,
    'etat-lieux': ClipboardIcon,
  };

  const statusLabels = {
    confirmed: { label: 'Confirmé', icon: CheckIcon },
    pending: { label: 'En attente', icon: ClockIcon },
    cancelled: { label: 'Annulé', icon: XIcon },
  };

  const TypeIcon = typeIcons[visit.type] || HomeIcon;
  const statusInfo = statusLabels[visit.status] || statusLabels.confirmed;
  const StatusIcon = statusInfo.icon;

  return (
    <article className={`${styles.visitCard} ${visit.status === 'pending' ? styles.pending : ''} ${visit.type === 'signature' ? styles.signature : ''}`}>
      <div className={styles.visitHeader}>
        <div className={styles.visitType}>
          <span className={`${styles.visitTypeBadge} ${styles[visit.type]}`}>
            <TypeIcon />
            {visit.typeLabel}
          </span>
          <span className={`${styles.visitStatus} ${styles[visit.status]}`}>
            <StatusIcon />
            {statusInfo.label}
          </span>
        </div>
        <div className={styles.visitMenu}>
          <button className={styles.visitMenuBtn}>
            <DotsVerticalIcon />
          </button>
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem}>
              <EditIcon />
              Modifier
            </div>
            <div className={styles.dropdownItem}>
              <CalendarIcon />
              Reporter
            </div>
            <div className={styles.dropdownDivider}></div>
            <div className={`${styles.dropdownItem} ${styles.danger}`}>
              <XIcon />
              Annuler
            </div>
          </div>
        </div>
      </div>
      <div className={styles.visitBody}>
        <div className={styles.visitProperty}>
          <div className={styles.visitPropertyImage}>
            <div className={styles.imagePlaceholder}>
              <HomeIcon />
            </div>
          </div>
          <div className={styles.visitPropertyInfo}>
            <h3 className={styles.visitPropertyTitle}>{visit.property.title}</h3>
            <p className={styles.visitPropertyPrice}>{visit.property.price.toLocaleString('fr-GN')} GNF/mois</p>
            <p className={styles.visitPropertyLocation}>
              <LocationIcon />
              {visit.property.location}
            </p>
          </div>
        </div>
        <div className={styles.visitClient}>
          <div className={styles.visitClientAvatar}>{visit.client.initials}</div>
          <div className={styles.visitClientInfo}>
            <h4 className={styles.visitClientName}>{visit.client.name}</h4>
            <p className={styles.visitClientPhone}>
              <PhoneIcon />
              {visit.client.phone}
            </p>
            {visit.client.note && (
              <p className={styles.visitClientNote}>"{visit.client.note}"</p>
            )}
          </div>
        </div>
        <div className={styles.visitAddress}>
          <div className={styles.visitAddressIcon}>
            <LocationIcon />
          </div>
          <div className={styles.visitAddressInfo}>
            <p className={styles.visitAddressText}>{visit.property.address}</p>
            <p className={styles.visitAddressEta}>
              <ClockIcon />
              {visit.eta}
            </p>
          </div>
        </div>
      </div>
      <div className={styles.visitFooter}>
        <a href={`tel:${visit.client.phone}`} className={styles.visitAction}>
          <PhoneIcon />
          Appeler
        </a>
        <a href={`https://wa.me/${visit.client.phone.replace(/\D/g, '')}`} className={`${styles.visitAction} ${styles.whatsapp}`}>
          <WhatsAppIcon />
          WhatsApp
        </a>
        <a href="https://maps.google.com" className={`${styles.visitAction} ${styles.maps}`}>
          <MapIcon />
          Maps
        </a>
        <a href="#" className={styles.visitAction}>
          <EyeIcon />
          Bien
        </a>
      </div>
    </article>
  );
};

/* ==========================================
   TIMELINE COMPONENT
========================================== */
const Timeline = ({ visits }) => (
  <div className={styles.timeline}>
    {visits.map((visit, index) => (
      <div key={index} className={styles.timelineItem}>
        <div className={styles.timelineTime}>{visit.time}</div>
        <div className={`${styles.timelineDot} ${styles[visit.type]} ${visit.status === 'pending' ? styles.pending : ''}`}></div>
        <VisitCard visit={visit} />
      </div>
    ))}
  </div>
);

/* ==========================================
   FAB COMPONENT
========================================== */
const FloatingActionButton = () => (
  <button className={styles.fab}>
    <PlusIcon />
  </button>
);

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentAgenda = () => {
  const [activeTab, setActiveTab] = useState('Aujourd\'hui');
  const [viewMode, setViewMode] = useState('list');

  // Mock Data
  const mockData = {
    nextRdv: {
      type: 'Visite',
      countdown: 'Dans 45 min',
      isUrgent: true,
      property: {
        title: 'Appartement F3 Meublé',
        price: 2500000,
        address: 'Cité Chemin de Fer, Immeuble B, 3ème étage, Kipé',
      },
      client: {
        name: 'Mamadou Diallo',
        initials: 'MD',
        phone: '+224 620 12 34 56',
      },
      note: 'Budget confirmé à 2,5M. Cherche avec parking. Famille de 3 personnes.',
    },
    stats: [
      { icon: 'calendar', iconStyle: 'primary', value: 4, label: 'Aujourd\'hui' },
      { icon: 'clipboard', iconStyle: 'info', value: 12, label: 'Cette semaine' },
      { icon: 'warning', iconStyle: 'warning', value: 2, label: 'À confirmer', variant: 'warning' },
      { icon: 'check', iconStyle: 'gold', value: 1, label: 'Signature prévue', variant: 'gold' },
    ],
    alert: {
      title: '2 visites en attente de confirmation',
      description: 'Mme Barry (11h30) et M. Keita (demain 15h) n\'ont pas encore confirmé leur présence.',
    },
    visits: [
      {
        time: '09:00',
        type: 'visit',
        typeLabel: 'Visite',
        status: 'confirmed',
        property: {
          title: 'Appartement F3 Meublé',
          price: 2500000,
          location: 'Kipé, Ratoma',
          address: 'Cité Chemin de Fer, Immeuble B, 3ème étage, Kipé',
        },
        client: {
          name: 'Mamadou Diallo',
          initials: 'MD',
          phone: '+224 620 12 34 56',
          note: 'Recherche F3, budget 2-3M, famille 3 personnes',
        },
        eta: '~25 min depuis votre position actuelle',
      },
      {
        time: '11:30',
        type: 'visit',
        typeLabel: 'Visite',
        status: 'pending',
        property: {
          title: 'Villa F4 avec Jardin',
          price: 4800000,
          location: 'Lambanyi, Ratoma',
          address: 'Quartier Résidentiel, Rue 12, Lambanyi',
        },
        client: {
          name: 'Aissatou Barry',
          initials: 'AB',
          phone: '+224 622 45 67 89',
          note: 'Cherche villa avec jardin pour les enfants',
        },
        eta: '~40 min depuis Kipé (trafic dense prévu)',
      },
      {
        time: '14:30',
        type: 'contre-visite',
        typeLabel: 'Contre-visite',
        status: 'confirmed',
        property: {
          title: 'Appartement F2 Rénové',
          price: 1200000,
          location: 'Nongo, Ratoma',
          address: 'Résidence Les Palmiers, Apt 204, Nongo',
        },
        client: {
          name: 'Ibrahima Sow',
          initials: 'IS',
          phone: '+224 625 11 22 33',
          note: '2ème visite - Veut vérifier la pression d\'eau',
        },
        eta: '~20 min depuis Lambanyi',
      },
      {
        time: '16:30',
        type: 'signature',
        typeLabel: 'Signature',
        status: 'confirmed',
        property: {
          title: 'Studio Centre-ville',
          price: 800000,
          location: 'Cosa, Matam',
          address: 'Immeuble Alpha, RDC, Cosa',
        },
        client: {
          name: 'Fatoumata Bah',
          initials: 'FB',
          phone: '+224 628 99 88 77',
          note: 'Documents prêts - Apporter 2 copies du contrat',
        },
        eta: '~35 min depuis Nongo',
      },
    ],
  };

  return (
    <>
      <TopBar />

      <div className={styles.pageContent}>
        {/* Hero Card - Prochain RDV */}
        <HeroNextRdv nextRdv={mockData.nextRdv} />

        {/* Stats Grid */}
        <StatsGrid stats={mockData.stats} />

        {/* Alert Banner */}
        <AlertBanner alert={mockData.alert} />

        {/* View Controls */}
        <ViewControls
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentDate="Mardi 4 février"
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Timeline */}
        <Timeline visits={mockData.visits} />
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </>
  );
};

export default AgentAgenda;