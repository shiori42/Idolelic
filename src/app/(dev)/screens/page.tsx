import Link from "next/link";

const SCREENS = [
  {
    href: "/home",
    label: "1. \u30db\u30fc\u30e0\uff08\u8056\u5730\u30de\u30c3\u30d7\uff09",
    desc: "\u5168\u9762\u5730\u56f3 \u00b7 \u691c\u7d22\u30d0\u30fc \u00b7 \u6761\u4ef6\u7d5e\u308a\u8fbc\u307f",
  },
  {
    href: "/spots/1",
    label: "1b. \u8056\u5730\u8a73\u7d30",
    desc: "\u6982\u8981\u30fb\u601d\u3044\u51fa\u30b3\u30e1\u30f3\u30c8\u30fb\u6848\u5185\u30b9\u30bf\u30fc\u30c8",
  },
  {
    href: "/spots/new",
    label: "1c. \u8056\u5730\u767b\u9332",
    desc: "\u6700\u5c0f\u9805\u76ee \u00b7 \u4f4f\u6240\u30b8\u30aa\u30b3\u30fc\u30c7\u30a3\u30f3\u30b0\uff08\u30ed\u30b0\u30a4\u30f3\u5fc5\u9808\uff09",
  },
  {
    href: "/board",
    label: "2. \u8056\u5730\u63a2\u3057\u639b\u793a\u677f",
    desc: "\u66d6\u6627\u306a\u5834\u6240\u3092\u76f8\u8ac7 \u00b7 \u4e0b\u90e8\u30bf\u30d6\u304b\u3089\u30a2\u30af\u30bb\u30b9",
  },
  {
    href: "/walk?spot=1",
    label: "\uff08\u8056\u5730\u8a73\u7d30\u304b\u3089\uff09\u6848\u5185\u30b9\u30bf\u30fc\u30c8",
    desc: "\u9053\u6848\u5185 \u00b7 \u4e0b\u90e8\u30bf\u30d6\u306b\u306f\u975e\u8868\u793a",
  },
  {
    href: "/profile",
    label: "3. \u30de\u30a4\u30da\u30fc\u30b8",
    desc: "\u6b69\u6570\u30fb\u8ddd\u96e2\u30fb\u30ab\u30ed\u30ea\u30fc \u00b7 \u76ee\u6a19\u8a2d\u5b9a",
  },
  {
    href: "/guide",
    label: "3b. \u4f7f\u3044\u65b9",
    desc: "\u30a2\u30d7\u30ea\u306e\u57fa\u672c\u64cd\u4f5c\u30ac\u30a4\u30c9",
  },
  {
    href: "/login",
    label: "5. \u30ed\u30b0\u30a4\u30f3",
    desc: "\u8056\u5730\u767b\u9332\u30fb\u30b3\u30e1\u30f3\u30c8\u6295\u7a3f\u524d",
  },
] as const;

export default function AppScreensIndexPage() {
  return (
    <div className="mock-page">
      <div className="mock-index-hero">
        <p className="mock-page-title">Idolelic</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight">
          MVP \u753b\u9762\u4e00\u89a7
        </h1>
        <p className="mock-eyebrow mt-2">
          \u6642\u4ee3\u3092\u7bc9\u3044\u305f\u30a2\u30a4\u30c9\u30eb\u306e\u8056\u5730\u3092\u3001\u5fd8\u308c\u306a\u3044\u305f\u3081\u306b\u6b8b\u3059\u5730\u56f3
        </p>
      </div>

      <ul className="mock-list">
        {SCREENS.map(({ href, label, desc }, i) => (
          <li key={href}>
            <Link href={href} className="mock-index-link flex-col !items-start gap-1">
              <span className="flex w-full items-center justify-between">
                <span>
                  <span className="mock-index-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </span>
                <span className="text-zinc-300">{"\u203a"}</span>
              </span>
              <span className="pl-7 text-xs text-[var(--mock-muted)]">{desc}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-[var(--mock-muted)]">
        <Link href="/" className="underline-offset-4 hover:underline">
          \u958b\u767a\u30c8\u30c3\u30d7
        </Link>
        {" \u00b7 "}
        <Link href="/design/home" className="underline-offset-4 hover:underline">
          \u30c7\u30b6\u30a4\u30f3\u30e2\u30c3\u30af
        </Link>
        {" \u00b7 "}
        <Link href="/gps-lab" className="underline-offset-4 hover:underline">
          GPS Lab
        </Link>
      </p>
    </div>
  );
}
