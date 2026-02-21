import { supabase } from '@/integrations/supabase/client';

export interface Visit {
  id: string;
  agent_id: string;
  property_id: string | null;
  lead_name: string;
  lead_phone: string | null;
  lead_email: string | null;
  lead_notes: string | null;
  type: 'visit' | 'contre-visite' | 'signature' | 'etat-lieux';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  scheduled_at: string;
  duration_minutes: number;
  address: string | null;
  follow_up_required: boolean;
  relance_sent_at: string | null;
  agent_notes: string | null;
  ai_prospect_score: 'hot' | 'warm' | 'cold' | 'unknown';
  ai_suggested: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  property?: {
    id: string;
    title: string;
    type: string;
    city: string;
    commune: string | null;
    address: string | null;
    rent_amount: number | null;
  } | null;
}

export interface CreateVisitParams {
  propertyId?: string;
  leadName: string;
  leadPhone?: string;
  leadEmail?: string;
  leadNotes?: string;
  type: Visit['type'];
  scheduledAt: string; // ISO string
  durationMinutes?: number;
  address?: string;
}

/**
 * Get all visits for the current agent
 */
export async function getAgentVisits(options?: {
  date?: string;         // YYYY-MM-DD — filter by day
  status?: Visit['status'];
  upcoming?: boolean;    // only future visits
}): Promise<{ data: Visit[]; error: Error | null }> {
  let query = supabase
    .from('visits')
    .select('*, property:property_id(id, title, type, city, commune, address)')
    .order('scheduled_at', { ascending: true });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.upcoming) {
    query = query.gte('scheduled_at', new Date().toISOString());
  }

  if (options?.date) {
    const start = new Date(options.date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(options.date);
    end.setHours(23, 59, 59, 999);
    query = query
      .gte('scheduled_at', start.toISOString())
      .lte('scheduled_at', end.toISOString());
  }

  const { data, error } = await query;
  if (error || !data) return { data: [], error };

  return { data: data as Visit[], error: null };
}

/**
 * Get visit stats for the agent (today / this week / pending / signatures)
 */
export async function getVisitStats(agentId: string): Promise<{
  today: number;
  thisWeek: number;
  pending: number;
  signaturesThisWeek: number;
}> {
  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59, 999);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);

  const { data: all } = await supabase
    .from('visits')
    .select('scheduled_at, status, type')
    .eq('agent_id', agentId)
    .neq('status', 'cancelled');

  const visits = all || [];
  const today = visits.filter(v => {
    const d = new Date(v.scheduled_at);
    return d >= todayStart && d <= todayEnd;
  }).length;

  const thisWeek = visits.filter(v => {
    const d = new Date(v.scheduled_at);
    return d >= weekStart && d <= weekEnd;
  }).length;

  const pending = visits.filter(v => v.status === 'pending').length;

  const signaturesThisWeek = visits.filter(v => {
    const d = new Date(v.scheduled_at);
    return d >= weekStart && d <= weekEnd && v.type === 'signature';
  }).length;

  return { today, thisWeek, pending, signaturesThisWeek };
}

/**
 * Create a new visit
 */
export async function createVisit(params: CreateVisitParams): Promise<{ data: Visit | null; error: Error | null }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: new Error('Non authentifié') };

  const { data, error } = await supabase
    .from('visits')
    .insert({
      agent_id: user.id,
      property_id: params.propertyId || null,
      lead_name: params.leadName,
      lead_phone: params.leadPhone || null,
      lead_email: params.leadEmail || null,
      lead_notes: params.leadNotes || null,
      type: params.type,
      status: 'pending',
      scheduled_at: params.scheduledAt,
      duration_minutes: params.durationMinutes || 60,
      address: params.address || null,
    })
    .select('*, property:property_id(id, title, type, city, commune, address)')
    .single();

  if (error || !data) return { data: null, error };
  return { data: data as Visit, error: null };
}

/**
 * Update visit status
 */
export async function updateVisitStatus(
  visitId: string,
  status: Visit['status'],
): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('visits')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', visitId);

  return { error };
}

/**
 * Cancel a visit
 */
export async function cancelVisit(visitId: string): Promise<{ error: Error | null }> {
  return updateVisitStatus(visitId, 'cancelled');
}

/**
 * Mark relance as sent and update status to pending (awaiting response)
 */
export async function markRelanceSent(visitId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('visits')
    .update({
      relance_sent_at: new Date().toISOString(),
      follow_up_required: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', visitId);

  return { error };
}

/**
 * Get the next upcoming visit (for the hero card)
 */
export async function getNextVisit(): Promise<{ data: Visit | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('visits')
    .select('*, property:property_id(id, title, type, city, commune, address)')
    .gte('scheduled_at', new Date().toISOString())
    .in('status', ['confirmed', 'pending'])
    .order('scheduled_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  return { data: data as Visit | null, error };
}

/**
 * Format visit type label
 */
export function getVisitTypeLabel(type: Visit['type']): string {
  const labels: Record<Visit['type'], string> = {
    'visit': 'Visite',
    'contre-visite': 'Contre-visite',
    'signature': 'Signature',
    'etat-lieux': 'État des lieux',
  };
  return labels[type] || type;
}

/**
 * Format time from ISO string → "09:30"
 */
export function formatVisitTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get minutes until a visit (positive = future, negative = past)
 */
export function minutesUntilVisit(scheduledAt: string): number {
  return Math.round((new Date(scheduledAt).getTime() - Date.now()) / 60000);
}

/**
 * Format countdown "Dans 45 min" / "Il y a 10 min" / "Maintenant"
 */
export function formatCountdown(scheduledAt: string): { label: string; isUrgent: boolean } {
  const mins = minutesUntilVisit(scheduledAt);
  if (Math.abs(mins) < 5) return { label: 'Maintenant', isUrgent: true };
  if (mins > 0 && mins <= 60) return { label: `Dans ${mins} min`, isUrgent: mins <= 30 };
  if (mins > 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return { label: `Dans ${h}h${m > 0 ? `${m}m` : ''}`, isUrgent: false };
  }
  return { label: `Il y a ${Math.abs(mins)} min`, isUrgent: false };
}
