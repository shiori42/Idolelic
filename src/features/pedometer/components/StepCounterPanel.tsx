"use client";

import { Footprints, ShieldAlert, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { DEFAULT_STRIDE_LENGTH_M } from "@/lib/pedometer";
import type { StepValidationResult } from "@/types/pedometer";

import type { MotionPermission } from "../hooks/useAccelerometerSteps";

const STATUS_LABEL: Record<StepValidationResult["status"], string> = {
  ok: "有効（GPSと整合）",
  insufficient_data: "データ収集中…",
  excluded_movement: "乗り物移動のため歩数無効",
  shake_detected: "除外：振り子・据え置き疑い",
  capped_by_gps: "除外：GPS距離と歩数が不整合",
};

const STATUS_STYLE: Record<StepValidationResult["status"], string> = {
  ok: "bg-emerald-500/15 text-emerald-800 ring-emerald-500/30 dark:text-emerald-300",
  insufficient_data:
    "bg-zinc-500/15 text-zinc-700 ring-zinc-500/30 dark:text-zinc-300",
  excluded_movement:
    "bg-rose-500/15 text-rose-800 ring-rose-500/30 dark:text-rose-300",
  shake_detected:
    "bg-amber-500/15 text-amber-900 ring-amber-500/30 dark:text-amber-200",
  capped_by_gps:
    "bg-amber-500/15 text-amber-900 ring-amber-500/30 dark:text-amber-200",
};

type StepCounterPanelProps = {
  validation: StepValidationResult;
  motionPermission: MotionPermission;
  /** GPS 上で移動中のみセンサーが生歩数を増やす */
  isCounting: boolean;
  className?: string;
};

function formatMeters(m: number): string {
  if (m < 1000) return `${m.toFixed(0)} m`;
  return `${(m / 1000).toFixed(2)} km`;
}

export function StepCounterPanel({
  validation,
  motionPermission,
  isCounting,
  className,
}: StepCounterPanelProps) {
  const isOk = validation.status === "ok";

  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-500">
        <Footprints className="size-4" aria-hidden />
        歩数（加速度 + GPS 整合チェック）
      </div>

      {motionPermission === "unsupported" && (
        <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">
          この端末／ブラウザでは加速度センサーが使えません。
        </p>
      )}
      {motionPermission === "denied" && (
        <p className="mb-3 text-sm text-amber-800 dark:text-amber-200">
          モーションセンサーが拒否されています。ブラウザ設定から許可してください。
        </p>
      )}
      {motionPermission === "granted" && !isCounting && (
        <p className="mb-3 text-sm text-sky-800 dark:text-sky-200">
          その場での振りは検知中 — 生歩数は増えません。実際に歩くとカウントが始まります。
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">生歩数（センサー）</p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">
            {validation.rawSteps}
          </p>
        </div>
        <div className="rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <p className="text-xs text-zinc-500">有効歩数</p>
          <p className="mt-1 font-mono text-3xl font-semibold tabular-nums text-sky-700 dark:text-sky-300">
            {validation.validatedSteps}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">GPS 移動距離</dt>
          <dd className="font-mono font-medium">
            {formatMeters(validation.gpsDistanceMeters)}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">歩数換算距離</dt>
          <dd className="font-mono font-medium">
            {formatMeters(validation.impliedDistanceMeters)}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">距離比率 (GPS/歩数)</dt>
          <dd className="font-mono font-medium">
            {validation.distanceRatio !== null
              ? validation.distanceRatio.toFixed(2)
              : "—"}
          </dd>
        </div>
        <div className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-900">
          <dt className="text-xs text-zinc-500">除外歩数</dt>
          <dd className="font-mono font-medium text-amber-700 dark:text-amber-300">
            {validation.rejectedSteps}
          </dd>
        </div>
      </dl>

      <div
        className={cn(
          "mt-4 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ring-1 ring-inset",
          STATUS_STYLE[validation.status],
        )}
      >
        {isOk ? (
          <ShieldCheck className="size-4 shrink-0" aria-hidden />
        ) : (
          <ShieldAlert className="size-4 shrink-0" aria-hidden />
        )}
        {STATUS_LABEL[validation.status]}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-zinc-500">
        想定歩幅 {DEFAULT_STRIDE_LENGTH_M} m。GPS
        の直線移動がない揺れはセンサー停止＋有効歩数 0 になります。
      </p>
    </section>
  );
}
