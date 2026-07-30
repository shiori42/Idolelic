"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { useMockAuth } from "@/components/design/MockAuthProvider";
import { MockButton, MockCard, MockPage } from "@/components/design/mock-ui";
import { useBoard } from "@/features/board";
import { withAppPrefix } from "@/lib/auth/paths";
import { canResolveBoardThread } from "@/lib/board/permissions";
import { cn } from "@/lib/utils/cn";

type BoardThreadScreenProps = {
  threadId: string;
  isOwner?: boolean;
};

export function BoardThreadScreen({
  threadId,
  isOwner = false,
}: BoardThreadScreenProps) {
  const pathname = usePathname();
  const { user, isLoggedIn } = useMockAuth();
  const { getThreadById, addComment, resolveThread, isReady } = useBoard();
  const boardPath = withAppPrefix(pathname, "/board");
  const loginPath = withAppPrefix(pathname, "/login");
  const thread = getThreadById(threadId);

  const authorName =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "ゲスト";

  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  const canResolve =
    !!thread && canResolveBoardThread(user, thread, isOwner);

  async function handleComment() {
    const trimmed = body.trim();
    if (!trimmed || submitting) return;

    if (!isLoggedIn) {
      setError("ログインしてからコメントしてください");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await addComment(threadId, {
        body: trimmed,
        author: authorName,
      });
      setBody("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "コメントの投稿に失敗しました",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResolve() {
    if (!canResolve || resolving) return;
    setResolving(true);
    setResolveError(null);
    try {
      await resolveThread(threadId);
    } catch (err) {
      setResolveError(
        err instanceof Error ? err.message : "解決の更新に失敗しました",
      );
    } finally {
      setResolving(false);
    }
  }

  if (!isReady) {
    return (
      <>
        <DesignHeader title="スレ詳細" backHref={boardPath} />
        <MockPage>
          <p className="py-12 text-center text-sm text-[var(--mock-muted)]">
            読み込み中…
          </p>
        </MockPage>
      </>
    );
  }

  if (!thread) {
    return (
      <>
        <DesignHeader title="スレ詳細" backHref={boardPath} />
        <MockPage>
          <p className="py-12 text-center text-sm text-[var(--mock-muted)]">
            スレッドが見つかりません
          </p>
        </MockPage>
      </>
    );
  }

  return (
    <>
      <DesignHeader title="スレ詳細" backHref={boardPath} />
      <MockPage className="mock-detail-page">
        <div className="mock-detail-hero">
          <span
            className={cn(
              "mock-board-status",
              thread.status === "resolved" && "mock-board-status-resolved",
            )}
          >
            {thread.status === "resolved" ? "特定済み" : "募集中"}
          </span>
          <h2 className="mock-detail-title mt-3">{thread.title}</h2>
          <p className="mock-detail-sub">
            {thread.group}
            {thread.era ? ` · ${thread.era}` : ""} · 投稿: {thread.author}
          </p>
        </div>

        <MockCard pad className="space-y-3">
          <p className="mock-section-label">わかっていること</p>
          <p className="text-sm leading-relaxed">{thread.hint}</p>
          <p className="mock-section-label">相談内容</p>
          <p className="text-sm leading-relaxed">{thread.body}</p>
        </MockCard>

        {canResolve ? (
          <div className="space-y-2">
            <button
              type="button"
              className="mock-btn mock-btn-secondary"
              onClick={() => void handleResolve()}
              disabled={resolving}
            >
              {resolving ? "更新中…" : "特定済みにする"}
            </button>
            {resolveError ? (
              <p className="text-sm text-rose-700">{resolveError}</p>
            ) : (
              <p className="text-xs text-[var(--mock-muted)]">
                投稿者またはオーナーだけが解決できます
              </p>
            )}
          </div>
        ) : null}

        {thread.status === "resolved" && thread.resolvedSpotId ? (
          <MockButton
            href={withAppPrefix(pathname, `/spots/${thread.resolvedSpotId}`)}
          >
            特定された聖地を見る
          </MockButton>
        ) : null}

        <section className="space-y-3">
          <p className="mock-section-label">みんなのコメント</p>
          {thread.comments.length === 0 ? (
            <MockCard pad className="text-center">
              <p className="text-sm text-[var(--mock-muted)]">
                まだコメントはありません
              </p>
            </MockCard>
          ) : (
            <ul className="space-y-3">
              {thread.comments.map((comment) => (
                <li key={comment.id} className="mock-memory-card">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold">{comment.author}</p>
                    <p className="shrink-0 text-[0.625rem] text-[var(--mock-muted)]">
                      {comment.createdAt}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed">{comment.body}</p>
                </li>
              ))}
            </ul>
          )}

          {isLoggedIn ? (
            <div className="mock-form">
              <label className="mock-form-field">
                <span className="mock-form-label">コメントを書く</span>
                <textarea
                  className="mock-form-textarea"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="知っている場所やヒントを書いてください"
                  rows={3}
                />
              </label>
              {error ? (
                <p className="text-sm text-rose-700">{error}</p>
              ) : null}
              <button
                type="button"
                className="mock-btn mock-btn-primary"
                onClick={() => void handleComment()}
                disabled={!body.trim() || submitting}
              >
                {submitting ? "送信中…" : "コメントする"}
              </button>
              <p className="text-center text-xs text-[var(--mock-muted)]">
                投稿者: {authorName}
              </p>
            </div>
          ) : (
            <MockCard pad className="space-y-3 text-center">
              <p className="text-sm text-[var(--mock-muted)]">
                コメントするにはログインが必要です
              </p>
              <Link
                href={`${loginPath}?next=${encodeURIComponent(`${boardPath}/${threadId}`)}`}
                className="mock-btn mock-btn-secondary text-center"
              >
                ログインする
              </Link>
            </MockCard>
          )}
        </section>
      </MockPage>
    </>
  );
}
