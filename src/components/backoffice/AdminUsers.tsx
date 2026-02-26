// @ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;

interface UserRow {
  id: string;
  full_name: string | null;
  phone: string | null;
  kyc_status: string | null;
  subscription_plan: string | null;
  is_active: boolean | null;
  created_at: string;
  role: string;
  email?: string;
}

const ROLE_FILTERS = ['all', 'locataire', 'agent', 'proprietaire', 'admin'] as const;
const KYC_FILTERS = ['all', 'pending', 'verified', 'rejected'] as const;

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [kycFilter, setKycFilter] = useState<string>('all');
  const [stats, setStats] = useState({ total: 0, active: 0, pendingKyc: 0, suspended: 0 });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Load profiles + roles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, phone, kyc_status, subscription_plan, is_active, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      const { data: roles } = await supabase.from('user_roles').select('user_id, role');

      const roleMap: Record<string, string> = {};
      (roles || []).forEach((r: any) => { roleMap[r.user_id] = r.role; });

      const merged: UserRow[] = (profiles || []).map((p: any) => ({
        ...p,
        role: roleMap[p.id] || 'locataire',
      }));

      setUsers(merged);

      // Stats
      setStats({
        total: merged.length,
        active: merged.filter(u => u.is_active !== false).length,
        pendingKyc: merged.filter(u => u.kyc_status === 'pending').length,
        suspended: merged.filter(u => u.is_active === false).length,
      });
    } catch (err) {
      console.error('[Admin] Users load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function toggleUserActive(userId: string, currentActive: boolean) {
    const newActive = !currentActive;
    await supabase.from('profiles').update({ is_active: newActive }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: newActive } : u));
  }

  async function updateKycStatus(userId: string, newStatus: string) {
    await supabase.from('profiles').update({ kyc_status: newStatus }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, kyc_status: newStatus } : u));
  }

  // Filtered users
  const filtered = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (kycFilter !== 'all' && u.kyc_status !== kycFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (u.full_name || '').toLowerCase().includes(q)
        || (u.phone || '').includes(q)
        || u.role.includes(q);
    }
    return true;
  });

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  const roleLabel = (r: string) =>
    r === 'locataire' ? 'Locataire' : r === 'agent' ? 'Agent' : r === 'proprietaire' ? 'Propriétaire' : 'Admin';

  const kycLabel = (k: string | null) =>
    k === 'verified' ? 'Vérifié' : k === 'pending' ? 'En attente' : k === 'rejected' ? 'Rejeté' : 'Non soumis';

  return (
    <>
      {/* Top bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Gestion des utilisateurs</h1>
          <span className={styles.topBarSubtitle}>{stats.total} utilisateur(s) enregistré(s)</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input
              placeholder="Rechercher par nom, téléphone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.pageContent}>
        {/* Stats cards */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{stats.total}</div>
            <div className={styles.kpiLabel}>Total utilisateurs</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-success-500)' }}>{stats.active}</div>
            <div className={styles.kpiLabel}>Actifs</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-warning-500)' }}>{stats.pendingKyc}</div>
            <div className={styles.kpiLabel}>KYC en attente</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-error-500)' }}>{stats.suspended}</div>
            <div className={styles.kpiLabel}>Suspendus</div>
          </div>
        </div>

        {/* Users table */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Tous les utilisateurs</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>
              {filtered.length} résultat(s)
            </span>
          </div>

          {/* Filters */}
          <div className={styles.filterBar}>
            <span style={{ fontSize: '0.688rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginRight: 4 }}>Rôle :</span>
            {ROLE_FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterChip} ${roleFilter === f ? styles.active : ''}`}
                onClick={() => setRoleFilter(f)}
              >
                {f === 'all' ? 'Tous' : roleLabel(f)}
              </button>
            ))}
            <span style={{ fontSize: '0.688rem', fontWeight: 600, color: 'var(--color-neutral-500)', marginLeft: 12, marginRight: 4 }}>KYC :</span>
            {KYC_FILTERS.map(f => (
              <button
                key={f}
                className={`${styles.filterChip} ${kycFilter === f ? styles.active : ''}`}
                onClick={() => setKycFilter(f)}
              >
                {f === 'all' ? 'Tous' : kycLabel(f)}
              </button>
            ))}
          </div>

          {/* Table */}
          {loading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle</th>
                  <th>KYC</th>
                  <th>Plan</th>
                  <th>Statut</th>
                  <th>Inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyState}>Aucun utilisateur trouvé</td></tr>
                ) : filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userCellAvatar}>
                          {(u.full_name || '?').slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className={styles.userCellName}>{u.full_name || 'Sans nom'}</div>
                          <div className={styles.userCellEmail}>{u.phone || 'Pas de téléphone'}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.roleBadge} ${styles[u.role] || ''}`}>
                        {roleLabel(u.role)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        u.kyc_status === 'verified' ? styles.verified
                        : u.kyc_status === 'pending' ? styles.pending
                        : styles.suspended
                      }`}>
                        {kycLabel(u.kyc_status)}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontSize: '0.75rem' }}>
                      {u.subscription_plan || 'Gratuit'}
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${u.is_active !== false ? styles.active : styles.suspended}`}>
                        {u.is_active !== false ? 'Actif' : 'Suspendu'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>
                      {fmtDate(u.created_at)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {u.kyc_status === 'pending' && (
                          <>
                            <button className={`${styles.actionBtn} ${styles.primary}`} onClick={() => updateKycStatus(u.id, 'verified')}>
                              Valider
                            </button>
                            <button className={styles.actionBtn} onClick={() => updateKycStatus(u.id, 'rejected')}>
                              Refuser
                            </button>
                          </>
                        )}
                        <button
                          className={styles.actionBtn}
                          onClick={() => toggleUserActive(u.id, u.is_active !== false)}
                        >
                          {u.is_active !== false ? 'Suspendre' : 'Réactiver'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination hint */}
          {filtered.length > 0 && (
            <div className={styles.pagination}>
              <span className={styles.paginationInfo}>
                Affichage de {Math.min(filtered.length, 100)} sur {stats.total}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
