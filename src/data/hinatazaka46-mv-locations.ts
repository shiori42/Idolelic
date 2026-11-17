import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const hinatazaka46MvLocations: SacredPlace[] = [
  {
    group: "日向坂46",
    name: "竹下通り",
    prefecture: "東京都",
    address: "東京都渋谷区神宮前1丁目",
    latitude: 35.67015,
    longitude: 139.70285,
    description:
      "『ソンナコトナイヨ』の街歩きシーンなどで登場する原宿・竹下通り。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "ソンナコトナイヨ",
  },
  {
    group: "日向坂46",
    name: "キャットストリート",
    prefecture: "東京都",
    address: "東京都渋谷区神宮前4〜5丁目付近",
    latitude: 35.6654,
    longitude: 139.7054,
    description:
      "『ソンナコトナイヨ』のロケ地のひとつ。原宿から渋谷へ続く裏通り。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "ソンナコトナイヨ",
  },
  {
    group: "日向坂46",
    name: "原宿駅前・神宮橋交差点",
    prefecture: "東京都",
    address: "東京都渋谷区神宮前1丁目",
    latitude: 35.67005,
    longitude: 139.70255,
    description:
      "『ソンナコトナイヨ』で原宿駅前・神宮橋まわりが撮影に使われた。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "ソンナコトナイヨ",
  },
  {
    group: "日向坂46",
    name: "代官山 T-SITE",
    prefecture: "東京都",
    address: "東京都渋谷区猿楽町17-5",
    latitude: 35.64955,
    longitude: 139.70345,
    description:
      "『ソンナコトナイヨ』のロケ地。代官山のブック＆カフェ複合施設周辺。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "ソンナコトナイヨ",
  },
  {
    group: "日向坂46",
    name: "渋谷スクランブル交差点",
    prefecture: "東京都",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    latitude: 35.6595,
    longitude: 139.7005,
    description:
      "『ソンナコトナイヨ』にも登場する渋谷の交差点。原宿・代官山コースの終着点にもしやすい。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "ソンナコトナイヨ",
  },
  {
    group: "日向坂46",
    name: "新宿コズミック通り",
    prefecture: "東京都",
    address: "東京都新宿区歌舞伎町1丁目付近",
    latitude: 35.6948,
    longitude: 139.7015,
    description:
      "『ときめき草』でメンバーが歩くシーンの撮影地。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "ときめき草",
  },
  {
    group: "日向坂46",
    name: "Ginza Sony Park",
    prefecture: "東京都",
    address: "東京都中央区銀座5丁目3-1",
    latitude: 35.6712,
    longitude: 139.7635,
    description:
      "『ときめき草』で加藤史帆さんらが踊るシーンの撮影地（リニューアルあり）。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "ときめき草",
  },
];

export const HINATAZAKA46_MOCK_SPOTS = sacredPlacesToMockSpots(
  hinatazaka46MvLocations,
  "hinatazaka",
);
