/** 本番アプリのデフォルトホーム */
export const APP_HOME_PATH = "/home";

/** デザインモック用ホーム（デモ・検証用） */
export const DESIGN_HOME_PATH = "/design/home";

/** ログイン後のリダイレクト先（同一オリジン内パスのみ許可） */
export function sanitizeAuthNextPath(next: string | null | undefined) {
  if (!next || !next.startsWith("/")) return null;
  if (next.startsWith("//")) return null;
  if (next.includes("://")) return null;
  return next;
}

export function authHref(
  base: "/login" | "/signup",
  nextPath?: string,
  design = false,
) {
  const prefix = design ? "/design" : "";
  const path = `${prefix}${base}`;
  if (!nextPath) return path;
  return `${path}?next=${encodeURIComponent(nextPath)}`;
}

export function isDesignPath(pathname: string) {
  return pathname.startsWith("/design");
}

/** `/design` 配下ならプレフィックス付き、本番ルートならそのまま */
export function appPrefix(pathname: string) {
  return isDesignPath(pathname) ? "/design" : "";
}

export function withAppPrefix(pathname: string, path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${appPrefix(pathname)}${normalized}`;
}

export function homePathFor(pathname: string) {
  return isDesignPath(pathname) ? DESIGN_HOME_PATH : APP_HOME_PATH;
}

export function appPathFor(pathname: string, appPath: string, designPath: string) {
  return isDesignPath(pathname) ? designPath : appPath;
}
