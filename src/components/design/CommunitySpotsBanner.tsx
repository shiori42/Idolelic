"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useUserSpots } from "@/features/user-spots";
import { isDesignPath } from "@/lib/auth/paths";

export function CommunitySpotsBanner() {
  const pathname = usePathname();
  const { communityCount } = useUserSpots();
  const registerPath = isDesignPath(pathname)
    ? "/design/spots/new"
    : "/spots/new";

  return (
    <div className="mock-banner-community">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">みんなで作る聖地マップ</p>
        <p className="mt-0.5 text-xs leading-relaxed opacity-90">
          あなたの記憶の場所を登録して、みんなの地図を一緒に残そう
        </p>
        <p className="mt-1 text-xs font-medium">
          みんなの登録: {communityCount} 件
        </p>
      </div>
      <Link
        href={registerPath}
        className="mock-btn mock-btn-primary !w-auto shrink-0 px-4 py-2 text-xs"
      >
        ＋ 登録
      </Link>
    </div>
  );
}
