/**
 * Edge Function: send-payment-email
 *
 * Envoie des emails de confirmation après un paiement de loyer réussi.
 * Destinataires : locataire, agent, propriétaire.
 *
 * Utilise Resend API (RESEND_API_KEY env var).
 * Si Resend n'est pas configuré, les emails sont loggés mais non envoyés.
 *
 * Le reçu PDF est généré côté serveur et attaché à l'email du locataire.
 */
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { getSupabaseAdmin } from '../_shared/supabase-admin.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/* ─── Minimal PDF receipt generator (server-side) ─── */

function pdfStr(str: string): string {
  let out = '(';
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 0x28) out += '\\(';
    else if (c === 0x29) out += '\\)';
    else if (c === 0x5C) out += '\\\\';
    else if (c < 128) out += str[i];
    else if (c <= 255) out += '\\' + c.toString(8).padStart(3, '0');
    else out += '?';
  }
  out += ')';
  return out;
}

function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

interface ReceiptPdfParams {
  paymentReference: string;
  tenantName: string;
  propertyTitle: string;
  propertyAddress: string;
  amount: number;
  currency: string;
  paymentMethodLabel: string;
  paymentDateFormatted: string;
  rentPeriod: string;
  ownerName: string;
  agentName: string;
}

function generateReceiptPdfBytes(data: ReceiptPdfParams): Uint8Array {
  const W = 595, H = 842, M = 50;
  let cs = '';

  const text = (s: string, x: number, y: number, sz: number, bold = false) => {
    cs += `BT /${bold ? 'F2' : 'F1'} ${sz} Tf ${x} ${H - y} Td ${pdfStr(s)} Tj ET\n`;
  };
  const line = (x1: number, y1: number, x2: number, y2: number, w = 0.5) => {
    cs += `${w} w ${x1} ${H - y1} m ${x2} ${H - y2} l S\n`;
  };
  const rect = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    cs += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${H - y - h} ${w} ${h} re f\n`;
  };

  // Green header
  rect(0, 0, W, 10, 0.063, 0.725, 0.506);
  text('GUINEE IMMOBILIER CONNECT', M, 45, 16, true);
  text('RECU DE PAIEMENT', M, 70, 22, true);
  text(`Ref: ${data.paymentReference}`, W - M - 200, 45, 9, false);
  text(`Date: ${data.paymentDateFormatted}`, W - M - 200, 60, 9, false);

  // Status badge
  rect(W - M - 80, 72, 80, 22, 0.063, 0.725, 0.506);
  cs += '1 1 1 rg\n';
  text('PAYE', W - M - 60, 87, 11, true);
  cs += '0 0 0 rg\n';

  line(M, 105, W - M, 105, 1);

  // Locataire
  let y = 130;
  cs += '0.4 0.4 0.4 rg\n'; text('LOCATAIRE', M, y, 8, true); cs += '0 0 0 rg\n';
  y += 20; text('Nom :', M, y, 10); text(data.tenantName, M + 120, y, 10, true);

  y += 30; line(M, y, W - M, y, 0.5); y += 20;
  cs += '0.4 0.4 0.4 rg\n'; text('LOGEMENT', M, y, 8, true); cs += '0 0 0 rg\n';
  y += 20; text('Bien :', M, y, 10); text(data.propertyTitle, M + 120, y, 10, true);
  y += 18;
  if (data.propertyAddress) {
    const addr = data.propertyAddress.length > 60 ? data.propertyAddress.slice(0, 57) + '...' : data.propertyAddress;
    text('Adresse :', M, y, 10); text(addr, M + 120, y, 10);
    y += 18;
  }
  text('Periode :', M, y, 10); text(data.rentPeriod, M + 120, y, 10, true);

  y += 30; line(M, y, W - M, y, 0.5); y += 20;
  cs += '0.4 0.4 0.4 rg\n'; text('DETAILS DU PAIEMENT', M, y, 8, true); cs += '0 0 0 rg\n';
  y += 25;
  text('Montant :', M, y, 10); text(`${fmtNum(data.amount)} ${data.currency}`, M + 120, y, 14, true);
  y += 22;
  text('Mode de paiement :', M, y, 10); text(data.paymentMethodLabel, M + 120, y, 10);
  y += 18;
  text('Statut :', M, y, 10);
  cs += '0.063 0.725 0.506 rg\n'; text('Paye avec succes', M + 120, y, 10, true); cs += '0 0 0 rg\n';

  y += 35; line(M, y, W - M, y, 0.5); y += 20;
  cs += '0.4 0.4 0.4 rg\n'; text('PARTIES', M, y, 8, true); cs += '0 0 0 rg\n';
  y += 20;
  if (data.ownerName) { text('Proprietaire :', M, y, 10); text(data.ownerName, M + 120, y, 10); y += 18; }
  if (data.agentName) { text('Agent :', M, y, 10); text(data.agentName, M + 120, y, 10); }

  // Footer
  y = H - 100;
  line(M, y, W - M, y, 1);
  y += 18;
  cs += '0.5 0.5 0.5 rg\n';
  text('Ce document fait office de recu de paiement.', M, y, 8);
  y += 14;
  text('Guinee Immobilier Connect', M, y, 8);
  rect(0, H - 10, W, 10, 0.063, 0.725, 0.506);

  const contentBytes = new TextEncoder().encode(cs);
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${contentBytes.length} >>\nstream\n${cs}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];

  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  for (let i = 0; i < objs.length; i++) {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${i + 1} 0 obj\n${objs[i]}\nendobj\n\n`;
  }
  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) pdf += `${o.toString().padStart(10, '0')} 00000 n \n`;
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return new TextEncoder().encode(pdf);
}

