"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isDesignPath } from "@/lib/auth/paths";
import { cn } from "@/lib/utils/cn";

function buildNav(design: boolean) {
  const prefix = design ? "/design" : "";
  return [
    { href: `${prefix}/home`, label: "ホーム", icon: "⌂" },
    { href: `${prefix}/board`, label: "掲示板", icon: "板" },
    { href: `${prefix}/profile`, label: "マイ", icon: "人" },
  ] as const;
}

function hiddenPaths(design: boolean) {
  const prefix = design ? "/design" : "";
  return [
    `${prefix}/login`,
    `${prefix}/signup`,
    `${prefix}/spots/new`,
    `${prefix}/board/new`,
  ];
}

function isNavActive(pathname: string, href: string, homeHref: string) {
  if (href === homeHref) {
    const spotsPrefix = homeHref.replace("/home", "/spots/");
    return (
      pathname === href ||
      (pathname.startsWith(spotsPrefix) && !pathname.endsWith("/new"))
    );
  }

  if (href.endsWith("/profile")) {
    return (
      pathname === href ||
      pathname.endsWith("/guide") ||
      pathname === "/admin" ||
      pathname.startsWith("/admin/")
    );
  }

  if (href.endsWith("/board")) {
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) && !pathname.endsWith("/new"))
    );
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomNav() {
  const pathname = usePathname();
  const design = isDesignPath(pathname);
  const nav = buildNav(design);
  const hidden = hiddenPaths(design);

  if (hidden.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return null;
  }

  const homeHref = nav[0].href;

  return (
    <nav className="mock-nav" aria-label="メイン">
      <div className="mock-nav-inner">
        {nav.map(({ href, label, icon }) => {
          const active = isNavActive(pathname, href, homeHref);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "mock-nav-link",
                active && "mock-nav-link-active",
              )}
            >
              <span className="mock-nav-icon" aria-hidden>
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
