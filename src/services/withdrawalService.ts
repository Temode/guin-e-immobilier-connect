/**
 * Withdrawal Service — Gestion des demandes de retrait (MVP mode)
 *
 * En MVP, les retraits ne sont PAS automatiques. Flux :
 * 1. L'agent soumet une demande de retrait → transaction "pending"
 * 2. Le fondateur reçoit un email de notification
 * 3. Le fondateur effectue le transfert manuellement
 * 4. Le fondateur marque la demande comme "completed" dans le backoffice
 * 5. Le wallet de l'agent est débité et l'agent est notifié
 */
import { supabase } from '@/integrations/supabase/client';
import { formatAmount, type TransactionData } from './paymentService';
import { createNotification } from './notificationService';

/* ─── Config ─── */

/** Email du fondateur qui recevra les notifications de retrait */
export const FOUNDER_EMAIL = 'terriumplus1@gmail.com';

/** Numéro du fondateur pour les SMS (format international) */
export const FOUNDER_PHONE = '+224611599395';

/* ─── Types ─── */

export interface WithdrawalRequest {
  id: string;
  agent_id: string;
  agent_name: string;
  agent_email: string;
  agent_phone: string;
  amount: number;
  currency: string;
  method: string;
  destination: string;  // phone number or bank account
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  processed_at?: string;
  payment_reference: string;
  transaction_id: string;
}

/* ─── Create Withdrawal Request ─── */

/**
 * Creates a pending withdrawal request and notifies the founder.
 * Does NOT debit the wallet — that happens when the founder approves.
 */
