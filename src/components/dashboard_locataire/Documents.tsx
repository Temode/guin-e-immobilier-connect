// @ts-nocheck
import React, { useState } from 'react';
import styles from './Documents.module.css';

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

const UploadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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

const StarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ShieldCheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ReceiptIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const RefreshIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const FolderIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const ClipboardCheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const ExclamationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
  </svg>
);

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ date, hasNotifications }) => {
  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumb}>
        <a href="#">Tableau de bord</a>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Documents</span>
      </nav>
      <div className={styles.headerRight}>
        <span className={styles.headerDate}>{date}</span>
        <button className={styles.headerBtn}>
          <NotificationIcon />
          {hasNotifications && <span className={styles.notificationDot}></span>}
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   PAGE HEADER COMPONENT
========================================== */
const PageHeader = ({ onDownloadAll, onAddDocument }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderLeft}>
        <h1>Documents</h1>
        <p>Gérez tous vos documents liés à votre location</p>
      </div>
      <div className={styles.pageActions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onDownloadAll}>
          <DownloadIcon />
          Tout télécharger
        </button>
        <button className={`${styles.btn} ${styles.btnGold}`} onClick={onAddDocument}>
          <UploadIcon />
          Ajouter un document
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   FEATURED DOCUMENT COMPONENT
========================================== */
const FeaturedDocument = ({ document, onDownload, onView }) => {
  return (
    <div className={styles.featuredDocument}>
      <div className={styles.featuredIcon}>
        <DocumentIcon />
      </div>
      <div className={styles.featuredContent}>
        <span className={styles.featuredBadge}>
          <StarIcon />
          Document principal
        </span>
        <h2 className={styles.featuredTitle}>{document.title}</h2>
        <div className={styles.featuredMeta}>
          <span>
            <CalendarIcon />
            Signé le {document.signedDate}
          </span>
          <span>
            <ClockIcon />
            Valide jusqu'au {document.validUntil}
          </span>
          <span>
            <FileIcon />
            {document.type} • {document.size}
          </span>
        </div>
        <div className={styles.featuredActions}>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onDownload}>
            <DownloadIcon />
            Télécharger
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onView}>
            <EyeIcon />
            Voir
          </button>
        </div>
      </div>
      <span className={styles.featuredStatus}>
        <ShieldCheckIcon />
        Document vérifié
      </span>
    </div>
  );
};

