// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import styles from './shared/AdminLayout.module.css';

const TABS = [
  { key: 'general', label: 'Général' },
  { key: 'plans', label: 'Plans & Tarifs' },
  { key: 'notifications', label: 'Notifications' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function AdminSettings() {
  const [tab, setTab] = useState<TabKey>('general');
  const [loading, setLoading] = useState(true);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalRentals: 0,
    dbSize: '—',
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const [usersRes, propsRes, rentalsRes] = await Promise.all([
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('rentals').select('id', { count: 'exact', head: true }),
      ]);

      setPlatformStats({
        totalUsers: usersRes.count || 0,
        totalProperties: propsRes.count || 0,
        totalRentals: rentalsRes.count || 0,
        dbSize: '—',
      });
    } catch (err) {
      console.error('[Admin] Settings load error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.topBarTitle}>Paramètres</h1>
          <span className={styles.topBarSubtitle}>Configuration de la plateforme</span>
        </div>
      </div>

      <div className={styles.pageContent}>
        {/* Tabs */}
        <div className={styles.filterBar} style={{ background: '#fff', borderRadius: '16px', marginBottom: 24, border: '1px solid var(--color-neutral-200, #E2E8F0)' }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.filterChip} ${tab === t.key ? styles.active : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className={styles.loading}>Chargement...</div>
        ) : (
          <>
            {/* ─── General tab ─── */}
            {tab === 'general' && (
              <>
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Informations de la plateforme</h3>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-neutral-500)', display: 'block', marginBottom: 6 }}>
                          Nom de la plateforme
                        </label>
                        <div style={{ padding: '10px 14px', background: 'var(--color-neutral-50, #F8FAFC)', border: '1px solid var(--color-neutral-200, #E2E8F0)', borderRadius: 12, fontSize: '0.875rem', color: 'var(--color-neutral-800)' }}>
                          Guinée Immobilier Connect
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-neutral-500)', display: 'block', marginBottom: 6 }}>
                          Version
                        </label>
                        <div style={{ padding: '10px 14px', background: 'var(--color-neutral-50, #F8FAFC)', border: '1px solid var(--color-neutral-200, #E2E8F0)', borderRadius: 12, fontSize: '0.875rem', color: 'var(--color-neutral-800)' }}>
                          v2.0.0
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Statistiques système</h3>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div className={styles.kpiGrid}>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiValue}>{platformStats.totalUsers}</div>
                        <div className={styles.kpiLabel}>Utilisateurs total</div>
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiValue}>{platformStats.totalProperties}</div>
                        <div className={styles.kpiLabel}>Biens enregistrés</div>
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiValue}>{platformStats.totalRentals}</div>
                        <div className={styles.kpiLabel}>Contrats de location</div>
                      </div>
                      <div className={styles.kpiCard}>
                        <div className={styles.kpiValue}>{platformStats.dbSize}</div>
                        <div className={styles.kpiLabel}>Taille base de données</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ─── Plans & Pricing tab ─── */}
            {tab === 'plans' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Plans disponibles</h3>
                </div>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Limite biens</th>
                      <th>Messages IA</th>
                      <th>IA avancée</th>
                      <th>Prix</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><span className={styles.userCellName}>Gratuit</span></td>
                      <td>5 biens</td>
                      <td>20 / mois</td>
                      <td><span className={`${styles.statusBadge} ${styles.suspended}`}>Non</span></td>
                      <td style={{ fontWeight: 600 }}>0 GNF</td>
                    </tr>
                    <tr>
                      <td><span className={styles.userCellName}>Pro</span></td>
                      <td>50 biens</td>
                      <td>200 / mois</td>
                      <td><span className={`${styles.statusBadge} ${styles.active}`}>Oui</span></td>
                      <td style={{ fontWeight: 600 }}>500 000 GNF</td>
                    </tr>
                    <tr>
                      <td><span className={styles.userCellName}>Entreprise</span></td>
                      <td>Illimité</td>
                      <td>Illimité</td>
                      <td><span className={`${styles.statusBadge} ${styles.active}`}>Oui</span></td>
                      <td style={{ fontWeight: 600 }}>1 500 000 GNF</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ─── Notifications tab ─── */}
            {tab === 'notifications' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Préférences de notification</h3>
                </div>
                <div style={{ padding: '20px' }}>
                  {[
                    { label: 'Nouveau utilisateur inscrit', desc: 'Recevoir une alerte à chaque inscription' },
                    { label: 'Demande KYC en attente', desc: 'Alerte quand un agent soumet ses documents' },
                    { label: 'Transaction suspecte', desc: 'Alerte pour montants inhabituels' },
                    { label: 'Rapport IA hebdomadaire', desc: 'Résumé automatique par ARIA chaque lundi' },
                  ].map((notif) => (
                    <div
                      key={notif.label}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 0',
                        borderBottom: '1px solid var(--color-neutral-100, #F1F5F9)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-neutral-800)' }}>
                          {notif.label}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-neutral-500)', marginTop: 2 }}>
                          {notif.desc}
                        </div>
                      </div>
                      <div
                        style={{
                          width: 40,
                          height: 22,
                          borderRadius: 11,
                          background: 'var(--color-primary-500, #10B981)',
                          position: 'relative',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: '50%',
                            background: '#fff',
                            position: 'absolute',
                            top: 2,
                            right: 2,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
