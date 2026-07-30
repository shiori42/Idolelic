import { getServerEnv } from "@/config/server-env";
import type { MockSpot } from "@/data/mock-spots";
import { KEYAKIZAKA46_MOCK_SPOTS } from "@/data/keyakizaka46-mv-locations";
import { LAST_IDOL_MOCK_SPOTS } from "@/data/last-idol-mv-locations";
import { NIJIMASU_MOCK_SPOTS } from "@/data/nijimasu-mv-locations";
import { SHIROKYAN_MOCK_SPOTS } from "@/data/shirokyan-mv-locations";
import { KAMIYADO_MOCK_SPOTS } from "@/data/kamiyado-mv-locations";
import { HIME_KYUN_FRUIT_CAN_MOCK_SPOTS } from "@/data/hime-kyun-fruit-can-mv-locations";
import { KORE_KOI_MOCK_SPOTS } from "@/data/kore-koi-mv-locations";
import { DEMPAGUMI_MOCK_SPOTS } from "@/data/dempagumi-mv-locations";
import { PIMMS_MOCK_SPOTS } from "@/data/pimms-mv-locations";
import { AMEFURASSHI_MOCK_SPOTS } from "@/data/amefurasshi-mv-locations";
import { KOBUSHI_FACTORY_MOCK_SPOTS } from "@/data/kobushi-factory-mv-locations";
import { TOKYO_GIRLS_STYLE_MOCK_SPOTS } from "@/data/tokyo-girls-style-mv-locations";
import type { SpotSource } from "@/data/mock-spots";
import type { DbCommunitySpotRow } from "@/types/spot";
import { rowToCommunitySpot } from "@/types/spot";

import { CommunitySpotsDbError } from "./community-spots-db";

/** 公式聖地（実データのみ。ダミーは含まない） */
export const FALLBACK_OFFICIAL_SPOTS: MockSpot[] = [
  ...KEYAKIZAKA46_MOCK_SPOTS,
  ...LAST_IDOL_MOCK_SPOTS,
  ...NIJIMASU_MOCK_SPOTS,
  ...SHIROKYAN_MOCK_SPOTS,
  ...KAMIYADO_MOCK_SPOTS,
  ...HIME_KYUN_FRUIT_CAN_MOCK_SPOTS,
  ...KORE_KOI_MOCK_SPOTS,
  ...DEMPAGUMI_MOCK_SPOTS,
  ...PIMMS_MOCK_SPOTS,
  ...AMEFURASSHI_MOCK_SPOTS,
  ...KOBUSHI_FACTORY_MOCK_SPOTS,
  ...TOKYO_GIRLS_STYLE_MOCK_SPOTS,
];

const SPOT_SELECT =
  "id,legacy_id,name,work_title,group_name,category,prefecture,region,address,description,latitude,longitude,source,submitted_by,mv_url,created_at";

function restHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  };
}

async function listSpotsBySource(source: SpotSource): Promise<MockSpot[]> {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    return [];
  }

  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  url.searchParams.set("select", SPOT_SELECT);
  url.searchParams.set("source", `eq.${source}`);
  url.searchParams.set("order", "created_at.asc");

  const response = await fetch(url, {
    headers: restHeaders(supabaseServiceRoleKey),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new CommunitySpotsDbError(
      `聖地の取得に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbCommunitySpotRow[];
  return rows.map(rowToCommunitySpot);
}

export async function listOfficialSpotsFromDb(): Promise<MockSpot[]> {
  return listSpotsBySource("official");
}

export async function listCommunitySpotsFromDbFiltered(): Promise<MockSpot[]> {
  return listSpotsBySource("community");
}

export async function fetchOfficialSpots(): Promise<{
  spots: MockSpot[];
  persisted: boolean;
}> {
  const { isSupabaseConfigured } = getServerEnv();

  if (!isSupabaseConfigured) {
    return { spots: FALLBACK_OFFICIAL_SPOTS, persisted: false };
  }

  try {
    const spots = await listOfficialSpotsFromDb();
    if (spots.length > 0) {
      return { spots, persisted: true };
    }

    return { spots: FALLBACK_OFFICIAL_SPOTS, persisted: true };
  } catch (error) {
    if (error instanceof CommunitySpotsDbError) {
      return { spots: FALLBACK_OFFICIAL_SPOTS, persisted: false };
    }
    throw error;
  }
}
