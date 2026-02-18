// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Mon_Logement.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { getTenantActiveRental, monthsRemaining, formatPaymentMethod, type RentalWithDetails } from '@/services/rentalService';
import { getOrCreateConversation } from '@/services/messagingService';

/* ==========================================
   ICONS COMPONENTS
========================================== */
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

const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
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

const SettingsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ImageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const FileIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ date, hasNotifications }) => (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <nav className={styles.breadcrumb}>
        <span>ImmoGN</span>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>Mon logement</span>
      </nav>
      <h1 className={styles.pageTitle}>Mon logement</h1>
    </div>
    <div className={styles.headerRight}>
      <span className={styles.headerDate}>{date}</span>
      <button className={styles.headerBtn}>
        <NotificationIcon />
        {hasNotifications && <span className={styles.notificationDot}></span>}
      </button>
      <button className={styles.headerBtn}><SettingsIcon /></button>
    </div>
  </header>
);

/* ==========================================
   PAGE HEADER
========================================== */
const PageHeader = ({ onReportProblem, onContactAgent }) => (
  <div className={styles.pageHeader}>
    <div>
      <h2 className={styles.pageHeaderTitle}>Mon logement</h2>
      <p className={styles.pageHeaderSub}>Gérez votre espace de vie</p>
    </div>
    <div className={styles.pageHeaderActions}>
      <button className={`${styles.btn} ${styles.btnOutline}`} onClick={onReportProblem}>
        <WarningIcon /> Signaler un problème
      </button>
      <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onContactAgent}>
        <MessageIcon /> Contacter l'agent
      </button>
    </div>
  </div>
);

