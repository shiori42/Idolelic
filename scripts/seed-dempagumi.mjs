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
    legacy_id: "dempagumi-1",
    name: "L'atelier onze",
    work_title: "好感Daybook♡",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県大網白里市季美の森南2丁目28-24",
    description:
      "南仏プロヴァンス風のハウススタジオ。『好感Daybook♡』のMV撮影地。",
    latitude: 35.5543,
    longitude: 140.2987,
    source: "official",
  },
  {
    legacy_id: "dempagumi-2",
    name: "旧海岸第十三スタジオ",
    work_title: "我ら令和のかえるちゃん！",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都大田区南六郷1丁目20-10 1F",
    description:
      "大田区南六郷にある大型撮影スタジオ。『我ら令和のかえるちゃん！』のMV撮影地。",
    latitude: 35.5506,
    longitude: 139.7208,
    source: "official",
  },
  {
    legacy_id: "dempagumi-3",
    name: "CONTACT STUDIO",
    work_title: "サクラあっぱれーしょん",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県山武郡九十九里町作田5633-312",
    description:
      "九十九里浜近くにある自然光撮影スタジオ。『サクラあっぱれーしょん』のMV撮影地。",
    latitude: 35.549802,
    longitude: 140.46522,
    source: "official",
  },
  {
    legacy_id: "dempagumi-4",
    name: "山下公園・沈床花壇",
    work_title: "ファンシーほっぺ♡ウ・フ・フ",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横浜市中区山下町279",
    description:
      "山下公園内の沈床花壇。『ファンシーほっぺ♡ウ・フ・フ』の屋外シーン撮影地。",
    latitude: 35.445702,
    longitude: 139.649897,
    source: "official",
  },
  {
    legacy_id: "dempagumi-5",
    name: "三浦海岸",
    work_title: "アイノカタチ",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県三浦市南下浦町上宮田",
    description:
      "『アイノカタチ』のMVが全編撮影された海岸。公式発表および音楽メディアで撮影地が確認されている。",
    latitude: 35.184212,
    longitude: 139.654361,
    source: "official",
  },
  {
    legacy_id: "dempagumi-6",
    name: "STUDIO HONJO SLUM",
    work_title: "形而上学的、魔法",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県児玉郡美里町沼上85-2",
    description:
      "瓦工場跡を利用した大型廃工場スタジオ。施設紹介で『形而上学的、魔法』のMV撮影実績が明記されている。",
    latitude: 36.1867,
    longitude: 139.1815,
    source: "official",
  },
  {
    legacy_id: "dempagumi-7",
    name: "オノデン本館",
    work_title: "アキハバライフ♪",
    group_name: "でんぱ組.inc",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都千代田区外神田1丁目2-7",
    description:
      "秋葉原の家電量販店。『アキハバライフ♪』のMV撮影地として確認されている。",
    latitude: 35.698306,
    longitude: 139.770972,
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
console.log(`でんぱ組.inc 聖地を ${rows.length} 件投入しました。`);
