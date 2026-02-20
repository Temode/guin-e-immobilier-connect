
-- Ajouter la politique UPDATE pour marquer les messages comme lus
CREATE POLICY "Members can mark messages as read"
  ON public.messages
  FOR UPDATE
  USING (public.is_conversation_member(auth.uid(), conversation_id))
  WITH CHECK (public.is_conversation_member(auth.uid(), conversation_id));
