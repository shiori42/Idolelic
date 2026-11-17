import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

/** BiSH（2023年解散） */
export const bishMvLocations: SacredPlace[] = [
  {
    group: "BiSH",
    name: "浦安・鉄鋼通り（工業地帯）",
    prefecture: "千葉県",
    address: "千葉県浦安市鉄鋼通り2丁目5付近",
    latitude: 35.6482,
    longitude: 139.9068,
    description:
      "ラストシングル『Bye-Bye Show』の工業地帯シーン撮影地。デビュー曲『BiSH-星が瞬く夜に』と同じ原点のロケ地としても知られる。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "Bye-Bye Show",
  },
  {
    group: "BiSH",
    name: "浦安・千鳥エリア",
    prefecture: "千葉県",
    address: "千葉県浦安市千鳥16付近",
    latitude: 35.6405,
    longitude: 139.9055,
    description:
      "『Bye-Bye Show』の海岸側シーン撮影地。鉄鋼通りから徒歩圏で、原点回帰の聖地巡礼に回りやすい。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "Bye-Bye Show",
  },
  {
    group: "BiSH",
    name: "浦安・鉄鋼通り（星が瞬く夜に）",
    prefecture: "千葉県",
    address: "千葉県浦安市鉄鋼通り2丁目5付近",
    latitude: 35.64835,
    longitude: 139.90695,
    description:
      "『BiSH-星が瞬く夜に』のMV撮影地。のちの『Bye-Bye Show』でも同じエリアが使われた原点。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "BiSH-星が瞬く夜に",
  },
  {
    group: "BiSH",
    name: "道玄坂上交差点周辺",
    prefecture: "東京都",
    address: "東京都渋谷区道玄坂2丁目3-1付近",
    latitude: 35.6588,
    longitude: 139.6989,
    description:
      "『LETTERS』MVの渋谷ロケ起点。交差点上空カットなど、街歩きのスタート地点にしやすい。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "LETTERS",
  },
  {
    group: "BiSH",
    name: "宮益坂歩道橋",
    prefecture: "東京都",
    address: "東京都渋谷区渋谷1丁目付近",
    latitude: 35.65985,
    longitude: 139.70355,
    description:
      "『LETTERS』で歩道橋シーンが撮影されたエリア。スクランブルから徒歩圏。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "LETTERS",
  },
  {
    group: "BiSH",
    name: "宇田川町・公園通り歩道橋付近",
    prefecture: "東京都",
    address: "東京都渋谷区宇田川町付近",
    latitude: 35.6612,
    longitude: 139.6982,
    description:
      "『LETTERS』の歩道橋・屋上周辺ロケのハブ。通行の妨げにならないよう見学は控えめに。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "LETTERS",
  },
  {
    group: "BiSH",
    name: "渋谷スクランブル交差点",
    prefecture: "東京都",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    latitude: 35.6595,
    longitude: 139.7005,
    description:
      "『LETTERS』巡礼の結節点。道玄坂・宮益坂・宇田川町の各スポットをつなぐ。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "LETTERS",
  },
];

export const BISH_MOCK_SPOTS = sacredPlacesToMockSpots(bishMvLocations, "bish");
