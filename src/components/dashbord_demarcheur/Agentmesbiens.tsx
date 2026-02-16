import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Agentmesbiens.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { getProperties, deleteProperty, type PropertyData } from '@/services/propertyService';
import PropertyForm from './PropertyForm';

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

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const HouseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

/* ==========================================
   HELPER FUNCTIONS
========================================== */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-GN').format(price);
};

const getStatusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    available: 'badgeActive',
    rented: 'badgeRented',
    sold: 'badgeSold',
    draft: 'badgeDraft',
  };
  return map[status] || 'badgeActive';
};

const getStatusLabel = (status: string): string => {
  const map: Record<string, string> = {
    available: 'Actif',
    rented: 'Loué',
    sold: 'Vendu',
    draft: 'Brouillon',
  };
  return map[status] || status;
};

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = ({ onAddClick }: { onAddClick: () => void }) => (
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
        <input type="text" placeholder="Rechercher un bien, client..." />
      </div>
      <button className={styles.iconBtn}>
        <BellIcon />
        <span className={styles.notificationBadge}>3</span>
      </button>
      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onAddClick}>
        <PlusIcon />
        Ajouter un bien
      </button>
    </div>
  </header>
);

/* ==========================================
   STATS GRID COMPONENT
========================================== */
interface StatData {
  icon: React.FC<{ className?: string }>;
  value: string;
  label: string;
  iconVariant: string;
  variant?: string;
}

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
interface AlertData {
  type: string;
  count: string;
  text: string;
}

