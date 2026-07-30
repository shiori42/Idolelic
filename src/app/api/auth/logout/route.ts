import { NextResponse } from "next/server";

import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST() {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json({ ok: true });
  }

  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "ログアウトに失敗しました" }, { status: 500 });
  }
}
