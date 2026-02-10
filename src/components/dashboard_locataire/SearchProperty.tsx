import React, { useState } from 'react';
import styles from './SearchProperty.module.css';

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

const HeartIcon = ({ className, filled }) => (
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

const VerifiedBadgeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GridIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const MapIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const FilterIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const AdjustmentsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ExpandIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const AcIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const BoltIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ParkingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const FurnishedIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TerraceIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
  </svg>
);

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
  onClearFilters 
}) => {
  return (
    <header className={styles.searchHeader}>
      <div className={styles.searchHeaderTop}>
        <div className={styles.searchHeaderLeft}>
          <h1>
            Rechercher un bien
            <span className={styles.resultsCount}>{resultsCount} biens</span>
          </h1>
        </div>
        <div className={styles.searchHeaderRight}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Vue grille"
            >
              <GridIcon />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => onViewModeChange('list')}
              title="Vue liste"
            >
              <ListIcon />
            </button>
            <button
              className={`${styles.viewBtn} ${viewMode === 'map' ? styles.active : ''}`}
              onClick={() => onViewModeChange('map')}
              title="Vue carte"
            >
              <MapIcon />
            </button>
          </div>
          <button className={`${styles.btn} ${styles.btnGold}`}>
            <NotificationIcon />
            Créer une alerte
          </button>
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
          />
        </div>
        <div className={styles.quickFilters}>
          <button className={`${styles.filterBtn} ${styles.active}`}>
            <BuildingIcon />
            Appartement
            <ChevronDownIcon className={styles.chevron} />
          </button>
          <button className={styles.filterBtn}>
            <PaymentIcon />
            Budget
            <ChevronDownIcon className={styles.chevron} />
          </button>
          <button className={styles.filterBtn}>
            <HomeIcon />
            Pièces
            <ChevronDownIcon className={styles.chevron} />
          </button>
          <button className={styles.filterBtn}>
            <AdjustmentsIcon />
            Plus de filtres
          </button>
        </div>
        <button className={styles.searchBtn}>
          <SearchIcon />
          Rechercher
        </button>
      </div>

      {activeFilters.length > 0 && (
        <div className={styles.activeFilters}>
          <span className={styles.activeFiltersLabel}>Filtres actifs :</span>
          <div className={styles.activeFilterTags}>
            {activeFilters.map((filter, index) => (
              <span key={index} className={styles.filterTag}>
                {filter}
                <button
                  className={styles.filterTagRemove}
                  onClick={() => onRemoveFilter(index)}
                >
                  <CloseIcon />
                </button>
              </span>
            ))}
          </div>
          <button className={styles.clearFilters} onClick={onClearFilters}>
            Effacer tout
          </button>
        </div>
      )}
    </header>
  );
};

