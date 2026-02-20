/**
 * Edge Function: djomy-payment
 *
 * Initiates a rent payment via Djomy API (OM/MOMO).
 * Called by the tenant frontend.
 *
 * Flow:
 * 1. Authenticate with Djomy (HMAC-SHA256 + Bearer token)
 * 2. Create a pending transaction in the DB
 * 3. Call Djomy POST /v1/payments (sends push to payer's phone)
 * 4. Store the Djomy transactionId in the DB
 * 5. Return transactionId to frontend for status polling
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getDjomyAuthToken, initiateDjomyPayment } from '../_shared/djomy.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify the caller is authenticated
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Non authentifié' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with the user's JWT to verify identity
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

    // Parse request body
    const { rentalId, paymentMethod, phoneNumber } = await req.json();

    if (!rentalId || !paymentMethod || !phoneNumber) {
      return new Response(JSON.stringify({ error: 'rentalId, paymentMethod et phoneNumber requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Map payment method to Djomy format
    const djomyMethod = paymentMethod === 'orange_money' ? 'OM' : paymentMethod === 'mtn_money' ? 'MOMO' : null;
    if (!djomyMethod) {
      return new Response(JSON.stringify({ error: 'Seuls Orange Money et MTN Money sont supportés via Djomy' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use admin client for DB operations (bypasses RLS)
    const supabaseAdmin = getSupabaseAdmin();

    // Fetch the rental with property info
    const { data: rental, error: rentalError } = await supabaseAdmin
      .from('rentals')
      .select('*, properties:property_id(agent_id, agent_commission_percent)')
      .eq('id', rentalId)
      .eq('tenant_id', user.id)
      .eq('status', 'active')
      .single();

    if (rentalError || !rental) {
      return new Response(JSON.stringify({ error: 'Location introuvable ou non active' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine the receiver (agent_id for now; owner not integrated yet)
    const agentId = rental.properties?.agent_id || rental.agent_id;
    if (!agentId) {
      return new Response(JSON.stringify({ error: 'Aucun agent associé à cette propriété' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rentAmount = Number(rental.rent_amount);
    const currency = rental.currency || 'GNF';
    const merchantTxId = `RENT-${rentalId.slice(0, 8)}-${Date.now()}`;

    // Format phone number for Djomy (ensure international format: 00224...)
    let formattedPhone = phoneNumber.replace(/[\s\-\(\)]/g, '');
    if (formattedPhone.startsWith('+')) {
      formattedPhone = '00' + formattedPhone.slice(1);
    } else if (!formattedPhone.startsWith('00')) {
      formattedPhone = '00224' + formattedPhone;
    }

    // Webhook callback URL (this project's djomy-webhook Edge Function)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const callbackUrl = `${supabaseUrl}/functions/v1/djomy-webhook`;

    // Create pending transaction in DB
    const { data: transaction, error: txError } = await supabaseAdmin
      .from('transactions')
      .insert({
        rental_id: rentalId,
        payer_id: user.id,
        receiver_id: agentId,
        amount: rentAmount,
        currency,
        payment_method: paymentMethod,
        payment_reference: merchantTxId,
        type: 'rent_payment',
        status: 'pending',
        description: `Loyer - ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        metadata: {
          djomy: true,
          phone_number: formattedPhone,
          merchant_transaction_id: merchantTxId,
          full_rent: rentAmount,
          agent_commission_pct: rental.properties?.agent_commission_percent || 0,
        },
      })
      .select()
      .single();

    if (txError || !transaction) {
      return new Response(JSON.stringify({ error: 'Erreur création transaction', details: txError?.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authenticate with Djomy
    const djomyToken = await getDjomyAuthToken();

    // Initiate payment via Djomy
    const djomyResult = await initiateDjomyPayment({
      token: djomyToken,
      paymentMethod: djomyMethod,
      payerIdentifier: formattedPhone,
      amount: rentAmount,
      currency,
      description: `Loyer ${rental.property_id?.toString().slice(0, 8) || ''} - Guin-e Immobilier`,
      merchantTransactionId: merchantTxId,
      callbackUrl,
    });

    // Store Djomy transactionId in our transaction record
    await supabaseAdmin
      .from('transactions')
      .update({
        metadata: {
          ...transaction.metadata,
          djomy_transaction_id: djomyResult.transactionId,
          djomy_status: djomyResult.status,
          djomy_initiated_at: new Date().toISOString(),
        },
      })
      .eq('id', transaction.id);

    // Log webhook event for audit
    await supabaseAdmin.from('webhook_events').insert({
      source: 'djomy',
      event_type: 'payment.initiated',
      djomy_transaction_id: djomyResult.transactionId,
      payload: {
        transaction_id: transaction.id,
        merchant_transaction_id: merchantTxId,
        amount: rentAmount,
        currency,
        payment_method: djomyMethod,
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        transactionId: transaction.id,
        djomyTransactionId: djomyResult.transactionId,
        status: 'pending',
        message: djomyResult.message || 'Paiement initié. Validez sur votre téléphone.',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    console.error('djomy-payment error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Erreur interne' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
