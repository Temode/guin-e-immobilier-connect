
-- Add bio column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;

-- Add is_premium column to properties
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
