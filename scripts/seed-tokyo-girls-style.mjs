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
    legacy_id: "tgs-1",
    name: "横須賀美術館",
    work_title: "Limited addiction",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横須賀市鴨居4-1",
    description:
      "『Limited addiction』のMV撮影地。屋上広場や海に面した美術館周辺で撮影された。",
    latitude: 35.259795,
    longitude: 139.738199,
    source: "official",
  },
  {
    legacy_id: "tgs-2",
    name: "山梨県笛吹川フルーツ公園",
    work_title: "ちいさな奇跡",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "山梨県",
    region: "中部",
    address: "山梨県山梨市江曽原1488",
    description:
      "『ちいさな奇跡』のMV撮影地。特徴的なドーム施設や園内の風景が登場する。",
    latitude: 35.702032,
    longitude: 138.664418,
    source: "official",
  },
  {
    legacy_id: "tgs-3",
    name: "サドヤ シャトー・ド・プロヴァンス",
    work_title: "Say long goodbye",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "山梨県",
    region: "中部",
    address: "山梨県甲府市北口3-3-24",
    description:
      "『Say long goodbye』のMV撮影地。ワイナリーに併設された結婚式場で撮影された。",
    latitude: 35.667509,
    longitude: 138.573929,
    source: "official",
  },
  {
    legacy_id: "tgs-4",
    name: "SHIGENO河口湖ハウス",
    work_title: "Hello, Goodbye",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "山梨県",
    region: "中部",
    address: "山梨県南都留郡富士河口湖町長浜2328",
    description:
      "『Hello, Goodbye』のMV撮影地。河口湖近くにある洋館型の撮影スタジオで、撮影当時はEGUCHI河口湖ハウスと案内されていた。",
    latitude: 35.5010095,
    longitude: 138.71735,
    source: "official",
  },
  {
    legacy_id: "tgs-5",
    name: "中城城跡",
    work_title: "追憶 -Single Version-",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "沖縄県",
    region: "九州・沖縄",
    address: "沖縄県中頭郡中城村泊1258",
    description:
      "『追憶 -Single Version-』のMVおよびジャケット撮影地。一の郭にある観月台周辺で撮影された。",
    latitude: 26.284194,
    longitude: 127.801389,
    source: "official",
  },
  {
    legacy_id: "tgs-6",
    name: "みなとみらいグランドセントラルタワー",
    work_title: "predawn",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横浜市西区みなとみらい4-6-2",
    description:
      "『predawn』のMV撮影地。ビル屋上のヘリポートでパフォーマンスシーンが撮影された。",
    latitude: 35.458559,
    longitude: 139.628633,
    source: "official",
  },
  {
    legacy_id: "tgs-7",
    name: "YELLOW STUDIO A Studio",
    work_title: "Get The Star",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横浜市都筑区高山18-25",
    description:
      "『Get The Star』のMV撮影地。大型ホリゾントを備えた撮影スタジオのA Studioが使用された。",
    latitude: 35.53368,
    longitude: 139.56107,
    source: "official",
  },
  {
    legacy_id: "tgs-8",
    name: "ウエディングファンタジア",
    work_title: "We Will Win",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "静岡県",
    region: "中部",
    address: "静岡県沼津市春日町17-5",
    description:
      "『We Will Win』のMV撮影地。港に面した結婚式場で撮影された。撮影当時の名称はSt. Valentin WEDDING FANTASIA。",
    latitude: 35.085157,
    longitude: 138.859888,
    source: "official",
  },
  {
    legacy_id: "tgs-9",
    name: "神戸ハーバーランド",
    work_title: "サヨナラ、ありがとう。",
    group_name: "東京女子流",
    category: "MV",
    prefecture: "兵庫県",
    region: "近畿",
    address: "兵庫県神戸市中央区東川崎町1丁目",
    description:
      "『サヨナラ、ありがとう。』のMV撮影地。神戸港沿いのハーバーランド一帯で屋外シーンが撮影された。",
    latitude: 34.679565,
    longitude: 135.181664,
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
console.log(`東京女子流 聖地を ${rows.length} 件投入しました。`);
