import {
  MOCK_REGIONS,
  type MockRegion,
  type MockSpot,
} from "@/data/mock-spots";
import { FALLBACK_OFFICIAL_SPOTS } from "@/lib/spots/fetch-official-spots";

import type { SpotsFilterState } from "./spots-filter";

export const ALL_PREFECTURES = Object.values(MOCK_REGIONS).flat();

export function regionFromPrefecture(prefecture: string): MockRegion | null {
  for (const [region, prefs] of Object.entries(MOCK_REGIONS)) {
    if ((prefs as readonly string[]).includes(prefecture)) {
      return region as MockRegion;
    }
  }
  return null;
}

export function applySpotFilters(
  spots: MockSpot[],
  filters: SpotsFilterState,
): MockSpot[] {
  return spots.filter((spot) => {
    if (filters.group !== "すべて") {
      const query = filters.group.trim();
      if (
        !spot.group.includes(query) &&
        !spot.name.includes(query) &&
        !spot.workTitle.includes(query)
      ) {
        return false;
      }
    }
    if (filters.category !== "すべて" && spot.category !== filters.category) {
      return false;
    }
    if (filters.region && spot.region !== filters.region) return false;
    if (
      filters.prefecture !== "すべて" &&
      spot.prefecture !== filters.prefecture
    ) {
      return false;
    }
    return true;
  });
}

/** 登録済みスポットからグループ名一覧を作る（新規登録も自動で増える） */
export function listRegisteredGroups(spots: MockSpot[]): string[] {
  const names = new Set<string>();
  for (const spot of spots) {
    const name = spot.group.trim();
    if (name) names.add(name);
  }
  return [...names].sort((a, b) => a.localeCompare(b, "ja"));
}

export function findSpotById(
  id: string,
  communitySpots: MockSpot[],
  officialSpots: MockSpot[] = FALLBACK_OFFICIAL_SPOTS,
): MockSpot | null {
  return (
    officialSpots.find((s) => s.id === id) ??
    communitySpots.find((s) => s.id === id) ??
    null
  );
}
