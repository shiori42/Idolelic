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
    legacy_id: "shirokyan-1",
    name: "成田山新勝寺",
    work_title: "闘う門には幸来たる",
    group_name: "真っ白なキャンバス",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県成田市成田1",
    description:
      "『闘う門には幸来たる』のMV撮影地。境内を舞台に、和風の映像演出と力強いダンスパフォーマンスが撮影された。\n年代: 2010年代",
    latitude: 35.785091,
    longitude: 140.318101,
    source: "official",
  },
  {
    legacy_id: "shirokyan-2",
    name: "STUDIO EASE 目黒",
    work_title: "光になって",
    group_name: "真っ白なキャンバス",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都品川区西五反田3丁目1-2",
    description:
      "『光になって』のMV撮影地。ヨーロッパの街並みを再現したスタジオで、白を基調とした明るい映像が撮影された。\n年代: 2020年代",
    latitude: 35.62997,
    longitude: 139.71746,
    source: "official",
  },
  {
    legacy_id: "shirokyan-3",
    name: "東京多摩フットボールセンター・南豊ヶ丘フィールド",
    work_title: "Bye My Summer",
    group_name: "真っ白なキャンバス",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都多摩市豊ヶ丘6丁目4",
    description:
      "『Bye My Summer』のMV撮影地。旧南豊ヶ丘小学校を活用した施設で、グラウンドや校舎、屋上へ続く階段などが使用された。\n年代: 2020年代",
    latitude: 35.61275,
    longitude: 139.42866,
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
console.log(`真っ白なキャンバス 聖地を ${rows.length} 件投入しました。`);
