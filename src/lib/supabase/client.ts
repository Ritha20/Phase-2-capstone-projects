'use client';

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

let supabaseBrowser = createBrowserClient();

function createBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error('Missing public Supabase environment variables');
  }

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: true,
    },
  });
}

export function getSupabaseBrowser() {
  return supabaseBrowser;
}

