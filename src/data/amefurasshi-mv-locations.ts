import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const amefurasshiMvLocations: SacredPlace[] = [
  {
    group: "AMEFURASSHI",
    name: "ロイヤルチェスター太田",
    prefecture: "群馬県",
    address: "群馬県太田市飯塚町2056",
    latitude: 36.284244,
    longitude: 139.375961,
    description:
      "ステンドグラスやクラシカルな内装を持つ結婚式場。施設運営会社が『DROP DROP』のMV撮影地であることを公表している。",
    category: "MV",
    region: "関東",
    workTitle: "DROP DROP",
  },
  {
    group: "AMEFURASSHI",
    name: "DEMODE DINER 福生店",
    prefecture: "東京都",
    address: "東京都福生市熊川1121",
    latitude: 35.730956,
    longitude: 139.341958,
    description:
      "国道16号沿いのアメリカンダイナー。『MICHI』のMVでダンスシーンなどが撮影された。",
    category: "MV",
    region: "関東",
    workTitle: "MICHI",
  },
];

export const AMEFURASSHI_MOCK_SPOTS = sacredPlacesToMockSpots(
  amefurasshiMvLocations,
  "amefurasshi",
);
