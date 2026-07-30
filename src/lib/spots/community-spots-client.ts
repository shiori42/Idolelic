import type { CommunitySpot, CreateCommunitySpotInput } from "@/types/spot";

export type GeocodePreview = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  provider: "google" | "nominatim";
};

export async function geocodeAddressClient(
  address: string,
  prefecture: string,
): Promise<GeocodePreview> {
  const response = await fetch("/api/geocode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ address, prefecture }),
  });

  const data = (await response.json()) as GeocodePreview & { error?: string };
  if (!response.ok) {
    throw new Error(data.error ?? "住所から位置を取得できませんでした");
  }

  return data;
}

export async function registerCommunitySpotClient(
  input: CreateCommunitySpotInput,
): Promise<{ spot: CommunitySpot; persisted: boolean; geocode: GeocodePreview }> {
  const response = await fetch("/api/spots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = (await response.json()) as {
    spot?: CommunitySpot;
    persisted?: boolean;
    geocode?: GeocodePreview;
    error?: string;
  };

  if (!response.ok || !data.spot || !data.geocode) {
    throw new Error(data.error ?? "聖地の登録に失敗しました");
  }

  return {
    spot: data.spot,
    persisted: data.persisted ?? false,
    geocode: data.geocode,
  };
}

export async function fetchCommunitySpotsClient(): Promise<{
  spots: CommunitySpot[];
  persisted: boolean;
}> {
  const response = await fetch("/api/spots", { cache: "no-store" });
  const data = (await response.json()) as {
    spots?: CommunitySpot[];
    persisted?: boolean;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error ?? "聖地一覧の取得に失敗しました");
  }

  return {
    spots: data.spots ?? [],
    persisted: data.persisted ?? false,
  };
}
