import type { MockSpot } from "@/data/mock-spots";
import { haversineDistanceMeters } from "@/lib/geo/haversine";
import type { GoogleMapsTourTravelMode } from "@/lib/spots/google-maps";

export type WorkTour = {
  group: string;
  workTitle: string;
  spots: MockSpot[];
};

const WALKING_MAX_METERS = 8_000;

function hasCoords(spot: MockSpot) {
  return (
    typeof spot.latitude === "number" &&
    Number.isFinite(spot.latitude) &&
    typeof spot.longitude === "number" &&
    Number.isFinite(spot.longitude)
  );
}

export function encodeWorkTourId(group: string, workTitle: string) {
  return `${group}::${workTitle}`;
}

export function decodeWorkTourId(id: string) {
  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch {
    decoded = id;
  }
  const idx = decoded.indexOf("::");
  if (idx <= 0 || idx >= decoded.length - 2) return null;
  const group = decoded.slice(0, idx).trim();
  const workTitle = decoded.slice(idx + 2).trim();
  if (!group || !workTitle) return null;
  return { group, workTitle };
}

export function groupSpotsByWork(spots: MockSpot[]): WorkTour[] {
  const map = new Map<string, WorkTour>();
  for (const spot of spots) {
    const group = spot.group.trim();
    const workTitle = spot.workTitle.trim();
    if (!group || !workTitle) continue;
    const key = `${group}::${workTitle}`;
    const existing = map.get(key);
    if (existing) {
      existing.spots.push(spot);
    } else {
      map.set(key, { group, workTitle, spots: [spot] });
    }
  }

  return [...map.values()].sort((a, b) => {
    if (b.spots.length !== a.spots.length) return b.spots.length - a.spots.length;
    const groupCmp = a.group.localeCompare(b.group, "ja");
    if (groupCmp !== 0) return groupCmp;
    return a.workTitle.localeCompare(b.workTitle, "ja");
  });
}

/** 曲名・グループ名でタイトル巡礼一覧を絞り込む */
export function filterWorkTours(tours: WorkTour[], query: string): WorkTour[] {
  const q = query.trim().toLowerCase();
  if (!q) return tours;
  return tours.filter(
    (tour) =>
      tour.workTitle.toLowerCase().includes(q) ||
      tour.group.toLowerCase().includes(q),
  );
}

export function findWorkTour(
  spots: MockSpot[],
  group: string,
  workTitle: string,
): WorkTour | null {
  const matched = spots.filter(
    (spot) => spot.group === group && spot.workTitle === workTitle,
  );
  if (matched.length === 0) return null;
  return { group, workTitle, spots: matched };
}

/** 先頭の聖地から近い順に辿る（座標なしは末尾） */
export function orderTourSpots(spots: MockSpot[]): MockSpot[] {
  const withCoords = spots.filter(hasCoords);
  const withoutCoords = spots.filter((spot) => !hasCoords(spot));
  if (withCoords.length <= 2) return [...withCoords, ...withoutCoords];

  const remaining = [...withCoords];
  const ordered: MockSpot[] = [remaining.shift()!];
  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    remaining.forEach((spot, index) => {
      const distance = haversineDistanceMeters(
        { latitude: last.latitude!, longitude: last.longitude! },
        { latitude: spot.latitude!, longitude: spot.longitude! },
      );
      if (distance < bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    });
    ordered.push(remaining.splice(bestIndex, 1)[0]);
  }
  return [...ordered, ...withoutCoords];
}

export function suggestTourTravelMode(
  spots: MockSpot[],
): Exclude<GoogleMapsTourTravelMode, "transit"> {
  const coords = spots.filter(hasCoords);
  if (coords.length < 2) return "walking";

  let maxMeters = 0;
  for (let i = 0; i < coords.length; i += 1) {
    for (let j = i + 1; j < coords.length; j += 1) {
      const meters = haversineDistanceMeters(
        { latitude: coords[i].latitude!, longitude: coords[i].longitude! },
        { latitude: coords[j].latitude!, longitude: coords[j].longitude! },
      );
      if (meters > maxMeters) maxMeters = meters;
    }
  }
  return maxMeters > WALKING_MAX_METERS ? "driving" : "walking";
}
