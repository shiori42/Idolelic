import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const kobushiFactoryMvLocations: SacredPlace[] = [
  {
    group: "こぶしファクトリー",
    name: "白鵬女子高等学校",
    prefecture: "神奈川県",
    address: "神奈川県横浜市鶴見区北寺尾4丁目10-13",
    latitude: 35.516113,
    longitude: 139.658588,
    description:
      "校舎や体育館などが『ドスコイ！ケンキョにダイタン』のMV撮影に使用された。",
    category: "MV",
    region: "関東",
    workTitle: "ドスコイ！ケンキョにダイタン",
  },
  {
    group: "こぶしファクトリー",
    name: "m BAY POINT幕張（旧・NTT幕張ビル）",
    prefecture: "千葉県",
    address: "千葉県千葉市美浜区中瀬1丁目6",
    latitude: 35.652829,
    longitude: 140.039538,
    description:
      "高層オフィスビルの外周や公開空地が『押忍！こぶし魂』のMV撮影地として使用された。",
    category: "MV",
    region: "関東",
    workTitle: "押忍！こぶし魂",
  },
  {
    group: "こぶしファクトリー",
    name: "上谷総合公園野球場（フラワースタジアム）",
    prefecture: "埼玉県",
    address: "埼玉県鴻巣市上谷707",
    latitude: 36.059485,
    longitude: 139.550363,
    description:
      "天然芝の野球場。『バッチ来い青春！』の野球シーンが撮影された。",
    category: "MV",
    region: "関東",
    workTitle: "バッチ来い青春！",
  },
  {
    group: "こぶしファクトリー",
    name: "ニーズ八王子 by T&G WEDDING（旧・ヒルサイドクラブ迎賓館 八王子）",
    prefecture: "東京都",
    address: "東京都八王子市みなみ野1丁目7-8",
    latitude: 35.632705,
    longitude: 139.326394,
    description:
      "披露宴会場、庭園、エントランスが『サンバ！こぶしジャネイロ』のMV撮影に使用された。",
    category: "MV",
    region: "関東",
    workTitle: "サンバ！こぶしジャネイロ",
  },
  {
    group: "こぶしファクトリー",
    name: "そうか公園・イベント広場",
    prefecture: "埼玉県",
    address: "埼玉県草加市柿木町272-1",
    latitude: 35.861984,
    longitude: 139.826535,
    description:
      "石組みの円形ステージがあるイベント広場。『青春の花』で5人が集合する場面の撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "青春の花",
  },
];

export const additionalKobushiFactoryMvLocations: SacredPlace[] = [
  {
    group: "こぶしファクトリー",
    name: "たちかわ創造舎（旧多摩川小学校）",
    prefecture: "東京都",
    address: "東京都立川市富士見町6-46-1",
    latitude: 35.691589,
    longitude: 139.38989,
    description:
      "『これからだ！』のMV撮影地。旧小学校を活用した文化創造施設で、屋上などが撮影に使われた。",
    category: "MV",
    region: "関東",
    workTitle: "これからだ！",
  },
  {
    group: "こぶしファクトリー",
    name: "プラネアール 青梅スタジオ",
    prefecture: "東京都",
    address: "東京都青梅市成木8-333",
    latitude: 35.818754,
    longitude: 139.239064,
    description:
      "『きっと私は』のMV撮影地。築年数の長い古民家を利用した撮影スタジオ。",
    category: "MV",
    region: "関東",
    workTitle: "きっと私は",
  },
];

export const allKobushiFactoryMvLocations: SacredPlace[] = [
  ...kobushiFactoryMvLocations,
  ...additionalKobushiFactoryMvLocations,
];

export const KOBUSHI_FACTORY_MOCK_SPOTS = sacredPlacesToMockSpots(
  allKobushiFactoryMvLocations,
  "kobushi",
);
