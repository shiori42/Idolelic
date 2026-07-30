import type { MovementKind } from "@/types/geo";

import { WALK_SPEED_MAX_KMH } from "./constants";

/**
 * 平均時速から徒歩 / 除外 / 不明を判定。
 * - 平均が 10 km/h 未満 → walking（静止も徒歩扱い）
 * - 10 km/h 以上 → excluded（乗り物・不正）
 * - データ不足 → unknown
 */
export function classifyMovement(
  averageSpeedKmh: number | null,
): MovementKind {
  if (averageSpeedKmh === null || !Number.isFinite(averageSpeedKmh)) {
    return "unknown";
  }

  if (averageSpeedKmh < WALK_SPEED_MAX_KMH) {
    return "walking";
  }

  return "excluded";
}
