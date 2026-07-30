"use client";

import { useMemo } from "react";

import { computeGpsMovementMetrics } from "@/lib/geo/movementMetrics";
import { validateSteps } from "@/lib/pedometer";
import type { GeoSample, MovementKind } from "@/types/geo";
import type { StepValidationResult } from "@/types/pedometer";

const EMPTY: StepValidationResult = {
  status: "insufficient_data",
  rawSteps: 0,
  validatedSteps: 0,
  gpsDistanceMeters: 0,
  impliedDistanceMeters: 0,
  distanceRatio: null,
  rejectedSteps: 0,
};

export function useStepValidation(
  rawSteps: number,
  samples: GeoSample[],
  movementKind: MovementKind,
): StepValidationResult {
  return useMemo(() => {
    const gpsMetrics = computeGpsMovementMetrics(samples);
    if (rawSteps === 0 && gpsMetrics.effectiveMeters === 0) return EMPTY;

    return validateSteps({
      rawSteps,
      movementKind,
      gpsMetrics,
    });
  }, [rawSteps, samples, movementKind]);
}
