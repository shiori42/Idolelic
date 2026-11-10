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

function defaultSelectedIds(spots: MockSpot[]) {
  return spots.slice(0, GOOGLE_MAPS_MOBILE_MAX_STOPS).map((spot) => spot.id);
}

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

  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);
  const effectiveSelectedIds = selectedIds ?? defaultSelectedIds(orderedSpots);
  const selectedSpots = orderedSpots.filter((spot) =>
    effectiveSelectedIds.includes(spot.id),
  );

  const nearestStation = useMemo(
    () =>
      tour ? nearestStationForTour(tour.workTitle, orderedSpots) : null,
    [orderedSpots, tour],
  );

  const suggestedMode = useMemo(
    () => suggestTourTravelMode(selectedSpots),
    [selectedSpots],
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

  const stopCountOptions = useMemo(() => {
    const max = Math.min(orderedSpots.length, GOOGLE_MAPS_MOBILE_MAX_STOPS);
    const options: number[] = [];
    for (let n = 2; n <= max; n += 1) options.push(n);
    if (max === 1) options.push(1);
    return options;
  }, [orderedSpots.length]);

  function selectStopCount(count: number) {
    setSelectedIds(orderedSpots.slice(0, count).map((spot) => spot.id));
  }

  function toggleStop(spotId: string) {
    setSelectedIds((prev) => {
      const current = prev ?? defaultSelectedIds(orderedSpots);
      if (current.includes(spotId)) {
        if (current.length <= 1) return current;
        return current.filter((id) => id !== spotId);
      }
      if (current.length >= GOOGLE_MAPS_MOBILE_MAX_STOPS) {
        return current;
      }
      const next = new Set(current);
      next.add(spotId);
      return orderedSpots
        .map((spot) => spot.id)
        .filter((id) => next.has(id));
    });
  }

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

  const mapsUrl = buildGoogleMapsTourUrl(selectedSpots, {
    travelMode,
    origin: tourOriginLabel(effectiveOrigin, nearestStation),
  });
  const isMulti = orderedSpots.length >= 2;
  const isSilentMajority = tour.workTitle === "サイレントマジョリティー";
  const selectedCount = selectedSpots.length;
  const atMaxSelection =
    selectedCount >= GOOGLE_MAPS_MOBILE_MAX_STOPS &&
    orderedSpots.length > GOOGLE_MAPS_MOBILE_MAX_STOPS;

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
            全{orderedSpots.length}か所 · 今回 {selectedCount}か所
          </p>
          {isSilentMajority ? (
            <p className="mt-2 rounded-xl border border-[var(--mock-border)] bg-[var(--mock-brand-muted)] px-3 py-2 text-xs leading-relaxed text-[var(--mock-brand-deep)]">
              実地確認済み：渋谷駅 → 稲荷橋 →
              さくら通りを徒歩で歩きました。最寄り駅（渋谷駅）出発がおすすめです。3か所にするとそのルートになります。
            </p>
          ) : null}
        </div>

        {isMulti ? (
          <div>
            <p className="mock-section-label">回る聖地数</p>
            <div
              className={cn(
                "mock-mode-tabs mt-2",
                stopCountOptions.length === 2 && "mock-mode-tabs-2",
                stopCountOptions.length >= 4 && "mock-mode-tabs-wrap",
              )}
              style={
                stopCountOptions.length === 3
                  ? undefined
                  : stopCountOptions.length > 3
                    ? { gridTemplateColumns: `repeat(${Math.min(stopCountOptions.length, 4)}, minmax(0, 1fr))` }
                    : undefined
              }
            >
              {stopCountOptions.map((count) => {
                const prefixIds = orderedSpots
                  .slice(0, count)
                  .map((spot) => spot.id)
                  .join();
                const active = effectiveSelectedIds.join() === prefixIds;
                return (
                  <button
                    key={count}
                    type="button"
                    className={cn(
                      "mock-mode-tab",
                      active && "mock-mode-tab-active",
                    )}
                    onClick={() => selectStopCount(count)}
                  >
                    {count}か所
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-[var(--mock-muted)]">
              先頭からの件数を選ぶか、下のリストで個別にオン／オフできます。スマホの Google
              マップは最大 {GOOGLE_MAPS_MOBILE_MAX_STOPS} か所です。
            </p>
          </div>
        ) : null}

        <ol className="mock-list">
          {orderedSpots.map((spot) => {
            const selected = effectiveSelectedIds.includes(spot.id);
            const orderIndex = selected
              ? selectedSpots.findIndex((item) => item.id === spot.id) + 1
              : null;
            const disableAdd =
              !selected &&
              selectedCount >= GOOGLE_MAPS_MOBILE_MAX_STOPS;

            return (
              <li key={spot.id}>
                <div
                  className={cn(
                    "mock-list-item mock-tour-stop mock-tour-stop-selectable",
                    !selected && "mock-tour-stop-off",
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      "mock-tour-stop-check",
                      selected && "mock-tour-stop-check-on",
                    )}
                    aria-pressed={selected}
                    aria-label={
                      selected
                        ? `${spot.name}をルートから外す`
                        : `${spot.name}をルートに入れる`
                    }
                    disabled={disableAdd || (selected && selectedCount <= 1)}
                    onClick={() => toggleStop(spot.id)}
                  >
                    {selected ? orderIndex : ""}
                  </button>
                  <Link
                    href={`${spotsBase}/${spot.id}`}
                    className="min-w-0 flex-1"
                  >
                    <p className="mock-list-title">{spot.name}</p>
                    <p className="mock-list-sub">
                      {spot.prefecture} · {spot.address}
                    </p>
                  </Link>
                </div>
              </li>
            );
          })}
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

        {atMaxSelection ? (
          <p className="text-xs leading-relaxed text-[var(--mock-muted)]">
            すでに {GOOGLE_MAPS_MOBILE_MAX_STOPS}
            か所選んでいます。別の聖地を入れるときは、どれかを外してください。
          </p>
        ) : null}

        {mapsUrl ? (
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mock-btn mock-btn-primary"
          >
            Googleマップで{selectedCount}か所を巡る
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
