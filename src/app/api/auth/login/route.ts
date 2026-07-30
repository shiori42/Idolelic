import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { mapSupabaseUser } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const loginSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が正しくありません"),
  password: z.string().min(1, "パスワードを入力してください"),
});

export async function POST(request: Request) {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json(
      { error: "Supabase Auth が未設定です" },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword(parsed.data);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "ログインに失敗しました" },
        { status: 401 },
      );
    }

    return NextResponse.json({ user: mapSupabaseUser(data.user) });
  } catch {
    return NextResponse.json(
      { error: "ログインに失敗しました" },
      { status: 500 },
    );
  }
}
