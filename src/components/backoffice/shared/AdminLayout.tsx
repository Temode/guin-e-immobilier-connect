import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import styles from './AdminLayout.module.css';

export default function AdminLayout() {
  return (
    <div className={styles.appLayout}>
      <AdminSidebar />
      <div className={styles.mainWrapper}>
        <Outlet />
      </div>
    </div>
  );
}
