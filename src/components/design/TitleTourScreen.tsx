"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockPage } from "@/components/design/mock-ui";
import type { MockSpot } from "@/data/mock-spots";
import {
  buildLunchMapsUrl,
  findDayCourse,
  type DayCourseLunch,
} from "@/data/day-courses";
import { useUserSpots } from "@/features/user-spots";
import { haversineDistanceMeters } from "@/lib/geo/haversine";
import { withAppPrefix } from "@/lib/auth/paths";
import {
  buildGoogleMapsTourUrl,
  GOOGLE_MAPS_MOBILE_MAX_STOPS,
  type GoogleMapsTourTravelMode,
} from "@/lib/spots/google-maps";
import {
  decodeWorkTourId,
  defaultTourOrigin,
  estimateTourWalkStats,
  findWorkTour,
  nearestStationForTour,
  orderTourSpots,
  suggestTourTravelMode,
  tourOriginLabel,
  type TourOriginPreset,
} from "@/lib/spots/work-tours";
import { cn } from "@/lib/utils/cn";

const SpotsMap = dynamic(
  () => import("@/components/design/SpotsMap").then((mod) => mod.SpotsMap),
  {
    ssr: false,
    loading: () => <div className="spots-map-shell spots-map-loading" />,
  },
);

type TitleTourScreenProps = {
  tourId: string;
  officialSpots: MockSpot[];
};

const DEFAULT_STAY_MINUTES = 15;
const WALK_METERS_PER_MINUTE = 80;

function defaultSelectedIds(spots: MockSpot[]) {
  return spots.slice(0, GOOGLE_MAPS_MOBILE_MAX_STOPS).map((spot) => spot.id);
}

function hasCoords(spot: MockSpot) {
  return (
    typeof spot.latitude === "number" &&
    Number.isFinite(spot.latitude) &&
    typeof spot.longitude === "number" &&
    Number.isFinite(spot.longitude)
  );
}

