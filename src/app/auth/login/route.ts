import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { MOCK_AUTH_COOKIE, MOCK_AUTH_COOKIE_MAX_AGE } from "@/lib/mock-auth";
import { APP_HOME_PATH, sanitizeAuthNextPath } from "@/lib/auth/paths";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(MOCK_AUTH_COOKIE, "1", {
    path: "/",
    maxAge: MOCK_AUTH_COOKIE_MAX_AGE,
    sameSite: "lax",
  });

  const next = sanitizeAuthNextPath(
    new URL(request.url).searchParams.get("next"),
  );

  redirect(next ?? APP_HOME_PATH);
}
