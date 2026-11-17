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
    ],
    tips: [
      "出発は最寄り駅（渋谷駅）がおすすめ",
      "西武渋谷店前は時間と体力に余裕があれば追加",
      "雨の日はサクラステージ内のランチが安心",
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
