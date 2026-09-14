"use client";

import Link from "next/link";

const DEMO_SPOT_ID = "keyakizaka-1";
const DEMO_GROUP = "欅坂46";

export function TgsDemoScreen() {
  return (
    <main className="tgs-demo">
      <p className="tgs-demo-kicker">TGS デモ</p>
      <h1 className="tgs-demo-title">Idolelic</h1>
      <p className="tgs-demo-lead">
        解散・活動休止したアイドルの聖地を、
        <br />
        地図と歩くナビで巡れるアプリ
      </p>

      <ol className="tgs-demo-steps">
        <li>
          <Link
            href={`/home?group=${encodeURIComponent(DEMO_GROUP)}`}
            className="tgs-demo-card"
          >
            <span className="tgs-demo-num">1</span>
            <span className="tgs-demo-card-body">
              <strong>地図を見る</strong>
              <span>聖地ピンをタップしてみる</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href={`/spots/${DEMO_SPOT_ID}`} className="tgs-demo-card">
            <span className="tgs-demo-num">2</span>
            <span className="tgs-demo-card-body">
              <strong>聖地詳細</strong>
              <span>渋谷ストリーム（欅坂46）と MV</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href="/board" className="tgs-demo-card">
            <span className="tgs-demo-num">3</span>
            <span className="tgs-demo-card-body">
              <strong>掲示板</strong>
              <span>場所がわからない聖地の相談</span>
            </span>
          </Link>
        </li>
      </ol>

      <p className="tgs-demo-hint">
        所要目安 1〜2分 / ネット接続が必要です
      </p>
      <Link href="/home" className="tgs-demo-skip">
        アプリ本体を開く →
      </Link>
    </main>
  );
}
