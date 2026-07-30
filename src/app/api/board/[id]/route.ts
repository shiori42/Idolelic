import { NextResponse } from "next/server";

import { getServerEnv } from "@/config/server-env";
import { isOwnerUser } from "@/lib/auth/owner";
import { getServerAuthUser, isServerAuthenticated } from "@/lib/auth/session";
import { BoardDbError, getBoardThreadFromDb } from "@/lib/board/board-db";
import { canResolveBoardThread } from "@/lib/board/permissions";
import { resolveBoardThread } from "@/lib/board/register-board";
import { isMockLoggedInFromRequest } from "@/lib/mock-auth";
import { resolveBoardThreadSchema } from "@/types/board";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id: threadId } = await context.params;
    if (!threadId?.trim()) {
      return NextResponse.json(
        { error: "スレッド ID が必要です" },
        { status: 400 },
      );
    }

    const mockCookie = isMockLoggedInFromRequest(request)
      ? "1"
      : undefined;
    const loggedIn = await isServerAuthenticated(mockCookie);
    if (!loggedIn) {
      return NextResponse.json(
        { error: "ログインしてから操作してください" },
        { status: 401 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as unknown;
    const parsed = resolveBoardThreadSchema.safeParse(body ?? {});
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const user = await getServerAuthUser();
    const isOwner = isOwnerUser(user);
    const { isSupabaseConfigured } = getServerEnv();

    if (isSupabaseConfigured) {
      const existing = await getBoardThreadFromDb(threadId);
      if (!existing) {
        return NextResponse.json(
          { error: "スレッドが見つかりません" },
          { status: 404 },
        );
      }

      if (!canResolveBoardThread(user, existing, isOwner)) {
        return NextResponse.json(
          { error: "解決できるのは投稿者またはオーナーのみです" },
          { status: 403 },
        );
      }

      if (existing.status === "resolved") {
        return NextResponse.json({
          thread: existing,
          threadId,
          status: "resolved" as const,
          resolvedSpotId: existing.resolvedSpotId,
          persisted: true,
        });
      }
    }

    const result = await resolveBoardThread(threadId, parsed.data);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof BoardDbError) {
      const status = error.message.includes("見つかりません") ? 404 : 503;
      return NextResponse.json({ error: error.message }, { status });
    }

    return NextResponse.json(
      { error: "解決の更新に失敗しました" },
      { status: 500 },
    );
  }
}
