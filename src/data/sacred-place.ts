import type { MockSpot } from "@/data/mock-spots";
import { resolveMvUrl } from "@/lib/spots/mv-url";

export type SacredPlace = {
  group: string;
  name: string;
  prefecture: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  era?: string;
  category: string;
  region: string;
  workTitle: string;
  /** YouTube など MV 視聴用 URL（任意。未指定時は検索URLを自動付与） */
  mvUrl?: string;
  submittedBy?: string;
};

export function formatSacredPlaceDescription(place: SacredPlace) {
  return place.era
    ? `${place.description}\n年代: ${place.era}`
    : place.description;
}

export function sacredPlaceToMockSpot(
  place: SacredPlace,
  id: string,
  source: MockSpot["source"] = "official",
): MockSpot {
  return {
    id,
    name: place.name,
    workTitle: place.workTitle,
    group: place.group,
    category: place.category,
    prefecture: place.prefecture,
    region: place.region,
    address: place.address,
    description: formatSacredPlaceDescription(place),
    era: place.era,
    mvUrl: resolveMvUrl(place),
    latitude: place.latitude,
    longitude: place.longitude,
    source,
    submittedBy: place.submittedBy,
  };
}

export function sacredPlacesToMockSpots(
  places: SacredPlace[],
  idPrefix: string,
  source: MockSpot["source"] = "official",
): MockSpot[] {
  return places.map((place, index) =>
    sacredPlaceToMockSpot(place, `${idPrefix}-${index + 1}`, source),
  );
}
