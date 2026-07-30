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
    legacy_id: "keyakizaka-1",
    name: "渋谷ストリーム",
    work_title: "サイレントマジョリティー",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区渋谷3丁目21-3",
    description:
      "『サイレントマジョリティー』のダンスシーンが撮影された東急東横線旧渋谷駅跡地。現在は渋谷ストリームとして整備されている。\n年代: 2010年代",
    latitude: 35.657296,
    longitude: 139.702883,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-2",
    name: "エム・ベイポイント幕張前広場",
    work_title: "二人セゾン",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県千葉市美浜区中瀬1丁目6",
    description:
      "『二人セゾン』のメインダンスや階段のシーンが撮影された広場。撮影当時はNTT幕張ビルと呼ばれていた。\n年代: 2010年代",
    latitude: 35.65334,
    longitude: 140.04094,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-3",
    name: "山下埠頭",
    work_title: "不協和音",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横浜市中区山下町279",
    description:
      "『不協和音』の荒々しく緊張感のあるダンスシーンが撮影された横浜港の埠頭。\n年代: 2010年代",
    latitude: 35.44635,
    longitude: 139.65955,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-4",
    name: "旧東洋バルヴ諏訪工場",
    work_title: "ガラスを割れ！",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "長野県",
    region: "中部",
    address: "長野県諏訪市湖岸通り5丁目11",
    description:
      "『ガラスを割れ！』の迫力あるダンスシーンが撮影された巨大な旧工場。建屋は老朽化により現在利用できない。\n年代: 2010年代",
    latitude: 36.04475,
    longitude: 138.1126,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-5",
    name: "かずさアカデミアホール",
    work_title: "アンビバレント",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県木更津市かずさ鎌足2丁目3-9",
    description:
      "『アンビバレント』のMVが撮影された施設。特徴的な大階段と幾何学的な空間が映像に使用されている。\n年代: 2010年代",
    latitude: 35.333318,
    longitude: 139.990339,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-6",
    name: "上平グリーンヒルウインドファーム",
    work_title: "世界には愛しかない",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "北海道",
    region: "北海道",
    address: "北海道苫前郡苫前町上平",
    description:
      "『世界には愛しかない』の草原でのダンスシーンが撮影された風力発電施設。広大な牧場に多数の風車が並んでいる。\n年代: 2010年代",
    latitude: 44.24667,
    longitude: 141.66194,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-7",
    name: "伊納大橋",
    work_title: "世界には愛しかない",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "北海道",
    region: "北海道",
    address: "北海道旭川市江丹別町春日",
    description:
      "『世界には愛しかない』でメンバーが橋を走るシーンの撮影地。石狩川に架かる全長約328メートルの橋。\n年代: 2010年代",
    latitude: 43.765544,
    longitude: 142.276095,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-8",
    name: "さくら遊園",
    work_title: "W-KEYAKIZAKAの詩",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "群馬県",
    region: "関東",
    address: "群馬県桐生市桜木町1407-16",
    description:
      "『W-KEYAKIZAKAの詩』のMV撮影地。渡良瀬川河川敷の芝生や土手、印象的な階段が撮影に使用された。\n年代: 2010年代",
    latitude: 36.3978,
    longitude: 139.3219,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-9",
    name: "小湊鐵道 上総山田駅",
    work_title: "ゼンマイ仕掛けの夢",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県市原市磯ケ谷2079-3",
    description:
      "ゆいちゃんずの『ゼンマイ仕掛けの夢』のMV撮影地。ホームや駅舎、列車を待つ場面などに登場する。\n年代: 2010年代",
    latitude: 35.454223,
    longitude: 140.126169,
    source: "official",
  },
  {
    legacy_id: "keyakizaka-10",
    name: "江川海岸",
    work_title: "ゼンマイ仕掛けの夢",
    group_name: "欅坂46",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県木更津市江川576-6",
    description:
      "ゆいちゃんずの『ゼンマイ仕掛けの夢』のMV撮影地。海岸や干潟、当時存在した海中電柱を背景に撮影された。\n年代: 2010年代",
    latitude: 35.40326,
    longitude: 139.90203,
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
console.log(`欅坂46 聖地を ${rows.length} 件投入しました。`);
