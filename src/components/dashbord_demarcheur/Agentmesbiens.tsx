import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './Agentmesbiens.module.css';

/* ==========================================
   TYPES
========================================== */
interface PropertyOwner {
  name: string;
  initials: string;
}

interface Property {
  id: number;
  title: string;
  price: string;
  period: string;
  location: string;
  status: 'active' | 'pending' | 'rented' | 'expiring' | 'inactive';
  premium?: boolean;
  isNew?: boolean;
  alert?: boolean;
  photos: number;
  views?: number;
  visits?: number;
  daysOnline?: number;
  tenant?: string;
  pendingMessage?: string;
  owner: PropertyOwner;
  actionLabel: string;
  actionGold?: boolean;
}

interface StatCard {
  icon: string;
  iconStyle: string;
  value: number;
  label: string;
  variant?: string;
}

interface AlertItem {
  type: string;
  count: string;
  text: string;
}

/* ==========================================
   INLINE SVG ICON COMPONENTS
========================================== */
const SunIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const NotificationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const CheckCircleFilledIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
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

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const StarIcon = ({ className, filled = false }: { className?: string; filled?: boolean }) => (
  filled ? (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ) : (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  )
);

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

const HouseIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);

const CameraIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
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

const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ArchiveIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
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

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

/* ==========================================
   STATUS BADGE MAPPING
========================================== */
const statusBadgeClassMap: Record<string, string> = {
  active: styles.badgeActive,
  pending: styles.badgePending,
  rented: styles.badgeRented,
  expiring: styles.badgeExpiring,
  inactive: styles.badgeInactive,
};

const statusLabelMap: Record<string, string> = {
  active: 'Actif',
  pending: 'En attente',
  rented: 'Lou\u00e9',
  expiring: 'Expire 15j',
};

/* ==========================================
   MOCK DATA
========================================== */
const mockData: Property[] = [
  {
    id: 1,
    title: 'Bel appartement F3 avec vue panoramique',
    price: '2 500 000',
    period: 'GNF/mois',
    location: 'Kip\u00e9, Ratoma',
    status: 'active',
    premium: true,
    photos: 12,
    views: 234,
    visits: 5,
    daysOnline: 12,
    owner: { name: 'M. Mamadou Diallo', initials: 'MD' },
    actionLabel: 'Voir d\u00e9tails',
  },
  {
    id: 2,
    title: 'Villa moderne avec jardin et parking',
    price: '4 800 000',
    period: 'GNF/mois',
    location: 'Lambanyi, Ratoma',
    status: 'active',
    premium: false,
    photos: 8,
    views: 89,
    visits: 2,
    daysOnline: 8,
    owner: { name: 'Mme Aissatou Barry', initials: 'AB' },
    actionLabel: 'Voir d\u00e9tails',
  },
  {
    id: 3,
    title: 'Studio meubl\u00e9 centre-ville',
    price: '800 000',
    period: 'GNF/mois',
    location: 'Cosa, Matam',
    status: 'expiring',
    alert: true,
    photos: 6,
    views: 12,
    visits: 0,
    daysOnline: 21,
    owner: { name: 'M. Oumar Diallo', initials: 'OD' },
    actionLabel: 'Booster',
    actionGold: true,
  },
  {
    id: 4,
    title: 'Appartement F2 r\u00e9nov\u00e9 avec balcon',
    price: '1 800 000',
    period: 'GNF/mois',
    location: 'Nongo, Ratoma',
    status: 'pending',
    photos: 5,
    views: 0,
    visits: 0,
    daysOnline: 0,
    pendingMessage: 'En attente de validation admin',
    owner: { name: 'Mme Fatoumata Bah', initials: 'FB' },
    actionLabel: 'Voir d\u00e9tails',
  },
  {
    id: 5,
    title: 'Grande villa familiale F5 avec piscine',
    price: '6 500 000',
    period: 'GNF/mois',
    location: 'Kip\u00e9, Ratoma',
    status: 'rented',
    photos: 15,
    tenant: 'M. Ibrahima Sow',
    owner: { name: 'M. S\u00e9kou Camara', initials: 'SC' },
    actionLabel: 'Voir d\u00e9tails',
  },
  {
    id: 6,
    title: 'Duplex F4 avec terrasse et vue mer',
    price: '3 200 000',
    period: 'GNF/mois',
    location: 'Ratoma Centre',
    status: 'active',
    isNew: true,
    photos: 10,
    views: 156,
    visits: 3,
    daysOnline: 5,
    owner: { name: 'M. Alpha Keita', initials: 'AK' },
    actionLabel: 'Voir d\u00e9tails',
  },
];

