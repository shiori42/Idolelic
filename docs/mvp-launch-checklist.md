# MVP 公開前チェックリスト

夏休み公開に向けた最少残り作業です。

## 1. コード側（完了寄り）

- [x] `/` → `/home` へリダイレクト
- [x] 認証デフォルト遷移を `/home` に統一
- [x] 本番ルート（`/home` 等）から `/design` 直書きリンクを解消
- [ ] 実機で通し確認（下記「4. スモークテスト」）

`/design/*` と `/gps-lab` はデモ・検証用として残置。本番入口からは出さない。

## 2. Supabase（本番プロジェクト）

1. [ ] https://supabase.com で本番プロジェクト作成
2. [ ] SQL Editor で `supabase/migrations/` を **ファイル名順**に実行  
   （`20250601000000` … `20250725000000`）  
   ※掲示板だけ足りない場合は `20250725000000_board_threads.sql` を実行
3. [ ] Authentication → Providers → Email を有効化  
   （最初は Confirm email OFF でも可）
4. [ ] Authentication → URL Configuration
   - Site URL: `https://<your-app>.vercel.app`
   - Redirect URLs: `https://<your-app>.vercel.app/auth/callback`
5. [ ] Project Settings → API からキーを控える
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`（サーバー専用・公開しない）
6. [ ] オーナーアカウント
   - アプリで自分のメールでサインアップ
   - `.env.local` / Vercel に `OWNER_EMAIL=<そのメール>` を設定
   - 再起動・再デプロイ後、マイページに「データ管理」が出る → `/admin`

## 3. Vercel

1. [ ] リポジトリを Vercel に Import
2. [ ] Environment Variables に上記 Supabase 変数を設定（Production）
   - あわせて `OWNER_EMAIL`（オーナーのメール）を設定
3. [ ] （任意）`GOOGLE_MAPS_API_KEY` — 住所ジオコーディング用
4. [ ] Deploy → 本番 URL を確認
5. [ ] Supabase の Site URL / Redirect URLs を本番 URL に合わせて更新

## 4. スモークテスト（本番 URL）

スマホ実機（HTTPS）で一巡:

1. [ ] `/` が地図ホーム（`/home`）に入る
2. [ ] フィルタ・ピン・聖地詳細が開く
3. [ ] MV 埋め込み（カタログ曲）が再生できる
4. [ ] ログイン / 新規登録ができる
5. [ ] 聖地登録 → 地図に出る
6. [ ] 詳細 → アプリ内ナビ（歩数）→ 戻れる
7. [ ] 思い出投稿ができる
8. [x] 掲示板は閲覧・投稿・コメントできる（Supabase 保存）
9. [ ] オーナーでログイン → マイページ「データ管理」→ 聖地の編集・削除ができる

## 5. 後回しでよい

- 利用規約・プライバシーの本文化
- 未特定 MV 2 曲の直リンク補完
- 迂回ルート / 本格 WBGT / バッジ / ネイティブ背景歩数
