
-- Corriger la politique INSERT sur conversations : seuls les utilisateurs authentifiés peuvent créer des conversations
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations"
  ON public.conversations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Corriger la politique INSERT sur conversation_participants
DROP POLICY IF EXISTS "Authenticated users can add participants" ON public.conversation_participants;
CREATE POLICY "Authenticated users can add participants"
  ON public.conversation_participants
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
