/**
 * Notification Service — Gestion des notifications in-platform
 *
 * Responsabilités :
 * 1. Créer des notifications pour tous les acteurs après un paiement
 * 2. Récupérer / marquer comme lues les notifications d'un utilisateur
 * 3. Compter les notifications non lues
 */
import { supabase } from '@/integrations/supabase/client';

/* ─── Types ─── */

export interface NotificationData {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type: string;
  metadata?: Record<string, unknown>;
}

/* ─── Create a single notification ─── */

export async function createNotification(params: CreateNotificationParams): Promise<{
  data: NotificationData | null;
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: params.userId,
      title: params.title,
      message: params.message,
      type: params.type,
      metadata: params.metadata || null,
    })
    .select()
    .single();

  if (error) return { data: null, error };
  return { data: data as NotificationData, error: null };
}

/* ─── Create payment notifications for all parties ─── */

/**
 * After a successful rent payment, notify:
 * 1. Locataire (confirmation + reçu disponible)
 * 2. Agent/Démarcheur (paiement reçu)
 * 3. Propriétaire (paiement reçu pour son bien)
 * 4. Tous les admins (notification de supervision)
 */
export async function createPaymentNotifications(params: {
  transactionId: string;
  tenantId: string;
  tenantName: string;
  agentId: string | null;
  ownerId: string;
  amount: number;
  currency: string;
  propertyTitle: string;
  paymentReference: string;
  rentPeriod: string;
}): Promise<{ error: Error | null }> {
  const fmtAmount = params.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const notifications: CreateNotificationParams[] = [];

  const baseMeta = {
    transaction_id: params.transactionId,
    amount: params.amount,
    currency: params.currency,
    payment_reference: params.paymentReference,
    property_title: params.propertyTitle,
    rent_period: params.rentPeriod,
  };

  // 1. Notification locataire
  notifications.push({
    userId: params.tenantId,
    title: 'Paiement confirmé',
    message: `Votre loyer de ${fmtAmount} ${params.currency} pour "${params.propertyTitle}" (${params.rentPeriod}) a été payé avec succès. Votre reçu est disponible.`,
    type: 'payment_confirmed',
    metadata: { ...baseMeta, role: 'tenant' },
  });

  // 2. Notification agent (si différent du propriétaire)
  if (params.agentId) {
    notifications.push({
      userId: params.agentId,
      title: 'Paiement de loyer reçu',
      message: `${params.tenantName} a payé son loyer de ${fmtAmount} ${params.currency} pour "${params.propertyTitle}" (${params.rentPeriod}). Votre commission a été créditée.`,
      type: 'payment_received',
      metadata: { ...baseMeta, role: 'agent', payer_id: params.tenantId },
    });
  }

  // 3. Notification propriétaire
  if (params.ownerId !== params.agentId) {
    notifications.push({
      userId: params.ownerId,
      title: 'Loyer encaissé',
      message: `Le loyer de ${fmtAmount} ${params.currency} pour "${params.propertyTitle}" (${params.rentPeriod}) a été payé par ${params.tenantName}. Votre part a été créditée.`,
      type: 'payment_received',
      metadata: { ...baseMeta, role: 'owner', payer_id: params.tenantId },
    });
  }

  // 4. Notifications admins
  const { data: adminRoles } = await supabase
    .from('user_roles')
    .select('user_id')
    .eq('role', 'admin');

  if (adminRoles) {
    for (const admin of adminRoles) {
      notifications.push({
        userId: admin.user_id,
        title: 'Paiement de loyer effectué',
        message: `${params.tenantName} a payé ${fmtAmount} ${params.currency} pour "${params.propertyTitle}".`,
        type: 'admin_payment_alert',
        metadata: { ...baseMeta, role: 'admin', payer_id: params.tenantId },
      });
    }
  }

  // Insert all notifications in batch
  if (notifications.length > 0) {
    const { error } = await supabase
      .from('notifications')
      .insert(
        notifications.map((n) => ({
          user_id: n.userId,
          title: n.title,
          message: n.message,
          type: n.type,
          metadata: n.metadata || null,
        }))
      );

    if (error) {
      console.error('[Notifications] Batch insert error:', error);
      return { error };
    }
  }

  return { error: null };
}

/* ─── Fetch notifications for a user ─── */

export async function getUserNotifications(
  userId: string,
  options?: { limit?: number; offset?: number; unreadOnly?: boolean; type?: string }
): Promise<{ data: NotificationData[]; error: Error | null }> {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) query = query.eq('read', false);
  if (options?.type) query = query.eq('type', options.type);
  if (options?.limit) query = query.limit(options.limit);
  if (options?.offset) query = query.range(options.offset, options.offset + (options.limit || 20) - 1);

  const { data, error } = await query;
  if (error) return { data: [], error };
  return { data: (data || []) as NotificationData[], error: null };
}

/* ─── Count unread notifications ─── */

export async function getUnreadCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) return 0;
  return count || 0;
}

/* ─── Mark a single notification as read ─── */

export async function markAsRead(notificationId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId);

  return { error };
}

/* ─── Mark all notifications as read for a user ─── */

export async function markAllAsRead(userId: string): Promise<{ error: Error | null }> {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  return { error };
}
