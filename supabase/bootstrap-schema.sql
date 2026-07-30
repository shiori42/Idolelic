-- Idolelic: 本番 Supabase 用スキーマ（最初にこれだけ実行）
-- Supabase Dashboard → SQL Editor → New query に貼って Run

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

ALTER TABLE community_spots ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'community_spots' AND policyname = 'Allow public read community spots'
  ) THEN
    CREATE POLICY "Allow public read community spots"
      ON community_spots FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'community_spots' AND policyname = 'Allow public insert community spots'
  ) THEN
    CREATE POLICY "Allow public insert community spots"
      ON community_spots FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

ALTER TABLE community_spots
  ADD COLUMN IF NOT EXISTS legacy_id TEXT UNIQUE;

ALTER TABLE community_spots
  ADD COLUMN IF NOT EXISTS mv_url TEXT;

-- 掲示板: スレッド + コメント
CREATE TABLE IF NOT EXISTS board_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  group_name TEXT NOT NULL,
  era TEXT,
  hint TEXT NOT NULL,
  body TEXT NOT NULL,
  author TEXT NOT NULL,
  author_user_id UUID,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  resolved_spot_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TABLE IF NOT EXISTS board_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES board_threads(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  author_user_id UUID,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS board_threads_created_at_idx
  ON board_threads (created_at DESC);

CREATE INDEX IF NOT EXISTS board_comments_thread_id_created_at_idx
  ON board_comments (thread_id, created_at ASC);

ALTER TABLE board_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_comments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'board_threads' AND policyname = 'Allow public read board threads'
  ) THEN
    CREATE POLICY "Allow public read board threads"
      ON board_threads FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'board_threads' AND policyname = 'Allow public insert board threads'
  ) THEN
    CREATE POLICY "Allow public insert board threads"
      ON board_threads FOR INSERT
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'board_comments' AND policyname = 'Allow public read board comments'
  ) THEN
    CREATE POLICY "Allow public read board comments"
      ON board_comments FOR SELECT
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'board_comments' AND policyname = 'Allow public insert board comments'
  ) THEN
    CREATE POLICY "Allow public insert board comments"
      ON board_comments FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;
