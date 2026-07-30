-- 東京女子流 MV ロケ地（追加分）
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
    'tgs-6',
    'みなとみらいグランドセントラルタワー',
    'predawn',
    '東京女子流',
    'MV',
    '神奈川県',
    '関東',
    '神奈川県横浜市西区みなとみらい4-6-2',
    '『predawn』のMV撮影地。ビル屋上のヘリポートでパフォーマンスシーンが撮影された。',
    35.458559,
    139.628633,
    'official'
  ),
  (
    'tgs-7',
    'YELLOW STUDIO A Studio',
    'Get The Star',
    '東京女子流',
    'MV',
    '神奈川県',
    '関東',
    '神奈川県横浜市都筑区高山18-25',
    '『Get The Star』のMV撮影地。大型ホリゾントを備えた撮影スタジオのA Studioが使用された。',
    35.53368,
    139.56107,
    'official'
  ),
  (
    'tgs-8',
    'ウエディングファンタジア',
    'We Will Win',
    '東京女子流',
    'MV',
    '静岡県',
    '中部',
    '静岡県沼津市春日町17-5',
    '『We Will Win』のMV撮影地。港に面した結婚式場で撮影された。撮影当時の名称はSt. Valentin WEDDING FANTASIA。',
    35.085157,
    138.859888,
    'official'
  ),
  (
    'tgs-9',
    '神戸ハーバーランド',
    'サヨナラ、ありがとう。',
    '東京女子流',
    'MV',
    '兵庫県',
    '近畿',
    '兵庫県神戸市中央区東川崎町1丁目',
    '『サヨナラ、ありがとう。』のMV撮影地。神戸港沿いのハーバーランド一帯で屋外シーンが撮影された。',
    34.679565,
    135.181664,
    'official'
  )
ON CONFLICT (legacy_id) DO NOTHING;
