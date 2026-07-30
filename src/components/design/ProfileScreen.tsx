"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { useMockAuth } from "@/components/design/MockAuthProvider";
import {
  GeoWarningBanner,
  WalkingSessionBar,
} from "@/components/design/WalkingSessionBar";
import {
  MOCK_DASHBOARD,
  MOCK_LOGGED_IN_USER,
} from "@/data/mock-spots";
import { useWalkingSession } from "@/features/walking-session";
import { authHref, isDesignPath } from "@/lib/auth/paths";

import { MockButton, MockCard } from "./mock-ui";

type ProfileScreenProps = {
  isOwner?: boolean;
};

export function ProfileScreen({ isOwner = false }: ProfileScreenProps) {
  const pathname = usePathname();
  const router = useRouter();
  const design = isDesignPath(pathname);
  const { isLoggedIn, user, logout } = useMockAuth();
  const { effectiveSteps, distanceKm, caloriesKcal, sessionActive } =
    useWalkingSession();

  const [stepGoal, setStepGoal] = useState(MOCK_DASHBOARD.stepGoal);
  const [distanceGoal, setDistanceGoal] = useState(MOCK_DASHBOARD.distanceGoalKm);
  const [loggingOut, setLoggingOut] = useState(false);

  const loginPath = authHref("/login", undefined, design);
  const signupPath = authHref("/signup", undefined, design);
  const guidePath = design ? "/design/guide" : "/guide";
  const displayName = user?.displayName ?? MOCK_LOGGED_IN_USER.name;

  const stepProgress =
    stepGoal > 0
      ? Math.min(100, Math.round((effectiveSteps / stepGoal) * 100))
      : 0;
  const distanceProgress =
    distanceGoal > 0
      ? Math.min(100, Math.round((distanceKm / distanceGoal) * 100))
      : 0;

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <MockCard className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-[var(--mock-brand-muted)] text-2xl">
          {isLoggedIn ? "🌸" : "？"}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">
            {isLoggedIn ? displayName : "ゲスト"}
          </p>
          {isLoggedIn ? (
            <p className="text-sm text-[var(--mock-muted)]">
              {user?.email ??
                `累計 ${MOCK_LOGGED_IN_USER.totalSteps.toLocaleString()} 歩`}
            </p>
          ) : (
            <p className="text-sm text-[var(--mock-muted)]">
              歩数はログインなしで記録できます
            </p>
          )}
          {!isLoggedIn ? (
            <div className="mt-2 flex flex-wrap gap-3 text-sm font-medium">
              <Link href={loginPath} className="text-[var(--mock-brand)]">
                ログイン
              </Link>
              <Link href={signupPath} className="text-[var(--mock-brand)]">
                新規登録 →
              </Link>
            </div>
          ) : null}
        </div>
      </MockCard>

      <section>
        <p className="mock-section-label">本日の記録</p>
        <GeoWarningBanner />
        <WalkingSessionBar />

        <div className="mock-hero mt-3">
          <p className="mock-hero-label">
            歩数
            {sessionActive ? (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-[0.625rem]">
                計測中
              </span>
            ) : null}
          </p>
          <p className="mock-hero-value">{effectiveSteps.toLocaleString()}</p>
          <p className="mt-1 text-sm text-white/80">
            目標 {stepGoal.toLocaleString()} 歩
          </p>
          <div className="mock-progress">
            <span style={{ width: `${stepProgress}%` }} />
          </div>
          {!sessionActive ? (
            <p className="mt-2 text-xs text-white/75">
              計測を始めると GPS で歩数が増えます
            </p>
          ) : null}
        </div>

        <MockCard className="mt-3 mock-card-pad">
          <p className="mock-stat-label">歩行距離</p>
          <p className="mock-hero-value text-[var(--mock-text)] text-xl">
            {distanceKm}
            <span className="ml-1 text-base font-semibold text-[var(--mock-muted)]">
              / {distanceGoal} km
            </span>
          </p>
          <div className="mock-progress mock-progress-light mt-2">
            <span style={{ width: `${distanceProgress}%` }} />
          </div>
          <p className="mt-2 text-[0.625rem] text-[var(--mock-muted)]">
            GPS から算出
          </p>
        </MockCard>

        <MockCard className="mt-3 mock-card-pad">
          <p className="mock-stat-label">推定カロリー</p>
          <p className="mock-hero-value text-[var(--mock-text)] text-xl">
            {caloriesKcal}
            <span className="ml-1 text-base font-semibold text-[var(--mock-muted)]">
              kcal
            </span>
          </p>
          <p className="mt-2 text-[0.625rem] text-[var(--mock-muted)]">
            歩数から推定
          </p>
        </MockCard>
      </section>

      <section>
        <p className="mock-section-label">目標設定</p>
        <MockCard className="space-y-4">
          <label className="block">
            <span className="mock-stat-label">1日の歩数</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                value={stepGoal}
                onChange={(e) => setStepGoal(Number(e.target.value))}
                className="mock-goal-input"
                min={1000}
                step={500}
              />
              <span className="text-sm text-[var(--mock-muted)]">歩</span>
            </div>
          </label>
          <label className="block">
            <span className="mock-stat-label">1日の距離</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                value={distanceGoal}
                onChange={(e) => setDistanceGoal(Number(e.target.value))}
                className="mock-goal-input"
                min={1}
                step={0.5}
              />
              <span className="text-sm text-[var(--mock-muted)]">km</span>
            </div>
          </label>
          <p className="text-xs text-[var(--mock-muted)]">
            この端末に一時保存されます
          </p>
        </MockCard>
      </section>

      {isLoggedIn ? null : (
        <MockCard className="text-center">
          <p className="text-sm font-medium">ログインすると記録や投稿が残せます</p>
          <p className="mt-1 text-xs text-[var(--mock-muted)]">
            メールアドレスで登録できます
          </p>
          <div className="mt-4 flex flex-col gap-2">
            <MockButton href={loginPath}>ログインする</MockButton>
            <MockButton href={signupPath} className="mock-btn-secondary">
              新規登録
            </MockButton>
          </div>
        </MockCard>
      )}

      {isLoggedIn && isOwner ? (
        <section>
          <p className="mock-section-label">オーナー</p>
          <Link href="/admin" className="mock-guide-link">
            <span className="mock-guide-link-icon" aria-hidden>
              ⚙
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold">データ管理</span>
              <span className="mt-0.5 block text-xs text-[var(--mock-muted)]">
                聖地の編集・削除
              </span>
            </span>
            <span className="text-[var(--mock-muted)]" aria-hidden>
              →
            </span>
          </Link>
        </section>
      ) : null}

      {isLoggedIn ? (
        <section>
          <p className="mock-section-label">アカウント</p>
          <MockCard className="space-y-3">
            {user?.email ? (
              <p className="text-sm text-[var(--mock-muted)]">{user.email}</p>
            ) : null}
            <MockButton
              variant="secondary"
              className="w-full"
              disabled={loggingOut}
              onClick={() => void handleLogout()}
            >
              {loggingOut ? "ログアウト中…" : "ログアウト"}
            </MockButton>
          </MockCard>
        </section>
      ) : null}

      <section>
        <p className="mock-section-label">ヘルプ</p>
        <Link href={guidePath} className="mock-guide-link">
          <span className="mock-guide-link-icon" aria-hidden>
            📖
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">使い方ガイド</span>
            <span className="mt-0.5 block text-xs text-[var(--mock-muted)]">
              Idolelic の使い方
            </span>
          </span>
          <span className="text-[var(--mock-muted)]" aria-hidden>
            →
          </span>
        </Link>
      </section>
    </>
  );
}