const AlertsBanner = ({ alerts }: { alerts: AlertData[] }) => {
  if (alerts.length === 0) return null;
  return (
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
};

/* ==========================================
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({
  activeFilter,
  onFilterChange,
  sortValue,
  onSortChange,
  searchQuery,
  onSearchChange,
}: {
  activeFilter: string;
  onFilterChange: (id: string) => void;
  sortValue: string;
  onSortChange: (val: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
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
          <input
            type="text"
            placeholder="Rechercher par nom, adresse, quartier..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
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
const PropertyCard = ({
  property,
  index,
  onEdit,
  onDelete,
  onView,
}: {
  property: PropertyData;
  index: number;
  onEdit: (p: PropertyData) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const images = (property.images as string[]) || [];
  const firstImage = images.length > 0 ? images[0] : null;
  const status = property.status || 'available';

  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(property.created_at || '').getTime()) / (1000 * 60 * 60 * 24)
  );

  const cardClass = `${styles.propertyCard}`;

  return (
    <article className={cardClass} style={{ animationDelay: `${0.05 + index * 0.05}s` }}>
      <div className={styles.propertyImage}>
        {firstImage ? (
          <img src={firstImage} alt={property.title} />
        ) : (
          <div className={styles.propertyImagePlaceholder}>
            <HouseIcon />
          </div>
        )}

        <div className={styles.propertyBadges}>
          <span className={`${styles.propertyBadge} ${styles[getStatusBadgeClass(status)]}`}>
            {getStatusLabel(status)}
          </span>
          {property.verified && (
            <span className={`${styles.propertyBadge} ${styles.badgePremium}`}>
              Vérifié
            </span>
          )}
        </div>

        <div className={styles.propertyMenuOverlay}>
          <button
            className={styles.propertyMenuBtn}
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
            onBlur={() => setTimeout(() => setMenuOpen(false), 200)}
          >
            <DotsVerticalIcon />
            <div className={`${styles.dropdownMenu} ${menuOpen ? styles.open : ''}`}>
              <div className={styles.dropdownItem} onClick={() => onView(property.id!)}>
                <EyeIcon />
                Voir détails
              </div>
              <div className={styles.dropdownItem} onClick={() => onEdit(property)}>
                <PencilIcon />
                Modifier
              </div>
              <div className={styles.dropdownDivider} />
              <div className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => onDelete(property.id!)}>
                <TrashIcon />
                Supprimer
              </div>
            </div>
          </button>
        </div>

        <span className={styles.propertyPhotosCount}>
          <ImageIcon />
          {images.length}
        </span>
      </div>

      <div className={styles.propertyContent}>
        <p className={styles.propertyPrice}>
          {formatPrice(property.price)}{' '}
          <span>{property.currency || 'GNF'}/{property.transaction_type === 'vente' ? '' : 'mois'}</span>
        </p>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}>
          <LocationIcon />
          {[property.quartier, property.commune, property.city].filter(Boolean).join(', ')}
        </p>

        <div className={styles.propertyFeatures}>
          {property.bedrooms != null && (
            <span className={styles.propertyFeature}>
              <BuildingIcon />
              {property.bedrooms} ch.
            </span>
          )}
          {property.area != null && (
            <span className={styles.propertyFeature}>
              <EyeIcon />
              {property.area} m²
            </span>
          )}
          <span className={styles.propertyFeature}>
            <CalendarIcon />
            {daysSinceCreated}j en ligne
          </span>
        </div>

        <div className={styles.propertyFooter}>
          <div className={styles.propertyOwner}>
            <div className={styles.propertyOwnerAvatar}>
              {property.type?.charAt(0).toUpperCase() || 'B'}
            </div>
            <div className={styles.propertyOwnerInfo}>
              <span className={styles.propertyOwnerLabel}>{property.type}</span>
              <span className={styles.propertyOwnerName}>{property.transaction_type === 'location' ? 'Location' : 'Vente'}</span>
            </div>
          </div>
          <button
            className={styles.propertyActionBtn}
            onClick={() => onView(property.id!)}
          >
            Voir détails
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
}) => {
  if (totalPages <= 1) return null;
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
const ITEMS_PER_PAGE = 12;

const AgentMesBiens = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('grid');
  const [activeFilter, setActiveFilter] = useState('type');
  const [sortValue, setSortValue] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProperty, setEditProperty] = useState<PropertyData | null>(null);

  const loadProperties = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, count } = await getProperties({
        owner_id: user.id,
        search: searchQuery || undefined,
        sort: sortValue,
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
      });
      setProperties((data as unknown as PropertyData[]) || []);
      setTotalCount(count || 0);
    } catch (err) {
      console.error('Error loading properties:', err);
    } finally {
      setLoading(false);
    }
  }, [user, searchQuery, sortValue, currentPage]);

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce bien ?')) return;
    const { error } = await deleteProperty(id);
    if (!error) loadProperties();
  };

  const handleEdit = (p: PropertyData) => {
    setEditProperty(p);
    setShowForm(true);
  };

  const handleView = (id: string) => {
    navigate(`/property/${id}`);
  };

  // Compute stats from loaded data
  const activeCount = properties.filter((p) => p.status === 'available').length;
  const draftCount = properties.filter((p) => p.status === 'draft').length;
  const rentedCount = properties.filter((p) => p.status === 'rented').length;

  const stats: StatData[] = [
    { icon: CheckCircleIcon, value: String(activeCount), label: 'Biens actifs', iconVariant: 'primary' },
    { icon: ClockIcon, value: String(draftCount), label: 'Brouillons', iconVariant: 'warning', variant: 'warning' },
    { icon: BadgeCheckIcon, value: String(rentedCount), label: 'Loués', iconVariant: 'info' },
    { icon: AlertIcon, value: String(totalCount), label: 'Total biens', iconVariant: 'error' },
  ];

  const alerts: AlertData[] = draftCount > 0
    ? [{ type: 'warning', count: `${draftCount} bien(s)`, text: 'en brouillon à publier' }]
    : [];

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <>
      <TopBar onAddClick={() => { setEditProperty(null); setShowForm(true); }} />
      <div className={styles.pageContent}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1>
              Mon portefeuille immobilier
              <span className={styles.resultsCount}>{totalCount} biens</span>
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
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => { setEditProperty(null); setShowForm(true); }}
            >
              <PlusIcon />
              Ajouter un bien
            </button>
          </div>
        </div>

        <StatsGrid stats={stats} />
        {alerts.length > 0 && <AlertsBanner alerts={alerts} />}
        <FiltersBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          sortValue={sortValue}
          onSortChange={setSortValue}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Property Grid */}
        {loading ? (
          <div className={styles.loadingState}>
            <p>Chargement des biens...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className={styles.emptyState}>
            <HouseIcon />
            <p>Aucun bien trouvé. Ajoutez votre premier bien !</p>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={() => { setEditProperty(null); setShowForm(true); }}
            >
              <PlusIcon />
              Ajouter un bien
            </button>
          </div>
        ) : (
          <div className={styles.propertyGrid}>
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
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
          onClose={() => { setShowForm(false); setEditProperty(null); }}
          onSaved={loadProperties}
          editProperty={editProperty}
        />
      )}
    </>
  );
};

export default AgentMesBiens;