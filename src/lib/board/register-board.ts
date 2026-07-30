import { getServerEnv } from "@/config/server-env";
import {
  BoardDbError,
  insertBoardCommentToDb,
  insertBoardThreadToDb,
  listBoardThreadsFromDb,
  resolveBoardThreadInDb,
} from "@/lib/board/board-db";
import type {
  BoardComment,
  BoardThread,
  CreateBoardCommentInput,
  CreateBoardThreadInput,
  ResolveBoardThreadInput,
} from "@/types/board";
import { formatBoardDate } from "@/types/board";

export type CreateBoardThreadResult = {
  thread: BoardThread;
  persisted: boolean;
};

export type CreateBoardCommentResult = {
  comment: BoardComment;
  threadId: string;
  persisted: boolean;
};

export async function fetchBoardThreads(): Promise<BoardThread[]> {
  try {
    return await listBoardThreadsFromDb();
  } catch (error) {
    if (error instanceof BoardDbError) {
      return [];
    }
    throw error;
  }
}

export async function createBoardThread(
  input: CreateBoardThreadInput & {
    author: string;
    authorUserId?: string | null;
  },
): Promise<CreateBoardThreadResult> {
  const { isSupabaseConfigured } = getServerEnv();

  if (isSupabaseConfigured) {
    const thread = await insertBoardThreadToDb(input);
    return { thread, persisted: true };
  }

  return {
    thread: {
      id: `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      title: input.title.trim(),
      group: input.group.trim(),
      era: input.era?.trim() || undefined,
      hint: input.hint.trim(),
      body: input.body.trim(),
      author: input.author.trim() || "ゲスト",
      authorUserId: input.authorUserId ?? undefined,
      status: "open",
      createdAt: formatBoardDate(),
      comments: [],
    },
    persisted: false,
  };
}

export async function createBoardComment(
  threadId: string,
  input: CreateBoardCommentInput & {
    author: string;
    authorUserId?: string | null;
  },
): Promise<CreateBoardCommentResult> {
  const { isSupabaseConfigured } = getServerEnv();

  if (isSupabaseConfigured) {
    const comment = await insertBoardCommentToDb(threadId, input);
    return { comment, threadId, persisted: true };
  }

  return {
    comment: {
      id: `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
      author: input.author.trim() || "ゲスト",
      body: input.body.trim(),
      createdAt: formatBoardDate(),
    },
    threadId,
    persisted: false,
  };
}

export type ResolveBoardThreadResult = {
  thread?: BoardThread;
  threadId: string;
  status: "resolved";
  resolvedSpotId?: string;
  persisted: boolean;
};

export async function resolveBoardThread(
  threadId: string,
  input: ResolveBoardThreadInput = {},
): Promise<ResolveBoardThreadResult> {
  const { isSupabaseConfigured } = getServerEnv();

  if (isSupabaseConfigured) {
    const thread = await resolveBoardThreadInDb(
      threadId,
      input.resolvedSpotId,
    );
    return {
      thread,
      threadId,
      status: "resolved",
      resolvedSpotId: thread.resolvedSpotId,
      persisted: true,
    };
  }

  return {
    threadId,
    status: "resolved",
    resolvedSpotId: input.resolvedSpotId,
    persisted: false,
  };
}
