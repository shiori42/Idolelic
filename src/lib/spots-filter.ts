import {
  MOCK_REGIONS,
  type MockRegion,
  type MockSpot,
} from "@/data/mock-spots";

import { applySpotFilters } from "./spots-helpers";
import {
  FALLBACK_OFFICIAL_SPOTS,
  fetchOfficialSpots,
} from "./spots/fetch-official-spots";
export type SpotsFilterState = {
  group: string;
  category: string;
  region: MockRegion | null;
  prefecture: string;
};

export function parseSpotsFilters(
  params: Record<string, string | string[] | undefined>,
): SpotsFilterState {
  const regionParam = pickParam(params.region);
  const region =
    regionParam && regionParam in MOCK_REGIONS
      ? (regionParam as MockRegion)
      : null;

  return {
    group: pickParam(params.group)?.trim() || "すべて",
    category: pickParam(params.category) ?? "すべて",
    region,
    prefecture: pickParam(params.prefecture) ?? "すべて",
  };
}

function pickParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function filterSpots(
  filters: SpotsFilterState,
  officialSpots: MockSpot[] = FALLBACK_OFFICIAL_SPOTS,
): MockSpot[] {
  return applySpotFilters(officialSpots, filters);
}

export async function fetchFilteredOfficialSpots(
  filters: SpotsFilterState,
): Promise<{ spots: MockSpot[]; persisted: boolean }> {
  const { spots, persisted } = await fetchOfficialSpots();
  return {
    spots: applySpotFilters(spots, filters),
    persisted,
  };
}

export function hasAdvancedFilters(filters: SpotsFilterState): boolean {
  return (
    filters.group !== "すべて" ||
    filters.category !== "すべて" ||
    filters.region !== null ||
    filters.prefecture !== "すべて"
  );
}

export function buildSpotsSearchUrl(
  current: SpotsFilterState,
  patch: Partial<SpotsFilterState>,
  homePath = "/home",
) {
  const next: SpotsFilterState = { ...current, ...patch };

  if (patch.region !== undefined && patch.region === current.region) {
    next.region = null;
    next.prefecture = "すべて";
  }

  if (patch.region !== undefined && patch.region !== current.region) {
    next.prefecture = "すべて";
  }

  const params = new URLSearchParams();

  if (next.group !== "すべて") params.set("group", next.group);
  if (next.category !== "すべて") params.set("category", next.category);
  if (next.region) params.set("region", next.region);
  if (next.prefecture !== "すべて") params.set("prefecture", next.prefecture);

  const query = params.toString();
  return query ? `${homePath}?${query}` : homePath;
}
