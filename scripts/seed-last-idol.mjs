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
    legacy_id: "lastidol-1",
    name: "旧上野台中学校",
    work_title: "大人サバイバー",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県比企郡小川町東小川2丁目22-1",
    description:
      "『大人サバイバー』のMVが撮影された旧中学校。校舎や体育館を使い、大人数によるパフォーマンスが撮影された。\n年代: 2010年代",
    latitude: 36.0546,
    longitude: 139.2872,
    source: "official",
  },
  {
    legacy_id: "lastidol-2",
    name: "東京経営短期大学",
    work_title: "愛を知る",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県市川市二俣625-1",
    description:
      "『愛を知る』のMV撮影地。校舎や屋外スペースを舞台に、メンバーが走りながら思いをつないでいく映像が撮影された。\n年代: 2020年代",
    latitude: 35.699673,
    longitude: 139.957477,
    source: "official",
  },
  {
    legacy_id: "lastidol-3",
    name: "鋸南町元名採石場跡地",
    work_title: "何人も",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県安房郡鋸南町元名",
    description:
      "『何人も』のMV撮影地。切り立った岩壁に囲まれた採石場跡で、殺陣を取り入れた激しいパフォーマンスが撮影された。\n年代: 2020年代",
    latitude: 35.1457,
    longitude: 139.8398,
    source: "official",
  },
  {
    legacy_id: "lastidol-4",
    name: "埼玉ロケーション・イベントスペースR17",
    work_title: "君は何キャラット？",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県行田市下忍438",
    description:
      "『君は何キャラット？』のMV撮影地。国道17号沿いにある廃工場風の撮影施設で、ボリウッドダンスが披露された。\n年代: 2020年代",
    latitude: 36.1045,
    longitude: 139.4686,
    source: "official",
  },
  {
    legacy_id: "lastidol-5",
    name: "錦ケ丘ヒルサイドモール",
    work_title: "Break a leg!",
    group_name: "ラストアイドル",
    category: "MV",
    prefecture: "宮城県",
    region: "東北",
    address: "宮城県仙台市青葉区錦ケ丘1丁目3-1",
    description:
      "『Break a leg!』のMVで使用された全国各地の撮影場所の一つ。メンバーが大切な人への感謝を込めてパフォーマンスした。\n年代: 2020年代",
    latitude: 38.2568,
    longitude: 140.7615,
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
console.log(`ラストアイドル 聖地を ${rows.length} 件投入しました。`);
