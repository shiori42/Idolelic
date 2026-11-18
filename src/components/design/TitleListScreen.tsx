"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockPage } from "@/components/design/mock-ui";
import type { MockSpot } from "@/data/mock-spots";
import { findDayCourse } from "@/data/day-courses";
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
    <ul className="mock-title-catalog">
      {tours.map((tour) => {
        const dayCourse = findDayCourse(tour.workTitle, tour.group);
        const multiStop = tour.spots.length >= 2;

        return (
          <li key={`${tour.group}::${tour.workTitle}`}>
            <Link
              href={`${titlesBase}/${encodeURIComponent(encodeWorkTourId(tour.group, tour.workTitle))}`}
              className="mock-title-card"
            >
              <div className="mock-title-card-main">
                <p className="mock-title-card-group">{tour.group}</p>
                <p className="mock-title-card-name">{tour.workTitle}</p>
                <div className="mock-title-card-tags">
                  <span className="mock-title-tag">
                    {tour.spots.length}か所
                  </span>
                  {multiStop ? (
                    <span className="mock-title-tag">経由地ルート</span>
                  ) : null}
                  {dayCourse ? (
                    <span className="mock-title-tag mock-title-tag-accent">
                      半日コース
                    </span>
                  ) : null}
                  {dayCourse ? (
                    <span className="mock-title-tag mock-title-tag-accent">
                      ランチ付き
                    </span>
                  ) : null}
                </div>
              </div>
              <span className="mock-title-card-chevron" aria-hidden>
                ›
              </span>
            </Link>
          </li>
        );
      })}
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
      <MockPage className="mock-title-page">
        <section className="mock-title-intro">
          <h2 className="mock-title-intro-heading">曲を選んで歩く</h2>
          <p className="mock-title-intro-text">
            作品ごとの聖地をまとめて案内します。半日コースとランチがあるタイトルもあります。
          </p>
        </section>

        <form action={titlesBase} method="get" className="mock-title-search">
          <span className="mock-home-search-icon" aria-hidden>
            ⌕
          </span>
          <input
            type="search"
            name="q"
            className="mock-home-search-input"
            defaultValue={query}
            placeholder="曲名・グループ名で探す"
            aria-label="曲名で検索"
            enterKeyHint="search"
            autoComplete="off"
          />
          <button type="submit" className="mock-title-search-submit">
            検索
          </button>
        </form>

        {query ? (
          <p className="mock-title-result-meta">
            「{query}」· {tours.length}件 ·{" "}
            <Link href={titlesBase} className="mock-title-clear">
              クリア
            </Link>
          </p>
        ) : (
          <p className="mock-title-result-meta">
            {tours.length}タイトル
            {multi.length > 0 ? ` · ルートあり ${multi.length}` : ""}
          </p>
        )}

        {multi.length === 0 && single.length === 0 ? (
          <p className="mock-title-empty">
            {query
              ? "一致する曲名が見つかりません。"
              : "まだ巡れるタイトルがありません。"}
          </p>
        ) : (
          <>
            {multi.length > 0 ? (
              <section className="mock-title-section">
                <div className="mock-title-section-head">
                  <h3>ルートで巡れる</h3>
                  <span>{multi.length}</span>
                </div>
                <TourList tours={multi} titlesBase={titlesBase} />
              </section>
            ) : null}

            {single.length > 0 ? (
              <section className="mock-title-section">
                <div className="mock-title-section-head">
                  <h3>1か所のタイトル</h3>
                  <span>{single.length}</span>
                </div>
                <TourList tours={single} titlesBase={titlesBase} />
              </section>
            ) : null}
          </>
        )}
      </MockPage>
    </>
  );
}
