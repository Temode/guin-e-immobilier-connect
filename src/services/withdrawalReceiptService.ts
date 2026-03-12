/**
 * Withdrawal Receipt Service
 * Generates professional PDF receipts for withdrawal operations:
 * - Agent receipt: proof of deposit to their account
 * - Admin receipt: proof of payment for record keeping
 */

/* ─── Types ─── */

export interface WithdrawalReceiptData {
  transactionId: string;
  paymentReference: string;
  
  // Agent info
  agentName: string;
  agentEmail: string;
  agentPhone: string;
  
  // Withdrawal details
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  currency: string;
  method: string;
  methodLabel: string;
  destination: string;
  
  // Dates
  requestedAt: string;
  processedAt: string;
  requestedAtFormatted: string;
  processedAtFormatted: string;
  
  // Status
  status: 'completed' | 'rejected';
  rejectionReason?: string;
  
  // Admin
  approvedBy?: string;
}

/* ─── PDF Helpers ─── */

function pdfStr(str: string): string {
  let out = '(';
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c === 0x28) out += '\\(';
    else if (c === 0x29) out += '\\)';
    else if (c === 0x5C) out += '\\\\';
    else if (c < 128) out += str[i];
    else if (c <= 255) out += '\\' + c.toString(8).padStart(3, '0');
    else {
      const map: Record<number, number> = { 0x20AC: 0x80, 0x2019: 0x92, 0x2014: 0x97, 0x2013: 0x96 };
      const mapped = map[c];
      if (mapped) out += '\\' + mapped.toString(8).padStart(3, '0');
      else out += '?';
    }
  }
  out += ')';
  return out;
}

