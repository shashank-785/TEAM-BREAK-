import dotenv from 'dotenv';
dotenv.config();

export interface SupabaseConfig {
  supabaseUrl: string | null;
  supabaseAnonKey: string | null;
  isConfigured: boolean;
}

export const getSupabaseConfig = (): SupabaseConfig => {
  const url = process.env.SUPABASE_URL || null;
  const key = process.env.SUPABASE_ANON_KEY || null;
  return {
    supabaseUrl: url,
    supabaseAnonKey: key ? `${key.substring(0, 6)}...` : null,
    isConfigured: Boolean(url && key)
  };
};

/**
 * Supabase client proxy helper.
 * If Supabase environment variables are provided, queries can forward to Supabase REST endpoints.
 * Otherwise, the application seamlessly uses the resilient local database engine.
 */
export async function querySupabaseTable<T>(table: string): Promise<T[] | null> {
  const { supabaseUrl, supabaseAnonKey, isConfigured } = getSupabaseConfig();
  if (!isConfigured || !supabaseUrl || !process.env.SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/${table}?select=*`, {
      headers: {
        'apikey': process.env.SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      }
    });
    if (!res.ok) return null;
    return (await res.json()) as T[];
  } catch (err) {
    console.warn(`[Supabase] Error querying ${table}, using local db:`, err);
    return null;
  }
}
