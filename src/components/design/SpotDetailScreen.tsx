"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { DesignHeader } from "@/components/design/DesignHeader";
import { MockMap } from "@/components/design/MockMap";
import { useMockAuth } from "@/components/design/MockAuthProvider";
import { MockButton, MockCard, MockPage } from "@/components/design/mock-ui";
import { YoutubeMvEmbed } from "@/components/design/YoutubeMvEmbed";
import { MOCK_LOGGED_IN_USER, type MockSpot } from "@/data/mock-spots";
import { useMemories } from "@/features/memories";
import { useUserSpots } from "@/features/user-spots";
import {
  buildGoogleMapsDirectionsUrl,
  type GoogleMapsTravelMode,
} from "@/lib/spots/google-maps";
import {
  extractYoutubeVideoId,
  resolveMvUrl,
} from "@/lib/spots/mv-url";
import { findSpotById } from "@/lib/spots-helpers";
import { cn } from "@/lib/utils/cn";

type SpotDetailScreenProps = {
  spotId: string;
  officialSpots?: MockSpot[];
};

export function SpotDetailScreen({
  spotId,
  officialSpots,
}: SpotDetailScreenProps) {
  const pathname = usePathname();
  const design = pathname.startsWith("/design");
  const { communitySpots } = useUserSpots();
  const { getMemoriesForSpot, addMemory } = useMemories();
  const { isLoggedIn, user } = useMockAuth();

  const spot = findSpotById(spotId, communitySpots, officialSpots);
  const memories = getMemoriesForSpot(spotId);
  const homePath = design ? "/design/home" : "/home";
  const walkPath = design ? "/design/walk" : "/walk";
  const mvUrl = spot
    ? resolveMvUrl({
        group: spot.group,
        workTitle: spot.workTitle,
        mvUrl: spot.mvUrl,
      })
    : null;
  const mvVideoId = extractYoutubeVideoId(spot?.mvUrl ?? mvUrl);

  const [body, setBody] = useState("");
  const [visitedEra, setVisitedEra] = useState("");
  const [travelMode, setTravelMode] =
    useState<GoogleMapsTravelMode>("walking");

  if (!spot) {
    return (
      <>
        <DesignHeader title="聖地詳細" backHref={homePath} />
        <MockPage>
          <p className="py-12 text-center text-sm text-[var(--mock-muted)]">
            聖地が見つかりません
          </p>
        </MockPage>
      </>
    );
  }

  function handlePostMemory() {
    if (!isLoggedIn || !body.trim()) return;
    addMemory(spotId, {
      body,
      visitedEra,
      author: user?.displayName ?? MOCK_LOGGED_IN_USER.name,
    });
    setBody("");
    setVisitedEra("");
  }

  return (
    <>
      <DesignHeader title="聖地詳細" backHref={homePath} />
      <MockPage className="mock-detail-page">
        <MockMap height="sm" showPins />

        <div className="mock-detail-hero">
          <div className="flex flex-wrap gap-2">
            <span
              className={cn(
                "mock-detail-badge",
                spot.source === "community"
                  ? "mock-detail-badge-community"
                  : "mock-detail-badge-official",
              )}
            >
              {spot.source === "community" ? "みんなの登録" : "公式"}
            </span>
            {spot.era ? (
              <span className="mock-detail-badge mock-detail-badge-era">
                {spot.era}
              </span>
            ) : null}
            <span className="mock-detail-badge">{spot.category}</span>
          </div>
          <h2 className="mock-detail-title">{spot.name}</h2>
          <p className="mock-detail-sub">
            {spot.group} · {spot.prefecture}
          </p>
        </div>

        <MockCard pad className="space-y-3">
          <p className="mock-section-label">概要</p>
          <p className="text-sm leading-relaxed">{spot.description}</p>
          <dl className="mock-detail-meta">
            <div>
              <dt>住所</dt>
              <dd>{spot.address}</dd>
            </div>
            {spot.workTitle ? (
              <div>
                <dt>作品・関連</dt>
                <dd>{spot.workTitle}</dd>
              </div>
            ) : null}
            {spot.submittedBy ? (
              <div>
                <dt>登録者</dt>
                <dd>{spot.submittedBy}</dd>
              </div>
            ) : null}
          </dl>
          {mvVideoId ? (
            <YoutubeMvEmbed
              url={spot.mvUrl ?? mvUrl}
              title={spot.workTitle || `${spot.group} MV`}
            />
          ) : mvUrl ? (
            <a
              href={mvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mock-btn mock-btn-secondary"
            >
              YouTubeでMVを探す
            </a>
          ) : null}
        </MockCard>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="mock-section-label !mb-0">思い出</p>
            <p className="text-xs text-[var(--mock-muted)]">{memories.length} 件</p>
          </div>

          <ul className="space-y-3">
            {memories.map((memory) => (
              <li key={memory.id} className="mock-memory-card">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{memory.author}</p>
                  <p className="shrink-0 text-[0.625rem] text-[var(--mock-muted)]">
                    {memory.createdAt}
                  </p>
                </div>
                {memory.visitedEra ? (
                  <p className="mt-1 text-xs font-medium text-[var(--mock-brand)]">
                    訪問: {memory.visitedEra}
                  </p>
                ) : null}
                <p className="mt-2 text-sm leading-relaxed text-[var(--mock-text)]">
                  {memory.body}
                </p>
              </li>
            ))}
          </ul>

          {isLoggedIn ? (
            <MockCard pad className="space-y-3">
              <p className="text-sm font-semibold">思い出を残す</p>
              <input
                className="mock-form-input"
                value={visitedEra}
                onChange={(e) => setVisitedEra(e.target.value)}
                placeholder="いつ頃？（例: 2012年頃）"
              />
              <textarea
                className="mock-form-textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="この聖地の思い出を書き残す"
                rows={3}
              />
              <button
                type="button"
                className="mock-btn mock-btn-primary"
                onClick={handlePostMemory}
                disabled={!body.trim()}
              >
                投稿する
              </button>
            </MockCard>
          ) : (
            <MockCard pad className="text-center">
              <p className="text-sm font-medium">ログインすると思い出を投稿できます</p>
              <Link
                href={
                  design
                    ? `/design/login?next=/design/spots/${spotId}`
                    : `/login?next=/spots/${spotId}`
                }
                className="mt-3 inline-block text-sm font-semibold text-[var(--mock-brand)]"
              >
                ログインする
              </Link>
            </MockCard>
          )}
        </section>

        <div className="space-y-3">
          <div>
            <p className="mock-section-label">移動方法</p>
            <div className="mock-mode-tabs">
              <button
                type="button"
                className={cn(
                  "mock-mode-tab",
                  travelMode === "walking" && "mock-mode-tab-active",
                )}
                onClick={() => setTravelMode("walking")}
              >
                徒歩
              </button>
              <button
                type="button"
                className={cn(
                  "mock-mode-tab",
                  travelMode === "transit" && "mock-mode-tab-active",
                )}
                onClick={() => setTravelMode("transit")}
              >
                電車＋徒歩
              </button>
            </div>
          </div>
          <MockButton
            href={`${walkPath}?spot=${encodeURIComponent(spot.id)}&mode=${travelMode}`}
          >
            アプリ内ナビで案内（歩数計測）
          </MockButton>
          <a
            href={buildGoogleMapsDirectionsUrl(spot, travelMode)}
            target="_blank"
            rel="noopener noreferrer"
            className="mock-btn mock-btn-secondary"
          >
            Google Mapsで
            {travelMode === "walking" ? "徒歩" : "電車＋徒歩"}
            案内
          </a>
          <p className="text-xs leading-relaxed text-[var(--mock-muted)]">
            歩数を記録したいときはアプリ内ナビを使ってください。Google Maps
            に切り替えると、バックグラウンドでは計測が止まります。
          </p>
        </div>
      </MockPage>
    </>
  );
}
