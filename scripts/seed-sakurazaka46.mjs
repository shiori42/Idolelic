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
    legacy_id: "sakurazaka-1",
    name: "渋谷PARCO",
    work_title: "渋谷からPARCOが消えた日",
    group_name: "櫻坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町15-1",
    description:
      "平手友梨奈さんソロ曲『渋谷からPARCOが消えた日』の撮影地。渋谷PARCO周辺が舞台。\n年代: 2010年代",
    latitude: 35.66185,
    longitude: 139.69855,
    source: "official",
  },
  {
    legacy_id: "sakurazaka-2",
    name: "スペイン坂",
    work_title: "偶然の答え",
    group_name: "櫻坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町13付近",
    description:
      "『偶然の答え』のMV撮影地。歌詞にも登場する渋谷の坂道。\n年代: 2020年代",
    latitude: 35.66055,
    longitude: 139.6989,
    source: "official",
  },
  {
    legacy_id: "sakurazaka-3",
    name: "宮下公園 芝生ひろば",
    work_title: "Buddies",
    group_name: "櫻坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神宮前6丁目20-10",
    description:
      "『Buddies』のMV撮影地。ミヤシタパーク内の芝生エリア。\n年代: 2020年代",
    latitude: 35.6601,
    longitude: 139.7016,
    source: "official",
  },
  {
    legacy_id: "sakurazaka-4",
    name: "渋谷スクランブル交差点",
    work_title: "偶然の答え",
    group_name: "櫻坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    description:
      "渋谷の象徴的な交差点。PARCO・スペイン坂・宮下公園を結ぶ巡礼のハブになる。\n年代: 2020年代",
    latitude: 35.6595,
    longitude: 139.7005,
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
console.log(`櫻坂46 聖地を ${rows.length} 件投入しました。`);
