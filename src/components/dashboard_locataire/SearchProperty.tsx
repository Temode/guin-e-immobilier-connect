import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchProperty.module.css';
import {
  getProperties,
  guineaCities,
  propertyTypes,
  transactionTypes,
  amenitiesList,
  type PropertyData,
} from '@/services/propertyService';

/* ==========================================
   ICONS COMPONENTS (kept from original)
========================================== */
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PaymentIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HeartIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  filled ? (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ) : (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
);

const VerifiedBadgeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const StarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LocationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
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

const MapIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const AdjustmentsIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
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

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ExpandIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const NotificationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const DashboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const AcIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const BoltIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ParkingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const FurnishedIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TerraceIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

/* ==========================================
   HELPER: map PropertyData → card format
========================================== */
const featureIcons: Record<string, React.FC<{ className?: string }>> = {
  rooms: HomeIcon,
  area: ExpandIcon,
  ac: AcIcon,
  generator: BoltIcon,
  parking: ParkingIcon,
  furnished: FurnishedIcon,
  terrace: TerraceIcon,
  balcony: TerraceIcon,
};

function mapPropertyToCard(p: PropertyData) {
  const images = (p.images as string[]) || [];
  const amenities = (p.amenities as string[]) || [];
  const features: { type: string; label: string }[] = [];

  if (p.bedrooms) features.push({ type: 'rooms', label: `${p.bedrooms} pièce${p.bedrooms > 1 ? 's' : ''}` });
  if (p.area) features.push({ type: 'area', label: `${p.area} m²` });
  if (amenities.includes('Climatisation')) features.push({ type: 'ac', label: 'Climatisé' });
  if (amenities.includes('Générateur')) features.push({ type: 'generator', label: 'Groupe élec.' });
  if (amenities.includes('Parking')) features.push({ type: 'parking', label: 'Parking' });
  if (p.furnished) features.push({ type: 'furnished', label: 'Meublé' });
  if (amenities.includes('Balcon/Terrasse')) features.push({ type: 'terrace', label: 'Terrasse' });

  return {
    id: p.id!,
    image: images[0] || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
    title: p.title,
    price: p.price,
    currency: p.currency || 'GNF',
    transaction_type: p.transaction_type,
    location: [p.quartier, p.commune, p.city].filter(Boolean).join(', '),
    photosCount: images.length,
    premium: false,
    badges: [] as { type: string; label: string }[],
    features: features.slice(0, 3),
    agent: { name: 'Agent', initials: 'AG', verified: true },
    isFavorite: false,
  };
}

/* ==========================================
   SEARCH HEADER COMPONENT
========================================== */
const SearchHeader = ({
  resultsCount,
  viewMode,
  onViewModeChange,
  searchQuery,
  onSearchChange,
  activeFilters,
  onRemoveFilter,
  onClearFilters,
  onSearch,
}: {
  resultsCount: number;
  viewMode: string;
  onViewModeChange: (m: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeFilters: string[];
  onRemoveFilter: (i: number) => void;
  onClearFilters: () => void;
  onSearch: () => void;
}) => {
  return (
    <header className={styles.searchHeader}>
      <div className={styles.searchHeaderTop}>
        <div className={styles.searchHeaderLeft}>
          <h1>
            Rechercher un bien
            <span className={styles.resultsCount}>{resultsCount} bien{resultsCount !== 1 ? 's' : ''}</span>
          </h1>
        </div>
        <div className={styles.searchHeaderRight}>
          <div className={styles.viewToggle}>
            <button className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`} onClick={() => onViewModeChange('grid')} title="Vue grille"><GridIcon /></button>
            <button className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`} onClick={() => onViewModeChange('list')} title="Vue liste"><ListIcon /></button>
          </div>
        </div>
      </div>

      <div className={styles.searchBarContainer}>
        <div className={styles.searchInputWrapper}>
          <LocationIcon />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Quartier, commune ou adresse..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          />
        </div>
        <button className={styles.searchBtn} onClick={onSearch}>
          <SearchIcon /> Rechercher
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className={styles.activeFilters}>
          <span className={styles.activeFiltersLabel}>Filtres actifs :</span>
          <div className={styles.activeFilterTags}>
            {activeFilters.map((filter, index) => (
              <span key={index} className={styles.filterTag}>
                {filter}
                <button className={styles.filterTagRemove} onClick={() => onRemoveFilter(index)}><CloseIcon /></button>
              </span>
            ))}
          </div>
          <button className={styles.clearFilters} onClick={onClearFilters}>Effacer tout</button>
        </div>
      )}
    </header>
  );
};

