import { networkInterfaces } from "node:os";

/**
 * スマホ実機テスト向けの IPv4 を選ぶ。
 * 169.254.x.x（リンクローカル）は接続が不安定になりやすいため優先度を下げる。
 */
export function getLanIp() {
  if (process.env.DEV_MOBILE_HOST) {
    return process.env.DEV_MOBILE_HOST;
  }

  const candidates = [];

  for (const interfaces of Object.values(networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family !== "IPv4" || net.internal) continue;
      candidates.push(net.address);
    }
  }

  const score = (ip) => {
    if (ip.startsWith("192.168.")) return 100;
    if (ip.startsWith("10.")) return 90;
    if (ip.startsWith("172.")) return 80;
    if (ip.startsWith("169.254.")) return 5;
    return 50;
  };

  candidates.sort((a, b) => score(b) - score(a));

  return candidates[0] ?? "127.0.0.1";
}
