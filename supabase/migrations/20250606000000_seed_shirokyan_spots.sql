-- 真っ白なキャンバス MV ロケ地（初期データ）
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
    'shirokyan-1',
    '成田山新勝寺',
    '闘う門には幸来たる',
    '真っ白なキャンバス',
    'MV',
    '千葉県',
    '関東',
    '千葉県成田市成田1',
    '『闘う門には幸来たる』のMV撮影地。境内を舞台に、和風の映像演出と力強いダンスパフォーマンスが撮影された。' || E'\n年代: 2010年代',
    35.785091,
    140.318101,
    'official'
  ),
  (
    'shirokyan-2',
    'STUDIO EASE 目黒',
    '光になって',
    '真っ白なキャンバス',
    'MV',
    '東京都',
    '関東',
    '東京都品川区西五反田3丁目1-2',
    '『光になって』のMV撮影地。ヨーロッパの街並みを再現したスタジオで、白を基調とした明るい映像が撮影された。' || E'\n年代: 2020年代',
    35.62997,
    139.71746,
    'official'
  ),
  (
    'shirokyan-3',
    '東京多摩フットボールセンター・南豊ヶ丘フィールド',
    'Bye My Summer',
    '真っ白なキャンバス',
    'MV',
    '東京都',
    '関東',
    '東京都多摩市豊ヶ丘6丁目4',
    '『Bye My Summer』のMV撮影地。旧南豊ヶ丘小学校を活用した施設で、グラウンドや校舎、屋上へ続く階段などが使用された。' || E'\n年代: 2020年代',
    35.61275,
    139.42866,
    'official'
  )
ON CONFLICT (legacy_id) DO NOTHING;
