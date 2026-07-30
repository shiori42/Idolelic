"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { SpotRegisterHeaderAction } from "@/components/design/SpotRegisterHeaderAction";
import { SpotsAdvancedFilters } from "@/components/design/SpotsAdvancedFilters";
import { SpotsPageList } from "@/components/design/SpotsPageList";
import type { MockSpot } from "@/data/mock-spots";
import { useUserSpots } from "@/features/user-spots";
import { applySpotFilters, listRegisteredGroups } from "@/lib/spots-helpers";
import {
  buildSpotsSearchUrl,
  hasAdvancedFilters,
  type SpotsFilterState,
} from "@/lib/spots-filter";
import { cn } from "@/lib/utils/cn";

const SpotsMap = dynamic(
  () => import("@/components/design/SpotsMap").then((mod) => mod.SpotsMap),
  {
    ssr: false,
    loading: () => (
      <div className="spots-map-shell spots-map-fill">
        <div className="spots-map spots-map-loading" aria-hidden />
      </div>
    ),
  },
);

type HomeMapScreenProps = {
  filters: SpotsFilterState;
  officialSpots: MockSpot[];
  isLoggedIn: boolean;
  showRegisteredMessage?: boolean;
  homePath?: string;
};

export function HomeMapScreen({
  filters,
  officialSpots,
  isLoggedIn,
  showRegisteredMessage,
  homePath = "/home",
}: HomeMapScreenProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [listExpanded, setListExpanded] = useState(false);
  const { communitySpots } = useUserSpots();

  const groupSearchValue = filters.group !== "すべて" ? filters.group : "";
  const advancedActive = hasAdvancedFilters(filters);

  const registeredGroups = useMemo(
    () => listRegisteredGroups([...communitySpots, ...officialSpots]),
    [communitySpots, officialSpots],
  );

  const mapSpots = useMemo(() => {
    const communityFiltered = applySpotFilters(communitySpots, filters);
    return [...communityFiltered, ...officialSpots];
  }, [communitySpots, filters, officialSpots]);

  const spotCount = useMemo(() => mapSpots.length, [mapSpots]);

  return (
    <div className="mock-home-map-screen">
      <div className="mock-home-map-layer" aria-hidden={filtersOpen}>
        <SpotsMap spots={mapSpots} fill />
      </div>

      {filtersOpen ? (
        <button
          type="button"
          className="mock-home-filter-backdrop"
          aria-label="絞り込みを閉じる"
          onClick={() => setFiltersOpen(false)}
        />
      ) : null}

      <div className="mock-home-top">
        <div className="mock-home-search-row">
          <form action={homePath} method="get" className="mock-home-search-form">
            {filters.category !== "すべて" ? (
              <input type="hidden" name="category" value={filters.category} />
            ) : null}
            {filters.region ? (
              <input type="hidden" name="region" value={filters.region} />
            ) : null}
            {filters.prefecture !== "すべて" ? (
              <input type="hidden" name="prefecture" value={filters.prefecture} />
            ) : null}
            <span className="mock-home-search-icon" aria-hidden>
              ⌕
            </span>
            <input
              type="search"
              name="group"
              className="mock-home-search-input"
              defaultValue={groupSearchValue}
              placeholder="アイドル・グループ名"
              aria-label="アイドル・グループ名で検索"
              enterKeyHint="search"
            />
          </form>

          <button
            type="button"
            className={cn(
              "mock-home-filter-btn",
              (advancedActive || filtersOpen) && "mock-home-filter-btn-active",
            )}
            aria-expanded={filtersOpen}
            aria-label="絞り込み"
            title="絞り込み"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <span className="mock-home-filter-icon" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            {advancedActive ? (
              <span className="mock-home-filter-dot" aria-hidden />
            ) : null}
          </button>

          <SpotRegisterHeaderAction
            isLoggedIn={isLoggedIn}
            className="mock-home-register-btn"
          />
        </div>

        {filtersOpen ? (
          <div className="mock-home-filter-panel">
            <div className="mock-home-filter-panel-head">
              <p className="mock-home-filter-panel-title">絞り込み</p>
              <button
                type="button"
                className="mock-home-filter-panel-close"
                onClick={() => setFiltersOpen(false)}
              >
                閉じる
              </button>
            </div>
            <SpotsAdvancedFilters
              filters={filters}
              groups={registeredGroups}
              homePath={homePath}
            />
            {advancedActive ? (
              <a
                href={buildSpotsSearchUrl(
                  filters,
                  {
                    group: "すべて",
                    category: "すべて",
                    region: null,
                    prefecture: "すべて",
                  },
                  homePath,
                )}
                className="mock-home-filter-clear"
              >
                絞り込みをクリア
              </a>
            ) : null}
          </div>
        ) : null}

        {!filtersOpen && groupSearchValue ? (
          <p className="mock-home-search-hint">
            「{filters.group}」で検索中
            {" · "}
            <a
              href={buildSpotsSearchUrl(filters, { group: "すべて" }, homePath)}
              className="font-medium text-[var(--mock-brand)]"
            >
              クリア
            </a>
          </p>
        ) : null}
      </div>

      {showRegisteredMessage ? (
        <p className="mock-home-toast mock-banner-community-success">
          聖地を登録しました
        </p>
      ) : null}

      <div
        className={cn(
          "mock-home-bottom-sheet",
          listExpanded && "mock-home-bottom-sheet-expanded",
        )}
      >
        <button
          type="button"
          className="mock-home-bottom-sheet-handle"
          aria-expanded={listExpanded}
          onClick={() => setListExpanded((expanded) => !expanded)}
        >
          <span className="mock-home-bottom-sheet-grip" aria-hidden />
          <span className="mock-home-bottom-sheet-label">
            {spotCount}件の聖地
          </span>
          <span className="mock-home-bottom-sheet-chevron" aria-hidden>
            {listExpanded ? "▼" : "▲"}
          </span>
        </button>

        {listExpanded ? (
          <div className="mock-home-bottom-sheet-body">
            <SpotsPageList
              officialSpots={officialSpots}
              filters={filters}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
