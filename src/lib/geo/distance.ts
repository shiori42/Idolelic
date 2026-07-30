import type { GeoSample } from "@/types/geo";

import { computeSegmentSpeeds } from "./speed";

/**
 * 有効な GPS 区間の移動距離合計（メートル）。
 * ジャンプ除外済みのセグメントのみ加算。
 */
export function computeTotalGpsDistanceMeters(samples: GeoSample[]): number {
  const segments = computeSegmentSpeeds(samples);
  return segments.reduce((sum, s) => sum + s.distanceMeters, 0);
}
