
-- Table properties
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  transaction_type TEXT NOT NULL,
  price DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GNF',
  country TEXT DEFAULT 'Guinée',
  city TEXT NOT NULL,
  commune TEXT,
  quartier TEXT,
  address TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  area DECIMAL,
  furnished BOOLEAN DEFAULT false,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'available',
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Indexes
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_transaction_type ON public.properties(transaction_type);
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);

-- RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published properties"
  ON public.properties FOR SELECT
  USING (status != 'draft' OR auth.uid() = owner_id);

CREATE POLICY "Owners can create properties"
  ON public.properties FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their properties"
  ON public.properties FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their properties"
  ON public.properties FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Trigger updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket property-images
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Property images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated users can upload property images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "Users can update their property images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'property-images');

CREATE POLICY "Users can delete their property images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'property-images');
