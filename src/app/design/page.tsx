import Link from "next/link";

const SCREENS = [
  {
    href: "/design/home",
    label: "1. ホーム（聖地マップ）",
    desc: "全面地図 · 検索バー · 条件絞り込み",
  },
  {
    href: "/design/spots/1",
    label: "1b. 聖地詳細",
    desc: "概要・思い出コメント・案内スタート",
  },
  {
    href: "/design/spots/new",
    label: "1c. 聖地登録",
    desc: "最小項目 · 住所ジオコーディング（ログイン必須）",
  },
  {
    href: "/design/board",
    label: "2. 聖地探し掲示板",
    desc: "曖昧な場所を相談 · 下部タブからアクセス",
  },
  {
    href: "/design/walk?spot=1",
    label: "（聖地詳細から）案内スタート",
    desc: "道案内 · 下部タブには非表示",
  },
  {
    href: "/design/profile",
    label: "3. マイページ",
    desc: "歩数・距離・カロリー · 目標設定",
  },
  {
    href: "/design/guide",
    label: "3b. 使い方",
    desc: "アプリの基本操作ガイド",
  },
  {
    href: "/design/login",
    label: "5. ログイン",
    desc: "聖地登録・コメント投稿前",
  },
] as const;

export default function DesignIndexPage() {
  return (
    <div className="mock-page">
      <div className="mock-index-hero">
        <p className="mock-page-title">Idolelic Mock</p>
        <h1 className="mt-1 text-xl font-bold tracking-tight">MVP 画面一覧</h1>
        <p className="mock-eyebrow mt-2">
          時代を築いたアイドルの聖地を、忘れないために残す地図
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
                <span className="text-zinc-300">›</span>
              </span>
              <span className="pl-7 text-xs text-[var(--mock-muted)]">{desc}</span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-center text-xs text-[var(--mock-muted)]">
        <Link href="/" className="underline-offset-4 hover:underline">
          開発トップ
        </Link>
        {" · "}
        <Link href="/gps-lab" className="underline-offset-4 hover:underline">
          GPS Lab
        </Link>
      </p>
    </div>
  );
}
