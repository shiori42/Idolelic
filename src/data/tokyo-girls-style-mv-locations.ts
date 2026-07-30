import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const tokyoGirlsStyleMvLocations: SacredPlace[] = [
  {
    group: "東京女子流",
    name: "横須賀美術館",
    prefecture: "神奈川県",
    address: "神奈川県横須賀市鴨居4-1",
    latitude: 35.259795,
    longitude: 139.738199,
    description:
      "『Limited addiction』のMV撮影地。屋上広場や海に面した美術館周辺で撮影された。",
    category: "MV",
    region: "関東",
    workTitle: "Limited addiction",
  },
  {
    group: "東京女子流",
    name: "山梨県笛吹川フルーツ公園",
    prefecture: "山梨県",
    address: "山梨県山梨市江曽原1488",
    latitude: 35.702032,
    longitude: 138.664418,
    description:
      "『ちいさな奇跡』のMV撮影地。特徴的なドーム施設や園内の風景が登場する。",
    category: "MV",
    region: "中部",
    workTitle: "ちいさな奇跡",
  },
  {
    group: "東京女子流",
    name: "サドヤ シャトー・ド・プロヴァンス",
    prefecture: "山梨県",
    address: "山梨県甲府市北口3-3-24",
    latitude: 35.667509,
    longitude: 138.573929,
    description:
      "『Say long goodbye』のMV撮影地。ワイナリーに併設された結婚式場で撮影された。",
    category: "MV",
    region: "中部",
    workTitle: "Say long goodbye",
  },
  {
    group: "東京女子流",
    name: "SHIGENO河口湖ハウス",
    prefecture: "山梨県",
    address: "山梨県南都留郡富士河口湖町長浜2328",
    latitude: 35.5010095,
    longitude: 138.71735,
    description:
      "『Hello, Goodbye』のMV撮影地。河口湖近くにある洋館型の撮影スタジオで、撮影当時はEGUCHI河口湖ハウスと案内されていた。",
    category: "MV",
    region: "中部",
    workTitle: "Hello, Goodbye",
  },
  {
    group: "東京女子流",
    name: "中城城跡",
    prefecture: "沖縄県",
    address: "沖縄県中頭郡中城村泊1258",
    latitude: 26.284194,
    longitude: 127.801389,
    description:
      "『追憶 -Single Version-』のMVおよびジャケット撮影地。一の郭にある観月台周辺で撮影された。",
    category: "MV",
    region: "九州・沖縄",
    workTitle: "追憶 -Single Version-",
  },
];

export const additionalTokyoGirlsStyleMvLocations: SacredPlace[] = [
  {
    group: "東京女子流",
    name: "みなとみらいグランドセントラルタワー",
    prefecture: "神奈川県",
    address: "神奈川県横浜市西区みなとみらい4-6-2",
    latitude: 35.458559,
    longitude: 139.628633,
    description:
      "『predawn』のMV撮影地。ビル屋上のヘリポートでパフォーマンスシーンが撮影された。",
    category: "MV",
    region: "関東",
    workTitle: "predawn",
  },
  {
    group: "東京女子流",
    name: "YELLOW STUDIO A Studio",
    prefecture: "神奈川県",
    address: "神奈川県横浜市都筑区高山18-25",
    latitude: 35.53368,
    longitude: 139.56107,
    description:
      "『Get The Star』のMV撮影地。大型ホリゾントを備えた撮影スタジオのA Studioが使用された。",
    category: "MV",
    region: "関東",
    workTitle: "Get The Star",
  },
  {
    group: "東京女子流",
    name: "ウエディングファンタジア",
    prefecture: "静岡県",
    address: "静岡県沼津市春日町17-5",
    latitude: 35.085157,
    longitude: 138.859888,
    description:
      "『We Will Win』のMV撮影地。港に面した結婚式場で撮影された。撮影当時の名称はSt. Valentin WEDDING FANTASIA。",
    category: "MV",
    region: "中部",
    workTitle: "We Will Win",
  },
  {
    group: "東京女子流",
    name: "神戸ハーバーランド",
    prefecture: "兵庫県",
    address: "兵庫県神戸市中央区東川崎町1丁目",
    latitude: 34.679565,
    longitude: 135.181664,
    description:
      "『サヨナラ、ありがとう。』のMV撮影地。神戸港沿いのハーバーランド一帯で屋外シーンが撮影された。",
    category: "MV",
    region: "近畿",
    workTitle: "サヨナラ、ありがとう。",
  },
];

export const allTokyoGirlsStyleMvLocations: SacredPlace[] = [
  ...tokyoGirlsStyleMvLocations,
  ...additionalTokyoGirlsStyleMvLocations,
];

export const TOKYO_GIRLS_STYLE_MOCK_SPOTS = sacredPlacesToMockSpots(
  allTokyoGirlsStyleMvLocations,
  "tgs",
);
