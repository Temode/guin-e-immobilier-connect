import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { getAgentRentals } from '@/services/rentalService';
import { getOrCreateWallet, getUserTransactions, getPaymentStats, formatAmount, getPaymentMethodInfo, getTransactionStatusInfo, type WalletData, type TransactionData } from '@/services/paymentService';
import styles from './AgentCommissions.module.css';

/* ==========================================
   ICONS COMPONENTS
========================================== */
const HomeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const BuildingIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const HelpIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CreditCardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const BadgeCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ChartIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const ArrowUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const ArrowDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const LoaderIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => (
  <header className={styles.topBar}>
    <div className={styles.topBarLeft}>
      <div className={styles.pageContext}>
        <span className={styles.pageDate}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <h1 className={styles.pageTitle}>Mes commissions</h1>
      </div>
    </div>
    <div className={styles.topBarRight}>
      <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
        <DownloadIcon />Exporter
      </button>
      <button className={styles.iconBtn}><HelpIcon /></button>
    </div>
  </header>
);

/* ==========================================
   BALANCE HERO COMPONENT
========================================== */
const BalanceHero = ({ balance, currency }: { balance: number; currency: string }) => (
  <div className={styles.balanceHero}>
    <div className={styles.balanceHeroContent}>
      <div className={styles.balanceHeroTop}>
        <div>
          <p className={styles.balanceLabel}><CreditCardIcon />Solde disponible</p>
          <h2 className={styles.balanceAmount}>{formatAmount(balance)} {currency}</h2>
        </div>
        <div className={styles.balancePlan}><BadgeCheckIcon />Plan Basic • 5% commission</div>
      </div>
      <div className={styles.balanceSimulation}>
        <p className={styles.simulationTitle}>Simulation de retrait total</p>
        <div className={styles.simulationRow}>
          <span className={styles.label}>Montant disponible</span>
          <span className={styles.value}>{formatAmount(balance)} {currency}</span>
        </div>
        <div className={styles.simulationRow}>
          <span className={styles.label}>Commission plateforme (5%)</span>
          <span className={`${styles.value} ${styles.negative}`}>-{formatAmount(Math.round(balance * 0.05))} {currency}</span>
        </div>
        <div className={`${styles.simulationRow} ${styles.total}`}>
          <span className={styles.label}>Vous recevrez</span>
          <span className={styles.value}>{formatAmount(Math.round(balance * 0.95))} {currency}</span>
        </div>
      </div>
    </div>
  </div>
);

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }: { stats: { totalReceived: number; completedCount: number; pendingCount: number; failedCount: number; currency: string } }) => {
  const cards = [
    { icon: CurrencyIcon, value: `+${formatAmount(stats.totalReceived)} ${stats.currency}`, label: 'Revenus totaux', variant: 'success' },
    { icon: ChartIcon, value: String(stats.completedCount), label: 'Paiements reçus', variant: 'info' },
    { icon: ClockIcon, value: String(stats.pendingCount), label: 'En attente', variant: 'warning' },
    { icon: ExclamationIcon, value: String(stats.failedCount), label: 'Échoués', variant: 'error' },
  ];

  return (
    <div className={styles.statsGrid}>
      {cards.map((stat, index) => (
        <div key={index} className={styles.statCard} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
          <div className={styles.statCardHeader}>
            <div className={`${styles.statCardIcon} ${styles[stat.variant]}`}><stat.icon /></div>
          </div>
          <div className={styles.statCardValue}>{stat.value}</div>
          <div className={styles.statCardLabel}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ==========================================
   TRANSACTION HISTORY COMPONENT
========================================== */
const TransactionHistory = ({ transactions }: { transactions: TransactionData[] }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const filters = [
    { id: 'all', label: 'Tout' },
    { id: 'income', label: 'Entrées' },
    { id: 'expense', label: 'Retraits' },
  ];

  // Group transactions by date
  const grouped: { date: string; items: TransactionData[] }[] = [];
  const dateMap = new Map<string, TransactionData[]>();

  transactions.forEach(tx => {
    const dateKey = new Date(tx.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    if (!dateMap.has(dateKey)) dateMap.set(dateKey, []);
    dateMap.get(dateKey)!.push(tx);
  });

  dateMap.forEach((items, date) => grouped.push({ date, items }));

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <div className={`${styles.sectionIcon} ${styles.primary}`}><ClipboardIcon /></div>
          <h2>Historique</h2>
        </div>
      </div>
      <div className={styles.transactionFilters}>
        {filters.map((filter) => (
          <span key={filter.id} className={`${styles.filterChip} ${activeFilter === filter.id ? styles.active : ''}`} onClick={() => setActiveFilter(filter.id)}>
            {filter.label}
          </span>
        ))}
      </div>
      <div className={styles.transactionList}>
        {grouped.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
            Aucune transaction pour le moment
          </div>
        )}
        {grouped.map((group, gi) => (
          <div key={gi}>
            <div className={styles.transactionDateGroup}>{group.date}</div>
            {group.items.map((tx, ti) => {
              const methodInfo = getPaymentMethodInfo(tx.payment_method);
              const statusInfo = getTransactionStatusInfo(tx.status);
              const isIncome = tx.type === 'rent_payment';
              return (
                <div key={tx.id || ti}>
                  <div className={styles.transactionItem}>
                    <div className={`${styles.transactionIcon} ${isIncome ? styles.income : styles.expense}`}>
                      {isIncome ? <ArrowDownIcon /> : <ArrowUpIcon />}
                    </div>
                    <div className={styles.transactionDetails}>
                      <div className={styles.transactionTitle}>{tx.description || 'Commission location'}</div>
                      <div className={styles.transactionSubtitle}>{methodInfo.label} • {statusInfo.label}</div>
                    </div>
                    <div>
                      <div className={`${styles.transactionAmount} ${isIncome ? styles.income : styles.expense}`}>
                        {isIncome ? '+' : '-'}{formatAmount(tx.amount)} {tx.currency}
                      </div>
                      <div className={styles.transactionTime}>
                        {new Date(tx.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentCommissions = () => {
  const { user } = useAuthContext();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState({ totalPaid: 0, totalReceived: 0, completedCount: 0, pendingCount: 0, failedCount: 0, currency: 'GNF' });
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [walletRes, txRes, statsRes] = await Promise.all([
      getOrCreateWallet(user.id),
      getUserTransactions(user.id, { limit: 50 }),
      getPaymentStats(user.id, 'agent'),
    ]);
    setWallet(walletRes.data);
    setTransactions(txRes.data);
    setStats(statsRes);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <>
        <TopBar />
        <div className={styles.pageContent} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: 'var(--color-neutral-400)' }}>
          <LoaderIcon /> <span style={{ marginLeft: 12 }}>Chargement des commissions...</span>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar />

      <div className={styles.pageContent}>
        <BalanceHero balance={wallet?.balance || 0} currency={wallet?.currency || 'GNF'} />
        <StatsGrid stats={stats} />
        <div className={styles.contentGrid}>
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </>
  );
};

export default AgentCommissions;
