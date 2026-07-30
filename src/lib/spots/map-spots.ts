import type { MockSpot } from "@/data/mock-spots";

export type MapSpot = MockSpot & {
  latitude: number;
  longitude: number;
};

export function isMapSpot(spot: MockSpot): spot is MapSpot {
  return (
    typeof spot.latitude === "number" &&
    typeof spot.longitude === "number" &&
    Number.isFinite(spot.latitude) &&
    Number.isFinite(spot.longitude)
  );
}

export function toMapSpots(spots: MockSpot[]): MapSpot[] {
  return spots.filter(isMapSpot);
}

/** 東京周辺 — 絞り込み結果が空のときの初期表示 */
export const DEFAULT_MAP_CENTER: [number, number] = [35.6812, 139.7671];
export const DEFAULT_MAP_ZOOM = 11;
