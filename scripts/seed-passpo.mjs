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
    legacy_id: "passpo-1",
    name: "羽田神社",
    work_title: "Next Flight",
    group_name: "PASSPO☆",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都大田区本羽田3丁目9-12",
    description:
      "『Next Flight』リリース時に「ぱすぽ☆神社」が期間限定設置された羽田神社。空と旅をテーマにしたグループの象徴的な聖地。\n年代: 2010年代",
    latitude: 35.54855,
    longitude: 139.74385,
    source: "official",
  },
  {
    legacy_id: "passpo-2",
    name: "American House COZY",
    work_title: "HONEY DISH",
    group_name: "PASSPO☆",
    category: "MV",
    prefecture: "静岡県",
    region: "中部",
    address: "静岡県下田市吉佐美1903-1",
    description:
      "『HONEY DISH』のPV撮影地。伊豆下田のアメリカンハウスホテル。\n年代: 2010年代",
    latitude: 34.6528,
    longitude: 138.9265,
    source: "official",
  },
  {
    legacy_id: "passpo-3",
    name: "ルーデンス立川ウエディングガーデン",
    work_title: "バチェロレッテは終わらない",
    group_name: "PASSPO☆",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都立川市泉町935-1",
    description:
      "『バチェロレッテは終わらない』のPV撮影地。立川の結婚式場ガーデン。\n年代: 2010年代",
    latitude: 35.712539,
    longitude: 139.416108,
    source: "official",
  },
  {
    legacy_id: "passpo-4",
    name: "HOUSE646",
    work_title: "Mr.Wednesday",
    group_name: "PASSPO☆",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県いすみ市岬町和泉2363-13",
    description:
      "『Mr.Wednesday』のPV撮影地。いすみ市のハウススタジオ。\n年代: 2010年代",
    latitude: 35.2948,
    longitude: 140.3525,
    source: "official",
  },
  {
    legacy_id: "passpo-5",
    name: "中野サンプラザ跡地周辺",
    work_title: "ラストフライト（中野サンプラザ）",
    group_name: "PASSPO☆",
    category: "ライブ",
    prefecture: "東京都",
    region: "関東",
    address: "東京都中野区中野2丁目付近",
    description:
      "2018年9月22日のラストフライト（解散ライブ）開催地。現在は再開発中のため周辺からの巡礼向き。\n年代: 2010年代",
    latitude: 35.70955,
    longitude: 139.66575,
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
console.log(`PASSPO☆ 聖地を ${rows.length} 件投入しました。`);
