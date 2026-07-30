-- osimap: コミュニティ聖地テーブル
-- Supabase SQL Editor で実行してください

-- PostGIS を使う場合は先に有効化
-- CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS community_spots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  work_title TEXT NOT NULL,
  group_name TEXT NOT NULL,
  category TEXT NOT NULL,
  prefecture TEXT NOT NULL,
  region TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  source TEXT NOT NULL DEFAULT 'community' CHECK (source IN ('official', 'community')),
  submitted_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS community_spots_prefecture_idx
  ON community_spots (prefecture);

CREATE INDEX IF NOT EXISTS community_spots_region_idx
  ON community_spots (region);

CREATE INDEX IF NOT EXISTS community_spots_created_at_idx
  ON community_spots (created_at DESC);

-- PostGIS 有効化後に距離検索用インデックスを追加する例:
-- ALTER TABLE community_spots
--   ADD COLUMN location geography(POINT, 4326)
--   GENERATED ALWAYS AS (
--     ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
--   ) STORED;
-- CREATE INDEX community_spots_location_idx
--   ON community_spots USING GIST (location);

-- 開発用: 匿名読み取り・書き込みを許可（本番では RLS + Auth に置き換え）
ALTER TABLE community_spots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read community spots"
  ON community_spots FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert community spots"
  ON community_spots FOR INSERT
  WITH CHECK (true);
