// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import styles from './AgentClients.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserAddIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MessageIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
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

const EyeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const ExportIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
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

/* ==========================================
   HELPERS
========================================== */
function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? "à l'instant" : `il y a ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hier';
  if (days < 7) return `il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  return `il y a ${weeks} semaine${weeks > 1 ? 's' : ''}`;
}

/* ==========================================
   TYPES
========================================== */
interface ClientData {
  id: string;
  name: string;
  initials: string;
  type: 'prospect' | 'owner' | 'tenant';
  phone: string;
  email?: string;
  statuses: string[];
  isUrgent: boolean;
  criteria: string;
  lastContact: string;
  lastNote: string;
  visitInfo?: string;
  properties?: string;
  ai_prospect_score?: string;
}

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = ({ searchQuery, onSearchChange }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const capitalizedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarLeft}>
        <div className={styles.pageContext}>
          <span className={styles.pageDate}>
            {capitalizedDate}
            <span className={styles.weather}>
              <SunIcon />
              28°C Conakry
            </span>
          </span>
          <h1 className={styles.pageTitle}>Mes clients</h1>
        </div>
      </div>
      <div className={styles.topBarRight}>
        <div className={styles.searchBox}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <button className={styles.iconBtn}>
          <NotificationIcon />
        </button>
      </div>
    </header>
  );
};

