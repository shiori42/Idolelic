import { isMockLoggedIn } from "@/lib/mock-auth";
import { tryCreateSupabaseServerClient } from "@/lib/supabase/server";

import { isSupabaseAuthConfigured } from "./config";
import { mapSupabaseUser, type AuthUser } from "./user";

export type { AuthUser } from "./user";

export async function getServerAuthUser(): Promise<AuthUser | null> {
  if (isSupabaseAuthConfigured()) {
    const supabase = await tryCreateSupabaseServerClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) return mapSupabaseUser(user);
    }
  }

  return null;
}

export async function isServerAuthenticated(
  mockCookieValue?: string | undefined,
): Promise<boolean> {
  const user = await getServerAuthUser();
  if (user) return true;
  return isMockLoggedIn(mockCookieValue);
}
