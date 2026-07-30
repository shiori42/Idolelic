import { NextResponse } from "next/server";

import { GeocodeError, geocodeAddress } from "@/lib/geocoding/geocode-address";
import { geocodeRequestSchema } from "@/types/spot";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = geocodeRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "入力が不正です" },
        { status: 400 },
      );
    }

    const result = await geocodeAddress(
      parsed.data.address,
      parsed.data.prefecture,
    );

    return NextResponse.json({
      latitude: result.latitude,
      longitude: result.longitude,
      formattedAddress: result.formattedAddress,
      provider: result.provider,
    });
  } catch (error) {
    if (error instanceof GeocodeError) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }

    return NextResponse.json(
      { error: "ジオコーディングに失敗しました" },
      { status: 500 },
    );
  }
}
