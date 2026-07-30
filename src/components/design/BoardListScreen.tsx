"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockPage } from "@/components/design/mock-ui";
import { useBoard } from "@/features/board";
import { homePathFor, withAppPrefix } from "@/lib/auth/paths";
import { cn } from "@/lib/utils/cn";

export function BoardListScreen() {
  const pathname = usePathname();
  const { threads, isReady } = useBoard();
  const homePath = homePathFor(pathname);
  const boardNewPath = withAppPrefix(pathname, "/board/new");
  const boardBase = withAppPrefix(pathname, "/board");

  return (
    <>
      <DesignHeader
        title="聖地探し掲示板"
        backHref={homePath}
        right={
          <Link
            href={boardNewPath}
            className="font-semibold text-[var(--mock-brand)]"
            aria-label="相談を投稿"
          >
            ＋
          </Link>
        }
      />
      <MockPage>
        <p className="text-sm text-[var(--mock-muted)]">
          場所が曖昧な聖地は、みんなで特定してから地図に残しましょう。
        </p>

        {!isReady ? (
          <p className="py-10 text-center text-sm text-[var(--mock-muted)]">
            読み込み中…
          </p>
        ) : threads.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--mock-border)] py-10 text-center text-sm text-[var(--mock-muted)]">
            まだ相談スレはありません。
            <br />
            右上の ＋ から最初の投稿をしてみましょう。
          </p>
        ) : (
          <ul className="space-y-3">
            {threads.map((thread) => (
              <li key={thread.id}>
                <Link
                  href={`${boardBase}/${thread.id}`}
                  className="mock-board-card"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        "mock-board-status",
                        thread.status === "resolved" &&
                          "mock-board-status-resolved",
                      )}
                    >
                      {thread.status === "resolved" ? "特定済み" : "募集中"}
                    </span>
                    <span className="text-[0.625rem] text-[var(--mock-muted)]">
                      {thread.createdAt}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold leading-snug">
                    {thread.title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--mock-muted)]">
                    {thread.group}
                    {thread.era ? ` · ${thread.era}` : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed">
                    {thread.body}
                  </p>
                  <p className="mt-3 text-xs font-semibold text-[var(--mock-brand)]">
                    コメント {thread.comments.length} 件 →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </MockPage>
    </>
  );
}
