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
    legacy_id: "hinatazaka-1",
    name: "竹下通り",
    work_title: "ソンナコトナイヨ",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神宮前1丁目",
    description:
      "『ソンナコトナイヨ』の街歩きシーンなどで登場する原宿・竹下通り。\n年代: 2020年代",
    latitude: 35.67015,
    longitude: 139.70285,
    source: "official",
  },
  {
    legacy_id: "hinatazaka-2",
    name: "キャットストリート",
    work_title: "ソンナコトナイヨ",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神宮前4〜5丁目付近",
    description:
      "『ソンナコトナイヨ』のロケ地のひとつ。原宿から渋谷へ続く裏通り。\n年代: 2020年代",
    latitude: 35.6654,
    longitude: 139.7054,
    source: "official",
  },
  {
    legacy_id: "hinatazaka-3",
    name: "原宿駅前・神宮橋交差点",
    work_title: "ソンナコトナイヨ",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神宮前1丁目",
    description:
      "『ソンナコトナイヨ』で原宿駅前・神宮橋まわりが撮影に使われた。\n年代: 2020年代",
    latitude: 35.67005,
    longitude: 139.70255,
    source: "official",
  },
  {
    legacy_id: "hinatazaka-4",
    name: "代官山 T-SITE",
    work_title: "ソンナコトナイヨ",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区猿楽町17-5",
    description:
      "『ソンナコトナイヨ』のロケ地。代官山のブック＆カフェ複合施設周辺。\n年代: 2020年代",
    latitude: 35.64955,
    longitude: 139.70345,
    source: "official",
  },
  {
    legacy_id: "hinatazaka-5",
    name: "渋谷スクランブル交差点",
    work_title: "ソンナコトナイヨ",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    description:
      "『ソンナコトナイヨ』にも登場する渋谷の交差点。原宿・代官山コースの終着点にもしやすい。\n年代: 2020年代",
    latitude: 35.6595,
    longitude: 139.7005,
    source: "official",
  },
  {
    legacy_id: "hinatazaka-6",
    name: "新宿コズミック通り",
    work_title: "ときめき草",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都新宿区歌舞伎町1丁目付近",
    description:
      "『ときめき草』でメンバーが歩くシーンの撮影地。\n年代: 2010年代",
    latitude: 35.6948,
    longitude: 139.7015,
    source: "official",
  },
  {
    legacy_id: "hinatazaka-7",
    name: "Ginza Sony Park",
    work_title: "ときめき草",
    group_name: "日向坂46",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都中央区銀座5丁目3-1",
    description:
      "『ときめき草』で加藤史帆さんらが踊るシーンの撮影地（リニューアルあり）。\n年代: 2010年代",
    latitude: 35.6712,
    longitude: 139.7635,
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
console.log(`日向坂46 聖地を ${rows.length} 件投入しました。`);
