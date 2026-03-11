/**
 * Payment Configuration — MVP Mode
 *
 * COMMISSION_SYSTEM_ENABLED controls how rent payments are distributed:
 *
 * - false (MVP): 100% of the rent goes to the agent's wallet.
 *   The agent can then manually distribute to the property owner.
 *   This is the current mode for early launch.
 *
 * - true (Production): Rent is split between agent and owner
 *   according to the commission percentage defined on each rental
 *   (default 10% agent, 90% owner). Uses the process_rent_payment
 *   SECURITY DEFINER RPC for atomic wallet crediting.
 *
 * To re-enable commission split, set this to true and ensure the
 * process_rent_payment RPC migration (20260220120000) is applied.
 */
export const COMMISSION_SYSTEM_ENABLED = false;
