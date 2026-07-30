import { z } from "zod";

import { normalizeGroupName, validateGroupName } from "@/lib/spots/group-name";

export type BoardThreadStatus = "open" | "resolved";

export type BoardComment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
};

export type BoardThread = {
  id: string;
  title: string;
  group: string;
  era?: string;
  hint: string;
  body: string;
  author: string;
  authorUserId?: string;
  status: BoardThreadStatus;
  resolvedSpotId?: string;
  createdAt: string;
  comments: BoardComment[];
};

const groupNameSchema = z
  .string()
  .transform((value) => normalizeGroupName(value))
  .superRefine((value, ctx) => {
    const error = validateGroupName(value);
    if (error) {
      ctx.addIssue({ code: "custom", message: error });
    }
  });

export const createBoardThreadSchema = z.object({
  title: z.string().trim().min(1, "タイトルを入力してください"),
  group: groupNameSchema,
  era: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  hint: z.string().trim().min(1, "わかっていることを入力してください"),
  body: z.string().trim().min(1, "相談内容を入力してください"),
  author: z.string().trim().optional(),
});

export type CreateBoardThreadInput = z.infer<typeof createBoardThreadSchema>;

export const createBoardCommentSchema = z.object({
  body: z.string().trim().min(1, "コメントを入力してください").max(2000),
  author: z.string().trim().optional(),
});

export type CreateBoardCommentInput = z.infer<typeof createBoardCommentSchema>;

export const resolveBoardThreadSchema = z.object({
  resolvedSpotId: z
    .string()
    .trim()
    .min(1, "聖地 ID が不正です")
    .optional(),
});

export type ResolveBoardThreadInput = z.infer<typeof resolveBoardThreadSchema>;

export type DbBoardCommentRow = {
  id: string;
  thread_id: string;
  author: string;
  author_user_id: string | null;
  body: string;
  created_at: string;
};

export type DbBoardThreadRow = {
  id: string;
  title: string;
  group_name: string;
  era: string | null;
  hint: string;
  body: string;
  author: string;
  author_user_id: string | null;
  status: BoardThreadStatus;
  resolved_spot_id: string | null;
  created_at: string;
  board_comments?: DbBoardCommentRow[] | null;
};

export function formatBoardDate(isoOrDate: string | Date = new Date()) {
  const date =
    typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
  if (Number.isNaN(date.getTime())) {
    return typeof isoOrDate === "string" ? isoOrDate : "";
  }
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}/${m}/${d}`;
}

export function rowToBoardComment(row: DbBoardCommentRow): BoardComment {
  return {
    id: row.id,
    author: row.author,
    body: row.body,
    createdAt: formatBoardDate(row.created_at),
  };
}

export function rowToBoardThread(row: DbBoardThreadRow): BoardThread {
  const comments = (row.board_comments ?? [])
    .slice()
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    )
    .map(rowToBoardComment);

  return {
    id: row.id,
    title: row.title,
    group: row.group_name,
    era: row.era ?? undefined,
    hint: row.hint,
    body: row.body,
    author: row.author,
    authorUserId: row.author_user_id ?? undefined,
    status: row.status,
    resolvedSpotId: row.resolved_spot_id ?? undefined,
    createdAt: formatBoardDate(row.created_at),
    comments,
  };
}
