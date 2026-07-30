import { haversineDistanceMeters } from "@/lib/geo/haversine";
import type { GeoCoordinate } from "@/types/geo";

export type WalkingRoute = {
  coordinates: GeoCoordinate[];
  distanceMeters: number;
  durationSeconds: number;
};

/** 徒歩の想定時速（到着目安の計算に使う） */
export const WALKING_SPEED_KMH = 4.5;

const OSRM_FOOT_URL = "https://router.project-osrm.org/route/v1/foot";

type OsrmResponse = {
  code?: string;
  routes?: Array<{
    distance: number;
    duration: number;
    geometry?: {
      coordinates?: [number, number][];
    };
  }>;
};

export function estimateWalkingDurationSeconds(distanceMeters: number) {
  if (!Number.isFinite(distanceMeters) || distanceMeters <= 0) return 0;
  return (distanceMeters / 1000 / WALKING_SPEED_KMH) * 3600;
}

/**
 * OSRM 公開エンドポイントで徒歩ルートを取得。
 * 失敗時は null（呼び出し側で直線フォールバック）。
 * ※公開 OSRM の duration は信用せず、距離から徒歩速度で再計算する。
 */
export async function fetchWalkingRoute(
  from: GeoCoordinate,
  to: GeoCoordinate,
  signal?: AbortSignal,
): Promise<WalkingRoute | null> {
  const path = `${from.longitude},${from.latitude};${to.longitude},${to.latitude}`;
  const url = `${OSRM_FOOT_URL}/${path}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) return null;

    const data = (await response.json()) as OsrmResponse;
    const route = data.routes?.[0];
    const coords = route?.geometry?.coordinates;
    if (!route || !coords || coords.length < 2) return null;

    return {
      distanceMeters: route.distance,
      durationSeconds: estimateWalkingDurationSeconds(route.distance),
      coordinates: coords.map(([longitude, latitude]) => ({
        latitude,
        longitude,
      })),
    };
  } catch {
    return null;
  }
}

export function straightRoute(
  from: GeoCoordinate,
  to: GeoCoordinate,
): WalkingRoute {
  const distanceMeters = haversineDistanceMeters(from, to);
  return {
    coordinates: [from, to],
    distanceMeters,
    durationSeconds: estimateWalkingDurationSeconds(distanceMeters),
  };
}

/** ルート上の最寄り点以降の残り距離（メートル） */
export function remainingRouteDistanceMeters(
  route: GeoCoordinate[],
  current: GeoCoordinate,
): number {
  if (route.length < 2) {
    return route[0] ? haversineDistanceMeters(current, route[0]) : 0;
  }

  let nearestIndex = 0;
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < route.length; i += 1) {
    const d = haversineDistanceMeters(current, route[i]);
    if (d < nearestDistance) {
      nearestDistance = d;
      nearestIndex = i;
    }
  }

  let remaining = nearestDistance;
  for (let i = nearestIndex; i < route.length - 1; i += 1) {
    remaining += haversineDistanceMeters(route[i], route[i + 1]);
  }
  return remaining;
}

export function formatDistanceMeters(meters: number) {
  if (!Number.isFinite(meters) || meters < 0) return "—";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(meters < 10000 ? 2 : 1)} km`;
}

export function formatDurationSeconds(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const minutes = Math.max(1, Math.round(seconds / 60));
  if (minutes < 60) return `約 ${minutes} 分`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest > 0 ? `約 ${hours} 時間 ${rest} 分` : `約 ${hours} 時間`;
}

/** 到着判定（GPS 誤差を考慮） */
export const ARRIVAL_RADIUS_METERS = 45;
