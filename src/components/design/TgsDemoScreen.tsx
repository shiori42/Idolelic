"use client";

import { useEffect, useMemo, useRef, useState } from "react";

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
import type { GeoSample } from "@/types/geo";

type View = "home" | "map" | "spot" | "walk" | "board";

/** 擬似GPSの移動モード（会場では本物GPSが弱いため） */
type DemoGpsMode = "still" | "walking";

type TgsDemoScreenProps = {
  initialView?: View;
};

const START_LAT = 35.6573;
const START_LNG = 139.7029;
const METERS_PER_DEG_LAT = 111_320;

function metersToLatLngDelta(
  metersNorth: number,
  metersEast: number,
  baseLat: number,
) {
  const dLat = metersNorth / METERS_PER_DEG_LAT;
  const dLng =
    metersEast / (METERS_PER_DEG_LAT * Math.cos((baseLat * Math.PI) / 180));
  return { dLat, dLng };
}

/** 徒歩らしい速度を秒ごとにゆらす（約 2.8〜6.2 km/h） */
function walkingMetersForTick(tick: number) {
  const speedKmh = 4.5 + Math.sin(tick / 2.2) * 1.4 + Math.sin(tick / 5.1) * 0.5;
  return Math.max(0.6, speedKmh / 3.6);
}

export function TgsDemoScreen({ initialView = "home" }: TgsDemoScreenProps) {
  const [view, setView] = useState<View>(initialView);
  const [spotId, setSpotId] = useState(TGS_DEMO_SPOTS[0]!.id);
  const [offline, setOffline] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [gpsMode, setGpsMode] = useState<DemoGpsMode>("still");
  const [samples, setSamples] = useState<GeoSample[]>([]);
  const tickRef = useRef(0);
  const positionRef = useRef({ lat: START_LAT, lng: START_LNG });
  const gpsModeRef = useRef(gpsMode);
  gpsModeRef.current = gpsMode;

  const speed = useSpeedFilter(samples);
  const allowStepCount = useMemo(
    () => shouldCountAccelerometerSteps(samples, speed.kind),
    [samples, speed.kind],
  );

  const accel = useAccelerometerSteps({
    active: sessionActive,
    allowCounting: allowStepCount,
    demoSensitive: false,
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

  // 擬似 GPS（会場デモ用）。本番ロジックと同じ速度・歩数制限に通す。
  useEffect(() => {
    if (!sessionActive) return;

    const id = window.setInterval(() => {
      tickRef.current += 1;
      const t = tickRef.current;
      const mode = gpsModeRef.current;

      if (mode === "walking") {
        const stepMeters = walkingMetersForTick(t);
        const { dLat, dLng } = metersToLatLngDelta(
          stepMeters,
          stepMeters * 0.15,
          positionRef.current.lat,
        );
        positionRef.current = {
          lat: positionRef.current.lat + dLat,
          lng: positionRef.current.lng + dLng,
        };
      }
      // still: 位置を固定 → 速度はすぐ 0 近くになる

      setSamples((prev) => {
        const next: GeoSample = {
          latitude: positionRef.current.lat,
          longitude: positionRef.current.lng,
          timestamp: Date.now(),
          accuracy: 8,
        };
        const merged = [...prev, next];
        return merged.length > 60 ? merged.slice(-60) : merged;
      });
    }, 1000);

    return () => window.clearInterval(id);
  }, [sessionActive]);

  // モード切替ですぐ速度表示が変わるよう、直近サンプルを切る
  useEffect(() => {
    if (!sessionActive) return;
    setSamples((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      return [
        {
          ...last,
          timestamp: Date.now() - 1000,
        },
        {
          latitude: positionRef.current.lat,
          longitude: positionRef.current.lng,
          timestamp: Date.now(),
          accuracy: 8,
        },
      ];
    });
  }, [gpsMode, sessionActive]);

  async function startSession() {
    tickRef.current = 0;
    positionRef.current = { lat: START_LAT, lng: START_LNG };
    setSamples([]);
    accel.reset();
    await accel.requestPermission();
    setSessionActive(true);
  }

  function stopSession() {
    setSessionActive(false);
  }

  function openSpot(next: TgsDemoSpot) {
    setSpotId(next.id);
    setView("spot");
  }

  const statusText = (() => {
    if (!sessionActive) return "計測停止中";
    if (speed.kind === "excluded") return "除外中（速度が高すぎる）";
    if (stepValidation.status === "shake_detected") {
      return "その場振りを検出 → 有効歩数に入れない";
    }
    if (!allowStepCount) return "歩行速度になるまで加速度カウント停止";
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

  return (
    <main className="tgs-demo">
      {offline ? (
        <p className="tgs-demo-offline">オフラインモード（擬似GPSで速度判定）</p>
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
            歩数は加速度センサーで取るが、スピード判定で制限する。その場振りは無効になる。
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
                  <span>その場振りは無効 / 徒歩速度だけ有効</span>
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
            本番と同じく、加速度の生歩数をスピード判定で制限します。会場では擬似GPSで徒歩／その場を切り替えます。
          </p>

          <div className="tgs-mode-row">
            <button
              type="button"
              className={`tgs-mode-btn ${gpsMode === "still" ? "on" : ""}`}
              onClick={() => setGpsMode("still")}
            >
              その場（振り無効）
            </button>
            <button
              type="button"
              className={`tgs-mode-btn ${gpsMode === "walking" ? "on" : ""}`}
              onClick={() => setGpsMode("walking")}
            >
              徒歩移動（採用）
            </button>
          </div>

          <p className={`tgs-sensor-status ${allowStepCount ? "on" : ""}`}>
            {statusText}
          </p>
          <p className="tgs-spot-meta">
            速度 {speedLabel} · 判定 {speed.kind} · カウント許可{" "}
            {allowStepCount ? "YES" : "NO"}
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
            見せ方: ①その場で振る→有効歩数増えない ②徒歩移動に切替→有効歩数増える
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
