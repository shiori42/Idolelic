import { NextResponse } from "next/server";
import { z } from "zod";

import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { mapSupabaseUser } from "@/lib/auth/user";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const signUpSchema = z.object({
  email: z.string().trim().email("メールアドレスの形式が正しくありません"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上にしてください")
    .max(72, "パスワードが長すぎます"),
  displayName: z
    .string()
    .trim()
    .min(1, "表示名を入力してください")
    .max(40, "表示名は40文字以内にしてください"),
});

export async function POST(request: Request) {
  if (!isSupabaseAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          "Supabase Auth が未設定です。.env.local に ANON KEY を設定してください",
      },
      { status: 503 },
    );
  }

  try {
    const body = (await request.json()) as unknown;
    const parsed = signUpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const supabase = await createSupabaseServerClient();
    const { email, password, displayName } = parsed.data;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (!data.user) {
      return NextResponse.json(
        { error: "登録に失敗しました" },
        { status: 500 },
      );
    }

    const needsEmailConfirmation = !data.session;

    return NextResponse.json({
      user: mapSupabaseUser(data.user),
      needsEmailConfirmation,
    });
  } catch {
    return NextResponse.json(
      { error: "アカウント登録に失敗しました" },
      { status: 500 },
    );
  }
}
