import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const shirokyanMvLocations: SacredPlace[] = [
  {
    group: "真っ白なキャンバス",
    name: "成田山新勝寺",
    prefecture: "千葉県",
    address: "千葉県成田市成田1",
    latitude: 35.785091,
    longitude: 140.318101,
    description:
      "『闘う門には幸来たる』のMV撮影地。境内を舞台に、和風の映像演出と力強いダンスパフォーマンスが撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "闘う門には幸来たる",
  },
  {
    group: "真っ白なキャンバス",
    name: "STUDIO EASE 目黒",
    prefecture: "東京都",
    address: "東京都品川区西五反田3丁目1-2",
    latitude: 35.62997,
    longitude: 139.71746,
    description:
      "『光になって』のMV撮影地。ヨーロッパの街並みを再現したスタジオで、白を基調とした明るい映像が撮影された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "光になって",
  },
  {
    group: "真っ白なキャンバス",
    name: "東京多摩フットボールセンター・南豊ヶ丘フィールド",
    prefecture: "東京都",
    address: "東京都多摩市豊ヶ丘6丁目4",
    latitude: 35.61275,
    longitude: 139.42866,
    description:
      "『Bye My Summer』のMV撮影地。旧南豊ヶ丘小学校を活用した施設で、グラウンドや校舎、屋上へ続く階段などが使用された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "Bye My Summer",
  },
];

export const SHIROKYAN_MOCK_SPOTS = sacredPlacesToMockSpots(
  shirokyanMvLocations,
  "shirokyan",
);
