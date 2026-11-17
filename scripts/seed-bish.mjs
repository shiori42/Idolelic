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
    legacy_id: "bish-1",
    name: "浦安・鉄鋼通り（工業地帯）",
    work_title: "Bye-Bye Show",
    group_name: "BiSH",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県浦安市鉄鋼通り2丁目5付近",
    description:
      "ラストシングル『Bye-Bye Show』の工業地帯シーン撮影地。デビュー曲『BiSH-星が瞬く夜に』と同じ原点のロケ地としても知られる。\n年代: 2020年代",
    latitude: 35.6482,
    longitude: 139.9068,
    source: "official",
  },
  {
    legacy_id: "bish-2",
    name: "浦安・千鳥エリア",
    work_title: "Bye-Bye Show",
    group_name: "BiSH",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県浦安市千鳥16付近",
    description:
      "『Bye-Bye Show』の海岸側シーン撮影地。鉄鋼通りから徒歩圏で、原点回帰の聖地巡礼に回りやすい。\n年代: 2020年代",
    latitude: 35.6405,
    longitude: 139.9055,
    source: "official",
  },
  {
    legacy_id: "bish-3",
    name: "浦安・鉄鋼通り（星が瞬く夜に）",
    work_title: "BiSH-星が瞬く夜に",
    group_name: "BiSH",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県浦安市鉄鋼通り2丁目5付近",
    description:
      "『BiSH-星が瞬く夜に』のMV撮影地。のちの『Bye-Bye Show』でも同じエリアが使われた原点。\n年代: 2010年代",
    latitude: 35.64835,
    longitude: 139.90695,
    source: "official",
  },
  {
    legacy_id: "bish-4",
    name: "道玄坂上交差点周辺",
    work_title: "LETTERS",
    group_name: "BiSH",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区道玄坂2丁目3-1付近",
    description:
      "『LETTERS』MVの渋谷ロケ起点。交差点上空カットなど、街歩きのスタート地点にしやすい。\n年代: 2020年代",
    latitude: 35.6588,
    longitude: 139.6989,
    source: "official",
  },
  {
    legacy_id: "bish-5",
    name: "宮益坂歩道橋",
    work_title: "LETTERS",
    group_name: "BiSH",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区渋谷1丁目付近",
    description:
      "『LETTERS』で歩道橋シーンが撮影されたエリア。スクランブルから徒歩圏。\n年代: 2020年代",
    latitude: 35.65985,
    longitude: 139.70355,
    source: "official",
  },
  {
    legacy_id: "bish-6",
    name: "宇田川町・公園通り歩道橋付近",
    work_title: "LETTERS",
    group_name: "BiSH",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区宇田川町付近",
    description:
      "『LETTERS』の歩道橋・屋上周辺ロケのハブ。通行の妨げにならないよう見学は控えめに。\n年代: 2020年代",
    latitude: 35.6612,
    longitude: 139.6982,
    source: "official",
  },
  {
    legacy_id: "bish-7",
    name: "渋谷スクランブル交差点",
    work_title: "LETTERS",
    group_name: "BiSH",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都渋谷区道玄坂2丁目・宇田川町付近",
    description:
      "『LETTERS』巡礼の結節点。道玄坂・宮益坂・宇田川町の各スポットをつなぐ。\n年代: 2020年代",
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
console.log(`BiSH 聖地を ${rows.length} 件投入しました。`);
