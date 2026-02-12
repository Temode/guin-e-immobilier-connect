import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DashboardIcon,
  BuildingIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyIcon,
  MessageIcon,
  NotificationIcon,
  UserIcon,
  StarIcon,
  SparklesIcon,
} from './AgentSidebarIcons';
import styles from './DashboardAgentLayout.module.css';

interface AgentInfo {
  name: string;
  initials: string;
  rating: number;
  reviewsCount: number;
  responseRate: number;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  badge?: number;
  badgeUrgent?: boolean;
  badgeGold?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Menu principal',
    items: [
      { icon: DashboardIcon, label: 'Tableau de bord', to: '/dashbord-agent' },
      { icon: BuildingIcon, label: 'Mes biens', to: '/dashbord-agent/mes-biens', badge: 12, badgeGold: true },
      { icon: UsersIcon, label: 'Mes clients', to: '/dashbord-agent/mes-clients', badge: 5, badgeUrgent: true },
      { icon: CalendarIcon, label: 'Agenda & Visites', to: '/dashbord-agent/agenda', badge: 3 },
    ],
  },
  {
    title: 'Finances',
    items: [
      { icon: CurrencyIcon, label: 'Commissions', to: '/dashbord-agent/commissions' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { icon: MessageIcon, label: 'Messages', to: '/dashbord-agent/messages', badge: 8, badgeUrgent: true },
      { icon: NotificationIcon, label: 'Notifications', to: '/dashbord-agent/notifications' },
    ],
  },
  {
    title: 'Compte',
    items: [
      { icon: UserIcon, label: 'Profil & Paramètres', to: '/dashbord-agent/profil' },
    ],
  },
];

const AgentSidebar = ({ agent }: { agent: AgentInfo }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <NavLink to="/dashbord-agent" className={styles.logo}>
          <div className={styles.logoIcon}>
            <HomeIcon />
          </div>
          <span className={styles.logoText}>
            Immo<span>GN</span>
          </span>
        </NavLink>
      </div>

      {/* Agent Profile Card */}
      <div className={styles.agentProfileCard}>
        <div className={styles.agentProfileHeader}>
          <div className={styles.agentAvatar}>{agent.initials}</div>
          <div className={styles.agentInfo}>
            <h4 className={styles.agentName}>{agent.name}</h4>
            <span className={styles.agentCertifiedBadge}>
              <StarIcon filled />
              Agent Certifié
            </span>
          </div>
        </div>
        <div className={styles.agentStats}>
          <div className={styles.agentStat}>
            <div className={styles.agentStatValue}>
              {agent.rating} <StarIcon filled />
            </div>
            <div className={styles.agentStatLabel}>{agent.reviewsCount} avis</div>
          </div>
          <div className={styles.agentStat}>
            <div className={styles.agentStatValue}>{agent.responseRate}%</div>
            <div className={styles.agentStatLabel}>Taux réponse</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebarNav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <span className={styles.navSectionTitle}>{section.title}</span>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/dashbord-agent'}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                <item.icon />
                {item.label}
                {item.badge && (
                  <span
                    className={`${styles.badge} ${item.badgeUrgent ? styles.urgent : ''} ${item.badgeGold ? styles.gold : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.premiumCard}>
          <div className={styles.premiumCardIcon}>
            <SparklesIcon />
          </div>
          <h4>Passez Premium</h4>
          <p>Boostez vos annonces et gagnez plus</p>
          <button className={`${styles.btn} ${styles.btnGold}`}>Découvrir l'offre</button>
        </div>
      </div>
    </aside>
  );
};

export default AgentSidebar;
