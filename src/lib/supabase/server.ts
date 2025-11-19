import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

let supabaseAdmin: SupabaseClient<Database> | null = null;

export async function getSupabaseAdmin() {
  if (supabaseAdmin) {
    return supabaseAdmin;
  }

  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase service role environment variables');
  }

  supabaseAdmin = createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabaseAdmin;
}

