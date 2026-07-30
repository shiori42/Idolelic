# Idolelic

アイドルの聖地巡礼マップアプリです。地図で聖地を探したり、掲示板で場所を相談したりできます。

## 本番 URL

https://idolelic.vercel.app

## 主な機能

- 聖地マップ（フィルタ・詳細・MV 埋め込み）
- コミュニティ聖地の登録
- 聖地探し掲示板（投稿・コメント・解決）
- アプリ内ナビ（徒歩ルート・歩数）
- ログイン / 新規登録（Supabase Auth）

## ローカル起動

```bash
npm install
cp .env.local.example .env.local
# .env.local に Supabase などの値を入れる
npm run dev
```

ブラウザで http://localhost:3000 を開きます。

## 環境変数

必要な変数は [`.env.local.example`](.env.local.example) を参照してください。

公開前の手順は [`docs/mvp-launch-checklist.md`](docs/mvp-launch-checklist.md) にまとめています。

## 技術スタック

- Next.js
- Supabase（Auth / DB）
- Leaflet（地図）
- Vercel（本番デプロイ）
