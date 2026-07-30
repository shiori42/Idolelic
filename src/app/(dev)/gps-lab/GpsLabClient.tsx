"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Play, RotateCcw, Square } from "lucide-react";

import { GpsStatusPanel } from "@/features/geolocation/components/GpsStatusPanel";
import { useGeolocationEnvironment } from "@/features/geolocation/hooks/useGeolocationEnvironment";
import { useGeolocationWatcher } from "@/features/geolocation/hooks/useGeolocationWatcher";
import { StepCounterPanel } from "@/features/pedometer/components/StepCounterPanel";
import { useAccelerometerSteps } from "@/features/pedometer/hooks/useAccelerometerSteps";
import { useStepValidation } from "@/features/pedometer/hooks/useStepValidation";
import { shouldCountAccelerometerSteps } from "@/lib/pedometer";
import { SpeedMeter } from "@/features/speed-filter/components/SpeedMeter";
import { useSpeedFilter } from "@/features/speed-filter/hooks/useSpeedFilter";
import { cn } from "@/lib/utils/cn";

export function GpsLabClient() {
  const geoEnv = useGeolocationEnvironment();
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

  const startDisabled = !geoEnv.canStart || geo.isRequesting;

  const handleToggle = async () => {
    if (geo.isWatching) {
      geo.stop();
      setSessionActive(false);
      return;
    }

    const motionOk = await steps.requestPermission();
    if (!motionOk && steps.permission === "denied") {
      // GPS のみでも計測は続行
    }

    geo.start();
    setSessionActive(true);
  };

  const handleReset = () => {
    geo.reset();
    steps.reset();
    setSessionActive(false);
  };

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col gap-6 px-4 py-8">
      <header className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          Phase 0 MVP
        </p>
        <h1 className="text-2xl font-bold tracking-tight">GPS Lab</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          位置・時速・歩数（GPS
          整合チェック）を実機で検証します。振り子などの不正は自動除外します。
        </p>
      </header>

      {geoEnv.insecureContext && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="font-semibold">
            スマホでは HTTP では位置情報を使えません（正常な制限です）
          </p>
          <p className="mt-2 leading-relaxed">
            現在の接続:{" "}
            <span className="break-all font-mono">{geoEnv.pageOrigin}</span>
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed text-amber-900/90 dark:text-amber-200/90">
            <li>
              PC で dev を止め、
              <span className="font-mono"> npm run dev:mobile </span>
              を実行
            </li>
            <li>
              ターミナルに表示される{" "}
              <span className="font-mono">https://192.168.x.x:3000/gps-lab</span>
              をそのままスマホで開く
            </li>
            <li>「計測開始」→ 位置情報とモーションを「許可」</li>
          </ol>
          <div className="mt-3 rounded-lg bg-amber-100/80 px-3 py-2 text-xs leading-relaxed dark:bg-amber-900/30">
            <p className="font-semibold">接続が切れるとき</p>
            <p className="mt-1">
              ターミナル1: <span className="font-mono">npm run dev</span> /
              ターミナル2: <span className="font-mono">npm run dev:tunnel</span>
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleToggle}
          disabled={startDisabled}
          className={cn(
            "inline-flex min-h-12 flex-1 touch-manipulation items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors active:scale-[0.98]",
            startDisabled
              ? "cursor-not-allowed bg-zinc-400"
              : geo.isWatching
                ? "bg-zinc-700 hover:bg-zinc-600"
                : "bg-sky-600 hover:bg-sky-500",
          )}
        >
          {geo.isRequesting ? (
            <>許可を待っています…</>
          ) : geo.isWatching ? (
            <>
              <Square className="size-4 shrink-0" aria-hidden />
              停止
            </>
          ) : (
            <>
              <Play className="size-4 shrink-0" aria-hidden />
              計測開始
            </>
          )}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="inline-flex min-h-12 min-w-12 touch-manipulation items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium transition-colors hover:bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-900"
          aria-label="リセット"
        >
          <RotateCcw className="size-4 shrink-0" aria-hidden />
        </button>
      </div>

      <GpsStatusPanel
        status={geo.status}
        errorCode={geo.errorCode}
        latestSample={geo.latestSample}
        sampleCount={geo.samples.length}
      />

      <SpeedMeter
        instantSpeedKmh={speed.instantSpeedKmh}
        averageSpeedKmh={speed.averageSpeedKmh}
        kind={speed.kind}
      />

      <StepCounterPanel
        validation={stepValidation}
        motionPermission={steps.permission}
        isCounting={steps.isCounting}
      />

      <p className="text-center text-xs leading-relaxed text-zinc-500">
        区間数: {speed.segmentCount}
        {geoEnv.pageOrigin ? ` · 接続: ${geoEnv.pageOrigin}` : null}
      </p>

      <Link
        href="/"
        className="text-center text-sm text-zinc-500 underline-offset-4 hover:underline"
      >
        ホームに戻る
      </Link>
    </div>
  );
}
