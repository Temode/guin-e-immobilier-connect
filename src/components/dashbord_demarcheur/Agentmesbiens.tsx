import { useState } from 'react';
import styles from './Agentmesbiens.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
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

const ExportIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BadgeCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const AlertIcon = ({ className }: { className?: string }) => (
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

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DotsVerticalIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const PencilIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
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

const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

const HouseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

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

/* ==========================================
   TYPE DEFINITIONS
========================================== */
interface BadgeData {
  type: string;
  label: string;
  icon?: React.FC<{ className?: string }>;
}

interface FeatureData {
  icon: React.FC<{ className?: string }>;
  value: string;
  variant?: string;
}

interface PropertyData {
  id: number;
  title: string;
  price: string;
  location: string;
  photos: number;
  premium?: boolean;
  alert?: boolean;
  status?: string;
  badges: BadgeData[];
  features: FeatureData[];
  owner: { initials: string; name: string };
  actionLabel: string;
  actionGold?: boolean;
}

interface StatData {
  icon: React.FC<{ className?: string }>;
  value: string;
  label: string;
  iconVariant: string;
  variant?: string;
}

interface AlertData {
  type: string;
  count: string;
  text: string;
}

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
        <h1 className={styles.pageTitle}>Mes biens</h1>
      </div>
    </div>
    <div className={styles.topBarRight}>
      <div className={styles.searchBox}>
        <SearchIcon />
        <input type="text" placeholder="Rechercher un bien, client..." />
      </div>
      <button className={styles.iconBtn}>
        <BellIcon />
        <span className={styles.notificationBadge}>3</span>
      </button>
      <button className={`${styles.btn} ${styles.btnPrimary}`}>
        <PlusIcon />
        Ajouter un bien
      </button>
    </div>
  </header>
);

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }: { stats: StatData[] }) => (
  <div className={styles.statsGrid}>
    {stats.map((stat, index) => (
      <div
        key={index}
        className={`${styles.statCard} ${stat.variant ? styles[stat.variant as keyof typeof styles] : ''}`}
      >
        <div className={`${styles.statIcon} ${styles[stat.iconVariant as keyof typeof styles]}`}>
          <stat.icon />
        </div>
        <div className={styles.statContent}>
          <div className={styles.statValue}>{stat.value}</div>
          <div className={styles.statLabel}>{stat.label}</div>
        </div>
      </div>
    ))}
  </div>
);

/* ==========================================
   ALERTS BANNER COMPONENT
========================================== */
const AlertsBanner = ({ alerts }: { alerts: AlertData[] }) => (
  <div className={styles.alertsBanner}>
    <div className={styles.alertsBannerIcon}>
      <AlertIcon />
    </div>
    <div className={styles.alertsBannerContent}>
      {alerts.map((alert, index) => (
        <div key={index} className={styles.alertsBannerItem}>
          <span className={`${styles.dot} ${styles[alert.type as keyof typeof styles]}`}></span>
          <span><strong>{alert.count}</strong> {alert.text}</span>
        </div>
      ))}
    </div>
    <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
      Voir les alertes
    </button>
  </div>
);

