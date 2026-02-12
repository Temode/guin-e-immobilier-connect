import { useState } from 'react';
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

const StarIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  filled ? (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ) : null
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
        <h1 className={styles.pageTitle}>Mes clients</h1>
      </div>
    </div>
    <div className={styles.topBarRight}>
      <div className={styles.searchBox}>
        <SearchIcon />
        <input type="text" placeholder="Rechercher un client..." />
      </div>
      <button className={styles.iconBtn}>
        <NotificationIcon />
        <span className={styles.notificationBadge}>3</span>
      </button>
      <button className={`${styles.btn} ${styles.btnPrimary}`}>
        <UserAddIcon />
        Ajouter un client
      </button>
    </div>
  </header>
);

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
      <button className={`${styles.btn} ${styles.btnPrimary}`}>
        <UserAddIcon />
        Ajouter un client
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
const AlertBanner = ({ alert }) => (
  <div className={styles.alertsBanner}>
    <div className={styles.alertsBannerIcon}>
      <ClockIcon />
    </div>
    <div className={styles.alertsBannerContent}>
      <h3>{alert.title}</h3>
      <p>{alert.description}</p>
    </div>
    <button className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`}>
      Voir les relances
    </button>
  </div>
);

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
      <div className={styles.filterSearch}>
        <SearchIcon />
        <input type="text" placeholder="Rechercher par nom, téléphone, email..." />
      </div>
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
            <span className={`${styles.clientTypeBadge} ${styles[typeConfig[client.type].className]}`}>
              {typeConfig[client.type].label}
            </span>
          </h3>
          <div className={styles.clientContact}>
            <span>
              <PhoneIcon />
              {client.phone}
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
                <div className={styles.dropdownItem}>
                  <PlusIcon />
                  Ajouter un bien
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
        <button className={styles.clientAction}>
          <PhoneIcon />
          Appeler
        </button>
        {client.type === 'prospect' && client.statuses.includes('negotiation') && (
          <button className={`${styles.clientAction} ${styles.gold}`}>
            <CheckCircleIcon />
            Convertir
          </button>
        )}
        {client.type === 'prospect' && client.statuses.includes('qualified') && (
          <button className={styles.clientAction}>
            <CalendarIcon />
            Planifier
          </button>
        )}
        {client.type === 'prospect' && !client.statuses.includes('negotiation') && !client.statuses.includes('qualified') && (
          <button className={styles.clientAction}>
            <MessageIcon />
            Message
          </button>
        )}
        {client.type === 'owner' && (
          <button className={styles.clientAction}>
            <BuildingIcon />
            Ses biens
          </button>
        )}
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
const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className={styles.pagination}>
    <button
      className={styles.paginationBtn}
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
    >
      <ChevronLeftIcon />
    </button>
    {[...Array(totalPages)].map((_, index) => (
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

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentClients = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('lastContact');
  const [currentPage, setCurrentPage] = useState(1);

  // Mock Data
  const mockData = {
    stats: [
      { icon: UsersIcon, iconStyle: 'primary', value: 47, label: 'Total clients' },
      { icon: SearchIcon, iconStyle: 'info', value: 28, label: 'Prospects actifs' },
      { icon: ClockIcon, iconStyle: 'error', value: 5, label: 'À relancer aujourd\'hui', variant: 'error' },
      { icon: CalendarIcon, iconStyle: 'gold', value: 3, label: 'Visites cette semaine', variant: 'gold' },
    ],
    alert: {
      title: '5 clients à relancer aujourd\'hui',
      description: 'Ne manquez pas ces opportunités ! 2 prospects en négociation et 3 qualifiés attendent votre retour.',
    },
    tabs: [
      { id: 'all', label: 'Tous', count: 47 },
      { id: 'prospects', label: 'Prospects', count: 28 },
      { id: 'owners', label: 'Propriétaires', count: 12 },
      { id: 'tenants', label: 'Locataires', count: 7 },
    ],
    clients: [
      {
        id: 1,
        name: 'Mamadou Diallo',
        initials: 'MD',
        type: 'prospect',
        phone: '+224 620 12 34 56',
        email: 'm.diallo@email.com',
        statuses: ['urgent', 'negotiation'],
        isUrgent: true,
        criteria: 'F3 Meublé • Kipé • 2-3M GNF',
        lastContact: 'il y a 3 jours',
        lastNote: 'Très intéressé par l\'appart F3 à Kipé. Budget confirmé à 2,5M.',
      },
      {
        id: 2,
        name: 'Aissatou Barry',
        initials: 'AB',
        type: 'prospect',
        phone: '+224 622 45 67 89',
        statuses: ['urgent', 'qualified'],
        isUrgent: true,
        criteria: 'Villa F4 • Lambanyi • 3 - 5M GNF',
        lastContact: 'il y a 5 jours',
        lastNote: 'Budget confirmé. Cherche avec jardin pour les enfants.',
      },
      {
        id: 3,
        name: 'Sékou Camara',
        initials: 'SC',
        type: 'owner',
        phone: '+224 621 98 76 54',
        email: 's.camara@email.com',
        statuses: ['converted'],
        properties: '3 biens en gestion',
        criteria: '• 2 loués, 1 actif',
        lastContact: 'il y a 1 semaine',
        lastNote: 'Veut discuter du renouvellement du mandat pour la villa F5.',
      },
      {
        id: 4,
        name: 'Ibrahima Bah',
        initials: 'IB',
        type: 'prospect',
        phone: '+224 625 11 22 33',
        statuses: ['visit'],
        visitInfo: 'Visite planifiée • Jeudi 10h',
        criteria: 'Studio ou F2 • Ratoma Centre • 800K - 1,2M GNF',
        lastContact: 'hier',
        lastNote: 'Confirmé pour la visite du studio à Nongo jeudi matin.',
      },
      {
        id: 5,
        name: 'Fatoumata Keita',
        initials: 'FK',
        type: 'prospect',
        phone: '+224 628 44 55 66',
        statuses: ['new'],
        criteria: 'Non défini',
        lastContact: 'aujourd\'hui',
        lastNote: 'Contact via le site. À rappeler pour définir les critères.',
      },
      {
        id: 6,
        name: 'Oumar Sow',
        initials: 'OS',
        type: 'prospect',
        phone: '+224 626 77 88 99',
        statuses: ['contacted'],
        criteria: 'Appartement F2 • Cosa • 1-1,5M GNF',
        lastContact: 'il y a 2 semaines',
        lastNote: 'Premier contact effectué. Attend des propositions.',
      },
    ],
  };

  return (
    <>
      <TopBar />

      <div className={styles.pageContent}>
        <PageHeader totalClients={47} />

        <StatsGrid stats={mockData.stats} />

        <AlertBanner alert={mockData.alert} />

        <Tabs
          tabs={mockData.tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <FiltersBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className={styles.clientsGrid}>
          {mockData.clients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={5}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default AgentClients;