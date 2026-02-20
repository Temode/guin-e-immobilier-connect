import { supabase } from '@/integrations/supabase/client';

export interface WalletData {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionData {
  id: string;
  rental_id: string | null;
  payer_id: string;
  receiver_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_reference: string | null;
  type: string;
  status: string;
  description: string | null;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}

/**
 * Get or create wallet for a user
 */
export async function getOrCreateWallet(userId: string): Promise<{ data: WalletData | null; error: Error | null }> {
  // Try to fetch existing wallet
  const { data: existing, error: fetchErr } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchErr) return { data: null, error: fetchErr };
  if (existing) return { data: { ...existing, balance: Number(existing.balance) }, error: null };

  // Create wallet
  const { data: created, error: createErr } = await supabase
    .from('wallets')
    .insert({ user_id: userId })
    .select()
    .single();

  if (createErr) return { data: null, error: createErr };
  return { data: { ...created, balance: Number(created.balance) }, error: null };
}

/**
 * Get transactions for a user (as payer or receiver)
 */
export async function getUserTransactions(
  userId: string,
  options?: { limit?: number; status?: string; type?: string }
): Promise<{ data: TransactionData[]; error: Error | null }> {
  let query = supabase
    .from('transactions')
    .select('*')
    .or(`payer_id.eq.${userId},receiver_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (options?.limit) query = query.limit(options.limit);
  if (options?.status) query = query.eq('status', options.status);
  if (options?.type) query = query.eq('type', options.type);

  const { data, error } = await query;
  if (error || !data) return { data: [], error };

  return {
    data: data.map(t => ({ ...t, amount: Number(t.amount) })) as TransactionData[],
    error: null,
  };
}

/**
 * Simulate a rent payment (sandbox mode)
 * In production, this would integrate with Orange Money / MTN / Visa APIs
 */
export async function simulateRentPayment(params: {
  rentalId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  currency: string;
  paymentMethod: 'orange_money' | 'mtn_money' | 'visa' | 'mastercard' | 'bank';
  description?: string;
  phoneNumber?: string;
  cardLast4?: string;
}): Promise<{ data: TransactionData | null; error: Error | null }> {
  const reference = generateReference(params.paymentMethod);
  
  // Create transaction as pending
  const { data: transaction, error: txErr } = await supabase
    .from('transactions')
    .insert({
      rental_id: params.rentalId,
      payer_id: params.payerId,
      receiver_id: params.receiverId,
      amount: params.amount,
      currency: params.currency,
      payment_method: params.paymentMethod,
      payment_reference: reference,
      type: 'rent_payment',
      status: 'pending',
      description: params.description || 'Paiement de loyer',
      metadata: {
        sandbox: true,
        phone_number: params.phoneNumber || null,
        card_last4: params.cardLast4 || null,
      },
    })
    .select()
    .single();

  if (txErr) return { data: null, error: txErr };

  // Simulate processing delay (1-2 seconds)
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Simulate success (90% chance) or failure (10% chance)
  const isSuccess = Math.random() > 0.1;
  const finalStatus = isSuccess ? 'completed' : 'failed';

  const { data: updated, error: updateErr } = await supabase
    .from('transactions')
    .update({
      status: finalStatus,
      metadata: {
        ...(transaction.metadata as Record<string, unknown>),
        sandbox: true,
        processed_at: new Date().toISOString(),
        failure_reason: isSuccess ? null : 'Solde insuffisant (simulation)',
      },
    })
    .eq('id', transaction.id)
    .select()
    .single();

  if (updateErr) return { data: null, error: updateErr };

  // If success, update wallets
  if (isSuccess) {
    // Credit receiver wallet
    const { data: receiverWallet } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', params.receiverId)
      .single();

    if (receiverWallet) {
      await supabase
        .from('wallets')
        .update({ balance: Number(receiverWallet.balance) + params.amount })
        .eq('user_id', params.receiverId);
    }
  }

  return {
    data: updated ? { ...updated, amount: Number(updated.amount) } as TransactionData : null,
    error: null,
  };
}

/**
 * Get payment stats for a user
 */
export async function getPaymentStats(userId: string, role: 'tenant' | 'agent'): Promise<{
  totalPaid: number;
  totalReceived: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  currency: string;
}> {
  const field = role === 'tenant' ? 'payer_id' : 'receiver_id';
  
  const { data: transactions } = await supabase
    .from('transactions')
    .select('amount, status, payer_id, receiver_id')
    .eq(field, userId);

  const txs = (transactions || []).map(t => ({ ...t, amount: Number(t.amount) }));

  return {
    totalPaid: txs.filter(t => t.payer_id === userId && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
    totalReceived: txs.filter(t => t.receiver_id === userId && t.status === 'completed').reduce((s, t) => s + t.amount, 0),
    completedCount: txs.filter(t => t.status === 'completed').length,
    pendingCount: txs.filter(t => t.status === 'pending').length,
    failedCount: txs.filter(t => t.status === 'failed').length,
    currency: 'GNF',
  };
}

function generateReference(method: string): string {
  const prefix = method === 'orange_money' ? 'OM' : method === 'mtn_money' ? 'MTN' : method === 'visa' ? 'VISA' : method === 'mastercard' ? 'MC' : 'BK';
  const rand = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${Date.now()}-${rand}`;
}

/**
 * Simulate a withdrawal (sandbox mode)
 */
export async function simulateWithdrawal(params: {
  userId: string;
  amount: number;
  currency: string;
  withdrawMethod: 'orange_money' | 'mtn_money' | 'bank';
  phoneNumber?: string;
  bankAccount?: string;
}): Promise<{ data: TransactionData | null; error: Error | null }> {
  // Verify wallet balance
  const { data: wallet, error: walletErr } = await getOrCreateWallet(params.userId);
  if (walletErr || !wallet) return { data: null, error: walletErr || new Error('Portefeuille introuvable') };

  const platformFee = Math.round(params.amount * 0.05);
  const netAmount = params.amount - platformFee;

  if (wallet.balance < params.amount) {
    return { data: null, error: new Error('Solde insuffisant pour ce retrait') };
  }

  const reference = generateReference(params.withdrawMethod);

  // Create withdrawal transaction as pending
  const { data: transaction, error: txErr } = await supabase
    .from('transactions')
    .insert({
      payer_id: params.userId,
      receiver_id: params.userId,
      amount: params.amount,
      currency: params.currency,
      payment_method: params.withdrawMethod,
      payment_reference: reference,
      type: 'withdrawal',
      status: 'pending',
      description: 'Retrait de fonds',
      metadata: {
        sandbox: true,
        phone_number: params.phoneNumber || null,
        bank_account: params.bankAccount || null,
        platform_fee: platformFee,
        net_amount: netAmount,
      },
    })
    .select()
    .single();

  if (txErr) return { data: null, error: txErr };

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate success (85% chance)
  const isSuccess = Math.random() > 0.15;
  const finalStatus = isSuccess ? 'completed' : 'failed';

  const { data: updated, error: updateErr } = await supabase
    .from('transactions')
    .update({
      status: finalStatus,
      metadata: {
        ...(transaction.metadata as Record<string, unknown>),
        processed_at: new Date().toISOString(),
        failure_reason: isSuccess ? null : 'Échec du transfert (simulation)',
      },
    })
    .eq('id', transaction.id)
    .select()
    .single();

  if (updateErr) return { data: null, error: updateErr };

  // If success, debit wallet
  if (isSuccess) {
    await supabase
      .from('wallets')
      .update({ balance: wallet.balance - params.amount })
      .eq('user_id', params.userId);
  }

  return {
    data: updated ? { ...updated, amount: Number(updated.amount) } as TransactionData : null,
    error: null,
  };
}

/**
 * Format amount with spaces
 */
export function formatAmount(amount: number): string {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Get payment method display info
 */
export function getPaymentMethodInfo(method: string): { label: string; icon: string; color: string } {
  switch (method) {
    case 'orange_money':
      return { label: 'Orange Money', icon: '🟠', color: 'orange' };
    case 'mtn_money':
      return { label: 'MTN Money', icon: '🟡', color: 'mtn' };
    case 'visa':
      return { label: 'Visa', icon: '💳', color: 'visa' };
    case 'mastercard':
      return { label: 'Mastercard', icon: '💳', color: 'mastercard' };
    case 'bank':
      return { label: 'Virement bancaire', icon: '🏦', color: 'bank' };
    default:
      return { label: 'Non défini', icon: '—', color: '' };
  }
}

/**
 * Get transaction status display info
 */
export function getTransactionStatusInfo(status: string): { label: string; color: string } {
  switch (status) {
    case 'completed':
      return { label: 'Payé', color: 'success' };
    case 'pending':
      return { label: 'En attente', color: 'pending' };
    case 'failed':
      return { label: 'Échoué', color: 'failed' };
    default:
      return { label: status, color: '' };
  }
}