/* ==========================================
   GALLERY COMPONENT
========================================== */
const Gallery = ({ images, currentIndex, onPrev, onNext, onSelectImage }) => {
  const hasImages = images && images.length > 0 && images.some(Boolean);

  if (!hasImages) {
    return (
      <div className={styles.galleryCard}>
        <div className={styles.galleryPlaceholder}>
          <ImageIcon />
          <p>Aucune photo disponible</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.galleryCard}>
      <div className={styles.galleryMain}>
        <img src={images[currentIndex]} alt={`Photo ${currentIndex + 1}`} />
        <button className={`${styles.galleryNav} ${styles.galleryNavLeft}`} onClick={onPrev}>
          <ChevronLeftIcon />
        </button>
        <button className={`${styles.galleryNav} ${styles.galleryNavRight}`} onClick={onNext}>
          <ChevronRightIcon />
        </button>
        <span className={styles.galleryCounter}>{currentIndex + 1} / {images.length}</span>
      </div>
      {images.length > 1 && (
        <div className={styles.galleryThumbs}>
          {images.slice(0, 5).map((img, i) => (
            <div
              key={i}
              className={`${styles.galleryThumb} ${i === currentIndex ? styles.galleryThumbActive : ''}`}
              onClick={() => onSelectImage(i)}
            >
              <img src={img} alt={`Miniature ${i + 1}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ==========================================
   PROPERTY DETAILS
========================================== */
const PropertyDetails = ({ property }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3 className={styles.cardTitle}><BuildingIcon /> Détails du bien</h3>
    </div>
    <div className={styles.cardBody}>
      <h2 className={styles.propertyTitle}>{property.title}</h2>
      {property.address && <p className={styles.propertyAddress}>{property.address}</p>}
      {property.description && <p className={styles.propertyDescription}>{property.description}</p>}
      <div className={styles.propertyFeatures}>
        {property.type && <div className={styles.featureItem}><span className={styles.featureLabel}>Type</span><span className={styles.featureValue}>{property.type}</span></div>}
        {property.surface && <div className={styles.featureItem}><span className={styles.featureLabel}>Surface</span><span className={styles.featureValue}>{property.surface}</span></div>}
        {property.bedrooms && <div className={styles.featureItem}><span className={styles.featureLabel}>Chambres</span><span className={styles.featureValue}>{property.bedrooms}</span></div>}
        {property.bathrooms && <div className={styles.featureItem}><span className={styles.featureLabel}>Sdb</span><span className={styles.featureValue}>{property.bathrooms}</span></div>}
      </div>
    </div>
  </div>
);

/* ==========================================
   BAIL INFO
========================================== */
const BailInfo = ({ bail }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Bail</h3></div>
    <div className={styles.cardBody}>
      <div className={styles.bailRow}><span>Début</span><strong>{bail.startDate}</strong></div>
      <div className={styles.bailRow}><span>Fin</span><strong>{bail.endDate}</strong></div>
      {bail.percentage != null && (
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${bail.percentage}%` }}></div>
          </div>
          <span className={styles.progressLabel}>{bail.percentage}% écoulé</span>
        </div>
      )}
    </div>
  </div>
);

/* ==========================================
   RENT INFO
========================================== */
const RentInfo = ({ rent }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}><h3 className={styles.cardTitle}>Loyer</h3></div>
    <div className={styles.cardBody}>
      <div className={styles.rentAmount}>{rent.monthly}</div>
      <div className={styles.bailRow}><span>Mode de paiement</span><strong>{rent.paymentMethod}</strong></div>
      {rent.charges && <div className={styles.bailRow}><span>Charges</span><strong>{rent.charges}</strong></div>}
    </div>
  </div>
);

/* ==========================================
   AGENT CARD
========================================== */
const AgentCard = ({ agent, onMessage, onCall }) => {
  const getInitials = (name) => name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}><h3 className={styles.cardTitle}><UserIcon /> Votre agent</h3></div>
      <div className={styles.cardBody}>
        <div className={styles.agentCard}>
          <div className={styles.agentAvatar}>{getInitials(agent.name)}</div>
          <div className={styles.agentInfo}>
            <p className={styles.agentRole}>{agent.role}</p>
            <p className={styles.agentName}>{agent.name}</p>
            {agent.verified && (
              <span className={styles.agentVerified}><VerifiedBadgeIcon /> Identité vérifiée</span>
            )}
          </div>
          <div className={styles.agentActions}>
            <button className={`${styles.agentBtn} ${styles.primary}`} onClick={onMessage}><MessageIcon /></button>
            {agent.phone && (
              <button className={`${styles.agentBtn} ${styles.secondary}`} onClick={onCall}><PhoneIcon /></button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   DOCUMENTS
========================================== */
const Documents = ({ documents }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}><h3 className={styles.cardTitle}><FileIcon /> Documents</h3></div>
    <div className={styles.cardBody}>
      {documents.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Aucun document disponible</p>
      ) : (
        documents.map((doc, i) => (
          <div key={i} className={styles.documentItem}>
            <div className={styles.documentIcon}><FileIcon /></div>
            <div className={styles.documentInfo}>
              <p className={styles.documentName}>{doc.name}</p>
              <p className={styles.documentMeta}>{doc.meta}</p>
            </div>
            <button className={styles.documentDownload}><DownloadIcon /></button>
          </div>
        ))
      )}
    </div>
  </div>
);

/* ==========================================
   NO RENTAL STATE
========================================== */
const NoRentalState = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.mainContent}>
      <div className={styles.noRentalState}>
        <BuildingIcon />
        <h2>Aucun logement loué</h2>
        <p>Vous n'avez pas encore de logement loué.</p>
        <button className={styles.searchBtn} onClick={() => navigate('/dashboard-locataire/recherche')}>
          Rechercher un logement
        </button>
      </div>
    </main>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const Mon_Logement = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [rental, setRental] = useState<RentalWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!user) return;
    getTenantActiveRental(user.id).then(({ data }) => {
      setRental(data);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <>
        <Header date={today} hasNotifications={false} />
        <main className={styles.mainContent}><div className={styles.loadingState}>Chargement...</div></main>
      </>
    );
  }

  if (!rental) {
    return (
      <>
        <Header date={today} hasNotifications={false} />
        <NoRentalState />
      </>
    );
  }

  const property = rental.property;
  const agentOrOwner = rental.agent_profile || rental.owner_profile;
  const agentName = agentOrOwner?.full_name || 'Propriétaire';
  const agentPhone = agentOrOwner?.phone || null;
  const agentVerified = agentOrOwner?.kyc_status === 'verified';
  const agentId = rental.agent_id || rental.owner_id;

  const images = (property?.images as string[]) || [];
  const filteredImages = images.filter(Boolean);

  const surface = property?.area ? `${property.area} m²` : '—';
  const address = [property?.quartier, property?.commune, property?.city].filter(Boolean).join(', ');
  const description = property?.description || '';

  const startDateFormatted = new Date(rental.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const endDateFormatted = rental.end_date
    ? new Date(rental.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Durée indéterminée';

  const remaining = monthsRemaining(rental.end_date);
  const total = rental.end_date && rental.start_date
    ? Math.round((new Date(rental.end_date).getTime() - new Date(rental.start_date).getTime()) / (1000 * 60 * 60 * 24 * 30))
    : null;
  const elapsed = total && remaining != null ? Math.max(0, total - remaining) : null;
  const percentage = total && elapsed != null ? Math.min(100, Math.round((elapsed / total) * 100)) : null;

  const paymentInfo = formatPaymentMethod(rental.payment_method);

  const handleContactAgent = async () => {
    if (!user || !agentId) return;
    const { data: convId } = await getOrCreateConversation(user.id, agentId);
    navigate('/dashboard-locataire/messages');
  };

  const handleCallAgent = () => {
    if (agentPhone) window.open(`tel:${agentPhone}`);
  };

  return (
    <>
      <Header date={today} hasNotifications={false} />
      <main className={styles.mainContent}>
        <PageHeader
          onReportProblem={() => handleContactAgent()}
          onContactAgent={handleContactAgent}
        />

        <div className={styles.propertyLayout}>
          <div className={styles.propertyMain}>
            <Gallery
              images={filteredImages}
              currentIndex={currentImageIndex}
              onPrev={() => setCurrentImageIndex((p) => (p === 0 ? filteredImages.length - 1 : p - 1))}
              onNext={() => setCurrentImageIndex((p) => (p === filteredImages.length - 1 ? 0 : p + 1))}
              onSelectImage={setCurrentImageIndex}
            />
            <PropertyDetails
              property={{
                title: property?.title || 'Logement loué',
                address,
                description,
                surface,
                type: property?.type,
                bedrooms: property?.bedrooms,
                bathrooms: property?.bathrooms,
              }}
            />
          </div>

          <div className={styles.propertySide}>
            <BailInfo
              bail={{
                startDate: startDateFormatted,
                endDate: endDateFormatted,
                percentage,
              }}
            />
            <RentInfo
              rent={{
                monthly: `${parseInt(rental.rent_amount).toLocaleString('fr-FR')} ${rental.currency}`,
                paymentMethod: paymentInfo.label,
                charges: 'Non incluses',
              }}
            />
            <Documents documents={[]} />
            <AgentCard
              agent={{
                name: agentName,
                role: rental.agent_id ? 'Agent immobilier' : 'Propriétaire',
                verified: agentVerified,
                phone: agentPhone,
              }}
              onMessage={handleContactAgent}
              onCall={handleCallAgent}
            />
          </div>
        </div>
      </main>
    </>
  );
};

export default Mon_Logement;
