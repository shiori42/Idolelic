"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isDesignPath } from "@/lib/auth/paths";

type SpotRegisterHeaderActionProps = {
  isLoggedIn: boolean;
  className?: string;
};

export function SpotRegisterHeaderAction({
  className,
}: SpotRegisterHeaderActionProps) {
  const pathname = usePathname();
  const design = isDesignPath(pathname);
  const registerPath = design ? "/design/spots/new" : "/spots/new";

  return (
    <Link
      href={registerPath}
      className={className ?? "font-semibold text-[var(--mock-brand)]"}
      aria-label="聖地を登録"
    >
      ＋
    </Link>
  );
}
