import { getServerEnv } from "@/config/server-env";
import type {
  CommunitySpot,
  CreateCommunitySpotInput,
  DbCommunitySpotRow,
  UpdateCommunitySpotInput,
} from "@/types/spot";
import { rowToCommunitySpot } from "@/types/spot";
import { resolveMvUrl } from "@/lib/spots/mv-url";

export class CommunitySpotsDbError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CommunitySpotsDbError";
  }
}

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

function requireSupabaseRest() {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    throw new CommunitySpotsDbError(
      "Supabase が未設定です。.env.local に URL と SERVICE_ROLE_KEY を設定してください",
    );
  }

  return { supabaseUrl, supabaseServiceRoleKey };
}

/** id（UUID）または legacy_id で1件探す */
function spotFilterQuery(idOrLegacy: string): string {
  const escaped = idOrLegacy.replace(/,/g, "");
  return `or=(id.eq.${encodeURIComponent(escaped)},legacy_id.eq.${encodeURIComponent(escaped)})`;
}

export async function listCommunitySpotsFromDb(): Promise<CommunitySpot[]> {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    return [];
  }

  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  url.searchParams.set("select", SPOT_SELECT);
  url.searchParams.set("source", "eq.community");
  url.searchParams.set("order", "created_at.desc");

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

/** 公式・コミュニティ両方（オーナー管理用） */
export async function listAllSpotsFromDb(): Promise<CommunitySpot[]> {
  const { supabaseUrl, supabaseServiceRoleKey, isSupabaseConfigured } =
    getServerEnv();

  if (!isSupabaseConfigured || !supabaseUrl || !supabaseServiceRoleKey) {
    return [];
  }

  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  url.searchParams.set("select", SPOT_SELECT);
  url.searchParams.set("order", "created_at.desc");

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

export async function insertCommunitySpotToDb(
  input: CreateCommunitySpotInput,
  coords: { latitude: number; longitude: number },
): Promise<CommunitySpot> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();

  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  const payload = {
    name: input.name,
    work_title: input.workTitle,
    group_name: input.group,
    category: input.category,
    prefecture: input.prefecture,
    region: input.region,
    address: input.address,
    description: input.description,
    latitude: coords.latitude,
    longitude: coords.longitude,
    source: "community",
    submitted_by: input.submittedBy ?? null,
    mv_url: resolveMvUrl({
      group: input.group,
      workTitle: input.workTitle,
      mvUrl: input.mvUrl,
    }),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: restHeaders(supabaseServiceRoleKey),
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new CommunitySpotsDbError(
      `聖地の登録に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbCommunitySpotRow[];
  const row = rows[0];
  if (!row) {
    throw new CommunitySpotsDbError("登録後のデータを取得できませんでした");
  }

  return rowToCommunitySpot(row);
}

export async function updateSpotInDb(
  input: UpdateCommunitySpotInput,
): Promise<CommunitySpot> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();

  const payload: Record<string, unknown> = {};
  if (input.name !== undefined) payload.name = input.name;
  if (input.workTitle !== undefined) payload.work_title = input.workTitle;
  if (input.group !== undefined) payload.group_name = input.group;
  if (input.category !== undefined) payload.category = input.category;
  if (input.prefecture !== undefined) payload.prefecture = input.prefecture;
  if (input.region !== undefined) payload.region = input.region;
  if (input.address !== undefined) payload.address = input.address;
  if (input.description !== undefined) payload.description = input.description;
  if (input.submittedBy !== undefined) {
    payload.submitted_by = input.submittedBy;
  }
  if (input.source !== undefined) payload.source = input.source;

  if (input.mvUrl !== undefined) {
    if (input.mvUrl === null) {
      payload.mv_url = null;
    } else {
      const existing =
        !input.group || !input.workTitle
          ? await fetchSpotRowByIdOrLegacy(input.id)
          : null;
      if ((!input.group || !input.workTitle) && !existing) {
        throw new CommunitySpotsDbError("聖地が見つかりません");
      }
      payload.mv_url = resolveMvUrl({
        group: input.group ?? existing!.group_name,
        workTitle: input.workTitle ?? existing!.work_title,
        mvUrl: input.mvUrl,
      });
    }
  }

  if (Object.keys(payload).length === 0) {
    throw new CommunitySpotsDbError("更新する項目がありません");
  }

  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  url.searchParams.set("select", SPOT_SELECT);
  const filter = spotFilterQuery(input.id);
  const response = await fetch(`${url.toString()}&${filter}`, {
    method: "PATCH",
    headers: restHeaders(supabaseServiceRoleKey),
    body: JSON.stringify(payload),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new CommunitySpotsDbError(
      `聖地の更新に失敗しました: ${detail || response.statusText}`,
    );
  }

  const rows = (await response.json()) as DbCommunitySpotRow[];
  const row = rows[0];
  if (!row) {
    throw new CommunitySpotsDbError("聖地が見つかりません");
  }

  return rowToCommunitySpot(row);
}

export async function deleteSpotFromDb(idOrLegacy: string): Promise<void> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();

  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  const filter = spotFilterQuery(idOrLegacy);
  const response = await fetch(`${url.toString()}?${filter}`, {
    method: "DELETE",
    headers: {
      ...restHeaders(supabaseServiceRoleKey),
      Prefer: "return=minimal",
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new CommunitySpotsDbError(
      `聖地の削除に失敗しました: ${detail || response.statusText}`,
    );
  }
}

async function fetchSpotRowByIdOrLegacy(
  idOrLegacy: string,
): Promise<DbCommunitySpotRow | null> {
  const { supabaseUrl, supabaseServiceRoleKey } = requireSupabaseRest();
  const url = new URL("/rest/v1/community_spots", supabaseUrl);
  url.searchParams.set("select", SPOT_SELECT);
  const filter = spotFilterQuery(idOrLegacy);
  const response = await fetch(`${url.toString()}&${filter}`, {
    headers: restHeaders(supabaseServiceRoleKey),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as DbCommunitySpotRow[];
  return rows[0] ?? null;
}
