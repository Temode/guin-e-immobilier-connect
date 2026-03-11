// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;

interface PropertyRow {
  id: string;
  title: string;
  type: string;
  transaction_type: string;
  price: number | null;
  currency: string;
  city: string | null;
  status: string;
  verified: boolean | null;
  created_at: string;
  owner_name: string;
}

const STATUS_FILTERS = ['all', 'available', 'rented', 'draft'] as const;

export default function AdminProperties() {
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      const { data } = await supabase
        .from('properties')
        .select('id, title, type, transaction_type, price, currency, city, status, verified, created_at, owner_id')
        .order('created_at', { ascending: false })
        .limit(100);

      const ownerIds = [...new Set((data || []).map((p: any) => p.owner_id).filter(Boolean))];
      let ownerMap: Record<string, string> = {};
      if (ownerIds.length > 0) {
        const { data: owners } = await supabase.from('profiles').select('id, full_name').in('id', ownerIds);
        (owners || []).forEach((o: any) => { ownerMap[o.id] = o.full_name || 'Inconnu'; });
      }

      setProperties((data || []).map((p: any) => ({
        ...p,
        owner_name: ownerMap[p.owner_id] || 'Inconnu',
      })));
    } catch (err) {
      console.error('[Admin] Properties load error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function toggleVerified(id: string, current: boolean) {
    await supabase.from('properties').update({ verified: !current }).eq('id', id);
    setProperties(prev => prev.map(p => p.id === id ? { ...p, verified: !current } : p));
  }

  const filtered = properties.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title?.toLowerCase().includes(q) || p.city?.toLowerCase().includes(q) || p.owner_name.toLowerCase().includes(q);
    }
    return true;
  });

  const statusLabel = (s: string) =>
    s === 'available' ? 'Disponible' : s === 'rented' ? 'Loué' : s === 'draft' ? 'Brouillon' : s;

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Biens immobiliers</h1>
          <span className={styles.topBarSubtitle}>{properties.length} bien(s) enregistré(s)</span>
        </div>
        <div className={styles.topBarRight}>
          <div className={styles.searchBox}>
            <SearchIcon />
            <input placeholder="Rechercher un bien..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{properties.length}</div>
            <div className={styles.kpiLabel}>Total biens</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-success-500)' }}>{properties.filter(p => p.status === 'available').length}</div>
            <div className={styles.kpiLabel}>Disponibles</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-info-500)' }}>{properties.filter(p => p.status === 'rented').length}</div>
            <div className={styles.kpiLabel}>Loués</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-warning-500)' }}>{properties.filter(p => !p.verified).length}</div>
            <div className={styles.kpiLabel}>Non vérifiés</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Tous les biens</h3>
          </div>
          <div className={styles.filterBar}>
            {STATUS_FILTERS.map(f => (
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
                  <th>Type</th>
                  <th>Prix</th>
                  <th>Ville</th>
                  <th>Propriétaire</th>
                  <th>Statut</th>
                  <th>Vérifié</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className={styles.emptyState}>Aucun bien trouvé</td></tr>
                ) : filtered.map((p) => (
                  <tr key={p.id}>
                    <td><div className={styles.userCellName}>{p.title}</div></td>
                    <td style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{p.type}</td>
                    <td style={{ fontWeight: 600 }}>{p.price?.toLocaleString('fr-FR')} {p.currency || 'GNF'}</td>
                    <td style={{ fontSize: '0.75rem' }}>{p.city || '—'}</td>
                    <td style={{ fontSize: '0.75rem' }}>{p.owner_name}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${p.status === 'available' ? styles.active : p.status === 'rented' ? styles.verified : styles.pending}`}>
                        {statusLabel(p.status)}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${p.verified ? styles.active : styles.pending}`}>
                        {p.verified ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td>
                      <button className={`${styles.actionBtn} ${!p.verified ? styles.primary : ''}`} onClick={() => toggleVerified(p.id, !!p.verified)}>
                        {p.verified ? 'Retirer' : 'Vérifier'}
                      </button>
                    </td>
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
