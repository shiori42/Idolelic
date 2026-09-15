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
  if (movementKind === "excluded" || movementKind === "still") return false;

  const segments = computeSegmentSpeeds(samples);
  const metrics = computeGpsMovementMetrics(samples);
  const recentSpeed = movingAverageSpeedKmh(segments, 4);

  // その場操作: net 移動が小さく、直線的にも進んでいない
  // （GPSジッターは偽の徒歩速度を出すことがあるので、速度帯より先に見る）
  if (
    samples.length >= 4 &&
    metrics.displacementMeters < 3 &&
    (metrics.wanderRatio === null || metrics.wanderRatio < 0.5)
  ) {
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

  // 直近が徒歩速度帯、または十分に移動していれば許可
  // （歩き出し直後は displacement がまだ小さくても、直線なら上のゲートを通過済み）
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
