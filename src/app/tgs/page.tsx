import type { Metadata } from "next";

import { TgsDemoScreen } from "@/components/design/TgsDemoScreen";

export const metadata: Metadata = {
  title: "TGSデモ | Idolelic",
  description:
    "解散・活動休止したアイドルの聖地を、地図と歩くナビで巡れるアプリの体験入口",
};

export default function TgsDemoPage() {
  return <TgsDemoScreen />;
}
