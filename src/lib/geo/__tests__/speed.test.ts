import { describe, expect, it } from "vitest";

import type { GeoSample } from "@/types/geo";

import {
  computeSegmentSpeed,
  computeSegmentSpeeds,
  movingAverageSpeedKmh,
} from "../speed";

function sample(
  lat: number,
  lng: number,
  timestamp: number,
  accuracy = 10,
): GeoSample {
  return { latitude: lat, longitude: lng, timestamp, accuracy };
}

/** 約 5 km/h 相当（100m / 72秒） */
describe("computeSegmentSpeed", () => {
  it("returns ~5 km/h for slow pedestrian movement", () => {
    const prev = sample(35.6812, 139.7671, 0);
    const curr = sample(35.6821, 139.7671, 72_000);

    const segment = computeSegmentSpeed(prev, curr);
    expect(segment).not.toBeNull();
    expect(segment!.speedKmh).toBeGreaterThan(4);
    expect(segment!.speedKmh).toBeLessThan(6);
  });

  it("returns null for GPS jump (train-like speed)", () => {
    const prev = sample(35.6812, 139.7671, 0);
    const curr = sample(35.7, 139.9, 5_000);

    expect(computeSegmentSpeed(prev, curr)).toBeNull();
  });

  it("returns null when accuracy is too poor", () => {
    const prev = sample(35.6812, 139.7671, 0, 120);
    const curr = sample(35.6813, 139.7672, 5_000, 10);

    expect(computeSegmentSpeed(prev, curr)).toBeNull();
  });
});

describe("movingAverageSpeedKmh", () => {
  it("averages the last N segments", () => {
    const segments = computeSegmentSpeeds([
      sample(35.6812, 139.7671, 0),
      sample(35.6814, 139.7671, 30_000),
      sample(35.6816, 139.7671, 60_000),
      sample(35.6818, 139.7671, 90_000),
    ]);

    const avg = movingAverageSpeedKmh(segments, 3);
    expect(avg).not.toBeNull();
    expect(avg!).toBeGreaterThan(0);
    expect(avg!).toBeLessThan(10);
  });
});
