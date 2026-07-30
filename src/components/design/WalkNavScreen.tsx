"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  GeoWarningBanner,
  WalkingSessionBar,
} from "@/components/design/WalkingSessionBar";
import { MOCK_WALK_NAV } from "@/data/mock-spots";
import { useUserSpots } from "@/features/user-spots";
import { useWalkingSession } from "@/features/walking-session";
import {
  ARRIVAL_RADIUS_METERS,
  estimateWalkingDurationSeconds,
  fetchWalkingRoute,
  formatDistanceMeters,
  formatDurationSeconds,
  haversineDistanceMeters,
  remainingRouteDistanceMeters,
  straightRoute,
  type WalkingRoute,
} from "@/lib/geo";
import { buildGoogleMapsDirectionsUrl } from "@/lib/spots/google-maps";
import { findSpotById } from "@/lib/spots-helpers";
import { cn } from "@/lib/utils/cn";

import { MockCard } from "./mock-ui";

const WalkNavMap = dynamic(
  () =>
    import("@/components/design/WalkNavMap").then((mod) => mod.WalkNavMap),
  {
    ssr: false,
    loading: () => (
      <div className="walk-nav-map-shell walk-nav-map-loading">地図を準備中…</div>
    ),
  },
);

const WALK_MODES = [
  { id: "walking", label: "徒歩" },
  { id: "transit", label: "電車＋徒歩" },
] as const;

type WalkMode = (typeof WALK_MODES)[number]["id"];

const MODE_DESC: Record<WalkMode, string> = {
  walking: "アプリ内で徒歩ルートを表示し、歩数を計測しながら案内します",
  transit:
    "電車区間は Google Maps が正確です。ここでは徒歩ルートの目安と歩数計測が使えます",
};

function formatCoords(lat: number, lng: number) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

