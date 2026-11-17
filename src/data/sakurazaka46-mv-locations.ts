import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const sakurazaka46MvLocations: SacredPlace[] = [
  {
    group: "櫻坂46",
    name: "渋谷PARCO",
    prefecture: "東京都",
    address: "東京都渋谷区宇田川町15-1",
    latitude: 35.66185,
    longitude: 139.69855,
    description:
      "平手友梨奈さんソロ曲『渋谷からPARCOが消えた日』の撮影地。渋谷PARCO周辺が舞台。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "渋谷からPARCOが消えた日",
  },
  {
    group: "櫻坂46",
    name: "スペイン坂",
    prefecture: "東京都",
    address: "東京都渋谷区宇田川町13付近",
    latitude: 35.66055,
    longitude: 139.6989,
    description:
      "『偶然の答え』のMV撮影地。歌詞にも登場する渋谷の坂道。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "偶然の答え",
  },
  {
    group: "櫻坂46",
    name: "宮下公園 芝生ひろば",
    prefecture: "東京都",
    address: "東京都渋谷区神宮前6丁目20-10",
    latitude: 35.6601,
    longitude: 139.7016,
    description:
      "『Buddies』のMV撮影地。ミヤシタパーク内の芝生エリア。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "Buddies",
  },
  {
    group: "櫻坂46",
    name: "渋谷スクランブル交差点",
    prefecture: "東京都",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    latitude: 35.6595,
    longitude: 139.7005,
    description:
      "渋谷の象徴的な交差点。PARCO・スペイン坂・宮下公園を結ぶ巡礼のハブになる。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "偶然の答え",
  },
];

export const SAKURAZAKA46_MOCK_SPOTS = sacredPlacesToMockSpots(
  sakurazaka46MvLocations,
  "sakurazaka",
);
