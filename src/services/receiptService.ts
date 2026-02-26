/**
 * Receipt Service — Génération de reçus de paiement
 *
 * Responsabilités :
 * 1. Charger les données complètes d'une transaction (locataire, bien, location)
 * 2. Générer un PDF de reçu téléchargeable (sans dépendance externe)
 * 3. Générer un reçu en base64 pour pièce jointe email
 */
import { supabase } from '@/integrations/supabase/client';

/* ─── Types ─── */

export interface ReceiptData {
  /** Identifiants */
  transactionId: string;
  paymentReference: string;

  /** Locataire */
  tenantName: string;
  tenantPhone: string;

  /** Logement */
  propertyTitle: string;
  propertyAddress: string;

  /** Paiement */
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentMethodLabel: string;
  paymentDate: string;        // ISO string
  paymentDateFormatted: string; // "26 février 2026"
  rentPeriod: string;          // "Février 2026"
  status: string;

  /** Parties */
  agentName: string | null;
  ownerName: string | null;
}

/* ─── Build receipt data from transaction ID ─── */

export async function buildReceiptData(transactionId: string): Promise<{
  data: ReceiptData | null;
  error: Error | null;
}> {
  // 1. Fetch the transaction
  const { data: tx, error: txErr } = await supabase
    .from('transactions')
    .select('*')
    .eq('id', transactionId)
    .single();

  if (txErr || !tx) {
    return { data: null, error: txErr || new Error('Transaction introuvable') };
  }

  // 2. Fetch the rental + property + profiles in parallel
  const rentalId = tx.rental_id;
  if (!rentalId) {
    return { data: null, error: new Error('Transaction sans location associée') };
  }

  const { data: rental, error: rentalErr } = await supabase
    .from('rentals')
    .select('*')
    .eq('id', rentalId)
    .single();

  if (rentalErr || !rental) {
    return { data: null, error: rentalErr || new Error('Location introuvable') };
  }

  const [propertyRes, tenantRes, agentRes, ownerRes] = await Promise.all([
    supabase.from('properties').select('title, city, commune, quartier, address').eq('id', rental.property_id).single(),
    supabase.from('profiles').select('full_name, phone').eq('id', rental.tenant_id).single(),
    rental.agent_id
      ? supabase.from('profiles').select('full_name').eq('id', rental.agent_id).single()
      : Promise.resolve({ data: null, error: null }),
    supabase.from('profiles').select('full_name').eq('id', rental.owner_id).single(),
  ]);

  const property = propertyRes.data;
  const tenant = tenantRes.data;

  const paymentDate = new Date(tx.created_at);
  const methodLabels: Record<string, string> = {
    orange_money: 'Orange Money',
    mtn_money: 'MTN Money',
    visa: 'Visa',
    mastercard: 'Mastercard',
    bank: 'Virement bancaire',
  };

  const addressParts = [
    property?.quartier,
    property?.commune,
    property?.city,
  ].filter(Boolean);

  const receipt: ReceiptData = {
    transactionId: tx.id,
    paymentReference: tx.payment_reference || tx.id.slice(0, 12).toUpperCase(),
    tenantName: tenant?.full_name || 'Locataire',
    tenantPhone: tenant?.phone || '',
    propertyTitle: property?.title || 'Logement',
    propertyAddress: property?.address || addressParts.join(', ') || '',
    amount: Number(tx.amount),
    currency: tx.currency || 'GNF',
    paymentMethod: tx.payment_method,
    paymentMethodLabel: methodLabels[tx.payment_method] || tx.payment_method,
    paymentDate: tx.created_at,
    paymentDateFormatted: paymentDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    rentPeriod: paymentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    status: tx.status,
    agentName: agentRes.data?.full_name || null,
    ownerName: ownerRes.data?.full_name || null,
  };

  return { data: receipt, error: null };
}

/* ─── PDF Generation (raw PDF, no external dependencies) ─── */

