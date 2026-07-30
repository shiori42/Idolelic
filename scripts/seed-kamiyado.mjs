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
    legacy_id: "kamiyado-1",
    name: "那須ハイランドパーク",
    work_title: "Caramel Sweet",
    group_name: "神宿",
    category: "MV",
    prefecture: "栃木県",
    region: "関東",
    address: "栃木県那須郡那須町高久乙3375",
    description:
      "『Caramel Sweet』のMV撮影地。園内のアトラクションやカラフルな街並みを使った、明るくポップな映像が撮影された。\n年代: 2020年代",
    latitude: 37.064024,
    longitude: 139.964783,
    source: "official",
  },
  {
    legacy_id: "kamiyado-2",
    name: "ビッグエコー品川港南口駅前店",
    work_title: "HAPPY PARTY NIGHT",
    group_name: "神宿",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都港区港南2丁目6-9",
    description:
      "『HAPPY PARTY NIGHT』のMV撮影地。メンバーがカラオケを楽しむ場面や、店員として働く場面が撮影された。\n年代: 2010年代",
    latitude: 35.62864,
    longitude: 139.742384,
    source: "official",
  },
  {
    legacy_id: "kamiyado-3",
    name: "ビッグエコー品川港南口中央店",
    work_title: "HAPPY PARTY NIGHT",
    group_name: "神宿",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都港区港南2丁目2-11 鳳和ビル1階",
    description:
      "『HAPPY PARTY NIGHT』のMVで使用されたもう一つの店舗。パーティールームなどでメンバーが盛り上がる場面が撮影された。\n年代: 2010年代",
    latitude: 35.628965,
    longitude: 139.742621,
    source: "official",
  },
  {
    legacy_id: "kamiyado-4",
    name: "ビッグエコー渋谷センター街本店",
    work_title: "CONVERSATION FANCY",
    group_name: "神宿",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町21-8 渋谷平和ビル3階",
    description:
      "『CONVERSATION FANCY』のMV撮影地。VIPルームを使い、カラフルでポップなパーティーシーンが撮影された。\n年代: 2010年代",
    latitude: 35.660102,
    longitude: 139.700003,
    source: "official",
  },
  {
    legacy_id: "kamiyado-5",
    name: "タワーレコード渋谷店",
    work_title: "星空帰り道",
    group_name: "神宿",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区神南1丁目22-14",
    description:
      "『星空帰り道』のMVに登場する場所。夜の渋谷・原宿を歩く物語のラストで、店舗の大型モニターが使用された。\n年代: 2010年代",
    latitude: 35.661902,
    longitude: 139.701681,
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
console.log(`神宿 聖地を ${rows.length} 件投入しました。`);
