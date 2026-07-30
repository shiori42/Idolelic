import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  if (isSupabaseAuthConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }

  const cookieStore = await cookies();
  cookieStore.delete(MOCK_AUTH_COOKIE);

  redirect("/design/profile");
}
