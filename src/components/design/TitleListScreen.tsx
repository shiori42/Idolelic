"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockPage } from "@/components/design/mock-ui";
import type { MockSpot } from "@/data/mock-spots";
import { useUserSpots } from "@/features/user-spots";
import { homePathFor, withAppPrefix } from "@/lib/auth/paths";
import {
  encodeWorkTourId,
  filterWorkTours,
  groupSpotsByWork,
  type WorkTour,
} from "@/lib/spots/work-tours";

type TitleListScreenProps = {
  officialSpots: MockSpot[];
  initialQuery?: string;
};

function TourList({
  tours,
  titlesBase,
}: {
  tours: WorkTour[];
  titlesBase: string;
}) {
  return (
    <ul className="mock-list mt-2">
      {tours.map((tour) => (
        <li key={`${tour.group}::${tour.workTitle}`}>
          <Link
            href={`${titlesBase}/${encodeURIComponent(encodeWorkTourId(tour.group, tour.workTitle))}`}
            className="mock-list-item"
          >
            <p className="mock-list-title">{tour.workTitle}</p>
            <p className="mock-list-sub">
              {tour.group} · {tour.spots.length}か所
              {tour.spots.length >= 2 ? " · 複数経由地で案内" : ""}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function TitleListScreen({
  officialSpots,
  initialQuery = "",
}: TitleListScreenProps) {
  const pathname = usePathname();
  const homePath = homePathFor(pathname);
  const titlesBase = withAppPrefix(pathname, "/titles");
  const { communitySpots } = useUserSpots();
  const query = initialQuery.trim();

  const tours = useMemo(
    () =>
      filterWorkTours(
        groupSpotsByWork([...officialSpots, ...communitySpots]),
        query,
      ),
    [communitySpots, officialSpots, query],
  );
  const multi = tours.filter((tour) => tour.spots.length >= 2);
  const single = tours.filter((tour) => tour.spots.length < 2);

  return (
    <>
      <DesignHeader title="曲名から巡る" backHref={homePath} />
      <MockPage>
        <p className="text-sm text-[var(--mock-muted)]">
          曲名で探すと、その作品の聖地をまとめて Google
          マップで案内します（複数経由地対応）。
        </p>

        <form action={titlesBase} method="get" className="mock-title-search">
          <span className="mock-home-search-icon" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            name="q"
            className="mock-home-search-input"
            defaultValue={query}
            placeholder="曲名・作品名（例: サイレントマジョリティー）"
            aria-label="曲名で検索"
            enterKeyHint="search"
            autoComplete="off"
          />
          <button type="submit" className="mock-title-search-submit">
            検索
          </button>
        </form>

        {query ? (
          <p className="text-xs text-[var(--mock-muted)]">
            「{query}」の検索結果 ·{" "}
            <Link
              href={titlesBase}
              className="font-semibold text-[var(--mock-brand)]"
            >
              クリア
            </Link>
          </p>
        ) : null}

        {multi.length === 0 && single.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--mock-border)] py-10 text-center text-sm text-[var(--mock-muted)]">
            {query
              ? "一致する曲名が見つかりません。"
              : "まだ巡れるタイトルがありません。"}
          </p>
        ) : (
          <>
            {multi.length > 0 ? (
              <section>
                <p className="mock-section-label">
                  複数聖地があるタイトル（経由地付きルート）
                </p>
                <TourList tours={multi} titlesBase={titlesBase} />
              </section>
            ) : null}

            {single.length > 0 ? (
              <section>
                <p className="mock-section-label">1か所のタイトル</p>
                <TourList tours={single} titlesBase={titlesBase} />
              </section>
            ) : null}
          </>
        )}
      </MockPage>
    </>
  );
}
