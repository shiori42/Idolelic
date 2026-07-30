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
    legacy_id: "kobushi-1",
    name: "白鵬女子高等学校",
    work_title: "ドスコイ！ケンキョにダイタン",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "神奈川県",
    region: "関東",
    address: "神奈川県横浜市鶴見区北寺尾4丁目10-13",
    description:
      "校舎や体育館などが『ドスコイ！ケンキョにダイタン』のMV撮影に使用された。",
    latitude: 35.516113,
    longitude: 139.658588,
    source: "official",
  },
  {
    legacy_id: "kobushi-2",
    name: "m BAY POINT幕張（旧・NTT幕張ビル）",
    work_title: "押忍！こぶし魂",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "千葉県",
    region: "関東",
    address: "千葉県千葉市美浜区中瀬1丁目6",
    description:
      "高層オフィスビルの外周や公開空地が『押忍！こぶし魂』のMV撮影地として使用された。",
    latitude: 35.652829,
    longitude: 140.039538,
    source: "official",
  },
  {
    legacy_id: "kobushi-3",
    name: "上谷総合公園野球場（フラワースタジアム）",
    work_title: "バッチ来い青春！",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県鴻巣市上谷707",
    description:
      "天然芝の野球場。『バッチ来い青春！』の野球シーンが撮影された。",
    latitude: 36.059485,
    longitude: 139.550363,
    source: "official",
  },
  {
    legacy_id: "kobushi-4",
    name: "ニーズ八王子 by T&G WEDDING（旧・ヒルサイドクラブ迎賓館 八王子）",
    work_title: "サンバ！こぶしジャネイロ",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都八王子市みなみ野1丁目7-8",
    description:
      "披露宴会場、庭園、エントランスが『サンバ！こぶしジャネイロ』のMV撮影に使用された。",
    latitude: 35.632705,
    longitude: 139.326394,
    source: "official",
  },
  {
    legacy_id: "kobushi-5",
    name: "そうか公園・イベント広場",
    work_title: "青春の花",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "埼玉県",
    region: "関東",
    address: "埼玉県草加市柿木町272-1",
    description:
      "石組みの円形ステージがあるイベント広場。『青春の花』で5人が集合する場面の撮影地。",
    latitude: 35.861984,
    longitude: 139.826535,
    source: "official",
  },
  {
    legacy_id: "kobushi-6",
    name: "たちかわ創造舎（旧多摩川小学校）",
    work_title: "これからだ！",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都立川市富士見町6-46-1",
    description:
      "『これからだ！』のMV撮影地。旧小学校を活用した文化創造施設で、屋上などが撮影に使われた。",
    latitude: 35.691589,
    longitude: 139.38989,
    source: "official",
  },
  {
    legacy_id: "kobushi-7",
    name: "プラネアール 青梅スタジオ",
    work_title: "きっと私は",
    group_name: "こぶしファクトリー",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "東京都青梅市成木8-333",
    description:
      "『きっと私は』のMV撮影地。築年数の長い古民家を利用した撮影スタジオ。",
    latitude: 35.818754,
    longitude: 139.239064,
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
console.log(`こぶしファクトリー 聖地を ${rows.length} 件投入しました。`);
