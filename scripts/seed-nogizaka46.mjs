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
    legacy_id: "nogizaka-1",
    name: "渋谷PARCO ルーフトップパーク",
    work_title: "僕は僕を好きになる",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町15-1",
    description:
      "『僕は僕を好きになる』の屋上シーン撮影地。渋谷の街並みを一望できる屋上ひろば。\n年代: 2020年代",
    latitude: 35.6619,
    longitude: 139.6986,
    source: "official",
  },
  {
    legacy_id: "nogizaka-2",
    name: "スペイン坂",
    work_title: "僕は僕を好きになる",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町13付近",
    description:
      "『僕は僕を好きになる』でメンバーが合流する坂道。渋谷PARCOへ向かう途中にある。\n年代: 2020年代",
    latitude: 35.66055,
    longitude: 139.6989,
    source: "official",
  },
  {
    legacy_id: "nogizaka-3",
    name: "渋谷PARCO エントランス周辺",
    work_title: "僕は僕を好きになる",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町15-1",
    description:
      "『僕は僕を好きになる』でPARCOへ向かう動線上のポイント。屋上とあわせて回りやすい。\n年代: 2020年代",
    latitude: 35.66155,
    longitude: 139.69835,
    source: "official",
  },
  {
    legacy_id: "nogizaka-4",
    name: "ミヤシタパーク",
    work_title: "Wilderness world",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神宮前6丁目20-10",
    description:
      "『Wilderness world』のロケ地。階段や屋上公園など、渋谷駅から徒歩圏で散策しやすい。\n年代: 2020年代",
    latitude: 35.66005,
    longitude: 139.70155,
    source: "official",
  },
  {
    legacy_id: "nogizaka-5",
    name: "宮下第二歩道橋",
    work_title: "Wilderness world",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神宮前6丁目付近",
    description:
      "『Wilderness world』で賀喜遥香さんのシーンが撮影された歩道橋。ミヤシタパークから徒歩すぐ。\n年代: 2020年代",
    latitude: 35.66035,
    longitude: 139.70235,
    source: "official",
  },
  {
    legacy_id: "nogizaka-6",
    name: "東京メトロ銀座線 渋谷駅ホーム",
    work_title: "ここにはないもの",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区渋谷2丁目21-1",
    description:
      "『ここにはないもの』で齋藤飛鳥さんのソロダンスが撮影されたホーム。通行の妨げにならないよう見学は控えめに。\n年代: 2020年代",
    latitude: 35.6587,
    longitude: 139.7014,
    source: "official",
  },
  {
    legacy_id: "nogizaka-7",
    name: "昭和通り銀座歩道橋（ときめき橋）",
    work_title: "歩道橋",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都中央区銀座7丁目14",
    description:
      "『歩道橋』で遠藤さくらさんが渡る歩道橋。銀座側の起点として巡れる。\n年代: 2020年代",
    latitude: 35.6669,
    longitude: 139.7658,
    source: "official",
  },
  {
    legacy_id: "nogizaka-8",
    name: "晴海大橋",
    work_title: "歩道橋",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都中央区晴海2丁目",
    description:
      "『歩道橋』で久保史緒里さん・井上和さんのシーンが撮影された橋。東京湾を背景にしたカットで知られる。\n年代: 2020年代",
    latitude: 35.6508,
    longitude: 139.7752,
    source: "official",
  },
  {
    legacy_id: "nogizaka-9",
    name: "夢の大橋",
    work_title: "歩道橋",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都江東区有明1丁目（シンボルプロムナード公園）",
    description:
      "『歩道橋』で賀喜遥香さんのシーンが撮影された歩行者専用の橋。お台場エリア。\n年代: 2020年代",
    latitude: 35.6296,
    longitude: 139.7768,
    source: "official",
  },
  {
    legacy_id: "nogizaka-10",
    name: "新宿住友ビル 三角広場",
    work_title: "Actually…",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都新宿区西新宿2丁目6-1",
    description:
      "『Actually…』のMV撮影地。都庁前駅直結の屋内イベント空間。\n年代: 2020年代",
    latitude: 35.6914,
    longitude: 139.6925,
    source: "official",
  },
  {
    legacy_id: "nogizaka-11",
    name: "秋葉原UDX",
    work_title: "I see...",
    group_name: "乃木坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都千代田区外神田4丁目14-1",
    description:
      "『I see...』でメンバーが走るシーンなどの撮影地。秋葉原駅からすぐ。\n年代: 2020年代",
    latitude: 35.7005,
    longitude: 139.7728,
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
console.log(`乃木坂46 聖地を ${rows.length} 件投入しました。`);
