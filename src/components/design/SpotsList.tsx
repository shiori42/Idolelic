"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { MockSpot } from "@/data/mock-spots";
import { withAppPrefix } from "@/lib/auth/paths";
import { cn } from "@/lib/utils/cn";

type SpotsListProps = {
  spots: MockSpot[];
  communityCount?: number;
};

export function SpotsList({
  spots,
  communityCount = 0,
}: SpotsListProps) {
  const pathname = usePathname();
  const spotsBase = withAppPrefix(pathname, "/spots");
  const registerPath = withAppPrefix(pathname, "/spots/new");

  return (
    <>
      <p className="text-xs text-[var(--mock-muted)]">
        {spots.length} 件
        {communityCount > 0 ? `（みんなの登録 ${communityCount} 件）` : null}
      </p>

      <ul className="space-y-3">
        {spots.map((spot) => (
          <li key={spot.id}>
            <Link
              href={`${spotsBase}/${spot.id}`}
              className={cn(
                "mock-spot-card",
                spot.source === "community" && "mock-spot-card-community",
              )}
            >
              <div className="mock-spot-card-thumb">
                {spot.source === "community" ? (
                  <span className="mock-spot-badge-community">みんなの聖地</span>
                ) : null}
                <span className="mock-spot-card-distance">{spot.prefecture}</span>
              </div>
              <div className="mock-spot-card-body">
                <p className="mock-spot-card-title">{spot.name}</p>
                <p className="mock-spot-card-sub">
                  {spot.workTitle} · {spot.category}
                </p>
                {spot.submittedBy ? (
                  <p className="mt-1 text-[0.625rem] text-[var(--mock-muted)]">
                    登録: {spot.submittedBy}
                  </p>
                ) : null}
                <p className="mock-spot-card-cta">タップで詳細を見る →</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {spots.length === 0 ? (
        <p
          className={cn(
            "rounded-xl border border-dashed border-[var(--mock-border)]",
            "py-8 text-center text-sm text-[var(--mock-muted)]",
          )}
        >
          条件に合う聖地がありません
        </p>
      ) : null}

      <Link href={registerPath} className="mock-register-fab">
        ＋ 聖地を登録
      </Link>
    </>
  );
}
