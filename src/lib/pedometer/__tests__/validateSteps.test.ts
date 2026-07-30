import { describe, expect, it } from "vitest";

import type { GpsMovementMetrics } from "@/lib/geo/movementMetrics";

import { validateSteps } from "../validateSteps";

function metrics(partial: Partial<GpsMovementMetrics>): GpsMovementMetrics {
  return {
    pathMeters: 0,
    displacementMeters: 0,
    walkingPathMeters: 0,
    effectiveMeters: 0,
    wanderRatio: null,
    ...partial,
  };
}

describe("validateSteps", () => {
  it("accepts steps when effective GPS matches implied stride", () => {
    const result = validateSteps({
      rawSteps: 100,
      movementKind: "walking",
      gpsMetrics: metrics({
        pathMeters: 70,
        displacementMeters: 68,
        walkingPathMeters: 65,
        effectiveMeters: 65,
        wanderRatio: 0.97,
      }),
    });
    expect(result.status).toBe("ok");
    expect(result.validatedSteps).toBe(100);
  });

  it("rejects in-place shake with low displacement", () => {
    const result = validateSteps({
      rawSteps: 50,
      movementKind: "walking",
      gpsMetrics: metrics({
        pathMeters: 15,
        displacementMeters: 1.5,
        walkingPathMeters: 8,
        effectiveMeters: 1.5,
        wanderRatio: 0.1,
      }),
    });
    expect(result.status).toBe("shake_detected");
    expect(result.validatedSteps).toBe(0);
  });

  it("caps steps when GPS effective distance is far below implied", () => {
    const result = validateSteps({
      rawSteps: 200,
      movementKind: "walking",
      gpsMetrics: metrics({
        pathMeters: 40,
        displacementMeters: 18,
        walkingPathMeters: 20,
        effectiveMeters: 18,
        wanderRatio: 0.45,
      }),
    });
    expect(result.status).toBe("capped_by_gps");
    expect(result.validatedSteps).toBeLessThan(200);
    expect(result.validatedSteps).toBe(Math.floor(18 / 0.7));
  });

  it("zeros validated steps when movement is excluded", () => {
    const result = validateSteps({
      rawSteps: 50,
      movementKind: "excluded",
      gpsMetrics: metrics({
        effectiveMeters: 40,
        displacementMeters: 40,
      }),
    });
    expect(result.status).toBe("excluded_movement");
    expect(result.validatedSteps).toBe(0);
  });
});
