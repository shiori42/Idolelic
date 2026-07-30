-- 公式聖地用 legacy_id（URL 互換）
ALTER TABLE community_spots
  ADD COLUMN IF NOT EXISTS legacy_id TEXT UNIQUE;

-- 旧ダミー聖地（グループA〜C）は入れない。
-- 実データは 20250603000000 以降の seed を参照。
