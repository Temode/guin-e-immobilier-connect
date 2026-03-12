/**
 * Edge Function: send-withdrawal-receipt
 *
 * Envoie les reçus de retrait par email à l'agent après approbation/refus
 * par l'administrateur. Utilise Resend API.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function buildApprovalEmailHtml(params: {
  agentName: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  method: string;
  destination: string;
  reference: string;
  requestedAt: string;
  processedAt: string;
}): string {
  const methodLabel = params.method === 'orange_money' ? 'Orange Money'
    : params.method === 'mtn_money' ? 'MTN Money' : 'Virement bancaire';
  const destLabel = params.method === 'bank' ? 'Compte bancaire' : 'Numéro mobile';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#10B981,#059669);border-radius:16px 16px 0 0;padding:28px 24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;">✅ Retrait Approuvé</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Votre demande de retrait a été traitée avec succès</p>
    </div>

    <div style="background:white;border-radius:0 0 16px 16px;padding:28px 24px;border:1px solid #E2E8F0;border-top:none;">
      <p style="color:#1E293B;font-size:15px;margin:0 0 20px;">
        Bonjour <strong>${params.agentName}</strong>,
      </p>
      <p style="color:#475569;font-size:14px;margin:0 0 20px;">
        Nous avons le plaisir de vous confirmer que votre demande de retrait a été approuvée et les fonds ont été transférés vers votre compte.
      </p>

      <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#065F46;font-size:14px;">RÉCAPITULATIF DU RETRAIT</h3>
        <table style="width:100%;font-size:14px;color:#334155;">
          <tr><td style="padding:6px 0;color:#64748B;">Montant demandé</td><td style="padding:6px 0;text-align:right;">${fmtNum(params.amount)} ${params.currency}</td></tr>
          <tr><td style="padding:6px 0;color:#64748B;">Frais plateforme (5%)</td><td style="padding:6px 0;text-align:right;color:#DC2626;">-${fmtNum(params.platformFee)} ${params.currency}</td></tr>
          <tr style="border-top:1px solid #BBF7D0;"><td style="padding:10px 0 6px;color:#065F46;font-weight:700;">Montant net déposé</td><td style="padding:10px 0 6px;text-align:right;font-weight:700;font-size:18px;color:#059669;">${fmtNum(params.netAmount)} ${params.currency}</td></tr>
        </table>
      </div>

      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#334155;font-size:14px;">DESTINATION DU DÉPÔT</h3>
        <table style="width:100%;font-size:14px;color:#334155;">
          <tr><td style="padding:4px 0;color:#64748B;">Mode</td><td style="padding:4px 0;text-align:right;font-weight:600;">${methodLabel}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">${destLabel}</td><td style="padding:4px 0;text-align:right;font-weight:600;">${params.destination}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Référence</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:12px;">${params.reference}</td></tr>
        </table>
      </div>

      <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#334155;font-size:14px;">DATES</h3>
        <table style="width:100%;font-size:14px;color:#334155;">
          <tr><td style="padding:4px 0;color:#64748B;">Demande soumise</td><td style="padding:4px 0;text-align:right;">${formatDateFr(params.requestedAt)}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Approuvée le</td><td style="padding:4px 0;text-align:right;">${formatDateFr(params.processedAt)}</td></tr>
        </table>
      </div>

      <p style="color:#059669;font-size:13px;text-align:center;background:#ECFDF5;padding:12px;border-radius:8px;margin:16px 0;">
        📄 Ce email fait office de reçu officiel de votre retrait.
      </p>

      <p style="color:#94A3B8;font-size:12px;text-align:center;margin:20px 0 0;">
        Guinée Immobilier Connect — Plateforme immobilière de confiance en Guinée
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildRejectionEmailHtml(params: {
  agentName: string;
  amount: number;
  currency: string;
  method: string;
  destination: string;
  reference: string;
  reason: string;
}): string {
  const methodLabel = params.method === 'orange_money' ? 'Orange Money'
    : params.method === 'mtn_money' ? 'MTN Money' : 'Virement bancaire';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:'Inter',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#EF4444,#DC2626);border-radius:16px 16px 0 0;padding:28px 24px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:22px;">❌ Retrait Refusé</h1>
      <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:14px;">Votre demande de retrait n'a pas été approuvée</p>
    </div>

    <div style="background:white;border-radius:0 0 16px 16px;padding:28px 24px;border:1px solid #E2E8F0;border-top:none;">
      <p style="color:#1E293B;font-size:15px;margin:0 0 20px;">
        Bonjour <strong>${params.agentName}</strong>,
      </p>
      <p style="color:#475569;font-size:14px;margin:0 0 20px;">
        Nous vous informons que votre demande de retrait a été refusée par l'administration.
      </p>

      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 12px;color:#991B1B;font-size:14px;">DÉTAILS DE LA DEMANDE REFUSÉE</h3>
        <table style="width:100%;font-size:14px;color:#334155;">
          <tr><td style="padding:4px 0;color:#64748B;">Montant</td><td style="padding:4px 0;text-align:right;font-weight:600;">${fmtNum(params.amount)} ${params.currency}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Méthode</td><td style="padding:4px 0;text-align:right;">${methodLabel}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Destination</td><td style="padding:4px 0;text-align:right;">${params.destination}</td></tr>
          <tr><td style="padding:4px 0;color:#64748B;">Référence</td><td style="padding:4px 0;text-align:right;font-family:monospace;font-size:12px;">${params.reference}</td></tr>
        </table>
      </div>

      <div style="background:#FEF2F2;border:2px solid #FECACA;border-radius:12px;padding:16px;margin-bottom:16px;">
        <h3 style="margin:0 0 8px;color:#991B1B;font-size:14px;">MOTIF DU REFUS</h3>
        <p style="color:#7F1D1D;font-size:14px;margin:0;">${params.reason}</p>
      </div>

      <p style="color:#475569;font-size:13px;margin:16px 0;">
        Votre solde n'a pas été débité. Vous pouvez soumettre une nouvelle demande ou contacter l'administration pour plus d'informations.
      </p>

      <p style="color:#94A3B8;font-size:12px;text-align:center;margin:20px 0 0;">
        Guinée Immobilier Connect — Plateforme immobilière de confiance en Guinée
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
      agentEmail, agentName,
      amount, platformFee, netAmount, currency,
      method, destination, reference,
      requestedAt, processedAt,
      status, rejectionReason,
    } = body;

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      console.log('[send-withdrawal-receipt] RESEND_API_KEY not configured. Skipping email.');
      return new Response(JSON.stringify({ success: false, reason: 'no_api_key' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!agentEmail) {
      console.log('[send-withdrawal-receipt] No agent email provided.');
      return new Response(JSON.stringify({ success: false, reason: 'no_email' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let html: string;
    let subject: string;

    if (status === 'completed') {
      html = buildApprovalEmailHtml({
        agentName, amount, platformFee, netAmount, currency,
        method, destination, reference, requestedAt, processedAt,
      });
      subject = `✅ Retrait approuvé — ${fmtNum(netAmount)} ${currency} déposé sur votre compte`;
    } else {
      html = buildRejectionEmailHtml({
        agentName, amount, currency,
        method, destination, reference,
        reason: rejectionReason || 'Rejeté par l\'administrateur',
      });
      subject = `❌ Retrait refusé — ${fmtNum(amount)} ${currency}`;
    }

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Guinée Immobilier <notifications@guin-e-immobilier.com>',
        to: [agentEmail],
        subject,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('[send-withdrawal-receipt] Resend error:', errText);
      return new Response(JSON.stringify({ success: false, error: errText }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`[send-withdrawal-receipt] Email sent to ${agentEmail} (${status})`);
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[send-withdrawal-receipt] Error:', err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