function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function formatDateFr(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

/* ─── Generate Agent Receipt PDF ─── */

export function generateAgentWithdrawalReceipt(data: WithdrawalReceiptData): Uint8Array {
  const W = 595, H = 842, M = 50;
  let cs = '';

  const text = (str: string, x: number, y: number, size: number, bold = false) => {
    cs += `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${H - y} Td ${pdfStr(str)} Tj ET\n`;
  };
  const line = (x1: number, y1: number, x2: number, y2: number, w = 0.5) => {
    cs += `${w} w ${x1} ${H - y1} m ${x2} ${H - y2} l S\n`;
  };
  const rect = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    cs += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${H - y - h} ${w} ${h} re f\n`;
  };

  // Header bar
  rect(0, 0, W, 12, 0.063, 0.725, 0.506);

  // Title
  text('GUINEE IMMOBILIER CONNECT', M, 40, 14, true);

  if (data.status === 'completed') {
    text('RECU DE RETRAIT — AGENT', M, 65, 20, true);
    // Green badge
    rect(W - M - 90, 55, 90, 24, 0.063, 0.725, 0.506);
    cs += '1 1 1 rg\n';
    text('DEPOSE', W - M - 72, 71, 12, true);
    cs += '0 0 0 rg\n';
  } else {
    text('NOTIFICATION DE REFUS DE RETRAIT', M, 65, 18, true);
    rect(W - M - 90, 55, 90, 24, 0.937, 0.267, 0.267);
    cs += '1 1 1 rg\n';
    text('REFUSE', W - M - 72, 71, 12, true);
    cs += '0 0 0 rg\n';
  }

  // Reference
  cs += '0.4 0.4 0.4 rg\n';
  text(`Ref: ${data.paymentReference}`, W - M - 200, 40, 9);
  cs += '0 0 0 rg\n';

  line(M, 95, W - M, 95, 1);

  let y = 120;

  // Agent info section
  cs += '0.4 0.4 0.4 rg\n';
  text('BENEFICIAIRE', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Nom :', M, y, 10); text(data.agentName, M + 140, y, 10, true); y += 18;
  text('Email :', M, y, 10); text(data.agentEmail, M + 140, y, 10); y += 18;
  if (data.agentPhone) {
    text('Telephone :', M, y, 10); text(data.agentPhone, M + 140, y, 10); y += 18;
  }

  y += 10;
  line(M, y, W - M, y, 0.5);
  y += 20;

  // Destination section
  cs += '0.4 0.4 0.4 rg\n';
  text('DESTINATION DU DEPOT', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Mode :', M, y, 10); text(data.methodLabel, M + 140, y, 10, true); y += 18;
  
  const destLabel = data.method === 'bank' ? 'Compte bancaire :' : 'Numero :';
  text(destLabel, M, y, 10); text(data.destination, M + 140, y, 10, true); y += 18;

  y += 10;
  line(M, y, W - M, y, 0.5);
  y += 20;

  // Financial details
  cs += '0.4 0.4 0.4 rg\n';
  text('DETAILS FINANCIERS', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 25;

  text('Montant demande :', M, y, 10); text(`${fmtNum(data.grossAmount)} ${data.currency}`, M + 160, y, 10); y += 18;
  text('Frais plateforme (5%) :', M, y, 10);
  cs += '0.863 0.149 0.149 rg\n';
  text(`-${fmtNum(data.platformFee)} ${data.currency}`, M + 160, y, 10);
  cs += '0 0 0 rg\n';
  y += 18;

  // Net amount highlighted
  rect(M - 5, y - 5, W - 2 * M + 10, 30, 0.95, 0.99, 0.96);
  text('Montant net depose :', M, y + 8, 11, true);
  cs += '0.063 0.725 0.506 rg\n';
  text(`${fmtNum(data.netAmount)} ${data.currency}`, M + 160, y + 8, 14, true);
  cs += '0 0 0 rg\n';
  y += 40;

  y += 10;
  line(M, y, W - M, y, 0.5);
  y += 20;

  // Dates
  cs += '0.4 0.4 0.4 rg\n';
  text('CHRONOLOGIE', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Demande soumise le :', M, y, 10); text(data.requestedAtFormatted, M + 160, y, 10); y += 18;
  text('Traitee le :', M, y, 10); text(data.processedAtFormatted, M + 160, y, 10); y += 18;

  if (data.status === 'rejected' && data.rejectionReason) {
    y += 15;
    cs += '0.863 0.149 0.149 rg\n';
    text('Motif du refus :', M, y, 10, true);
    cs += '0 0 0 rg\n';
    y += 18;
    text(data.rejectionReason, M, y, 10);
  }

  // Footer
  y = H - 100;
  line(M, y, W - M, y, 1);
  y += 18;
  cs += '0.5 0.5 0.5 rg\n';
  if (data.status === 'completed') {
    text('Ce document certifie qu\'un depot a ete effectue sur le compte du beneficiaire.', M, y, 8);
  } else {
    text('Ce document notifie le refus de la demande de retrait.', M, y, 8);
  }
  y += 14;
  text('Guinee Immobilier Connect — Plateforme immobiliere de confiance en Guinee', M, y, 8);
  y += 14;
  text(`Genere le ${formatDateFr(new Date().toISOString())}`, M, y, 7);

  rect(0, H - 12, W, 12, 0.063, 0.725, 0.506);

  return assemblePdf(cs, W, H);
}

/* ─── Generate Admin Receipt PDF ─── */

export function generateAdminWithdrawalReceipt(data: WithdrawalReceiptData): Uint8Array {
  const W = 595, H = 842, M = 50;
  let cs = '';

  const text = (str: string, x: number, y: number, size: number, bold = false) => {
    cs += `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${H - y} Td ${pdfStr(str)} Tj ET\n`;
  };
  const line = (x1: number, y1: number, x2: number, y2: number, w = 0.5) => {
    cs += `${w} w ${x1} ${H - y1} m ${x2} ${H - y2} l S\n`;
  };
  const rect = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    cs += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${H - y - h} ${w} ${h} re f\n`;
  };

  // Header
  rect(0, 0, W, 12, 0.059, 0.471, 0.847); // Blue for admin
  text('GUINEE IMMOBILIER CONNECT', M, 40, 14, true);
  text('PREUVE DE PAIEMENT — ADMINISTRATION', M, 65, 18, true);

  // Badge
  if (data.status === 'completed') {
    rect(W - M - 100, 55, 100, 24, 0.063, 0.725, 0.506);
    cs += '1 1 1 rg\n';
    text('APPROUVE', W - M - 88, 71, 11, true);
    cs += '0 0 0 rg\n';
  }

  cs += '0.4 0.4 0.4 rg\n';
  text(`Ref: ${data.paymentReference}`, W - M - 200, 40, 9);
  cs += '0 0 0 rg\n';

  line(M, 95, W - M, 95, 1);

  let y = 120;

  // Agent details
  cs += '0.4 0.4 0.4 rg\n';
  text('AGENT BENEFICIAIRE', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Nom de l\'agent :', M, y, 10); text(data.agentName, M + 160, y, 10, true); y += 18;
  text('Email :', M, y, 10); text(data.agentEmail, M + 160, y, 10); y += 18;
  text('Telephone :', M, y, 10); text(data.agentPhone || 'Non renseigne', M + 160, y, 10); y += 18;

  y += 10; line(M, y, W - M, y, 0.5); y += 20;

  // Transfer details
  cs += '0.4 0.4 0.4 rg\n';
  text('DETAILS DU TRANSFERT', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Mode de paiement :', M, y, 10); text(data.methodLabel, M + 160, y, 10, true); y += 18;
  
  const destLabel = data.method === 'bank' ? 'Compte bancaire :' : 'Numero mobile :';
  text(destLabel, M, y, 10); text(data.destination, M + 160, y, 10, true); y += 18;

  y += 10; line(M, y, W - M, y, 0.5); y += 20;

  // Financial summary
  cs += '0.4 0.4 0.4 rg\n';
  text('RECAPITULATIF FINANCIER', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 25;

  text('Montant brut demande :', M, y, 10); text(`${fmtNum(data.grossAmount)} ${data.currency}`, M + 180, y, 10); y += 18;
  text('Commission plateforme (5%) :', M, y, 10);
  cs += '0.063 0.725 0.506 rg\n';
  text(`+${fmtNum(data.platformFee)} ${data.currency}`, M + 180, y, 10);
  cs += '0 0 0 rg\n';
  y += 18;

  // Net amount
  rect(M - 5, y - 5, W - 2 * M + 10, 30, 0.93, 0.95, 1.0);
  text('Montant net transfere a l\'agent :', M, y + 8, 11, true);
  cs += '0.059 0.471 0.847 rg\n';
  text(`${fmtNum(data.netAmount)} ${data.currency}`, M + 200, y + 8, 14, true);
  cs += '0 0 0 rg\n';
  y += 40;

  y += 10; line(M, y, W - M, y, 0.5); y += 20;

  // Dates & admin
  cs += '0.4 0.4 0.4 rg\n';
  text('INFORMATIONS ADMINISTRATIVES', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Demande recue le :', M, y, 10); text(data.requestedAtFormatted, M + 180, y, 10); y += 18;
  text('Approuve et paye le :', M, y, 10); text(data.processedAtFormatted, M + 180, y, 10); y += 18;
  text('Reference interne :', M, y, 10); text(data.transactionId.substring(0, 12).toUpperCase(), M + 180, y, 10); y += 18;

  // Footer
  y = H - 100;
  line(M, y, W - M, y, 1);
  y += 18;
  cs += '0.5 0.5 0.5 rg\n';
  text('Ce document atteste que le transfert de fonds a ete effectue par l\'administration.', M, y, 8);
  y += 14;
  text('Il sert de preuve de paiement pour les archives de la plateforme.', M, y, 8);
  y += 14;
  text('Guinee Immobilier Connect — Plateforme immobiliere de confiance en Guinee', M, y, 8);
  y += 14;
  text(`Genere le ${formatDateFr(new Date().toISOString())}`, M, y, 7);

  rect(0, H - 12, W, 12, 0.059, 0.471, 0.847);

  return assemblePdf(cs, W, H);
}

/* ─── Assemble PDF bytes ─── */

function assemblePdf(cs: string, W: number, H: number): Uint8Array {
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${new TextEncoder().encode(cs).length} >>\nstream\n${cs}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>',
  ];

  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [];

  for (let i = 0; i < objs.length; i++) {
    offsets.push(new TextEncoder().encode(pdf).length);
    pdf += `${i + 1} 0 obj\n${objs[i]}\nendobj\n\n`;
  }

  const xrefOffset = new TextEncoder().encode(pdf).length;
  pdf += `xref\n0 ${objs.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;
  return new TextEncoder().encode(pdf);
}

/* ─── Build receipt data from transaction ─── */

export function buildWithdrawalReceiptData(tx: {
  id: string;
  amount: number;
  currency: string;
  payment_method: string;
  payment_reference: string;
  status: string;
  created_at: string;
  metadata: Record<string, unknown>;
}): WithdrawalReceiptData {
  const meta = tx.metadata || {};
  const methodLabels: Record<string, string> = {
    orange_money: 'Orange Money',
    mtn_money: 'MTN Money',
    bank: 'Virement bancaire',
  };

  const grossAmount = Number(tx.amount);
  const platformFee = (meta.platform_fee as number) || Math.round(grossAmount * 0.05);
  const netAmount = (meta.net_amount as number) || grossAmount - platformFee;
  const processedAt = (meta.processed_at as string) || new Date().toISOString();

  return {
    transactionId: tx.id,
    paymentReference: tx.payment_reference || tx.id.slice(0, 12).toUpperCase(),
    agentName: (meta.agent_name as string) || 'Agent',
    agentEmail: (meta.agent_email as string) || '',
    agentPhone: (meta.agent_phone as string) || '',
    grossAmount,
    platformFee,
    netAmount,
    currency: tx.currency,
    method: tx.payment_method,
    methodLabel: methodLabels[tx.payment_method] || tx.payment_method,
    destination: (meta.destination as string) || '',
    requestedAt: tx.created_at,
    processedAt,
    requestedAtFormatted: formatDateFr(tx.created_at),
    processedAtFormatted: formatDateFr(processedAt),
    status: tx.status === 'completed' ? 'completed' : 'rejected',
    rejectionReason: (meta.rejection_reason as string) || undefined,
  };
}

/* ─── Download helpers ─── */

function downloadPdf(bytes: Uint8Array, filename: string) {
  const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadAgentReceipt(data: WithdrawalReceiptData) {
  const pdf = generateAgentWithdrawalReceipt(data);
  downloadPdf(pdf, `recu-retrait-agent-${data.paymentReference}.pdf`);
}

export function downloadAdminReceipt(data: WithdrawalReceiptData) {
  const pdf = generateAdminWithdrawalReceipt(data);
  downloadPdf(pdf, `preuve-paiement-admin-${data.paymentReference}.pdf`);
}
