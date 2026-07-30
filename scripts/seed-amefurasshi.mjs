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
    legacy_id: "amefurasshi-1",
    name: "ロイヤルチェスター太田",
    work_title: "DROP DROP",
    group_name: "AMEFURASSHI",
    category: "MV",
    prefecture: "群馬県",
    region: "関東",
    address: "群馬県太田市飯塚町2056",
    description:
      "ステンドグラスやクラシカルな内装を持つ結婚式場。施設運営会社が『DROP DROP』のMV撮影地であることを公表している。",
    latitude: 36.284244,
    longitude: 139.375961,
    source: "official",
  },
  {
    legacy_id: "amefurasshi-2",
    name: "DEMODE DINER 福生店",
    work_title: "MICHI",
    group_name: "AMEFURASSHI",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都福生市熊川1121",
    description:
      "国道16号沿いのアメリカンダイナー。『MICHI』のMVでダンスシーンなどが撮影された。",
    latitude: 35.730956,
    longitude: 139.341958,
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
console.log(`AMEFURASSHI 聖地を ${rows.length} 件投入しました。`);