/**
 * Encode a UTF-16 JS string to a PDF literal string with WinAnsiEncoding.
 * Handles French accented characters (é, è, ê, à, ç, ô, etc.).
 */
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
      // Map common Unicode chars to Win-1252
      const map: Record<number, number> = { 0x20AC: 0x80, 0x2019: 0x92, 0x2014: 0x97, 0x2013: 0x96 };
      const mapped = map[c];
      if (mapped) out += '\\' + mapped.toString(8).padStart(3, '0');
      else out += '?';
    }
  }
  out += ')';
  return out;
}

/** Format number with spaces: 2000000 → "2 000 000" */
function fmtNum(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

/**
 * Generate a raw PDF receipt as a Uint8Array.
 * Uses Type1 Helvetica fonts with WinAnsiEncoding — no embedded fonts needed.
 */
export function generateReceiptPdf(data: ReceiptData): Uint8Array {
  const W = 595; // A4 width in points
  const H = 842; // A4 height in points
  const M = 50;  // margin

  // Build page content stream
  let cs = '';

  // Helper: absolute text
  const text = (str: string, x: number, y: number, size: number, bold = false) => {
    cs += `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${H - y} Td ${pdfStr(str)} Tj ET\n`;
  };

  // Helper: line
  const line = (x1: number, y1: number, x2: number, y2: number, w = 0.5) => {
    cs += `${w} w ${x1} ${H - y1} m ${x2} ${H - y2} l S\n`;
  };

  // Helper: filled rectangle (RGB 0-1)
  const rect = (x: number, y: number, w: number, h: number, r: number, g: number, b: number) => {
    cs += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} rg ${x} ${H - y - h} ${w} ${h} re f\n`;
  };

  // Helper: set stroke color
  const strokeColor = (r: number, g: number, b: number) => {
    cs += `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)} RG\n`;
  };

  // ── Green header bar ──
  rect(0, 0, W, 10, 0.063, 0.725, 0.506); // #10B981

  // ── Platform name + Receipt title ──
  text('GUINEE IMMOBILIER CONNECT', M, 45, 16, true);
  text('RECU DE PAIEMENT', M, 70, 22, true);

  // Reference on the right
  strokeColor(0.4, 0.4, 0.4);
  text(`Ref: ${data.paymentReference}`, W - M - 200, 45, 9, false);
  text(`Date: ${data.paymentDateFormatted}`, W - M - 200, 60, 9, false);

  // ── Status badge ──
  if (data.status === 'completed') {
    rect(W - M - 80, 72, 80, 22, 0.063, 0.725, 0.506);
    cs += '1 1 1 rg\n';
    text('PAYE', W - M - 60, 87, 11, true);
    cs += '0 0 0 rg\n'; // reset to black
  }

  // ── Separator ──
  strokeColor(0.88, 0.88, 0.88);
  line(M, 105, W - M, 105, 1);

  // ── Locataire section ──
  let y = 130;
  cs += '0.4 0.4 0.4 rg\n';
  text('LOCATAIRE', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Nom :', M, y, 10, false);
  text(data.tenantName, M + 120, y, 10, true);
  y += 18;
  if (data.tenantPhone) {
    text('Telephone :', M, y, 10, false);
    text(data.tenantPhone, M + 120, y, 10, false);
    y += 18;
  }

  // ── Separator ──
  y += 10;
  line(M, y, W - M, y, 0.5);
  y += 20;

  // ── Logement section ──
  cs += '0.4 0.4 0.4 rg\n';
  text('LOGEMENT', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;
  text('Bien :', M, y, 10, false);
  text(data.propertyTitle, M + 120, y, 10, true);
  y += 18;
  if (data.propertyAddress) {
    text('Adresse :', M, y, 10, false);
    // Truncate long addresses
    const addr = data.propertyAddress.length > 60 ? data.propertyAddress.slice(0, 57) + '...' : data.propertyAddress;
    text(addr, M + 120, y, 10, false);
    y += 18;
  }
  text('Periode :', M, y, 10, false);
  text(data.rentPeriod, M + 120, y, 10, true);

  // ── Separator ──
  y += 30;
  line(M, y, W - M, y, 0.5);
  y += 20;

  // ── Payment details ──
  cs += '0.4 0.4 0.4 rg\n';
  text('DETAILS DU PAIEMENT', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 25;

  // Amount — large and bold
  text('Montant :', M, y, 10, false);
  text(`${fmtNum(data.amount)} ${data.currency}`, M + 120, y, 14, true);
  y += 22;

  text('Mode de paiement :', M, y, 10, false);
  text(data.paymentMethodLabel, M + 120, y, 10, false);
  y += 18;

  text('Statut :', M, y, 10, false);
  if (data.status === 'completed') {
    cs += '0.063 0.725 0.506 rg\n'; // green
    text('Paye avec succes', M + 120, y, 10, true);
    cs += '0 0 0 rg\n';
  } else {
    text(data.status, M + 120, y, 10, false);
  }
  y += 18;

  text('Reference :', M, y, 10, false);
  text(data.paymentReference, M + 120, y, 10, false);

  // ── Parties section ──
  y += 35;
  line(M, y, W - M, y, 0.5);
  y += 20;
  cs += '0.4 0.4 0.4 rg\n';
  text('PARTIES', M, y, 8, true);
  cs += '0 0 0 rg\n';
  y += 20;

  if (data.ownerName) {
    text('Proprietaire :', M, y, 10, false);
    text(data.ownerName, M + 120, y, 10, false);
    y += 18;
  }
  if (data.agentName) {
    text('Agent :', M, y, 10, false);
    text(data.agentName, M + 120, y, 10, false);
    y += 18;
  }

  // ── Footer ──
  y = H - 100;
  strokeColor(0.88, 0.88, 0.88);
  line(M, y, W - M, y, 1);
  y += 18;
  cs += '0.5 0.5 0.5 rg\n';
  text('Ce document fait office de recu de paiement.', M, y, 8, false);
  y += 14;
  text('Guinee Immobilier Connect — Plateforme immobiliere de confiance en Guinee', M, y, 8, false);
  y += 14;
  text(`Genere le ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, M, y, 7, false);

  // ── Bottom green bar ──
  rect(0, H - 10, W, 10, 0.063, 0.725, 0.506);

  // ── Assemble PDF ──
  const contentBytes = new TextEncoder().encode(cs);

  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${W} ${H}] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>`,
    `<< /Length ${contentBytes.length} >>\nstream\n${cs}\nendstream`,
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

/* ─── Convenience: download receipt as PDF ─── */

export async function downloadReceipt(transactionId: string): Promise<{ error: Error | null }> {
  const { data, error } = await buildReceiptData(transactionId);
  if (error || !data) return { error: error || new Error('Données du reçu introuvables') };

  const pdfBytes = generateReceiptPdf(data);
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `recu-${data.paymentReference}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return { error: null };
}

/* ─── Generate receipt as base64 string (for email attachment) ─── */

export async function generateReceiptBase64(transactionId: string): Promise<{
  data: { base64: string; filename: string; receiptData: ReceiptData } | null;
  error: Error | null;
}> {
  const { data, error } = await buildReceiptData(transactionId);
  if (error || !data) return { data: null, error: error || new Error('Données introuvables') };

  const pdfBytes = generateReceiptPdf(data);

  // Convert Uint8Array to base64
  let binary = '';
  for (let i = 0; i < pdfBytes.length; i++) {
    binary += String.fromCharCode(pdfBytes[i]);
  }
  const base64 = btoa(binary);

  return {
    data: {
      base64,
      filename: `recu-${data.paymentReference}.pdf`,
      receiptData: data,
    },
    error: null,
  };
}