/* ==========================================
   STATS ROW COMPONENT
========================================== */
const StatsRow = ({ stats }) => {
  const iconMap = {
    check: CheckCircleIcon,
    payment: PaymentIcon,
    download: DownloadIcon,
    warning: WarningIcon,
  };

  return (
    <div className={styles.statsRow}>
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconType] || CheckCircleIcon;
        return (
          <div 
            key={index} 
            className={`${styles.statCard} ${stat.warning ? styles.warning : ''}`}
            style={{ animationDelay: `${0.05 + index * 0.05}s` }}
          >
            <div className={`${styles.statIcon} ${styles[stat.iconColor]}`}>
              <IconComponent />
            </div>
            <div className={styles.statContent}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
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
const FiltersBar = ({ activeFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const filters = ['Tous', 'Contrats', 'Reçus', 'Identité'];

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
  );
};

/* ==========================================
   DOCUMENT CARD COMPONENT
========================================== */
const DocumentCard = ({ document, onDownload, onAction, index }) => {
  const iconMap = {
    pdf: FileIcon,
    img: ImageIcon,
    receipt: ReceiptIcon,
    shield: ShieldCheckIcon,
  };

  const IconComponent = iconMap[document.iconType] || FileIcon;

  return (
    <div 
      className={`${styles.documentCard} ${document.isNew ? styles.new : ''}`}
      style={{ animationDelay: `${0.3 + index * 0.05}s` }}
    >
      <div className={styles.documentHeader}>
        <div className={`${styles.documentIcon} ${styles[document.iconType]}`}>
          <IconComponent />
        </div>
        <div className={styles.documentInfo}>
          <p className={styles.documentName}>{document.name}</p>
          <p className={styles.documentMeta}>{document.meta}</p>
        </div>
      </div>
      <div className={styles.documentStatus}>
        <span className={`${styles.statusBadge} ${styles[document.status]}`}>
          {document.status === 'valid' ? <CheckIcon /> : <WarningIcon />}
          {document.statusLabel}
        </span>
        <div className={styles.documentActions}>
          <button 
            className={`${styles.docActionBtn} ${document.actionType === 'refresh' ? styles.gold : ''}`}
            onClick={() => document.actionType === 'refresh' ? onAction(document.id) : onDownload(document.id)}
          >
            {document.actionType === 'refresh' ? <RefreshIcon /> : <DownloadIcon />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   CHECKLIST COMPONENT
========================================== */
const Checklist = ({ items }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={`${styles.cardTitle} ${styles.gold}`}>
          <ClipboardCheckIcon />
          Dossier complet
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.checklist}>
          {items.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.checklistItem} ${styles[item.status]}`}
            >
              <div className={styles.checklistIcon}>
                {item.status === 'completed' ? <CheckIcon /> : <ExclamationIcon />}
              </div>
              <span className={styles.checklistText}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   GENERATE SECTION COMPONENT
========================================== */
const GenerateSection = ({ items, onGenerate }) => {
  const iconMap = {
    location: LocationIcon,
    check: CheckCircleIcon,
    payment: PaymentIcon,
  };

  return (
    <div className={styles.generateSection}>
      <h4 className={styles.generateTitle}>
        <LightningIcon />
        Génération automatique
      </h4>
      <p className={styles.generateDescription}>Obtenez vos attestations en quelques clics</p>
      <div className={styles.generateList}>
        {items.map((item, index) => {
          const IconComponent = iconMap[item.iconType] || DocumentIcon;
          return (
            <div 
              key={index} 
              className={styles.generateItem}
              onClick={() => onGenerate(item.type)}
            >
              <div className={styles.generateItemLeft}>
                <div className={styles.generateItemIcon}>
                  <IconComponent />
                </div>
                <span className={styles.generateItemText}>{item.label}</span>
              </div>
              <span className={styles.generateItemArrow}>
                <ChevronRightIcon />
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================
   ACTIVITY LIST COMPONENT
========================================== */
const ActivityList = ({ activities }) => {
  const iconMap = {
    generate: PlusIcon,
    download: DownloadIcon,
    upload: UploadIcon,
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <ClockIcon />
          Activité récente
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.activityList}>
          {activities.map((activity, index) => {
            const IconComponent = iconMap[activity.iconType] || DocumentIcon;
            return (
              <div key={index} className={styles.activityItem}>
                <div className={`${styles.activityIcon} ${styles[activity.iconType]}`}>
                  <IconComponent />
                </div>
                <div className={styles.activityContent}>
                  <p dangerouslySetInnerHTML={{ __html: activity.text }} />
                  <span className={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
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
const Documents = () => {
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');

  // Données mock
  const mockData = {
    user: {
      name: 'Mamadou Bah',
      role: 'Locataire',
      verified: true,
    },
    featuredDocument: {
      title: 'Contrat de bail — Appartement T3 Kaloum',
      signedDate: '25 Mai 2025',
      validUntil: '31 Mai 2026',
      type: 'PDF',
      size: '245 Ko',
    },
    stats: [
      { iconType: 'check', iconColor: 'green', value: '12', label: 'Documents au total' },
      { iconType: 'payment', iconColor: 'gold', value: '8', label: 'Reçus de loyer' },
      { iconType: 'download', iconColor: 'blue', value: '24', label: 'Téléchargements' },
      { iconType: 'warning', iconColor: 'gold', value: '1', label: 'Document à renouveler', warning: true },
    ],
    documents: [
      { id: 1, name: "État des lieux d'entrée", meta: 'PDF • 1.2 Mo • 1 Juin 2025', iconType: 'pdf', status: 'valid', statusLabel: 'Validé' },
      { id: 2, name: 'Reçu loyer Janvier 2026', meta: 'PDF • 89 Ko • 1 Jan 2026', iconType: 'receipt', status: 'valid', statusLabel: 'Validé', isNew: true },
      { id: 3, name: 'Règlement intérieur', meta: 'PDF • 156 Ko • 1 Juin 2025', iconType: 'pdf', status: 'valid', statusLabel: 'Validé' },
      { id: 4, name: "Carte d'identité nationale", meta: 'JPG • 2.1 Mo • 15 Mai 2025', iconType: 'img', status: 'pending', statusLabel: 'Expire bientôt', actionType: 'refresh' },
      { id: 5, name: 'Reçu loyer Décembre 2025', meta: 'PDF • 89 Ko • 1 Déc 2025', iconType: 'receipt', status: 'valid', statusLabel: 'Validé' },
      { id: 6, name: "Attestation d'assurance", meta: 'PDF • 320 Ko • 1 Juin 2025', iconType: 'shield', status: 'valid', statusLabel: 'Validé' },
    ],
    checklistItems: [
      { text: 'Contrat de bail signé', status: 'completed' },
      { text: "État des lieux d'entrée", status: 'completed' },
      { text: "Attestation d'assurance", status: 'completed' },
      { text: "Pièce d'identité — À renouveler", status: 'warning' },
      { text: 'Justificatif de revenus', status: 'completed' },
    ],
    generateItems: [
      { type: 'domicile', iconType: 'location', label: 'Attestation de domicile' },
      { type: 'quittance', iconType: 'check', label: 'Quittance de loyer' },
      { type: 'historique', iconType: 'payment', label: 'Historique des paiements' },
    ],
    activities: [
      { iconType: 'generate', text: '<strong>Reçu loyer Janvier</strong> généré automatiquement', time: 'Il y a 2 jours' },
      { iconType: 'download', text: 'Téléchargement de <strong>Attestation domicile</strong>', time: 'Il y a 5 jours' },
      { iconType: 'upload', text: '<strong>Justificatif de revenus</strong> mis à jour', time: 'Il y a 2 semaines' },
    ],
  };

  return (
    <>
      <Header date="Dim. 2 Février 2026" hasNotifications />

      <main className={styles.mainContent}>
        <PageHeader
          onDownloadAll={() => console.log('Download all')}
          onAddDocument={() => console.log('Add document')}
        />

        <FeaturedDocument
          document={mockData.featuredDocument}
          onDownload={() => console.log('Download featured')}
          onView={() => console.log('View featured')}
        />

        <StatsRow stats={mockData.stats} />

        <div className={styles.documentsLayout}>
          <div className={styles.documentsMain}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <FolderIcon />
                  Tous les documents
                </h3>
              </div>
              <div className={styles.cardBody}>
                <FiltersBar
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                />

                <div className={styles.documentsGrid}>
                  {mockData.documents.map((doc, index) => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      index={index}
                      onDownload={(id) => console.log('Download', id)}
                      onAction={(id) => console.log('Action', id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.documentsSidebar}>
            <Checklist items={mockData.checklistItems} />

            <GenerateSection
              items={mockData.generateItems}
              onGenerate={(type) => console.log('Generate', type)}
            />

            <ActivityList activities={mockData.activities} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Documents;