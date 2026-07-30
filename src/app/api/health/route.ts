import { NextResponse } from "next/server";

import { getServerEnv } from "@/config/server-env";
import { isSupabaseAuthConfigured } from "@/lib/auth/config";
import { fetchOfficialSpots } from "@/lib/spots/fetch-official-spots";
import { fetchCommunitySpots } from "@/lib/spots/register-community-spot";

export async function GET() {
  const env = getServerEnv();
  let communityCount = 0;
  let officialCount = 0;

  try {
    const [community, official] = await Promise.all([
      fetchCommunitySpots(),
      fetchOfficialSpots(),
    ]);
    communityCount = community.length;
    officialCount = official.spots.length;
  } catch {
    // health は疎通確認用。DB エラーでも 200 を返す
  }

  return NextResponse.json({
    ok: true,
    service: "osimap",
    phase: "supabase-mvp",
    supabase: {
      configured: env.isSupabaseConfigured,
      authConfigured: isSupabaseAuthConfigured(),
      geocoding: env.isGeocodingConfigured,
      officialSpots: officialCount,
      communitySpots: communityCount,
    },
  });
}
