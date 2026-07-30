"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { withAppPrefix } from "@/lib/auth/paths";

export function BoardBanner() {
  const pathname = usePathname();
  const boardPath = withAppPrefix(pathname, "/board");

  return (
    <Link href={boardPath} className="mock-banner-board">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">聖地探し掲示板</p>
        <p className="mt-0.5 text-xs leading-relaxed opacity-90">
          場所がわからない聖地は、みんなで特定してから地図に残す
        </p>
      </div>
      <span className="mock-btn mock-btn-secondary !w-auto shrink-0 px-4 py-2 text-xs">
        見る
      </span>
    </Link>
  );
}
