import { NextResponse } from "next/server";

import { APP_HOME_PATH, sanitizeAuthNextPath } from "@/lib/auth/paths";
import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = sanitizeAuthNextPath(searchParams.get("next")) ?? APP_HOME_PATH;

  if (!isSupabaseAuthConfigured() || !code) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error.message)}`,
    );
  }

  return NextResponse.redirect(`${origin}${next}`);
}
