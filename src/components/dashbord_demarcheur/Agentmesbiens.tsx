import { useState } from 'react';
import styles from './Agentmesbiens.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

const NotificationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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

const StarIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  filled ? (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ) : (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
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

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const BadgeCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const GridIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const BanIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
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

const HouseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArchiveIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
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
          <h1 className={styles.pageTitle}>Mes biens</h1>
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
        <button className={`${styles.btn} ${styles.btnPrimary}`}>
          <PlusIcon />
          Ajouter un bien
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   STATS CARDS COMPONENT
========================================== */
const StatsGrid = ({ stats }) => {
  const icons = {
    check: CheckCircleIcon,
    clock: ClockIcon,
    badge: BadgeCheckIcon,
    warning: WarningIcon,
  };

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => {
        const IconComponent = icons[stat.icon] || CheckCircleIcon;
        return (
          <div
            key={index}
            className={`${styles.statCard} ${stat.variant ? styles[stat.variant] : ''}`}
          >
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
   ALERTS BANNER COMPONENT
========================================== */
const AlertsBanner = ({ alerts }) => {
  return (
    <div className={styles.alertsBanner}>
      <div className={styles.alertsBannerIcon}>
        <WarningIcon />
      </div>
      <div className={styles.alertsBannerContent}>
        {alerts.map((alert, index) => (
          <div key={index} className={styles.alertsBannerItem}>
            <span className={`${styles.dot} ${styles[alert.type]}`}></span>
            <span>
              <strong>{alert.count}</strong> {alert.text}
            </span>
          </div>
        ))}
      </div>
      <div className={styles.alertsBannerAction}>
        <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
          Voir les alertes
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({ filters, onFilterChange, viewMode, onViewModeChange }) => {
  return (
    <div className={styles.filtersBar}>
      <div className={styles.filtersLeft}>
        <div className={styles.filterSearch}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher par nom, adresse, quartier..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className={styles.filterSelect}>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange('type', e.target.value)}
          >
            <option value="">Tous les types</option>
            <option value="apartment">Appartement</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="duplex">Duplex</option>
          </select>
        </div>
        <div className={styles.filterSelect}>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="rented">Loué</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
        <div className={styles.filterSelect}>
          <select
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
          >
            <option value="">Tous les quartiers</option>
            <option value="kipe">Kipé</option>
            <option value="ratoma">Ratoma</option>
            <option value="lambanyi">Lambanyi</option>
            <option value="cosa">Cosa</option>
            <option value="nongo">Nongo</option>
            <option value="matam">Matam</option>
          </select>
        </div>
      </div>
      <div className={styles.filtersRight}>
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Vue grille"
          >
            <GridIcon />
          </button>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
            onClick={() => onViewModeChange('list')}
            title="Vue liste"
          >
            <ListIcon />
          </button>
        </div>
        <div className={styles.sortSelect}>
          <span>Trier par:</span>
          <select
            value={filters.sort}
            onChange={(e) => onFilterChange('sort', e.target.value)}
          >
            <option value="recent">Plus récent</option>
            <option value="price-high">Prix décroissant</option>
            <option value="price-low">Prix croissant</option>
            <option value="views">Plus de vues</option>
          </select>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   PROPERTY CARD COMPONENT
========================================== */
const PropertyCard = ({ property }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusBadges = {
    active: { label: 'Actif', class: 'active', icon: CheckCircleFilledIcon },
    pending: { label: 'En attente', class: 'pending', icon: ClockIcon },
    rented: { label: 'Loué', class: 'rented', icon: CheckCircleFilledIcon },
    inactive: { label: 'Inactif', class: 'inactive', icon: BanIcon },
    expiring: { label: `Expire ${property.expiresIn}`, class: 'expiring', icon: WarningIcon },
  };

  const statusBadge = statusBadges[property.status] || statusBadges.active;
  const StatusIcon = statusBadge.icon;

  return (
    <div className={`${styles.propertyCard} ${property.hasAlert ? styles.alert : ''}`}>
      <div className={styles.propertyImage}>
        <div className={styles.propertyImagePlaceholder}>
          <HouseIcon />
        </div>
        <div className={styles.propertyBadges}>
          <span className={`${styles.propertyBadge} ${styles[statusBadge.class]}`}>
            <StatusIcon />
            {statusBadge.label}
          </span>
          {property.isPremium && (
            <span className={`${styles.propertyBadge} ${styles.premium}`}>
              <StarIcon filled />
              Top
            </span>
          )}
        </div>
      </div>

      <div className={styles.propertyContent}>
        <div className={styles.propertyType}>
          {property.type} • {property.surface}m²
        </div>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}>
          <LocationIcon />
          {property.location}
        </p>
        <div className={`${styles.propertyPrice} ${property.isPremium ? styles.premium : ''}`}>
          {property.price.toLocaleString('fr-GN')} <span>GNF/mois</span>
        </div>

        <div className={styles.propertyDivider}></div>

        <div className={styles.propertyStats}>
          <div className={`${styles.propertyStat} ${property.stats.views < 20 ? styles.error : ''}`}>
            <EyeIcon />
            <strong>{property.stats.views}</strong> vues
          </div>
          <div className={`${styles.propertyStat} ${property.stats.visits === 0 ? styles.error : ''}`}>
            <CalendarIcon />
            <strong>{property.stats.visits}</strong> visites
          </div>
          <div className={`${styles.propertyStat} ${property.stats.daysOnline > 20 ? styles.warning : ''}`}>
            <ClockIcon />
            <strong>{property.stats.daysOnline}j</strong> en ligne
          </div>
        </div>

        <div className={styles.propertyOwner}>
          <div className={styles.propertyOwnerAvatar}>{property.owner.initials}</div>
          <div className={styles.propertyOwnerInfo}>
            <div className={styles.propertyOwnerLabel}>Propriétaire</div>
            <div className={styles.propertyOwnerName}>{property.owner.name}</div>
          </div>
        </div>

        <div className={styles.propertyFooter}>
          {property.status === 'expiring' ? (
            <button className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`}>
              <SparklesIcon />
              Booster
            </button>
          ) : property.status === 'rented' ? (
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
              Voir locataire
            </button>
          ) : (
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
              Voir détails
            </button>
          )}

          <div className={styles.dropdown}>
            <button
              className={styles.propertyMenuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <DotsVerticalIcon />
            </button>
            <div className={`${styles.dropdownMenu} ${menuOpen ? styles.open : ''}`}>
              <div className={styles.dropdownItem}>
                <EditIcon />
                Modifier
              </div>
              <div className={styles.dropdownItem}>
                <CurrencyIcon />
                Modifier le prix
              </div>
              <div className={styles.dropdownDivider}></div>
              <div className={`${styles.dropdownItem} ${styles.gold}`}>
                <SparklesIcon />
                Booster
              </div>
              <div className={styles.dropdownDivider}></div>
              {property.status === 'rented' ? (
                <>
                  <div className={styles.dropdownItem}>
                    <DocumentIcon />
                    Voir le contrat
                  </div>
                  <div className={styles.dropdownItem}>
                    <ArchiveIcon />
                    Archiver
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.dropdownItem}>
                    <BanIcon />
                    Désactiver
                  </div>
                  <div className={`${styles.dropdownItem} ${styles.danger}`}>
                    <TrashIcon />
                    Supprimer
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          className={`${styles.paginationBtn} ${page === currentPage ? styles.active : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      <span className={styles.paginationInfo}>
        Page {currentPage} sur {totalPages}
      </span>
      <button
        className={styles.paginationBtn}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentMesBiens = () => {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    location: '',
    sort: 'recent',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Mock Data
  const mockData = {
    stats: [
      { icon: 'check', iconStyle: 'primary', value: 8, label: 'Biens actifs' },
      { icon: 'clock', iconStyle: 'warning', value: 2, label: 'En attente', variant: 'warning' },
      { icon: 'badge', iconStyle: 'info', value: 2, label: 'Loués ce mois' },
      { icon: 'warning', iconStyle: 'error', value: 3, label: 'Alertes', variant: 'error' },
    ],
    alerts: [
      { type: 'error', count: '2 mandats', text: 'expirent dans 15 jours' },
      { type: 'warning', count: '1 bien', text: 'sans visite depuis 14 jours' },
    ],
    properties: [
      {
        id: 1,
        type: 'Appartement F3',
        surface: 85,
        title: 'Bel appartement lumineux',
        location: 'Kipé, Ratoma',
        price: 2500000,
        status: 'active',
        isPremium: true,
        stats: { views: 234, visits: 5, daysOnline: 12 },
        owner: { initials: 'MD', name: 'M. Mamadou Diallo' },
      },
      {
        id: 2,
        type: 'Villa F4',
        surface: 150,
        title: 'Villa moderne avec jardin',
        location: 'Lambanyi, Ratoma',
        price: 4800000,
        status: 'active',
        isPremium: false,
        stats: { views: 89, visits: 2, daysOnline: 8 },
        owner: { initials: 'AB', name: 'Mme Aissatou Barry' },
      },
      {
        id: 3,
        type: 'Studio',
        surface: 35,
        title: 'Studio centre-ville',
        location: 'Cosa, Matam',
        price: 800000,
        status: 'expiring',
        expiresIn: '15j',
        hasAlert: true,
        isPremium: false,
        stats: { views: 12, visits: 0, daysOnline: 21 },
        owner: { initials: 'OD', name: 'M. Oumar Diallo' },
      },
      {
        id: 4,
        type: 'Appartement F2',
        surface: 55,
        title: 'Appart F2 rénové',
        location: 'Nongo, Ratoma',
        price: 1200000,
        status: 'pending',
        isPremium: false,
        stats: { views: 45, visits: 1, daysOnline: 3 },
        owner: { initials: 'FB', name: 'Mme Fatoumata Bah' },
      },
      {
        id: 5,
        type: 'Villa F5',
        surface: 200,
        title: 'Grande villa familiale',
        location: 'Kipé, Ratoma',
        price: 6500000,
        status: 'rented',
        isPremium: false,
        stats: { views: 312, visits: 8, daysOnline: 45 },
        owner: { initials: 'IS', name: 'M. Ibrahima Sow' },
      },
      {
        id: 6,
        type: 'Duplex F4',
        surface: 120,
        title: 'Duplex avec terrasse',
        location: 'Ratoma Centre',
        price: 3200000,
        status: 'active',
        isPremium: false,
        stats: { views: 156, visits: 3, daysOnline: 5 },
        owner: { initials: 'AK', name: 'M. Alpha Keita' },
      },
    ],
  };

  return (
    <>
      <TopBar />

      <div className={styles.pageContent}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderContent}>
            <h1>Mon portefeuille immobilier</h1>
            <p>Gérez vos biens, suivez leurs performances et optimisez vos locations</p>
          </div>
          <div className={styles.pageHeaderActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`}>
              <UploadIcon />
              Exporter
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              <PlusIcon />
              Ajouter un bien
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsGrid stats={mockData.stats} />

        {/* Alerts Banner */}
        <AlertsBanner alerts={mockData.alerts} />

        {/* Filters Bar */}
        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Properties Grid */}
        <div className={styles.propertiesGrid}>
          {mockData.properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={2}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default AgentMesBiens;