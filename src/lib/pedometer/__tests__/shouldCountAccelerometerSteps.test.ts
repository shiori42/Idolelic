import { describe, expect, it } from "vitest";

import type { GeoSample } from "@/types/geo";

import { shouldCountAccelerometerSteps } from "../shouldCountAccelerometerSteps";

function sample(lat: number, lng: number, timestamp: number): GeoSample {
  return { latitude: lat, longitude: lng, timestamp, accuracy: 8 };
}

describe("shouldCountAccelerometerSteps", () => {
  it("returns false when displacement is tiny (in-place)", () => {
    const samples = [
      sample(35.6812, 139.7671, 0),
      sample(35.68121, 139.76711, 2000),
      sample(35.68119, 139.76709, 4000),
      sample(35.6812, 139.7671, 6000),
    ];
    expect(shouldCountAccelerometerSteps(samples, "walking")).toBe(false);
  });

  it("returns true when actually walking", () => {
    const samples = [
      sample(35.6812, 139.7671, 0),
      sample(35.6815, 139.7671, 5000),
      sample(35.6818, 139.7671, 10000),
      sample(35.6821, 139.7671, 15000),
    ];
    expect(shouldCountAccelerometerSteps(samples, "walking")).toBe(true);
  });
});
