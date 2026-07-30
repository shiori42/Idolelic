import type {
  BoardComment,
  BoardThread,
  CreateBoardCommentInput,
  CreateBoardThreadInput,
} from "@/types/board";

export async function fetchBoardThreadsClient(): Promise<{
  threads: BoardThread[];
  persisted: boolean;
}> {
  const response = await fetch("/api/board", { cache: "no-store" });
  const data = (await response.json()) as {
    threads?: BoardThread[];
    persisted?: boolean;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "掲示板の取得に失敗しました");
  }

  return {
    threads: data.threads ?? [],
    persisted: data.persisted ?? false,
  };
}

export async function createBoardThreadClient(
  input: CreateBoardThreadInput,
): Promise<{ thread: BoardThread; persisted: boolean }> {
  const response = await fetch("/api/board", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    thread?: BoardThread;
    persisted?: boolean;
    error?: string;
  };

  if (!response.ok || !data.thread) {
    throw new Error(data.error ?? "相談の投稿に失敗しました");
  }

  return {
    thread: data.thread,
    persisted: data.persisted ?? false,
  };
}

export async function createBoardCommentClient(
  threadId: string,
  input: CreateBoardCommentInput,
): Promise<{ comment: BoardComment; persisted: boolean }> {
  const response = await fetch(`/api/board/${encodeURIComponent(threadId)}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    comment?: BoardComment;
    persisted?: boolean;
    error?: string;
  };

  if (!response.ok || !data.comment) {
    throw new Error(data.error ?? "コメントの投稿に失敗しました");
  }

  return {
    comment: data.comment,
    persisted: data.persisted ?? false,
  };
}

export async function resolveBoardThreadClient(
  threadId: string,
  input: { resolvedSpotId?: string } = {},
): Promise<{
  thread?: BoardThread;
  threadId: string;
  status: "resolved";
  resolvedSpotId?: string;
  persisted: boolean;
}> {
  const response = await fetch(`/api/board/${encodeURIComponent(threadId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    thread?: BoardThread;
    threadId?: string;
    status?: "resolved";
    resolvedSpotId?: string;
    persisted?: boolean;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "解決の更新に失敗しました");
  }

  return {
    thread: data.thread,
    threadId: data.threadId ?? threadId,
    status: "resolved",
    resolvedSpotId: data.resolvedSpotId ?? data.thread?.resolvedSpotId,
    persisted: data.persisted ?? false,
  };
}
