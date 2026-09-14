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
          <Link
            href={`/walk?spot=${encodeURIComponent(DEMO_SPOT_ID)}&mode=walking`}
            className="tgs-demo-card"
          >
            <span className="tgs-demo-num">3</span>
            <span className="tgs-demo-card-body">
              <strong>歩数ナビ</strong>
              <span>「計測開始」で歩数を数えながら案内</span>
            </span>
          </Link>
        </li>
        <li>
          <Link href="/board" className="tgs-demo-card">
            <span className="tgs-demo-num">4</span>
            <span className="tgs-demo-card-body">
              <strong>掲示板</strong>
              <span>場所がわからない聖地の相談</span>
            </span>
          </Link>
        </li>
      </ol>

      <p className="tgs-demo-hint">
        所要目安 2〜3分 / 歩数は位置情報の許可が必要です
      </p>
      <Link href="/profile" className="tgs-demo-skip">
        マイページで歩数だけ試す →
      </Link>
      <Link href="/home" className="tgs-demo-skip">
        アプリ本体を開く →
      </Link>
    </main>
  );
}
