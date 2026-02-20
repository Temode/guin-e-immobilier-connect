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

    // Validate signature
    const isValid = await validateWebhookSignature(rawBody, signatureHeader);
    if (!isValid) {
      console.error('Invalid webhook signature');
      // Log the failed attempt
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

    // Parse the webhook payload
    const payload = JSON.parse(rawBody);
    const {
      event,
      transactionId: djomyTransactionId,
      merchantTransactionId,
      amount,
      currency,
      paymentMethod,
      status: djomyStatus,
    } = payload;

    console.log(`Djomy webhook received: event=${event}, txId=${djomyTransactionId}, status=${djomyStatus}`);

    // Log the webhook event
    await supabaseAdmin.from('webhook_events').insert({
      source: 'djomy',
      event_type: event,
      djomy_transaction_id: djomyTransactionId,
      payload,
      processed: false,
    });

    // Find the matching transaction
    // Try by djomy_transaction_id in metadata first, then by payment_reference (merchantTransactionId)
    let transaction = null;
    let txError = null;

    // Search by merchantTransactionId (stored as payment_reference)
    const { data: txByRef, error: err1 } = await supabaseAdmin
      .from('transactions')
      .select('*')
      .eq('payment_reference', merchantTransactionId)
      .eq('status', 'pending')
      .single();

    if (txByRef) {
      transaction = txByRef;
    } else {
      // Fallback: search by djomy_transaction_id in metadata
      const { data: txByMeta, error: err2 } = await supabaseAdmin
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .contains('metadata', { djomy_transaction_id: djomyTransactionId })
        .single();

      transaction = txByMeta;
      txError = err2;
    }

    if (!transaction) {
      console.error(`Transaction not found: merchantTxId=${merchantTransactionId}, djomyTxId=${djomyTransactionId}`);
      return new Response(JSON.stringify({ error: 'Transaction introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process based on event type
    if (event === 'payment.success') {
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
        .eq('event_type', event);

      console.log(`Payment completed: tx=${transaction.id}, amount=${txAmount} ${transaction.currency}`);
    } else if (event === 'payment.failed') {
      // Update transaction to failed
      const failureReason = payload.failureReason || payload.error || 'Paiement refusé par le réseau mobile';
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
        .eq('event_type', event);

      console.log(`Payment failed: tx=${transaction.id}, reason=${failureReason}`);
    } else {
      console.log(`Unhandled event type: ${event}`);
    }

    // Always return 200 to Djomy so they don't retry
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('djomy-webhook error:', error);
    // Still return 200 to prevent retries; we've logged the event
    return new Response(JSON.stringify({ received: true, error: error.message }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
