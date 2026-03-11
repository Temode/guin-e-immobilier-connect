// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

export default function AdminIA() {
  const [usageData, setUsageData] = useState<any[]>([]);
  const [totalConversations, setTotalConversations] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIAData();
  }, []);

  async function loadIAData() {
    try {
      const [usageRes, convsRes] = await Promise.all([
        supabase.from('ai_monthly_usage').select('*').order('month_year', { ascending: false }).limit(50),
        supabase.from('ai_conversations').select('id', { count: 'exact', head: true }),
      ]);

      const agentIds = [...new Set((usageRes.data || []).map((u: any) => u.agent_id).filter(Boolean))];
      let nameMap: Record<string, string> = {};
      if (agentIds.length > 0) {
        const { data: profiles } = await supabase.from('profiles').select('id, full_name').in('id', agentIds);
        (profiles || []).forEach((p: any) => { nameMap[p.id] = p.full_name || 'Agent'; });
      }

      setUsageData((usageRes.data || []).map((u: any) => ({ ...u, agent_name: nameMap[u.agent_id] || 'Agent' })));
      setTotalConversations(convsRes.count || 0);
    } catch (err) {
      console.error('[Admin] IA load error:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalFree = usageData.reduce((s: number, u: any) => s + (u.free_messages_count || 0), 0);
  const totalAdvanced = usageData.reduce((s: number, u: any) => s + (u.advanced_messages_count || 0), 0);
  const totalTokens = usageData.reduce((s: number, u: any) => s + (u.advanced_tokens_used || 0), 0);
  const uniqueAgents = [...new Set(usageData.map(u => u.agent_id))].length;

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Intelligence IA</h1>
          <span className={styles.topBarSubtitle}>Usage et performance d'ARIA</span>
        </div>
      </div>

      <div className={styles.pageContent}>
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{totalConversations.toLocaleString()}</div>
            <div className={styles.kpiLabel}>Messages IA total</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{totalFree + totalAdvanced}</div>
            <div className={styles.kpiLabel}>Requêtes ce mois</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{uniqueAgents}</div>
            <div className={styles.kpiLabel}>Agents utilisant ARIA</div>
          </div>
          <div className={styles.kpiCard}>
            <div className={styles.kpiValue}>{(totalTokens / 1000).toFixed(0)}K</div>
            <div className={styles.kpiLabel}>Tokens avancés consommés</div>
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Usage par agent</h3>
          </div>

          {loading ? <div className={styles.loading}>Chargement...</div> : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Mois</th>
                  <th>Messages gratuits</th>
                  <th>Messages avancés</th>
                  <th>Tokens utilisés</th>
                </tr>
              </thead>
              <tbody>
                {usageData.length === 0 ? (
                  <tr><td colSpan={5} className={styles.emptyState}>Aucune donnée d'usage</td></tr>
                ) : usageData.map((u) => (
                  <tr key={u.id}>
                    <td><div className={styles.userCellName}>{u.agent_name}</div></td>
                    <td style={{ fontSize: '0.75rem' }}>{u.month_year}</td>
                    <td style={{ textAlign: 'center' }}>{u.free_messages_count || 0}</td>
                    <td style={{ textAlign: 'center', fontWeight: 600 }}>{u.advanced_messages_count || 0}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--color-neutral-400)' }}>{(u.advanced_tokens_used || 0).toLocaleString()}</td>
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
