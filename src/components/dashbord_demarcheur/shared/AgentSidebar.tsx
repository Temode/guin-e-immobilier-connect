import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  DashboardIcon,
  BuildingIcon,
  UsersIcon,
  CalendarIcon,
  CurrencyIcon,
  MessageIcon,
  SettingsIcon,
  StarIcon,
  SparklesIcon,
  BotIcon,
} from './AgentSidebarIcons';
import styles from './DashboardAgentLayout.module.css';
import { useAuthContext } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  badge?: number | string;
  badgeUrgent?: boolean;
  badgeGold?: boolean;
  dynamicBadgeKey?: string;
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
      { icon: BuildingIcon, label: 'Mes biens', to: '/dashbord-agent/mes-biens', dynamicBadgeKey: 'properties', badgeGold: true },
      { icon: UsersIcon, label: 'Mes clients', to: '/dashbord-agent/mes-clients' },
      { icon: CalendarIcon, label: 'Agenda & Visites', to: '/dashbord-agent/agenda' },
    ],
  },
  {
    title: 'Communication',
    items: [
      { icon: MessageIcon, label: 'Messages', to: '/dashbord-agent/messages', badge: 0, badgeUrgent: true },
      { icon: BotIcon, label: 'IA Assistant · ARIA', to: '/dashbord-agent/ia-chat' },
    ],
  },
  {
    title: 'Finances',
    items: [
      { icon: CurrencyIcon, label: 'Mes commissions', to: '/dashbord-agent/commissions' },
    ],
  },
  {
    title: 'Compte',
    items: [
      { icon: SettingsIcon, label: 'Paramètres & Profil', to: '/dashbord-agent/profil' },
    ],
  },
];

const AgentSidebar = () => {
  const { user, profile } = useAuthContext();
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [dbProfile, setDbProfile] = useState<any>(null);

  // Fetch profile data directly from DB for real-time sync
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('full_name, avatar_url, kyc_status')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setDbProfile(profileData);
        if (profileData.avatar_url) {
          setAvatarUrl(`${profileData.avatar_url}?t=${Date.now()}`);
        }
      }

      // Fetch property count
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);

      setPropertyCount(count || 0);
    };

    fetchData();

    // Subscribe to profile changes for real-time sync
    const channel = supabase
      .channel('sidebar-profile')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`,
      }, (payload) => {
        const updated = payload.new as any;
        setDbProfile(updated);
        if (updated.avatar_url) {
          setAvatarUrl(`${updated.avatar_url}?t=${Date.now()}`);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Re-fetch property count when navigating back to sidebar (properties might have changed)
  useEffect(() => {
    if (!user) return;
    const refetchCount = async () => {
      const { count } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('owner_id', user.id);
      setPropertyCount(count || 0);
    };

    // Refresh every time component re-renders (route change)
    refetchCount();
  }, [user]);

  const agentName = dbProfile?.full_name || profile?.full_name || user?.user_metadata?.full_name || user?.email || 'Agent';
  const isVerified = dbProfile?.kyc_status === 'verified';

  const getInitials = (name: string) => {
    if (!name || name.includes('@')) return '?';
    return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getBadge = (item: NavItem): number | string | undefined => {
    if (item.dynamicBadgeKey === 'properties') return propertyCount;
    return item.badge;
  };

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
          <div className={styles.agentAvatar}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
              />
            ) : (
              getInitials(agentName)
            )}
          </div>
          <div className={styles.agentInfo}>
            <h4 className={styles.agentName}>{agentName}</h4>
            {isVerified && (
              <span className={styles.agentCertifiedBadge}>
                <StarIcon filled />
                Agent Certifié
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className={styles.sidebarNav}>
        {navSections.map((section) => (
          <div key={section.title} className={styles.navSection}>
            <span className={styles.navSectionTitle}>{section.title}</span>
            {section.items.map((item) => {
              const badge = getBadge(item);
              return (
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
                  {badge != null && badge !== 0 && (
                    <span
                      className={`${styles.badge} ${item.badgeUrgent ? styles.urgent : ''} ${item.badgeGold ? styles.gold : ''}`}
                    >
                      {badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar Footer */}
      <div className={styles.sidebarFooter}>
        <div className={styles.premiumCard}>
          <div className={styles.premiumCardIcon}>
            <SparklesIcon />
          </div>
          <h4>Passez Pro</h4>
          <p>Commission réduite à 3-4%</p>
          <button className={`${styles.btn} ${styles.btnGold}`}>Voir les avantages</button>
        </div>
      </div>
    </aside>
  );
};

export default AgentSidebar;
