export type DayCourseLunch = {
  name: string;
  place: string;
  note: string;
  mapsQuery: string;
  budget: string;
};

export type DayCourse = {
  workTitle: string;
  group: string;
  title: string;
  summary: string;
  durationLabel: string;
  /** 半日のおすすめ聖地（名前一致） */
  suggestedStopNames: string[];
  lunch: DayCourseLunch[];
  tips: string[];
};

/** 一日／半日で回れるモデルコース（使う側視点） */
export const DAY_COURSES: DayCourse[] = [
  {
    workTitle: "サイレントマジョリティー",
    group: "欅坂46",
    title: "渋谷・半日コース",
    summary:
      "渋谷駅から徒歩で聖地を回る。途中でランチを挟む想定の、一日のうち半日で回せるコースです。",
    durationLabel: "徒歩 約2〜3時間（昼食込みで半日）",
    suggestedStopNames: ["渋谷ストリーム", "稲荷橋", "さくら通り"],
    lunch: [
      {
        name: "中華可菜点心",
        place: "渋谷サクラステージ 4F FOOD MET",
        note: "駅直結のフードコート。稲荷橋・さくら通りの合間に立ち寄りやすい点心・担々麺。",
        mapsQuery: "中華可菜点心 渋谷サクラステージ",
        budget: "目安 ¥1,000〜1,500",
      },
      {
        name: "to your Farm",
        place: "渋谷サクラステージ B1F",
        note: "軽めに済ませたいときのサラダボウル。歩きの合間の休憩向き。",
        mapsQuery: "to your Farm 渋谷サクラステージ",
        budget: "目安 ¥800〜1,500",
      },
      {
        name: "ラーメン豚山 渋谷サクラステージ店",
        place: "渋谷サクラステージ 1F",
        note: "ガッツリ食べたいときの二郎系。聖地歩きのあとでもう一踏ん張りしたい人向け。",
        mapsQuery: "豚山 渋谷サクラステージ",
        budget: "目安 ¥1,000〜1,500",
      },
      {
        name: "Café&Meal MUJI 渋谷西武",
        place: "西武渋谷店 2F",
        note: "西武渋谷店前の聖地とセットで立ち寄りやすい。軽食・サラダ系。",
        mapsQuery: "Café&Meal MUJI 渋谷西武",
        budget: "目安 ¥1,000〜1,800",
      },
      {
        name: "十割蕎麦 嵯峨谷 渋谷店",
        place: "道玄坂",
        note: "立ち食い十割そば。西武・道玄坂側を回ったあとにサクッと済ませたいとき。",
        mapsQuery: "十割蕎麦 嵯峨谷 渋谷店",
        budget: "目安 ¥500〜1,000",
      },
      {
        name: "兆楽 宇田川町店",
        place: "センター街・宇田川町",
        note: "町中華でボリューム重視。西武渋谷店前のあとに寄れる。",
        mapsQuery: "兆楽 宇田川町店",
        budget: "目安 ¥800〜1,500",
      },
    ],
    tips: [
      "出発は最寄り駅（渋谷駅）がおすすめ",
      "西武渋谷店前・ホーム眺望・渋谷川は時間があれば追加",
      "富士見橋は豊洲／有明側なので、渋谷とは別枠で巡る",
      "雨の日はサクラステージ内のランチが安心",
    ],
  },
  {
    workTitle: "SUNDAY MORNING",
    group: "Pimm's",
    title: "神戸北野・半日コース",
    summary:
      "三宮から北野異人館街を歩いて回るコース。坂道が多いので、途中でランチを挟むと歩きやすいです。",
    durationLabel: "徒歩 約2〜3時間（昼食込みで半日）",
    suggestedStopNames: [
      "北野町広場",
      "トーマス坂",
      "風見鶏本舗 北野本店前",
    ],
    lunch: [
      {
        name: "風見鶏のタマゴ",
        place: "北野町・観光案内所 2F",
        note: "風見鶏の館すぐそば。オムライスなど、聖地巡りの合間に寄れる定番。",
        mapsQuery: "風見鶏のタマゴ 北野",
        budget: "目安 ¥1,200〜2,000",
      },
      {
        name: "スターバックス コーヒー 北野異人館店",
        place: "北野町",
        note: "異人館を再利用した店舗。軽食や休憩に。歩き疲れたときの小休止向き。",
        mapsQuery: "スターバックス 北野異人館店",
        budget: "目安 ¥500〜1,200",
      },
      {
        name: "FARMSTAND",
        place: "山本通",
        note: "地元野菜のワンプレート。北野から少し下った場所で、しっかりランチしたいとき。",
        mapsQuery: "FARMSTAND 神戸 山本通",
        budget: "目安 ¥1,300〜1,800",
      },
    ],
    tips: [
      "出発は三宮駅がおすすめ（新神戸からも歩ける）",
      "坂が多いので水分と歩きやすい靴を",
      "北野通りは時間があれば追加",
    ],
  },
  {
    workTitle: "世界には愛しかない",
    group: "欅坂46",
    title: "旭川・日帰りコース",
    summary:
      "旭川駅を起点に、近い聖地をまとめて回る想定。車移動が現実的ですが、駅周辺でランチを挟めます。",
    durationLabel: "半日〜1日（移動込み）",
    suggestedStopNames: ["伊納大橋", "旧北海道旭川北都商業高校"],
    lunch: [
      {
        name: "らーめんや ひむろ",
        place: "旭川市",
        note: "旭川ラーメンの定番候補。聖地巡りの前後に腹ごしらえ向き。",
        mapsQuery: "らーめんや ひむろ 旭川",
        budget: "目安 ¥900〜1,400",
      },
      {
        name: "成吉思汗 大黒屋",
        place: "旭川市",
        note: "しっかり食べたいときのジンギスカン。一日コースの締めや休憩に。",
        mapsQuery: "成吉思汗 大黒屋 旭川",
        budget: "目安 ¥1,500〜3,000",
      },
    ],
    tips: [
      "出発は旭川駅がおすすめ",
      "上平グリーンヒルは距離があるので車前提",
      "冬は路面状況に注意",
    ],
  },
];

export function findDayCourse(
  workTitle: string,
  group?: string,
): DayCourse | null {
  const title = workTitle.trim();
  const g = group?.trim();
  return (
    DAY_COURSES.find(
      (course) =>
        course.workTitle === title && (!g || course.group === g),
    ) ?? null
  );
}

export function buildLunchMapsUrl(lunch: DayCourseLunch) {
  const params = new URLSearchParams({
    api: "1",
    query: lunch.mapsQuery,
  });
  return `https://www.google.com/maps/search/?${params.toString()}`;
}
