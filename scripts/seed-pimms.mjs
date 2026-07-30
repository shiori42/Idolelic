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
    legacy_id: "pimms-1",
    name: "北野町広場",
    work_title: "SUNDAY MORNING",
    group_name: "Pimm's",
    category: "MV",
    prefecture: "兵庫県",
    region: "関西",
    address: "兵庫県神戸市中央区北野町3丁目10",
    description:
      "風見鶏の館前にある広場。『SUNDAY MORNING』のMV撮影地として確認されている。",
    latitude: 34.701217,
    longitude: 135.189676,
    source: "official",
  },
  {
    legacy_id: "pimms-2",
    name: "トーマス坂",
    work_title: "SUNDAY MORNING",
    group_name: "Pimm's",
    category: "MV",
    prefecture: "兵庫県",
    region: "関西",
    address: "兵庫県神戸市中央区北野町3丁目",
    description:
      "北野異人館街にある坂道。『SUNDAY MORNING』のMVでメンバーが歩く場面に登場する。",
    latitude: 34.7008,
    longitude: 135.1902,
    source: "official",
  },
  {
    legacy_id: "pimms-3",
    name: "風見鶏本舗 北野本店前",
    work_title: "SUNDAY MORNING",
    group_name: "Pimm's",
    category: "MV",
    prefecture: "兵庫県",
    region: "関西",
    address: "兵庫県神戸市中央区北野町3丁目5-5",
    description:
      "北野異人館街の洋菓子店前。『SUNDAY MORNING』のMV撮影地点。",
    latitude: 34.7003,
    longitude: 135.1901,
    source: "official",
  },
  {
    legacy_id: "pimms-4",
    name: "北野通り",
    work_title: "SUNDAY MORNING",
    group_name: "Pimm's",
    category: "MV",
    prefecture: "兵庫県",
    region: "関西",
    address: "兵庫県神戸市中央区北野町2丁目周辺",
    description:
      "神戸北野異人館街を東西に通る道路。『SUNDAY MORNING』の街頭シーンが撮影された。",
    latitude: 34.6989,
    longitude: 135.1909,
    source: "official",
  },
  {
    legacy_id: "pimms-5",
    name: "甲子園浜海浜公園・ふるさと海岸",
    work_title: "BOY MEETS GIRL",
    group_name: "Pimm's",
    category: "MV",
    prefecture: "兵庫県",
    region: "関西",
    address: "兵庫県西宮市甲子園浜1丁目",
    description:
      "甲子園浜海浜公園内の砂浜。『BOY MEETS GIRL』のMV撮影地。",
    latitude: 34.710525,
    longitude: 135.349252,
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
console.log(`Pimm's 聖地を ${rows.length} 件投入しました。`);
