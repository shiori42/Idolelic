import type { Metadata } from "next";

import { GpsLabClient } from "./GpsLabClient";

export const metadata: Metadata = {
  title: "GPS Lab | 聖地巡礼×散歩",
  description: "位置情報取得と時速判定の検証画面",
};

export default function GpsLabPage() {
  return <GpsLabClient />;
}
