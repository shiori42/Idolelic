-- ひめキュンフルーツ缶 MV ロケ地（初期データ）
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
    'himekyun-1',
    '中田島砂丘',
    'ハルカナタ',
    'ひめキュンフルーツ缶',
    'MV',
    '静岡県',
    '中部',
    '静岡県浜松市中央区中田島町1313',
    '『ハルカナタ』のMV撮影地。広大な砂丘を舞台に、制服姿のメンバーだけが世界に取り残されたような映像が撮影された。' || E'\n年代: 2010年代',
    34.661445,
    137.739696,
    'official'
  )
ON CONFLICT (legacy_id) DO NOTHING;
