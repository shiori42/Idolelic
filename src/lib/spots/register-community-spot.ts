import type { CommunitySpot, CreateCommunitySpotInput } from "@/types/spot";

import { getServerEnv } from "@/config/server-env";
import { geocodeAddress } from "@/lib/geocoding/geocode-address";
import {
  CommunitySpotsDbError,
  insertCommunitySpotToDb,
  listCommunitySpotsFromDb,
} from "@/lib/spots/community-spots-db";

export type RegisterCommunitySpotResult = {
  spot: CommunitySpot;
  persisted: boolean;
  geocode: {
    formattedAddress: string;
    provider: "google" | "nominatim";
  };
};

export async function registerCommunitySpot(
  input: CreateCommunitySpotInput,
): Promise<RegisterCommunitySpotResult> {
  const geocode = await geocodeAddress(input.address, input.prefecture);

  const spotBase = {
    name: input.name,
    workTitle: input.workTitle,
    group: input.group,
    category: input.category,
    prefecture: input.prefecture,
    region: input.region,
    address: input.address,
    description: input.description,
    latitude: geocode.latitude,
    longitude: geocode.longitude,
    source: "community" as const,
    submittedBy: input.submittedBy,
  };

  const { isSupabaseConfigured } = getServerEnv();

  if (isSupabaseConfigured) {
    const spot = await insertCommunitySpotToDb(input, {
      latitude: geocode.latitude,
      longitude: geocode.longitude,
    });

    return {
      spot,
      persisted: true,
      geocode: {
        formattedAddress: geocode.formattedAddress,
        provider: geocode.provider,
      },
    };
  }

  return {
    spot: {
      ...spotBase,
      id: `local-${Date.now()}`,
    },
    persisted: false,
    geocode: {
      formattedAddress: geocode.formattedAddress,
      provider: geocode.provider,
    },
  };
}

export async function fetchCommunitySpots(): Promise<CommunitySpot[]> {
  try {
    return await listCommunitySpotsFromDb();
  } catch (error) {
    if (error instanceof CommunitySpotsDbError) {
      return [];
    }
    throw error;
  }
}
