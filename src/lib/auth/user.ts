import type { User } from "@supabase/supabase-js";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string;
};

export function mapSupabaseUser(user: User): AuthUser {
  const displayName =
    (typeof user.user_metadata?.display_name === "string" &&
      user.user_metadata.display_name) ||
    user.email?.split("@")[0] ||
    "巡礼者";

  return {
    id: user.id,
    email: user.email ?? "",
    displayName,
  };
}