/* ==========================================
   FILTERS PANEL COMPONENT
========================================== */
interface Filters {
  transaction_type: string;
  types: string[];
  city: string;
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  amenities: string[];
  furnished: string;
}

const FiltersPanel = ({
  filters,
  onFilterChange,
  onReset,
  onApply,
}: {
  filters: Filters;
  onFilterChange: (key: string, value: any) => void;
  onReset: () => void;
  onApply: () => void;
}) => {
  return (
    <aside className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}><FilterIcon /> Filtres</h2>
        <button className={styles.filtersReset} onClick={onReset}>Réinitialiser</button>
      </div>

      {/* Transaction type */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><PaymentIcon /> Transaction</h3>
        <div className={styles.filterOptions}>
          <label className={styles.filterOption}>
            <input type="radio" name="transaction" value="" checked={filters.transaction_type === ''} onChange={() => onFilterChange('transaction_type', '')} />
            <span className={styles.filterOptionLabel}>Tous</span>
          </label>
          {transactionTypes.map(t => (
            <label key={t.value} className={styles.filterOption}>
              <input type="radio" name="transaction" value={t.value} checked={filters.transaction_type === t.value} onChange={() => onFilterChange('transaction_type', t.value)} />
              <span className={styles.filterOptionLabel}>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><BuildingIcon /> Type de bien</h3>
        <div className={styles.filterOptions}>
          {propertyTypes.map(t => (
            <label key={t.value} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={filters.types.includes(t.value)}
                onChange={() => {
                  const newTypes = filters.types.includes(t.value)
                    ? filters.types.filter(v => v !== t.value)
                    : [...filters.types, t.value];
                  onFilterChange('types', newTypes);
                }}
              />
              <span className={styles.filterOptionLabel}>{t.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* City */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><LocationIcon /> Ville</h3>
        <select
          style={{ width: '100%', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid #E2E8F0', fontSize: '0.875rem' }}
          value={filters.city}
          onChange={(e) => onFilterChange('city', e.target.value)}
        >
          <option value="">Toutes les villes</option>
          {guineaCities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Budget */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><PaymentIcon /> Budget</h3>
        <div className={styles.priceRange}>
          <input type="number" className={styles.priceInput} placeholder="Min" value={filters.minPrice} onChange={(e) => onFilterChange('minPrice', e.target.value)} />
          <span className={styles.priceSeparator}>—</span>
          <input type="number" className={styles.priceInput} placeholder="Max" value={filters.maxPrice} onChange={(e) => onFilterChange('maxPrice', e.target.value)} />
        </div>
        <p className={styles.priceUnit}>GNF</p>
      </div>

      {/* Bedrooms */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><DashboardIcon /> Chambres min</h3>
        <div className={styles.quickSelect}>
          {['', '1', '2', '3', '4', '5'].map(num => (
            <button
              key={num}
              className={`${styles.quickSelectBtn} ${filters.minBedrooms === num ? styles.active : ''}`}
              onClick={() => onFilterChange('minBedrooms', num)}
            >
              {num || 'Tous'}
            </button>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><FurnishedIcon /> Meublé</h3>
        <div className={styles.quickSelect}>
          {[{ v: '', l: 'Tous' }, { v: 'true', l: 'Oui' }, { v: 'false', l: 'Non' }].map(o => (
            <button
              key={o.v}
              className={`${styles.quickSelectBtn} ${filters.furnished === o.v ? styles.active : ''}`}
              onClick={() => onFilterChange('furnished', o.v)}
            >
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}><CheckIcon /> Équipements</h3>
        <div className={styles.filterOptions}>
          {amenitiesList.slice(0, 6).map(a => (
            <label key={a} className={styles.filterOption}>
              <input
                type="checkbox"
                checked={filters.amenities.includes(a)}
                onChange={() => {
                  const newAm = filters.amenities.includes(a) ? filters.amenities.filter(v => v !== a) : [...filters.amenities, a];
                  onFilterChange('amenities', newAm);
                }}
              />
              <span className={styles.filterOptionLabel}>{a}</span>
            </label>
          ))}
        </div>
      </div>

      <button className={styles.applyFiltersBtn} onClick={onApply}>Appliquer les filtres</button>
    </aside>
  );
};

/* ==========================================
   PROPERTY CARD COMPONENT
========================================== */
const PropertyCard = ({ property, onFavoriteToggle, onClick }: {
  property: ReturnType<typeof mapPropertyToCard> & { isFavorite: boolean };
  onFavoriteToggle: (id: string) => void;
  onClick: (id: string) => void;
}) => {
  return (
    <article
      className={`${styles.propertyCard} ${property.premium ? styles.premium : ''}`}
      onClick={() => onClick(property.id)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.propertyImage}>
        <img src={property.image} alt={property.title} loading="lazy" />
        {property.badges.length > 0 && (
          <div className={styles.propertyBadges}>
            {property.badges.map((badge, index) => (
              <span key={index} className={`${styles.propertyBadge} ${styles[badge.type]}`}>
                {badge.type === 'premium' && <StarIcon />}
                {badge.label}
              </span>
            ))}
          </div>
        )}
        <button
          className={`${styles.propertyFavorite} ${property.isFavorite ? styles.active : ''}`}
          onClick={(e) => { e.stopPropagation(); onFavoriteToggle(property.id); }}
        >
          <HeartIcon filled={property.isFavorite} />
        </button>
        <span className={styles.propertyPhotosCount}>
          <ImageIcon /> {property.photosCount}
        </span>
      </div>
      <div className={styles.propertyContent}>
        <p className={styles.propertyPrice}>
          {property.price.toLocaleString('fr-FR')} <span>{property.currency}{property.transaction_type === 'location' ? '/mois' : ''}</span>
        </p>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}><LocationIcon /> {property.location}</p>
        <div className={styles.propertyFeatures}>
          {property.features.map((feature, index) => {
            const IconComponent = featureIcons[feature.type] || HomeIcon;
            return (
              <span key={index} className={styles.propertyFeature}>
                <IconComponent /> {feature.label}
              </span>
            );
          })}
        </div>
        <div className={styles.propertyFooter}>
          <div className={styles.propertyAgent}>
            <div className={styles.propertyAgentAvatar}>{property.agent.initials}</div>
            <div className={styles.propertyAgentInfo}>
              <span className={styles.propertyAgentName}>{property.agent.name}</span>
              {property.agent.verified && (
                <span className={styles.propertyAgentVerified}><VerifiedBadgeIcon /> Vérifié</span>
              )}
            </div>
          </div>
          <button className={styles.propertyContactBtn} onClick={(e) => e.stopPropagation()}>Contacter</button>
        </div>
      </div>
    </article>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) => {
  const pages: (number | string)[] = [];
  for (let i = 1; i <= Math.min(5, totalPages); i++) pages.push(i);
  if (totalPages > 5) { pages.push('...'); pages.push(totalPages); }

  return (
    <div className={styles.pagination}>
      <button className={styles.paginationBtn} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeftIcon /></button>
      {pages.map((page, index) => (
        <button key={index} className={`${styles.paginationBtn} ${page === currentPage ? styles.active : ''}`} onClick={() => typeof page === 'number' && onPageChange(page)} disabled={page === '...'}>{page}</button>
      ))}
      <button className={styles.paginationBtn} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRightIcon /></button>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const PAGE_SIZE = 20;

const defaultFilters: Filters = {
  transaction_type: '',
  types: [],
  city: '',
  minPrice: '',
  maxPrice: '',
  minBedrooms: '',
  amenities: [],
  furnished: '',
};

const SearchProperty = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('recent');
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({ ...defaultFilters });

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchProperties = useCallback(async (page = 1, f = appliedFilters, sort = sortBy, search = searchQuery) => {
    setLoading(true);
    const sortMap: Record<string, string> = { recent: 'recent', 'price-asc': 'price-low', 'price-desc': 'price-high' };
    const { data, count } = await getProperties({
      transaction_type: f.transaction_type || undefined,
      type: f.types.length === 1 ? f.types[0] : undefined,
      city: f.city || undefined,
      minPrice: f.minPrice ? Number(f.minPrice) : undefined,
      maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
      search: search || undefined,
      sort: sortMap[sort] || 'recent',
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    });
    setProperties((data as unknown as PropertyData[]) || []);
    setTotalCount(count || 0);
    setLoading(false);
  }, [appliedFilters, sortBy, searchQuery]);

  useEffect(() => {
    fetchProperties(currentPage);
  }, [currentPage, fetchProperties]);

  const handleApplyFilters = () => {
    setAppliedFilters({ ...filters });
    setCurrentPage(1);
    fetchProperties(1, filters);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProperties(1, appliedFilters, sortBy, searchQuery);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
    fetchProperties(1, appliedFilters, newSort, searchQuery);
  };

  const handleResetFilters = () => {
    const reset = { ...defaultFilters };
    setFilters(reset);
    setAppliedFilters(reset);
    setSearchQuery('');
    setCurrentPage(1);
    fetchProperties(1, reset, sortBy, '');
  };

  const handleFavoriteToggle = (propertyId: string) => {
    setFavorites(prev => prev.includes(propertyId) ? prev.filter(id => id !== propertyId) : [...prev, propertyId]);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Build active filter tags
  const activeFilterTags: string[] = [];
  if (appliedFilters.transaction_type) activeFilterTags.push(appliedFilters.transaction_type === 'location' ? 'Location' : 'Vente');
  if (appliedFilters.types.length > 0) activeFilterTags.push(appliedFilters.types.join(', '));
  if (appliedFilters.city) activeFilterTags.push(appliedFilters.city);
  if (appliedFilters.minPrice || appliedFilters.maxPrice) {
    activeFilterTags.push(`${appliedFilters.minPrice || '0'} - ${appliedFilters.maxPrice || '∞'} GNF`);
  }
  if (searchQuery) activeFilterTags.push(`"${searchQuery}"`);

  const handleRemoveFilter = (index: number) => {
    // Simplified: just clear all
    handleResetFilters();
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const mappedProperties = properties.map(p => ({
    ...mapPropertyToCard(p),
    isFavorite: favorites.includes(p.id || ''),
  }));

  return (
    <>
      <SearchHeader
        resultsCount={totalCount}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilterTags}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={handleResetFilters}
        onSearch={handleSearch}
      />

      <main className={styles.mainContent}>
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
        />

        <div className={styles.resultsArea}>
          <div className={styles.resultsHeader}>
            <p className={styles.resultsInfo}>
              {loading ? 'Chargement...' : <><strong>{totalCount} bien{totalCount !== 1 ? 's' : ''}</strong> trouvé{totalCount !== 1 ? 's' : ''}</>}
            </p>
            <div className={styles.sortDropdown}>
              <span className={styles.sortLabel}>Trier par :</span>
              <select className={styles.sortSelect} value={sortBy} onChange={(e) => handleSortChange(e.target.value)}>
                <option value="recent">Les plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
              </select>
            </div>
          </div>

          <div className={styles.propertyGrid}>
            {mappedProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
                onClick={(id) => navigate(`/property/${id}`)}
              />
            ))}
          </div>

          {!loading && properties.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#94A3B8' }}>
              <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Aucun bien trouvé</p>
              <p>Essayez de modifier vos filtres de recherche</p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </main>
    </>
  );
};

export default SearchProperty;