/* ==========================================
   FILTERS PANEL COMPONENT
========================================== */
const FiltersPanel = ({ filters, onFilterChange, onReset }) => {
  return (
    <aside className={styles.filtersPanel}>
      <div className={styles.filtersHeader}>
        <h2 className={styles.filtersTitle}>
          <FilterIcon />
          Filtres
        </h2>
        <button className={styles.filtersReset} onClick={onReset}>
          Réinitialiser
        </button>
      </div>

      {/* Type de bien */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>
          <BuildingIcon />
          Type de bien
        </h3>
        <div className={styles.filterOptions}>
          {[
            { label: 'Appartement', count: 156, checked: true },
            { label: 'Villa', count: 42, checked: false },
            { label: 'Studio', count: 31, checked: false },
            { label: 'Maison', count: 18, checked: false },
          ].map((option, index) => (
            <label key={index} className={styles.filterOption}>
              <input type="checkbox" defaultChecked={option.checked} />
              <span className={styles.filterOptionLabel}>{option.label}</span>
              <span className={styles.filterOptionCount}>{option.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>
          <PaymentIcon />
          Budget mensuel
        </h3>
        <div className={styles.priceRange}>
          <input type="text" className={styles.priceInput} placeholder="Min" defaultValue="1" />
          <span className={styles.priceSeparator}>—</span>
          <input type="text" className={styles.priceInput} placeholder="Max" defaultValue="3" />
        </div>
        <p className={styles.priceUnit}>Millions GNF / mois</p>
        <div className={styles.rangeSlider}>
          <input type="range" min="0" max="10" defaultValue="3" />
        </div>
      </div>

      {/* Nombre de pièces */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>
          <DashboardIcon />
          Nombre de pièces
        </h3>
        <div className={styles.quickSelect}>
          {['1', '2', '3', '4', '5+'].map((num, index) => (
            <button
              key={index}
              className={`${styles.quickSelectBtn} ${(num === '2' || num === '3') ? styles.active : ''}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Équipements */}
      <div className={styles.filterGroup}>
        <h3 className={styles.filterGroupTitle}>
          <CheckIcon />
          Équipements
        </h3>
        <div className={styles.filterOptions}>
          {[
            { label: 'Climatisation', checked: true },
            { label: 'Parking', checked: false },
            { label: 'Meublé', checked: false },
            { label: 'Groupe électrogène', checked: false },
            { label: 'Gardien', checked: false },
          ].map((option, index) => (
            <label key={index} className={styles.filterOption}>
              <input type="checkbox" defaultChecked={option.checked} />
              <span className={styles.filterOptionLabel}>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button className={styles.applyFiltersBtn}>Appliquer les filtres</button>
    </aside>
  );
};

/* ==========================================
   ALERT BANNER COMPONENT
========================================== */
const AlertBanner = () => {
  return (
    <div className={styles.alertBanner}>
      <div className={styles.alertBannerIcon}>
        <NotificationIcon />
      </div>
      <div className={styles.alertBannerContent}>
        <h3>Ne manquez aucun bien !</h3>
        <p>Créez une alerte pour être notifié dès qu'un bien correspondant à vos critères est publié.</p>
      </div>
      <button className={styles.alertBannerBtn}>Créer mon alerte</button>
    </div>
  );
};

/* ==========================================
   PROPERTY CARD COMPONENT
========================================== */
const PropertyCard = ({ property, onFavoriteToggle }) => {
  const featureIcons = {
    rooms: HomeIcon,
    area: ExpandIcon,
    ac: AcIcon,
    generator: BoltIcon,
    parking: ParkingIcon,
    furnished: FurnishedIcon,
    terrace: TerraceIcon,
    balcony: TerraceIcon,
  };

  return (
    <article className={`${styles.propertyCard} ${property.premium ? styles.premium : ''}`}>
      <div className={styles.propertyImage}>
        <img src={property.image} alt={property.title} />
        {property.badges && property.badges.length > 0 && (
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
          onClick={() => onFavoriteToggle(property.id)}
        >
          <HeartIcon filled={property.isFavorite} />
        </button>
        <span className={styles.propertyPhotosCount}>
          <ImageIcon />
          {property.photosCount}
        </span>
      </div>
      <div className={styles.propertyContent}>
        <p className={styles.propertyPrice}>
          {property.price.toLocaleString()} <span>GNF/mois</span>
        </p>
        <h3 className={styles.propertyTitle}>{property.title}</h3>
        <p className={styles.propertyLocation}>
          <LocationIcon />
          {property.location}
        </p>
        <div className={styles.propertyFeatures}>
          {property.features.map((feature, index) => {
            const IconComponent = featureIcons[feature.type] || HomeIcon;
            return (
              <span key={index} className={styles.propertyFeature}>
                <IconComponent />
                {feature.label}
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
                <span className={styles.propertyAgentVerified}>
                  <VerifiedBadgeIcon />
                  Vérifié
                </span>
              )}
            </div>
          </div>
          <button className={styles.propertyContactBtn}>Contacter</button>
        </div>
      </div>
    </article>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= Math.min(5, totalPages); i++) {
    pages.push(i);
  }
  if (totalPages > 5) {
    pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeftIcon />
      </button>
      {pages.map((page, index) => (
        <button
          key={index}
          className={`${styles.paginationBtn} ${page === currentPage ? styles.active : ''}`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
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
const SearchProperty = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('Ratoma, Conakry');
  const [activeFilters, setActiveFilters] = useState(['Ratoma, Conakry', 'Appartement', '1-3M GNF']);
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState([1, 5]);
  const [sortBy, setSortBy] = useState('recent');

  // Données mock
  const mockData = {
    user: {
      name: 'Mamadou Bah',
      role: 'Locataire',
      verified: true,
    },
    properties: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop',
        title: 'Bel appartement F3 avec vue panoramique',
        price: 2500000,
        location: 'Kipé, Ratoma',
        photosCount: 12,
        premium: true,
        badges: [{ type: 'premium', label: 'Premium' }],
        features: [
          { type: 'rooms', label: '3 pièces' },
          { type: 'area', label: '85 m²' },
          { type: 'ac', label: 'Climatisé' },
        ],
        agent: { name: 'Abdoulaye D.', initials: 'AD', verified: true },
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
        title: 'Appartement F2 moderne et lumineux',
        price: 1800000,
        location: 'Nongo, Ratoma',
        photosCount: 8,
        premium: false,
        badges: [{ type: 'new', label: 'Nouveau' }],
        features: [
          { type: 'rooms', label: '2 pièces' },
          { type: 'area', label: '60 m²' },
          { type: 'generator', label: 'Groupe élec.' },
        ],
        agent: { name: 'Fatoumata K.', initials: 'FK', verified: true },
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
        title: 'Villa F4 avec jardin et parking',
        price: 3000000,
        location: 'Lambanyi, Ratoma',
        photosCount: 15,
        premium: false,
        badges: [{ type: 'verified', label: 'Vérifié' }],
        features: [
          { type: 'rooms', label: '4 pièces' },
          { type: 'area', label: '120 m²' },
          { type: 'parking', label: 'Parking' },
        ],
        agent: { name: 'Ibrahima B.', initials: 'IB', verified: true },
      },
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
        title: 'Studio meublé tout équipé',
        price: 1200000,
        location: 'Cosa, Ratoma',
        photosCount: 6,
        premium: false,
        badges: [],
        features: [
          { type: 'rooms', label: '1 pièce' },
          { type: 'area', label: '30 m²' },
          { type: 'furnished', label: 'Meublé' },
        ],
        agent: { name: 'Mariama S.', initials: 'MS', verified: true },
      },
      {
        id: 5,
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
        title: 'Appartement F3 de standing avec terrasse',
        price: 2800000,
        location: 'Taouyah, Ratoma',
        photosCount: 18,
        premium: true,
        badges: [
          { type: 'new', label: 'Nouveau' },
          { type: 'premium', label: 'Premium' },
        ],
        features: [
          { type: 'rooms', label: '3 pièces' },
          { type: 'area', label: '95 m²' },
          { type: 'terrace', label: 'Terrasse' },
        ],
        agent: { name: 'Abdoulaye D.', initials: 'AD', verified: true },
      },
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
        title: 'Appartement F2 rénové avec balcon',
        price: 1500000,
        location: 'Koloma, Ratoma',
        photosCount: 10,
        premium: false,
        badges: [],
        features: [
          { type: 'rooms', label: '2 pièces' },
          { type: 'area', label: '55 m²' },
          { type: 'balcony', label: 'Balcon' },
        ],
        agent: { name: 'Oumar C.', initials: 'OC', verified: true },
      },
    ],
  };

  const handleRemoveFilter = (index) => {
    setActiveFilters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearFilters = () => {
    setActiveFilters([]);
  };

  const handleFavoriteToggle = (propertyId) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const propertiesWithFavorites = mockData.properties.map((p) => ({
    ...p,
    isFavorite: favorites.includes(p.id),
  }));

  return (
    <>
      <SearchHeader
        resultsCount={247}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onRemoveFilter={handleRemoveFilter}
        onClearFilters={handleClearFilters}
      />

      <main className={styles.mainContent}>
        <FiltersPanel
          filters={{}}
          onFilterChange={() => {}}
          onReset={() => console.log('Reset filters')}
        />

        <div className={styles.resultsArea}>
          <AlertBanner />

          <div className={styles.resultsHeader}>
            <p className={styles.resultsInfo}>
              <strong>247 biens</strong> correspondent à votre recherche
            </p>
            <div className={styles.sortDropdown}>
              <span className={styles.sortLabel}>Trier par :</span>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="recent">Les plus récents</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="area-asc">Surface croissante</option>
              </select>
            </div>
          </div>

          <div className={styles.propertyGrid}>
            {propertiesWithFavorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={25}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </>
  );
};

export default SearchProperty;