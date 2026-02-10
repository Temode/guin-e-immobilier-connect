import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './DashboardLocataireLayout.module.css';

const mockUser = {
  name: 'Mamadou Bah',
  role: 'Locataire',
  verified: true,
};

const DashboardLocataireLayout = () => {
  return (
    <div className={styles.appLayout}>
      <Sidebar user={mockUser} />
      <div className={styles.mainWrapper}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLocataireLayout;
