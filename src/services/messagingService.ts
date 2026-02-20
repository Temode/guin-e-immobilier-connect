import { supabase } from '@/integrations/supabase/client';

export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_text: string | null;
  last_message_at: string | null;
  participants: ConversationParticipant[];
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  profile?: {
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

/** Get all conversations for the current user with participant profiles */
export async function getUserConversations(userId: string): Promise<{ data: Conversation[]; error: Error | null }> {
  try {
    // Get conversation IDs the user participates in
    const { data: participantRows, error: pError } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    if (pError) throw pError;
    if (!participantRows || participantRows.length === 0) return { data: [], error: null };

    const convIds = participantRows.map(p => p.conversation_id);

    // Fetch conversations
    const { data: conversations, error: cError } = await supabase
      .from('conversations')
      .select('*')
      .in('id', convIds)
      .order('last_message_at', { ascending: false });

    if (cError) throw cError;

    // Fetch all participants for these conversations with profiles
    const { data: allParticipants, error: apError } = await supabase
      .from('conversation_participants')
      .select('*')
      .in('conversation_id', convIds);

    if (apError) throw apError;

    // Fetch profiles for all participant user_ids
    const userIds = [...new Set((allParticipants || []).map(p => p.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, phone')
      .in('id', userIds);

    const profileMap = new Map((profiles || []).map(p => [p.id, p]));

    // Merge
    const result: Conversation[] = (conversations || []).map(conv => ({
      ...conv,
      participants: (allParticipants || [])
        .filter(p => p.conversation_id === conv.id)
        .map(p => ({
          ...p,
          profile: profileMap.get(p.user_id) || undefined,
        })),
    }));

    return { data: result, error: null };
  } catch (err) {
    return { data: [], error: err as Error };
  }
}

/** Get messages for a conversation */
export async function getConversationMessages(conversationId: string): Promise<{ data: Message[]; error: Error | null }> {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  return { data: data || [], error: error as Error | null };
}

/** Send a message */
export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<{ data: Message | null; error: Error | null }> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: conversationId, sender_id: senderId, content })
    .select()
    .single();

  return { data, error: error as Error | null };
}

/** Mark messages as read */
export async function markMessagesAsRead(conversationId: string, userId: string): Promise<void> {
  await supabase
    .from('messages')
    .update({ read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);
}

/** Create or get existing conversation between two users */
export async function getOrCreateConversation(userId1: string, userId2: string): Promise<{ data: string | null; error: Error | null }> {
  try {
    // Check if a conversation already exists between these two users
    const { data: p1 } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId1);

    const { data: p2 } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId2);

    const ids1 = new Set((p1 || []).map(p => p.conversation_id));
    const commonId = (p2 || []).find(p => ids1.has(p.conversation_id))?.conversation_id;

    if (commonId) return { data: commonId, error: null };

    // Create new conversation
    const { data: conv, error: cErr } = await supabase
      .from('conversations')
      .insert({})
      .select()
      .single();

    if (cErr || !conv) throw cErr;

    // Add both participants
    const { error: pErr } = await supabase
      .from('conversation_participants')
      .insert([
        { conversation_id: conv.id, user_id: userId1 },
        { conversation_id: conv.id, user_id: userId2 },
      ]);

    if (pErr) throw pErr;

    return { data: conv.id, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

/** Subscribe to new messages in real-time */
export function subscribeToMessages(conversationId: string, onMessage: (msg: Message) => void) {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => onMessage(payload.new as Message)
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

<<<<<<< HEAD
/** Subscribe to conversation updates (last_message changes) */
export function subscribeToConversations(userId: string, onUpdate: () => void) {
  const channel = supabase
    .channel(`conversations:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'conversations',
=======
/** Subscribe to conversation updates (last_message changes + new conversations) */
export function subscribeToConversations(userId: string, onUpdate: () => void) {
  const channel = supabase
    .channel(`conversations:${userId}`)
    // Conversation updated (last_message_text / last_message_at via trigger)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'conversations' },
      () => onUpdate()
    )
    // New conversation where the user was added as participant
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_participants',
        filter: `user_id=eq.${userId}`,
>>>>>>> de9e1c0de1ff7c61f11845f2f1bc775e3e4486f2
      },
      () => onUpdate()
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/** Get unread message count for a conversation */
export async function getUnreadCount(conversationId: string, userId: string): Promise<number> {
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('read', false);

  return count || 0;
}
