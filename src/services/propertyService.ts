import { supabase } from '@/integrations/supabase/client';

export interface PropertyData {
  id?: string;
  owner_id?: string;
  title: string;
  description?: string;
  type: string;
  transaction_type: string;
  price: number;
  currency?: string;
  country?: string;
  city: string;
  commune?: string;
  quartier?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  furnished?: boolean;
  amenities?: string[];
  images?: string[];
  status?: string;
  verified?: boolean;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
}

export async function createProperty(property: Omit<PropertyData, 'id' | 'created_at' | 'updated_at'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Non authentifié');

  const { data, error } = await supabase
    .from('properties')
    .insert([{
      ...property,
      owner_id: user.id,
      amenities: property.amenities || [],
      images: property.images || [],
    }])
    .select()
    .single();
  return { data, error };
}

export async function getProperties(filters?: {
  transaction_type?: string;
  type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  owner_id?: string;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' });

  if (filters?.owner_id) {
    query = query.eq('owner_id', filters.owner_id);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.transaction_type) {
    query = query.eq('transaction_type', filters.transaction_type);
  }
  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,quartier.ilike.%${filters.search}%,commune.ilike.%${filters.search}%,address.ilike.%${filters.search}%`);
  }

  // Sorting
  if (filters?.sort === 'price-high') {
    query = query.order('price', { ascending: false });
  } else if (filters?.sort === 'price-low') {
    query = query.order('price', { ascending: true });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1);
  }

  const { data, error, count } = await query;
  return { data, error, count };
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

export async function updateProperty(id: string, updates: Partial<PropertyData>) {
  const { data, error } = await supabase
    .from('properties')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);
  return { error };
}

export async function uploadPropertyImage(file: File, propertyId: string): Promise<{ data: string | null; error: Error | null }> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from('property-images')
    .upload(fileName, file, { upsert: false });

  if (error) return { data: null, error };

  const { data: { publicUrl } } = supabase.storage
    .from('property-images')
    .getPublicUrl(fileName);

  return { data: publicUrl, error: null };
}

export async function deletePropertyImage(path: string) {
  // Extract path from full URL
  const bucketUrl = supabase.storage.from('property-images').getPublicUrl('').data.publicUrl;
  const filePath = path.replace(bucketUrl, '');
  
  const { error } = await supabase.storage
    .from('property-images')
    .remove([filePath]);
  return { error };
}

// Guinea cities data
export const guineaCities = [
  'Conakry', 'Kankan', 'Labé', 'Kindia', 'Nzérékoré',
  'Kissidougou', 'Guéckédou', 'Mamou', 'Siguiri', 'Boké',
  'Faranah', 'Kamsar', 'Dubréka', 'Coyah', 'Dalaba',
  'Pita', 'Kouroussa', 'Télimélé', 'Fria', 'Macenta',
];

export const propertyTypes = [
  { value: 'appartement', label: 'Appartement' },
  { value: 'maison', label: 'Maison' },
  { value: 'villa', label: 'Villa' },
  { value: 'studio', label: 'Studio' },
];

export const transactionTypes = [
  { value: 'location', label: 'Location' },
  { value: 'vente', label: 'Vente' },
];

export const amenitiesList = [
  'Climatisation', 'Générateur', 'Parking', 'Piscine',
  'Jardin', 'Sécurité 24/7', 'Eau courante', 'Électricité',
  'Internet/WiFi', 'Balcon/Terrasse', 'Cuisine équipée', 'Gardien',
];
