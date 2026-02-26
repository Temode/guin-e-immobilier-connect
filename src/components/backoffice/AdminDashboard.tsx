// @ts-nocheck
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

/* ─── Icons (inline) ─── */
const UsersIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const BuildingIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>;
const WalletIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>;
const FileTextIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>;
const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const ArrowUpIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}><polyline points="18 15 12 9 6 15" /></svg>;

interface KPIs {
  totalUsers: number;
  totalProperties: number;
  totalRentals: number;
  totalRevenue: number;
  pendingKyc: number;
  pendingVisits: number;
  roleBreakdown: Record<string, number>;
}

interface RecentUser {
  id: string;
  full_name: string;
  created_at: string;
  role: string;
}

interface RecentTransaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  created_at: string;
  payer_name: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState<KPIs>({
    totalUsers: 0, totalProperties: 0, totalRentals: 0, totalRevenue: 0,
    pendingKyc: 0, pendingVisits: 0, roleBreakdown: {},
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const [
        usersRes, rolesRes, propsRes, rentalsRes, transRes,
        kycRes, visitsRes, recentUsersRes, recentTxRes,
      ] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('user_roles').select('role'),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('rentals').select('id', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('transactions').select('amount, currency').eq('status', 'completed'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('kyc_status', 'pending'),
        supabase.from('visits').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('profiles').select('id, full_name, created_at').order('created_at', { ascending: false }).limit(5),
        supabase.from('transactions').select('id, amount, currency, type, status, created_at, payer_id').order('created_at', { ascending: false }).limit(5),
      ]);

      // Role breakdown
      const breakdown: Record<string, number> = {};
      (rolesRes.data || []).forEach((r: any) => {
        breakdown[r.role] = (breakdown[r.role] || 0) + 1;
      });

      // Revenue
      const revenue = (transRes.data || []).reduce((sum: number, t: any) => sum + (t.amount || 0), 0);

      setKpis({
        totalUsers: usersRes.count || 0,
        totalProperties: propsRes.count || 0,
        totalRentals: rentalsRes.count || 0,
        totalRevenue: revenue,
        pendingKyc: kycRes.count || 0,
        pendingVisits: visitsRes.count || 0,
        roleBreakdown: breakdown,
      });

      // Recent users with roles
      const users = (recentUsersRes.data || []).map((u: any) => {
        const role = (rolesRes.data || []).find((r: any) => r.user_id === u.id)?.role || 'locataire';
        return { ...u, role };
      });
      setRecentUsers(users);

      // Recent transactions with payer names
      const txData = recentTxRes.data || [];
      const payerIds = [...new Set(txData.map((t: any) => t.payer_id).filter(Boolean))];
      let payerMap: Record<string, string> = {};
      if (payerIds.length > 0) {
        const { data: payers } = await supabase.from('profiles').select('id, full_name').in('id', payerIds);
        (payers || []).forEach((p: any) => { payerMap[p.id] = p.full_name || 'Inconnu'; });
      }
      setRecentTransactions(txData.map((t: any) => ({
        ...t,
        payer_name: payerMap[t.payer_id] || 'Système',
      })));
    } catch (err) {
      console.error('[Admin] Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }

  function fmtCurrency(amount: number) {
    return amount.toLocaleString('fr-FR') + ' GNF';
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  function timeAgo(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}j`;
  }

  const kpiCards = [
    { label: 'Utilisateurs', value: kpis.totalUsers, icon: <UsersIcon />, color: 'green', trend: '+12%' },
    { label: 'Biens publiés', value: kpis.totalProperties, icon: <BuildingIcon />, color: 'blue', trend: '+5%' },
    { label: 'Locations actives', value: kpis.totalRentals, icon: <FileTextIcon />, color: 'gold', trend: '+8%' },
    { label: 'Revenus totaux', value: fmtCurrency(kpis.totalRevenue), icon: <WalletIcon />, color: 'green', trend: '+15%' },
  ];

  return (
    <>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Vue d'ensemble</h1>
          <span className={styles.topBarSubtitle}>
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input placeholder="Rechercher utilisateur, bien, transaction..." />
          </div>
        </div>
      </div>

      <div className={styles.pageContent}>
        {loading ? (
          <div className={styles.loading}>Chargement du tableau de bord...</div>
        ) : (
          <>
            {/* Alert banners */}
            {kpis.pendingKyc > 0 && (
              <div className={styles.alertBanner}>
                <div className={styles.alertIcon}>&#128100;</div>
                <div className={styles.alertContent}>
                  <strong>{kpis.pendingKyc} vérification(s) KYC en attente</strong>
                  <span>Des utilisateurs attendent la validation de leur identité</span>
                </div>
                <button className={styles.alertAction} onClick={() => navigate('/backoffice/utilisateurs')}>
                  Voir
                </button>
              </div>
            )}

            {/* KPI Cards */}
            <div className={styles.kpiGrid}>
              {kpiCards.map((kpi) => (
                <div key={kpi.label} className={styles.kpiCard}>
                  <div className={styles.kpiHeader}>
                    <div className={`${styles.kpiIconBox} ${styles[kpi.color]}`}>
                      {kpi.icon}
                    </div>
                    <span className={`${styles.kpiTrend} ${styles.up}`}>
                      <ArrowUpIcon /> {kpi.trend}
                    </span>
                  </div>
                  <div className={styles.kpiValue}>{kpi.value}</div>
                  <div className={styles.kpiLabel}>{kpi.label}</div>
                </div>
              ))}
            </div>

            {/* Role breakdown bar */}
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Répartition par rôle</h3>
              </div>
              <div style={{ padding: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {Object.entries(kpis.roleBreakdown).map(([role, count]) => (
                  <div key={role} style={{
                    flex: '1 1 120px',
                    padding: '14px 16px',
                    background: 'var(--color-neutral-50)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-neutral-200)',
                    textAlign: 'center',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'var(--color-neutral-900)',
                    }}>{count}</div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-neutral-500)',
                      textTransform: 'capitalize',
                    }}>{role === 'locataire' ? 'Locataires' : role === 'agent' ? 'Agents' : role === 'proprietaire' ? 'Propriétaires' : 'Admins'}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Two-column grid: Recent users + Recent transactions */}
            <div className={styles.gridTwo}>
              {/* Recent users */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Dernières inscriptions</h3>
                  <button className={styles.actionBtn} onClick={() => navigate('/backoffice/utilisateurs')}>Tout voir</button>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Utilisateur</th>
                      <th>Rôle</th>
                      <th>Inscrit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.length === 0 ? (
                      <tr><td colSpan={3} className={styles.emptyState}>Aucune inscription récente</td></tr>
                    ) : recentUsers.map((u) => (
                      <tr key={u.id}>
                        <td>
                          <div className={styles.userCell}>
                            <div className={styles.userCellAvatar}>
                              {(u.full_name || '?').slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className={styles.userCellName}>{u.full_name || 'Sans nom'}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`${styles.roleBadge} ${styles[u.role] || ''}`}>
                            {u.role}
                          </span>
                        </td>
                        <td style={{ color: 'var(--color-neutral-400)', fontSize: '0.75rem' }}>
                          {timeAgo(u.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Recent transactions */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Dernières transactions</h3>
                  <button className={styles.actionBtn} onClick={() => navigate('/backoffice/finances')}>Tout voir</button>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Payeur</th>
                      <th>Montant</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.length === 0 ? (
                      <tr><td colSpan={3} className={styles.emptyState}>Aucune transaction</td></tr>
                    ) : recentTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td>
                          <div className={styles.userCellName}>{tx.payer_name}</div>
                          <div className={styles.userCellEmail}>{tx.type}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{tx.amount?.toLocaleString('fr-FR')} {tx.currency || 'GNF'}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${tx.status === 'completed' ? styles.active : tx.status === 'pending' ? styles.pending : styles.suspended}`}>
                            {tx.status === 'completed' ? 'Complété' : tx.status === 'pending' ? 'En attente' : tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
