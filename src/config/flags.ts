/**
 * TGS 展示などで擬似 GPS を使うデモモード。
 * Phase 8 で features/demo からトレースを注入する。
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}
