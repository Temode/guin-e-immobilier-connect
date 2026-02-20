/**
 * Djomy Payment Service - Frontend client
 *
 * Calls Supabase Edge Functions to interact with the Djomy API.
 * All sensitive operations (HMAC auth, API keys) stay server-side.
 */
import { supabase } from '@/integrations/supabase/client';

export interface DjomyPaymentResult {
  success: boolean;
  transactionId: string | null;
  djomyTransactionId: string | null;
  status: string;
  message: string;
}

export interface DjomyStatusResult {
  transactionId: string;
  djomyTransactionId?: string;
  status: string;
  djomyStatus?: string;
  amount: number;
  currency: string;
  updatedAt?: string;
  message?: string;
}

/**
 * Initiate a rent payment via Djomy (OM or MOMO)
 * Calls the djomy-payment Edge Function which handles Djomy API auth + payment initiation.
 * The payment sends a push notification to the payer's phone for validation.
 */
export async function initiateDjomyPayment(params: {
  rentalId: string;
  paymentMethod: 'orange_money' | 'mtn_money';
  phoneNumber: string;
}): Promise<DjomyPaymentResult> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return { success: false, transactionId: null, djomyTransactionId: null, status: 'error', message: 'Non authentifié' };
  }

  const { data, error } = await supabase.functions.invoke('djomy-payment', {
    body: {
      rentalId: params.rentalId,
      paymentMethod: params.paymentMethod,
      phoneNumber: params.phoneNumber,
    },
  });

  if (error) {
    return {
      success: false,
      transactionId: null,
      djomyTransactionId: null,
      status: 'error',
      message: error.message || 'Erreur lors de l\'initiation du paiement',
    };
  }

  return {
    success: data?.success ?? false,
    transactionId: data?.transactionId ?? null,
    djomyTransactionId: data?.djomyTransactionId ?? null,
    status: data?.status ?? 'error',
    message: data?.message ?? 'Erreur inconnue',
  };
}

/**
 * Check payment status (polls our DB + Djomy API via Edge Function)
 */
export async function checkPaymentStatus(params: {
  transactionId: string;
  djomyTransactionId?: string;
}): Promise<DjomyStatusResult> {
  const { data, error } = await supabase.functions.invoke('djomy-status', {
    body: {
      transactionId: params.transactionId,
      djomyTransactionId: params.djomyTransactionId,
    },
  });

  if (error) {
    return {
      transactionId: params.transactionId,
      status: 'error',
      amount: 0,
      currency: 'GNF',
      message: error.message,
    };
  }

  return {
    transactionId: data?.transactionId ?? params.transactionId,
    djomyTransactionId: data?.djomyTransactionId,
    status: data?.status ?? 'pending',
    djomyStatus: data?.djomyStatus,
    amount: data?.amount ?? 0,
    currency: data?.currency ?? 'GNF',
    updatedAt: data?.updatedAt,
  };
}

/**
 * Poll payment status until completed or failed (or timeout)
 * Returns the final status after polling.
 *
 * @param transactionId - Our internal transaction ID
 * @param djomyTransactionId - Djomy's transaction ID
 * @param onStatusChange - Callback called on each poll with the latest status
 * @param maxAttempts - Maximum number of polls (default 30 = ~2.5 minutes)
 * @param intervalMs - Polling interval in ms (default 5000 = 5 seconds)
 */
export async function pollPaymentStatus(params: {
  transactionId: string;
  djomyTransactionId?: string;
  onStatusChange?: (status: DjomyStatusResult) => void;
  maxAttempts?: number;
  intervalMs?: number;
}): Promise<DjomyStatusResult> {
  const maxAttempts = params.maxAttempts ?? 30;
  const intervalMs = params.intervalMs ?? 5000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await checkPaymentStatus({
      transactionId: params.transactionId,
      djomyTransactionId: params.djomyTransactionId,
    });

    params.onStatusChange?.(result);

    if (result.status === 'completed' || result.status === 'failed') {
      return result;
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  // Timeout
  return {
    transactionId: params.transactionId,
    status: 'pending',
    amount: 0,
    currency: 'GNF',
    message: 'Délai d\'attente dépassé. Le paiement est toujours en cours de traitement.',
  };
}
