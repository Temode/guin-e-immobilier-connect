// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { getTenantActiveRental, daysUntilNextPayment, formatPaymentMethod, type RentalWithDetails } from '@/services/rentalService';
import { getUserTransactions, getPaymentStats, formatAmount, getPaymentMethodInfo, getTransactionStatusInfo, type TransactionData } from '@/services/paymentService';
import { initiateDjomyPayment, pollPaymentStatus, type DjomyStatusResult } from '@/services/djomyService';
import styles from './Mes_Paiements.module.css';

/* ==========================================
   ICONS COMPONENTS (kept compact)
========================================== */
const PaymentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const NotificationIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SettingsIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CheckCircleIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DownloadIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const CalendarIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const CreditCardIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const ChartIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const LightningIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const DocumentIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MessageIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LoaderIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

/* ==========================================
   HEADER COMPONENT
========================================== */
const Header = ({ date, hasNotifications }) => (
  <header className={styles.header}>
    <div className={styles.headerLeft}>
      <nav className={styles.breadcrumb}>
        <a href="#">Tableau de bord</a>
        <span className={styles.breadcrumbSeparator}>/</span>
        <span className={styles.breadcrumbCurrent}>Mes paiements</span>
      </nav>
    </div>
    <div className={styles.headerRight}>
      <span className={styles.headerDate}>{date}</span>
      <button className={styles.headerBtn}>
        <NotificationIcon />
        {hasNotifications && <span className={styles.notificationDot}></span>}
      </button>
      <button className={styles.headerBtn}>
        <SettingsIcon />
      </button>
    </div>
  </header>
);

