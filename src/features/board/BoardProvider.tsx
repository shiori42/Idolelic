"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { MOCK_BOARD_THREADS } from "@/data/mock-board";
import {
  createBoardCommentClient,
  createBoardThreadClient,
  fetchBoardThreadsClient,
  resolveBoardThreadClient,
} from "@/lib/board/board-client";
import type {
  BoardComment,
  BoardThread,
  CreateBoardCommentInput,
  CreateBoardThreadInput,
} from "@/types/board";

const STORAGE_KEY = "osimap-board-threads";

type BoardContextValue = {
  threads: BoardThread[];
  getThreadById: (id: string) => BoardThread | undefined;
  addThread: (input: CreateBoardThreadInput) => Promise<BoardThread>;
  addComment: (
    threadId: string,
    input: CreateBoardCommentInput,
  ) => Promise<BoardComment>;
  resolveThread: (
    threadId: string,
    input?: { resolvedSpotId?: string },
  ) => Promise<BoardThread>;
  isReady: boolean;
  isDbPersisted: boolean;
  refresh: () => Promise<void>;
};

const BoardContext = createContext<BoardContextValue | null>(null);

function readLocalThreads(): BoardThread[] {
  if (typeof window === "undefined") return [...MOCK_BOARD_THREADS];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...MOCK_BOARD_THREADS];
    const parsed = JSON.parse(raw) as BoardThread[];
    return Array.isArray(parsed) ? parsed : [...MOCK_BOARD_THREADS];
  } catch {
    return [...MOCK_BOARD_THREADS];
  }
}

function writeLocalThreads(threads: BoardThread[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch {
    // ignore quota errors
  }
}

export function BoardProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<BoardThread[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isDbPersisted, setIsDbPersisted] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { threads: next, persisted } = await fetchBoardThreadsClient();
      if (persisted) {
        setThreads(next);
        setIsDbPersisted(true);
      } else {
        setThreads(readLocalThreads());
        setIsDbPersisted(false);
      }
    } catch {
      setThreads(readLocalThreads());
      setIsDbPersisted(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        await refresh();
      } finally {
        if (!cancelled) setIsReady(true);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const getThreadById = useCallback(
    (id: string) => threads.find((thread) => thread.id === id),
    [threads],
  );

  const addThread = useCallback(async (input: CreateBoardThreadInput) => {
    const result = await createBoardThreadClient(input);

    setThreads((prev) => {
      const next = [
        result.thread,
        ...prev.filter((t) => t.id !== result.thread.id),
      ];
      if (!result.persisted) {
        writeLocalThreads(next);
      }
      return next;
    });
    setIsDbPersisted(result.persisted);

    return result.thread;
  }, []);

  const addComment = useCallback(
    async (threadId: string, input: CreateBoardCommentInput) => {
      const result = await createBoardCommentClient(threadId, input);

      setThreads((prev) => {
        const next = prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          if (thread.comments.some((c) => c.id === result.comment.id)) {
            return thread;
          }
          return {
            ...thread,
            comments: [...thread.comments, result.comment],
          };
        });

        if (!result.persisted) {
          writeLocalThreads(next);
        }

        return next;
      });
      setIsDbPersisted(result.persisted);

      return result.comment;
    },
    [],
  );

  const resolveThread = useCallback(
    async (threadId: string, input: { resolvedSpotId?: string } = {}) => {
      const result = await resolveBoardThreadClient(threadId, input);

      setThreads((prev) => {
        const next = prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          if (result.thread) {
            return {
              ...thread,
              ...result.thread,
              comments: result.thread.comments,
            };
          }
          return {
            ...thread,
            status: "resolved" as const,
            resolvedSpotId: result.resolvedSpotId ?? thread.resolvedSpotId,
          };
        });

        if (!result.persisted) {
          writeLocalThreads(next);
        }

        return next;
      });
      setIsDbPersisted(result.persisted);

      if (result.thread) return result.thread;

      // local path: reconstruct from latest known state after update
      const local = readLocalThreads().find((t) => t.id === threadId);
      if (local) {
        return {
          ...local,
          status: "resolved" as const,
          resolvedSpotId: result.resolvedSpotId ?? local.resolvedSpotId,
        };
      }

      throw new Error("スレッドが見つかりません");
    },
    [],
  );

  const value = useMemo(
    () => ({
      threads,
      getThreadById,
      addThread,
      addComment,
      resolveThread,
      isReady,
      isDbPersisted,
      refresh,
    }),
    [
      threads,
      getThreadById,
      addThread,
      addComment,
      resolveThread,
      isReady,
      isDbPersisted,
      refresh,
    ],
  );

  return (
    <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
  );
}

export function useBoard() {
  const ctx = useContext(BoardContext);
  if (!ctx) {
    throw new Error("useBoard must be used within BoardProvider");
  }
  return ctx;
}

export type { CreateBoardThreadInput };
