export type MockMemory = {
  id: string;
  spotId: string;
  author: string;
  body: string;
  visitedEra?: string;
  createdAt: string;
};

export const MOCK_MEMORIES: MockMemory[] = [
  {
    id: "m1",
    spotId: "1",
    author: "平成遺産保存会",
    visitedEra: "2014年頃",
    body: "解散前の最後のMVロケを見に行きました。夕方だと交差点の灯りがきれいで、当時のPVを思い出します。",
    createdAt: "2026/05/12",
  },
  {
    id: "m2",
    spotId: "1",
    author: "渋谷おじさん",
    visitedEra: "2012年頃",
    body: "デビュー当時はここが聖地というより「みんなが集まる場所」でした。今でもたまに同好会の人を見かけます。",
    createdAt: "2026/04/28",
  },
  {
    id: "m3",
    spotId: "2",
    author: "湾岸ウォーカー",
    visitedEra: "解散直前",
    body: "レインボーブリッジをバックにしたあのカット。風が強い日は撮影当時を想像しながら歩くのが好きです。",
    createdAt: "2026/05/03",
  },
  {
    id: "m4",
    spotId: "5",
    author: "横浜巡礼者",
    visitedEra: "2015年頃",
    body: "赤レンガ倉庫は今も雰囲気が残っています。イベントの時期だと当時のライブPVを思い出す人が多いです。",
    createdAt: "2026/03/15",
  },
];
