import { redirect } from "next/navigation";

import { AdminSpotsScreen } from "@/components/design/AdminSpotsScreen";
import { DesignHeader } from "@/components/design/DesignHeader";
import { MockCard, MockPage } from "@/components/design/mock-ui";
import { getServerEnv } from "@/config/server-env";
import { APP_HOME_PATH } from "@/lib/auth/paths";
import { isOwnerUser } from "@/lib/auth/owner";
import { getServerAuthUser } from "@/lib/auth/session";
import {
  CommunitySpotsDbError,
  listAllSpotsFromDb,
} from "@/lib/spots/community-spots-db";

export default async function AdminPage() {
  const user = await getServerAuthUser();
  if (!isOwnerUser(user)) {
    redirect(APP_HOME_PATH);
  }

  const env = getServerEnv();
  let spots: Awaited<ReturnType<typeof listAllSpotsFromDb>> = [];
  let loadError: string | null = null;

  if (env.isSupabaseConfigured) {
    try {
      spots = await listAllSpotsFromDb();
    } catch (error) {
      loadError =
        error instanceof CommunitySpotsDbError
          ? error.message
          : "聖地一覧の取得に失敗しました";
    }
  }

  return (
    <>
      <DesignHeader title="データ管理" backHref="/profile" />
      <MockPage>
        {loadError ? (
          <MockCard pad className="space-y-2">
            <p className="text-sm font-semibold text-rose-800">
              DB のテーブルがまだありません
            </p>
            <p className="text-xs leading-relaxed text-[var(--mock-muted)]">
              Supabase の SQL Editor で{" "}
              <code className="rounded bg-black/5 px-1">
                supabase/bootstrap-schema.sql
              </code>{" "}
              を実行してください。完了後、このページを再読み込みします。
            </p>
            <p className="break-all text-[0.625rem] text-rose-700/80">
              {loadError}
            </p>
          </MockCard>
        ) : (
          <AdminSpotsScreen
            initialSpots={spots}
            persisted={env.isSupabaseConfigured}
          />
        )}
      </MockPage>
    </>
  );
}
