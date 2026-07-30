export const MOCK_AUTH_COOKIE = "osimap-mock-auth";
export const MOCK_AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export { sanitizeAuthNextPath } from "@/lib/auth/paths";

export function isMockLoggedIn(cookieValue: string | undefined) {
  return cookieValue === "1";
}

export function isMockLoggedInFromCookieHeader(cookieHeader: string | null) {
  if (!cookieHeader) return false;

  return cookieHeader.split(";").some((part) => {
    const [name, value] = part.trim().split("=");
    return name === MOCK_AUTH_COOKIE && value === "1";
  });
}

export function isMockLoggedInFromRequest(request: Request) {
  return isMockLoggedInFromCookieHeader(request.headers.get("cookie"));
}

/** @deprecated use @/lib/auth/paths */
export function sanitizeAuthNextPathLegacy(next: string | null | undefined) {
  if (!next || !next.startsWith("/design")) return null;
  if (next.startsWith("//")) return null;
  return next;
}
