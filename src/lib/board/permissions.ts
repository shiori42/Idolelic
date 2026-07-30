import type { AuthUser } from "@/lib/auth/user";
import type { BoardThread } from "@/types/board";

/** 投稿者本人か（user ID 優先、なければ表示名で照合） */
export function isBoardThreadAuthor(
  user: AuthUser | null | undefined,
  thread: Pick<BoardThread, "author" | "authorUserId">,
): boolean {
  if (!user) return false;

  if (thread.authorUserId) {
    return thread.authorUserId === user.id;
  }

  const candidates = [
    user.displayName?.trim(),
    user.email?.split("@")[0]?.trim(),
  ].filter(Boolean) as string[];

  return candidates.some((name) => name === thread.author);
}

export function canResolveBoardThread(
  user: AuthUser | null | undefined,
  thread: Pick<BoardThread, "author" | "authorUserId" | "status">,
  isOwner: boolean,
): boolean {
  if (thread.status !== "open") return false;
  return isOwner || isBoardThreadAuthor(user, thread);
}
