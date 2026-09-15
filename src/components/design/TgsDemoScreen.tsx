"use client";

import { useEffect, useMemo, useState } from "react";

import { useGeolocationWatcher } from "@/features/geolocation/hooks/useGeolocationWatcher";
import type { GeolocationErrorCode } from "@/features/geolocation/types";
import { useAccelerometerSteps } from "@/features/pedometer/hooks/useAccelerometerSteps";
import { useStepValidation } from "@/features/pedometer/hooks/useStepValidation";
import { useSpeedFilter } from "@/features/speed-filter/hooks/useSpeedFilter";
import {
  TGS_DEMO_SPOTS,
  TGS_DEMO_THREADS,
  TGS_WALK_GOAL_STEPS,
  type TgsDemoSpot,
} from "@/data/tgs-demo";
import { shouldCountAccelerometerSteps } from "@/lib/pedometer";

type View = "home" | "map" | "spot" | "walk" | "board";

type TgsDemoScreenProps = {
  initialView?: View;
};

const GEO_ERROR_HINT: Record<GeolocationErrorCode, string> = {
  PERMISSION_DENIED: "位置情報を許可してください",
  POSITION_UNAVAILABLE: "GPSをオンにしてください（屋外だと安定）",
  TIMEOUT: "位置取得タイムアウト。屋外で再試行",
  UNSUPPORTED: "この端末は位置情報に非対応",
  INSECURE_CONTEXT: "HTTPSで開いてください",
  UNKNOWN: "位置情報が取れませんでした",
};

