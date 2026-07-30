-- AMEFURASSHI MV ロケ地（初期データ）
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
    'amefurasshi-1',
    'ロイヤルチェスター太田',
    'DROP DROP',
    'AMEFURASSHI',
    'MV',
    '群馬県',
    '関東',
    '群馬県太田市飯塚町2056',
    'ステンドグラスやクラシカルな内装を持つ結婚式場。施設運営会社が『DROP DROP』のMV撮影地であることを公表している。',
    36.284244,
    139.375961,
    'official'
  ),
  (
    'amefurasshi-2',
    'DEMODE DINER 福生店',
    'MICHI',
    'AMEFURASSHI',
    'MV',
    '東京都',
    '関東',
    '東京都福生市熊川1121',
    '国道16号沿いのアメリカンダイナー。『MICHI』のMVでダンスシーンなどが撮影された。',
    35.730956,
    139.341958,
    'official'
  )
ON CONFLICT (legacy_id) DO NOTHING;
