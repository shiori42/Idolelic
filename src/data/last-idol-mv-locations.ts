import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const lastIdolMvLocations: SacredPlace[] = [
  {
    group: "ラストアイドル",
    name: "旧上野台中学校",
    prefecture: "埼玉県",
    address: "埼玉県比企郡小川町東小川2丁目22-1",
    latitude: 36.0546,
    longitude: 139.2872,
    description:
      "『大人サバイバー』のMVが撮影された旧中学校。校舎や体育館を使い、大人数によるパフォーマンスが撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "大人サバイバー",
  },
  {
    group: "ラストアイドル",
    name: "東京経営短期大学",
    prefecture: "千葉県",
    address: "千葉県市川市二俣625-1",
    latitude: 35.699673,
    longitude: 139.957477,
    description:
      "『愛を知る』のMV撮影地。校舎や屋外スペースを舞台に、メンバーが走りながら思いをつないでいく映像が撮影された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "愛を知る",
  },
  {
    group: "ラストアイドル",
    name: "鋸南町元名採石場跡地",
    prefecture: "千葉県",
    address: "千葉県安房郡鋸南町元名",
    latitude: 35.1457,
    longitude: 139.8398,
    description:
      "『何人も』のMV撮影地。切り立った岩壁に囲まれた採石場跡で、殺陣を取り入れた激しいパフォーマンスが撮影された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "何人も",
  },
  {
    group: "ラストアイドル",
    name: "埼玉ロケーション・イベントスペースR17",
    prefecture: "埼玉県",
    address: "埼玉県行田市下忍438",
    latitude: 36.1045,
    longitude: 139.4686,
    description:
      "『君は何キャラット？』のMV撮影地。国道17号沿いにある廃工場風の撮影施設で、ボリウッドダンスが披露された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "君は何キャラット？",
  },
  {
    group: "ラストアイドル",
    name: "錦ケ丘ヒルサイドモール",
    prefecture: "宮城県",
    address: "宮城県仙台市青葉区錦ケ丘1丁目3-1",
    latitude: 38.2568,
    longitude: 140.7615,
    description:
      "『Break a leg!』のMVで使用された全国各地の撮影場所の一つ。メンバーが大切な人への感謝を込めてパフォーマンスした。",
    era: "2020年代",
    category: "MV",
    region: "東北",
    workTitle: "Break a leg!",
  },
];

export const LAST_IDOL_MOCK_SPOTS = sacredPlacesToMockSpots(
  lastIdolMvLocations,
  "lastidol",
);