export function WalkNavScreen() {
  const searchParams = useSearchParams();
  const spotId = searchParams.get("spot");
  const modeParam = searchParams.get("mode");
  const { communitySpots } = useUserSpots();
  const spot = spotId ? findSpotById(spotId, communitySpots) : null;
  const destinationName = spot?.name ?? MOCK_WALK_NAV.destination;

  const {
    effectiveSteps,
    movementLabel,
    latestSample,
    sampleCount,
    sessionActive,
    isWatching,
    speed,
    toggle,
  } = useWalkingSession();

  const initialMode: WalkMode =
    modeParam === "transit" ? "transit" : "walking";
  const [mode, setMode] = useState<WalkMode>(initialMode);
  const [previewNight, setPreviewNight] = useState(false);
  const [route, setRoute] = useState<WalkingRoute | null>(null);
  const [routeStatus, setRouteStatus] = useState<
    "idle" | "loading" | "ready" | "fallback" | "error"
  >("idle");
  const [routeSourceLabel, setRouteSourceLabel] = useState("");

  const isNight = useMemo(() => {
    const hour = new Date().getHours();
    return hour >= 23 || previewNight;
  }, [previewNight]);

  const showWbgtLock = MOCK_WALK_NAV.wbgt >= 31 && mode === "walking";

  const destination =
    spot &&
    typeof spot.latitude === "number" &&
    typeof spot.longitude === "number"
      ? {
          latitude: spot.latitude,
          longitude: spot.longitude,
          name: spot.name,
        }
      : null;

  const userPosition = latestSample
    ? {
        latitude: latestSample.latitude,
        longitude: latestSample.longitude,
      }
    : null;

  // 現在地が取れたら徒歩ルート取得（座標の丸めで過剰再取得を抑制）
  const routeOriginKey = userPosition
    ? `${userPosition.latitude.toFixed(4)},${userPosition.longitude.toFixed(4)}`
    : null;
  const routeDestKey = destination
    ? `${destination.latitude.toFixed(4)},${destination.longitude.toFixed(4)}`
    : null;

  useEffect(() => {
    if (!userPosition || !destination || !routeOriginKey || !routeDestKey) {
      setRoute(null);
      setRouteStatus("idle");
      setRouteSourceLabel("");
      return;
    }

    const from = userPosition;
    const to = destination;
    const controller = new AbortController();
    let cancelled = false;

    async function loadRoute() {
      setRouteStatus((prev) => (prev === "ready" || prev === "fallback" ? prev : "loading"));
      const walking = await fetchWalkingRoute(from, to, controller.signal);
      if (cancelled) return;

      if (walking) {
        setRoute(walking);
        setRouteStatus("ready");
        setRouteSourceLabel("徒歩ルート（OSRM）");
        return;
      }

      const fallback = straightRoute(from, to);
      setRoute(fallback);
      setRouteStatus("fallback");
      setRouteSourceLabel("直線距離（ルート取得失敗）");
    }

    void loadRoute();
    const timer = window.setInterval(() => {
      void loadRoute();
    }, 25_000);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearInterval(timer);
    };
    // routeOriginKey / routeDestKey で位置変化を間引く
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeOriginKey, routeDestKey]);

  const remainingMeters = useMemo(() => {
    if (!userPosition || !destination) return null;
    if (route && route.coordinates.length >= 2) {
      return remainingRouteDistanceMeters(route.coordinates, userPosition);
    }
    return haversineDistanceMeters(userPosition, destination);
  }, [userPosition, destination, route]);

  const arrived =
    remainingMeters !== null && remainingMeters <= ARRIVAL_RADIUS_METERS;

  const etaLabel =
    remainingMeters !== null
      ? formatDurationSeconds(estimateWalkingDurationSeconds(remainingMeters))
      : "—";

  const speedColor =
    speed.kind === "walking"
      ? "text-[var(--mock-accent-mint)]"
      : speed.kind === "excluded"
        ? "text-[var(--mock-danger)]"
        : "text-[var(--mock-muted)]";

  return (
    <div className={cn(isNight && "mock-walk-night")}>
      <GeoWarningBanner />
      <WalkingSessionBar compact />

      <div className="mock-mode-tabs">
        {WALK_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            className={cn(
              "mock-mode-tab",
              mode === m.id && "mock-mode-tab-active",
            )}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-[var(--mock-muted)]">{MODE_DESC[mode]}</p>

      {mode === "transit" ? (
        <div className="mock-banner-warn text-sm">
          <p className="font-semibold">電車区間は Google Maps を推奨</p>
          <p className="mt-1 text-xs leading-relaxed">
            アプリ内は徒歩ルートの目安表示です。乗換案内は下の Google Maps
            ボタンから開けます。
          </p>
        </div>
      ) : null}

      {showWbgtLock ? (
        <div className="mock-banner-wbgt">
          <p className="font-semibold">
            WBGT {MOCK_WALK_NAV.wbgt}℃ — 遠回りロック
          </p>
          <p className="mt-1 text-xs">
            31℃以上です。休憩と水分補給を取りながら移動してください
          </p>
        </div>
      ) : null}

      {isNight ? (
        <>
          <div className="mock-banner-night">
            23時以降 — 街灯優先ナビに自動切替
          </div>
          <div className="mock-streetlight-hint">
            <span aria-hidden>💡</span>
            明るい道路を優先して案内中
          </div>
        </>
      ) : (
        <button
          type="button"
          className="text-xs font-medium text-[var(--mock-brand)]"
          onClick={() => setPreviewNight(true)}
        >
          夜間UIをプレビュー（23時以降の見た目）
        </button>
      )}

      {arrived ? (
        <div className="mock-banner-ok text-sm">
          <p className="font-semibold">目的地付近に到着しました</p>
          <p className="mt-1 text-xs">聖地までおよそ {ARRIVAL_RADIUS_METERS} m 以内です</p>
        </div>
      ) : null}

      <WalkNavMap
        userPosition={userPosition}
        destination={destination}
        routeCoordinates={route?.coordinates ?? []}
      />

      <div className="mock-stat-grid">
        <div className="mock-stat">
          <p className="mock-stat-label">残り距離</p>
          <p className="mock-stat-value text-base">
            {remainingMeters !== null
              ? formatDistanceMeters(remainingMeters)
              : "—"}
          </p>
        </div>
        <div className="mock-stat">
          <p className="mock-stat-label">到着目安</p>
          <p className="mock-stat-value text-base">{etaLabel}</p>
        </div>
      </div>

      <MockCard pad>
        <p className="text-xs text-[var(--mock-muted)]">現在地（GPS）</p>
        {latestSample ? (
          <>
            <p className="mt-0.5 font-mono text-sm font-semibold">
              {formatCoords(latestSample.latitude, latestSample.longitude)}
            </p>
            <p className="mt-1 text-xs text-[var(--mock-muted)]">
              精度 ±{Math.round(latestSample.accuracy ?? 0)} m · サンプル{" "}
              {sampleCount}
            </p>
          </>
        ) : (
          <p className="mt-0.5 text-sm font-medium">
            {sessionActive ? "GPS 取得中…" : "計測開始で現在地とルートを表示"}
          </p>
        )}
        {routeStatus === "loading" ? (
          <p className="mt-2 text-xs text-[var(--mock-brand)]">ルート計算中…</p>
        ) : null}
        {routeSourceLabel ? (
          <p className="mt-1 text-[0.625rem] text-[var(--mock-muted)]">
            {routeSourceLabel}
            {route ? ` · 全長 ${formatDistanceMeters(route.distanceMeters)}` : ""}
          </p>
        ) : null}
      </MockCard>

      <MockCard pad>
        <p className="text-xs text-[var(--mock-muted)]">目的地</p>
        <p className="mt-0.5 font-semibold">{destinationName}</p>
        {spot?.address ? (
          <p className="mt-1 text-xs text-[var(--mock-muted)]">{spot.address}</p>
        ) : null}
        {spot?.source === "community" ? (
          <p className="mt-1 text-xs font-medium text-[var(--mock-brand)]">
            みんなの聖地 · {spot.submittedBy}
          </p>
        ) : spot ? (
          <p className="mt-1 text-[0.625rem] text-[var(--mock-muted)]">公式データ</p>
        ) : (
          <p className="mt-1 text-xs text-[var(--mock-muted)]">
            聖地を選ぶと目的地ピンとルートが表示されます
          </p>
        )}
        {spot ? (
          <>
            <a
              href={buildGoogleMapsDirectionsUrl(spot, mode)}
              target="_blank"
              rel="noopener noreferrer"
              className="mock-btn mock-btn-secondary mt-4"
            >
              Google Mapsで
              {mode === "walking" ? "徒歩" : "電車＋徒歩"}
              案内を開く
            </a>
            <p className="mt-2 text-xs leading-relaxed text-[var(--mock-muted)]">
              歩数計測は、この画面を開いたまま「計測開始」してください。Google
              Maps に切り替えると計測が止まります。
            </p>
          </>
        ) : null}
      </MockCard>

      <div className="mock-stat-grid">
        <div className="mock-stat">
          <p className="mock-stat-label">時速判定</p>
          <p className={cn("mt-1 text-sm font-semibold", speedColor)}>
            {sessionActive ? movementLabel : "計測停止中"}
          </p>
        </div>
        <div className="mock-stat">
          <p className="mock-stat-label">有効歩数</p>
          <p className="mock-stat-value text-base">
            {effectiveSteps.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          className="mock-btn mock-btn-secondary flex-1"
          onClick={() => void toggle()}
        >
          {isWatching ? "一時停止" : "計測再開"}
        </button>
        <a href="tel:110" className="mock-sos-btn" aria-label="緊急SOS">
          SOS
        </a>
      </div>
    </div>
  );
}
