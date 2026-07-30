import {
  MIN_STEP_DYNAMIC_SWING,
  MIN_STEP_INTERVAL_MS,
  STEP_ACCELERATION_THRESHOLD,
} from "./constants";

export type StepDetectorState = {
  lastStepAt: number;
  wasAboveThreshold: boolean;
  recentDynamics: number[];
  valleyDynamic: number;
};

export const INITIAL_STEP_DETECTOR_STATE: StepDetectorState = {
  lastStepAt: 0,
  wasAboveThreshold: false,
  recentDynamics: [],
  valleyDynamic: 0,
};

const DYNAMICS_HISTORY = 8;

/** 重力込み加速度から合成の大きさ（m/s²） */
export function accelerationMagnitude(
  ax: number,
  ay: number,
  az: number,
): number {
  return Math.sqrt(ax * ax + ay * ay + az * az);
}

export function dynamicAcceleration(magnitude: number): number {
  return Math.abs(magnitude - 9.80665);
}

/**
 * 簡易ピーク検出。振れ幅が小さいゆるい揺れは歩とみなさない。
 */
export function detectStepFromMagnitude(
  magnitude: number,
  timestamp: number,
  state: StepDetectorState,
): { stepDetected: boolean; nextState: StepDetectorState } {
  const dynamic = dynamicAcceleration(magnitude);
  const above = dynamic >= STEP_ACCELERATION_THRESHOLD;
  const sinceLast = timestamp - state.lastStepAt;

  const valleyDynamic = above
    ? state.valleyDynamic
    : Math.min(state.valleyDynamic || dynamic, dynamic);

  let stepDetected = false;

  if (above && !state.wasAboveThreshold && sinceLast >= MIN_STEP_INTERVAL_MS) {
    const swing = dynamic - valleyDynamic;
    if (swing >= MIN_STEP_DYNAMIC_SWING) {
      stepDetected = true;
    }
  }

  const recentDynamics = [...state.recentDynamics, dynamic].slice(
    -DYNAMICS_HISTORY,
  );

  return {
    stepDetected,
    nextState: {
      lastStepAt: stepDetected ? timestamp : state.lastStepAt,
      wasAboveThreshold: above,
      recentDynamics,
      valleyDynamic: stepDetected ? dynamic : valleyDynamic,
    },
  };
}
