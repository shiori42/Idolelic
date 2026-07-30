-- こぶしファクトリー MV ロケ地（追加分）
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
    'kobushi-6',
    'たちかわ創造舎（旧多摩川小学校）',
    'これからだ！',
    'こぶしファクトリー',
    'MV',
    '東京都',
    '関東',
    '東京都立川市富士見町6-46-1',
    '『これからだ！』のMV撮影地。旧小学校を活用した文化創造施設で、屋上などが撮影に使われた。',
    35.691589,
    139.38989,
    'official'
  ),
  (
    'kobushi-7',
    'プラネアール 青梅スタジオ',
    'きっと私は',
    'こぶしファクトリー',
    'MV',
    '東京都',
    '関東',
    '東京都青梅市成木8-333',
    '『きっと私は』のMV撮影地。築年数の長い古民家を利用した撮影スタジオ。',
    35.818754,
    139.239064,
    'official'
  )
ON CONFLICT (legacy_id) DO NOTHING;
