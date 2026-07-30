import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const himeKyunFruitCanMvLocations: SacredPlace[] = [
  {
    group: "ひめキュンフルーツ缶",
    name: "中田島砂丘",
    prefecture: "静岡県",
    address: "静岡県浜松市中央区中田島町1313",
    latitude: 34.661445,
    longitude: 137.739696,
    description:
      "『ハルカナタ』のMV撮影地。広大な砂丘を舞台に、制服姿のメンバーだけが世界に取り残されたような映像が撮影された。",
    era: "2010年代",
    category: "MV",
    region: "中部",
    workTitle: "ハルカナタ",
  },
];

export const HIME_KYUN_FRUIT_CAN_MOCK_SPOTS = sacredPlacesToMockSpots(
  himeKyunFruitCanMvLocations,
  "himekyun",
);
