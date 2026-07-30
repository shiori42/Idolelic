"use client";

import { AlertCircle, MapPin, Satellite } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { GeoSample } from "@/types/geo";

import type {
  GeolocationErrorCode,
  GeolocationStatus,
} from "../types";

const ERROR_MESSAGES: Record<GeolocationErrorCode, string> = {
  PERMISSION_DENIED:
    "位置情報の利用が拒否されました。ブラウザの設定でこのサイトへの位置情報を許可してください。",
  POSITION_UNAVAILABLE: "位置を取得できませんでした。GPS をオンにしてください。",
  TIMEOUT: "位置情報の取得がタイムアウトしました。屋外で再試行してください。",
  UNSUPPORTED: "このブラウザは位置情報 API に対応していません。",
  INSECURE_CONTEXT:
    "HTTP では位置情報を使えません。PC の IP ではなく localhost 経由か、HTTPS で開いてください（下記の手順参照）。",
  UNKNOWN: "不明なエラーが発生しました。",
};

type GpsStatusPanelProps = {
  status: GeolocationStatus;
  errorCode: GeolocationErrorCode | null;
  latestSample: GeoSample | null;
  sampleCount: number;
  className?: string;
};

function formatCoord(value: number | undefined): string {
  if (value === undefined || !Number.isFinite(value)) return "—";
  return value.toFixed(6);
}

export function GpsStatusPanel({
  status,
  errorCode,
  latestSample,
  sampleCount,
  className,
}: GpsStatusPanelProps) {
  const statusLabel =
    status === "watching"
      ? "取得中"
      : status === "requesting"
        ? "許可待ち…"
        : status === "error"
          ? "エラー"
          : "停止中";

  return (
    <section
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-950",
        className,
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
          <Satellite className="size-4" aria-hidden />
          GPS 状態
        </div>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            status === "watching" && "bg-sky-500/15 text-sky-700 dark:text-sky-300",
            status === "requesting" &&
              "bg-amber-500/15 text-amber-800 dark:text-amber-300",
            status === "idle" && "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400",
            status === "error" && "bg-rose-500/15 text-rose-700 dark:text-rose-300",
          )}
        >
          {statusLabel}
        </span>
      </div>

      {status === "error" && errorCode && (
        <div className="mb-4 flex gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-200">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <p>{ERROR_MESSAGES[errorCode]}</p>
        </div>
      )}

      <dl className="space-y-3 text-sm">
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-400" aria-hidden />
          <div className="grid flex-1 grid-cols-2 gap-x-4 gap-y-1 font-mono tabular-nums">
            <div>
              <dt className="text-xs text-zinc-500">緯度</dt>
              <dd>{formatCoord(latestSample?.latitude)}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">経度</dt>
              <dd>{formatCoord(latestSample?.longitude)}</dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">精度</dt>
              <dd>
                {latestSample?.accuracy !== undefined
                  ? `${latestSample.accuracy.toFixed(0)} m`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-zinc-500">サンプル数</dt>
              <dd>{sampleCount}</dd>
            </div>
          </div>
        </div>
      </dl>
    </section>
  );
}
