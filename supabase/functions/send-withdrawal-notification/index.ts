/**
 * Edge Function: send-withdrawal-notification
 *
 * Envoie un email de notification au fondateur lorsqu'un agent
 * demande un retrait de fonds. Utilise Resend API.
 *
 * En MVP, les retraits sont manuels :
 * 1. L'agent soumet sa demande
 * 2. Le fondateur reçoit cet email
 * 3. Le fondateur effectue le transfert manuellement
 * 4. Le fondateur marque comme "complété" dans le backoffice
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function buildFounderEmailHtml(params: {
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
  reference: string;
  transactionId: string;
}): string {
  const methodLabel = params.method === 'orange_money' ? 'Orange Money'
    : params.method === 'mtn_money' ? 'MTN Money' : 'Virement bancaire';

  const date = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#F59E0B,#D97706);border-radius:16px 16px 0 0;padding:28px 24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;">Demande de Retrait</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">${date}</p>
    </div>

    <!-- Body -->
    <div style="background:white;border-radius:0 0 16px 16px;padding:28px 24px;border:1px solid #E2E8F0;border-top:none;">
      <p style="color:#1E293B;font-size:15px;margin:0 0 20px;">
        Un agent a soumis une demande de retrait qui nécessite votre action :
      </p>

      <!-- Agent Info -->
      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#065F46;font-size:14px;">INFORMATIONS AGENT</h3>
        <table style="width:100%;font-size:14px;color:#334155;">
          <tr><td style="padding:4px 0;color:#64748B;">Nom</td><td style="padding:4px 0;text-align:right;font-weight:600;">${params.agentName}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">ID Agent</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:12px;">${params.agentId.substring(0, 8)}...</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Email</td><td style="padding:4px 0;text-align:right;">${params.agentEmail}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Téléphone</td><td style="padding:4px 0;text-align:right;">${params.agentPhone || 'Non renseigné'}</td></tr>
        </table>
      </div>

      <!-- Withdrawal Details -->
      <div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#92400E;font-size:14px;">DÉTAILS DU RETRAIT</h3>
        <table style="width:100%;font-size:14px;color:#334155;">
          <tr><td style="padding:4px 0;color:#64748B;">Montant demandé</td><td style="padding:4px 0;text-align:right;font-weight:700;font-size:18px;color:#D97706;">${fmtNum(params.amount)} ${params.currency}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Frais plateforme (5%)</td><td style="padding:4px 0;text-align:right;color:#DC2626;">-${fmtNum(params.platformFee)} ${params.currency}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Montant net à transférer</td><td style="padding:4px 0;text-align:right;font-weight:700;color:#16A34A;">${fmtNum(params.netAmount)} ${params.currency}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Méthode</td><td style="padding:4px 0;text-align:right;">${methodLabel}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Destination</td><td style="padding:4px 0;text-align:right;font-weight:600;">${params.destination}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Référence</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:12px;">${params.reference}</td></tr>
        </table>
      </div>

      <!-- Action Required -->
      <div style="background:#FEF2F2;border:2px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 8px;color:#991B1B;font-size:14px;">⚡ ACTION REQUISE</h3>
        <ol style="margin:0;padding-left:20px;color:#7F1D1D;font-size:13px;line-height:1.8;">
          <li>Effectuez le transfert de <strong>${fmtNum(params.netAmount)} ${params.currency}</strong> vers <strong>${params.destination}</strong> via ${methodLabel}</li>
          <li>Connectez-vous au backoffice</li>
          <li>Allez dans <strong>Opérations → Retraits</strong></li>
          <li>Cliquez sur <strong>"Marquer comme payé"</strong> pour la demande ${params.reference}</li>
        </ol>
      </div>

      <p style="color:#64748B;font-size:12px;text-align:center;margin:20px 0 0;">
        Cet email a été envoyé automatiquement par la plateforme Guin-e Immobilier Connect.
      </p>
    </div>
  </div>
</body>
</html>`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      founderEmail,
      agentName, agentEmail, agentPhone, agentId,
      amount, platformFee, netAmount, currency,
      method, destination, reference, transactionId,
    } = body;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    // Build email
    const html = buildFounderEmailHtml({
      agentName, agentEmail, agentPhone, agentId,
      amount, platformFee, netAmount, currency,
      method, destination, reference, transactionId,
    });

    const fmtAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

    if (RESEND_API_KEY) {
      // Send email via Resend
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Guin-e Immobilier <notifications@guin-e-immobilier.com>',
          to: [founderEmail],
          subject: `🔔 Demande de retrait - Agent ${agentName} - ${fmtAmount} ${currency}`,
          html,
        }),
      });

      if (!emailRes.ok) {
        const errText = await emailRes.text();
        console.error('[Withdrawal Email] Resend error:', errText);
      } else {
        console.log('[Withdrawal Email] Sent to founder:', founderEmail);
      }
    } else {
      console.log('[Withdrawal Email] RESEND_API_KEY not configured. Email logged:');
      console.log(`  To: ${founderEmail}`);
      console.log(`  Subject: Demande de retrait - Agent ${agentName}`);
      console.log(`  Amount: ${fmtAmount} ${currency}`);
      console.log(`  Destination: ${destination}`);
      console.log(`  Reference: ${reference}`);
    }

    // SMS notification (placeholder — configure Twilio/Africa's Talking)
    const smsMessage = `🔔 Retrait demandé : ${agentName} veut retirer ${fmtAmount} ${currency} vers ${destination}. ID: ${reference}. Consultez votre email pour détails.`;

    // TODO: Uncomment and configure when SMS service is ready
    // const TWILIO_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
    // const TWILIO_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
    // const TWILIO_FROM = Deno.env.get('TWILIO_PHONE_NUMBER');
    // if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM && founderPhone) {
    //   await fetch(`https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
    //       'Content-Type': 'application/x-www-form-urlencoded',
    //     },
    //     body: new URLSearchParams({ To: founderPhone, From: TWILIO_FROM, Body: smsMessage }),
    //   });
    // }

    console.log('[Withdrawal SMS] Message:', smsMessage);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-withdrawal-notification] Error:', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
