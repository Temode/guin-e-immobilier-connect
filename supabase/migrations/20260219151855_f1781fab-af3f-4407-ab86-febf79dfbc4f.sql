-- Allow any authenticated user to read basic public profile info
-- (needed for PropertyDetail page to show owner name/avatar)
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() IS NOT NULL);