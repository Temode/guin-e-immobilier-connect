// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import {
  getAgentVisits,
  getVisitStats,
  getNextVisit,
  createVisit,
  updateVisitStatus,
  cancelVisit,
  markRelanceSent,
  getVisitTypeLabel,
  formatVisitTime,
  formatCountdown,
  type Visit,
  type CreateVisitParams,
} from '@/services/agendaService';
import styles from './AgentAgenda.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const HomeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);
const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);
const NotificationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);
const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const SunIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
  </svg>
);
const WarningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const LocationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const PhoneIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);
const WhatsAppIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const MapIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
  </svg>
);
const LightBulbIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);
const ClipboardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
const PencilIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);
const EyeIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);
const ListIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);
const DotsVerticalIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);
const EditIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);
const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
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
const RefreshIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);
const LoaderIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = ({ pendingCount, onNewVisit }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.pageContext}>
          <span className={styles.pageDate}>
            {capitalizedDate}
            <span className={styles.weather}><SunIcon />Conakry</span>
          </span>
          <h1 className={styles.pageTitle}>Agenda & Visites</h1>
        </div>
      </div>
      <div className={styles.topBarRight}>
        <button className={styles.iconBtn}>
          <NotificationIcon />
          {pendingCount > 0 && <span className={styles.notificationBadge}>{pendingCount}</span>}
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onNewVisit}>
          <PlusIcon />
          Nouvelle visite
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   HERO NEXT RDV COMPONENT
========================================== */
const HeroNextRdv = ({ visit }) => {
  if (!visit) {
    return (
      <div className={styles.heroNextRdv} style={{ justifyContent: 'center', alignItems: 'center', minHeight: 160, flexDirection: 'column', gap: 8 }}>
        <CalendarIcon style={{ width: 40, height: 40, color: 'var(--color-neutral-300)' }} />
        <p style={{ color: 'var(--color-neutral-400)', margin: 0 }}>Aucune visite programmée prochainement</p>
      </div>
    );
  }

  const { label: countdown, isUrgent } = formatCountdown(visit.scheduled_at);
  const initials = visit.lead_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const address = visit.address || visit.property?.address || visit.property?.city || '—';

  return (
    <div className={styles.heroNextRdv}>
      <div className={styles.heroHeader}>
        <div className={styles.heroLabel}><ClockIcon />Prochain rendez-vous</div>
        <div className={`${styles.heroCountdown} ${isUrgent ? styles.urgent : ''}`}><ClockIcon />{countdown}</div>
      </div>
      <div className={styles.heroBody}>
        <div className={styles.heroImage}>
          <div className={styles.heroImagePlaceholder}><HomeIcon /></div>
        </div>
        <div className={styles.heroInfo}>
          <div className={styles.heroType}><HomeIcon />{getVisitTypeLabel(visit.type)}</div>
          <h2 className={styles.heroTitle}>{visit.property?.title || 'Visite programmée'}</h2>
          {visit.property?.rent_amount && (
            <p className={styles.heroPrice}>{Number(visit.property.rent_amount).toLocaleString('fr-GN')} GNF / mois</p>
          )}
          <div className={styles.heroClient}>
            <div className={styles.heroClientAvatar}>{initials}</div>
            <span className={styles.heroClientName}>{visit.lead_name}</span>
          </div>
          <div className={styles.heroAddress}><LocationIcon /><span>{address}</span></div>
        </div>
      </div>
      <div className={styles.heroActions}>
        {visit.lead_phone && (
          <>
            <a href={`tel:${visit.lead_phone}`} className={styles.heroAction}><PhoneIcon />Appeler</a>
            <a href={`https://wa.me/${visit.lead_phone.replace(/\D/g, '')}`} className={`${styles.heroAction} ${styles.whatsapp}`}><WhatsAppIcon />WhatsApp</a>
          </>
        )}
        {address !== '—' && (
          <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className={`${styles.heroAction} ${styles.maps}`}><MapIcon />Itinéraire</a>
        )}
      </div>
      {visit.lead_notes && (
        <div className={styles.heroNote}>
          <div className={styles.heroNoteLabel}><LightBulbIcon />Note client</div>
          <p className={styles.heroNoteText}>"{visit.lead_notes}"</p>
        </div>
      )}
    </div>
  );
};

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }) => {
  const icons = { calendar: CalendarIcon, clipboard: ClipboardIcon, warning: WarningIcon, check: CheckCircleIcon };
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => {
        const IconComponent = icons[stat.icon] || CalendarIcon;
        return (
          <div key={index} className={`${styles.statCard} ${stat.variant ? styles[stat.variant] : ''}`}>
            <div className={`${styles.statIcon} ${styles[stat.iconStyle]}`}><IconComponent /></div>
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
const AlertBanner = ({ pendingVisits, onRelance, relancingId }) => {
  if (!pendingVisits || pendingVisits.length === 0) return null;
  const count = pendingVisits.length;
  const names = pendingVisits.slice(0, 2).map(v => v.lead_name).join(' et ');

  return (
    <div className={styles.alertBanner}>
      <div className={styles.alertBannerIcon}><WarningIcon /></div>
      <div className={styles.alertBannerContent}>
        <h4>{count} visite{count > 1 ? 's' : ''} en attente de confirmation</h4>
        <p>{names}{count > 2 ? ` et ${count - 2} autres` : ''} n'ont pas encore confirmé.</p>
      </div>
      <button
        className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`}
        onClick={() => onRelance(pendingVisits[0].id)}
        disabled={!!relancingId}
      >
        {relancingId ? <LoaderIcon /> : <RefreshIcon />}
        Relancer
      </button>
    </div>
  );
};

/* ==========================================
   VIEW CONTROLS COMPONENT
========================================== */
const ViewControls = ({ activeTab, onTabChange, currentDate, viewMode, onViewModeChange, onDateChange }) => (
  <div className={styles.viewControls}>
    <div className={styles.viewTabs}>
      {["Aujourd'hui", 'Semaine', 'Mois'].map((tab) => (
        <button
          key={tab}
          className={`${styles.viewTab} ${activeTab === tab ? styles.active : ''}`}
          onClick={() => onTabChange(tab)}
        >{tab}</button>
      ))}
    </div>
    <div className={styles.viewOptions}>
      <div className={styles.dateNav}>
        <button className={styles.dateNavBtn} onClick={() => onDateChange(-1)}><ChevronLeftIcon /></button>
        <span className={styles.dateDisplay}>{currentDate}</span>
        <button className={styles.dateNavBtn} onClick={() => onDateChange(1)}><ChevronRightIcon /></button>
      </div>
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => onViewModeChange('list')} title="Vue liste"
        ><ListIcon /></button>
        <button
          className={`${styles.viewToggleBtn} ${viewMode === 'calendar' ? styles.active : ''}`}
          onClick={() => onViewModeChange('calendar')} title="Vue calendrier"
        ><CalendarIcon /></button>
      </div>
    </div>
  </div>
);

/* ==========================================
   VISIT CARD COMPONENT
========================================== */
const VisitCard = ({ visit, onConfirm, onCancel, onRelance, isRelancing }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const typeIcons = { visit: HomeIcon, 'contre-visite': RefreshIcon, signature: PencilIcon, 'etat-lieux': ClipboardIcon };
  const statusLabels = { confirmed: { label: 'Confirmé', icon: CheckIcon }, pending: { label: 'En attente', icon: ClockIcon }, cancelled: { label: 'Annulé', icon: XIcon }, completed: { label: 'Terminé', icon: CheckCircleIcon } };
  const TypeIcon = typeIcons[visit.type] || HomeIcon;
  const statusInfo = statusLabels[visit.status] || statusLabels.confirmed;
  const StatusIcon = statusInfo.icon;
  const initials = visit.lead_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  const address = visit.address || visit.property?.address || visit.property?.city || '—';
  const prospectColors = { hot: '#ef4444', warm: '#f59e0b', cold: '#3b82f6', unknown: '#94a3b8' };
  const prospectLabels = { hot: '🔥 Chaud', warm: '🟡 Tiède', cold: '❄️ Froid', unknown: '— Inconnu' };

  return (
    <article className={`${styles.visitCard} ${visit.status === 'pending' ? styles.pending : ''} ${visit.type === 'signature' ? styles.signature : ''}`}>
      <div className={styles.visitHeader}>
        <div className={styles.visitType}>
          <span className={`${styles.visitTypeBadge} ${styles[visit.type]}`}>
            <TypeIcon />{getVisitTypeLabel(visit.type)}
          </span>
          <span className={`${styles.visitStatus} ${styles[visit.status]}`}>
            <StatusIcon />{statusInfo.label}
          </span>
          {visit.ai_prospect_score !== 'unknown' && (
            <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: 9999, background: '#f1f5f9', color: prospectColors[visit.ai_prospect_score] }}>
              {prospectLabels[visit.ai_prospect_score]}
            </span>
          )}
        </div>
        <div className={styles.visitMenu}>
          <button className={styles.visitMenuBtn} onClick={() => setMenuOpen(!menuOpen)}><DotsVerticalIcon /></button>
          {menuOpen && (
            <div className={styles.dropdownMenu} style={{ display: 'block' }}>
              {visit.status === 'pending' && (
                <div className={styles.dropdownItem} onClick={() => { onConfirm(visit.id); setMenuOpen(false); }}>
                  <CheckIcon />Confirmer
                </div>
              )}
              {visit.status === 'pending' && (
                <div className={styles.dropdownItem} onClick={() => { onRelance(visit.id); setMenuOpen(false); }}>
                  <RefreshIcon />Relancer
                </div>
              )}
              <div className={styles.dropdownDivider}></div>
              <div className={`${styles.dropdownItem} ${styles.danger}`} onClick={() => { onCancel(visit.id); setMenuOpen(false); }}>
                <XIcon />Annuler
              </div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.visitBody}>
        <div className={styles.visitProperty}>
          <div className={styles.visitPropertyImage}><div className={styles.imagePlaceholder}><HomeIcon /></div></div>
          <div className={styles.visitPropertyInfo}>
            <h3 className={styles.visitPropertyTitle}>{visit.property?.title || 'Bien non spécifié'}</h3>
            {visit.property?.city && <p className={styles.visitPropertyLocation}><LocationIcon />{visit.property.city}</p>}
          </div>
        </div>
        <div className={styles.visitClient}>
          <div className={styles.visitClientAvatar}>{initials}</div>
          <div className={styles.visitClientInfo}>
            <h4 className={styles.visitClientName}>{visit.lead_name}</h4>
            {visit.lead_phone && <p className={styles.visitClientPhone}><PhoneIcon />{visit.lead_phone}</p>}
            {visit.lead_notes && <p className={styles.visitClientNote}>"{visit.lead_notes}"</p>}
          </div>
        </div>
        {address !== '—' && (
          <div className={styles.visitAddress}>
            <div className={styles.visitAddressIcon}><LocationIcon /></div>
            <div className={styles.visitAddressInfo}><p className={styles.visitAddressText}>{address}</p></div>
          </div>
        )}
      </div>
      <div className={styles.visitFooter}>
        {visit.lead_phone && (
          <>
            <a href={`tel:${visit.lead_phone}`} className={styles.visitAction}><PhoneIcon />Appeler</a>
            <a href={`https://wa.me/${visit.lead_phone.replace(/\D/g, '')}`} className={`${styles.visitAction} ${styles.whatsapp}`}><WhatsAppIcon />WhatsApp</a>
          </>
        )}
        {address !== '—' && (
          <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className={`${styles.visitAction} ${styles.maps}`}><MapIcon />Maps</a>
        )}
      </div>
    </article>
  );
};

/* ==========================================
   TIMELINE COMPONENT
========================================== */
const Timeline = ({ visits, onConfirm, onCancel, onRelance, relancingId }) => {
  if (visits.length === 0) {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
        <CalendarIcon style={{ width: 48, height: 48, margin: '0 auto 12px', display: 'block' }} />
        <p style={{ margin: 0, fontWeight: 500 }}>Aucune visite programmée pour cette période</p>
        <p style={{ margin: '4px 0 0', fontSize: '0.875rem' }}>Cliquez sur "+ Nouvelle visite" pour en créer une</p>
      </div>
    );
  }

  return (
    <div className={styles.timeline}>
      {visits.map((visit, index) => (
        <div key={visit.id || index} className={styles.timelineItem}>
          <div className={styles.timelineTime}>{formatVisitTime(visit.scheduled_at)}</div>
          <div className={`${styles.timelineDot} ${styles[visit.type]} ${visit.status === 'pending' ? styles.pending : ''}`}></div>
          <VisitCard visit={visit} onConfirm={onConfirm} onCancel={onCancel} onRelance={onRelance} isRelancing={relancingId === visit.id} />
        </div>
      ))}
    </div>
  );
};

