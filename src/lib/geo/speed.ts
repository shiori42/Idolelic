import type { GeoSample, SpeedSegment } from "@/types/geo";

import {
  MAX_ACCEPTABLE_ACCURACY_METERS,
  MAX_PLAUSIBLE_SEGMENT_SPEED_KMH,
  MIN_SEGMENT_DURATION_MS,
  SPEED_AVERAGE_WINDOW,
} from "./constants";
import { haversineDistanceMeters } from "./haversine";

function isSampleUsable(sample: GeoSample): boolean {
  if (sample.accuracy === undefined) return true;
  return sample.accuracy <= MAX_ACCEPTABLE_ACCURACY_METERS;
}

/**
 * 連続2サンプルから区間速度を算出。不正区間は null。
 */
export function computeSegmentSpeed(
  previous: GeoSample,
  current: GeoSample,
): SpeedSegment | null {
  if (!isSampleUsable(previous) || !isSampleUsable(current)) {
    return null;
  }

  const durationMs = current.timestamp - previous.timestamp;
  if (durationMs < MIN_SEGMENT_DURATION_MS) {
    return null;
  }

  const distanceMeters = haversineDistanceMeters(previous, current);
  const speedMps = distanceMeters / (durationMs / 1000);
  const speedKmh = speedMps * 3.6;

  if (
    !Number.isFinite(speedKmh) ||
    speedKmh > MAX_PLAUSIBLE_SEGMENT_SPEED_KMH
  ) {
    return null;
  }

  return { speedKmh, distanceMeters, durationMs };
}

/**
 * サンプル列から有効な区間速度リストを生成。
 */
export function computeSegmentSpeeds(samples: GeoSample[]): SpeedSegment[] {
  if (samples.length < 2) return [];

  const segments: SpeedSegment[] = [];
  for (let i = 1; i < samples.length; i += 1) {
    const segment = computeSegmentSpeed(samples[i - 1], samples[i]);
    if (segment) segments.push(segment);
  }
  return segments;
}

/**
 * 直近 N 件の区間速度の単純移動平均。
 */
export function movingAverageSpeedKmh(
  segments: SpeedSegment[],
  windowSize: number = SPEED_AVERAGE_WINDOW,
): number | null {
  if (segments.length === 0) return null;

  const slice = segments.slice(-windowSize);
  const sum = slice.reduce((acc, s) => acc + s.speedKmh, 0);
  return sum / slice.length;
}

export function latestSegmentSpeedKmh(
  segments: SpeedSegment[],
): number | null {
  if (segments.length === 0) return null;
  return segments[segments.length - 1].speedKmh;
}
