-- コレって恋ですか？ MV ロケ地（初期データ）
INSERT INTO community_spots (
  legacy_id,
  name,
  work_title,
  group_name,
  category,
  prefecture,
  region,
  address,
  description,
  latitude,
  longitude,
  source
) VALUES
  (
    'korekoi-1',
    '河口湖音楽と森の美術館',
    'シンキロウ',
    'コレって恋ですか？',
    'MV',
    '山梨県',
    '中部',
    '山梨県南都留郡富士河口湖町河口3077-20',
    '『シンキロウ』のMV撮影地。ヨーロッパ風の建物や庭園、噴水などを生かした幻想的な映像が撮影された。' || E'\n年代: 2020年代',
    35.522414,
    138.768648,
    'official'
  )
ON CONFLICT (legacy_id) DO NOTHING;
