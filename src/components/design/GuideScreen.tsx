"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { MockCard } from "./mock-ui";
import { withAppPrefix } from "@/lib/auth/paths";

const GUIDE_STEPS = [
  {
    num: 1,
    title: "聖地を探す",
    body:
      "ホームの地図で聖地を探せます。上の検索欄にアイドル・グループ名を入力するか、絞り込みボタンからカテゴリや地域で絞り込んでください。下の一覧から詳細を開けます。",
  },
  {
    num: 2,
    title: "聖地の詳細を見る",
    body:
      "聖地をタップすると概要や思い出のコメントが見られます。現地へ向かうときは「案内スタート」から道案内画面へ進みます。",
  },
  {
    num: 3,
    title: "掲示板で相談する",
    body:
      "場所がわからない・住所が特定できないときは、掲示板でみんなに相談できます。下部タブの「掲示板」からスレを立てられます。",
  },
  {
    num: 4,
    title: "聖地を登録する",
    body:
      "ホーム右上の「＋」から聖地を登録できます（ログインが必要です）。住所がわからない場合は、掲示板での相談をご利用ください。",
  },
  {
    num: 5,
    title: "歩数・記録を確認する",
    body:
      "マイページで本日の歩数・距離・カロリーを確認できます。「計測開始」で GPS と歩数の記録を始められます。目標はマイページで変更できます。",
  },
] as const;

export function GuideScreen() {
  const pathname = usePathname();
  const loginPath = withAppPrefix(pathname, "/login");

  return (
    <>
      <MockCard>
        <p className="text-sm leading-relaxed text-[var(--mock-muted)]">
          Idolelic は、時代を築いたアイドルの聖地を残し、歩きながら巡るための地図アプリです。
        </p>
      </MockCard>

      <section>
        <p className="mock-section-label">基本的な使い方</p>
        <ol className="mock-guide-steps">
          {GUIDE_STEPS.map((step) => (
            <li key={step.num} className="mock-guide-step">
              <span className="mock-flow-num">{step.num}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-[var(--mock-brand-deep)]">
                  {step.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--mock-muted)]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <p className="mock-section-label">ログインについて</p>
        <MockCard>
          <p className="text-sm leading-relaxed text-[var(--mock-muted)]">
            ゲストでも地図の閲覧や掲示板の閲覧はできます。聖地の登録、掲示板への投稿、思い出コメントの投稿にはログインが必要です。
          </p>
          <Link
            href={loginPath}
            className="mt-3 inline-block text-sm font-semibold text-[var(--mock-brand)]"
          >
            ログイン / 新規登録 →
          </Link>
        </MockCard>
      </section>
    </>
  );
}
