import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  isSupabaseAuthConfigured,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "@/lib/auth/config";

export async function createSupabaseServerClient() {
  if (!isSupabaseAuthConfigured()) {
    throw new Error("Supabase Auth が未設定です");
  }

  const cookieStore = await cookies();

  return createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Component からの set は無視（middleware / Route Handler で更新）
        }
      },
    },
  });
}

export async function tryCreateSupabaseServerClient() {
  if (!isSupabaseAuthConfigured()) return null;
  return createSupabaseServerClient();
}
