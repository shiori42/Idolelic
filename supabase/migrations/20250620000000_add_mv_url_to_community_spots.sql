-- community_spots に MV リンク列を追加
ALTER TABLE community_spots
  ADD COLUMN IF NOT EXISTS mv_url TEXT;
