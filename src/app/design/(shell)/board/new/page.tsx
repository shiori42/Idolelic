import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { BoardNewThreadScreen } from "@/components/design/BoardNewThreadScreen";
import { isServerAuthenticated } from "@/lib/auth/session";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";

export default async function DesignBoardNewPage() {
  const cookieStore = await cookies();
  const loggedIn = await isServerAuthenticated(
    cookieStore.get(MOCK_AUTH_COOKIE)?.value,
  );

  if (!loggedIn) {
    redirect("/design/login?next=/design/board/new");
  }

  return <BoardNewThreadScreen />;
}
