import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const nijimasuMvLocations: SacredPlace[] = [
  {
    group: "26時のマスカレイド",
    name: "Studio Lajolla",
    prefecture: "千葉県",
    address: "千葉県長生郡長生村驚245-3",
    latitude: 35.413536,
    longitude: 140.379856,
    description:
      "『ハートサングラス』のMV撮影地。アメリカンな建物やクラシックカーを備えたハウススタジオで、海岸のシーンも周辺で撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "ハートサングラス",
  },
  {
    group: "26時のマスカレイド",
    name: "河口湖音楽と森の美術館",
    prefecture: "山梨県",
    address: "山梨県南都留郡富士河口湖町河口3077-20",
    latitude: 35.522414,
    longitude: 138.768648,
    description:
      "『スノウメモリー』のMV撮影地。ヨーロッパ風の建物や庭園が、幻想的な冬の世界観に使用された。",
    era: "2010年代",
    category: "MV",
    region: "中部",
    workTitle: "スノウメモリー",
  },
  {
    group: "26時のマスカレイド",
    name: "館山リゾートホテル",
    prefecture: "千葉県",
    address: "千葉県館山市小沼352",
    latitude: 34.953924,
    longitude: 139.79164,
    description:
      "『ちゅるサマ！』のMV撮影地。屋外プールを中心に、南国リゾートを思わせる夏らしい映像が撮影された。",
    era: "2010年代",
    category: "MV",
    region: "関東",
    workTitle: "ちゅるサマ！",
  },
  {
    group: "26時のマスカレイド",
    name: "マザー牧場",
    prefecture: "千葉県",
    address: "千葉県富津市田倉940-3",
    latitude: 35.246492,
    longitude: 139.938663,
    description:
      "『君は青のままで』のMV撮影地。広大な草原や観覧車を背景に、開放感のあるパフォーマンスが撮影された。",
    era: "2020年代",
    category: "MV",
    region: "関東",
    workTitle: "君は青のままで",
  },
  {
    group: "26時のマスカレイド",
    name: "SHIGENO河口湖ハウス",
    prefecture: "山梨県",
    address: "山梨県南都留郡富士河口湖町長浜2328",
    latitude: 35.5035,
    longitude: 138.7278,
    description:
      "『ダンデライオンに恋を』のMV撮影地。河口湖近くの洋館スタジオで、室内や庭園を使った物語調の映像が撮影された。",
    era: "2020年代",
    category: "MV",
    region: "中部",
    workTitle: "ダンデライオンに恋を",
  },
];

export const additionalNijimasuMvLocations: SacredPlace[] = [
  {
    group: "26時のマスカレイド",
    name: "昭島スタジオ",
    prefecture: "東京都",
    address: "東京都昭島市大神町3丁目11-15",
    latitude: 35.699672,
    longitude: 139.360383,
    description:
      "倉庫型のレンタルスタジオ。『ハナイチモンメ』のPV撮影に使用された。",
    category: "MV",
    region: "関東",
    workTitle: "ハナイチモンメ",
  },
  {
    group: "26時のマスカレイド",
    name: "Le CAVE STUDIO",
    prefecture: "東京都",
    address: "東京都渋谷区南平台町17-6 F93 Nanpeidai B1F",
    latitude: 35.65348,
    longitude: 139.69514,
    description:
      "アンティーク調の地下撮影スタジオ。『シルクハットパレード』のPVに登場する。",
    category: "MV",
    region: "関東",
    workTitle: "シルクハットパレード",
  },
  {
    group: "26時のマスカレイド",
    name: "クリフサイド",
    prefecture: "神奈川県",
    address: "神奈川県横浜市中区元町2丁目114",
    latitude: 35.438579,
    longitude: 139.649275,
    description:
      "横浜・元町にある歴史的なダンスホール。『シルクハットパレード』のPV撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "シルクハットパレード",
  },
  {
    group: "26時のマスカレイド",
    name: "ルーデンス立川ウエディングガーデン",
    prefecture: "東京都",
    address: "東京都立川市泉町935-1",
    latitude: 35.712539,
    longitude: 139.416108,
    description:
      "洋館とガーデンを備えた結婚式場。『メロサマ』のPV撮影に使用された。",
    category: "MV",
    region: "関東",
    workTitle: "メロサマ",
  },
  {
    group: "26時のマスカレイド",
    name: "リビエラ逗子マリーナ",
    prefecture: "神奈川県",
    address: "神奈川県逗子市小坪5丁目23-9",
    latitude: 35.295719,
    longitude: 139.553007,
    description:
      "ヤシ並木やヨットハーバーが広がる海辺のリゾート。『チャプチャパ』のPV撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "チャプチャパ",
  },
];

export const allNijimasuMvLocations: SacredPlace[] = [
  ...nijimasuMvLocations,
  ...additionalNijimasuMvLocations,
];

export const NIJIMASU_MOCK_SPOTS = sacredPlacesToMockSpots(
  allNijimasuMvLocations,
  "nijimasu",
);
