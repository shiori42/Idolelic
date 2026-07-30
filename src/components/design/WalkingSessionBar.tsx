"use client";

import { useGeolocationEnvironment } from "@/features/geolocation/hooks/useGeolocationEnvironment";
import { useWalkingSession } from "@/features/walking-session";
import { cn } from "@/lib/utils/cn";

export function GeoWarningBanner() {
  const env = useGeolocationEnvironment();

  if (!env.insecureContext) return null;

  return (
    <div className="mock-banner-warn text-sm">
      <p className="font-semibold">HTTPS が必要です</p>
      <p className="mt-1 text-xs leading-relaxed">
        スマホでは <span className="font-mono">npm run dev:mobile</span> または{" "}
        <span className="font-mono">npm run dev:tunnel</span> で開いてください。
      </p>
    </div>
  );
}

type WalkingSessionBarProps = {
  compact?: boolean;
};

export function WalkingSessionBar({ compact = false }: WalkingSessionBarProps) {
  const env = useGeolocationEnvironment();
  const {
    isWatching,
    isRequesting,
    sessionActive,
    geoErrorCode,
    toggle,
    reset,
  } = useWalkingSession();

  const startDisabled = !env.canStart || isRequesting;

  return (
    <div className={cn("mock-session-bar", compact && "mock-session-bar-compact")}>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[var(--mock-muted)]">GPS 計測</p>
        <p className="mt-0.5 text-sm font-medium">
          {isRequesting
            ? "許可を待っています…"
            : isWatching
              ? "計測中"
              : geoErrorCode === "INSECURE_CONTEXT"
                ? "HTTPS で接続してください"
                : geoErrorCode === "PERMISSION_DENIED"
                  ? "位置情報が拒否されました"
                  : "停止中"}
        </p>
      </div>
      <div className="flex shrink-0 gap-2">
        {sessionActive ? (
          <button
            type="button"
            className="mock-btn mock-btn-secondary !w-auto px-4 py-2 text-xs"
            onClick={reset}
          >
            リセット
          </button>
        ) : null}
        <button
          type="button"
          className={cn(
            "mock-btn !w-auto px-4 py-2 text-xs",
            isWatching ? "mock-btn-secondary" : "mock-btn-primary",
            startDisabled && "opacity-50",
          )}
          disabled={startDisabled}
          onClick={toggle}
        >
          {isWatching ? "停止" : "計測開始"}
        </button>
      </div>
    </div>
  );
}
