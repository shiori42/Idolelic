"use client";

import { useUserSpots } from "@/features/user-spots";
import { applySpotFilters } from "@/lib/spots-helpers";
import type { SpotsFilterState } from "@/lib/spots-filter";
import type { MockSpot } from "@/data/mock-spots";

import { SpotsList } from "./SpotsList";

type SpotsPageListProps = {
  officialSpots: MockSpot[];
  filters: SpotsFilterState;
  showRegisteredMessage?: boolean;
};

export function SpotsPageList({
  officialSpots,
  filters,
  showRegisteredMessage,
}: SpotsPageListProps) {
  const { communitySpots } = useUserSpots();

  const communityFiltered = applySpotFilters(communitySpots, filters);
  const merged = [...communityFiltered, ...officialSpots];

  return (
    <>
      {showRegisteredMessage ? (
        <p className="mock-banner-community-success">
          聖地を登録しました。みんなのマップに追加されました。
        </p>
      ) : null}
      <SpotsList
        spots={merged}
        communityCount={communityFiltered.length}
      />
    </>
  );
}
