import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const pimmsMvLocations: SacredPlace[] = [
  {
    group: "Pimm's",
    name: "北野町広場",
    prefecture: "兵庫県",
    address: "兵庫県神戸市中央区北野町3丁目10",
    latitude: 34.701217,
    longitude: 135.189676,
    description:
      "風見鶏の館前にある広場。『SUNDAY MORNING』のMV撮影地として確認されている。",
    category: "MV",
    region: "関西",
    workTitle: "SUNDAY MORNING",
  },
  {
    group: "Pimm's",
    name: "トーマス坂",
    prefecture: "兵庫県",
    address: "兵庫県神戸市中央区北野町3丁目",
    latitude: 34.7008,
    longitude: 135.1902,
    description:
      "北野異人館街にある坂道。『SUNDAY MORNING』のMVでメンバーが歩く場面に登場する。",
    category: "MV",
    region: "関西",
    workTitle: "SUNDAY MORNING",
  },
  {
    group: "Pimm's",
    name: "風見鶏本舗 北野本店前",
    prefecture: "兵庫県",
    address: "兵庫県神戸市中央区北野町3丁目5-5",
    latitude: 34.7003,
    longitude: 135.1901,
    description:
      "北野異人館街の洋菓子店前。『SUNDAY MORNING』のMV撮影地点。",
    category: "MV",
    region: "関西",
    workTitle: "SUNDAY MORNING",
  },
  {
    group: "Pimm's",
    name: "北野通り",
    prefecture: "兵庫県",
    address: "兵庫県神戸市中央区北野町2丁目周辺",
    latitude: 34.6989,
    longitude: 135.1909,
    description:
      "神戸北野異人館街を東西に通る道路。『SUNDAY MORNING』の街頭シーンが撮影された。",
    category: "MV",
    region: "関西",
    workTitle: "SUNDAY MORNING",
  },
  {
    group: "Pimm's",
    name: "甲子園浜海浜公園・ふるさと海岸",
    prefecture: "兵庫県",
    address: "兵庫県西宮市甲子園浜1丁目",
    latitude: 34.710525,
    longitude: 135.349252,
    description:
      "甲子園浜海浜公園内の砂浜。『BOY MEETS GIRL』のMV撮影地。",
    category: "MV",
    region: "関西",
    workTitle: "BOY MEETS GIRL",
  },
];

export const PIMMS_MOCK_SPOTS = sacredPlacesToMockSpots(
  pimmsMvLocations,
  "pimms",
);
