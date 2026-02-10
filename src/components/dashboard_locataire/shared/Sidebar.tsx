import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DashboardIcon,
  PaymentIcon,
  DocumentIcon,
  MessageIcon,
  NotificationIcon,
  SearchIcon,
  VerifiedBadgeIcon,
} from './SidebarIcons';
import styles from './DashboardLocataireLayout.module.css';

interface SidebarUser {
  name: string;
  role: string;
  verified?: boolean;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  badge?: number;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { icon: DashboardIcon, label: 'Tableau de bord', to: '/dashboard-locataire' },
      { icon: HomeIcon, label: 'Mon logement', to: '/dashboard-locataire/mon-logement' },
      { icon: PaymentIcon, label: 'Mes paiements', to: '/dashboard-locataire/mes-paiements' },
      { icon: DocumentIcon, label: 'Documents', to: '/dashboard-locataire/documents' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { icon: MessageIcon, label: 'Messages', to: '/dashboard-locataire/messages', badge: 2 },
      { icon: NotificationIcon, label: 'Notifications', to: '/dashboard-locataire/notifications', badge: 3 },
    ],
  },
  {
    title: 'Explorer',
    items: [
      { icon: SearchIcon, label: 'Rechercher un bien', to: '/dashboard-locataire/recherche' },
    ],
  },
];

const getInitials = (name: string) => {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
};

const Sidebar = ({ user }: { user: SidebarUser }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <NavLink to="/dashboard-locataire" className={styles.logo}>
          <div className={styles.logoIcon}>
            <HomeIcon />
          </div>
          <span className={styles.logoText}>
            Immo<span>GN</span>
          </span>
        </NavLink>
      </div>

      <nav className={styles.sidebarNav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <span className={styles.navSectionTitle}>{section.title}</span>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashboard-locataire'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                <item.icon />
                {item.label}
                {item.badge && <span className={styles.navLinkBadge}>{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className={styles.sidebarUser}>
        <NavLink
          to="/dashboard-locataire/profil"
          className={({ isActive }) =>
            `${styles.userCard} ${isActive ? styles.userCardActive : ''}`
          }
        >
          <div className={styles.userAvatar}>{getInitials(user.name)}</div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userRole}>
              {user.role}
              {user.verified && (
                <span className={styles.verifiedBadge}>
                  <VerifiedBadgeIcon />
                  Vérifié
                </span>
              )}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
