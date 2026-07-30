import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

import { getLanIp } from "./get-lan-ip.mjs";

const ip = getLanIp();
const certDir = path.join(process.cwd(), "certificates");

// localhost 専用の古い証明書があると LAN IP で TLS エラー → 接続が切れる
if (fs.existsSync(certDir)) {
  for (const file of fs.readdirSync(certDir)) {
    fs.unlinkSync(path.join(certDir, file));
  }
  console.log("🔄 LAN IP 用に証明書を再生成します…\n");
}

const url = `https://${ip}:3000/gps-lab`;

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📱 スマホのブラウザで開く URL（これをコピー）");
console.log(`\n   ${url}\n`);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("・http ではなく https であること");
console.log("・0.0.0.0 や 192.168.0.10（スマホ自身のIP）では開かないこと");
console.log("・証明書警告 →「詳細」→ 続行（開発用）");
console.log("・接続が切れる場合: npm run dev:tunnel を試す\n");

const child = spawn(
  "npx",
  ["next", "dev", "--hostname", ip, "--experimental-https"],
  {
    stdio: "inherit",
    shell: true,
    env: process.env,
  },
);

child.on("exit", (code) => process.exit(code ?? 0));
