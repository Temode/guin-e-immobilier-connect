// @ts-nocheck
import { NavLink } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import styles from './AdminLayout.module.css';

/* ─── Inline SVG Icons ─── */
const Icons = {
  Shield: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  LayoutDashboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
    </svg>
  ),
  Users: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Building: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" />
    </svg>
  ),
  FileText: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  Wallet: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  ),
  Calendar: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Bot: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
    </svg>
  ),
  Settings: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  ArrowUp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
    </svg>
  ),
};

interface NavItem {
  icon: React.ComponentType;
  label: string;
  to: string;
  badge?: number;
  badgeType?: 'urgent' | 'warning';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Supervision',
    items: [
      { icon: Icons.LayoutDashboard, label: 'Vue d\'ensemble', to: '/backoffice' },
      { icon: Icons.Users, label: 'Utilisateurs', to: '/backoffice/utilisateurs' },
      { icon: Icons.Building, label: 'Biens immobiliers', to: '/backoffice/biens' },
    ],
  },
  {
    title: 'Opérations',
    items: [
      { icon: Icons.FileText, label: 'Locations', to: '/backoffice/locations' },
      { icon: Icons.Wallet, label: 'Finances', to: '/backoffice/finances' },
      { icon: Icons.ArrowUp, label: 'Retraits', to: '/backoffice/retraits' },
      { icon: Icons.Calendar, label: 'Activité', to: '/backoffice/activite' },
    ],
  },
  {
    title: 'Système',
    items: [
      { icon: Icons.Bot, label: 'Intelligence IA', to: '/backoffice/ia' },
      { icon: Icons.Settings, label: 'Paramètres', to: '/backoffice/parametres' },
    ],
  },
];

export default function AdminSidebar() {
  const { profile } = useAuthContext();
  const name = profile?.full_name || 'Administrateur';
  const initials = name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <aside className={styles.sidebar}>
      {/* Logo */}
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <Icons.Shield />
          </div>
          <span className={styles.logoText}>Guin-e</span>
          <span className={styles.logoBadge}>Admin</span>
        </div>
      </div>

      {/* Admin profile */}
      <div className={styles.adminCard}>
        <div className={styles.adminAvatar}>{initials}</div>
        <div className={styles.adminInfo}>
          <div className={styles.adminName}>{name}</div>
          <div className={styles.adminRole}>Super Administrateur</div>
        </div>
      </div>

      {/* Navigation */}
      {navSections.map((section) => (
        <div key={section.title} className={styles.navSection}>
          <span className={styles.navSectionTitle}>{section.title}</span>
          {section.items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/backoffice'}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <item.icon />
              <span>{item.label}</span>
              {item.badge != null && item.badge > 0 && (
                <span className={`${styles.badge} ${item.badgeType === 'urgent' ? styles.urgent : item.badgeType === 'warning' ? styles.warning : ''}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      ))}

      {/* Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.systemStatus}>
          <div className={styles.statusDot} />
          <span>Système opérationnel</span>
        </div>
      </div>
    </aside>
  );
}
