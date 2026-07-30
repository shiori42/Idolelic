import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export type { SacredPlace } from "@/data/sacred-place";
export {
  formatSacredPlaceDescription,
  sacredPlaceToMockSpot,
} from "@/data/sacred-place";

export const keyakizaka46MvLocations: SacredPlace[] = [
  {
    group: "欅坂46",
    name: "渋谷ストリーム",
    prefecture: "東京都",
    address: "東京都渋谷区渋谷3丁目21-3",
    latitude: 35.657296,
    longitude: 139.702883,
    description:
      "『サイレントマジョリティー』のダンスシーンが撮影された東急東横線旧渋谷駅跡地。現在は渋谷ストリームとして整備されている。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "サイレントマジョリティー",
  },
  {
    group: "欅坂46",
    name: "エム・ベイポイント幕張前広場",
    prefecture: "千葉県",
    address: "千葉県千葉市美浜区中瀬1丁目6",
    latitude: 35.65334,
    longitude: 140.04094,
    description:
      "『二人セゾン』のメインダンスや階段のシーンが撮影された広場。撮影当時はNTT幕張ビルと呼ばれていた。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "二人セゾン",
  },
  {
    group: "欅坂46",
    name: "山下埠頭",
    prefecture: "神奈川県",
    address: "神奈川県横浜市中区山下町279",
    latitude: 35.44635,
    longitude: 139.65955,
    description:
      "『不協和音』の荒々しく緊張感のあるダンスシーンが撮影された横浜港の埠頭。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "不協和音",
  },
  {
    group: "欅坂46",
    name: "旧東洋バルヴ諏訪工場",
    prefecture: "長野県",
    address: "長野県諏訪市湖岸通り5丁目11",
    latitude: 36.04475,
    longitude: 138.1126,
    description:
      "『ガラスを割れ！』の迫力あるダンスシーンが撮影された巨大な旧工場。建屋は老朽化により現在利用できない。",
    era: "2010年代",
    category: "MV",
    region: "中部",
    workTitle: "ガラスを割れ！",
  },
  {
    group: "欅坂46",
    name: "かずさアカデミアホール",
    prefecture: "千葉県",
    address: "千葉県木更津市かずさ鎌足2丁目3-9",
    latitude: 35.333318,
    longitude: 139.990339,
    description:
      "『アンビバレント』のMVが撮影された施設。特徴的な大階段と幾何学的な空間が映像に使用されている。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "アンビバレント",
  },
];

export const additionalKeyakizaka46MvLocations: SacredPlace[] = [
  {
    group: "欅坂46",
    name: "上平グリーンヒルウインドファーム",
    prefecture: "北海道",
    address: "北海道苫前郡苫前町上平",
    latitude: 44.24667,
    longitude: 141.66194,
    description:
      "『世界には愛しかない』の草原でのダンスシーンが撮影された風力発電施設。広大な牧場に多数の風車が並んでいる。",
    era: "2010年代",
    category: "MV",
    region: "北海道",
    workTitle: "世界には愛しかない",
  },
  {
    group: "欅坂46",
    name: "伊納大橋",
    prefecture: "北海道",
    address: "北海道旭川市江丹別町春日",
    latitude: 43.765544,
    longitude: 142.276095,
    description:
      "『世界には愛しかない』でメンバーが橋を走るシーンの撮影地。石狩川に架かる全長約328メートルの橋。",
    era: "2010年代",
    category: "MV",
    region: "北海道",
    workTitle: "世界には愛しかない",
  },
  {
    group: "欅坂46",
    name: "さくら遊園",
    prefecture: "群馬県",
    address: "群馬県桐生市桜木町1407-16",
    latitude: 36.3978,
    longitude: 139.3219,
    description:
      "『W-KEYAKIZAKAの詩』のMV撮影地。渡良瀬川河川敷の芝生や土手、印象的な階段が撮影に使用された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "W-KEYAKIZAKAの詩",
  },
  {
    group: "欅坂46",
    name: "小湊鐵道 上総山田駅",
    prefecture: "千葉県",
    address: "千葉県市原市磯ケ谷2079-3",
    latitude: 35.454223,
    longitude: 140.126169,
    description:
      "ゆいちゃんずの『ゼンマイ仕掛けの夢』のMV撮影地。ホームや駅舎、列車を待つ場面などに登場する。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "ゼンマイ仕掛けの夢",
  },
  {
    group: "欅坂46",
    name: "江川海岸",
    prefecture: "千葉県",
    address: "千葉県木更津市江川576-6",
    latitude: 35.40326,
    longitude: 139.90203,
    description:
      "ゆいちゃんずの『ゼンマイ仕掛けの夢』のMV撮影地。海岸や干潟、当時存在した海中電柱を背景に撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "ゼンマイ仕掛けの夢",
  },
];

export const allKeyakizaka46MvLocations: SacredPlace[] = [
  ...keyakizaka46MvLocations,
  ...additionalKeyakizaka46MvLocations,
];

export const KEYAKIZAKA46_MOCK_SPOTS = sacredPlacesToMockSpots(
  allKeyakizaka46MvLocations,
  "keyakizaka",
);
