import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";

export async function GET(request: Request) {
  if (isSupabaseAuthConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(MOCK_AUTH_COOKIE);

  const next = new URL(request.url).searchParams.get("next");
  redirect(next?.startsWith("/") ? next : "/profile");
}
