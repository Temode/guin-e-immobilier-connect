import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import styles from './UserProfileMenu.module.css';

const UserProfileMenu = () => {
  const { user, profile, signOut, getDashboardByRole } = useAuthContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const name = profile?.full_name || user.user_metadata?.full_name || user.email || '';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url || null;
  const role = user.user_metadata?.role;

  const getInitials = (n: string) => {
    if (!n || n.includes('@')) return '?';
    return n.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const roleLabel = role === 'agent' ? 'Agent immobilier'
    : role === 'owner' ? 'Propriétaire'
    : role === 'currentTenant' ? 'Locataire'
    : 'Utilisateur';

  return (
    <div className={styles.profileMenu} ref={menuRef}>
      <button className={styles.avatarBtn} onClick={() => setOpen(!open)}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profil" className={styles.avatarImg} />
        ) : (
          <span className={styles.avatarInitials}>{getInitials(name)}</span>
        )}
      </button>

      {open && (
        <div className={styles.dropdown}>
          <div className={styles.dropdownHeader}>
            <div className={styles.dropdownAvatar}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profil" className={styles.avatarImg} />
              ) : (
                <span className={styles.avatarInitials}>{getInitials(name)}</span>
              )}
            </div>
            <div className={styles.dropdownInfo}>
              <span className={styles.dropdownName}>{name}</span>
              <span className={styles.dropdownRole}>{roleLabel}</span>
            </div>
          </div>

          <div className={styles.dropdownDivider} />

          <button
            className={styles.dropdownItem}
            onClick={() => {
              setOpen(false);
              const dashPath = getDashboardByRole(role);
              navigate(`${dashPath}/profil`);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width={18} height={18}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mon profil
          </button>

          <button
            className={`${styles.dropdownItem} ${styles.dropdownItemDanger}`}
            onClick={() => {
              setOpen(false);
              signOut();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} width={18} height={18}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Déconnexion
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProfileMenu;