function legWalkMinutes(from: MockSpot, to: MockSpot): number | null {
  if (!hasCoords(from) || !hasCoords(to)) return null;
  const meters = haversineDistanceMeters(
    { latitude: from.latitude!, longitude: from.longitude! },
    { latitude: to.latitude!, longitude: to.longitude! },
  );
  return Math.max(1, Math.round(meters / WALK_METERS_PER_MINUTE));
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

  const dayCourse = tour
    ? findDayCourse(tour.workTitle, tour.group)
    : null;

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

  const walkEstimate = useMemo(
    () => estimateTourWalkStats(selectedSpots),
    [selectedSpots],
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

  function applyDayCourseStops() {
    if (!dayCourse) return;
    const names = new Set(dayCourse.suggestedStopNames);
    const ids = orderedSpots
      .filter((spot) => names.has(spot.name))
      .slice(0, GOOGLE_MAPS_MOBILE_MAX_STOPS)
      .map((spot) => spot.id);
    if (ids.length > 0) {
      setSelectedIds(ids);
      setOriginKind("station");
      setModeOverride("walking");
    }
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
  const selectedCount = selectedSpots.length;
  const atMaxSelection =
    selectedCount >= GOOGLE_MAPS_MOBILE_MAX_STOPS &&
    orderedSpots.length > GOOGLE_MAPS_MOBILE_MAX_STOPS;

  const startLabel =
    effectiveOrigin === "station" && nearestStation
      ? nearestStation
      : "現在地";

  const lunchPreview: DayCourseLunch[] = dayCourse?.lunch.slice(0, 3) ?? [];
  const lunchInsertAfter = Math.max(0, Math.floor((selectedCount - 1) / 2));

  return (
    <div className="mock-tour-layout">
      <DesignHeader title="旅程" backHref={titlesPath} />
      <div className="mock-tour-board">
        <aside className="mock-tour-panel">
          <header className="mock-tour-panel-head">
            <p className="mock-section-label">{tour.group}</p>
            <h2 className="mock-tour-title">{tour.workTitle}</h2>
            <p className="mock-tour-meta">
              全{orderedSpots.length}か所 · 今回 {selectedCount}か所
              {walkEstimate ? ` · ${walkEstimate.label}` : ""}
            </p>
            {dayCourse ? (
              <div className="mock-tour-course-chip">
                <span>{dayCourse.title}</span>
                <span>{dayCourse.durationLabel}</span>
              </div>
            ) : null}
          </header>

          <ol className="mock-itinerary">
            <li className="mock-itinerary-start">
              <span className="mock-itinerary-start-badge">開始地点</span>
              <div className="mock-itinerary-start-body">
                <p className="mock-itinerary-name">{startLabel}</p>
                <p className="mock-itinerary-sub">
                  {effectiveOrigin === "station"
                    ? "最寄り駅から出発"
                    : "いまいる場所から出発"}
                </p>
              </div>
            </li>

            {orderedSpots.map((spot) => {
              const selected = effectiveSelectedIds.includes(spot.id);
              const orderIndex = selected
                ? selectedSpots.findIndex((item) => item.id === spot.id) + 1
                : null;
              const disableAdd =
                !selected && selectedCount >= GOOGLE_MAPS_MOBILE_MAX_STOPS;
              const disableRemove = selected && selectedCount <= 1;
              const inDayCourse = dayCourse?.suggestedStopNames.includes(
                spot.name,
              );
              const prevSelected =
                orderIndex && orderIndex > 1
                  ? selectedSpots[orderIndex - 2]
                  : null;
              const legMinutes =
                selected && prevSelected
                  ? legWalkMinutes(prevSelected, spot)
                  : null;

              return (
                <li
                  key={spot.id}
                  className={cn(
                    "mock-itinerary-stop",
                    !selected && "mock-itinerary-stop-off",
                  )}
                >
                  {legMinutes ? (
                    <p className="mock-itinerary-leg">
                      徒歩 約{legMinutes}分
                    </p>
                  ) : null}
                  <div className="mock-itinerary-row">
                    <button
                      type="button"
                      className={cn(
                        "mock-itinerary-num",
                        selected && "mock-itinerary-num-on",
                      )}
                      aria-pressed={selected}
                      aria-label={
                        selected
                          ? `${spot.name}をルートから外す`
                          : `${spot.name}をルートに入れる`
                      }
                      disabled={disableAdd || disableRemove}
                      onClick={() => toggleStop(spot.id)}
                    >
                      {selected ? orderIndex : "−"}
                    </button>
                    <div className="mock-itinerary-body">
                      <button
                        type="button"
                        className="mock-itinerary-toggle"
                        disabled={disableAdd || disableRemove}
                        onClick={() => toggleStop(spot.id)}
                      >
                        <p className="mock-itinerary-name">
                          {spot.name}
                          {inDayCourse ? (
                            <span className="mock-day-course-tag">半日</span>
                          ) : null}
                        </p>
                        <p className="mock-itinerary-sub">
                          {selected
                            ? `滞在時間：約${DEFAULT_STAY_MINUTES}分`
                            : "ルートから外しています"}
                        </p>
                        {selected ? (
                          <p className="mock-itinerary-address">
                            {spot.prefecture} · {spot.address}
                          </p>
                        ) : null}
                      </button>
                      <Link
                        href={`${spotsBase}/${spot.id}`}
                        className="mock-itinerary-detail"
                      >
                        詳細
                      </Link>
                    </div>
                  </div>

                  {selected &&
                  orderIndex === lunchInsertAfter + 1 &&
                  lunchPreview.length > 0 ? (
                    <div className="mock-itinerary-pass">
                      <p className="mock-itinerary-pass-label">ランチ候補</p>
                      <ul className="mock-itinerary-pass-list">
                        {lunchPreview.map((lunch) => (
                          <li key={lunch.name}>
                            <a
                              href={buildLunchMapsUrl(lunch)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {lunch.name}
                              <span>{lunch.budget}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ol>

          {dayCourse ? (
            <section className="mock-tour-side-block">
              <button
                type="button"
                className="mock-btn mock-btn-secondary"
                onClick={applyDayCourseStops}
              >
                半日コースの聖地だけ選ぶ
              </button>
              <ul className="mock-day-course-tips">
                {dayCourse.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {isMulti ? (
            <section className="mock-tour-side-block">
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

              <p className="mock-section-label" style={{ marginTop: "1rem" }}>
                移動方法
              </p>
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
            </section>
          ) : null}

          {atMaxSelection ? (
            <p className="mock-tour-footnote">
              すでに {GOOGLE_MAPS_MOBILE_MAX_STOPS}
              か所選んでいます。別の聖地を入れるときは、どれかを外してください。
            </p>
          ) : null}

          <div className="mock-tour-cta">
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
          </div>
        </aside>

        <section className="mock-tour-map" aria-label="旅程マップ">
          <SpotsMap
            spots={selectedSpots}
            fill
            numbered
            showRouteLine
            compactControls
            interactive={false}
          />
        </section>
      </div>
    </div>
  );
}