export function TgsDemoScreen({ initialView = "home" }: TgsDemoScreenProps) {
  const [view, setView] = useState<View>(initialView);
  const [spotId, setSpotId] = useState(TGS_DEMO_SPOTS[0]!.id);
  const [offline, setOffline] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);

  const geo = useGeolocationWatcher();
  const samples = geo.samples;
  const speed = useSpeedFilter(samples);
  const allowStepCount = useMemo(
    () => shouldCountAccelerometerSteps(samples, speed.kind),
    [samples, speed.kind],
  );

  const accel = useAccelerometerSteps({
    active: sessionActive,
    allowCounting: allowStepCount,
    demoSensitive: true,
  });

  const stepValidation = useStepValidation(
    accel.rawSteps,
    samples,
    speed.kind,
  );

  const spot = useMemo(
    () => TGS_DEMO_SPOTS.find((s) => s.id === spotId) ?? TGS_DEMO_SPOTS[0]!,
    [spotId],
  );

  const effectiveSteps = sessionActive ? stepValidation.validatedSteps : 0;
  const progress = Math.min(
    100,
    Math.round((effectiveSteps / TGS_WALK_GOAL_STEPS) * 100),
  );
  const arrived = effectiveSteps >= TGS_WALK_GOAL_STEPS;

  useEffect(() => {
    const sync = () => setOffline(!navigator.onLine);
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  async function startSession() {
    geo.reset();
    accel.reset();
    await accel.requestPermission();
    geo.start();
    setSessionActive(true);
  }

  function stopSession() {
    geo.stop();
    setSessionActive(false);
  }

  function openSpot(next: TgsDemoSpot) {
    setSpotId(next.id);
    setView("spot");
  }

  const statusText = (() => {
    if (!sessionActive) return "計測停止中";
    if (accel.permission === "denied") {
      return "モーション許可が拒否されています";
    }
    if (accel.permission === "unsupported") {
      return "この端末は加速度センサー非対応";
    }
    if (accel.permission !== "granted") return "モーション許可を確認中…";
    if (geo.errorCode) return GEO_ERROR_HINT[geo.errorCode];
    if (geo.status === "requesting") return "GPS取得中…";
    if (speed.kind === "excluded") return "除外中（速度が高すぎる）";
    if (speed.kind === "still") return "静止中 → 生歩数は増えても有効歩数は増えない";
    if (stepValidation.status === "shake_detected") {
      return "その場振りを検出 → 有効歩数に入れない";
    }
    if (!allowStepCount) return "歩行速度になるまで有効歩数は増やさない";
    if (stepValidation.status === "ok") return "徒歩判定中 → 加速度歩数を採用";
    if (stepValidation.status === "capped_by_gps") {
      return "GPS距離に合わせて歩数を調整";
    }
    return "判定中…";
  })();

  const speedLabel = (() => {
    const avg =
      speed.averageSpeedKmh !== null
        ? `${speed.averageSpeedKmh.toFixed(1)}`
        : "—";
    const instant =
      speed.instantSpeedKmh !== null
        ? `${speed.instantSpeedKmh.toFixed(1)}`
        : "—";
    return `平均 ${avg} / 瞬間 ${instant} km/h`;
  })();

  const accuracyLabel =
    geo.latestSample?.accuracy != null
      ? `精度 ±${Math.round(geo.latestSample.accuracy)}m`
      : "GPS待機";

  return (
    <main className="tgs-demo">
      {offline ? (
        <p className="tgs-demo-offline">オフライン（GPSと加速度は端末側で動作）</p>
      ) : (
        <p className="tgs-demo-kicker">TGS デモ</p>
      )}

      {view === "home" ? (
        <>
          <h1 className="tgs-demo-title">Idolelic</h1>
          <p className="tgs-demo-lead">
            解散・活動休止したアイドルの聖地を、
            <br />
            地図と歩くナビで巡れるアプリ
          </p>
          <p className="tgs-demo-note">
            歩数は加速度センサーで取るが、実機GPSのスピード判定で制限する。その場振りは無効になる。
          </p>

          <ol className="tgs-demo-steps">
            <li>
              <button
                type="button"
                className="tgs-demo-card tgs-demo-card-feature"
                onClick={() => setView("walk")}
              >
                <span className="tgs-demo-num">★</span>
                <span className="tgs-demo-card-body">
                  <strong>加速度 × 速度制限デモ</strong>
                  <span>スマホを持って歩くと速度が変わる</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="tgs-demo-card" onClick={() => setView("map")}>
                <span className="tgs-demo-num">1</span>
                <span className="tgs-demo-card-body">
                  <strong>地図を見る</strong>
                  <span>ピンをタップして聖地を選ぶ</span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="tgs-demo-card" onClick={() => setView("spot")}>
                <span className="tgs-demo-num">2</span>
                <span className="tgs-demo-card-body">
                  <strong>聖地詳細</strong>
                  <span>
                    {spot.name}（{spot.group}）
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button type="button" className="tgs-demo-card" onClick={() => setView("board")}>
                <span className="tgs-demo-num">3</span>
                <span className="tgs-demo-card-body">
                  <strong>掲示板</strong>
                  <span>サンプル相談スレを読む</span>
                </span>
              </button>
            </li>
          </ol>
          <p className="tgs-demo-hint">本番アプリは別QR（/home）へ</p>
        </>
      ) : null}

      {view === "map" ? (
        <DemoPanel title="簡易マップ" onBack={() => setView("home")}>
          <div className="tgs-map" aria-label="デモ用地図">
            {TGS_DEMO_SPOTS.map((s) => (
              <button
                key={s.id}
                type="button"
                className="tgs-map-pin"
                style={{ left: `${s.mapX}%`, top: `${s.mapY}%` }}
                onClick={() => openSpot(s)}
              >
                ♥
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </DemoPanel>
      ) : null}

      {view === "spot" ? (
        <DemoPanel title="聖地詳細" onBack={() => setView("home")}>
          <p className="tgs-spot-group">{spot.group}</p>
          <h2 className="tgs-spot-name">{spot.name}</h2>
          <p className="tgs-spot-meta">
            {spot.workTitle} · {spot.prefecture}
          </p>
          <p className="tgs-spot-desc">{spot.description}</p>
          <button type="button" className="tgs-demo-primary" onClick={() => setView("walk")}>
            歩数制限デモへ
          </button>
        </DemoPanel>
      ) : null}

      {view === "walk" ? (
        <DemoPanel title="加速度 × 速度制限" onBack={() => setView("home")}>
          <p className="tgs-spot-meta">目的地: {spot.name}</p>
          <p className="tgs-demo-note">
            本番と同じく、実機のGPS速度で加速度歩数を制限します。その場で振ると無効、実際に歩くと有効になります。
          </p>

          <p className={`tgs-sensor-status ${allowStepCount ? "on" : ""}`}>
            {statusText}
          </p>
          <p className="tgs-spot-meta">
            速度 {speedLabel} · 判定 {speed.kind} · カウント許可{" "}
            {allowStepCount ? "YES" : "NO"}
          </p>
          <p className="tgs-spot-meta">
            {accuracyLabel} · サンプル {samples.length}
          </p>

          <div className="tgs-step-pair">
            <div>
              <p className="tgs-step-label">生歩数</p>
              <p className="tgs-walk-steps small">{accel.rawSteps}</p>
            </div>
            <div>
              <p className="tgs-step-label">有効歩数</p>
              <p className="tgs-walk-steps">{effectiveSteps}</p>
            </div>
          </div>
          <p className="tgs-demo-hint">
            目標 {TGS_WALK_GOAL_STEPS} · 却下 {stepValidation.rejectedSteps}
          </p>
          <div className="tgs-progress" aria-hidden>
            <div className="tgs-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          {arrived ? (
            <p className="tgs-arrive">到着！徒歩判定のときだけ歩数が増えました</p>
          ) : null}

          <div className="tgs-walk-actions">
            {!sessionActive ? (
              <button
                type="button"
                className="tgs-demo-primary"
                onClick={() => void startSession()}
              >
                計測開始
              </button>
            ) : (
              <button type="button" className="tgs-demo-secondary" onClick={stopSession}>
                計測停止
              </button>
            )}
          </div>
          <p className="tgs-demo-hint">
            見せ方: ①その場で振る→無効 ②スマホを持って歩く→速度が上がり有効歩数増える
          </p>
        </DemoPanel>
      ) : null}

      {view === "board" ? (
        <DemoPanel title="掲示板（サンプル）" onBack={() => setView("home")}>
          <ul className="tgs-board-list">
            {TGS_DEMO_THREADS.map((thread) => (
              <li key={thread.id} className="tgs-board-card">
                <p className="tgs-board-title">{thread.title}</p>
                <p className="tgs-spot-meta">
                  {thread.group} · {thread.author}
                </p>
                <p className="tgs-spot-desc">{thread.body}</p>
                <ul className="tgs-board-comments">
                  {thread.comments.map((c, i) => (
                    <li key={`${thread.id}-${i}`}>
                      <strong>{c.author}</strong>
                      <span>{c.body}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </DemoPanel>
      ) : null}
    </main>
  );
}

function DemoPanel({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="tgs-panel">
      <button type="button" className="tgs-back" onClick={onBack}>
        ← デモTOP
      </button>
      <h1 className="tgs-panel-title">{title}</h1>
      {children}
    </section>
  );
}
