import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// SQL snippet for setting up the tables in Supabase SQL Editor
export const SUPABASE_SCHEMA_SQL = `-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  restaurant_id TEXT NOT NULL,
  restaurant_name TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  estimated_delivery_time TEXT NOT NULL
);

-- 2. Create Favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  restaurant_id TEXT UNIQUE NOT NULL
);

-- Enable Row Level Security (RLS) & Allow public read/write for demo
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public select on favorites" ON public.favorites FOR SELECT USING (true);
CREATE POLICY "Allow public insert on favorites" ON public.favorites FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete on favorites" ON public.favorites FOR DELETE USING (true);
`;

/**
 * Save an order to Supabase
 */
export async function saveOrderToSupabase(order: any) {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('orders').insert({
      id: order.id,
      restaurant_id: order.restaurantId,
      restaurant_name: order.restaurantName,
      items: order.items,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      tax: order.tax,
      total: order.total,
      status: order.status,
      delivery_address: order.deliveryAddress,
      estimated_delivery_time: order.estimatedDeliveryTime,
    }).select().single();

    if (error) {
      console.warn('Supabase saveOrder error:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase unexpected error:', err);
    return null;
  }
}

/**
 * Fetch orders from Supabase
 */
export async function fetchOrdersFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error.message);
      return null;
    }

    // Map database snake_case back to frontend camelCase
    return data.map((o: any) => ({
      id: o.id,
      createdAt: o.created_at,
      restaurantId: o.restaurant_id,
      restaurantName: o.restaurant_name,
      items: o.items,
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.delivery_fee),
      tax: Number(o.tax),
      total: Number(o.total),
      status: o.status,
      deliveryAddress: o.delivery_address,
      estimatedDeliveryTime: o.estimated_delivery_time,
    }));
  } catch (err) {
    console.error('Supabase fetchOrders error:', err);
    return null;
  }
}

/**
 * Toggle favorite restaurant in Supabase
 */
export async function syncFavoritesWithSupabase(favorites: string[]) {
  if (!supabase) return null;

  try {
    // Sync current array of favorites
    // First clear and re-insert for simple sync
    await supabase.from('favorites').delete().neq('restaurant_id', 'PLACEHOLDER_NEVER_MATCH');
    
    if (favorites.length > 0) {
      const rows = favorites.map(id => ({ restaurant_id: id }));
      await supabase.from('favorites').insert(rows);
    }
  } catch (err) {
    console.warn('Supabase syncFavorites error:', err);
  }
}

/**
 * Fetch favorite restaurant IDs from Supabase
 */
export async function fetchFavoritesFromSupabase() {
  if (!supabase) return null;

  try {
    const { data, error } = await supabase.from('favorites').select('restaurant_id');
    if (error || !data) return null;
    return data.map((row: any) => row.restaurant_id as string);
  } catch (err) {
    console.warn('Supabase fetchFavorites error:', err);
    return null;
  }
}
