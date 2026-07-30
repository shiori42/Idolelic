import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const koreKoiMvLocations: SacredPlace[] = [
  {
    group: "コレって恋ですか？",
    name: "河口湖音楽と森の美術館",
    prefecture: "山梨県",
    address: "山梨県南都留郡富士河口湖町河口3077-20",
    latitude: 35.522414,
    longitude: 138.768648,
    description:
      "『シンキロウ』のMV撮影地。ヨーロッパ風の建物や庭園、噴水などを生かした幻想的な映像が撮影された。",
    era: "2020年代",
    category: "MV",
    region: "中部",
    workTitle: "シンキロウ",
  },
];

export const KORE_KOI_MOCK_SPOTS = sacredPlacesToMockSpots(
  koreKoiMvLocations,
  "korekoi",
);
