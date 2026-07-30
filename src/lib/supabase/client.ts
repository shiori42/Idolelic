import { createBrowserClient } from "@supabase/ssr";

import {
  isSupabaseAuthConfigured,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "@/lib/auth/config";

export function createSupabaseBrowserClient() {
  if (!isSupabaseAuthConfigured()) {
    throw new Error("Supabase Auth が未設定です");
  }

  return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}

export function tryCreateSupabaseBrowserClient() {
  if (!isSupabaseAuthConfigured()) return null;
  return createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
}
