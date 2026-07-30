import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const kamiyadoMvLocations: SacredPlace[] = [
  {
    group: "神宿",
    name: "那須ハイランドパーク",
    prefecture: "栃木県",
    address: "栃木県那須郡那須町高久乙3375",
    latitude: 37.064024,
    longitude: 139.964783,
    description:
      "『Caramel Sweet』のMV撮影地。園内のアトラクションやカラフルな街並みを使った、明るくポップな映像が撮影された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "Caramel Sweet",
  },
  {
    group: "神宿",
    name: "ビッグエコー品川港南口駅前店",
    prefecture: "東京都",
    address: "東京都港区港南2丁目6-9",
    latitude: 35.62864,
    longitude: 139.742384,
    description:
      "『HAPPY PARTY NIGHT』のMV撮影地。メンバーがカラオケを楽しむ場面や、店員として働く場面が撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "HAPPY PARTY NIGHT",
  },
  {
    group: "神宿",
    name: "ビッグエコー品川港南口中央店",
    prefecture: "東京都",
    address: "東京都港区港南2丁目2-11 鳳和ビル1階",
    latitude: 35.628965,
    longitude: 139.742621,
    description:
      "『HAPPY PARTY NIGHT』のMVで使用されたもう一つの店舗。パーティールームなどでメンバーが盛り上がる場面が撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "HAPPY PARTY NIGHT",
  },
  {
    group: "神宿",
    name: "ビッグエコー渋谷センター街本店",
    prefecture: "東京都",
    address: "東京都渋谷区宇田川町21-8 渋谷平和ビル3階",
    latitude: 35.660102,
    longitude: 139.700003,
    description:
      "『CONVERSATION FANCY』のMV撮影地。VIPルームを使い、カラフルでポップなパーティーシーンが撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "CONVERSATION FANCY",
  },
  {
    group: "神宿",
    name: "タワーレコード渋谷店",
    prefecture: "東京都",
    address: "東京都渋谷区神南1丁目22-14",
    latitude: 35.661902,
    longitude: 139.701681,
    description:
      "『星空帰り道』のMVに登場する場所。夜の渋谷・原宿を歩く物語のラストで、店舗の大型モニターが使用された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "星空帰り道",
  },
];

export const KAMIYADO_MOCK_SPOTS = sacredPlacesToMockSpots(
  kamiyadoMvLocations,
  "kamiyado",
);
