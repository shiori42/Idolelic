"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { DesignHeader } from "@/components/design/DesignHeader";
import { WalkNavScreen } from "@/components/design/WalkNavScreen";
import { MockPage } from "@/components/design/mock-ui";
import { isDesignPath } from "@/lib/auth/paths";

function WalkNavHeader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const design = isDesignPath(pathname);
  const spotId = searchParams.get("spot");

  const homePath = design ? "/design/home" : "/home";
  const backHref = spotId
    ? `${design ? "/design" : ""}/spots/${encodeURIComponent(spotId)}`
    : homePath;

  return <DesignHeader title="散歩ナビ" backHref={backHref} />;
}

export function WalkNavPageContent() {
  return (
    <>
      <Suspense fallback={<DesignHeader title="散歩ナビ" />}>
        <WalkNavHeader />
      </Suspense>
      <MockPage>
        <Suspense
          fallback={
            <p className="text-sm text-[var(--mock-muted)]">読み込み中…</p>
          }
        >
          <WalkNavScreen />
        </Suspense>
      </MockPage>
    </>
  );
}
