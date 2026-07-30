import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const ENV_PATH = resolve(ROOT, ".env.local");

function loadEnvFile(path) {
  if (!existsSync(path)) return {};

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const separator = line.indexOf("=");
        if (separator === -1) return [line, ""];
        return [line.slice(0, separator), line.slice(separator + 1)];
      }),
  );
}

const env = loadEnvFile(ENV_PATH);
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Supabase が未設定です。.env.local に NEXT_PUBLIC_SUPABASE_URL と SUPABASE_SERVICE_ROLE_KEY を設定してください。",
  );
  process.exit(1);
}

const spots = [
  {
    legacy_id: "nijimasu-1",
    name: "Studio Lajolla",
    work_title: "ハートサングラス",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県長生郡長生村驚245-3",
    description:
      "『ハートサングラス』のMV撮影地。アメリカンな建物やクラシックカーを備えたハウススタジオで、海岸のシーンも周辺で撮影された。\n年代: 2010年代",
    latitude: 35.413536,
    longitude: 140.379856,
    source: "official",
  },
  {
    legacy_id: "nijimasu-2",
    name: "河口湖音楽と森の美術館",
    work_title: "スノウメモリー",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "山梨県",
    region: "中部",
    address: "山梨県南都留郡富士河口湖町河口3077-20",
    description:
      "『スノウメモリー』のMV撮影地。ヨーロッパ風の建物や庭園が、幻想的な冬の世界観に使用された。\n年代: 2010年代",
    latitude: 35.522414,
    longitude: 138.768648,
    source: "official",
  },
  {
    legacy_id: "nijimasu-3",
    name: "館山リゾートホテル",
    work_title: "ちゅるサマ！",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県館山市小沼352",
    description:
      "『ちゅるサマ！』のMV撮影地。屋外プールを中心に、南国リゾートを思わせる夏らしい映像が撮影された。\n年代: 2010年代",
    latitude: 34.953924,
    longitude: 139.79164,
    source: "official",
  },
  {
    legacy_id: "nijimasu-4",
    name: "マザー牧場",
    work_title: "君は青のままで",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県富津市田倉940-3",
    description:
      "『君は青のままで』のMV撮影地。広大な草原や観覧車を背景に、開放感のあるパフォーマンスが撮影された。\n年代: 2020年代",
    latitude: 35.246492,
    longitude: 139.938663,
    source: "official",
  },
  {
    legacy_id: "nijimasu-5",
    name: "SHIGENO河口湖ハウス",
    work_title: "ダンデライオンに恋を",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "山梨県",
    region: "中部",
    address: "山梨県南都留郡富士河口湖町長浜2328",
    description:
      "『ダンデライオンに恋を』のMV撮影地。河口湖近くの洋館スタジオで、室内や庭園を使った物語調の映像が撮影された。\n年代: 2020年代",
    latitude: 35.5035,
    longitude: 138.7278,
    source: "official",
  },
  {
    legacy_id: "nijimasu-6",
    name: "昭島スタジオ",
    work_title: "ハナイチモンメ",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都昭島市大神町3丁目11-15",
    description:
      "倉庫型のレンタルスタジオ。『ハナイチモンメ』のPV撮影に使用された。",
    latitude: 35.699672,
    longitude: 139.360383,
    source: "official",
  },
  {
    legacy_id: "nijimasu-7",
    name: "Le CAVE STUDIO",
    work_title: "シルクハットパレード",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区南平台町17-6 F93 Nanpeidai B1F",
    description:
      "アンティーク調の地下撮影スタジオ。『シルクハットパレード』のPVに登場する。",
    latitude: 35.65348,
    longitude: 139.69514,
    source: "official",
  },
  {
    legacy_id: "nijimasu-8",
    name: "クリフサイド",
    work_title: "シルクハットパレード",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横浜市中区元町2丁目114",
    description:
      "横浜・元町にある歴史的なダンスホール。『シルクハットパレード』のPV撮影地。",
    latitude: 35.438579,
    longitude: 139.649275,
    source: "official",
  },
  {
    legacy_id: "nijimasu-9",
    name: "ルーデンス立川ウエディングガーデン",
    work_title: "メロサマ",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都立川市泉町935-1",
    description:
      "洋館とガーデンを備えた結婚式場。『メロサマ』のPV撮影に使用された。",
    latitude: 35.712539,
    longitude: 139.416108,
    source: "official",
  },
  {
    legacy_id: "nijimasu-10",
    name: "リビエラ逗子マリーナ",
    work_title: "チャプチャパ",
    group_name: "26時のマスカレイド",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県逗子市小坪5丁目23-9",
    description:
      "ヤシ並木やヨットハーバーが広がる海辺のリゾート。『チャプチャパ』のPV撮影地。",
    latitude: 35.295719,
    longitude: 139.553007,
    source: "official",
  },
];

const response = await fetch(
  `${supabaseUrl}/rest/v1/community_spots?on_conflict=legacy_id`,
  {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(spots),
  },
);

if (!response.ok) {
  const detail = await response.text();
  console.error(`投入に失敗しました: ${response.status} ${detail}`);
  process.exit(1);
}

const rows = await response.json();
console.log(`26時のマスカレイド 聖地を ${rows.length} 件投入しました。`);
