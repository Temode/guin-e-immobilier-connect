/**
 * Edge Function: djomy-webhook
 *
 * Receives webhook notifications from Djomy after payment processing.
 * Events: payment.success, payment.failed
 *
 * Flow:
 * 1. Validate X-Webhook-Signature (HMAC-SHA256)
 * 2. Find the matching transaction by djomy_transaction_id or merchantTransactionId
 * 3. On success: update transaction status, credit agent's wallet, notify agent
 * 4. On failure: update transaction status
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { validateWebhookSignature } from '../_shared/djomy.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabaseAdmin = getSupabaseAdmin();

  try {
    // Read raw body for signature validation
    const rawBody = await req.text();
    const signatureHeader = req.headers.get('X-Webhook-Signature') || req.headers.get('x-webhook-signature') || '';

    // Validate signature (skip in sandbox — Djomy sandbox may not sign correctly)

    // Validate signature (skip in sandbox if no valid signature — Djomy sandbox may not sign)
    const djomyEnv = Deno.env.get('DJOMY_ENV') || 'sandbox';
    const isValid = await validateWebhookSignature(rawBody, signatureHeader);
    if (!isValid) {
      if (djomyEnv === 'production') {
        console.error('Invalid webhook signature (production — rejecting)');
        await supabaseAdmin.from('webhook_events').insert({
          source: 'djomy',
          event_type: 'signature_invalid',
          payload: { raw_body_preview: rawBody.slice(0, 500) },
          processed: false,
        });
        return new Response(JSON.stringify({ error: 'Signature invalide' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      console.warn('[WEBHOOK] Signature mismatch in sandbox — processing anyway');
    }

    // Parse the webhook payload
    // Djomy format: { eventType, eventId, data: { transactionId, status, paidAmount, merchantPaymentReference, ... }, metadata, timestamp }
    const payload = JSON.parse(rawBody);
    const eventType = payload.eventType;
    const djomyTransactionId = payload.data?.transactionId;
    const merchantPaymentReference = payload.data?.merchantPaymentReference;
    const djomyStatus = payload.data?.status;

    console.log(`Djomy webhook received: eventType=${eventType}, txId=${djomyTransactionId}, merchantRef=${merchantPaymentReference}, status=${djomyStatus}`);

    // Log the webhook event
    await supabaseAdmin.from('webhook_events').insert({
      source: 'djomy',
      event_type: eventType,
      djomy_transaction_id: djomyTransactionId,
      payload,
      processed: false,
    });

    // Find the matching transaction
    // merchantPaymentReference is stored as payment_reference in our DB
    let transaction = null;

    // Search by merchantPaymentReference (stored as payment_reference)
    if (merchantPaymentReference) {
      const { data: txByRef } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('payment_reference', merchantPaymentReference)
        .in('status', ['pending', 'completed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      transaction = txByRef;
    }

    // Fallback: search by djomy_transaction_id stored in metadata
    if (!transaction && djomyTransactionId) {
      const { data: txByMeta } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .contains('metadata', { djomy_transaction_id: djomyTransactionId })
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      transaction = txByMeta;
    }

    if (!transaction) {
      console.error(`Transaction not found: merchantRef=${merchantPaymentReference}, djomyTxId=${djomyTransactionId}`);
      // Return 200 anyway so Djomy doesn't keep retrying
      return new Response(JSON.stringify({ received: true, error: 'Transaction introuvable' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process based on event type — Djomy field is 'eventType'
    if (eventType === 'payment.success') {
      // Update transaction to completed
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'completed',
          metadata: {
            ...transaction.metadata,
            djomy_transaction_id: djomyTransactionId,
            djomy_status: djomyStatus,
            processed_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      // Credit the agent's wallet atomically (receiver_id = agent)
      // Uses INSERT ON CONFLICT to either create or add to existing balance
      const txAmount = Number(transaction.amount);
      await supabaseAdmin.rpc('credit_wallet_atomic', {
        p_user_id: transaction.receiver_id,
        p_amount: txAmount,
        p_currency: transaction.currency,
      });

      // Send notification to the agent
      await supabaseAdmin.from('notifications').insert({
        user_id: transaction.receiver_id,
        title: 'Paiement de loyer reçu',
        message: `Un paiement de ${txAmount.toLocaleString('fr-FR')} ${transaction.currency} a été reçu pour le loyer.`,
        type: 'payment_received',
        metadata: {
          transaction_id: transaction.id,
          amount: txAmount,
          currency: transaction.currency,
          payer_id: transaction.payer_id,
        },
      });

      // Mark webhook event as processed
      await supabaseAdmin
        .from('webhook_events')
        .update({ processed: true })
        .eq('djomy_transaction_id', djomyTransactionId)
        .eq('event_type', eventType);

      console.log(`Payment completed: tx=${transaction.id}, amount=${txAmount} ${transaction.currency}`);
    } else if (eventType === 'payment.failed') {
      // Update transaction to failed
      const failureReason = payload.data?.failureReason || payload.error || 'Paiement refusé par le réseau mobile';
      await supabaseAdmin
        .from('transactions')
        .update({
          status: 'failed',
          metadata: {
            ...transaction.metadata,
            djomy_transaction_id: djomyTransactionId,
            djomy_status: djomyStatus,
            failure_reason: failureReason,
            processed_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', transaction.id);

      // Mark webhook event as processed
      await supabaseAdmin
        .from('webhook_events')
        .update({ processed: true })
        .eq('djomy_transaction_id', djomyTransactionId)
        .eq('event_type', eventType);

      console.log(`Payment failed: tx=${transaction.id}, reason=${failureReason}`);
    } else {
      console.log(`Unhandled event type: ${eventType}`);
    }

    // Always return 200 to Djomy so they don't retry
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne';
    console.error('djomy-webhook error:', error);
    // Still return 200 to prevent retries; we've logged the event
    return new Response(JSON.stringify({ received: true, error: message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
