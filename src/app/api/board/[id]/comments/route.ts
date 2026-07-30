import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getServerAuthUser, isServerAuthenticated } from "@/lib/auth/session";
import { BoardDbError } from "@/lib/board/board-db";
import { createBoardComment } from "@/lib/board/register-board";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { createBoardCommentSchema } from "@/types/board";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id: threadId } = await context.params;
    if (!threadId?.trim()) {
      return NextResponse.json(
        { error: "スレッド ID が必要です" },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const loggedIn = await isServerAuthenticated(
      cookieStore.get(MOCK_AUTH_COOKIE)?.value,
    );
    if (!loggedIn) {
      return NextResponse.json(
        { error: "ログインしてからコメントしてください" },
        { status: 401 },
      );
    }

    const body = (await request.json()) as unknown;
    const parsed = createBoardCommentSchema.safeParse(body);

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

    const result = await createBoardComment(threadId, {
      ...parsed.data,
      author,
      authorUserId: user?.id ?? null,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof BoardDbError) {
      const status = error.message.includes("見つかりません") ? 404 : 503;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { error: "コメントの投稿に失敗しました" },
      { status: 500 },
    );
  }
}
