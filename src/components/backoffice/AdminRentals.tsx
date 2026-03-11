// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;

export default function AdminRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRentals();
  }, []);

  async function loadRentals() {
    try {
      const { data } = await supabase
        .from('rentals')
        .select('id, rent_amount, currency, payment_method, start_date, end_date, status, agent_commission_percent, property_id, tenant_id, owner_id, agent_id, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      // Get names
      const allIds = [...new Set((data || []).flatMap((r: any) => [r.tenant_id, r.owner_id, r.agent_id].filter(Boolean)))];
      let nameMap: Record<string, string> = {};
      if (allIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', allIds);
        (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || 'Inconnu'; });
      }

      // Get property titles
      const propIds = [...new Set((data || []).map((r: any) => r.property_id).filter(Boolean))];
      let propMap: Record<string, string> = {};
      if (propIds.length > 0) {
        const { data: props } = await supabase.from('properties').select('id, title').in('id', propIds);
        (props || []).forEach((p: any) => { propMap[p.id] = p.title || 'Bien'; });
      }

      setRentals((data || []).map((r: any) => ({
        ...r,
        tenant_name: nameMap[r.tenant_id] || '—',
        owner_name: nameMap[r.owner_id] || '—',
        agent_name: nameMap[r.agent_id] || '—',
        property_title: propMap[r.property_id] || '—',
      })));
    } catch (err) {
      console.error('[Admin] Rentals load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = rentals.filter(r => statusFilter === 'all' || r.status === statusFilter);
  const statusLabel = (s: string) => s === 'active' ? 'Active' : s === 'terminated' ? 'Terminée' : s === 'pending' ? 'En attente' : s;

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Locations</h1>
          <span className={styles.topBarSubtitle}>{rentals.length} contrat(s) de location</span>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{rentals.length}</div>
            <div className={styles.kpiLabel}>Total locations</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-success-500)' }}>{rentals.filter(r => r.status === 'active').length}</div>
            <div className={styles.kpiLabel}>Actives</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-warning-500)' }}>{rentals.filter(r => r.status === 'pending').length}</div>
            <div className={styles.kpiLabel}>En attente</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>
              {rentals.filter(r => r.status === 'active').reduce((s: number, r: any) => s + (r.rent_amount || 0), 0).toLocaleString('fr-FR')} GNF
            </div>
            <div className={styles.kpiLabel}>Loyers mensuels actifs</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Contrats de location</h3>
          </div>
          <div className={styles.filterBar}>
            {['all', 'active', 'pending', 'terminated'].map(f => (
              <button key={f} className={`${styles.filterChip} ${statusFilter === f ? styles.active : ''}`} onClick={() => setStatusFilter(f)}>
                {f === 'all' ? 'Tous' : statusLabel(f)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className={styles.loading}>Chargement...</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Bien</th>
                  <th>Locataire</th>
                  <th>Propriétaire</th>
                  <th>Agent</th>
                  <th>Loyer</th>
                  <th>Commission</th>
                  <th>Statut</th>
                  <th>Début</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className={styles.emptyState}>Aucune location trouvée</td></tr>
                ) : filtered.map((r) => (
                  <tr key={r.id}>
                    <td><div className={styles.userCellName}>{r.property_title}</div></td>
                    <td style={{ fontSize: '0.75rem' }}>{r.tenant_name}</td>
                    <td style={{ fontSize: '0.75rem' }}>{r.owner_name}</td>
                    <td style={{ fontSize: '0.75rem' }}>{r.agent_name}</td>
                    <td style={{ fontWeight: 600 }}>{r.rent_amount?.toLocaleString('fr-FR')} {r.currency || 'GNF'}</td>
                    <td style={{ fontSize: '0.75rem' }}>{r.agent_commission_percent || 0}%</td>
                    <td>
                      <span className={`${styles.statusBadge} ${r.status === 'active' ? styles.active : r.status === 'pending' ? styles.pending : styles.suspended}`}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>{r.start_date || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
