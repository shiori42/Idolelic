import { NextResponse } from "next/server";

import { getServerEnv } from "@/config/server-env";
import { OwnerAccessError, isOwnerUser } from "@/lib/auth/owner";
import { getServerAuthUser } from "@/lib/auth/session";
import { GeocodeError } from "@/lib/geocoding/geocode-address";
import {
  CommunitySpotsDbError,
  deleteSpotFromDb,
  updateSpotInDb,
} from "@/lib/spots/community-spots-db";
import { fetchOfficialSpots } from "@/lib/spots/fetch-official-spots";
import {
  fetchCommunitySpots,
  registerCommunitySpot,
} from "@/lib/spots/register-community-spot";
import {
  createCommunitySpotSchema,
  deleteCommunitySpotSchema,
  updateCommunitySpotSchema,
} from "@/types/spot";

export async function GET() {
  try {
    const env = getServerEnv();
    const [communitySpots, official] = await Promise.all([
      fetchCommunitySpots(),
      fetchOfficialSpots(),
    ]);

    return NextResponse.json({
      spots: communitySpots,
      officialCount: official.spots.length,
      persisted: env.isSupabaseConfigured,
      officialPersisted: official.persisted,
    });
  } catch (error) {
    if (error instanceof CommunitySpotsDbError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "聖地一覧の取得に失敗しました" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = createCommunitySpotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const result = await registerCommunitySpot({
      ...parsed.data,
      submittedBy: parsed.data.submittedBy ?? "ゲスト",
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof GeocodeError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    if (error instanceof CommunitySpotsDbError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }

    return NextResponse.json(
      { error: "聖地の登録に失敗しました" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getServerAuthUser();
    if (!isOwnerUser(user)) {
      return NextResponse.json(
        { error: "オーナー権限が必要です" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as unknown;
    const parsed = updateCommunitySpotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const spot = await updateSpotInDb(parsed.data);
    return NextResponse.json({ spot });
  } catch (error) {
    if (error instanceof OwnerAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof CommunitySpotsDbError) {
      const status = error.message.includes("見つかりません") ? 404 : 503;
      return NextResponse.json({ error: error.message }, { status });
    }
    return NextResponse.json(
      { error: "聖地の更新に失敗しました" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getServerAuthUser();
    if (!isOwnerUser(user)) {
      return NextResponse.json(
        { error: "オーナー権限が必要です" },
        { status: 403 },
      );
    }

    const body = (await request.json()) as unknown;
    const parsed = deleteCommunitySpotSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    await deleteSpotFromDb(parsed.data.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof OwnerAccessError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof CommunitySpotsDbError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    return NextResponse.json(
      { error: "聖地の削除に失敗しました" },
      { status: 500 },
    );
  }
}