export async function createWithdrawalRequest(params: {
  amount: number;
  currency: string;
  method: 'orange_money' | 'mtn_money' | 'bank';
  phoneNumber?: string;
  bankAccount?: string;
}): Promise<{ data: TransactionData | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Non authentifié') };

  // Verify wallet balance
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', user.id)
    .single();

  if (!wallet || Number(wallet.balance) < params.amount) {
    return { data: null, error: new Error('Solde insuffisant') };
  }

  if (params.amount < 10000) {
    return { data: null, error: new Error('Montant minimum : 10 000 GNF') };
  }

  // Generate reference
  const prefix = params.method === 'orange_money' ? 'OM' : params.method === 'mtn_money' ? 'MTN' : 'BK';
  const reference = `${prefix}-WD-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const destination = params.method === 'bank'
    ? params.bankAccount || ''
    : params.phoneNumber || '';

  // Get agent profile for the notification
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', user.id)
    .single();

  const agentName = profile?.full_name || user.email || 'Agent';
  const agentPhone = profile?.phone || '';

  // Calculate platform fee (5% for basic plan)
  const platformFee = Math.round(params.amount * 0.05);
  const netAmount = params.amount - platformFee;

  // Create PENDING withdrawal transaction (wallet NOT debited yet)
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      payer_id: user.id,
      receiver_id: user.id,
      amount: params.amount,
      currency: params.currency,
      payment_method: params.method,
      payment_reference: reference,
      type: 'withdrawal',
      status: 'pending',
      description: 'Demande de retrait',
      metadata: {
        withdrawal_request: true,
        mvp_manual_mode: true,
        destination,
        method_label: params.method === 'orange_money' ? 'Orange Money'
          : params.method === 'mtn_money' ? 'MTN Money' : 'Virement bancaire',
        agent_name: agentName,
        agent_email: user.email,
        agent_phone: agentPhone,
        platform_fee: platformFee,
        net_amount: netAmount,
        requested_at: new Date().toISOString(),
      },
    })
    .select()
    .single();

  if (txError || !transaction) {
    return { data: null, error: txError || new Error('Erreur création demande') };
  }

  // Send email notification to founder (non-blocking)
  sendFounderNotification({
    transactionId: transaction.id,
    reference,
    agentName,
    agentEmail: user.email || '',
    agentPhone,
    agentId: user.id,
    amount: params.amount,
    platformFee,
    netAmount,
    currency: params.currency,
    method: params.method,
    destination,
  }).catch(err => console.error('[Withdrawal] Notification error:', err));

  // Create in-app notification for admin(s)
  const { data: adminRoles } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin');

  if (adminRoles) {
    for (const admin of adminRoles) {
      createNotification({
        userId: admin.user_id,
        title: 'Demande de retrait',
        message: `${agentName} demande un retrait de ${formatAmount(params.amount)} ${params.currency} vers ${destination}.`,
        type: 'withdrawal_request',
        metadata: {
          transaction_id: transaction.id,
          agent_id: user.id,
          amount: params.amount,
          method: params.method,
          destination,
        },
      }).catch(() => {});
    }
  }

  return {
    data: { ...transaction, amount: Number(transaction.amount) } as TransactionData,
    error: null,
  };
}

/* ─── Send founder notification via Edge Function ─── */

async function sendFounderNotification(params: {
  transactionId: string;
  reference: string;
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  agentId: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  method: string;
  destination: string;
}): Promise<void> {
  try {
    await supabase.functions.invoke('send-withdrawal-notification', {
      body: {
        founderEmail: FOUNDER_EMAIL,
        founderPhone: FOUNDER_PHONE,
        ...params,
      },
    });
  } catch (err) {
    console.error('[Withdrawal] Edge function error:', err);
  }
}

/* ─── Get all withdrawal requests (admin) ─── */

export async function getWithdrawalRequests(options?: {
  status?: string;
  limit?: number;
}): Promise<{ data: WithdrawalRequest[]; error: Error | null }> {
  let query = supabase
    .from('transactions')
    .select('*')
    .eq('type', 'withdrawal')
    .order('created_at', { ascending: false });

  if (options?.status) query = query.eq('status', options.status);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error || !data) return { data: [], error };

  return {
    data: data.map(tx => {
      const meta = (tx.metadata || {}) as Record<string, unknown>;
      return {
        id: tx.id,
        agent_id: tx.payer_id,
        agent_name: (meta.agent_name as string) || 'Agent',
        agent_email: (meta.agent_email as string) || '',
        agent_phone: (meta.agent_phone as string) || '',
        amount: Number(tx.amount),
        currency: tx.currency,
        method: tx.payment_method,
        destination: (meta.destination as string) || '',
        status: tx.status as 'pending' | 'completed' | 'rejected',
        created_at: tx.created_at,
        processed_at: (meta.processed_at as string) || undefined,
        payment_reference: tx.payment_reference || '',
        transaction_id: tx.id,
      };
    }),
    error: null,
  };
}

/* ─── Approve withdrawal (admin) ─── */

/**
 * Admin marks a withdrawal as completed:
 * 1. Updates transaction status to 'completed'
 * 2. Debits the agent's wallet
 * 3. Notifies the agent
 */
export async function approveWithdrawal(transactionId: string): Promise<{ error: Error | null }> {
  // Fetch the transaction
  const { data: tx, error: fetchErr } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .eq('type', 'withdrawal')
    .eq('status', 'pending')
    .single();

  if (fetchErr || !tx) {
    return { error: new Error('Demande introuvable ou déjà traitée') };
  }

  const amount = Number(tx.amount);
  const agentId = tx.payer_id;
  const meta = (tx.metadata || {}) as Record<string, unknown>;

  // Verify wallet still has funds
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', agentId)
    .single();

  if (!wallet || Number(wallet.balance) < amount) {
    return { error: new Error('Solde agent insuffisant pour débiter') };
  }

  // Update transaction status
  const { error: updateErr } = await supabase
    .from('transactions')
    .update({
      status: 'completed',
      metadata: {
        ...meta,
        processed_at: new Date().toISOString(),
        approved_by: (await supabase.auth.getUser()).data.user?.id,
      },
    })
    .eq('id', transactionId);

  if (updateErr) return { error: updateErr };

  // Debit agent's wallet
  const { error: walletErr } = await supabase
    .from('wallets')
    .update({
      balance: Number(wallet.balance) - amount,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', agentId);

  if (walletErr) return { error: walletErr };

  // Notify agent
  const netAmount = (meta.net_amount as number) || amount;
  await createNotification({
    userId: agentId,
    title: 'Retrait effectué',
    message: `Votre retrait de ${formatAmount(netAmount)} ${tx.currency} a été traité avec succès. Les fonds ont été envoyés vers ${(meta.destination as string) || 'votre compte'}.`,
    type: 'withdrawal_completed',
    metadata: { transaction_id: transactionId },
  }).catch(() => {});

  return { error: null };
}

/* ─── Reject withdrawal (admin) ─── */

export async function rejectWithdrawal(transactionId: string, reason?: string): Promise<{ error: Error | null }> {
  const { data: tx, error: fetchErr } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .eq('type', 'withdrawal')
    .eq('status', 'pending')
    .single();

  if (fetchErr || !tx) {
    return { error: new Error('Demande introuvable ou déjà traitée') };
  }

  const meta = (tx.metadata || {}) as Record<string, unknown>;

  // Update status to rejected (wallet NOT debited)
  const { error: updateErr } = await supabase
    .from('transactions')
    .update({
      status: 'failed',
      metadata: {
        ...meta,
        rejected: true,
        rejection_reason: reason || 'Rejeté par l\'administrateur',
        processed_at: new Date().toISOString(),
      },
    })
    .eq('id', transactionId);

  if (updateErr) return { error: updateErr };

  // Notify agent
  await createNotification({
    userId: tx.payer_id,
    title: 'Retrait refusé',
    message: `Votre demande de retrait de ${formatAmount(Number(tx.amount))} ${tx.currency} a été refusée. ${reason || 'Contactez l\'administration pour plus d\'informations.'}`,
    type: 'withdrawal_rejected',
    metadata: { transaction_id: transactionId, reason },
  }).catch(() => {});

  return { error: null };
}
