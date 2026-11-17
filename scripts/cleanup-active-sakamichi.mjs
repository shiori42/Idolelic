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

const prefixes = ["nogizaka-", "sakurazaka-", "hinatazaka-"];
const groups = ["乃木坂46", "櫻坂46", "日向坂46"];

for (const prefix of prefixes) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/community_spots?legacy_id=like.${prefix}*`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      },
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error(`legacy_id ${prefix}* 削除失敗: ${response.status} ${detail}`);
    process.exit(1);
  }
  const rows = await response.json();
  console.log(`${prefix}* を ${rows.length} 件削除しました。`);
}

for (const group of groups) {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/community_spots?group_name=eq.${encodeURIComponent(group)}`,
    {
      method: "DELETE",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      },
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error(`${group} 削除失敗: ${response.status} ${detail}`);
    process.exit(1);
  }
  const rows = await response.json();
  console.log(`${group} を ${rows.length} 件削除しました。`);
}
