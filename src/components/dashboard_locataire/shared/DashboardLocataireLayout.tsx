import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import UserProfileMenu from '../../shared/UserProfileMenu';
import styles from './DashboardLocataireLayout.module.css';
import { useAuthContext } from '@/context/AuthContext';

const DashboardLocataireLayout = () => {
  const { profile, user } = useAuthContext();

  const sidebarUser = {
    name: profile?.full_name || user?.email || 'Utilisateur',
    role: 'Locataire',
    verified: profile?.kyc_status === 'verified',
  };

  return (
    <div className={styles.appLayout}>
      <Sidebar user={sidebarUser} />
      <div className={styles.mainWrapper}>
        <div className={styles.topBarGlobal}>
          <UserProfileMenu />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLocataireLayout;
