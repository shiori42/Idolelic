import { WALK_SPEED_MAX_KMH } from "@/lib/geo/constants";
import {
  computeGpsMovementMetrics,
  WALK_SPEED_MIN_KMH,
} from "@/lib/geo/movementMetrics";
import { computeSegmentSpeeds, movingAverageSpeedKmh } from "@/lib/geo/speed";
import type { GeoSample, MovementKind } from "@/types/geo";

/**
 * 加速度センサーで生歩数を増やしてよいか。
 * その場振り・振り子では false（歩数を増やさない）。
 */
export function shouldCountAccelerometerSteps(
  samples: GeoSample[],
  movementKind: MovementKind,
): boolean {
  if (movementKind === "excluded") return false;

  const segments = computeSegmentSpeeds(samples);
  const metrics = computeGpsMovementMetrics(samples);

  // 明らかなその場操作: 直線移動ほぼなし
  if (samples.length >= 4 && metrics.displacementMeters < 3) {
    return false;
  }

  // 経路は伸びるが net 移動が小さい（GPS ドリフト + 振り）
  if (
    metrics.wanderRatio !== null &&
    metrics.wanderRatio < 0.4 &&
    metrics.pathMeters > 8
  ) {
    return false;
  }

  const recentSpeed = movingAverageSpeedKmh(segments, 4);
  if (
    recentSpeed !== null &&
    recentSpeed >= WALK_SPEED_MIN_KMH &&
    recentSpeed < WALK_SPEED_MAX_KMH
  ) {
    return true;
  }

  if (metrics.displacementMeters >= 5) return true;

  // 計測開始直後のみ短時間許可（歩き出し）
  if (movementKind === "unknown" && samples.length <= 3) {
    return true;
  }

  return false;
}
