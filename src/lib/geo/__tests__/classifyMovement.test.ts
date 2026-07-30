import { describe, expect, it } from "vitest";

import type { GeoSample } from "@/types/geo";

import { classifyMovement } from "../classifyMovement";
import { evaluateSpeedFilter } from "../evaluateSpeedFilter";
import { WALK_SPEED_MAX_KMH } from "../constants";

function sample(
  lat: number,
  lng: number,
  timestamp: number,
): GeoSample {
  return { latitude: lat, longitude: lng, timestamp, accuracy: 8 };
}

describe("classifyMovement", () => {
  it("walking when average below threshold", () => {
    expect(classifyMovement(5)).toBe("walking");
    expect(classifyMovement(WALK_SPEED_MAX_KMH - 0.1)).toBe("walking");
  });

  it("excluded at or above threshold", () => {
    expect(classifyMovement(10)).toBe("excluded");
    expect(classifyMovement(45)).toBe("excluded");
  });

  it("unknown without data", () => {
    expect(classifyMovement(null)).toBe("unknown");
  });
});

describe("evaluateSpeedFilter", () => {
  it("classifies walking trajectory", () => {
    const samples: GeoSample[] = [
      sample(35.6812, 139.7671, 0),
      sample(35.68135, 139.7671, 20_000),
      sample(35.6815, 139.7671, 40_000),
      sample(35.68165, 139.7671, 60_000),
      sample(35.6818, 139.7671, 80_000),
      sample(35.68195, 139.7671, 100_000),
    ];

    const result = evaluateSpeedFilter(samples);
    expect(result.kind).toBe("walking");
    expect(result.averageSpeedKmh).not.toBeNull();
    expect(result.averageSpeedKmh!).toBeLessThan(WALK_SPEED_MAX_KMH);
  });

  it("classifies fast movement as excluded", () => {
    const samples: GeoSample[] = [
      sample(35.6812, 139.7671, 0),
      sample(35.69, 139.78, 60_000),
      sample(35.7, 139.79, 120_000),
      sample(35.71, 139.8, 180_000),
    ];

    const result = evaluateSpeedFilter(samples);
    expect(result.kind).toBe("excluded");
  });
});
