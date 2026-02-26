// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

const SearchIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;

export default function AdminFinances() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'transactions' | 'wallets'>('transactions');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [txRes, walletsRes] = await Promise.all([
        supabase.from('transactions').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('wallets').select('*').order('updated_at', { ascending: false }).limit(100),
      ]);

      // Get payer/receiver names
      const allIds = [...new Set((txRes.data || []).flatMap((t: any) => [t.payer_id, t.receiver_id].filter(Boolean)))];
      const walletUserIds = [...new Set((walletsRes.data || []).map((w: any) => w.user_id).filter(Boolean))];
      const combinedIds = [...new Set([...allIds, ...walletUserIds])];

      let nameMap: Record<string, string> = {};
      if (combinedIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', combinedIds);
        (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || 'Inconnu'; });
      }

      setTransactions((txRes.data || []).map((t: any) => ({
        ...t,
        payer_name: nameMap[t.payer_id] || 'Système',
        receiver_name: nameMap[t.receiver_id] || 'Plateforme',
      })));

      setWallets((walletsRes.data || []).map((w: any) => ({
        ...w,
        user_name: nameMap[w.user_id] || 'Inconnu',
      })));
    } catch (err) {
      console.error('[Admin] Finances load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalRevenue = transactions.filter(t => t.status === 'completed').reduce((s: number, t: any) => s + (t.amount || 0), 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((s: number, t: any) => s + (t.amount || 0), 0);
  const totalWalletBalance = wallets.reduce((s: number, w: any) => s + (w.balance || 0), 0);
  const filteredTx = transactions.filter(t => statusFilter === 'all' || t.status === statusFilter);

  const statusLabel = (s: string) => s === 'completed' ? 'Complété' : s === 'pending' ? 'En attente' : s === 'failed' ? 'Échoué' : s;

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Finances</h1>
          <span className={styles.topBarSubtitle}>Transactions et portefeuilles</span>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{totalRevenue.toLocaleString('fr-FR')} GNF</div>
            <div className={styles.kpiLabel}>Revenus totaux</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue} style={{ color: 'var(--color-warning-500)' }}>{pendingAmount.toLocaleString('fr-FR')} GNF</div>
            <div className={styles.kpiLabel}>En attente</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{transactions.length}</div>
            <div className={styles.kpiLabel}>Total transactions</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{totalWalletBalance.toLocaleString('fr-FR')} GNF</div>
            <div className={styles.kpiLabel}>Solde total wallets</div>
          </div>
        </div>

        {/* Tab switch */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`${styles.filterChip} ${tab === 'transactions' ? styles.active : ''}`} onClick={() => setTab('transactions')}>Transactions</button>
              <button className={`${styles.filterChip} ${tab === 'wallets' ? styles.active : ''}`} onClick={() => setTab('wallets')}>Portefeuilles</button>
            </div>
          </div>

          {tab === 'transactions' && (
            <>
              <div className={styles.filterBar}>
                {['all', 'completed', 'pending', 'failed'].map(f => (
                  <button key={f} className={`${styles.filterChip} ${statusFilter === f ? styles.active : ''}`} onClick={() => setStatusFilter(f)}>
                    {f === 'all' ? 'Tous' : statusLabel(f)}
                  </button>
                ))}
              </div>
              {loading ? <div className={styles.loading}>Chargement...</div> : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Payeur</th>
                      <th>Destinataire</th>
                      <th>Montant</th>
                      <th>Type</th>
                      <th>Méthode</th>
                      <th>Statut</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTx.length === 0 ? (
                      <tr><td colSpan={7} className={styles.emptyState}>Aucune transaction</td></tr>
                    ) : filteredTx.map((t) => (
                      <tr key={t.id}>
                        <td style={{ fontSize: '0.75rem' }}>{t.payer_name}</td>
                        <td style={{ fontSize: '0.75rem' }}>{t.receiver_name}</td>
                        <td style={{ fontWeight: 600 }}>{t.amount?.toLocaleString('fr-FR')} {t.currency || 'GNF'}</td>
                        <td style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{t.type || '—'}</td>
                        <td style={{ fontSize: '0.75rem' }}>{t.payment_method || '—'}</td>
                        <td>
                          <span className={`${styles.statusBadge} ${t.status === 'completed' ? styles.active : t.status === 'pending' ? styles.pending : styles.suspended}`}>
                            {statusLabel(t.status)}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>
                          {new Date(t.created_at).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {tab === 'wallets' && (
            loading ? <div className={styles.loading}>Chargement...</div> : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Solde</th>
                    <th>Devise</th>
                    <th>Dernière mise à jour</th>
                  </tr>
                </thead>
                <tbody>
                  {wallets.length === 0 ? (
                    <tr><td colSpan={4} className={styles.emptyState}>Aucun portefeuille</td></tr>
                  ) : wallets.map((w) => (
                    <tr key={w.id}>
                      <td><div className={styles.userCellName}>{w.user_name}</div></td>
                      <td style={{ fontWeight: 600 }}>{w.balance?.toLocaleString('fr-FR')}</td>
                      <td style={{ fontSize: '0.75rem' }}>{w.currency || 'GNF'}</td>
                      <td style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>
                        {w.updated_at ? new Date(w.updated_at).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}
        </div>
      </div>
    </>
  );
}
