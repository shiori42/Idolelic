"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockPage } from "@/components/design/mock-ui";
import type { MockSpot } from "@/data/mock-spots";
import { useUserSpots } from "@/features/user-spots";
import { withAppPrefix } from "@/lib/auth/paths";
import {
  buildGoogleMapsTourUrl,
  GOOGLE_MAPS_MOBILE_MAX_STOPS,
  type GoogleMapsTourTravelMode,
} from "@/lib/spots/google-maps";
import {
  decodeWorkTourId,
  defaultTourOrigin,
  findWorkTour,
  nearestStationForTour,
  orderTourSpots,
  suggestTourTravelMode,
  tourOriginLabel,
  type TourOriginPreset,
} from "@/lib/spots/work-tours";
import { cn } from "@/lib/utils/cn";

type TitleTourScreenProps = {
  tourId: string;
  officialSpots: MockSpot[];
};

export function TitleTourScreen({
  tourId,
  officialSpots,
}: TitleTourScreenProps) {
  const pathname = usePathname();
  const titlesPath = withAppPrefix(pathname, "/titles");
  const spotsBase = withAppPrefix(pathname, "/spots");
  const { communitySpots } = useUserSpots();

  const decoded = decodeWorkTourId(tourId);
  const tour = decoded
    ? findWorkTour(
        [...officialSpots, ...communitySpots],
        decoded.group,
        decoded.workTitle,
      )
    : null;

  const orderedSpots = useMemo(
    () => (tour ? orderTourSpots(tour.spots) : []),
    [tour],
  );

  const nearestStation = useMemo(
    () =>
      tour ? nearestStationForTour(tour.workTitle, orderedSpots) : null,
    [orderedSpots, tour],
  );

  const suggestedMode = useMemo(
    () => suggestTourTravelMode(orderedSpots),
    [orderedSpots],
  );
  const [modeOverride, setModeOverride] = useState<
    Exclude<GoogleMapsTourTravelMode, "transit"> | null
  >(null);
  const travelMode = modeOverride ?? suggestedMode;
  const [originKind, setOriginKind] = useState<TourOriginPreset>(() =>
    decoded
      ? defaultTourOrigin(decoded.workTitle, orderedSpots)
      : "current",
  );

  if (!tour) {
    return (
      <>
        <DesignHeader title="タイトル" backHref={titlesPath} />
        <MockPage>
          <p className="py-12 text-center text-sm text-[var(--mock-muted)]">
            タイトルが見つかりません
          </p>
        </MockPage>
      </>
    );
  }

  const effectiveOrigin: TourOriginPreset =
    originKind === "station" && !nearestStation ? "current" : originKind;

  const mapsUrl = buildGoogleMapsTourUrl(orderedSpots, {
    travelMode,
    origin: tourOriginLabel(effectiveOrigin, nearestStation),
  });
  const omitted = Math.max(0, orderedSpots.length - GOOGLE_MAPS_MOBILE_MAX_STOPS);
  const isMulti = orderedSpots.length >= 2;
  const isSilentMajority = tour.workTitle === "サイレントマジョリティー";

  return (
    <>
      <DesignHeader title="このタイトルを巡る" backHref={titlesPath} />
      <MockPage>
        <div>
          <p className="mock-section-label">{tour.group}</p>
          <h2 className="mt-1 text-lg font-semibold leading-snug">
            {tour.workTitle}
          </h2>
          <p className="mt-1 text-sm text-[var(--mock-muted)]">
            {orderedSpots.length}か所
          </p>
          {isSilentMajority ? (
            <p className="mt-2 rounded-xl border border-[var(--mock-border)] bg-[var(--mock-brand-muted)] px-3 py-2 text-xs leading-relaxed text-[var(--mock-brand-deep)]">
              実地確認済み：渋谷駅 → 稲荷橋 → さくら通りを徒歩で歩きました。最寄り駅（渋谷駅）出発がおすすめです。
            </p>
          ) : null}
        </div>

        <ol className="mock-list">
          {orderedSpots.map((spot, index) => (
            <li key={spot.id}>
              <Link
                href={`${spotsBase}/${spot.id}`}
                className="mock-list-item mock-tour-stop"
              >
                <span className="mock-tour-stop-num" aria-hidden>
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <p className="mock-list-title">{spot.name}</p>
                  <p className="mock-list-sub">
                    {spot.prefecture} · {spot.address}
                  </p>
                </span>
              </Link>
            </li>
          ))}
        </ol>

        {isMulti ? (
          <>
            <div>
              <p className="mock-section-label">出発地</p>
              <div className="mock-mode-tabs mock-mode-tabs-2 mt-2">
                <button
                  type="button"
                  className={cn(
                    "mock-mode-tab",
                    effectiveOrigin === "current" && "mock-mode-tab-active",
                  )}
                  onClick={() => setOriginKind("current")}
                >
                  現在地
                </button>
                <button
                  type="button"
                  className={cn(
                    "mock-mode-tab",
                    effectiveOrigin === "station" && "mock-mode-tab-active",
                  )}
                  onClick={() => setOriginKind("station")}
                  disabled={!nearestStation}
                >
                  最寄り駅
                  {nearestStation ? `（${nearestStation}）` : ""}
                </button>
              </div>
            </div>

            <div>
              <p className="mock-section-label">移動方法</p>
              <div className="mock-mode-tabs mock-mode-tabs-2 mt-2">
                <button
                  type="button"
                  className={cn(
                    "mock-mode-tab",
                    travelMode === "walking" && "mock-mode-tab-active",
                  )}
                  onClick={() => setModeOverride("walking")}
                >
                  徒歩
                </button>
                <button
                  type="button"
                  className={cn(
                    "mock-mode-tab",
                    travelMode === "driving" && "mock-mode-tab-active",
                  )}
                  onClick={() => setModeOverride("driving")}
                >
                  車
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--mock-muted)]">
                電車ルートは経由地を指定できないため、複数聖地の案内は徒歩か車です。
              </p>
            </div>
          </>
        ) : null}

        {omitted > 0 ? (
          <p className="text-xs leading-relaxed text-[var(--mock-muted)]">
            Google マップ（スマホ）の経由地は 3 か所までのため、先頭の
            {GOOGLE_MAPS_MOBILE_MAX_STOPS}か所を案内します。
          </p>
        ) : null}

        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mock-btn mock-btn-primary"
          >
            Googleマップでこのタイトルを巡る
          </a>
        ) : (
          <p className="text-sm text-[var(--mock-muted)]">
            案内できる位置情報がありません。
          </p>
        )}
      </MockPage>
    </>
  );
}
