import { getServerEnv } from "@/config/server-env";
import type {
  BoardComment,
  BoardThread,
  CreateBoardCommentInput,
  CreateBoardThreadInput,
  DbBoardCommentRow,
  DbBoardThreadRow,
} from "@/types/board";
import { rowToBoardComment, rowToBoardThread } from "@/types/board";

export class BoardDbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BoardDbError";
  }
}

const THREAD_SELECT =
  "id,title,group_name,era,hint,body,author,author_user_id,status,resolved_spot_id,created_at,board_comments(id,thread_id,author,author_user_id,body,created_at)";

function restHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

function requireSupabaseRest() {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    throw new BoardDbError(
      "Supabase が未設定です。.env.local に URL と SERVICE_ROLE_KEY を設定してください",
    );
  }

  return { supabaseUrl, supabaseServiceRoleKey };
}

export async function listBoardThreadsFromDb(): Promise<BoardThread[]> {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    return [];
  }

  const url = new URL("/rest/v1/board_threads", supabaseUrl);
  url.searchParams.set("select", THREAD_SELECT);
  url.searchParams.set("order", "created_at.desc");
  url.searchParams.set("board_comments.order", "created_at.asc");

  const response = await fetch(url, {
    headers: restHeaders(supabaseServiceRoleKey),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new BoardDbError(
      `掲示板の取得に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbBoardThreadRow[];
  return rows.map(rowToBoardThread);
}

export async function getBoardThreadFromDb(
  id: string,
): Promise<BoardThread | null> {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  const url = new URL("/rest/v1/board_threads", supabaseUrl);
  url.searchParams.set("select", THREAD_SELECT);
  url.searchParams.set("id", `eq.${id}`);
  url.searchParams.set("board_comments.order", "created_at.asc");
  url.searchParams.set("limit", "1");

  const response = await fetch(url, {
    headers: restHeaders(supabaseServiceRoleKey),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new BoardDbError(
      `スレッドの取得に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbBoardThreadRow[];
  const row = rows[0];
  return row ? rowToBoardThread(row) : null;
}

export async function insertBoardThreadToDb(
  input: CreateBoardThreadInput & {
    author: string;
    authorUserId?: string | null;
  },
): Promise<BoardThread> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();

  const url = new URL("/rest/v1/board_threads", supabaseUrl);
  url.searchParams.set("select", THREAD_SELECT);

  const payload = {
    title: input.title,
    group_name: input.group,
    era: input.era ?? null,
    hint: input.hint,
    body: input.body,
    author: input.author,
    author_user_id: input.authorUserId ?? null,
    status: "open",
  };

  const response = await fetch(url, {
    method: "POST",
    headers: restHeaders(supabaseServiceRoleKey),
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new BoardDbError(
      `相談の投稿に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbBoardThreadRow[];
  const row = rows[0];
  if (!row) {
    throw new BoardDbError("投稿後のデータを取得できませんでした");
  }

  return rowToBoardThread({ ...row, board_comments: row.board_comments ?? [] });
}

export async function insertBoardCommentToDb(
  threadId: string,
  input: CreateBoardCommentInput & {
    author: string;
    authorUserId?: string | null;
  },
): Promise<BoardComment> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();

  const existing = await getBoardThreadFromDb(threadId);
  if (!existing) {
    throw new BoardDbError("スレッドが見つかりません");
  }

  const url = new URL("/rest/v1/board_comments", supabaseUrl);
  const payload = {
    thread_id: threadId,
    author: input.author,
    author_user_id: input.authorUserId ?? null,
    body: input.body,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: restHeaders(supabaseServiceRoleKey),
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new BoardDbError(
      `コメントの投稿に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbBoardCommentRow[];
  const row = rows[0];
  if (!row) {
    throw new BoardDbError("コメント投稿後のデータを取得できませんでした");
  }

  return rowToBoardComment(row);
}

export async function resolveBoardThreadInDb(
  threadId: string,
  resolvedSpotId?: string,
): Promise<BoardThread> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();

  const url = new URL("/rest/v1/board_threads", supabaseUrl);
  url.searchParams.set("select", THREAD_SELECT);
  url.searchParams.set("id", `eq.${threadId}`);

  const payload: Record<string, unknown> = {
    status: "resolved",
  };
  if (resolvedSpotId !== undefined) {
    payload.resolved_spot_id = resolvedSpotId;
  }

  const response = await fetch(url, {
    method: "PATCH",
    headers: restHeaders(supabaseServiceRoleKey),
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new BoardDbError(
      `解決の更新に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbBoardThreadRow[];
  const row = rows[0];
  if (!row) {
    throw new BoardDbError("スレッドが見つかりません");
  }

  return rowToBoardThread(row);
}