/* ==========================================
   NEW VISIT MODAL
========================================== */
const NewVisitModal = ({ isOpen, onClose, onCreate }) => {
  const [form, setForm] = useState({
    leadName: '', leadPhone: '', leadEmail: '', leadNotes: '',
    type: 'visit' as Visit['type'],
    scheduledAt: '', scheduledTime: '09:00',
    address: '', durationMinutes: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.leadName.trim()) { setError('Le nom du prospect est requis.'); return; }
    if (!form.scheduledAt) { setError('La date et l\'heure sont requises.'); return; }
    setLoading(true); setError('');
    try {
      const scheduledAt = new Date(`${form.scheduledAt}T${form.scheduledTime}:00`).toISOString();
      const { error: err } = await onCreate({
        leadName: form.leadName,
        leadPhone: form.leadPhone || undefined,
        leadEmail: form.leadEmail || undefined,
        leadNotes: form.leadNotes || undefined,
        type: form.type,
        scheduledAt,
        durationMinutes: Number(form.durationMinutes),
        address: form.address || undefined,
      });
      if (err) { setError(err.message || 'Erreur création'); }
      else { onClose(); }
    } finally { setLoading(false); }
  };

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid var(--color-neutral-200)', borderRadius: 8, fontSize: '0.875rem', outline: 'none', background: 'white' };
  const labelStyle = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-neutral-700)', marginBottom: 4 };
  const rowStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div style={{ background: 'white', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.15)' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--color-neutral-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>Nouvelle visite</h3>
          <button onClick={onClose} disabled={loading} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><XIcon style={{ width: 20, height: 20 }} /></button>
        </div>
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Type */}
          <div>
            <label style={labelStyle}>Type de visite</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
              <option value="visit">Visite</option>
              <option value="contre-visite">Contre-visite</option>
              <option value="signature">Signature</option>
              <option value="etat-lieux">État des lieux</option>
            </select>
          </div>
          {/* Date & heure */}
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Date *</label>
              <input type="date" value={form.scheduledAt} onChange={e => setForm(f => ({ ...f, scheduledAt: e.target.value }))} style={inputStyle} min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label style={labelStyle}>Heure *</label>
              <input type="time" value={form.scheduledTime} onChange={e => setForm(f => ({ ...f, scheduledTime: e.target.value }))} style={inputStyle} />
            </div>
          </div>
          {/* Prospect */}
          <div>
            <label style={labelStyle}>Nom du prospect *</label>
            <input type="text" value={form.leadName} onChange={e => setForm(f => ({ ...f, leadName: e.target.value }))} placeholder="Mamadou Diallo" style={inputStyle} />
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Téléphone</label>
              <input type="tel" value={form.leadPhone} onChange={e => setForm(f => ({ ...f, leadPhone: e.target.value }))} placeholder="+224 6XX XX XX XX" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input type="email" value={form.leadEmail} onChange={e => setForm(f => ({ ...f, leadEmail: e.target.value }))} placeholder="email@example.com" style={inputStyle} />
            </div>
          </div>
          {/* Adresse */}
          <div>
            <label style={labelStyle}>Adresse du bien</label>
            <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Quartier, Commune, Conakry" style={inputStyle} />
          </div>
          {/* Notes */}
          <div>
            <label style={labelStyle}>Notes / Critères prospect</label>
            <textarea value={form.leadNotes} onChange={e => setForm(f => ({ ...f, leadNotes: e.target.value }))} placeholder="Budget confirmé à 2M. Cherche F3 avec parking. Famille de 3 personnes..." style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }} />
          </div>
          {error && (
            <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
        </div>
        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-neutral-100)', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} disabled={loading} style={{ padding: '10px 20px', border: '1px solid var(--color-neutral-200)', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: '0.875rem' }}>
            Annuler
          </button>
          <button onClick={handleSubmit} disabled={loading} style={{ padding: '10px 20px', background: 'var(--color-primary-600, #047857)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
            {loading ? <><LoaderIcon style={{ width: 16, height: 16 }} />Création...</> : <><CheckIcon style={{ width: 16, height: 16 }} />Créer la visite</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentAgenda = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState("Aujourd'hui");
  const [viewMode, setViewMode] = useState('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visits, setVisits] = useState([]);
  const [nextVisit, setNextVisit] = useState(null);
  const [stats, setStats] = useState({ today: 0, thisWeek: 0, pending: 0, signaturesThisWeek: 0 });
  const [loading, setLoading] = useState(true);
  const [relancingId, setRelancingId] = useState(null);
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const todayStr = currentDate.toISOString().split('T')[0];
      const [visitsRes, nextRes, statsRes] = await Promise.all([
        getAgentVisits({ date: activeTab === "Aujourd'hui" ? todayStr : undefined, upcoming: activeTab === 'Semaine' }),
        getNextVisit(),
        getVisitStats(user.id),
      ]);
      setVisits(visitsRes.data);
      setNextVisit(nextRes.data);
      setStats(statsRes);
    } finally {
      setLoading(false);
    }
  }, [user, currentDate, activeTab]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleConfirm = async (visitId) => {
    await updateVisitStatus(visitId, 'confirmed');
    loadData();
  };

  const handleCancel = async (visitId) => {
    await cancelVisit(visitId);
    loadData();
  };

  const handleRelance = async (visitId) => {
    setRelancingId(visitId);
    await markRelanceSent(visitId);
    await new Promise(r => setTimeout(r, 500));
    setRelancingId(null);
    loadData();
  };

  const handleCreateVisit = async (params) => {
    const { error } = await createVisit(params);
    if (!error) { setIsNewVisitOpen(false); loadData(); }
    return { error };
  };

  const handleDateChange = (direction) => {
    const d = new Date(currentDate);
    if (activeTab === "Aujourd'hui") d.setDate(d.getDate() + direction);
    else if (activeTab === 'Semaine') d.setDate(d.getDate() + direction * 7);
    else d.setMonth(d.getMonth() + direction);
    setCurrentDate(d);
  };

  const pendingVisits = visits.filter(v => v.status === 'pending');
  const dateDisplay = activeTab === "Aujourd'hui"
    ? currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
    : currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const statsCards = [
    { icon: 'calendar', iconStyle: 'primary', value: loading ? '—' : stats.today, label: "Aujourd'hui" },
    { icon: 'clipboard', iconStyle: 'info', value: loading ? '—' : stats.thisWeek, label: 'Cette semaine' },
    { icon: 'warning', iconStyle: 'warning', value: loading ? '—' : stats.pending, label: 'À confirmer', variant: stats.pending > 0 ? 'warning' : '' },
    { icon: 'check', iconStyle: 'gold', value: loading ? '—' : stats.signaturesThisWeek, label: 'Signatures semaine', variant: stats.signaturesThisWeek > 0 ? 'gold' : '' },
  ];

  return (
    <>
      <TopBar pendingCount={stats.pending} onNewVisit={() => setIsNewVisitOpen(true)} />
      <div className={styles.pageContent}>
        <HeroNextRdv visit={nextVisit} />
        <StatsGrid stats={statsCards} />
        <AlertBanner pendingVisits={pendingVisits} onRelance={handleRelance} relancingId={relancingId} />
        <ViewControls
          activeTab={activeTab} onTabChange={setActiveTab}
          currentDate={dateDisplay} viewMode={viewMode}
          onViewModeChange={setViewMode} onDateChange={handleDateChange}
        />
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48, color: 'var(--color-neutral-400)' }}>
            <LoaderIcon style={{ width: 32, height: 32 }} />
          </div>
        ) : (
          <Timeline visits={visits} onConfirm={handleConfirm} onCancel={handleCancel} onRelance={handleRelance} relancingId={relancingId} />
        )}
      </div>
      <button className={styles.fab} onClick={() => setIsNewVisitOpen(true)}><PlusIcon /></button>
      <NewVisitModal isOpen={isNewVisitOpen} onClose={() => setIsNewVisitOpen(false)} onCreate={handleCreateVisit} />
    </>
  );
};

export default AgentAgenda;
