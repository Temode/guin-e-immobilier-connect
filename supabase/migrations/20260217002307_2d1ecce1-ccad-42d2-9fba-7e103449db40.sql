
-- Table des locations actives
CREATE TABLE public.rentals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  tenant_id UUID NOT NULL,
  owner_id UUID NOT NULL,
  agent_id UUID,
  
  rent_amount DECIMAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GNF',
  agent_commission_percent DECIMAL DEFAULT 10,
  
  start_date DATE NOT NULL,
  end_date DATE,
  
  payment_method TEXT, -- orange_money, mtn_money, bank
  payment_day_of_month INTEGER DEFAULT 1,
  
  status TEXT NOT NULL DEFAULT 'active', -- active, terminated, pending
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;

-- Tenants can view their rentals
CREATE POLICY "Tenants can view their rentals"
  ON public.rentals FOR SELECT
  TO authenticated
  USING (auth.uid() = tenant_id);

-- Owners can view their rentals
CREATE POLICY "Owners can view their rentals"
  ON public.rentals FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id);

-- Agents can view their rentals
CREATE POLICY "Agents can view their rentals"
  ON public.rentals FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

-- Owners and agents can create rentals
CREATE POLICY "Owners can create rentals"
  ON public.rentals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id OR auth.uid() = agent_id);

-- Owners and agents can update their rentals
CREATE POLICY "Owners can update their rentals"
  ON public.rentals FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_id OR auth.uid() = agent_id);

-- Owners can delete their rentals
CREATE POLICY "Owners can delete their rentals"
  ON public.rentals FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Trigger for updated_at
CREATE TRIGGER update_rentals_updated_at
  BEFORE UPDATE ON public.rentals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
