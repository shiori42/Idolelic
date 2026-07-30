import type { GeoSample, SpeedFilterResult } from "@/types/geo";

import { classifyMovement } from "./classifyMovement";
import { SPEED_AVERAGE_WINDOW } from "./constants";
import {
  computeSegmentSpeeds,
  latestSegmentSpeedKmh,
  movingAverageSpeedKmh,
} from "./speed";

/**
 * GPS サンプル列から速度フィルタ結果を一括算出（純関数・UI 非依存）。
 */
export function evaluateSpeedFilter(samples: GeoSample[]): SpeedFilterResult {
  const segments = computeSegmentSpeeds(samples);
  const averageSpeedKmh = movingAverageSpeedKmh(
    segments,
    SPEED_AVERAGE_WINDOW,
  );
  const instantSpeedKmh = latestSegmentSpeedKmh(segments);

  return {
    kind: classifyMovement(averageSpeedKmh),
    instantSpeedKmh,
    averageSpeedKmh,
    segmentCount: segments.length,
  };
}
