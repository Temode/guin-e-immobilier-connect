// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

export default function AdminActivity() {
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadActivity();
  }, []);

  async function loadActivity() {
    try {
      const { data } = await supabase
        .from('visits')
        .select('id, lead_name, lead_phone, type, status, scheduled_at, ai_prospect_score, agent_id, address, created_at')
        .order('scheduled_at', { ascending: false })
        .limit(100);

      const agentIds = [...new Set((data || []).map((v: any) => v.agent_id).filter(Boolean))];
      let nameMap: Record<string, string> = {};
      if (agentIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', agentIds);
        (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || 'Agent'; });
      }

      setVisits((data || []).map((v: any) => ({ ...v, agent_name: nameMap[v.agent_id] || '—' })));
    } catch (err) {
      console.error('[Admin] Activity load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = visits.filter(v => typeFilter === 'all' || v.type === typeFilter);
  const typeLabel = (t: string) =>
    t === 'visit' ? 'Visite' : t === 'contre-visite' ? 'Contre-visite' : t === 'signature' ? 'Signature' : t === 'etat-lieux' ? 'État des lieux' : t;
  const statusLabel = (s: string) =>
    s === 'confirmed' ? 'Confirmé' : s === 'pending' ? 'En attente' : s === 'completed' ? 'Terminé' : s === 'cancelled' ? 'Annulé' : s;
  const scoreIcon = (s: string) => s === 'hot' ? '🔥' : s === 'warm' ? '🟡' : s === 'cold' ? '❄️' : '—';

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Activité</h1>
          <span className={styles.topBarSubtitle}>Visites, prospects et rendez-vous</span>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{visits.length}</div>
            <div className={styles.kpiLabel}>Total visites</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-warning-500)' }}>{visits.filter(v => v.status === 'pending').length}</div>
            <div className={styles.kpiLabel}>En attente</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-success-500)' }}>{visits.filter(v => v.status === 'completed').length}</div>
            <div className={styles.kpiLabel}>Terminées</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>🔥 {visits.filter(v => v.ai_prospect_score === 'hot').length}</div>
            <div className={styles.kpiLabel}>Prospects chauds</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Toutes les visites</h3>
          </div>
          <div className={styles.filterBar}>
            {['all', 'visit', 'contre-visite', 'signature', 'etat-lieux'].map(f => (
              <button key={f} className={`${styles.filterChip} ${typeFilter === f ? styles.active : ''}`} onClick={() => setTypeFilter(f)}>
                {f === 'all' ? 'Tous' : typeLabel(f)}
              </button>
            ))}
          </div>

          {loading ? <div className={styles.loading}>Chargement...</div> : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Prospect</th>
                  <th>Agent</th>
                  <th>Type</th>
                  <th>Date prévue</th>
                  <th>Adresse</th>
                  <th>Score IA</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className={styles.emptyState}>Aucune visite trouvée</td></tr>
                ) : filtered.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div className={styles.userCellName}>{v.lead_name || 'Inconnu'}</div>
                      <div className={styles.userCellEmail}>{v.lead_phone || ''}</div>
                    </td>
                    <td style={{ fontSize: '0.75rem' }}>{v.agent_name}</td>
                    <td><span className={styles.roleBadge}>{typeLabel(v.type)}</span></td>
                    <td style={{ fontSize: '0.75rem' }}>
                      {v.scheduled_at ? new Date(v.scheduled_at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td style={{ fontSize: '0.75rem', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.address || '—'}</td>
                    <td style={{ textAlign: 'center' }}>{scoreIcon(v.ai_prospect_score)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        v.status === 'confirmed' || v.status === 'completed' ? styles.active
                        : v.status === 'pending' ? styles.pending
                        : styles.suspended
                      }`}>
                        {statusLabel(v.status)}
                      </span>
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