/* ─── Email HTML templates ─── */

function buildTenantEmailHtml(params: {
  tenantName: string;
  amount: string;
  currency: string;
  propertyTitle: string;
  rentPeriod: string;
  paymentReference: string;
  paymentDate: string;
  paymentMethod: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#10B981;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Guinée Immobilier Connect</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#1a1a1a;margin:0 0 8px;">Paiement confirmé ✓</h2>
      <p style="color:#666;margin:0 0 24px;">Bonjour ${params.tenantName},</p>
      <p style="color:#333;line-height:1.6;">Votre paiement de loyer a été effectué avec succès. Voici les détails :</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:40%;">Montant</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;color:#1a1a1a;">${params.amount} ${params.currency}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Logement</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;">${params.propertyTitle}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Période</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;">${params.rentPeriod}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Mode de paiement</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;">${params.paymentMethod}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Référence</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;font-family:monospace;">${params.paymentReference}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Date</td><td style="padding:10px 0;color:#1a1a1a;">${params.paymentDate}</td></tr>
      </table>
      <p style="color:#333;line-height:1.6;">Votre reçu de paiement est joint à cet email en pièce jointe (PDF).</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:24px 0;">
        <p style="margin:0;color:#166534;font-size:14px;">📎 Reçu de paiement joint : <strong>recu-${params.paymentReference}.pdf</strong></p>
      </div>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #eee;">
      <p style="margin:0;color:#999;font-size:12px;">Guinée Immobilier Connect — Plateforme immobilière de confiance en Guinée</p>
    </div>
  </div>
</body></html>`;
}

function buildAgentEmailHtml(params: {
  agentName: string;
  tenantName: string;
  amount: string;
  currency: string;
  propertyTitle: string;
  rentPeriod: string;
  paymentReference: string;
  paymentDate: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;">
    <div style="background:#10B981;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:20px;">Guinée Immobilier Connect</h1>
    </div>
    <div style="padding:32px;">
      <h2 style="color:#1a1a1a;margin:0 0 8px;">Paiement de loyer reçu 💰</h2>
      <p style="color:#666;margin:0 0 24px;">Bonjour ${params.agentName},</p>
      <p style="color:#333;line-height:1.6;">Un paiement de loyer a été effectué pour un de vos biens :</p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;width:40%;">Locataire</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;color:#1a1a1a;">${params.tenantName}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Montant</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:bold;color:#1a1a1a;">${params.amount} ${params.currency}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Logement</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;">${params.propertyTitle}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Période</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;">${params.rentPeriod}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;">Référence</td><td style="padding:10px 0;border-bottom:1px solid #eee;color:#1a1a1a;font-family:monospace;">${params.paymentReference}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Date</td><td style="padding:10px 0;color:#1a1a1a;">${params.paymentDate}</td></tr>
      </table>
      <p style="color:#333;line-height:1.6;">Votre commission a été créditée automatiquement sur votre portefeuille. Le reçu est joint à cet email.</p>
    </div>
    <div style="background:#f9fafb;padding:16px 32px;border-top:1px solid #eee;">
      <p style="margin:0;color:#999;font-size:12px;">Guinée Immobilier Connect — Plateforme immobilière de confiance en Guinée</p>
    </div>
  </div>
</body></html>`;
}

/* ─── Send email via Resend API ─── */

async function sendEmailViaResend(params: {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: string }>; // base64
  fromName?: string;
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured — skipping email send');
    return { success: false, error: 'RESEND_API_KEY non configuré' };
  }

  const fromDomain = Deno.env.get('EMAIL_FROM_DOMAIN') || 'guineimmobilier.com';
  const fromName = params.fromName || 'Guinée Immobilier Connect';

  try {
    const body: Record<string, unknown> = {
      from: `${fromName} <noreply@${fromDomain}>`,
      to: [params.to],
      subject: params.subject,
      html: params.html,
    };

    if (params.attachments && params.attachments.length > 0) {
      body.attachments = params.attachments;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Email] Resend API error (${res.status}):`, errorText);
      return { success: false, error: `Resend ${res.status}: ${errorText}` };
    }

    const result = await res.json();
    console.log('[Email] Sent successfully:', result.id);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur réseau';
    console.error('[Email] Send failed:', message);
    return { success: false, error: message };
  }
}

/* ─── Main handler ─── */

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

    const body = await req.json();
    const {
      transactionId,
      paymentReference,
      amount,
      currency,
      paymentMethod,
      paymentDate,
      tenantId,
      tenantName,
      agentId,
      agentName,
      ownerId,
      ownerName,
      propertyTitle,
      propertyAddress,
      rentPeriod,
    } = body;

    if (!transactionId || !tenantId) {
      return new Response(JSON.stringify({ error: 'transactionId et tenantId requis' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // Format values
    const fmtAmount = Number(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const methodLabels: Record<string, string> = {
      orange_money: 'Orange Money', mtn_money: 'MTN Money',
      visa: 'Visa', mastercard: 'Mastercard', bank: 'Virement bancaire',
    };
    const paymentMethodLabel = methodLabels[paymentMethod] || paymentMethod;
    const paymentDateFormatted = new Date(paymentDate).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });

    // Generate receipt PDF for attachment
    const pdfBytes = generateReceiptPdfBytes({
      paymentReference: paymentReference || transactionId.slice(0, 12),
      tenantName: tenantName || 'Locataire',
      propertyTitle: propertyTitle || 'Logement',
      propertyAddress: propertyAddress || '',
      amount: Number(amount),
      currency: currency || 'GNF',
      paymentMethodLabel,
      paymentDateFormatted,
      rentPeriod: rentPeriod || '',
      ownerName: ownerName || '',
      agentName: agentName || '',
    });

    // Convert PDF to base64 for email attachment
    let pdfBase64 = '';
    const binaryChunks: string[] = [];
    for (let i = 0; i < pdfBytes.length; i++) {
      binaryChunks.push(String.fromCharCode(pdfBytes[i]));
    }
    pdfBase64 = btoa(binaryChunks.join(''));

    const pdfAttachment = {
      filename: `recu-${paymentReference || transactionId.slice(0, 8)}.pdf`,
      content: pdfBase64,
    };

    // Fetch emails for all parties using admin client
    const userIds = [tenantId, agentId, ownerId].filter(Boolean) as string[];
    const emailMap = new Map<string, string>();

    for (const uid of userIds) {
      try {
        const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(uid);
        if (user?.email) {
          emailMap.set(uid, user.email);
        }
      } catch (e) {
        console.warn(`[Email] Could not fetch email for user ${uid}:`, e);
      }
    }

    const results: Array<{ to: string; role: string; sent: boolean; error?: string }> = [];

    // 1. Email to tenant
    const tenantEmail = emailMap.get(tenantId);
    if (tenantEmail) {
      const html = buildTenantEmailHtml({
        tenantName: tenantName || 'Locataire',
        amount: fmtAmount,
        currency: currency || 'GNF',
        propertyTitle: propertyTitle || 'Logement',
        rentPeriod: rentPeriod || '',
        paymentReference: paymentReference || transactionId.slice(0, 12),
        paymentDate: paymentDateFormatted,
        paymentMethod: paymentMethodLabel,
      });

      const result = await sendEmailViaResend({
        to: tenantEmail,
        subject: `Confirmation de paiement — ${fmtAmount} ${currency || 'GNF'}`,
        html,
        attachments: [pdfAttachment],
      });
      results.push({ to: tenantEmail, role: 'tenant', ...result });
    }

    // 2. Email to agent
    if (agentId) {
      const agentEmail = emailMap.get(agentId);
      if (agentEmail) {
        const html = buildAgentEmailHtml({
          agentName: agentName || 'Agent',
          tenantName: tenantName || 'Locataire',
          amount: fmtAmount,
          currency: currency || 'GNF',
          propertyTitle: propertyTitle || 'Logement',
          rentPeriod: rentPeriod || '',
          paymentReference: paymentReference || transactionId.slice(0, 12),
          paymentDate: paymentDateFormatted,
        });

        const result = await sendEmailViaResend({
          to: agentEmail,
          subject: `Loyer reçu — ${tenantName} — ${fmtAmount} ${currency || 'GNF'}`,
          html,
          attachments: [pdfAttachment],
        });
        results.push({ to: agentEmail, role: 'agent', ...result });
      }
    }

    // 3. Email to owner (if different from agent)
    if (ownerId && ownerId !== agentId) {
      const ownerEmail = emailMap.get(ownerId);
      if (ownerEmail) {
        const html = buildAgentEmailHtml({
          agentName: ownerName || 'Propriétaire',
          tenantName: tenantName || 'Locataire',
          amount: fmtAmount,
          currency: currency || 'GNF',
          propertyTitle: propertyTitle || 'Logement',
          rentPeriod: rentPeriod || '',
          paymentReference: paymentReference || transactionId.slice(0, 12),
          paymentDate: paymentDateFormatted,
        });

        const result = await sendEmailViaResend({
          to: ownerEmail,
          subject: `Loyer encaissé — ${propertyTitle} — ${fmtAmount} ${currency || 'GNF'}`,
          html,
          attachments: [pdfAttachment],
        });
        results.push({ to: ownerEmail, role: 'owner', ...result });
      }
    }

    console.log('[send-payment-email] Results:', JSON.stringify(results));

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Erreur interne';
    console.error('[send-payment-email] Error:', error);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