/* ==========================================
   PAYMENT MODAL COMPONENT
========================================== */
const PaymentModal = ({ isOpen, onClose, rental, onPaymentComplete }) => {
  const [selectedMethod, setSelectedMethod] = useState('orange_money');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollingMessage, setPollingMessage] = useState('');
  const [result, setResult] = useState(null);

  if (!isOpen || !rental) return null;

  const paymentMethods = [
    { id: 'orange_money', label: 'Orange Money', icon: '🟠' },
    { id: 'mtn_money', label: 'MTN Money', icon: '🟡' },
  ];

  const handlePay = async () => {
    if (!phoneNumber.trim()) {
      setResult({ success: false, message: 'Veuillez saisir votre numéro de téléphone.' });
      return;
    }

    setIsProcessing(true);
    setResult(null);
    setPollingMessage('');

    try {
      // Step 1: Initiate payment via Djomy Edge Function
      const djomyResult = await initiateDjomyPayment({
        rentalId: rental.id,
        paymentMethod: selectedMethod as 'orange_money' | 'mtn_money',
        phoneNumber,
      });

      if (!djomyResult.success || !djomyResult.transactionId) {
        setResult({ success: false, message: djomyResult.message || 'Erreur lors de l\'initiation du paiement.' });
        setIsProcessing(false);
        return;
      }

      // Step 2: Show "waiting for phone confirmation" state
      setIsPolling(true);
      setPollingMessage('Validez le paiement sur votre téléphone...');

      // Step 3: Poll for payment status
      const finalStatus = await pollPaymentStatus({
        transactionId: djomyResult.transactionId,
        djomyTransactionId: djomyResult.djomyTransactionId || undefined,
        onStatusChange: (status) => {
          if (status.status === 'pending') {
            setPollingMessage('En attente de validation sur votre téléphone...');
          } else if (status.djomyStatus) {
            setPollingMessage(`Statut Djomy: ${status.djomyStatus}`);
          }
        },
        maxAttempts: 36,  // ~3 minutes at 5s intervals
        intervalMs: 5000,
      });

      setIsPolling(false);

      if (finalStatus.status === 'completed') {
        setResult({ success: true, message: 'Paiement effectué avec succès !' });
        onPaymentComplete?.();
      } else if (finalStatus.status === 'failed') {
        setResult({ success: false, message: 'Le paiement a échoué. Veuillez réessayer.' });
      } else {
        // Still pending after timeout
        setResult({
          success: false,
          message: 'Le paiement est toujours en cours. Vérifiez votre téléphone et consultez l\'historique.',
        });
        onPaymentComplete?.(); // Refresh data anyway
      }
    } catch (err) {
      setIsPolling(false);
      setResult({ success: false, message: 'Erreur inattendue.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const isBusy = isProcessing || isPolling;

  return (
    <div className={styles.modalOverlay} onClick={(e) => e.target === e.currentTarget && !isBusy && onClose()}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Payer mon loyer</h3>
          <button className={styles.modalCloseBtn} onClick={onClose} disabled={isBusy}>
            <XIcon />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.modalAmountDisplay}>
            <span className={styles.modalAmountLabel}>Montant du loyer</span>
            <span className={styles.modalAmountValue}>
              {formatAmount(rental.rent_amount)} {rental.currency}
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Choisir un mode de paiement</label>
            <div className={styles.paymentMethodsGrid}>
              {paymentMethods.map((pm) => (
                <button
                  key={pm.id}
                  className={`${styles.paymentMethodOption} ${selectedMethod === pm.id ? styles.selected : ''}`}
                  onClick={() => setSelectedMethod(pm.id)}
                  disabled={isBusy}
                >
                  <span className={styles.paymentMethodEmoji}>{pm.icon}</span>
                  <span>{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Numéro de téléphone</label>
            <input
              type="tel"
              className={styles.formInput}
              placeholder="+224 6XX XX XX XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isBusy}
            />
          </div>

          <div className={styles.sandboxBanner}>
            ⚡ Mode Test Djomy — Le paiement est traité via Djomy en mode sandbox.
          </div>

          {isPolling && (
            <div className={styles.resultBanner} style={{ background: 'var(--color-primary-50, #eff6ff)', color: 'var(--color-primary-600, #2563eb)', border: '1px solid var(--color-primary-200, #bfdbfe)' }}>
              <LoaderIcon />
              <span>{pollingMessage}</span>
            </div>
          )}

          {result && (
            <div className={`${styles.resultBanner} ${result.success ? styles.resultSuccess : styles.resultError}`}>
              {result.success ? <CheckCircleIcon /> : <XIcon />}
              <span>{result.message}</span>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnSecondary}`} onClick={onClose} disabled={isBusy}>
            Annuler
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={handlePay}
            disabled={isBusy || (result && result.success)}
          >
            {isPolling ? (
              <>
                <LoaderIcon />
                Validation en cours...
              </>
            ) : isProcessing ? (
              <>
                <LoaderIcon />
                Connexion à Djomy...
              </>
            ) : result?.success ? (
              <>
                <CheckIcon />
                Payé
              </>
            ) : (
              <>
                <PaymentIcon />
                Payer via {selectedMethod === 'orange_money' ? 'Orange Money' : 'MTN Money'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   STATS GRID COMPONENT
========================================== */
const StatsGrid = ({ stats }) => {
  const iconMap = { payment: PaymentIcon, check: CheckCircleIcon, calendar: CalendarIcon, document: DocumentIcon };
  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.iconType] || PaymentIcon;
        return (
          <div key={index} className={`${styles.statCard} ${stat.highlight ? styles.highlight : ''}`} style={{ animationDelay: `${index * 0.05}s` }}>
            <div className={styles.statHeader}>
              <div className={`${styles.statIcon} ${styles[stat.iconColor] || ''}`}><IconComponent /></div>
              {stat.trend && (
                <span className={`${styles.statTrend} ${styles[stat.trendType] || ''}`}>
                  {stat.trendIcon && <CheckIcon />}
                  {stat.trend}
                </span>
              )}
            </div>
            <p className={styles.statValue}>{stat.value}</p>
            <p className={styles.statLabel}>{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================
   NEXT PAYMENT CARD COMPONENT
========================================== */
const NextPaymentCard = ({ payment }) => (
  <div className={styles.nextPaymentCard}>
    <div className={styles.nextPaymentHeader}>
      <span className={styles.nextPaymentLabel}>Prochain prélèvement</span>
      <span className={styles.nextPaymentStatus}><ClockIcon />Programmé</span>
    </div>
    <p className={styles.nextPaymentAmount}>{payment.amount}<span>{payment.currency}</span></p>
    <p className={styles.nextPaymentDue}>Prévu le <strong>{payment.dueDate}</strong> — {payment.description}</p>
    <div className={styles.nextPaymentFooter}>
      <div className={styles.countdownDisplay}>
        <span className={styles.countdownNumber}>{payment.daysRemaining}</span>
        <span className={styles.countdownText}>jours restants</span>
      </div>
      <div className={styles.paymentMethodMini}>
        <div className={styles.paymentMethodMiniIcon}>{payment.methodIcon}</div>
        <div className={styles.paymentMethodMiniText}>{payment.method}<span>{payment.methodNumber}</span></div>
      </div>
    </div>
  </div>
);

/* ==========================================
   FILTERS BAR COMPONENT
========================================== */
const FiltersBar = ({ activeFilter, onFilterChange, searchQuery, onSearchChange }) => {
  const filters = ['Tous', 'Payés', 'En attente', 'Échoués'];
  return (
    <div className={styles.filtersBar}>
      <div className={styles.filtersLeft}>
        {filters.map((filter) => (
          <button key={filter} className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`} onClick={() => onFilterChange(filter)}>{filter}</button>
        ))}
      </div>
      <div className={styles.filtersRight}>
        <div className={styles.searchInput}><SearchIcon /><input type="text" placeholder="Rechercher..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} /></div>
      </div>
    </div>
  );
};

/* ==========================================
   PAYMENT TABLE COMPONENT
========================================== */
const PaymentTable = ({ payments }) => {
  const getStatusIcon = (status) => {
    if (status === 'completed') return CheckIcon;
    if (status === 'pending') return ClockIcon;
    return XIcon;
  };

  return (
    <div className={styles.paymentTable}>
      <div className={styles.paymentTableHeader}>
        <span>Transaction</span><span>Date</span><span>Montant</span><span>Statut</span><span>Reçu</span>
      </div>
      {payments.length === 0 && (
        <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--color-neutral-400)' }}>
          Aucune transaction trouvée
        </div>
      )}
      {payments.map((payment, index) => {
        const StatusIcon = getStatusIcon(payment.status);
        const statusInfo = getTransactionStatusInfo(payment.status);
        const methodInfo = getPaymentMethodInfo(payment.payment_method);
        return (
          <div key={payment.id || index} className={styles.paymentTableRow}>
            <div className={styles.paymentInfo}>
              <div className={`${styles.paymentIcon} ${styles[statusInfo.color]}`}><StatusIcon /></div>
              <div className={styles.paymentDetails}>
                <h4>{payment.description || 'Paiement de loyer'}</h4>
                <p>{methodInfo.label}</p>
              </div>
            </div>
            <span className={styles.paymentDate}>{new Date(payment.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span className={styles.paymentAmount}>{formatAmount(payment.amount)} {payment.currency}</span>
            <span className={`${styles.paymentStatusBadge} ${styles[statusInfo.color]}`}>
              <StatusIcon />{statusInfo.label}
            </span>
            <div className={styles.paymentActions}>
              <button className={styles.downloadBtn}><DownloadIcon /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ==========================================
   PAGINATION COMPONENT
========================================== */
const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className={styles.pagination}>
      <span className={styles.paginationInfo}>Affichage {startItem}-{endItem} sur {totalItems} paiements</span>
      <div className={styles.paginationButtons}>
        <button className={styles.paginationBtn} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}><ChevronLeftIcon /></button>
        {[...Array(totalPages)].map((_, i) => (
          <button key={i} className={`${styles.paginationBtn} ${currentPage === i + 1 ? styles.active : ''}`} onClick={() => onPageChange(i + 1)}>{i + 1}</button>
        ))}
        <button className={styles.paginationBtn} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}><ChevronRightIcon /></button>
      </div>
    </div>
  );
};

/* ==========================================
   PAYMENT METHOD CARD COMPONENT
========================================== */
const PaymentMethodCard = ({ method }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <h3 className={styles.cardTitle}><CreditCardIcon />Moyen de paiement</h3>
    </div>
    <div className={styles.cardBody}>
      <div className={styles.paymentMethodCardInner}>
        <div className={styles.paymentMethodHeader}>
          <span className={styles.paymentMethodTitle}>Compte principal</span>
          <span className={styles.paymentMethodBadge}><CheckIcon />Actif</span>
        </div>
        <div className={styles.paymentMethodContent}>
          <div className={styles.paymentMethodIcon}>{method.iconText}</div>
          <div className={styles.paymentMethodInfo}>
            <p className={styles.paymentMethodName}>{method.name}</p>
            <p className={styles.paymentMethodNumber}>{method.number}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ==========================================
   QUICK ACTIONS COMPONENT
========================================== */
const QuickActions = ({ actions }) => {
  const iconMap = { document: DocumentIcon, message: MessageIcon, settings: SettingsIcon };
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}><h3 className={styles.cardTitle}><LightningIcon />Actions rapides</h3></div>
      <div className={styles.cardBodyNoPaddingTop}>
        <div className={styles.quickActionList}>
          {actions.map((action, index) => {
            const IconComponent = iconMap[action.iconType] || DocumentIcon;
            return (
              <a key={index} href={action.href} className={styles.quickActionItem}>
                <div className={`${styles.quickActionIcon} ${styles[action.iconColor]}`}><IconComponent /></div>
                <div className={styles.quickActionContent}><h4>{action.title}</h4><p>{action.description}</p></div>
                <span className={styles.quickActionArrow}><ChevronRightIcon /></span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ==========================================
   MAIN COMPONENT
========================================== */
const Mes_Paiements = () => {
  const { user } = useAuthContext();
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rental, setRental] = useState<RentalWithDetails | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [stats, setStats] = useState({ totalPaid: 0, completedCount: 0, pendingCount: 0, failedCount: 0, currency: 'GNF' });
  const [loading, setLoading] = useState(true);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [rentalRes, txRes, statsRes] = await Promise.all([
      getTenantActiveRental(user.id),
      getUserTransactions(user.id, { limit: 50 }),
      getPaymentStats(user.id, 'tenant'),
    ]);
    setRental(rentalRes.data);
    setTransactions(txRes.data);
    setStats(statsRes);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const itemsPerPage = 5;
  const filteredTransactions = transactions.filter((t) => {
    if (activeFilter === 'Payés') return t.status === 'completed';
    if (activeFilter === 'En attente') return t.status === 'pending';
    if (activeFilter === 'Échoués') return t.status === 'failed';
    return true;
  }).filter((t) => {
    if (!searchQuery) return true;
    return (t.description || '').toLowerCase().includes(searchQuery.toLowerCase()) || t.payment_method.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const daysUntil = rental ? daysUntilNextPayment(rental.payment_day_of_month) : 0;
  const payMethod = rental ? formatPaymentMethod(rental.payment_method) : { label: 'Non défini', iconText: '—' };

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });

  const statsCards = [
    { iconType: 'payment', iconColor: '', value: `${formatAmount(stats.totalPaid)} GNF`, label: 'Total payé', trend: stats.completedCount > 0 ? 'À jour' : undefined, trendType: 'up', trendIcon: true, highlight: true },
    { iconType: 'check', iconColor: 'green', value: String(stats.completedCount), label: 'Paiements effectués' },
    { iconType: 'calendar', iconColor: 'orange', value: rental ? `${daysUntil} jours` : '—', label: 'Avant prochain loyer' },
    { iconType: 'document', iconColor: 'blue', value: String(stats.completedCount), label: 'Reçus disponibles' },
  ];

  const quickActions = [
    { iconType: 'document', iconColor: 'green', title: 'Télécharger tous les reçus', description: `${stats.completedCount} fichiers`, href: '#' },
    { iconType: 'message', iconColor: 'blue', title: 'Contacter le support', description: 'Problème de paiement ?', href: '#' },
    { iconType: 'settings', iconColor: 'orange', title: 'Paramètres paiement', description: 'Notifications, rappels...', href: '#' },
  ];

  if (loading) {
    return (
      <>
        <Header date={dateStr} hasNotifications={false} />
        <main className={styles.mainContent}>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px', color: 'var(--color-neutral-400)' }}>
            <LoaderIcon /> <span style={{ marginLeft: 12 }}>Chargement des paiements...</span>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header date={dateStr} hasNotifications={stats.pendingCount > 0} />

      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1>Mes paiements</h1>
            <p>Consultez l'historique de vos paiements et gérez vos moyens de paiement</p>
          </div>
          <div className={styles.pageActions}>
            <button className={`${styles.btn} ${styles.btnSecondary}`}><DownloadIcon />Exporter tout</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setIsPayModalOpen(true)} disabled={!rental}>
              <PlusIcon />Payer mon loyer
            </button>
          </div>
        </div>

        <StatsGrid stats={statsCards} />

        <div className={styles.paymentsLayout}>
          <div className={styles.paymentsMain}>
            {rental && (
              <NextPaymentCard payment={{
                amount: formatAmount(rental.rent_amount),
                currency: rental.currency,
                dueDate: `${rental.payment_day_of_month} ${new Date(now.getFullYear(), now.getMonth() + (now.getDate() < rental.payment_day_of_month ? 0 : 1)).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
                description: 'Loyer mensuel',
                daysRemaining: daysUntil,
                method: payMethod.label,
                methodIcon: payMethod.iconText,
                methodNumber: '',
              }} />
            )}

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}><ClockIcon />Historique des paiements</h3>
              </div>
              <div className={styles.cardBody}>
                <FiltersBar activeFilter={activeFilter} onFilterChange={(f) => { setActiveFilter(f); setCurrentPage(1); }} searchQuery={searchQuery} onSearchChange={(q) => { setSearchQuery(q); setCurrentPage(1); }} />
                <PaymentTable payments={paginatedTransactions} />
                {filteredTransactions.length > itemsPerPage && (
                  <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredTransactions.length} itemsPerPage={itemsPerPage} onPageChange={setCurrentPage} />
                )}
              </div>
            </div>
          </div>

          <div className={styles.paymentsSide}>
            <PaymentMethodCard method={{ name: payMethod.label, number: rental?.payment_method ? '' : 'Non configuré', iconText: payMethod.iconText }} />
            <QuickActions actions={quickActions} />
          </div>
        </div>
      </main>

      <PaymentModal isOpen={isPayModalOpen} onClose={() => { setIsPayModalOpen(false); }} rental={rental} onPaymentComplete={fetchData} />
    </>
  );
};

export default Mes_Paiements;
