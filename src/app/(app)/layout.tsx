import { cookies } from "next/headers";

import { BottomNav } from "@/components/design/BottomNav";
import { MockAuthProvider } from "@/components/design/MockAuthProvider";
import { BoardProvider } from "@/features/board";
import { MemoriesProvider } from "@/features/memories";
import { UserSpotsProvider } from "@/features/user-spots";
import { WalkingSessionProvider } from "@/features/walking-session";
import { getServerAuthUser, isServerAuthenticated } from "@/lib/auth/session";
import { MOCK_AUTH_COOKIE } from "@/lib/mock-auth";
import { M_PLUS_Rounded_1c } from "next/font/google";

import "../design/design.css";

const mPlusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-mplus-rounded",
  display: "swap",
});

export default async function AppShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const mockCookie = cookieStore.get(MOCK_AUTH_COOKIE)?.value;
  const initialUser = await getServerAuthUser();
  const initialLoggedIn = await isServerAuthenticated(mockCookie);

  return (
    <div className={`design-app ${mPlusRounded.variable}`}>
      <MockAuthProvider
        initialLoggedIn={initialLoggedIn}
        initialUser={initialUser}
      >
        <MemoriesProvider>
          <UserSpotsProvider>
            <BoardProvider>
              <WalkingSessionProvider>
                <div className="mock-shell-content">{children}</div>
                <BottomNav />
              </WalkingSessionProvider>
            </BoardProvider>
          </UserSpotsProvider>
        </MemoriesProvider>
      </MockAuthProvider>
    </div>
  );
}
