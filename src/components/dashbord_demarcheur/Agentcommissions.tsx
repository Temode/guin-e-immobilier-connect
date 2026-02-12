import { useState } from 'react';
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

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

const AlertIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

/* ==========================================
   TOP BAR COMPONENT
========================================== */
const TopBar = () => (
  <header className={styles.topBar}>
    <div className={styles.topBarLeft}>
      <div className={styles.pageContext}>
        <span className={styles.pageDate}>Mardi 4 février 2025</span>
        <h1 className={styles.pageTitle}>Mes commissions</h1>
      </div>
    </div>
    <div className={styles.topBarRight}>
      <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}>
        <DownloadIcon />
        Exporter
      </button>
      <button className={styles.iconBtn}>
        <HelpIcon />
      </button>
    </div>
  </header>
);

/* ==========================================
   ALERT BANNER COMPONENT
========================================== */
const AlertBanner = ({ title, message, onAction }) => (
  <div className={styles.alertBanner}>
    <div className={styles.alertBannerIcon}>
      <AlertIcon />
    </div>
    <div className={styles.alertBannerContent}>
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
    <div className={styles.alertBannerAction}>
      <button className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`} onClick={onAction}>
        Voir le problème
      </button>
    </div>
  </div>
);

/* ==========================================
   BALANCE HERO COMPONENT
========================================== */
const BalanceHero = ({ balance, plan, simulation, onWithdraw, onUpgrade }) => (
  <div className={styles.balanceHero}>
    <div className={styles.balanceHeroContent}>
      <div className={styles.balanceHeroTop}>
        <div>
          <p className={styles.balanceLabel}>
            <CreditCardIcon />
            Solde disponible
          </p>
          <h2 className={styles.balanceAmount}>{balance}</h2>
        </div>
        <div className={styles.balancePlan}>
          <BadgeCheckIcon />
          {plan}
        </div>
      </div>

      <div className={styles.balanceSimulation}>
        <p className={styles.simulationTitle}>Simulation de retrait total</p>
        <div className={styles.simulationRow}>
          <span className={styles.label}>Montant disponible</span>
          <span className={styles.value}>{simulation.available}</span>
        </div>
        <div className={styles.simulationRow}>
          <span className={styles.label}>Commission plateforme ({simulation.rate})</span>
          <span className={`${styles.value} ${styles.negative}`}>{simulation.commission}</span>
        </div>
        <div className={`${styles.simulationRow} ${styles.total}`}>
          <span className={styles.label}>Vous recevrez</span>
          <span className={styles.value}>{simulation.net}</span>
        </div>
      </div>

      <div className={styles.balanceHeroActions}>
        <button className={`${styles.btn} ${styles.btnWithdraw} ${styles.btnLg}`} onClick={onWithdraw}>
          <PlusIcon />
          Retirer mes fonds
        </button>
        <button className={`${styles.btn} ${styles.btnUpgrade}`} onClick={onUpgrade}>
          <SparklesIcon />
          Passer au Plan Pro (3-4%)
        </button>
      </div>
    </div>
  </div>
);

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }) => (
  <div className={styles.statsGrid}>
    {stats.map((stat, index) => (
      <div key={index} className={styles.statCard} style={{ animationDelay: `${0.1 + index * 0.05}s` }}>
        <div className={styles.statCardHeader}>
          <div className={`${styles.statCardIcon} ${styles[stat.variant]}`}>
            <stat.icon />
          </div>
          {stat.trend && (
            <span className={`${styles.statCardTrend} ${styles[stat.trend.direction]}`}>
              {stat.trend.direction === 'up' ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {stat.trend.value}
            </span>
          )}
        </div>
        <div className={styles.statCardValue}>{stat.value}</div>
        <div className={styles.statCardLabel}>{stat.label}</div>
        {stat.action && (
          <div className={styles.statCardAction}>
            <a href="#">
              {stat.action} <ChevronRightIcon />
            </a>
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ==========================================
   PAYMENTS SECTION COMPONENT
========================================== */
const PaymentsSection = ({ payments }) => (
  <div className={styles.sectionCard}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitle}>
        <div className={`${styles.sectionIcon} ${styles.gold}`}>
          <CalendarIcon />
        </div>
        <div>
          <h2>Paiements - Février 2025</h2>
          <span className={styles.sectionMeta}>8 biens en location</span>
        </div>
      </div>
      <a href="#" className={`${styles.btn} ${styles.btnGhost} ${styles.btnXs}`}>Voir tout</a>
    </div>
    <div className={styles.sectionBody}>
      {payments.groups.map((group, groupIndex) => (
        <div key={groupIndex} className={styles.paymentGroup}>
          <div className={styles.paymentGroupHeader}>
            <div className={`${styles.paymentGroupStatus} ${styles[group.status]}`}>
              {group.status === 'success' && <CheckIcon />}
              {group.status === 'warning' && <ClockIcon />}
              {group.status === 'error' && <XIcon />}
            </div>
            <span className={styles.paymentGroupTitle}>{group.title}</span>
            <span className={styles.paymentGroupCount}>{group.count}</span>
          </div>
          {group.items.map((item, itemIndex) => (
            <div key={itemIndex}>
              <div className={`${styles.paymentItem} ${item.failed ? styles.failed : ''}`}>
                <div className={styles.paymentItemIcon}>
                  {item.type === 'villa' ? <HomeIcon /> : <BuildingIcon />}
                </div>
                <div className={styles.paymentItemDetails}>
                  <div className={styles.paymentItemProperty}>{item.property}</div>
                  <div className={styles.paymentItemTenant}>{item.tenant}</div>
                </div>
                <div>
                  <div className={styles.paymentItemAmount} style={item.pending ? { color: 'var(--color-warning-600)' } : item.failed ? { color: 'var(--color-error-600)' } : {}}>
                    {item.pending ? '' : '+'}{item.amount}
                  </div>
                  <div className={styles.paymentItemDate}>{item.date}</div>
                </div>
              </div>
              {item.failedInfo && (
                <div className={styles.paymentFailedInfo}>
                  <div className={styles.paymentFailedReason}>
                    <AlertIcon />
                    {item.failedInfo.reason}
                  </div>
                  <div className={styles.paymentFailedActions}>
                    <button className={`${styles.btn} ${styles.btnSecondary} ${styles.btnXs}`}>
                      <PhoneIcon />
                      Contacter
                    </button>
                    <button className={`${styles.btn} ${styles.btnPrimary} ${styles.btnXs}`}>
                      <RefreshIcon />
                      Relancer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ==========================================
   TRANSACTION HISTORY COMPONENT
========================================== */
const TransactionHistory = ({ transactions, filters, activeFilter, onFilterChange }) => (
  <div className={styles.sectionCard}>
    <div className={styles.sectionHeader}>
      <div className={styles.sectionTitle}>
        <div className={`${styles.sectionIcon} ${styles.primary}`}>
          <ClipboardIcon />
        </div>
        <h2>Historique</h2>
      </div>
    </div>
    <div className={styles.transactionFilters}>
      {filters.map((filter) => (
        <span
          key={filter.id}
          className={`${styles.filterChip} ${activeFilter === filter.id ? styles.active : ''}`}
          onClick={() => onFilterChange(filter.id)}
        >
          {filter.label}
        </span>
      ))}
    </div>
    <div className={styles.transactionList}>
      {transactions.map((item, index) => {
        if (item.type === 'date') {
          return (
            <div key={index} className={styles.transactionDateGroup}>
              {item.text}
            </div>
          );
        }

        return (
          <div key={index}>
            <div className={styles.transactionItem}>
              <div className={`${styles.transactionIcon} ${styles[item.direction]}`}>
                {item.direction === 'income' ? <ArrowDownIcon /> : <ArrowUpIcon />}
              </div>
              <div className={styles.transactionDetails}>
                <div className={styles.transactionTitle}>{item.title}</div>
                <div className={styles.transactionSubtitle}>{item.subtitle}</div>
              </div>
              <div>
                <div className={`${styles.transactionAmount} ${styles[item.direction]}`}>
                  {item.direction === 'income' ? '+' : ''}{item.amount}
                </div>
                <div className={styles.transactionTime}>{item.time}</div>
              </div>
            </div>
            {item.expand && (
              <div className={styles.transactionExpand}>
                {item.expand.map((row, rowIndex) => (
                  <div key={rowIndex} className={styles.transactionExpandRow}>
                    <span className={styles.label}>{row.label}</span>
                    <span style={row.bold ? { fontWeight: 600 } : {}}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

/* ==========================================
   WITHDRAWAL MODAL COMPONENT
========================================== */
const WithdrawalModal = ({ isOpen, onClose, balance }) => {
  const [amount, setAmount] = useState('3,450,000');
  const [selectedMethod, setSelectedMethod] = useState('orange');

  if (!isOpen) return null;

  const paymentMethods = [
    { id: 'orange', name: 'Orange Money', icon: '🟠', colorClass: 'orange' },
    { id: 'mtn', name: 'MTN MoMo', icon: '🟡', colorClass: 'mtn' },
    { id: 'bank', name: 'Virement', icon: '🏦', colorClass: 'bank' },
  ];

  const quickAmounts = ['500K', '1M', '2M', 'Tout'];

  return (
    <div className={`${styles.modalOverlay} ${isOpen ? styles.active : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Retirer mes fonds</h3>
          <button className={styles.modalClose} onClick={onClose}>
            <XIcon />
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.modalBalance}>
            Solde disponible : <strong>{balance}</strong>
          </p>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Montant à retirer</label>
            <input
              type="text"
              className={`${styles.formInput} ${styles.formInputLarge}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className={styles.formQuickAmounts}>
              {quickAmounts.map((amt) => (
                <button key={amt} className={styles.quickAmountBtn}>
                  {amt}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Méthode de retrait</label>
            <div className={styles.paymentMethods}>
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`${styles.paymentMethod} ${selectedMethod === method.id ? styles.selected : ''}`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <div className={`${styles.paymentMethodIcon} ${styles[method.colorClass]}`}>
                    {method.icon}
                  </div>
                  <div className={styles.paymentMethodName}>{method.name}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Numéro Orange Money</label>
            <input
              type="tel"
              className={styles.formInput}
              defaultValue="+224 620 12 34 56"
            />
          </div>

          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span className={styles.label}>Montant demandé</span>
              <span className={styles.value}>3,450,000 GNF</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.commission}`}>
              <span className={styles.label}>Commission plateforme (Basic 5%)</span>
              <span className={styles.value}>-172,500 GNF</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span className={styles.label}>Vous allez recevoir</span>
              <span className={styles.value}>3,277,500 GNF</span>
            </div>
          </div>

          <div className={styles.upsellTip}>
            <SparklesIcon />
            <p>Avec le <strong>Plan Pro (3%)</strong>, vous économiseriez <strong>34,500 GNF</strong> sur ce retrait.</p>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnGold} ${styles.btnLg}`} style={{ width: '100%' }}>
            <CheckIcon />
            Confirmer le retrait
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const AgentCommissions = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock Data
  const mockData = {
    balance: {
      amount: '3,450,000 GNF',
      plan: 'Plan Basic • 5% commission',
      simulation: {
        available: '3,450,000 GNF',
        rate: '5%',
        commission: '-172,500 GNF',
        net: '3,277,500 GNF',
      },
    },
    alert: {
      title: '1 paiement a échoué',
      message: 'Le loyer du Duplex Cosa (M. Barry) n\'a pas pu être prélevé après 3 tentatives.',
    },
    stats: [
      {
        icon: CurrencyIcon,
        value: '+850,000 GNF',
        label: 'Revenus ce mois',
        variant: 'success',
        trend: { direction: 'up', value: '+18%' },
      },
      {
        icon: ChartIcon,
        value: '720,000 GNF',
        label: 'Mois dernier',
        variant: 'info',
      },
      {
        icon: ClockIcon,
        value: '2',
        label: 'Paiements en attente',
        variant: 'warning',
        action: '400,000 GNF prévus',
      },
      {
        icon: ExclamationIcon,
        value: '1',
        label: 'Paiement échoué',
        variant: 'error',
        action: 'Action requise',
      },
    ],
    payments: {
      groups: [
        {
          status: 'success',
          title: 'Collectés',
          count: '5 paiements • 830,000 GNF',
          items: [
            { type: 'villa', property: 'Villa F4 Lambanyi', tenant: 'Mme Aissatou Camara', amount: '480,000 GNF', date: '1 Fév 10:32' },
            { type: 'apartment', property: 'Appartement F3 Kipé', tenant: 'M. Mamadou Diallo', amount: '200,000 GNF', date: '1 Fév 10:30' },
            { type: 'apartment', property: 'Studio Nongo', tenant: 'M. Ibrahima Bah', amount: '150,000 GNF', date: '1 Fév 10:31' },
          ],
        },
        {
          status: 'warning',
          title: 'En attente',
          count: '2 paiements • Prévus le 5 Fév',
          items: [
            { type: 'apartment', property: 'Appartement F2 Ratoma', tenant: 'M. Oumar Sylla', amount: '200,000 GNF', date: 'Prévu 5 Fév', pending: true },
            { type: 'apartment', property: 'Studio Taouyah', tenant: 'Mme Fatoumata Keita', amount: '200,000 GNF', date: 'Prévu 5 Fév', pending: true },
          ],
        },
        {
          status: 'error',
          title: 'Échec',
          count: '1 paiement • Action requise',
          items: [
            {
              type: 'villa',
              property: 'Duplex Cosa',
              tenant: 'M. Alpha Barry',
              amount: '300,000 GNF',
              date: '3 tentatives',
              failed: true,
              failedInfo: {
                reason: 'Raison : Solde insuffisant • Dernière tentative : Hier 14:32',
              },
            },
          ],
        },
      ],
    },
    filters: [
      { id: 'all', label: 'Tout' },
      { id: 'income', label: 'Entrées' },
      { id: 'expense', label: 'Retraits' },
    ],
    transactions: [
      { type: 'date', text: 'Aujourd\'hui' },
      { direction: 'income', title: 'Commission location', subtitle: 'Villa F4 Lambanyi', amount: '480,000 GNF', time: '10:32' },
      { direction: 'income', title: 'Commission location', subtitle: 'Appartement F3 Kipé', amount: '200,000 GNF', time: '10:30' },
      { type: 'date', text: 'Hier' },
      {
        direction: 'expense',
        title: 'Retrait Orange Money',
        subtitle: '+224 620 12 34 56',
        amount: '-1,000,000 GNF',
        time: '14:45',
        expand: [
          { label: 'Montant retiré', value: '1,000,000 GNF' },
          { label: 'Commission (5%)', value: '-50,000 GNF' },
          { label: 'Montant reçu', value: '950,000 GNF', bold: true },
        ],
      },
      { direction: 'income', title: 'Commission location', subtitle: 'Studio Nongo', amount: '150,000 GNF', time: '10:31' },
      { type: 'date', text: '1 Février' },
      { direction: 'income', title: 'Commission location', subtitle: 'Villa F5 Kipé', amount: '350,000 GNF', time: '10:28' },
    ],
  };

  return (
    <>
      <TopBar />

      <div className={styles.pageContent}>
        <AlertBanner
          title={mockData.alert.title}
          message={mockData.alert.message}
          onAction={() => console.log('View problem')}
        />

        <BalanceHero
          balance={mockData.balance.amount}
          plan={mockData.balance.plan}
          simulation={mockData.balance.simulation}
          onWithdraw={() => setIsModalOpen(true)}
          onUpgrade={() => console.log('Upgrade')}
        />

        <StatsGrid stats={mockData.stats} />

        <div className={styles.contentGrid}>
          <PaymentsSection payments={mockData.payments} />
          <TransactionHistory
            transactions={mockData.transactions}
            filters={mockData.filters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>

      <WithdrawalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        balance={mockData.balance.amount}
      />
    </>
  );
};

export default AgentCommissions;