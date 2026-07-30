"use client";

import { useMemo } from "react";

import { evaluateSpeedFilter } from "@/lib/geo";
import type { GeoSample, SpeedFilterResult } from "@/types/geo";

const EMPTY_RESULT: SpeedFilterResult = {
  kind: "unknown",
  instantSpeedKmh: null,
  averageSpeedKmh: null,
  segmentCount: 0,
};

export function useSpeedFilter(samples: GeoSample[]): SpeedFilterResult {
  return useMemo(() => {
    if (samples.length < 2) return EMPTY_RESULT;
    return evaluateSpeedFilter(samples);
  }, [samples]);
}
