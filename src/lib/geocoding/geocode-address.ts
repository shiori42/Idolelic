import { getServerEnv } from "@/config/server-env";
import type { GeocodeResult } from "@/types/spot";

import { buildGeocodeQuery } from "./build-geocode-query";

type GoogleGeocodeResponse = {
  status: string;
  results?: Array<{
    formatted_address: string;
    geometry: { location: { lat: number; lng: number } };
  }>;
  error_message?: string;
};

type NominatimResult = {
  lat: string;
  lon: string;
  display_name: string;
};

export class GeocodeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeocodeError";
  }
}

async function geocodeWithGoogle(
  query: string,
  apiKey: string,
): Promise<GeocodeResult> {
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "ja");
  url.searchParams.set("region", "jp");

  const response = await fetch(url, { next: { revalidate: 0 } });
  if (!response.ok) {
    throw new GeocodeError("ジオコーディング API に接続できませんでした");
  }

  const data = (await response.json()) as GoogleGeocodeResponse;
  if (data.status !== "OK" || !data.results?.[0]) {
    throw new GeocodeError(
      data.error_message ?? "住所から位置を特定できませんでした",
    );
  }

  const result = data.results[0];
  return {
    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
    formattedAddress: result.formatted_address,
    provider: "google",
  };
}

async function geocodeWithNominatim(query: string): Promise<GeocodeResult> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", "jp");

  const response = await fetch(url, {
    headers: {
      "User-Agent": "osimap/0.1 (school project; geocoding for pilgrimage map)",
      Accept: "application/json",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    throw new GeocodeError("ジオコーディング API に接続できませんでした");
  }

  const data = (await response.json()) as NominatimResult[];
  if (!data[0]) {
    throw new GeocodeError("住所から位置を特定できませんでした");
  }

  return {
    latitude: Number(data[0].lat),
    longitude: Number(data[0].lon),
    formattedAddress: data[0].display_name,
    provider: "nominatim",
  };
}

export async function geocodeAddress(
  address: string,
  prefecture: string,
): Promise<GeocodeResult> {
  const query = buildGeocodeQuery(address, prefecture);
  if (!query.trim()) {
    throw new GeocodeError("住所を入力してください");
  }

  const { googleMapsApiKey } = getServerEnv();

  if (googleMapsApiKey) {
    return geocodeWithGoogle(query, googleMapsApiKey);
  }

  return geocodeWithNominatim(query);
}
