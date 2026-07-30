"use client";

import { Gauge } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { MovementKind } from "@/types/geo";

import { WALK_SPEED_MAX_KMH } from "../constants";

type SpeedMeterProps = {
  instantSpeedKmh: number | null;
  averageSpeedKmh: number | null;
  kind: MovementKind;
  className?: string;
};

const KIND_LABEL: Record<MovementKind, string> = {
  walking: "徒歩（有効）",
  excluded: "乗り物・高速（除外）",
  unknown: "判定中…",
};

const KIND_STYLE: Record<MovementKind, string> = {
  walking: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:text-emerald-300",
  excluded: "bg-rose-500/15 text-rose-700 ring-rose-500/30 dark:text-rose-300",
  unknown: "bg-zinc-500/15 text-zinc-700 ring-zinc-500/30 dark:text-zinc-300",
};

function formatSpeed(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return "—";
  return value.toFixed(1);
}

export function SpeedMeter({
  instantSpeedKmh,
  averageSpeedKmh,
  kind,
  className,
}: SpeedMeterProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-500">
        <Gauge className="size-4" aria-hidden />
        速度フィルタ（閾値 {WALK_SPEED_MAX_KMH} km/h 未満 = 徒歩）
      </div>

      <div
        className={cn(
          "mb-5 rounded-xl px-4 py-3 text-center text-lg font-semibold ring-1 ring-inset",
          KIND_STYLE[kind],
        )}
      >
        {KIND_LABEL[kind]}
      </div>

      <dl className="grid grid-cols-2 gap-4 text-center">
        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">瞬間時速</dt>
          <dd className="mt-1 font-mono text-3xl font-semibold tabular-nums">
            {formatSpeed(instantSpeedKmh)}
            <span className="ml-1 text-base font-normal text-zinc-500">
              km/h
            </span>
          </dd>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">移動平均</dt>
          <dd className="mt-1 font-mono text-3xl font-semibold tabular-nums">
            {formatSpeed(averageSpeedKmh)}
            <span className="ml-1 text-base font-normal text-zinc-500">
              km/h
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
