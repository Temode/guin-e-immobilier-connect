// @ts-nocheck
import React, { useState } from 'react';
import styles from './Mon_Logement.module.css';

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

const VerifiedBadgeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
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

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ExpandIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BedIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const FloorIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const WifiIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const SunIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const ShieldIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SparklesIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const WaterIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
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
          <span className={styles.breadcrumbCurrent}>Mon logement</span>
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
const PageHeader = ({ onReportProblem, onContactAgent }) => {
  return (
    <div className={styles.pageHeader}>
      <div className={styles.pageHeaderLeft}>
        <h1>Mon logement</h1>
        <p>Consultez les détails de votre logement actuel et vos documents</p>
      </div>
      <div className={styles.pageActions}>
        <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onReportProblem}>
          <WarningIcon />
          Signaler un problème
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onContactAgent}>
          <MessageIcon />
          Contacter l'agent
        </button>
      </div>
    </div>
  );
};

/* ==========================================
   GALLERY COMPONENT
========================================== */
const Gallery = ({ images, currentIndex, onPrev, onNext, onSelectImage }) => {
  return (
    <div className={styles.galleryCard}>
      <div className={styles.galleryMain}>
        <div className={styles.galleryMainImage}>
          <ImageIcon />
        </div>
        <div className={styles.galleryBadge}>
          <span className={`${styles.badge} ${styles.badgeSuccess}`}>
            <CheckIcon />
            Bail actif
          </span>
        </div>
        <span className={styles.galleryCounter}>{currentIndex + 1} / {images.length}</span>
        <div className={styles.galleryNav}>
          <button className={styles.galleryNavBtn} onClick={onPrev}>
            <ChevronLeftIcon />
          </button>
          <button className={styles.galleryNavBtn} onClick={onNext}>
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div className={styles.galleryThumbnails}>
        {images.map((_, index) => (
          <div
            key={index}
            className={`${styles.galleryThumb} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => onSelectImage(index)}
          >
            <ImageIcon />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   PROPERTY DETAILS COMPONENT
========================================== */
const PropertyDetails = ({ property }) => {
  const features = [
    { icon: ExpandIcon, value: property.surface, label: 'Surface' },
    { icon: BuildingIcon, value: property.rooms, label: 'Pièces' },
    { icon: BedIcon, value: property.bedrooms, label: 'Chambres' },
    { icon: FloorIcon, value: property.floor, label: 'Étage' },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <h2 className={styles.propertyTitle}>{property.title}</h2>
        <p className={styles.propertyAddress}>
          <LocationIcon />
          {property.address}
        </p>

        <div className={styles.propertyFeatures}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <feature.icon />
              </div>
              <p className={styles.featureValue}>{feature.value}</p>
              <p className={styles.featureLabel}>{feature.label}</p>
            </div>
          ))}
        </div>

        <div className={styles.propertyDescription}>
          <h3>Description</h3>
          <p>{property.description}</p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   AMENITIES COMPONENT
========================================== */
const Amenities = ({ amenities }) => {
  const iconMap = {
    electricity: LightningIcon,
    wifi: WifiIcon,
    balcony: SunIcon,
    security: ShieldIcon,
    kitchen: SparklesIcon,
    water: WaterIcon,
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <CheckIcon />
          Équipements & Caractéristiques
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.amenitiesGrid}>
          {amenities.map((amenity, index) => {
            const IconComponent = iconMap[amenity.type] || CheckIcon;
            return (
              <div key={index} className={styles.amenityItem}>
                <div className={styles.amenityIcon}>
                  <IconComponent />
                </div>
                <span className={styles.amenityLabel}>{amenity.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   BAIL INFO COMPONENT
========================================== */
const BailInfo = ({ bail }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <CalendarIcon />
          Informations du bail
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.bailTimeline}>
          <div className={styles.bailItem}>
            <div className={`${styles.bailDot} ${styles.active}`}></div>
            <p className={styles.bailDate}>{bail.startDate}</p>
            <p className={styles.bailLabel}>Début du bail</p>
            <p className={styles.bailStatus}>
              <CheckIcon />
              État des lieux effectué
            </p>
          </div>
          <div className={styles.bailItem}>
            <div className={`${styles.bailDot} ${styles.active}`}></div>
            <p className={styles.bailDate}>Aujourd'hui</p>
            <p className={styles.bailLabel}>En cours de location</p>
          </div>
          <div className={styles.bailItem}>
            <div className={`${styles.bailDot} ${styles.future}`}></div>
            <p className={styles.bailDate}>{bail.endDate}</p>
            <p className={styles.bailLabel}>Fin du bail</p>
          </div>
        </div>

        <div className={styles.bailProgress}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Durée écoulée</span>
            <span className={styles.progressValue}>{bail.elapsed} sur {bail.total}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${bail.percentage}%` }}></div>
          </div>
          <div className={styles.progressDates}>
            <span>{bail.startMonth}</span>
            <span>{bail.endMonth}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   RENT INFO COMPONENT
========================================== */
const RentInfo = ({ rent }) => {
  const stats = [
    { label: 'Loyer mensuel', value: rent.monthly, highlight: true },
    { label: 'Charges', value: rent.charges, highlight: false },
    { label: 'Caution versée', value: rent.deposit, highlight: false },
    { label: 'Mode de paiement', value: rent.paymentMethod, highlight: false },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <PaymentIcon />
          Informations financières
        </h3>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.rentInfo}>
          {stats.map((stat, index) => (
            <div key={index} className={`${styles.rentStat} ${stat.highlight ? styles.highlight : ''}`}>
              <p className={styles.rentStatLabel}>{stat.label}</p>
              <p className={styles.rentStatValue}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   DOCUMENTS COMPONENT
========================================== */
const Documents = ({ documents }) => {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <DocumentIcon />
          Documents
        </h3>
        <a href="#" className={styles.cardAction}>
          Voir tout
          <ChevronRightIcon />
        </a>
      </div>
      <div className={styles.cardBodyNoPaddingTop}>
        <div className={styles.documentList}>
          {documents.map((doc, index) => (
            <div key={index} className={styles.documentItem}>
              <div className={`${styles.documentIcon} ${styles[doc.type]}`}>
                <FileIcon />
              </div>
              <div className={styles.documentInfo}>
                <p className={styles.documentName}>{doc.name}</p>
                <p className={styles.documentMeta}>{doc.meta}</p>
              </div>
              <button className={styles.documentDownload}>
                <DownloadIcon />
              </button>
            </div>
          ))}
        </div>
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
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          <UserIcon />
          Votre agent
        </h3>
      </div>
      <div className={styles.cardBody}>
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
            <button className={`${styles.agentBtn} ${styles.primary}`} onClick={onMessage}>
              <MessageIcon />
            </button>
            <button className={`${styles.agentBtn} ${styles.secondary}`} onClick={onCall}>
              <PhoneIcon />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const Mon_Logement = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = Array(5).fill(null);

  // Données
  const mockData = {
    user: {
      name: 'Mamadou Bah',
      role: 'Locataire',
      verified: true,
    },
    property: {
      title: 'Appartement T3 Moderne',
      address: 'Immeuble 12, Cité Chemins de Fer, Kaloum, Conakry',
      surface: '85 m²',
      rooms: '3',
      bedrooms: '2',
      floor: '3ème',
      description: "Bel appartement T3 lumineux situé au 3ème étage d'un immeuble bien entretenu dans le quartier prisé de Kaloum. L'appartement dispose d'un grand séjour avec balcon, deux chambres spacieuses, une cuisine équipée et une salle de bain moderne. Proximité immédiate des commerces, transports et écoles.",
    },
    amenities: [
      { type: 'electricity', label: 'Électricité incluse' },
      { type: 'wifi', label: 'WiFi disponible' },
      { type: 'balcony', label: 'Balcon ensoleillé' },
      { type: 'security', label: 'Gardien 24h/24' },
      { type: 'kitchen', label: 'Cuisine équipée' },
      { type: 'water', label: 'Eau courante' },
    ],
    bail: {
      startDate: '1er Juin 2025',
      endDate: '31 Mai 2026',
      elapsed: '8 mois',
      total: '12',
      percentage: 67,
      startMonth: 'Juin 2025',
      endMonth: 'Mai 2026',
    },
    rent: {
      monthly: '2 000 000 GNF',
      charges: 'Incluses',
      deposit: '4 000 000 GNF',
      paymentMethod: 'Orange Money',
    },
    documents: [
      { name: 'Contrat de bail', meta: 'PDF • 245 Ko • Signé le 1 Juin 2025', type: 'pdf' },
      { name: "État des lieux d'entrée", meta: 'PDF • 1.2 Mo • 1 Juin 2025', type: 'pdf' },
      { name: 'Règlement intérieur', meta: 'PDF • 89 Ko', type: 'pdf' },
    ],
    agent: {
      name: 'Abdoulaye Diallo',
      role: 'Agent immobilier',
      verified: true,
    },
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <Header date="Dim. 1 Février 2026" hasNotifications />

      <main className={styles.mainContent}>
        <PageHeader
          onReportProblem={() => console.log('Report problem')}
          onContactAgent={() => console.log('Contact agent')}
        />

        <div className={styles.propertyLayout}>
          <div className={styles.propertyMain}>
            <Gallery
              images={images}
              currentIndex={currentImageIndex}
              onPrev={handlePrevImage}
              onNext={handleNextImage}
              onSelectImage={setCurrentImageIndex}
            />
            <PropertyDetails property={mockData.property} />
            <Amenities amenities={mockData.amenities} />
          </div>

          <div className={styles.propertySide}>
            <BailInfo bail={mockData.bail} />
            <RentInfo rent={mockData.rent} />
            <Documents documents={mockData.documents} />
            <AgentCard
              agent={mockData.agent}
              onMessage={() => console.log('Message agent')}
              onCall={() => console.log('Call agent')}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Mon_Logement;