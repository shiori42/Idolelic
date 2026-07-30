"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  accelerationMagnitude,
  detectStepFromMagnitude,
  INITIAL_STEP_DETECTOR_STATE,
} from "@/lib/pedometer";

import { getInitialMotionPermission } from "../lib/motionPermission";

export type MotionPermission = "unsupported" | "prompt" | "granted" | "denied";

type UseAccelerometerStepsOptions = {
  active?: boolean;
  /** false のとき加速度から生歩数を増やさない（その場振り） */
  allowCounting?: boolean;
};

export function useAccelerometerSteps(
  options: UseAccelerometerStepsOptions = {},
) {
  const { active = false, allowCounting = true } = options;
  const [rawSteps, setRawSteps] = useState(0);
  const [permission, setPermission] = useState<MotionPermission>(
    getInitialMotionPermission,
  );
  const detectorRef = useRef(INITIAL_STEP_DETECTOR_STATE);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === "undefined" || !("DeviceMotionEvent" in window)) {
      setPermission("unsupported");
      return false;
    }

    const motionEvent = DeviceMotionEvent as typeof DeviceMotionEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };

    if (typeof motionEvent.requestPermission === "function") {
      try {
        const result = await motionEvent.requestPermission();
        const granted = result === "granted";
        setPermission(granted ? "granted" : "denied");
        return granted;
      } catch {
        setPermission("denied");
        return false;
      }
    }

    setPermission("granted");
    return true;
  }, []);

  useEffect(() => {
    if (!active || permission !== "granted" || !allowCounting) return;

    const onMotion = (event: DeviceMotionEvent) => {
      const acc = event.accelerationIncludingGravity;
      if (!acc) return;
      const { x, y, z } = acc;
      if (x === null || y === null || z === null) return;

      const magnitude = accelerationMagnitude(x, y, z);
      const timestamp = Date.now();
      const { stepDetected, nextState } = detectStepFromMagnitude(
        magnitude,
        timestamp,
        detectorRef.current,
      );
      detectorRef.current = nextState;

      if (stepDetected) {
        setRawSteps((prev) => prev + 1);
      }
    };

    window.addEventListener("devicemotion", onMotion);
    return () => window.removeEventListener("devicemotion", onMotion);
  }, [active, permission, allowCounting]);

  const reset = useCallback(() => {
    setRawSteps(0);
    detectorRef.current = INITIAL_STEP_DETECTOR_STATE;
  }, []);

  return {
    rawSteps,
    permission,
    requestPermission,
    reset,
    isActive: active && permission === "granted",
    isCounting: active && permission === "granted" && allowCounting,
  };
}