/* ==========================================
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({
  activeFilter,
  onFilterChange,
  sortValue,
  onSortChange,
}: {
  activeFilter: string;
  onFilterChange: (id: string) => void;
  sortValue: string;
  onSortChange: (val: string) => void;
}) => {
  const filters = [
    { id: 'type', icon: BuildingIcon, label: 'Type' },
    { id: 'status', icon: CheckCircleIcon, label: 'Statut' },
    { id: 'location', icon: LocationIcon, label: 'Quartier' },
  ];

  return (
    <div className={styles.filtersBar}>
      <div className={styles.filtersLeft}>
        <div className={styles.filterSearch}>
          <SearchIcon />
          <input type="text" placeholder="Rechercher par nom, adresse, quartier..." />
        </div>
        {filters.map((filter) => (
          <button
            key={filter.id}
            className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.active : ''}`}
            onClick={() => onFilterChange(filter.id)}
          >
            <filter.icon />
            {filter.label}
          </button>
        ))}
      </div>
      <div className={styles.filtersRight}>
        <div className={styles.sortDropdown}>
          <span className={styles.sortLabel}>Trier par :</span>
          <select
            className={styles.sortSelect}
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="recent">Plus récent</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="price-asc">Prix croissant</option>
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
const PropertyCard = ({ property, index }: { property: PropertyData; index: number }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const getCardClass = () => {
    let classes = styles.propertyCard;
    if (property.premium) classes += ` ${styles.premium}`;
    if (property.alert) classes += ` ${styles.alert}`;
    return classes;
  };

  const getBadgeClass = (badge: BadgeData) => {
    const badgeClasses: Record<string, string> = {
      active: styles.badgeActive,
      pending: styles.badgePending,
      rented: styles.badgeRented,
      expiring: styles.badgeExpiring,
      premium: styles.badgePremium,
      new: styles.badgeNew,
    };
    return `${styles.propertyBadge} ${badgeClasses[badge.type] || ''}`;
  };

  const getMenuItems = () => {
    if (property.status === 'expiring') {
      return [
        { icon: RefreshIcon, label: 'Renouveler mandat' },
        { icon: SparklesIcon, label: 'Booster', gold: true },
      ];
    }
    if (property.status === 'pending') {
      return [
        { icon: PencilIcon, label: 'Modifier' },
        { icon: TrashIcon, label: 'Annuler', danger: true },
      ];
    }
    return [
      { icon: PencilIcon, label: 'Modifier' },
      { icon: CurrencyIcon, label: 'Modifier prix' },
      { divider: true },
      { icon: SparklesIcon, label: 'Booster', gold: true },
      { divider: true },
      { icon: TrashIcon, label: 'Supprimer', danger: true },
    ];
  };

  return (
    <article className={getCardClass()} style={{ animationDelay: `${0.05 + index * 0.05}s` }}>
      <div className={styles.propertyImage}>
        <div className={styles.propertyImagePlaceholder}>
          <HouseIcon />
        </div>

        <div className={styles.propertyBadges}>
          {property.badges.map((badge, i) => (
            <span key={i} className={getBadgeClass(badge)}>
              {badge.icon && <badge.icon />}
              {badge.label}
            </span>
          ))}
        </div>

        <div className={styles.propertyMenuOverlay}>
          <button
            className={styles.propertyMenuBtn}
            onMouseEnter={() => setMenuOpen(true)}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <DotsVerticalIcon />
            <div className={`${styles.dropdownMenu} ${menuOpen ? styles.open : ''}`}>
              {getMenuItems().map((item, i) => {
                if ('divider' in item && item.divider) {
                  return <div key={i} className={styles.dropdownDivider} />;
                }
                const menuItem = item as { icon: React.FC<{ className?: string }>; label: string; gold?: boolean; danger?: boolean };
                return (
                  <div
                    key={i}
                    className={`${styles.dropdownItem} ${menuItem.gold ? styles.gold : ''} ${menuItem.danger ? styles.danger : ''}`}
                  >
                    <menuItem.icon />
                    {menuItem.label}
                  </div>
                );
              })}
            </div>
          </button>
        </div>

        <span className={styles.propertyPhotosCount}>
          <ImageIcon />
          {property.photos}
        </span>
      </div>

      <div className={styles.propertyContent}>
        <p className={styles.propertyPrice}>
          {property.price} <span>GNF/mois</span>
        </p>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}>
          <LocationIcon />
          {property.location}
        </p>

        <div className={styles.propertyFeatures}>
          {property.features.map((feature, i) => (
            <span
              key={i}
              className={`${styles.propertyFeature} ${feature.variant ? styles[feature.variant as keyof typeof styles] : ''}`}
            >
              <feature.icon />
              {feature.value}
            </span>
          ))}
        </div>

        <div className={styles.propertyFooter}>
          <div className={styles.propertyOwner}>
            <div className={styles.propertyOwnerAvatar}>{property.owner.initials}</div>
            <div className={styles.propertyOwnerInfo}>
              <span className={styles.propertyOwnerLabel}>Propriétaire</span>
              <span className={styles.propertyOwnerName}>{property.owner.name}</span>
            </div>
          </div>
          <button className={`${styles.propertyActionBtn} ${property.actionGold ? styles.gold : ''}`}>
            {property.actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => (
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
    <button
      className={styles.paginationBtn}
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
    >
      <ChevronRightIcon />
    </button>
  </div>
);

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentMesBiens = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('type');
  const [sortValue, setSortValue] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);

  const stats: StatData[] = [
    { icon: CheckCircleIcon, value: '8', label: 'Biens actifs', iconVariant: 'primary' },
    { icon: ClockIcon, value: '2', label: 'En attente', iconVariant: 'warning', variant: 'warning' },
    { icon: BadgeCheckIcon, value: '2', label: 'Loués ce mois', iconVariant: 'info' },
    { icon: AlertIcon, value: '3', label: 'Alertes', iconVariant: 'error', variant: 'error' },
  ];

  const alerts: AlertData[] = [
    { type: 'error', count: '2 mandats', text: 'expirent dans 15 jours' },
    { type: 'warning', count: '1 bien', text: 'sans visite depuis 14 jours' },
  ];

  const properties: PropertyData[] = [
    {
      id: 1,
      title: 'Bel appartement F3 avec vue panoramique',
      price: '2 500 000',
      location: 'Kipé, Ratoma',
      photos: 12,
      premium: true,
      badges: [
        { type: 'active', label: 'Actif' },
        { type: 'premium', label: 'Premium', icon: StarIcon },
      ],
      features: [
        { icon: EyeIcon, value: '234 vues' },
        { icon: CalendarIcon, value: '5 visites' },
        { icon: ClockIcon, value: '3j en ligne' },
      ],
      owner: { initials: 'MD', name: 'M. Mamadou Diallo' },
      actionLabel: 'Voir détails',
    },
    {
      id: 2,
      title: 'Villa moderne avec jardin et parking',
      price: '4 800 000',
      location: 'Lambanyi, Ratoma',
      photos: 8,
      badges: [{ type: 'active', label: 'Actif' }],
      features: [
        { icon: EyeIcon, value: '89 vues' },
        { icon: CalendarIcon, value: '2 visites' },
        { icon: ClockIcon, value: '8j en ligne' },
      ],
      owner: { initials: 'AB', name: 'Mme Aissatou Barry' },
      actionLabel: 'Voir détails',
    },
    {
      id: 3,
      title: 'Studio meublé centre-ville',
      price: '800 000',
      location: 'Cosa, Matam',
      photos: 6,
      alert: true,
      status: 'expiring',
      badges: [{ type: 'expiring', label: 'Expire 15j', icon: AlertIcon }],
      features: [
        { icon: EyeIcon, value: '12 vues', variant: 'error' },
        { icon: CalendarIcon, value: '0 visites', variant: 'error' },
        { icon: ClockIcon, value: '21j en ligne', variant: 'warning' },
      ],
      owner: { initials: 'OD', name: 'M. Oumar Diallo' },
      actionLabel: 'Booster',
      actionGold: true,
    },
    {
      id: 4,
      title: 'Appartement F2 rénové avec balcon',
      price: '1 800 000',
      location: 'Nongo, Ratoma',
      photos: 5,
      status: 'pending',
      badges: [{ type: 'pending', label: 'En attente' }],
      features: [
        { icon: ClockIcon, value: 'En attente de validation admin' },
      ],
      owner: { initials: 'FB', name: 'Mme Fatoumata Bah' },
      actionLabel: 'Voir détails',
    },
    {
      id: 5,
      title: 'Maison F5 avec dépendances',
      price: '6 500 000',
      location: 'Sonfonia, Ratoma',
      photos: 15,
      badges: [{ type: 'rented', label: 'Loué' }],
      features: [
        { icon: EyeIcon, value: '456 vues' },
        { icon: CalendarIcon, value: '12 visites' },
        { icon: ClockIcon, value: 'Loué le 28 Jan' },
      ],
      owner: { initials: 'SC', name: 'M. Sékou Camara' },
      actionLabel: 'Voir détails',
    },
    {
      id: 6,
      title: 'Duplex F4 avec terrasse et vue mer',
      price: '3 200 000',
      location: 'Ratoma Centre',
      photos: 10,
      badges: [
        { type: 'active', label: 'Actif' },
        { type: 'new', label: 'Nouveau' },
      ],
      features: [
        { icon: EyeIcon, value: '156 vues' },
        { icon: CalendarIcon, value: '3 visites' },
        { icon: ClockIcon, value: '5j en ligne' },
      ],
      owner: { initials: 'AK', name: 'M. Alpha Keita' },
      actionLabel: 'Voir détails',
    },
  ];

  return (
    <>
      <TopBar />
      <div className={styles.pageContent}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1>
              Mon portefeuille immobilier
              <span className={styles.resultsCount}>12 biens</span>
            </h1>
          </div>
          <div className={styles.pageHeaderRight}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vue grille"
              >
                <GridIcon />
              </button>
              <button
                className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                title="Vue liste"
              >
                <ListIcon />
              </button>
            </div>
            <button className={`${styles.btn} ${styles.btnSecondary}`}>
              <ExportIcon />
              Exporter
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              <PlusIcon />
              Ajouter un bien
            </button>
          </div>
        </div>

        <StatsGrid stats={stats} />
        <AlertsBanner alerts={alerts} />
        <FiltersBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortValue={sortValue}
          onSortChange={setSortValue}
        />

        {/* Property Grid */}
        <div className={styles.propertyGrid}>
          {properties.map((property, index) => (
            <PropertyCard key={property.id} property={property} index={index} />
          ))}
        </div>

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
