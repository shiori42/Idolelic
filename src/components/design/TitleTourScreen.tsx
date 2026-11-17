"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockPage } from "@/components/design/mock-ui";
import type { MockSpot } from "@/data/mock-spots";
import {
  buildLunchMapsUrl,
  findDayCourse,
} from "@/data/day-courses";
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
  estimateTourWalkStats,
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
          {walkEstimate ? (
            <p className="mt-2 text-sm font-medium text-[var(--mock-brand-deep)]">
              {walkEstimate.label}
            </p>
          ) : null}
        </div>

        {dayCourse ? (
          <section className="mock-day-course">
            <p className="mock-section-label">{dayCourse.title}</p>
            <p className="text-sm leading-relaxed text-[var(--mock-muted)]">
              {dayCourse.summary}
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--mock-brand-deep)]">
              {dayCourse.durationLabel}
            </p>
            <ol className="mock-day-course-steps">
              <li>最寄り駅（{nearestStation ?? "駅"}）を出発</li>
              <li>
                おすすめ聖地：{dayCourse.suggestedStopNames.join(" → ")}
              </li>
              <li>途中でランチ</li>
              <li>時間があれば残りの聖地を追加</li>
            </ol>
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

        <div>
          <p className="mock-section-label">回る聖地を選ぶ</p>
          {isMulti ? (
            <p className="mt-1 text-xs leading-relaxed text-[var(--mock-muted)]">
              外したい聖地をタップして自分で減らせます。もう一度タップで戻せます。スマホの
              Google マップは最大 {GOOGLE_MAPS_MOBILE_MAX_STOPS} か所です。
            </p>
          ) : null}

          <ol className="mock-list mt-2">
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
                      disabled={disableAdd || disableRemove}
                      onClick={() => toggleStop(spot.id)}
                    >
                      {selected ? orderIndex : "−"}
                    </button>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        className="mock-tour-stop-toggle"
                        disabled={disableAdd || disableRemove}
                        onClick={() => toggleStop(spot.id)}
                      >
                        <p className="mock-list-title">
                          {spot.name}
                          {inDayCourse ? (
                            <span className="mock-day-course-tag">半日</span>
                          ) : null}
                        </p>
                        <p className="mock-list-sub">
                          {selected
                            ? `${spot.prefecture} · ${spot.address}`
                            : "ルートから外す"}
                        </p>
                      </button>
                      <Link
                        href={`${spotsBase}/${spot.id}`}
                        className="mock-tour-stop-detail"
                      >
                        詳細
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {dayCourse ? (
          <section>
            <p className="mock-section-label">おすすめランチ</p>
            <p className="mt-1 text-xs leading-relaxed text-[var(--mock-muted)]">
              聖地の合間に立ち寄りやすい店です。営業時間は現地で確認してください。
            </p>
            <ul className="mock-lunch-list">
              {dayCourse.lunch.map((lunch) => (
                <li key={lunch.name} className="mock-lunch-card">
                  <div className="min-w-0 flex-1">
                    <p className="mock-list-title">{lunch.name}</p>
                    <p className="mock-list-sub">{lunch.place}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[var(--mock-muted)]">
                      {lunch.note}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-[var(--mock-brand-deep)]">
                      {lunch.budget}
                    </p>
                  </div>
                  <a
                    href={buildLunchMapsUrl(lunch)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mock-lunch-maps"
                  >
                    地図
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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
