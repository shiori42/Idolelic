export type TgsDemoSpot = {
  id: string;
  name: string;
  group: string;
  workTitle: string;
  prefecture: string;
  address: string;
  description: string;
  /** 簡易マップ上の位置（%） */
  mapX: number;
  mapY: number;
};

export type TgsDemoThread = {
  id: string;
  title: string;
  group: string;
  body: string;
  author: string;
  comments: { author: string; body: string }[];
};

export const TGS_DEMO_SPOTS: TgsDemoSpot[] = [
  {
    id: "shibuya-stream",
    name: "渋谷ストリーム",
    group: "欅坂46",
    workTitle: "サイレントマジョリティー",
    prefecture: "東京都",
    address: "東京都渋谷区渋谷3丁目21-3",
    description:
      "『サイレントマジョリティー』のダンスシーンが撮影された場所。いまは渋谷ストリームとして整備されている。",
    mapX: 48,
    mapY: 42,
  },
  {
    id: "makuhari",
    name: "エム・ベイポイント幕張前広場",
    group: "欅坂46",
    workTitle: "世界には愛しかない",
    prefecture: "千葉県",
    address: "千葉県千葉市美浜区ひび野2",
    description: "MVロケで使われた幕張周辺の広場。",
    mapX: 62,
    mapY: 48,
  },
  {
    id: "yamashita",
    name: "山下埠頭",
    group: "欅坂46",
    workTitle: "二人セゾン",
    prefecture: "神奈川県",
    address: "神奈川県横浜市中区山下町",
    description: "横浜・山下埠頭周辺のロケ地。",
    mapX: 42,
    mapY: 58,
  },
];

export const TGS_DEMO_THREADS: TgsDemoThread[] = [
  {
    id: "t1",
    title: "あのMVの階段はどこ？",
    group: "欅坂46",
    body: "夕方のロケっぽい階段なんだけど、場所がわからない…",
    author: "巡礼者A",
    comments: [
      { author: "巡礼者B", body: "渋谷周辺じゃない？ストリーム付近を見てみて" },
      { author: "巡礼者C", body: "サイレントマジョリティーっぽい雰囲気だね" },
    ],
  },
  {
    id: "t2",
    title: "港っぽいロケ地を探してます",
    group: "欅坂46",
    body: "海が見える埠頭のはず。神奈川寄り？",
    author: "巡礼者D",
    comments: [{ author: "巡礼者E", body: "山下埠頭あたりが近いと思う！" }],
  },
];

export const TGS_WALK_GOAL_STEPS = 25;
