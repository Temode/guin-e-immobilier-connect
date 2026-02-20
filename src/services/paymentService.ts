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

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Use SECURITY DEFINER RPC to atomically update status + credit receiver wallet
  // (bypasses RLS which would prevent updating another user's wallet)
  const { data: rpcResult, error: rpcErr } = await supabase
    .rpc('complete_sandbox_payment', {
      p_transaction_id: transaction.id,
      p_is_success: Math.random() > 0.1,
    });

  if (rpcErr) return { data: null, error: rpcErr };

  const isSuccess = (rpcResult as any)?.status === 'completed';

  // Fetch the final transaction state
  const { data: updated, error: fetchErr } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transaction.id)
    .single();

  if (fetchErr) return { data: null, error: fetchErr };

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
 * Simulate a withdrawal (sandbox mode) — uses withdraw_funds RPC
 */
export async function simulateWithdrawal(params: {
  userId: string;
  amount: number;
  currency: string;
  withdrawMethod: 'orange_money' | 'mtn_money' | 'bank';
  phoneNumber?: string;
  bankAccount?: string;
}): Promise<{ data: TransactionData | null; error: Error | null }> {
  return withdrawFunds({
    amount: params.amount,
    method: params.withdrawMethod,
    phoneNumber: params.phoneNumber,
    bankAccount: params.bankAccount,
  });
}

/**
 * Process a rent payment via SECURITY DEFINER RPC (Phase 4.2)
 * Falls back to direct insert if the RPC function is not yet deployed.
 */
export async function processRentPayment(params: {
  rentalId: string;
  paymentMethod?: 'orange_money' | 'mtn_money' | 'visa' | 'mastercard' | 'bank';
  phoneNumber?: string;
}): Promise<{
  data: { success: boolean; transactionId: string | null; ownerAmount: number; agentAmount: number; status: string } | null;
  error: Error | null;
}> {
  // Try the SECURITY DEFINER RPC first (requires migration 20260220120000 to be applied)
  const { data: rpcResult, error: rpcError } = await supabase.rpc('process_rent_payment', {
    p_rental_id: params.rentalId,
    p_payment_method: params.paymentMethod || 'orange_money',
    p_phone_number: params.phoneNumber || null,
  });

  // If RPC exists and worked, return result
  if (!rpcError) {
    const result = rpcResult as any;
    return {
      data: {
        success: result?.success ?? false,
        transactionId: result?.transaction_id ?? null,
        ownerAmount: Number(result?.owner_amount ?? 0),
        agentAmount: Number(result?.agent_amount ?? 0),
        status: result?.status ?? 'failed',
      },
      error: result?.success ? null : new Error(result?.failure_reason || 'Paiement échoué'),
    };
  }

  // Fallback: direct transaction insert (works without migration applied)
  // The receiver wallet won't be credited in this mode, but the transaction is recorded.
  const { data: rental, error: rentalError } = await supabase
    .from('rentals')
    .select('*, properties:property_id(agent_id, agent_commission_percent)')
    .eq('id', params.rentalId)
    .single();

  if (rentalError || !rental) {
    return { data: null, error: new Error('Location introuvable') };
  }

  const agentId = (rental.properties as any)?.agent_id || null;
  const rentAmount = Number(rental.rent_amount);
  const reference = generateReference(params.paymentMethod || 'orange_money');

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Create completed transaction directly (no RPC needed)
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({
      rental_id: params.rentalId,
      payer_id: (await supabase.auth.getUser()).data.user?.id,
      receiver_id: agentId,
      amount: rentAmount,
      currency: rental.currency || 'GNF',
      payment_method: params.paymentMethod || 'orange_money',
      payment_reference: reference,
      type: 'rent_payment',
      status: 'completed',
      description: `Loyer - ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
      metadata: {
        sandbox: true,
        fallback_mode: true,
        phone_number: params.phoneNumber || null,
      },
    })
    .select()
    .single();

  if (txError || !transaction) {
    return { data: null, error: txError || new Error('Erreur création transaction') };
  }

  return {
    data: {
      success: true,
      transactionId: transaction.id,
      ownerAmount: 0,
      agentAmount: rentAmount,
      status: 'completed',
    },
    error: null,
  };
}

/**
 * Withdraw funds from wallet via SECURITY DEFINER RPC (Phase 4.2)
 * Commission rate depends on subscription plan:
 *   - free: ~9%  | basic: ~5.5%  | pro: ~3.5%  | enterprise: ~1.5%
 */
export async function withdrawFunds(params: {
  amount: number;
  method: 'orange_money' | 'mtn_money' | 'bank';
  phoneNumber?: string;
  bankAccount?: string;
}): Promise<{ data: TransactionData | null; error: Error | null }> {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const { data: rpcResult, error } = await supabase.rpc('withdraw_funds', {
    p_amount: params.amount,
    p_method: params.method,
    p_phone_number: params.phoneNumber || null,
    p_bank_account: params.bankAccount || null,
  });

  if (error) return { data: null, error };

  const result = rpcResult as any;
  if (!result?.success) {
    return { data: null, error: new Error(result?.failure_reason || result?.error || 'Retrait échoué') };
  }

  // Fetch the created transaction
  const { data: tx } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', result.transaction_id)
    .single();

  return {
    data: tx ? { ...tx, amount: Number(tx.amount) } as TransactionData : null,
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
