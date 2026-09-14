"use client";

import { useEffect, useMemo, useState } from "react";

import { useAccelerometerSteps } from "@/features/pedometer/hooks/useAccelerometerSteps";
import {
  TGS_DEMO_SPOTS,
  TGS_DEMO_THREADS,
  TGS_WALK_GOAL_STEPS,
  type TgsDemoSpot,
} from "@/data/tgs-demo";

type View = "home" | "map" | "spot" | "walk" | "board";

export function TgsDemoScreen() {
  const [view, setView] = useState<View>("home");
  const [spotId, setSpotId] = useState(TGS_DEMO_SPOTS[0]!.id);
  const [offline, setOffline] = useState(false);
  const [manualSteps, setManualSteps] = useState(0);
  const [walking, setWalking] = useState(false);

  const accel = useAccelerometerSteps({
    active: walking,
    allowCounting: true,
    demoSensitive: true,
  });

  const spot = useMemo(
    () => TGS_DEMO_SPOTS.find((s) => s.id === spotId) ?? TGS_DEMO_SPOTS[0]!,
    [spotId],
  );

  const steps = walking ? accel.rawSteps + manualSteps : 0;
  const progress = Math.min(100, Math.round((steps / TGS_WALK_GOAL_STEPS) * 100));
  const arrived = steps >= TGS_WALK_GOAL_STEPS;

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

  async function startWalk() {
    setManualSteps(0);
    accel.reset();
    const ok = await accel.requestPermission();
    setWalking(true);
    if (!ok && accel.permission === "unsupported") {
      // PC など: 手動ボタンで体験
    }
  }

  function stopWalk() {
    setWalking(false);
  }

  function openSpot(next: TgsDemoSpot) {
    setSpotId(next.id);
    setView("spot");
  }

  const permissionLabel =
    accel.permission === "granted"
      ? "加速度センサー: ON"
      : accel.permission === "denied"
        ? "加速度センサー: 拒否（+5歩で体験可）"
        : accel.permission === "unsupported"
          ? "加速度センサー: 非対応（+5歩で体験可）"
          : "加速度センサー: 未許可";

  return (
    <main className="tgs-demo">
      {offline ? (
        <p className="tgs-demo-offline">オフラインモード（このデモは電波なしでも動きます）</p>
      ) : (
        <p className="tgs-demo-kicker">TGS オフライン対応デモ</p>
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
            会場では GPS が弱いので、歩数は加速度センサーで体験します。電波なしでもこのページ内で完結します。
          </p>

          <ol className="tgs-demo-steps">
            <li>
              <button type="button" className="tgs-demo-card tgs-demo-card-feature" onClick={() => setView("walk")}>
                <span className="tgs-demo-num">★</span>
                <span className="tgs-demo-card-body">
                  <strong>加速度歩数デモ</strong>
                  <span>スマホを振ると歩数が増える（GPS不要）</span>
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
                  <span>{spot.name}（{spot.group}）</span>
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
          <p className="tgs-demo-hint">所要目安 1〜2分 / ネット不要（このページ内）</p>
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
          <p className="tgs-demo-hint">ピンを押すと聖地詳細へ（タイル読み込みなし）</p>
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
          <p className="tgs-spot-address">{spot.address}</p>
          <button type="button" className="tgs-demo-primary" onClick={() => setView("walk")}>
            加速度歩数デモへ
          </button>
        </DemoPanel>
      ) : null}

      {view === "walk" ? (
        <DemoPanel title="加速度歩数デモ" onBack={() => setView("home")}>
          <p className="tgs-spot-meta">目的地: {spot.name}（GPSは使いません）</p>
          <p className={`tgs-sensor-status ${walking && accel.permission === "granted" ? "on" : ""}`}>
            {walking ? permissionLabel : "計測停止中"}
          </p>
          <p className="tgs-walk-steps">{steps}</p>
          <p className="tgs-demo-hint">
            検知歩数 / 目標 {TGS_WALK_GOAL_STEPS}
            {walking && accel.permission === "granted" ? " · スマホを軽く振ってください" : ""}
          </p>
          <div className="tgs-progress" aria-hidden>
            <div className="tgs-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          {arrived ? (
            <p className="tgs-arrive">到着！加速度だけで聖地到達を再現できました</p>
          ) : null}
          <div className="tgs-walk-actions">
            {!walking ? (
              <button type="button" className="tgs-demo-primary" onClick={() => void startWalk()}>
                計測開始（加速度）
              </button>
            ) : (
              <button type="button" className="tgs-demo-secondary" onClick={stopWalk}>
                計測停止
              </button>
            )}
            <button
              type="button"
              className="tgs-demo-secondary"
              onClick={() => setManualSteps((n) => n + 5)}
              disabled={!walking}
            >
              +5歩（予備）
            </button>
          </div>
          <p className="tgs-demo-hint">
            iPhone は「モーションと画面の向き」の許可が必要です。取れないときは +5歩で見せられます。
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
