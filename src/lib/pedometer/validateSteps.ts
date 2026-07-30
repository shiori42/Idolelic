import type { GpsMovementMetrics } from "@/lib/geo/movementMetrics";
import type { MovementKind } from "@/types/geo";
import type { StepValidationResult, StepValidationStatus } from "@/types/pedometer";

import {
  DEFAULT_STRIDE_LENGTH_M,
  MAX_STEP_GPS_DISTANCE_RATIO,
  MIN_STEP_GPS_DISTANCE_RATIO,
} from "./constants";

type ValidateStepsInput = {
  rawSteps: number;
  movementKind: MovementKind;
  gpsMetrics: GpsMovementMetrics;
  strideLengthM?: number;
};

/**
 * 生歩数と GPS 実効移動距離の整合性から有効歩数を算出。
 */
export function validateSteps({
  rawSteps,
  movementKind,
  gpsMetrics,
  strideLengthM = DEFAULT_STRIDE_LENGTH_M,
}: ValidateStepsInput): StepValidationResult {
  const gpsDistanceMeters = gpsMetrics.effectiveMeters;
  const impliedDistanceMeters = rawSteps * strideLengthM;
  const gpsCapSteps = Math.floor(gpsDistanceMeters / strideLengthM);

  if (movementKind === "excluded") {
    return buildResult({
      status: "excluded_movement",
      rawSteps,
      validatedSteps: 0,
      gpsDistanceMeters,
      impliedDistanceMeters,
      distanceRatio: null,
    });
  }

  if (rawSteps === 0) {
    return buildResult({
      status: gpsDistanceMeters > 0 ? "insufficient_data" : "ok",
      rawSteps: 0,
      validatedSteps: 0,
      gpsDistanceMeters,
      impliedDistanceMeters: 0,
      distanceRatio: null,
    });
  }

  // その場振り: 直線移動がほぼない
  if (
    gpsMetrics.displacementMeters < 4 &&
    (gpsMetrics.wanderRatio === null || gpsMetrics.wanderRatio < 0.55)
  ) {
    return buildResult({
      status: "shake_detected",
      rawSteps,
      validatedSteps: 0,
      gpsDistanceMeters,
      impliedDistanceMeters,
      distanceRatio:
        impliedDistanceMeters > 0
          ? gpsDistanceMeters / impliedDistanceMeters
          : null,
    });
  }

  if (gpsDistanceMeters < 3) {
    return buildResult({
      status: "shake_detected",
      rawSteps,
      validatedSteps: 0,
      gpsDistanceMeters,
      impliedDistanceMeters,
      distanceRatio:
        impliedDistanceMeters > 0
          ? gpsDistanceMeters / impliedDistanceMeters
          : null,
    });
  }

  const distanceRatio = gpsDistanceMeters / impliedDistanceMeters;

  if (distanceRatio < MIN_STEP_GPS_DISTANCE_RATIO) {
    return buildResult({
      status: "capped_by_gps",
      rawSteps,
      validatedSteps: gpsCapSteps,
      gpsDistanceMeters,
      impliedDistanceMeters,
      distanceRatio,
    });
  }

  if (distanceRatio > MAX_STEP_GPS_DISTANCE_RATIO) {
    return buildResult({
      status: "capped_by_gps",
      rawSteps,
      validatedSteps: Math.min(rawSteps, gpsCapSteps + 2),
      gpsDistanceMeters,
      impliedDistanceMeters,
      distanceRatio,
    });
  }

  return buildResult({
    status: "ok",
    rawSteps,
    validatedSteps: rawSteps,
    gpsDistanceMeters,
    impliedDistanceMeters,
    distanceRatio,
  });
}

function buildResult(params: {
  status: StepValidationStatus;
  rawSteps: number;
  validatedSteps: number;
  gpsDistanceMeters: number;
  impliedDistanceMeters: number;
  distanceRatio: number | null;
}): StepValidationResult {
  const validatedSteps = Math.max(
    0,
    Math.min(params.validatedSteps, params.rawSteps),
  );
  return {
    status: params.status,
    rawSteps: params.rawSteps,
    validatedSteps,
    gpsDistanceMeters: params.gpsDistanceMeters,
    impliedDistanceMeters: params.impliedDistanceMeters,
    distanceRatio: params.distanceRatio,
    rejectedSteps: params.rawSteps - validatedSteps,
  };
}
