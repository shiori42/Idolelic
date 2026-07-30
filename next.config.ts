import type { NextConfig } from "next";

/** スマホ実機テスト用: 社内 LAN のプライベート IP を開発時に許可 */
const lanDevOrigins = [
  "192.168.*.*",
  "10.*.*.*",
  "169.254.*.*",
  "172.16.*.*",
  "172.17.*.*",
  "172.18.*.*",
  "172.19.*.*",
  "172.20.*.*",
  "172.21.*.*",
  "172.22.*.*",
  "172.23.*.*",
  "172.24.*.*",
  "172.25.*.*",
  "172.26.*.*",
  "172.27.*.*",
  "172.28.*.*",
  "172.29.*.*",
  "172.30.*.*",
  "172.31.*.*",
];

const extraDevOrigins =
  process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  allowedDevOrigins: [...lanDevOrigins, ...extraDevOrigins],
};

export default nextConfig;
