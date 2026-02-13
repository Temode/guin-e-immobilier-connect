import { useState, useEffect, useCallback } from 'react';
import styles from './Agentmesbiens.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { getProperties, deleteProperty, type PropertyData } from '@/services/propertyService';
import PropertyForm from './PropertyForm';

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

const StarIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) =>
  filled ? (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ) : (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
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

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = ({ onAddClick }: { onAddClick: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.pageContext}>
          <span className={styles.pageDate}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
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
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onAddClick}>
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
const StatsGrid = ({ stats }: { stats: any[] }) => {
  const icons: Record<string, any> = {
    check: CheckCircleIcon,
    clock: ClockIcon,
    badge: BadgeCheckIcon,
    warning: WarningIcon,
  };

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat: any, index: number) => {
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
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({ filters, onFilterChange, viewMode, onViewModeChange }: any) => {
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
          <select value={filters.type} onChange={(e) => onFilterChange('type', e.target.value)}>
            <option value="">Tous les types</option>
            <option value="appartement">Appartement</option>
            <option value="villa">Villa</option>
            <option value="studio">Studio</option>
            <option value="maison">Maison</option>
          </select>
        </div>
        <div className={styles.filterSelect}>
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="available">Disponible</option>
            <option value="rented">Loué</option>
            <option value="sold">Vendu</option>
            <option value="draft">Brouillon</option>
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
          <select value={filters.sort} onChange={(e) => onFilterChange('sort', e.target.value)}>
            <option value="recent">Plus récent</option>
            <option value="price-high">Prix décroissant</option>
            <option value="price-low">Prix croissant</option>
          </select>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   PROPERTY CARD COMPONENT
========================================== */
const PropertyCard = ({ property, onEdit, onDelete }: { property: any; onEdit: (p: any) => void; onDelete: (id: string) => void }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const statusMap: Record<string, { label: string; class: string; icon: any }> = {
    available: { label: 'Disponible', class: 'active', icon: CheckCircleFilledIcon },
    rented: { label: 'Loué', class: 'rented', icon: CheckCircleFilledIcon },
    sold: { label: 'Vendu', class: 'rented', icon: CheckCircleFilledIcon },
    draft: { label: 'Brouillon', class: 'pending', icon: ClockIcon },
  };

  const statusBadge = statusMap[property.status] || statusMap.available;
  const StatusIcon = statusBadge.icon;
  const images = (property.images as string[]) || [];
  const firstImage = images.length > 0 ? images[0] : null;

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(property.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className={styles.propertyCard}>
      <div className={styles.propertyImage}>
        {firstImage ? (
          <img src={firstImage} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className={styles.propertyImagePlaceholder}>
            <HouseIcon />
          </div>
        )}
        <div className={styles.propertyBadges}>
          <span className={`${styles.propertyBadge} ${styles[statusBadge.class]}`}>
            <StatusIcon />
            {statusBadge.label}
          </span>
          {property.verified && (
            <span className={`${styles.propertyBadge} ${styles.premium}`}>
              <StarIcon filled />
              Vérifié
            </span>
          )}
        </div>
      </div>

      <div className={styles.propertyContent}>
        <div className={styles.propertyType}>
          {property.type} • {property.area ? `${property.area}m²` : '—'}
        </div>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}>
          <LocationIcon />
          {[property.quartier, property.commune, property.city].filter(Boolean).join(', ')}
        </p>
        <div className={styles.propertyPrice}>
          {Number(property.price).toLocaleString('fr-GN')} <span>{property.currency}/{property.transaction_type === 'location' ? 'mois' : ''}</span>
        </div>

        <div className={styles.propertyDivider}></div>

        <div className={styles.propertyStats}>
          <div className={styles.propertyStat}>
            <CalendarIcon />
            <strong>{daysSinceCreated}j</strong> en ligne
          </div>
          {property.bedrooms != null && (
            <div className={styles.propertyStat}>
              <BuildingIcon />
              <strong>{property.bedrooms}</strong> ch.
            </div>
          )}
          {property.furnished && (
            <div className={styles.propertyStat}>
              <CheckCircleIcon />
              Meublé
            </div>
          )}
        </div>

        <div className={styles.propertyFooter}>
          <button
            className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
            onClick={() => onEdit(property)}
          >
            Modifier
          </button>

          <div className={styles.dropdown}>
            <button
              className={styles.propertyMenuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <DotsVerticalIcon />
            </button>
            <div className={`${styles.dropdownMenu} ${menuOpen ? styles.open : ''}`}>
              <div className={styles.dropdownItem} onClick={() => { setMenuOpen(false); onEdit(property); }}>
                <EditIcon />
                Modifier
              </div>
              <div className={styles.dropdownDivider}></div>
              <div
                className={`${styles.dropdownItem} ${styles.danger}`}
                onClick={() => { setMenuOpen(false); onDelete(property.id); }}
              >
                <TrashIcon />
                Supprimer
              </div>
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
const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button className={styles.paginationBtn} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
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
      <span className={styles.paginationInfo}>Page {currentPage} sur {totalPages}</span>
      <button className={styles.paginationBtn} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
        <ChevronRightIcon />
      </button>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const ITEMS_PER_PAGE = 12;

const AgentMesBiens = () => {
  const { user } = useAuthContext();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    sort: 'recent',
  });
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyData | null>(null);

  const fetchProperties = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const { data, count } = await getProperties({
      owner_id: user.id,
      type: filters.type || undefined,
      status: filters.status || undefined,
      search: filters.search || undefined,
      sort: filters.sort,
      limit: ITEMS_PER_PAGE,
      offset,
    });
    setProperties(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  }, [user, filters, currentPage]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce bien définitivement ?')) return;
    await deleteProperty(id);
    fetchProperties();
  };

  const handleEdit = (property: any) => {
    setEditingProperty(property as PropertyData);
    setShowForm(true);
  };

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Compute stats from data
  const availableCount = properties.filter((p) => p.status === 'available').length;
  const rentedCount = properties.filter((p) => p.status === 'rented').length;
  const draftCount = properties.filter((p) => p.status === 'draft').length;

  const stats = [
    { icon: 'check', iconStyle: 'primary', value: totalCount, label: 'Total biens' },
    { icon: 'check', iconStyle: 'primary', value: availableCount, label: 'Disponibles' },
    { icon: 'badge', iconStyle: 'info', value: rentedCount, label: 'Loués' },
    { icon: 'clock', iconStyle: 'warning', value: draftCount, label: 'Brouillons', variant: 'warning' },
  ];

  return (
    <>
      <TopBar onAddClick={() => { setEditingProperty(null); setShowForm(true); }} />

      <div className={styles.pageContent}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderContent}>
            <h1>Mon portefeuille immobilier</h1>
            <p>Gérez vos biens, suivez leurs performances et optimisez vos locations</p>
          </div>
          <div className={styles.pageHeaderActions}>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { setEditingProperty(null); setShowForm(true); }}>
              <PlusIcon />
              Ajouter un bien
            </button>
          </div>
        </div>

        <StatsGrid stats={stats} />

        <FiltersBar
          filters={filters}
          onFilterChange={handleFilterChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            Chargement des biens...
          </div>
        ) : properties.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            <HouseIcon className={styles.emptyIcon} />
            <p style={{ marginTop: 12, fontSize: '1rem' }}>Aucun bien trouvé</p>
            <p style={{ fontSize: '0.875rem' }}>Cliquez sur "Ajouter un bien" pour commencer</p>
          </div>
        ) : (
          <div className={styles.propertiesGrid}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showForm && (
        <PropertyForm
          editProperty={editingProperty}
          onClose={() => setShowForm(false)}
          onSaved={fetchProperties}
        />
      )}
    </>
  );
};

export default AgentMesBiens;