/* ==========================================
   PAGE HEADER COMPONENT
========================================== */
const PageHeader = ({ totalClients }) => (
  <div className={styles.pageHeader}>
    <div className={styles.pageHeaderLeft}>
      <h1>
        Gestion des clients
        <span className={styles.resultsCount}>{totalClients} clients</span>
      </h1>
    </div>
    <div className={styles.pageHeaderRight}>
      <button className={`${styles.btn} ${styles.btnSecondary}`}>
        <ExportIcon />
        Exporter
      </button>
    </div>
  </div>
);

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }) => (
  <div className={styles.statsGrid}>
    {stats.map((stat, index) => (
      <div key={index} className={`${styles.statCard} ${stat.variant ? styles[stat.variant] : ''}`}>
        <div className={`${styles.statIcon} ${styles[stat.iconStyle]}`}>
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
   ALERT BANNER COMPONENT
========================================== */
const AlertBanner = ({ alert }) => {
  if (!alert) return null;
  return (
    <div className={styles.alertsBanner}>
      <div className={styles.alertsBannerIcon}>
        <ClockIcon />
      </div>
      <div className={styles.alertsBannerContent}>
        <h3>{alert.title}</h3>
        <p>{alert.description}</p>
      </div>
    </div>
  );
};

/* ==========================================
   TABS COMPONENT
========================================== */
const Tabs = ({ tabs, activeTab, onTabChange }) => (
  <div className={styles.tabs}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
        onClick={() => onTabChange(tab.id)}
      >
        {tab.label}
        <span className={styles.tabCount}>{tab.count}</span>
      </button>
    ))}
  </div>
);

/* ==========================================
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({ viewMode, onViewModeChange, sortBy, onSortChange }) => (
  <div className={styles.filtersBar}>
    <div className={styles.filtersLeft}>
      <button className={styles.filterBtn}>
        <CheckCircleIcon />
        Statut
      </button>
      <button className={styles.filterBtn}>
        <FilterIcon />
        Source
      </button>
    </div>
    <div className={styles.filtersRight}>
      <div className={styles.viewToggle}>
        <button
          className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
          onClick={() => onViewModeChange('grid')}
          title="Vue cartes"
        >
          <GridIcon />
        </button>
        <button
          className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => onViewModeChange('list')}
          title="Vue tableau"
        >
          <ListIcon />
        </button>
      </div>
      <div className={styles.sortDropdown}>
        <span className={styles.sortLabel}>Trier par :</span>
        <select className={styles.sortSelect} value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
          <option value="lastContact">Dernier contact</option>
          <option value="name">Nom A-Z</option>
          <option value="dateAdded">Date d'ajout</option>
          <option value="status">Statut</option>
        </select>
      </div>
    </div>
  </div>
);

/* ==========================================
   CLIENT CARD COMPONENT
========================================== */
const ClientCard = ({ client }) => {
  const statusConfig = {
    urgent: { label: 'Relance aujourd\'hui', icon: ClockIcon, className: 'urgent' },
    negotiation: { label: 'En négociation', icon: SparklesIcon, className: 'negotiation' },
    qualified: { label: 'Qualifié', icon: CheckCircleIcon, className: 'qualified' },
    visit: { label: client.visitInfo || 'Visite planifiée', icon: CalendarIcon, className: 'visit' },
    new: { label: 'Nouveau • À qualifier', icon: PlusIcon, className: 'new' },
    converted: { label: 'Actif', icon: CheckCircleIcon, className: 'converted' },
    contacted: { label: 'Contacté', icon: MessageIcon, className: 'contacted' },
    hot: { label: '🔥 Prospect chaud', icon: SparklesIcon, className: 'negotiation' },
    warm: { label: '🟡 Prospect tiède', icon: ClockIcon, className: 'visit' },
    cold: { label: '❄️ Prospect froid', icon: ClockIcon, className: 'contacted' },
  };

  const typeConfig = {
    prospect: { label: 'Prospect', className: 'prospect' },
    owner: { label: 'Propriétaire', className: 'owner' },
    tenant: { label: 'Locataire', className: 'tenant' },
  };

  return (
    <article className={`${styles.clientCard} ${client.isUrgent ? styles.urgent : ''} ${client.type === 'owner' ? styles.gold : ''}`}>
      <div className={styles.clientHeader}>
        <div className={`${styles.clientAvatar} ${styles[client.type]}`}>
          {client.initials}
        </div>
        <div className={styles.clientInfo}>
          <h3 className={styles.clientName}>
            {client.name}
            <span className={`${styles.clientTypeBadge} ${styles[typeConfig[client.type]?.className || 'prospect']}`}>
              {typeConfig[client.type]?.label || 'Client'}
            </span>
          </h3>
          <div className={styles.clientContact}>
            <span>
              <PhoneIcon />
              {client.phone || 'Non renseigné'}
            </span>
            {client.email && (
              <span>
                <EmailIcon />
                {client.email}
              </span>
            )}
          </div>
        </div>
        <div className={styles.clientMenu}>
          <button className={styles.clientMenuBtn}>
            <DotsVerticalIcon />
          </button>
          <div className={styles.dropdownMenu}>
            <div className={styles.dropdownItem}>
              <EyeIcon />
              Voir la fiche
            </div>
            <div className={styles.dropdownItem}>
              <EditIcon />
              Modifier
            </div>
            {client.type === 'prospect' && (
              <>
                <div className={styles.dropdownDivider}></div>
                <div className={`${styles.dropdownItem} ${styles.gold}`}>
                  <CheckCircleIcon />
                  Convertir en locataire
                </div>
              </>
            )}
            {client.type === 'owner' && (
              <>
                <div className={styles.dropdownDivider}></div>
                <div className={styles.dropdownItem}>
                  <BuildingIcon />
                  Voir ses biens
                </div>
              </>
            )}
            <div className={styles.dropdownDivider}></div>
            <div className={`${styles.dropdownItem} ${styles.danger}`}>
              <TrashIcon />
              Archiver
            </div>
          </div>
        </div>
      </div>

      <div className={styles.clientStatus}>
        {client.statuses.map((status, index) => {
          const config = statusConfig[status];
          if (!config) return null;
          const StatusIcon = config.icon;
          return (
            <span key={index} className={`${styles.statusBadge} ${styles[config.className]}`}>
              <StatusIcon />
              {config.label}
            </span>
          );
        })}
      </div>

      <div className={styles.clientDetails}>
        <div className={styles.clientSearchCriteria}>
          {client.type === 'owner' ? <BuildingIcon /> : <SearchIcon />}
          <p>
            <strong>{client.type === 'owner' ? client.properties : 'Recherche :'}</strong> {client.criteria}
          </p>
        </div>
        <div className={styles.clientLastContact}>
          <MessageIcon />
          <div className={styles.clientLastContactInfo}>
            <div className={styles.clientLastContactDate}>Dernier contact : {client.lastContact}</div>
            <div className={styles.clientLastContactNote}>"{client.lastNote}"</div>
          </div>
        </div>
      </div>

      <div className={styles.clientFooter}>
        {client.phone && (
          <button className={styles.clientAction}>
            <PhoneIcon />
            Appeler
          </button>
        )}
        <button className={styles.clientAction}>
          <MessageIcon />
          Message
        </button>
        <button className={`${styles.clientAction} ${styles.primary}`}>
          <EyeIcon />
          Voir fiche
        </button>
      </div>
    </article>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeftIcon />
      </button>
      {[...Array(Math.min(totalPages, 5))].map((_, index) => (
        <button
          key={index}
          className={`${styles.paginationBtn} ${currentPage === index + 1 ? styles.active : ''}`}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </button>
      ))}
      <button
        className={styles.paginationBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRightIcon />
      </button>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT — Connected to Backend
========================================== */
const AgentClients = () => {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('lastContact');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 12;

  /* ── Load clients from visits (prospects) + rentals (tenants/owners) ── */
  const loadClients = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    const clientMap = new Map<string, ClientData>();
    const now = new Date();

    // 1. Load prospects from visits table
    try {
      const { data: visits } = await (supabase as any)
        .from('visits')
        .select('id, lead_name, lead_phone, lead_email, lead_notes, type, status, scheduled_at, ai_prospect_score, follow_up_required, relance_sent_at, updated_at, property:property_id(title, city, type, price)')
        .order('scheduled_at', { ascending: false })
        .limit(200);

      if (visits) {
        // Group visits by lead_name to deduplicate
        const byName = new Map<string, any[]>();
        for (const v of visits) {
          const key = v.lead_name?.toLowerCase().trim();
          if (!key) continue;
          if (!byName.has(key)) byName.set(key, []);
          byName.get(key)!.push(v);
        }

        for (const [, group] of byName) {
          const latest = group[0]; // Most recent visit
          const hasUpcoming = group.some(v => new Date(v.scheduled_at) > now && v.status !== 'cancelled');
          const upcomingVisit = group.find(v => new Date(v.scheduled_at) > now && v.status !== 'cancelled');
          const needsRelance = latest.follow_up_required && !latest.relance_sent_at;
          const daysSinceContact = Math.floor((now.getTime() - new Date(latest.updated_at).getTime()) / 86400000);

          const statuses: string[] = [];
          // AI score status
          if (latest.ai_prospect_score === 'hot') statuses.push('hot');
          else if (latest.ai_prospect_score === 'warm') statuses.push('warm');
          else if (latest.ai_prospect_score === 'cold') statuses.push('cold');
          // Urgency
          if (needsRelance || daysSinceContact >= 3) statuses.push('urgent');
          // Visit planned
          if (hasUpcoming) statuses.push('visit');
          // Signature
          if (group.some(v => v.type === 'signature' && v.status === 'completed')) statuses.push('converted');
          // Default
          if (statuses.length === 0) statuses.push('contacted');

          const criteria = latest.lead_notes || 
            (latest.property ? `${latest.property.type || 'Bien'} • ${latest.property.city || 'Conakry'}${latest.property.price ? ` • ${Number(latest.property.price).toLocaleString('fr-FR')} GNF` : ''}` : 'Non défini');

          clientMap.set(latest.lead_name, {
            id: latest.id,
            name: latest.lead_name,
            initials: getInitials(latest.lead_name),
            type: 'prospect',
            phone: latest.lead_phone || '',
            email: latest.lead_email || undefined,
            statuses,
            isUrgent: needsRelance || daysSinceContact >= 3,
            criteria,
            lastContact: timeAgo(latest.updated_at),
            lastNote: latest.lead_notes || 'Aucune note',
            visitInfo: upcomingVisit ? `${upcomingVisit.type === 'visit' ? 'Visite' : upcomingVisit.type === 'contre-visite' ? 'Contre-visite' : upcomingVisit.type === 'signature' ? 'Signature' : 'RDV'} • ${new Date(upcomingVisit.scheduled_at).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}` : undefined,
            ai_prospect_score: latest.ai_prospect_score,
          });
        }
      }
    } catch (e) {
      console.warn('[Clients] Error loading visits:', e);
    }

    // 2. Load tenants from rentals
    try {
      const { data: rentals } = await (supabase as any)
        .from('rentals')
        .select('id, tenant_id, rent_amount, currency, start_date, status, updated_at, property:property_id(title, city, type)')
        .or(`owner_id.eq.${user.id},agent_id.eq.${user.id}`)
        .eq('status', 'active')
        .limit(50);

      if (rentals) {
        for (const r of rentals) {
          // Load tenant profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, phone, avatar_url')
            .eq('id', r.tenant_id)
            .single();

          if (profile?.full_name && !clientMap.has(profile.full_name)) {
            clientMap.set(profile.full_name, {
              id: r.id,
              name: profile.full_name,
              initials: getInitials(profile.full_name),
              type: 'tenant',
              phone: profile.phone || '',
              statuses: ['converted'],
              isUrgent: false,
              criteria: `${r.property?.title || 'Bien'} • ${r.property?.city || ''} • ${Number(r.rent_amount).toLocaleString('fr-FR')} ${r.currency || 'GNF'}/mois`,
              lastContact: timeAgo(r.updated_at || r.start_date),
              lastNote: `Locataire actif depuis le ${new Date(r.start_date).toLocaleDateString('fr-FR')}`,
            });
          }
        }
      }
    } catch (e) {
      console.warn('[Clients] Error loading rentals:', e);
    }

    setClients(Array.from(clientMap.values()));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  /* ── Filter & sort clients ── */
  const filteredClients = clients.filter(c => {
    // Tab filter
    if (activeTab === 'prospects' && c.type !== 'prospect') return false;
    if (activeTab === 'owners' && c.type !== 'owner') return false;
    if (activeTab === 'tenants' && c.type !== 'tenant') return false;
    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email?.toLowerCase().includes(q);
    }
    return true;
  });

  // Sort
  const sortedClients = [...filteredClients].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    // Urgent first by default
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return 0;
  });

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedClients.length / ITEMS_PER_PAGE));
  const paginatedClients = sortedClients.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Stats
  const prospects = clients.filter(c => c.type === 'prospect');
  const urgentCount = clients.filter(c => c.isUrgent).length;
  const visitCount = clients.filter(c => c.statuses.includes('visit')).length;

  const stats = [
    { icon: UsersIcon, iconStyle: 'primary', value: clients.length, label: 'Total clients' },
    { icon: SearchIcon, iconStyle: 'info', value: prospects.length, label: 'Prospects actifs' },
    { icon: ClockIcon, iconStyle: 'error', value: urgentCount, label: 'À relancer', variant: 'error' },
    { icon: CalendarIcon, iconStyle: 'gold', value: visitCount, label: 'Visites planifiées', variant: 'gold' },
  ];

  const tabs = [
    { id: 'all', label: 'Tous', count: clients.length },
    { id: 'prospects', label: 'Prospects', count: prospects.length },
    { id: 'owners', label: 'Propriétaires', count: clients.filter(c => c.type === 'owner').length },
    { id: 'tenants', label: 'Locataires', count: clients.filter(c => c.type === 'tenant').length },
  ];

  const alert = urgentCount > 0
    ? { title: `${urgentCount} client(s) à relancer`, description: `Ne manquez pas ces opportunités ! ${urgentCount} prospect(s) attendent votre retour.` }
    : null;

  return (
    <>
      <TopBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className={styles.pageContent}>
        <PageHeader totalClients={clients.length} />

        <StatsGrid stats={stats} />

        <AlertBanner alert={alert} />

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(1); }}
        />

        <FiltersBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            Chargement des clients...
          </div>
        ) : paginatedClients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
            {searchQuery ? 'Aucun client trouvé pour cette recherche.' : 'Aucun client pour le moment. Les prospects apparaîtront ici après vos premières visites.'}
          </div>
        ) : (
          <div className={styles.clientsGrid}>
            {paginatedClients.map((client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default AgentClients;
