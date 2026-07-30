import { spawn } from "node:child_process";

/**
 * cloudflared で HTTPS トンネルを張る（証明書問題で接続が切れる場合の代替）。
 * 別ターミナルで npm run dev を起動してから実行するか、
 * 先に dev を起動しておくこと。
 */
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("📡 HTTPS トンネルを起動します");
console.log("");
console.log("別ターミナルで次が起動している必要があります:");
console.log("  npm run dev");
console.log("");
console.log("表示された https://xxxx.trycloudflare.com をスマホで開き");
console.log("  /gps-lab を付けてください");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

const child = spawn(
  "npx",
  ["--yes", "cloudflared", "tunnel", "--url", "http://127.0.0.1:3000"],
  {
    stdio: "inherit",
    shell: true,
    env: process.env,
  },
);

child.on("exit", (code) => process.exit(code ?? 0));
