type GoogleMapsPoint = {
  latitude?: number;
  longitude?: number;
  address: string;
};

export type GoogleMapsTravelMode = "walking" | "transit";

export type GoogleMapsTourTravelMode = "walking" | "driving" | "transit";

/** スマホの Google マップは経由地 3 + 目的地 1 = 最大 4 か所 */
export const GOOGLE_MAPS_MOBILE_MAX_STOPS = 4;
export const GOOGLE_MAPS_MOBILE_MAX_WAYPOINTS =
  GOOGLE_MAPS_MOBILE_MAX_STOPS - 1;

function hasCoords(point: GoogleMapsPoint) {
  return (
    typeof point.latitude === "number" &&
    Number.isFinite(point.latitude) &&
    typeof point.longitude === "number" &&
    Number.isFinite(point.longitude)
  );
}

export function pointToMapsQuery(point: GoogleMapsPoint) {
  if (hasCoords(point)) {
    return `${point.latitude},${point.longitude}`;
  }
  return point.address.trim();
}

export function buildGoogleMapsDirectionsUrl(
  destination: GoogleMapsPoint,
  travelMode: GoogleMapsTravelMode = "walking",
) {
  const params = new URLSearchParams({
    api: "1",
    destination: pointToMapsQuery(destination),
    travelmode: travelMode,
  });

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

function usableTourPoints(points: GoogleMapsPoint[]) {
  return points.filter((point) => hasCoords(point) || point.address.trim());
}

/**
 * 複数聖地を 1 本のルートにする。
 * 徒歩・車は経由地あり。電車は経由地非対応のため目的地のみ。
 * origin を省略すると、端末の現在地が出発になる。
 */
export function buildGoogleMapsTourUrl(
  points: GoogleMapsPoint[],
  options?: {
    travelMode?: GoogleMapsTourTravelMode;
    origin?: string;
  },
): string | null {
  const usable = usableTourPoints(points);
  if (usable.length === 0) return null;

  const travelMode = options?.travelMode ?? "walking";
  const origin = options?.origin?.trim() ?? "";

  if (travelMode === "transit" || usable.length === 1) {
    const params = new URLSearchParams({
      api: "1",
      destination: pointToMapsQuery(usable[usable.length - 1]),
      travelmode: travelMode,
    });
    if (origin) params.set("origin", origin);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  const capped = usable.slice(0, GOOGLE_MAPS_MOBILE_MAX_STOPS);
  const destination = capped[capped.length - 1];
  const waypoints = capped.slice(0, -1);

  const params = new URLSearchParams({
    api: "1",
    destination: pointToMapsQuery(destination),
    travelmode: travelMode,
  });
  if (origin) params.set("origin", origin);
  if (waypoints.length > 0) {
    params.set(
      "waypoints",
      waypoints.map((point) => pointToMapsQuery(point)).join("|"),
    );
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
}
