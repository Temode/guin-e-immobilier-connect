import { Outlet } from 'react-router-dom';
import AgentSidebar from './AgentSidebar';
import styles from './DashboardAgentLayout.module.css';

const agentData = {
  name: 'Abdoulaye Diallo',
  initials: 'AD',
  rating: 4.8,
  reviewsCount: 47,
  responseRate: 89,
};

const DashboardAgentLayout = () => {
  return (
    <div className={styles.appLayout}>
      <AgentSidebar agent={agentData} />
      <div className={styles.mainWrapper}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardAgentLayout;
