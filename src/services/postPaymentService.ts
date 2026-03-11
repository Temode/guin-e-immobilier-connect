/**
 * Post-Payment Service — Orchestrateur après paiement réussi
 *
 * Appelé automatiquement quand un paiement de loyer passe en status 'completed'.
 * Coordonne :
 * 1. Création des notifications in-platform (locataire, agent, propriétaire, admins)
 * 2. Envoi d'emails de confirmation via Edge Function (avec reçu PDF en PJ)
 * 3. Préparation du reçu pour téléchargement immédiat
 */
import { supabase } from '@/integrations/supabase/client';
import { createPaymentNotifications } from './notificationService';

/* ─── Types ─── */

interface PostPaymentResult {
  notifications: { sent: boolean; error?: string };
  email: { sent: boolean; error?: string };
}

/* ─── Main orchestrator ─── */

/**
 * Handle all post-payment actions after a successful rent payment.
 * This function is fire-and-forget — errors are logged but do not block the UI.
 */
export async function handlePostPaymentSuccess(transactionId: string): Promise<PostPaymentResult> {
  const result: PostPaymentResult = {
    notifications: { sent: false },
    email: { sent: false },
  };

  try {
    // 1. Load transaction + rental + profiles for context
    const context = await loadPaymentContext(transactionId);
    if (!context) {
      console.error('[PostPayment] Could not load context for transaction:', transactionId);
      result.notifications.error = 'Contexte introuvable';
      result.email.error = 'Contexte introuvable';
      return result;
    }

    // 2. Create in-platform notifications (all parties)
    // 3. Send emails via Edge Function
    // Run in parallel — one failing should not block the other
    const [notifResult, emailResult] = await Promise.allSettled([
      createAllNotifications(context),
      sendPaymentEmails(context),
    ]);

    // Process notification result
    if (notifResult.status === 'fulfilled') {
      result.notifications.sent = !notifResult.value.error;
      if (notifResult.value.error) {
        result.notifications.error = notifResult.value.error.message;
      }
    } else {
      result.notifications.error = notifResult.reason?.message || 'Erreur inconnue';
    }

    // Process email result
    if (emailResult.status === 'fulfilled') {
      result.email.sent = emailResult.value.sent;
      if (emailResult.value.error) {
        result.email.error = emailResult.value.error;
      }
    } else {
      result.email.error = emailResult.reason?.message || 'Erreur inconnue';
    }

    console.log('[PostPayment] Completed:', {
      transactionId,
      notifications: result.notifications.sent,
      email: result.email.sent,
    });
  } catch (err) {
    console.error('[PostPayment] Unhandled error:', err);
  }

  return result;
}

/* ─── Load full payment context ─── */

interface PaymentContext {
  transactionId: string;
  paymentReference: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDate: string;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  agentId: string | null;
  agentName: string | null;
  ownerId: string;
  ownerName: string | null;
  propertyTitle: string;
  propertyAddress: string;
  rentPeriod: string;
}

async function loadPaymentContext(transactionId: string): Promise<PaymentContext | null> {
  // Fetch transaction
  const { data: tx } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (!tx || !tx.rental_id) return null;

  // Fetch rental
  const { data: rental } = await supabase
    .from('rentals')
    .select('*')
    .eq('id', tx.rental_id)
    .single();

  if (!rental) return null;

  // Fetch profiles + property in parallel
  const [propertyRes, tenantRes, agentRes, ownerRes] = await Promise.all([
    supabase.from('properties').select('title, city, commune, quartier, address').eq('id', rental.property_id).single(),
    supabase.from('profiles').select('full_name, phone').eq('id', rental.tenant_id).single(),
    rental.agent_id
      ? supabase.from('profiles').select('full_name').eq('id', rental.agent_id).single()
      : Promise.resolve({ data: null }),
    supabase.from('profiles').select('full_name').eq('id', rental.owner_id).single(),
  ]);

  const property = propertyRes.data;
  const paymentDate = new Date(tx.created_at);
  const addressParts = [property?.quartier, property?.commune, property?.city].filter(Boolean);

  return {
    transactionId: tx.id,
    paymentReference: tx.payment_reference || tx.id.slice(0, 12).toUpperCase(),
    amount: Number(tx.amount),
    currency: tx.currency || 'GNF',
    paymentMethod: tx.payment_method,
    paymentDate: tx.created_at,
    tenantId: rental.tenant_id,
    tenantName: tenantRes.data?.full_name || 'Locataire',
    tenantPhone: tenantRes.data?.phone || '',
    agentId: rental.agent_id,
    agentName: agentRes.data?.full_name || null,
    ownerId: rental.owner_id,
    ownerName: ownerRes.data?.full_name || null,
    propertyTitle: property?.title || 'Logement',
    propertyAddress: property?.address || addressParts.join(', ') || '',
    rentPeriod: paymentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
  };
}

/* ─── Create notifications for all parties ─── */

async function createAllNotifications(ctx: PaymentContext): Promise<{ error: Error | null }> {
  return createPaymentNotifications({
    transactionId: ctx.transactionId,
    tenantId: ctx.tenantId,
    tenantName: ctx.tenantName,
    agentId: ctx.agentId,
    ownerId: ctx.ownerId,
    amount: ctx.amount,
    currency: ctx.currency,
    propertyTitle: ctx.propertyTitle,
    paymentReference: ctx.paymentReference,
    rentPeriod: ctx.rentPeriod,
  });
}

/* ─── Send payment emails via Edge Function ─── */

async function sendPaymentEmails(ctx: PaymentContext): Promise<{ sent: boolean; error?: string }> {
  try {
    const { error } = await supabase.functions.invoke('send-payment-email', {
      body: {
        transactionId: ctx.transactionId,
        paymentReference: ctx.paymentReference,
        amount: ctx.amount,
        currency: ctx.currency,
        paymentMethod: ctx.paymentMethod,
        paymentDate: ctx.paymentDate,
        tenantId: ctx.tenantId,
        tenantName: ctx.tenantName,
        agentId: ctx.agentId,
        agentName: ctx.agentName,
        ownerId: ctx.ownerId,
        ownerName: ctx.ownerName,
        propertyTitle: ctx.propertyTitle,
        propertyAddress: ctx.propertyAddress,
        rentPeriod: ctx.rentPeriod,
      },
    });

    if (error) {
      // Edge Function not deployed or network error — log and continue
      console.warn('[PostPayment] Email Edge Function error:', error.message);
      return { sent: false, error: error.message };
    }

    return { sent: true };
  } catch (err) {
    // CORS or network error — Edge Function likely not deployed
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.warn('[PostPayment] Email Edge Function unavailable:', message);
    return { sent: false, error: 'Service email non disponible' };
  }
}
