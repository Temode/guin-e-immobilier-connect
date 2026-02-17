import { Outlet } from 'react-router-dom';
import AgentSidebar from './AgentSidebar';
import UserProfileMenu from '../../shared/UserProfileMenu';
import styles from './DashboardAgentLayout.module.css';

const DashboardAgentLayout = () => {
  return (
    <div className={styles.appLayout}>
      <AgentSidebar />
      <div className={styles.mainWrapper}>
        <div className={styles.topBarGlobal}>
          <UserProfileMenu />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardAgentLayout;
