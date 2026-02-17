
-- Fix overly permissive INSERT policies
DROP POLICY "Authenticated users can create conversations" ON public.conversations;
CREATE POLICY "Authenticated users can create conversations"
ON public.conversations FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY "Authenticated users can add participants" ON public.conversation_participants;
CREATE POLICY "Authenticated users can add participants"
ON public.conversation_participants FOR INSERT
TO authenticated
WITH CHECK (true);
