// @ts-nocheck
import { useState, useEffect } from 'react';
import { getWithdrawalRequests, approveWithdrawal, rejectWithdrawal, type WithdrawalRequest } from '@/services/withdrawalService';
import { formatAmount } from '@/services/paymentService';
import { supabase } from '@/integrations/supabase/client';
import {
  buildWithdrawalReceiptData,
  downloadAgentReceipt,
  downloadAdminReceipt,
} from '@/services/withdrawalReceiptService';
import styles from './shared/AdminLayout.module.css';

/* ─── Icons ─── */
const CheckIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>;
const XIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>;
const ClockIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const RefreshIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const DownloadIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>;

const statusColors: Record<string, string> = {
  pending: '#F59E0B',
  completed: '#10B981',
  rejected: '#EF4444',
  failed: '#EF4444',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  completed: 'Payé',
  rejected: 'Refusé',
  failed: 'Refusé',
};

const methodLabels: Record<string, string> = {
  orange_money: 'Orange Money',
  mtn_money: 'MTN Money',
  bank: 'Virement bancaire',
};

export default function AdminWithdrawals() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);

  async function loadData() {
    setLoading(true);
    const { data } = await getWithdrawalRequests({ limit: 100 });
    setRequests(data);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const completedCount = requests.filter(r => r.status === 'completed').length;
  const totalPending = requests.filter(r => r.status === 'pending').reduce((s, r) => s + r.amount, 0);

  /** Fetch full transaction for receipt generation */
  async function fetchTransactionForReceipt(transactionId: string) {
    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transactionId)
      .single();
    return data;
  }

  async function handleApprove(id: string) {
    setProcessingId(id);
    const { error } = await approveWithdrawal(id);
    if (error) {
      alert('Erreur : ' + error.message);
      setProcessingId(null);
      setConfirmAction(null);
      return;
    }

    // Generate and download receipts
    const tx = await fetchTransactionForReceipt(id);
    if (tx) {
      const receiptData = buildWithdrawalReceiptData(tx as any);
      // Download both receipts
      downloadAgentReceipt(receiptData);
      setTimeout(() => downloadAdminReceipt(receiptData), 500);
    }

    setProcessingId(null);
    setConfirmAction(null);
    await loadData();
  }

  async function handleReject(id: string) {
    setProcessingId(id);
    const { error } = await rejectWithdrawal(id, 'Rejeté par l\'administrateur');
    if (error) {
      alert('Erreur : ' + error.message);
      setProcessingId(null);
      setConfirmAction(null);
      return;
    }

    // Generate rejection receipt for agent
    const tx = await fetchTransactionForReceipt(id);
    if (tx) {
      const receiptData = buildWithdrawalReceiptData(tx as any);
      downloadAgentReceipt(receiptData);
    }

    setProcessingId(null);
    setConfirmAction(null);
    await loadData();
  }

  /** Download receipts for already processed transactions */
  async function handleDownloadReceipts(req: WithdrawalRequest, type: 'agent' | 'admin') {
    const tx = await fetchTransactionForReceipt(req.transaction_id);
    if (!tx) {
      alert('Transaction introuvable');
      return;
    }
    const receiptData = buildWithdrawalReceiptData(tx as any);
    if (type === 'agent') {
      downloadAgentReceipt(receiptData);
    } else {
      downloadAdminReceipt(receiptData);
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      {/* Top Bar */}
      <header style={{
        height: 72, background: 'white', borderBottom: '1px solid #E2E8F0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Opérations</div>
          <h1 style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.375rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Demandes de retrait
          </h1>
        </div>
        <button
          onClick={loadData}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px', background: 'white', border: '1px solid #E2E8F0',
            borderRadius: 12, cursor: 'pointer', fontWeight: 500, fontSize: '0.875rem',
            color: '#334155',
          }}
        >
          <span style={{ width: 18, height: 18, display: 'inline-flex' }}><RefreshIcon /></span>
          Rafraîchir
        </button>
      </header>

      <div style={{ padding: '24px 32px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <span style={{ width: 22, height: 22, display: 'inline-flex' }}><ClockIcon /></span>
              </div>
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>{pendingCount}</div>
            <div style={{ fontSize: '0.813rem', color: '#64748B' }}>En attente</div>
          </div>

          <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <span style={{ width: 22, height: 22, display: 'inline-flex' }}><CheckIcon /></span>
              </div>
            </div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>{completedCount}</div>
            <div style={{ fontSize: '0.813rem', color: '#64748B' }}>Traités</div>
          </div>

          <div style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', borderRadius: 16, padding: 20, color: 'white' }}>
            <div style={{ fontSize: '0.813rem', opacity: 0.9, marginBottom: 8 }}>Montant total en attente</div>
            <div style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1.5rem', fontWeight: 700 }}>
              {formatAmount(totalPending)} GNF
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'Toutes', count: requests.length },
            { id: 'pending', label: 'En attente', count: pendingCount },
            { id: 'completed', label: 'Payées', count: completedCount },
            { id: 'failed', label: 'Refusées', count: requests.filter(r => r.status === 'failed' || r.status === 'rejected').length },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              style={{
                padding: '8px 16px', borderRadius: 9999,
                border: filter === f.id ? 'none' : '1px solid #E2E8F0',
                background: filter === f.id ? '#047857' : 'white',
                color: filter === f.id ? 'white' : '#475569',
                fontWeight: 500, fontSize: '0.875rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {f.label}
              <span style={{
                padding: '1px 8px', borderRadius: 9999, fontSize: '0.75rem',
                background: filter === f.id ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                color: filter === f.id ? 'white' : '#475569',
              }}>{f.count}</span>
            </button>
          ))}
        </div>

        {/* Requests Table */}
        <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: 16, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8' }}>Chargement...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94A3B8' }}>Aucune demande de retrait</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Agent</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Montant</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Destination</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Date</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Statut</th>
                  <th style={{ padding: '12px 20px', textAlign: 'center', fontWeight: 600, color: '#64748B', fontSize: '0.75rem', textTransform: 'uppercase' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(req => (
                  <tr key={req.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, color: '#1E293B' }}>{req.agent_name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{req.agent_email}</div>
                      {req.agent_phone && <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{req.agent_phone}</div>}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, color: '#D97706' }}>
                        {formatAmount(req.amount)} {req.currency}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Réf: {req.payment_reference}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 500, color: '#334155' }}>{req.destination}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{methodLabels[req.method] || req.method}</div>
                    </td>
                    <td style={{ padding: '16px 20px', color: '#64748B', fontSize: '0.813rem' }}>
                      {formatDate(req.created_at)}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{
                        display: 'inline-flex', padding: '4px 12px', borderRadius: 9999,
                        fontSize: '0.75rem', fontWeight: 600,
                        background: req.status === 'pending' ? '#FEF3C7' : req.status === 'completed' ? '#DCFCE7' : '#FEE2E2',
                        color: statusColors[req.status] || '#64748B',
                      }}>
                        {statusLabels[req.status] || req.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                      {req.status === 'pending' ? (
                        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                          {confirmAction?.id === req.id ? (
                            <>
                              {confirmAction.action === 'approve' ? (
                                <>
                                  <span style={{ fontSize: '0.75rem', color: '#64748B', alignSelf: 'center' }}>Confirmer ?</span>
                                  <button
                                    onClick={() => handleApprove(req.id)}
                                    disabled={processingId === req.id}
                                    style={{
                                      padding: '6px 14px', borderRadius: 8, border: 'none',
                                      background: '#10B981', color: 'white', fontWeight: 600,
                                      fontSize: '0.75rem', cursor: 'pointer',
                                      opacity: processingId === req.id ? 0.5 : 1,
                                    }}
                                  >
                                    {processingId === req.id ? '...' : 'Oui, payé'}
                                  </button>
                                  <button
                                    onClick={() => setConfirmAction(null)}
                                    style={{
                                      padding: '6px 14px', borderRadius: 8,
                                      border: '1px solid #E2E8F0', background: 'white',
                                      color: '#64748B', fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer',
                                    }}
                                  >
                                    Annuler
                                  </button>
                                </>
                              ) : (
                                <>
                                  <span style={{ fontSize: '0.75rem', color: '#64748B', alignSelf: 'center' }}>Refuser ?</span>
                                  <button
                                    onClick={() => handleReject(req.id)}
                                    disabled={processingId === req.id}
                                    style={{
                                      padding: '6px 14px', borderRadius: 8, border: 'none',
                                      background: '#EF4444', color: 'white', fontWeight: 600,
                                      fontSize: '0.75rem', cursor: 'pointer',
                                      opacity: processingId === req.id ? 0.5 : 1,
                                    }}
                                  >
                                    {processingId === req.id ? '...' : 'Confirmer refus'}
                                  </button>
                                  <button
                                    onClick={() => setConfirmAction(null)}
                                    style={{
                                      padding: '6px 14px', borderRadius: 8,
                                      border: '1px solid #E2E8F0', background: 'white',
                                      color: '#64748B', fontWeight: 500, fontSize: '0.75rem', cursor: 'pointer',
                                    }}
                                  >
                                    Annuler
                                  </button>
                                </>
                              )}
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setConfirmAction({ id: req.id, action: 'approve' })}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  padding: '6px 14px', borderRadius: 8, border: 'none',
                                  background: '#DCFCE7', color: '#16A34A', fontWeight: 600,
                                  fontSize: '0.75rem', cursor: 'pointer',
                                }}
                              >
                                <span style={{ width: 14, height: 14, display: 'inline-flex' }}><CheckIcon /></span>
                                Marquer comme payé
                              </button>
                              <button
                                onClick={() => setConfirmAction({ id: req.id, action: 'reject' })}
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 4,
                                  padding: '6px 14px', borderRadius: 8,
                                  border: '1px solid #FECACA', background: '#FEF2F2',
                                  color: '#DC2626', fontWeight: 500,
                                  fontSize: '0.75rem', cursor: 'pointer',
                                }}
                              >
                                <span style={{ width: 14, height: 14, display: 'inline-flex' }}><XIcon /></span>
                                Refuser
                              </button>
                            </>
                          )}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => handleDownloadReceipts(req, 'agent')}
                            title="Télécharger le reçu de l'agent"
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              padding: '5px 10px', borderRadius: 8,
                              border: '1px solid #E2E8F0', background: 'white',
                              color: '#047857', fontWeight: 500, fontSize: '0.7rem', cursor: 'pointer',
                            }}
                          >
                            <span style={{ width: 12, height: 12, display: 'inline-flex' }}><DownloadIcon /></span>
                            Reçu agent
                          </button>
                          {req.status === 'completed' && (
                            <button
                              onClick={() => handleDownloadReceipts(req, 'admin')}
                              title="Télécharger la preuve de paiement admin"
                              style={{
                                display: 'flex', alignItems: 'center', gap: 4,
                                padding: '5px 10px', borderRadius: 8,
                                border: '1px solid #BFDBFE', background: '#EFF6FF',
                                color: '#1D4ED8', fontWeight: 500, fontSize: '0.7rem', cursor: 'pointer',
                              }}
                            >
                              <span style={{ width: 12, height: 12, display: 'inline-flex' }}><DownloadIcon /></span>
                              Preuve admin
                            </button>
                          )}
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8', width: '100%', textAlign: 'center', marginTop: 2 }}>
                            {req.processed_at ? formatDate(req.processed_at) : '—'}
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
