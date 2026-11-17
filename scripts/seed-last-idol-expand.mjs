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
    legacy_id: "lastidol-6",
    name: "秩父ミューズパーク 野外ステージ",
    work_title: "いつの日かどこかで",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県秩父市田村1377",
    description:
      "Someday Somewhere『いつの日かどこかで』の野外ステージ撮影地。\n年代: 2010年代",
    latitude: 35.9902,
    longitude: 139.0745,
    source: "official",
  },
  {
    legacy_id: "lastidol-7",
    name: "旧三田川中学校",
    work_title: "いつの日かどこかで",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県秩父郡小鹿野町飯田323",
    description:
      "Someday Somewhere『いつの日かどこかで』の廃校ロケ地。ミューズパークとあわせて秩父巡礼できる。\n年代: 2010年代",
    latitude: 36.0175,
    longitude: 139.0088,
    source: "official",
  },
  {
    legacy_id: "lastidol-8",
    name: "富津竹岡スタジオ",
    work_title: "Again & Again",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県富津市竹岡380-1",
    description:
      "Someday Somewhere『Again & Again』のPV撮影地。廃校を再利用したスタジオ。\n年代: 2010年代",
    latitude: 35.2035,
    longitude: 139.8245,
    source: "official",
  },
  {
    legacy_id: "lastidol-9",
    name: "渋谷スクランブル交差点",
    work_title: "僕たちは空を見る",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    description:
      "ラスト曲『僕たちは空を見る』でメンバーが街中看板として登場した渋谷エリアの巡礼ハブ。\n年代: 2020年代",
    latitude: 35.6595,
    longitude: 139.7005,
    source: "official",
  },
  {
    legacy_id: "lastidol-10",
    name: "六本木交差点周辺",
    work_title: "僕たちは空を見る",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都港区六本木6丁目付近",
    description:
      "『僕たちは空を見る』で渋谷と並び街中看板シーンの舞台になった六本木。渋谷から続けて巡れる。\n年代: 2020年代",
    latitude: 35.6628,
    longitude: 139.7314,
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
console.log(`ラストアイドル追加聖地を ${rows.length} 件投入しました。`);
