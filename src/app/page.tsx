import { redirect } from "next/navigation";

import { APP_HOME_PATH } from "@/lib/auth/paths";

/** 本番入口: ランディングはスキップしてアプリ本体へ */
export default function RootPage() {
  redirect(APP_HOME_PATH);
}