const statsData: StatCard[] = [
  { icon: 'check', iconStyle: 'primary', value: 8, label: 'Biens actifs' },
  { icon: 'clock', iconStyle: 'warning', value: 2, label: 'En attente', variant: 'warning' },
  { icon: 'badge', iconStyle: 'info', value: 2, label: 'Lou\u00e9s ce mois' },
  { icon: 'warning', iconStyle: 'error', value: 3, label: 'Alertes', variant: 'error' },
];

const alertsData: AlertItem[] = [
  { type: 'error', count: '2 mandats', text: 'expirent dans 15 jours' },
  { type: 'warning', count: '1 bien', text: 'sans visite depuis 14 jours' },
];

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentMesBiens = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterSearch, setFilterSearch] = useState<string>('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<string>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setOpenMenuId(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const toggleFilter = (filterName: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(filterName)) {
        next.delete(filterName);
      } else {
        next.add(filterName);
      }
      return next;
    });
  };

  const toggleMenu = (propertyId: number) => {
    setOpenMenuId((prev) => (prev === propertyId ? null : propertyId));
  };

  const totalPages = 2;

  // Icon mapping for stats
  const statIconComponents: Record<string, React.FC<{ className?: string }>> = {
    check: CheckCircleFilledIcon,
    clock: ClockIcon,
    badge: BadgeCheckIcon,
    warning: WarningIcon,
  };

  // Variant class mapping for stat cards
  const statVariantMap: Record<string, string> = {
    warning: styles.statCardWarning,
    error: styles.statCardError,
  };

  // Icon style mapping for stat cards
  const statIconStyleMap: Record<string, string> = {
    primary: styles.statIconPrimary,
    warning: styles.statIconWarning,
    info: styles.statIconInfo,
    error: styles.statIconError,
  };

  // Alert dot type mapping
  const alertDotMap: Record<string, string> = {
    error: styles.dotError,
    warning: styles.dotWarning,
  };

  const renderPropertyStats = (property: Property) => {
    if (property.status === 'pending') {
      return (
        <div className={styles.propertyPendingMessage}>
          <ClockIcon />
          <span>{property.pendingMessage}</span>
        </div>
      );
    }

    if (property.status === 'rented') {
      return (
        <div className={styles.propertyTenant}>
          <UserIcon />
          <div className={styles.propertyTenantInfo}>
            <span className={styles.propertyTenantLabel}>Locataire</span>
            <span className={styles.propertyTenantName}>{property.tenant}</span>
          </div>
        </div>
      );
    }

    const viewsError = (property.views ?? 0) < 20;
    const daysWarning = (property.daysOnline ?? 0) > 14;

    return (
      <div className={styles.propertyStats}>
        <div className={`${styles.propertyStat} ${viewsError ? styles.propertyStatError : ''}`}>
          <EyeIcon />
          <strong>{property.views}</strong> vues
        </div>
        <div className={styles.propertyStat}>
          <CalendarIcon />
          <strong>{property.visits}</strong> visites
        </div>
        <div className={`${styles.propertyStat} ${daysWarning ? styles.propertyStatWarning : ''}`}>
          <ClockIcon />
          <strong>{property.daysOnline}j</strong> en ligne
        </div>
      </div>
    );
  };

  return (
    <>
      {/* ========== TOP BAR ========== */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <div className={styles.pageContext}>
            <span className={styles.pageDate}>
              Mardi 4 f&eacute;vrier 2025
              <span className={styles.weather}>
                <SunIcon />
                28&deg;C Conakry
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
          <button className={`${styles.btn} ${styles.btnPrimary}`}>
            <PlusIcon />
            Ajouter un bien
          </button>
        </div>
      </header>

      {/* ========== PAGE CONTENT ========== */}
      <div className={styles.pageContent}>

        {/* ---- Page Header ---- */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h2 className={styles.pageHeaderTitle}>
              Mon portefeuille immobilier
              <span className={styles.pageHeaderBadge}>{mockData.length} biens</span>
            </h2>
          </div>
          <div className={styles.pageHeaderRight}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewToggleBtn} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => setViewMode('grid')}
                title="Vue grille"
              >
                <GridIcon />
              </button>
              <button
                className={`${styles.viewToggleBtn} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => setViewMode('list')}
                title="Vue liste"
              >
                <ListIcon />
              </button>
            </div>
            <button className={`${styles.btn} ${styles.btnOutline}`}>
              <UploadIcon />
              Exporter
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`}>
              <PlusIcon />
              Ajouter un bien
            </button>
          </div>
        </div>

        {/* ---- Stats Grid ---- */}
        <div className={styles.statsGrid}>
          {statsData.map((stat, index) => {
            const IconComponent = statIconComponents[stat.icon] || CheckCircleIcon;
            const variantClass = stat.variant ? (statVariantMap[stat.variant] || '') : '';
            const iconStyleClass = statIconStyleMap[stat.iconStyle] || '';

            return (
              <div
                key={index}
                className={`${styles.statCard} ${variantClass}`}
              >
                <div className={`${styles.statIcon} ${iconStyleClass}`}>
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

        {/* ---- Alerts Banner ---- */}
        <div className={styles.alertsBanner}>
          <div className={styles.alertsBannerIcon}>
            <WarningIcon />
          </div>
          <div className={styles.alertsBannerContent}>
            {alertsData.map((alert, index) => (
              <div key={index} className={styles.alertsBannerItem}>
                <span className={`${styles.dot} ${alertDotMap[alert.type] || ''}`}></span>
                <span>
                  <strong>{alert.count}</strong> {alert.text}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.alertsBannerAction}>
            <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
              Voir les alertes
            </button>
          </div>
        </div>

        {/* ---- Filters Bar ---- */}
        <div className={styles.filtersBar}>
          <div className={styles.filtersLeft}>
            <div className={styles.filterSearchBox}>
              <SearchIcon />
              <input
                type="text"
                placeholder="Rechercher par nom, adresse, quartier..."
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
              />
            </div>
            <button
              className={`${styles.filterBtn} ${activeFilters.has('Type') ? styles.active : ''}`}
              onClick={() => toggleFilter('Type')}
            >
              <FilterIcon />
              Type
            </button>
            <button
              className={`${styles.filterBtn} ${activeFilters.has('Statut') ? styles.active : ''}`}
              onClick={() => toggleFilter('Statut')}
            >
              <FilterIcon />
              Statut
            </button>
            <button
              className={`${styles.filterBtn} ${activeFilters.has('Quartier') ? styles.active : ''}`}
              onClick={() => toggleFilter('Quartier')}
            >
              <FilterIcon />
              Quartier
            </button>
          </div>
          <div className={styles.filtersRight}>
            <div className={styles.sortSelect}>
              <span>Trier par:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="recent">Plus r&eacute;cent</option>
                <option value="price-high">Prix d&eacute;croissant</option>
                <option value="price-low">Prix croissant</option>
                <option value="views">Plus de vues</option>
              </select>
            </div>
          </div>
        </div>

        {/* ---- Property Grid ---- */}
        <div className={`${styles.propertiesGrid} ${viewMode === 'list' ? styles.listView : ''}`} ref={menuRef}>
          {mockData.map((property) => (
            <div
              key={property.id}
              className={`${styles.propertyCard} ${property.premium ? styles.premium : ''} ${property.alert ? styles.alertCard : ''}`}
            >
              {/* Property Image */}
              <div className={styles.propertyImage}>
                <div className={styles.propertyImagePlaceholder}>
                  <HouseIcon />
                </div>
                <div className={styles.propertyBadges}>
                  <span className={`${styles.propertyBadge} ${statusBadgeClassMap[property.status] || ''}`}>
                    {property.status === 'active' && <CheckCircleFilledIcon />}
                    {property.status === 'pending' && <ClockIcon />}
                    {property.status === 'rented' && <CheckCircleFilledIcon />}
                    {property.status === 'expiring' && <WarningIcon />}
                    {statusLabelMap[property.status] || property.status}
                  </span>
                  {property.premium && (
                    <span className={`${styles.propertyBadge} ${styles.badgePremium}`}>
                      <StarIcon filled />
                      Premium
                    </span>
                  )}
                  {property.isNew && (
                    <span className={`${styles.propertyBadge} ${styles.badgeNew}`}>
                      <SparklesIcon />
                      Nouveau
                    </span>
                  )}
                </div>
                <div className={styles.propertyPhotosCount}>
                  <CameraIcon />
                  <span>{property.photos}</span>
                </div>
              </div>

              {/* Property Content */}
              <div className={styles.propertyContent}>
                <h3 className={styles.propertyTitle}>{property.title}</h3>
                <p className={styles.propertyLocation}>
                  <LocationIcon />
                  {property.location}
                </p>
                <div className={styles.propertyPrice}>
                  {property.price} <span>{property.period}</span>
                </div>

                <div className={styles.propertyDivider}></div>

                {/* Conditional stats / pending message / tenant info */}
                {renderPropertyStats(property)}

                {/* Owner */}
                <div className={styles.propertyOwner}>
                  <div className={styles.propertyOwnerAvatar}>{property.owner.initials}</div>
                  <div className={styles.propertyOwnerInfo}>
                    <div className={styles.propertyOwnerLabel}>Propri&eacute;taire</div>
                    <div className={styles.propertyOwnerName}>{property.owner.name}</div>
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.propertyFooter}>
                  {property.actionGold ? (
                    <button className={`${styles.btn} ${styles.btnGold} ${styles.btnSm}`}>
                      <SparklesIcon />
                      {property.actionLabel}
                    </button>
                  ) : (
                    <button className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}>
                      {property.actionLabel}
                    </button>
                  )}

                  <div className={styles.dropdown}>
                    <button
                      className={styles.propertyMenuBtn}
                      onClick={() => toggleMenu(property.id)}
                    >
                      <DotsVerticalIcon />
                    </button>
                    {openMenuId === property.id && (
                      <div className={styles.dropdownMenu}>
                        <div className={styles.dropdownItem}>
                          <EditIcon />
                          Modifier
                        </div>
                        <div className={styles.dropdownItem}>
                          <CurrencyIcon />
                          Modifier le prix
                        </div>
                        <div className={styles.dropdownDivider}></div>
                        <div className={`${styles.dropdownItem} ${styles.gold}`}>
                          <SparklesIcon />
                          Booster
                        </div>
                        <div className={styles.dropdownDivider}></div>
                        {property.status === 'rented' ? (
                          <>
                            <div className={styles.dropdownItem}>
                              <DocumentIcon />
                              Voir le contrat
                            </div>
                            <div className={styles.dropdownItem}>
                              <ArchiveIcon />
                              Archiver
                            </div>
                          </>
                        ) : (
                          <>
                            <div className={styles.dropdownItem}>
                              <BanIcon />
                              D&eacute;sactiver
                            </div>
                            <div className={`${styles.dropdownItem} ${styles.danger}`}>
                              <TrashIcon />
                              Supprimer
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---- Pagination ---- */}
        <div className={styles.pagination}>
          <button
            className={styles.paginationBtn}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeftIcon />
            Pr&eacute;c&eacute;dent
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`${styles.paginationBtn} ${page === currentPage ? styles.active : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className={styles.paginationBtn}
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Suivant
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </>
  );
};

export default AgentMesBiens;
