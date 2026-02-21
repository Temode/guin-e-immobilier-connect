/**
 * Shared Djomy API utilities for Edge Functions
 * Handles authentication (HMAC-SHA256) and API calls
 */

const DJOMY_SANDBOX_URL = 'https://sandbox-api.djomy.africa';
const DJOMY_PROD_URL = 'https://api.djomy.africa';

function getDjomyBaseUrl(): string {
  const env = Deno.env.get('DJOMY_ENV') || 'sandbox';
  return env === 'production' ? DJOMY_PROD_URL : DJOMY_SANDBOX_URL;
}

function getClientId(): string {
  const id = Deno.env.get('DJOMY_CLIENT_ID');
  if (!id) throw new Error('DJOMY_CLIENT_ID not configured');
  return id;
}

function getClientSecret(): string {
  const secret = Deno.env.get('DJOMY_CLIENT_SECRET');
  if (!secret) throw new Error('DJOMY_CLIENT_SECRET not configured');
  return secret;
}

/**
 * Generate HMAC-SHA256 signature
 */
async function hmacSha256(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate X-API-KEY header: <clientId>:<HMAC-SHA256(clientId, clientSecret)>
 */
async function generateApiKey(): Promise<string> {
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  const signature = await hmacSha256(clientId, clientSecret);
  return `${clientId}:${signature}`;
}

/**
 * Get Bearer token from Djomy /v1/auth
 */
export async function getDjomyAuthToken(): Promise<string> {
  const baseUrl = getDjomyBaseUrl();
  const clientId = getClientId();
  const clientSecret = getClientSecret();
  const apiKey = await generateApiKey();

  console.log(`[DJOMY AUTH] URL: ${baseUrl}/v1/auth`);
  console.log(`[DJOMY AUTH] ClientId: ${clientId}`);
  console.log(`[DJOMY AUTH] ClientSecret length: ${clientSecret.length}`);
  console.log(`[DJOMY AUTH] X-API-KEY: ${apiKey.substring(0, 40)}...`);

  const res = await fetch(`${baseUrl}/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({}),
  });

  const responseText = await res.text();
  console.log(`[DJOMY AUTH] Response status: ${res.status}`);
  console.log(`[DJOMY AUTH] Response headers:`, JSON.stringify(Object.fromEntries(res.headers.entries())));
  console.log(`[DJOMY AUTH] Response body (full):`, responseText);

  if (!res.ok) {
    throw new Error(`Djomy auth failed (${res.status}): ${responseText}`);
  }

  const data = JSON.parse(responseText);
  console.log(`[DJOMY AUTH] Parsed keys:`, Object.keys(data));

  // Djomy response: { success, data: { accessToken, tokenType, expiresIn } }
  const token = data.data?.accessToken || data.data?.access_token || data.data?.token || data.accessToken || data.access_token || data.token;
  console.log(`[DJOMY AUTH] Extracted token: ${token ? token.substring(0, 50) + '...' : 'NULL - NONE FOUND'}`);
  console.log(`[DJOMY AUTH] Token type: ${data.data?.tokenType || 'unknown'}`);
  if (!token) {
    throw new Error(`Djomy auth: no token found in response. Keys: ${Object.keys(data).join(', ')}. Full response: ${responseText.substring(0, 500)}`);
  }

  return token;
}

/**
 * Initiate a direct payment via Djomy POST /v1/payments
 */
export async function initiateDjomyPayment(params: {
  token: string;
  paymentMethod: 'OM' | 'MOMO';
  payerIdentifier: string; // phone number with country code, e.g. "00224620000000"
  amount: number;
  description: string;
  merchantPaymentReference: string;
}): Promise<{
  transactionId: string;
  status: string;
  message: string;
}> {
  const baseUrl = getDjomyBaseUrl();
  const apiKey = await generateApiKey();

  const body = {
    paymentMethod: params.paymentMethod,
    payerIdentifier: params.payerIdentifier,
    amount: params.amount,
    countryCode: 'GN',
    description: params.description,
    merchantPaymentReference: params.merchantPaymentReference,
  };

  const res = await fetch(`${baseUrl}/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${params.token}`,
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Djomy payment initiation failed (${res.status}): ${errorBody}`);
  }

  return await res.json();
}

/**
 * Check payment status via Djomy GET /v1/payments/{transactionId}/status
 */
export async function checkDjomyPaymentStatus(params: {
  token: string;
  transactionId: string;
}): Promise<{
  transactionId: string;
  status: string;
  paymentMethod: string;
  amount: number;
  currency: string;
}> {
  const baseUrl = getDjomyBaseUrl();
  const apiKey = await generateApiKey();

  const res = await fetch(`${baseUrl}/v1/payments/${params.transactionId}/status`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${params.token}`,
      'X-API-KEY': apiKey,
    },
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Djomy status check failed (${res.status}): ${errorBody}`);
  }

  return await res.json();
}

/**
 * Validate Djomy webhook signature
 * Header format: X-Webhook-Signature: v1:<HMAC-SHA256(payload, clientSecret)>
 */
export async function validateWebhookSignature(
  payload: string,
  signatureHeader: string,
): Promise<boolean> {
  if (!signatureHeader) {
    console.warn('[WEBHOOK] No signature header received');
    return false;
  }

  // Support both "v1:<sig>" and raw "<sig>" formats
  const receivedSignature = signatureHeader.startsWith('v1:')
    ? signatureHeader.slice(3)
    : signatureHeader;

  const clientSecret = getClientSecret();
  const expectedSignature = await hmacSha256(payload, clientSecret);

  console.log(`[WEBHOOK] Received sig: ${receivedSignature.substring(0, 20)}...`);
  console.log(`[WEBHOOK] Expected sig: ${expectedSignature.substring(0, 20)}...`);
  console.log(`[WEBHOOK] Match: ${receivedSignature === expectedSignature}`);

  return receivedSignature === expectedSignature;
}

export { getDjomyBaseUrl, getClientId };
