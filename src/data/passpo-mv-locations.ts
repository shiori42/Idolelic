import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

/** PASSPO☆（2018年解散） */
export const passpoMvLocations: SacredPlace[] = [
  {
    group: "PASSPO☆",
    name: "羽田神社",
    prefecture: "東京都",
    address: "東京都大田区本羽田3丁目9-12",
    latitude: 35.54855,
    longitude: 139.74385,
    description:
      "『Next Flight』リリース時に「ぱすぽ☆神社」が期間限定設置された羽田神社。空と旅をテーマにしたグループの象徴的な聖地。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "Next Flight",
  },
  {
    group: "PASSPO☆",
    name: "American House COZY",
    prefecture: "静岡県",
    address: "静岡県下田市吉佐美1903-1",
    latitude: 34.6528,
    longitude: 138.9265,
    description:
      "『HONEY DISH』のPV撮影地。伊豆下田のアメリカンハウスホテル。",
    era: "2010年代",
    category: "MV",
    region: "中部",
    workTitle: "HONEY DISH",
  },
  {
    group: "PASSPO☆",
    name: "ルーデンス立川ウエディングガーデン",
    prefecture: "東京都",
    address: "東京都立川市泉町935-1",
    latitude: 35.712539,
    longitude: 139.416108,
    description:
      "『バチェロレッテは終わらない』のPV撮影地。立川の結婚式場ガーデン。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "バチェロレッテは終わらない",
  },
  {
    group: "PASSPO☆",
    name: "HOUSE646",
    prefecture: "千葉県",
    address: "千葉県いすみ市岬町和泉2363-13",
    latitude: 35.2948,
    longitude: 140.3525,
    description:
      "『Mr.Wednesday』のPV撮影地。いすみ市のハウススタジオ。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "Mr.Wednesday",
  },
  {
    group: "PASSPO☆",
    name: "中野サンプラザ跡地周辺",
    prefecture: "東京都",
    address: "東京都中野区中野2丁目付近",
    latitude: 35.70955,
    longitude: 139.66575,
    description:
      "2018年9月22日のラストフライト（解散ライブ）開催地。現在は再開発中のため周辺からの巡礼向き。",
    era: "2010年代",
    category: "ライブ",
    region: "関東",
    workTitle: "ラストフライト（中野サンプラザ）",
  },
];

export const PASSPO_MOCK_SPOTS = sacredPlacesToMockSpots(
  passpoMvLocations,
  "passpo",
);
