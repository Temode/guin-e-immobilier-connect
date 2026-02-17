import { supabase } from '@/integrations/supabase/client';

export interface RentalData {
  id: string;
  property_id: string;
  tenant_id: string;
  owner_id: string;
  agent_id: string | null;
  rent_amount: number;
  currency: string;
  agent_commission_percent: number | null;
  start_date: string;
  end_date: string | null;
  payment_method: string | null;
  payment_day_of_month: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface RentalWithDetails extends RentalData {
  property?: {
    id: string;
    title: string;
    type: string;
    city: string;
    commune: string | null;
    quartier: string | null;
    address: string | null;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    images: string[];
    status: string;
  };
  owner_profile?: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    kyc_status: string;
  };
  agent_profile?: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    kyc_status: string;
  };
  tenant_profile?: {
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
}

/**
 * Get active rental for a tenant
 */
export async function getTenantActiveRental(tenantId: string): Promise<{ data: RentalWithDetails | null; error: Error | null }> {
  const { data: rental, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { data: null, error };
  if (!rental) return { data: null, error: null };

  // Fetch related data in parallel
  const [propertyRes, ownerRes, agentRes] = await Promise.all([
    supabase.from('properties').select('id, title, type, city, commune, quartier, address, area, bedrooms, bathrooms, images, status').eq('id', rental.property_id).single(),
    supabase.from('profiles').select('full_name, phone, avatar_url, kyc_status').eq('id', rental.owner_id).single(),
    rental.agent_id
      ? supabase.from('profiles').select('full_name, phone, avatar_url, kyc_status').eq('id', rental.agent_id).single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const result: RentalWithDetails = {
    ...rental,
    rent_amount: Number(rental.rent_amount),
    agent_commission_percent: rental.agent_commission_percent ? Number(rental.agent_commission_percent) : null,
    payment_day_of_month: rental.payment_day_of_month ?? 1,
    property: propertyRes.data ? {
      ...propertyRes.data,
      area: propertyRes.data.area ? Number(propertyRes.data.area) : null,
      images: (propertyRes.data.images as string[]) || [],
    } : undefined,
    owner_profile: ownerRes.data || undefined,
    agent_profile: agentRes.data || undefined,
  };

  return { data: result, error: null };
}

/**
 * Get all rentals for an agent
 */
export async function getAgentRentals(agentId: string): Promise<{ data: RentalWithDetails[]; error: Error | null }> {
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('agent_id', agentId)
    .order('created_at', { ascending: false });

  if (error || !rentals) return { data: [], error };

  // Fetch tenant profiles for all rentals
  const tenantIds = [...new Set(rentals.map(r => r.tenant_id))];
  const { data: tenantProfiles } = await supabase
    .from('profiles')
    .select('id, full_name, phone, avatar_url')
    .in('id', tenantIds);

  const profileMap = new Map((tenantProfiles || []).map(p => [p.id, p]));

  const results: RentalWithDetails[] = rentals.map(r => ({
    ...r,
    rent_amount: Number(r.rent_amount),
    agent_commission_percent: r.agent_commission_percent ? Number(r.agent_commission_percent) : null,
    payment_day_of_month: r.payment_day_of_month ?? 1,
    tenant_profile: profileMap.get(r.tenant_id) || undefined,
  }));

  return { data: results, error: null };
}

/**
 * Get all rentals where the user is the owner (for property owners)
 */
export async function getOwnerRentals(ownerId: string): Promise<{ data: RentalWithDetails[]; error: Error | null }> {
  const { data: rentals, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error || !rentals) return { data: [], error };

  return { data: rentals.map(r => ({
    ...r,
    rent_amount: Number(r.rent_amount),
    agent_commission_percent: r.agent_commission_percent ? Number(r.agent_commission_percent) : null,
    payment_day_of_month: r.payment_day_of_month ?? 1,
  })), error: null };
}

/**
 * Calculate days until next payment
 */
export function daysUntilNextPayment(paymentDay: number): number {
  const now = new Date();
  const currentDay = now.getDate();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  let nextPaymentDate: Date;
  if (currentDay < paymentDay) {
    nextPaymentDate = new Date(currentYear, currentMonth, paymentDay);
  } else {
    nextPaymentDate = new Date(currentYear, currentMonth + 1, paymentDay);
  }

  const diffTime = nextPaymentDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format payment method label
 */
export function formatPaymentMethod(method: string | null): { label: string; iconText: string } {
  switch (method) {
    case 'orange_money':
      return { label: 'Orange Money', iconText: 'OM' };
    case 'mtn_money':
      return { label: 'MTN Money', iconText: 'MTN' };
    case 'bank':
      return { label: 'Virement bancaire', iconText: 'BK' };
    default:
      return { label: 'Non défini', iconText: '—' };
  }
}

/**
 * Get months remaining on a lease
 */
export function monthsRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const end = new Date(endDate);
  const now = new Date();
  const diff = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
  return Math.max(0, diff);
}
