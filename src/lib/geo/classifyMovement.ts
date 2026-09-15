import type { MovementKind } from "@/types/geo";

import { WALK_SPEED_MAX_KMH } from "./constants";
import { WALK_SPEED_MIN_KMH } from "./movementMetrics";

/**
 * 平均時速から移動種別を判定。
 * - 0.8 km/h 未満 → still（静止・ほぼ止まっている）
 * - 0.8 以上 10 km/h 未満 → walking（徒歩）
 * - 10 km/h 以上 → excluded（乗り物・不正）
 * - データ不足 → unknown
 */
export function classifyMovement(
  averageSpeedKmh: number | null,
): MovementKind {
  if (averageSpeedKmh === null || !Number.isFinite(averageSpeedKmh)) {
    return "unknown";
  }

  if (averageSpeedKmh < WALK_SPEED_MIN_KMH) {
    return "still";
  }

  if (averageSpeedKmh < WALK_SPEED_MAX_KMH) {
    return "walking";
  }

  return "excluded";
}
