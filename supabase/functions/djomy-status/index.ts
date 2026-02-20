/**
 * Edge Function: djomy-status
 *
 * Checks payment status via Djomy GET /v1/payments/{transactionId}/status
 * Called by the tenant frontend for polling during payment confirmation.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getDjomyAuthToken, checkDjomyPaymentStatus } from '../_shared/djomy.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    );

    const { data: { user }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Token invalide' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request
    const { transactionId, djomyTransactionId } = await req.json();

    if (!transactionId && !djomyTransactionId) {
      return new Response(JSON.stringify({ error: 'transactionId ou djomyTransactionId requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // First check our DB for the current status
    let query = supabaseAdmin.from('transactions').select('*');
    if (transactionId) {
      query = query.eq('id', transactionId);
    }
    const { data: transaction } = await query.single();

    if (!transaction) {
      return new Response(JSON.stringify({ error: 'Transaction introuvable' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the user owns this transaction
    if (transaction.payer_id !== user.id && transaction.receiver_id !== user.id) {
      return new Response(JSON.stringify({ error: 'Accès non autorisé' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // If already completed or failed in our DB, return immediately
    if (transaction.status !== 'pending') {
      return new Response(
        JSON.stringify({
          transactionId: transaction.id,
          status: transaction.status,
          amount: Number(transaction.amount),
          currency: transaction.currency,
          updatedAt: transaction.updated_at,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // If still pending, check with Djomy API
    const djomyTxId = djomyTransactionId || transaction.metadata?.djomy_transaction_id;
    if (!djomyTxId) {
      return new Response(
        JSON.stringify({
          transactionId: transaction.id,
          status: 'pending',
          message: 'En attente de confirmation Djomy',
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Poll Djomy API for latest status
    const djomyToken = await getDjomyAuthToken();
    const djomyStatus = await checkDjomyPaymentStatus({
      token: djomyToken,
      transactionId: djomyTxId,
    });

    return new Response(
      JSON.stringify({
        transactionId: transaction.id,
        djomyTransactionId: djomyTxId,
        status: transaction.status,
        djomyStatus: djomyStatus.status,
        amount: Number(transaction.amount),
        currency: transaction.currency,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('djomy-status error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
