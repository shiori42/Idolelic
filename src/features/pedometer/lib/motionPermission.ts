import type { MotionPermission } from "../hooks/useAccelerometerSteps";

export function getInitialMotionPermission(): MotionPermission {
  if (typeof window === "undefined") return "prompt";
  if (!("DeviceMotionEvent" in window)) return "unsupported";

  const motionEvent = DeviceMotionEvent as typeof DeviceMotionEvent & {
    requestPermission?: () => Promise<"granted" | "denied">;
  };

  if (typeof motionEvent.requestPermission === "function") {
    return "prompt";
  }

  return "granted";
}
