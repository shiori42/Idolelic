import type { GeoSample } from "@/types/geo";

import { WALK_SPEED_MAX_KMH } from "./constants";
import { haversineDistanceMeters } from "./haversine";
import { computeSegmentSpeeds } from "./speed";

/** 歩行とみなす最低時速（これ未満は据え置き・振り子） */
export const WALK_SPEED_MIN_KMH = 0.8;

export type GpsMovementMetrics = {
  /** 全区間の経路長（ドリフト含む） */
  pathMeters: number;
  /** 始点→終点の直線距離 */
  displacementMeters: number;
  /** 歩行速度帯の区間だけの経路長 */
  walkingPathMeters: number;
  /** 歩数検証に使う実効距離（振り子・蛇行を抑える） */
  effectiveMeters: number;
  /** displacement / path（低いほどその場揺れ） */
  wanderRatio: number | null;
};

/**
 * GPS から「実際に移動した」とみなせる距離を推定。
 * その場で振ると path は伸びるが displacement は小さい → effective を抑える。
 */
export function computeGpsMovementMetrics(
  samples: GeoSample[],
): GpsMovementMetrics {
  const segments = computeSegmentSpeeds(samples);
  const pathMeters = segments.reduce((sum, s) => sum + s.distanceMeters, 0);

  const walkingPathMeters = segments
    .filter(
      (s) => s.speedKmh >= WALK_SPEED_MIN_KMH && s.speedKmh < WALK_SPEED_MAX_KMH,
    )
    .reduce((sum, s) => sum + s.distanceMeters, 0);

  const displacementMeters =
    samples.length >= 2
      ? haversineDistanceMeters(samples[0], samples[samples.length - 1])
      : 0;

  const wanderRatio =
    pathMeters > 1 ? displacementMeters / pathMeters : null;

  let effectiveMeters = walkingPathMeters;

  // 蛇行・ドリフトだけで path が伸びている（その場振り）
  if (
    wanderRatio !== null &&
    wanderRatio < 0.5 &&
    pathMeters > 6 &&
    displacementMeters < 12
  ) {
    effectiveMeters = displacementMeters;
  } else {
    effectiveMeters = Math.min(walkingPathMeters, displacementMeters * 1.2 + 2);
  }

  effectiveMeters = Math.max(0, effectiveMeters);

  return {
    pathMeters,
    displacementMeters,
    walkingPathMeters,
    effectiveMeters,
    wanderRatio,
  };
}
