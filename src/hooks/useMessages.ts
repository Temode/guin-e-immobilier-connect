import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '../context/AuthContext';

export interface Conversation {
  id: string;
  property_id: string | null;
  property_title: string | null;
  property_location: string | null;
  property_price: string | null;
  created_at: string;
  updated_at: string;
  // Computed
  other_participant?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read_at: string | null;
}

export function useMessages() {
  const { user } = useAuthContext();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load conversations on mount and whenever the user changes
  const loadConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Get all conversation IDs where the current user is a participant
      const { data: participations, error: partError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (partError || !participations || participations.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationIds = participations.map((p) => p.conversation_id);

      // Fetch the conversation rows
      const { data: convRows, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError || !convRows) {
        setConversations([]);
        setLoading(false);
        return;
      }

      // For each conversation, enrich with other participant, last message, and unread count
      const enriched: Conversation[] = await Promise.all(
        convRows.map(async (conv) => {
          // Get the other participant
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', conv.id)
            .neq('user_id', user.id);

          let otherParticipant: Conversation['other_participant'] = undefined;

          if (participants && participants.length > 0) {
            const otherUserId = participants[0].user_id;
            const { data: profile } = await supabase
              .from('profiles')
              .select('id, full_name, avatar_url')
              .eq('id', otherUserId)
              .single();

            if (profile) {
              otherParticipant = {
                id: profile.id,
                full_name: profile.full_name,
                avatar_url: profile.avatar_url,
              };
            }
          }

          // Get last message
          const { data: lastMsgRows } = await supabase
            .from('messages')
            .select('content, created_at, sender_id')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const lastMessage =
            lastMsgRows && lastMsgRows.length > 0
              ? {
                  content: lastMsgRows[0].content,
                  created_at: lastMsgRows[0].created_at,
                  sender_id: lastMsgRows[0].sender_id,
                }
              : undefined;

          // Count unread messages
          const { count } = await supabase
            .from('messages')
            .select('id', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .neq('sender_id', user.id)
            .is('read_at', null);

          return {
            id: conv.id,
            property_id: conv.property_id,
            property_title: conv.property_title,
            property_location: conv.property_location,
            property_price: conv.property_price,
            created_at: conv.created_at,
            updated_at: conv.updated_at,
            other_participant: otherParticipant,
            last_message: lastMessage,
            unread_count: count ?? 0,
          } as Conversation;
        })
      );

      setConversations(enriched);
    } catch {
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;

          // If the message belongs to the active conversation, append it
          if (newMessage.conversation_id === activeConversationId) {
            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === newMessage.id)) return prev;
              return [...prev, newMessage];
            });
          }

          // Refresh conversations list to update last_message and unread_count
          loadConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, activeConversationId, loadConversations]);

  // Load messages when activeConversationId changes
  useEffect(() => {
    if (!activeConversationId || !user) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      }

      // Mark unread messages as read
      await markAsRead(activeConversationId);
    };

    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId, user]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId || !user) return;

      await supabase.from('messages').insert({
        conversation_id: activeConversationId,
        sender_id: user.id,
        content,
      });

      // The realtime subscription will pick up the new message
    },
    [activeConversationId, user]
  );

  const getOrCreateConversation = useCallback(
    async (
      otherUserId: string,
      propertyInfo?: { id: string; title: string; location: string; price: string }
    ): Promise<string> => {
      if (!user) throw new Error('User must be authenticated');

      const currentUserId = user.id;

      // Find existing conversation between these two users
      const { data: myParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', currentUserId);

      if (myParticipations) {
        for (const p of myParticipations) {
          const { data: otherP } = await supabase
            .from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', p.conversation_id)
            .eq('user_id', otherUserId);

          if (otherP && otherP.length > 0) {
            return p.conversation_id; // existing conversation found
          }
        }
      }

      // Create new conversation
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({
          property_id: propertyInfo?.id || null,
          property_title: propertyInfo?.title || null,
          property_location: propertyInfo?.location || null,
          property_price: propertyInfo?.price || null,
        })
        .select()
        .single();

      if (convError || !conv) {
        throw new Error('Failed to create conversation');
      }

      // Add both participants
      await supabase.from('conversation_participants').insert([
        { conversation_id: conv.id, user_id: currentUserId },
        { conversation_id: conv.id, user_id: otherUserId },
      ]);

      // Refresh conversations list
      await loadConversations();

      return conv.id;
    },
    [user, loadConversations]
  );

  const markAsRead = useCallback(
    async (conversationId: string) => {
      if (!user) return;

      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id)
        .is('read_at', null);

      // Refresh conversations to update unread counts
      await loadConversations();
    },
    [user, loadConversations]
  );

  return {
    conversations,
    messages,
    activeConversationId,
    loading,
    setActiveConversationId,
    sendMessage,
    getOrCreateConversation,
    markAsRead,
  };
}
