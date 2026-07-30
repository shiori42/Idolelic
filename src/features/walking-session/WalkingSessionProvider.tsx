"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useGeolocationWatcher } from "@/features/geolocation/hooks/useGeolocationWatcher";
import { useAccelerometerSteps } from "@/features/pedometer/hooks/useAccelerometerSteps";
import { useStepValidation } from "@/features/pedometer/hooks/useStepValidation";
import { useSpeedFilter } from "@/features/speed-filter/hooks/useSpeedFilter";
import { computeGpsMovementMetrics } from "@/lib/geo";
import { shouldCountAccelerometerSteps } from "@/lib/pedometer";
import type { GeoSample, MovementKind, SpeedFilterResult } from "@/types/geo";
import type { StepValidationResult } from "@/types/pedometer";

import type { GeolocationErrorCode, GeolocationStatus } from "@/features/geolocation/types";

type WalkingSessionContextValue = {
  sessionActive: boolean;
  isWatching: boolean;
  isRequesting: boolean;
  geoStatus: GeolocationStatus;
  geoErrorCode: GeolocationErrorCode | null;
  latestSample: GeoSample | null;
  sampleCount: number;
  speed: SpeedFilterResult;
  stepValidation: StepValidationResult;
  effectiveSteps: number;
  distanceKm: number;
  caloriesKcal: number;
  movementLabel: string;
  start: () => Promise<void>;
  stop: () => void;
  reset: () => void;
  toggle: () => Promise<void>;
};

const WalkingSessionContext = createContext<WalkingSessionContextValue | null>(
  null,
);

function movementLabel(kind: MovementKind, speedKmh: number | null) {
  const speed = speedKmh !== null ? `${speedKmh.toFixed(1)} km/h` : "—";
  if (kind === "walking") return `徒歩 · ${speed}`;
  if (kind === "excluded") return `除外 · ${speed}`;
  return "判定中…";
}

function estimateCalories(steps: number) {
  return Math.round(steps * 0.035);
}

export function WalkingSessionProvider({ children }: { children: ReactNode }) {
  const geo = useGeolocationWatcher();
  const speed = useSpeedFilter(geo.samples);
  const [sessionActive, setSessionActive] = useState(false);

  const allowStepCount = useMemo(
    () => shouldCountAccelerometerSteps(geo.samples, speed.kind),
    [geo.samples, speed.kind],
  );

  const steps = useAccelerometerSteps({
    active: sessionActive,
    allowCounting: allowStepCount,
  });

  const stepValidation = useStepValidation(
    steps.rawSteps,
    geo.samples,
    speed.kind,
  );

  const gpsMetrics = useMemo(
    () => computeGpsMovementMetrics(geo.samples),
    [geo.samples],
  );

  const effectiveSteps = sessionActive ? stepValidation.validatedSteps : 0;
  const distanceKm = sessionActive
    ? Math.round((gpsMetrics.effectiveMeters / 1000) * 100) / 100
    : 0;
  const caloriesKcal = sessionActive ? estimateCalories(effectiveSteps) : 0;

  const start = useCallback(async () => {
    await steps.requestPermission();
    geo.start();
    setSessionActive(true);
  }, [geo, steps]);

  const stop = useCallback(() => {
    geo.stop();
    setSessionActive(false);
  }, [geo]);

  const reset = useCallback(() => {
    geo.reset();
    steps.reset();
    setSessionActive(false);
  }, [geo, steps]);

  const toggle = useCallback(async () => {
    if (geo.isWatching) {
      stop();
      return;
    }
    await start();
  }, [geo.isWatching, start, stop]);

  const value = useMemo(
    () => ({
      sessionActive,
      isWatching: geo.isWatching,
      isRequesting: geo.isRequesting,
      geoStatus: geo.status,
      geoErrorCode: geo.errorCode,
      latestSample: geo.latestSample,
      sampleCount: geo.samples.length,
      speed,
      stepValidation,
      effectiveSteps,
      distanceKm,
      caloriesKcal,
      movementLabel: movementLabel(
        speed.kind,
        speed.averageSpeedKmh ?? speed.instantSpeedKmh,
      ),
      start,
      stop,
      reset,
      toggle,
    }),
    [
      sessionActive,
      geo.isWatching,
      geo.isRequesting,
      geo.status,
      geo.errorCode,
      geo.latestSample,
      geo.samples.length,
      speed,
      stepValidation,
      effectiveSteps,
      distanceKm,
      caloriesKcal,
      start,
      stop,
      reset,
      toggle,
    ],
  );

  return (
    <WalkingSessionContext.Provider value={value}>
      {children}
    </WalkingSessionContext.Provider>
  );
}

export function useWalkingSession() {
  const ctx = useContext(WalkingSessionContext);
  if (!ctx) {
    throw new Error(
      "useWalkingSession must be used within WalkingSessionProvider",
    );
  }
  return ctx;
}
