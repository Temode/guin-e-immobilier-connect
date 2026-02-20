
-- Fonction SECURITY DEFINER pour créer une conversation de façon atomique
-- Evite le problème RLS où l'utilisateur n'est pas encore participant au moment du SELECT
CREATE OR REPLACE FUNCTION public.get_or_create_conversation(user_id_1 uuid, user_id_2 uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_conv_id uuid;
  new_conv_id uuid;
BEGIN
  -- Chercher une conversation existante entre les deux utilisateurs
  SELECT cp1.conversation_id INTO existing_conv_id
  FROM public.conversation_participants cp1
  JOIN public.conversation_participants cp2
    ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = user_id_1
    AND cp2.user_id = user_id_2
  LIMIT 1;

  IF existing_conv_id IS NOT NULL THEN
    RETURN existing_conv_id;
  END IF;

  -- Créer une nouvelle conversation
  INSERT INTO public.conversations DEFAULT VALUES
  RETURNING id INTO new_conv_id;

  -- Ajouter les deux participants
  INSERT INTO public.conversation_participants (conversation_id, user_id)
  VALUES (new_conv_id, user_id_1), (new_conv_id, user_id_2);

  RETURN new_conv_id;
END;
$$;
