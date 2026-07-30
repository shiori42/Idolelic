import type { AuthUser } from "@/lib/auth/user";

/** オーナー専用。クライアントに公開しない（サーバーのみ） */
export function getOwnerEmail(): string | null {
  const raw = process.env.OWNER_EMAIL?.trim();
  return raw ? raw.toLowerCase() : null;
}

export function isOwnerEmail(email: string | null | undefined): boolean {
  const owner = getOwnerEmail();
  if (!owner || !email?.trim()) return false;
  return email.trim().toLowerCase() === owner;
}

/** Supabase ユーザーのみ。モックログインはオーナーにならない */
export function isOwnerUser(user: AuthUser | null | undefined): boolean {
  if (!user?.email) return false;
  return isOwnerEmail(user.email);
}

export function assertOwner(user: AuthUser | null | undefined): AuthUser {
  if (!isOwnerUser(user)) {
    throw new OwnerAccessError();
  }
  return user!;
}

export class OwnerAccessError extends Error {
  constructor(message = "オーナー権限が必要です") {
    super(message);
    this.name = "OwnerAccessError";
  }
}
