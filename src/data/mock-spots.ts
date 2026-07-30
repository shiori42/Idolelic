export type SpotSource = "official" | "community";

export type MockSpot = {
  id: string;
  name: string;
  workTitle: string;
  group: string;
  category: string;
  prefecture: string;
  region: string;
  address: string;
  description: string;
  era?: string;
  /** YouTube など MV 視聴用 URL（任意） */
  mvUrl?: string;
  latitude?: number;
  longitude?: number;
  source: SpotSource;
  submittedBy?: string;
};

export const MOCK_REGIONS = {
  北海道: ["北海道"],
  東北: ["青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県"],
  関東: [
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
  ],
  中部: [
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
  ],
  近畿: ["三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県"],
  中国: ["鳥取県", "島根県", "岡山県", "広島県", "山口県"],
  四国: ["徳島県", "香川県", "愛媛県", "高知県"],
  "九州・沖縄": [
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県",
  ],
} as const;

export type MockRegion = keyof typeof MOCK_REGIONS;

export const MOCK_OSHI_GROUPS = [
  "欅坂46",
  "ラストアイドル",
  "26時のマスカレイド",
  "真っ白なキャンバス",
  "神宿",
  "ひめキュンフルーツ缶",
] as const;

export const MOCK_SPOT_GROUPS = ["すべて", ...MOCK_OSHI_GROUPS] as const;

export const MOCK_SPOT_CATEGORIES = ["すべて", "MV", "その他"] as const;

/** @deprecated ダミー聖地は削除済み。公式聖地は各 *-mv-locations.ts を参照 */
export const MOCK_SPOTS: MockSpot[] = [];

export const MOCK_GOALS = {
  stepGoal: 8_000,
  distanceGoalKm: 5,
};

export const MOCK_DASHBOARD = {
  steps: 6_240,
  distanceKm: 3.8,
  calories: 218,
  oshiGroup: "欅坂46",
  ...MOCK_GOALS,
};

export const MOCK_LOGGED_IN_USER = {
  name: "巡礼者ゆい",
  totalSteps: 42_180,
};

export const MOCK_SNS_PROVIDERS = [
  { id: "google", label: "Google", linked: true },
  { id: "apple", label: "Apple", linked: false },
  { id: "x", label: "X（Twitter）", linked: false },
] as const;

export const MOCK_WALK_NAV = {
  destination: "渋谷ストリーム",
  wbgt: 32,
  wbgtLocked: true,
  nextLandmark: "450 m · 河川敷の階段",
  effectiveSteps: 3_420,
  speedKmh: 4.2,
};
