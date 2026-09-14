import type { Metadata } from "next";

import { TgsDemoScreen } from "@/components/design/TgsDemoScreen";

export const metadata: Metadata = {
  title: "TGSデモ | Idolelic",
  description:
    "解散・活動休止したアイドルの聖地を、地図と歩くナビで巡れるアプリの体験入口",
};

type Props = {
  searchParams: Promise<{ view?: string }>;
};

export default async function TgsDemoPage({ searchParams }: Props) {
  const params = await searchParams;
  const initialView =
    params.view === "map" ||
    params.view === "spot" ||
    params.view === "walk" ||
    params.view === "board"
      ? params.view
      : "home";

  return <TgsDemoScreen initialView={initialView} />;
}
