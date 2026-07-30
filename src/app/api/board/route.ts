import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getServerEnv } from "@/config/server-env";
import { getServerAuthUser, isServerAuthenticated } from "@/lib/auth/session";
import { BoardDbError } from "@/lib/board/board-db";
import {
  createBoardThread,
  fetchBoardThreads,
} from "@/lib/board/register-board";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { createBoardThreadSchema } from "@/types/board";

export async function GET() {
  try {
    const env = getServerEnv();
    const threads = await fetchBoardThreads();

    return NextResponse.json({
      threads,
      persisted: env.isSupabaseConfigured,
    });
  } catch (error) {
    if (error instanceof BoardDbError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "掲示板の取得に失敗しました" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const loggedIn = await isServerAuthenticated(
      cookieStore.get(MOCK_AUTH_COOKIE)?.value,
    );
    if (!loggedIn) {
      return NextResponse.json(
        { error: "ログインしてから投稿してください" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as unknown;
    const parsed = createBoardThreadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const user = await getServerAuthUser();
    const author =
      user?.displayName ||
      parsed.data.author?.trim() ||
      "ゲスト";

    const result = await createBoardThread({
      ...parsed.data,
      author,
      authorUserId: user?.id ?? null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof BoardDbError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "相談の投稿に失敗しました" },
      { status: 500 },
    );
  }
}
