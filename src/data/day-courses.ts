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
      {
        name: "SHIBUYA MEETS SHOKUBUNKA",
        place: "渋谷スクランブルスクエア 13F",
        note: "フードホール形式。複数メニューから選べて、雨の日の休憩にも向く。",
        mapsQuery: "SHIBUYA MEETS SHOKUBUNKA",
        budget: "目安 ¥1,200〜2,000",
      },
      {
        name: "松屋 渋谷店",
        place: "道玄坂",
        note: "予算を抑えたいときの定番。聖地歩きの合間にすぐ戻れる。",
        mapsQuery: "松屋 渋谷店 道玄坂",
        budget: "目安 ¥500〜900",
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
      {
        name: "フロインドリーブ トアロード店",
        place: "トアロード",
        note: "パンと軽食で済ませたいとき。三宮への帰り道にも寄れる。",
        mapsQuery: "フロインドリーブ トアロード",
        budget: "目安 ¥800〜1,500",
      },
      {
        name: "にしむら珈琲店 北野坂店",
        place: "北野坂",
        note: "老舗珈琲店。聖地歩きのあとの休憩・軽食向き。",
        mapsQuery: "にしむら珈琲店 北野坂店",
        budget: "目安 ¥700〜1,500",
      },
      {
        name: "神戸モザイク フードコート",
        place: "ハーバーランド",
        note: "北野のあと海側へ足を伸ばすときの屋内ランチ。天候不安の日向き。",
        mapsQuery: "神戸モザイク フードコート",
        budget: "目安 ¥1,000〜2,000",
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
      {
        name: "らーめんよし乃 本店",
        place: "旭川市",
        note: "醤油旭川ラーメンの人気店。聖地巡りの前後に。",
        mapsQuery: "らーめんよし乃 本店 旭川",
        budget: "目安 ¥900〜1,400",
      },
      {
        name: "蜂屋 四条店",
        place: "旭川市四条",
        note: "醤油・塩の定番ラーメン店。駅からアクセスしやすい。",
        mapsQuery: "蜂屋 四条店 旭川",
        budget: "目安 ¥900〜1,400",
      },
      {
        name: "旭川駅 ASORTA（フードコート）",
        place: "旭川駅",
        note: "駅直結で天候を問わず使える。移動の合間にサクッと。",
        mapsQuery: "旭川駅 ASORTA",
        budget: "目安 ¥800〜1,500",
      },
      {
        name: "スープカレー専門店 エスパーイトウ",
        place: "旭川市",
        note: "ラーメン以外でガッツリ食べたいときのスープカレー。",
        mapsQuery: "エスパーイトウ 旭川",
        budget: "目安 ¥1,200〜1,800",
      },
    ],
    tips: [
      "出発は旭川駅がおすすめ",
      "上平グリーンヒルは距離があるので車前提",
      "冬は路面状況に注意",
    ],
  },
  {
    workTitle: "Bye-Bye Show",
    group: "BiSH",
    title: "浦安・半日コース",
    summary:
      "解散前ラストシングルの原点ロケ地を、鉄鋼通りから千鳥エリアまで徒歩でつなぐコース。解散グループの聖地を静かに巡る想定です。",
    durationLabel: "徒歩 約1.5〜2.5時間（昼食込みで半日）",
    suggestedStopNames: ["浦安・鉄鋼通り（工業地帯）", "浦安・千鳥エリア"],
    lunch: [
      {
        name: "日高屋 浦安店",
        place: "浦安駅徒歩1分",
        note: "駅前でラーメン・定食が安い。聖地エリアから戻ってすぐ腹ごしらえ向き。",
        mapsQuery: "日高屋 浦安店",
        budget: "目安 ¥500〜1,000",
      },
      {
        name: "マルキ食堂",
        place: "浦安駅徒歩2分",
        note: "ボリューム定食。がっつり食べたいときの駅前食堂。",
        mapsQuery: "マルキ食堂 浦安",
        budget: "目安 ¥700〜1,200",
      },
      {
        name: "浦安 幸来",
        place: "浦安駅南口徒歩4分",
        note: "和風だしの『浦安そば』が名物。少し落ち着いてランチしたいとき。",
        mapsQuery: "浦安 幸来",
        budget: "目安 ¥1,000〜1,800",
      },
      {
        name: "イクスピアリ フードコート",
        place: "舞浜",
        note: "隣接の舞浜で天候を問わず休みやすい。選択肢が多い。",
        mapsQuery: "イクスピアリ フードコート",
        budget: "目安 ¥1,000〜2,000",
      },
      {
        name: "ららぽーとTOKYO-BAY フードコート",
        place: "新浦安",
        note: "新浦安起点のときの屋内ランチ。雨の日や複数人でも使いやすい。",
        mapsQuery: "ららぽーとTOKYO-BAY フードコート",
        budget: "目安 ¥900〜1,800",
      },
      {
        name: "マクドナルド 浦安店",
        place: "浦安駅前",
        note: "予算と時間を抑えたいときの保険。聖地歩きの合間にすぐ戻れる。",
        mapsQuery: "マクドナルド 浦安駅",
        budget: "目安 ¥500〜1,000",
      },
    ],
    tips: [
      "出発は新浦安駅または舞浜駅がおすすめ",
      "工業地帯は私有地に立ち入らない",
      "『星が瞬く夜に』と同じ原点エリアなのであわせて意識しやすい",
    ],
  },
  {
    workTitle: "LETTERS",
    group: "BiSH",
    title: "渋谷・半日コース",
    summary:
      "『LETTERS』の渋谷ロケを、道玄坂から宮益坂・宇田川町まで徒歩で巡るコース。屋上は立ち入れない場所もあるので街歩き中心です。",
    durationLabel: "徒歩 約1.5〜2.5時間（昼食込みで半日）",
    suggestedStopNames: [
      "道玄坂上交差点周辺",
      "渋谷スクランブル交差点",
      "宮益坂歩道橋",
      "宇田川町・公園通り歩道橋付近",
    ],
    lunch: [
      {
        name: "十割蕎麦 嵯峨谷 渋谷店",
        place: "道玄坂",
        note: "立ち食い十割そば。短時間で済ませたいとき。",
        mapsQuery: "十割蕎麦 嵯峨谷 渋谷店",
        budget: "目安 ¥500〜1,000",
      },
      {
        name: "中華可菜点心",
        place: "渋谷サクラステージ 4F",
        note: "駅直結で雨の日も安心。",
        mapsQuery: "中華可菜点心 渋谷サクラステージ",
        budget: "目安 ¥1,000〜1,500",
      },
      {
        name: "兆楽 宇田川町店",
        place: "センター街・宇田川町",
        note: "町中華でボリューム重視。宇田川町聖地のすぐそば。",
        mapsQuery: "兆楽 宇田川町店",
        budget: "目安 ¥800〜1,500",
      },
      {
        name: "SHIBUYA MEETS SHOKUBUNKA",
        place: "渋谷スクランブルスクエア 13F",
        note: "フードホール。複数人でも好みが分かれやすいとき向き。",
        mapsQuery: "SHIBUYA MEETS SHOKUBUNKA",
        budget: "目安 ¥1,200〜2,000",
      },
      {
        name: "ラーメン二郎 渋谷店",
        place: "宇田川町",
        note: "ガッツリ系。聖地歩きのあとにエネルギー補給したいとき。",
        mapsQuery: "ラーメン二郎 渋谷店",
        budget: "目安 ¥900〜1,400",
      },
      {
        name: "Café&Meal MUJI 渋谷西武",
        place: "西武渋谷店 2F",
        note: "軽食・サラダ系。西武側を回ったあとに寄れる。",
        mapsQuery: "Café&Meal MUJI 渋谷西武",
        budget: "目安 ¥1,000〜1,800",
      },
      {
        name: "松屋 渋谷店",
        place: "道玄坂",
        note: "予算を抑えたいときの定番。",
        mapsQuery: "松屋 渋谷店 道玄坂",
        budget: "目安 ¥500〜900",
      },
    ],
    tips: [
      "出発は渋谷駅がおすすめ",
      "歩道橋・屋上周辺は通行の妨げにならないよう注意",
      "欅坂46『サイレントマジョリティー』の聖地とも隣接",
    ],
  },
  {
    workTitle: "僕たちは空を見る",
    group: "ラストアイドル",
    title: "渋谷〜六本木・半日コース",
    summary:
      "活動終了前ラスト曲の街中シーンをたどるコース。渋谷から六本木へ地下鉄でつなぎ、半日で回ります。",
    durationLabel: "半日（移動込み）",
    suggestedStopNames: ["渋谷スクランブル交差点", "六本木交差点周辺"],
    lunch: [
      {
        name: "中華可菜点心",
        place: "渋谷サクラステージ 4F",
        note: "渋谷スタート前後の腹ごしらえに。",
        mapsQuery: "中華可菜点心 渋谷サクラステージ",
        budget: "目安 ¥1,000〜1,500",
      },
      {
        name: "十割蕎麦 嵯峨谷 渋谷店",
        place: "道玄坂",
        note: "立ち食いそばで時間を節約したいとき。",
        mapsQuery: "十割蕎麦 嵯峨谷 渋谷店",
        budget: "目安 ¥500〜1,000",
      },
      {
        name: "TOKYO FOOD COURT",
        place: "六本木ヒルズ",
        note: "六本木到着後に立ち寄りやすいフードコート。",
        mapsQuery: "TOKYO FOOD COURT 六本木ヒルズ",
        budget: "目安 ¥1,000〜2,000",
      },
      {
        name: "AFURI 六本木ヒルズ店",
        place: "六本木ヒルズ",
        note: "柚子塩らーめんなど軽め〜しっかり選べる。聖地近くで休憩しやすい。",
        mapsQuery: "AFURI 六本木ヒルズ",
        budget: "目安 ¥1,100〜1,800",
      },
      {
        name: "モスバーガー 六本木店",
        place: "六本木交差点付近",
        note: "交差点周辺でサクッと済ませたいときの保険。",
        mapsQuery: "モスバーガー 六本木店",
        budget: "目安 ¥700〜1,200",
      },
      {
        name: "TSUTAYA TOKYO ROPPONGI カフェ",
        place: "六本木交差点すぐ",
        note: "ブックカフェで軽食・休憩。雨の日や待ち時間にも向く。",
        mapsQuery: "TSUTAYA TOKYO ROPPONGI",
        budget: "目安 ¥800〜1,500",
      },
    ],
    tips: [
      "渋谷→六本木は日比谷線がわかりやすい",
      "看板そのものは当時限りなので、街の空気を味わう巡礼向き",
      "通行・撮影マナーに注意",
    ],
  },
  {
    workTitle: "いつの日かどこかで",
    group: "ラストアイドル",
    title: "秩父・半日コース",
    summary:
      "Someday Somewhere『いつの日かどこかで』の野外ステージと廃校を巡るコース。車があると回りやすいです。",
    durationLabel: "半日（移動込み）",
    suggestedStopNames: ["秩父ミューズパーク 野外ステージ", "旧三田川中学校"],
    lunch: [
      {
        name: "そば処 長命庵",
        place: "秩父市内",
        note: "秩父名物そばで休憩向き。",
        mapsQuery: "そば処 長命庵 秩父",
        budget: "目安 ¥900〜1,500",
      },
      {
        name: "原田食堂",
        place: "秩父駅周辺",
        note: "豚みそ丼の定番候補。移動の前後に駅前で済ませやすい。",
        mapsQuery: "原田食堂 秩父 豚みそ丼",
        budget: "目安 ¥800〜1,400",
      },
      {
        name: "そば処 みやもと",
        place: "秩父市内",
        note: "手打ちそば。聖地巡りの合間にゆっくりしたいとき。",
        mapsQuery: "そば処 みやもと 秩父",
        budget: "目安 ¥900〜1,600",
      },
      {
        name: "秩父駅前 おがのや",
        place: "秩父駅前",
        note: "釜めしなど駅前で持ち帰れる選択肢。時間がないとき向き。",
        mapsQuery: "おがのや 秩父駅",
        budget: "目安 ¥800〜1,500",
      },
      {
        name: "道の駅 ちちぶ",
        place: "秩父市",
        note: "車移動前提の休憩。地元グルメとトイレ休憩をまとめやすい。",
        mapsQuery: "道の駅 ちちぶ",
        budget: "目安 ¥700〜1,500",
      },
      {
        name: "カフェレスト ミューズ",
        place: "秩父ミューズパーク内",
        note: "野外ステージ聖地のすぐそば。園内で軽く済ませたいとき。",
        mapsQuery: "カフェレスト ミューズ 秩父",
        budget: "目安 ¥800〜1,500",
      },
    ],
    tips: [
      "出発は西武秩父駅がおすすめ",
      "廃校は立ち入れる範囲を確認",
      "山間部なので歩きやすい靴で",
    ],
  },
  {
    workTitle: "シルクハットパレード",
    group: "26時のマスカレイド",
    title: "渋谷〜横浜元町・半日コース",
    summary:
      "解散したニジマスの『シルクハットパレード』を、渋谷のスタジオ周辺から横浜・クリフサイドへ巡るコース。",
    durationLabel: "半日（移動込み）",
    suggestedStopNames: ["Le CAVE STUDIO", "クリフサイド"],
    lunch: [
      {
        name: "十割蕎麦 嵯峨谷 渋谷店",
        place: "道玄坂",
        note: "渋谷スタート時の軽食向き。",
        mapsQuery: "十割蕎麦 嵯峨谷 渋谷店",
        budget: "目安 ¥500〜1,000",
      },
      {
        name: "中華可菜点心",
        place: "渋谷サクラステージ 4F",
        note: "駅直結。東横線に乗る前の腹ごしらえに。",
        mapsQuery: "中華可菜点心 渋谷サクラステージ",
        budget: "目安 ¥1,000〜1,500",
      },
      {
        name: "元町珈琲 元町本店",
        place: "元町",
        note: "クリフサイド近くで休憩しやすいカフェ。軽食あり。",
        mapsQuery: "元町珈琲 元町本店",
        budget: "目安 ¥800〜1,600",
      },
      {
        name: "えびや食堂",
        place: "元町商店街",
        note: "洋食の定番。クリフサイド訪問の前後に寄れる。",
        mapsQuery: "えびや食堂 元町",
        budget: "目安 ¥1,200〜2,000",
      },
      {
        name: "中華街 萬珍樓點心鋪",
        place: "横浜中華街",
        note: "元町から歩いて点心ランチ。複数人でも回りやすい。",
        mapsQuery: "萬珍樓點心鋪 横浜中華街",
        budget: "目安 ¥1,200〜2,000",
      },
      {
        name: "崎陽軒 元町店",
        place: "元町",
        note: "シウマイ弁当で持ち歩き休憩したいとき。",
        mapsQuery: "崎陽軒 元町店",
        budget: "目安 ¥700〜1,200",
      },
    ],
    tips: [
      "渋谷→元町・中華街は東急東横線が便利",
      "スタジオ内部は非公開のことが多いので外観巡礼を想定",
      "クリフサイドはイベント・貸切状況を確認",
    ],
  },
  {
    workTitle: "Next Flight",
    group: "PASSPO☆",
    title: "羽田・短時間コース",
    summary:
      "解散したPASSPO☆の『空と旅』の象徴、羽田神社を巡る短めコース。空港アクセスと組み合わせやすいです。",
    durationLabel: "徒歩・バス 約1〜2時間",
    suggestedStopNames: ["羽田神社"],
    lunch: [
      {
        name: "羽田空港 第3ターミナル 江戸小路",
        place: "羽田空港 第3ターミナル",
        note: "和食・丼ものが揃うエリア。巡礼の前後に空港グルメで休憩しやすい。",
        mapsQuery: "羽田空港 第3ターミナル 江戸小路",
        budget: "目安 ¥1,000〜2,000",
      },
      {
        name: "羽田空港 第3ターミナル ラーメンストリート",
        place: "羽田空港 第3ターミナル",
        note: "ラーメン好き向け。フライト前後でも使いやすい。",
        mapsQuery: "羽田空港 第3ターミナル ラーメン",
        budget: "目安 ¥900〜1,600",
      },
      {
        name: "羽田空港 第1ターミナル マーケットプレイス",
        place: "羽田空港 第1ターミナル",
        note: "国内線利用時のランチ候補。選択肢が広い。",
        mapsQuery: "羽田空港 第1ターミナル レストラン",
        budget: "目安 ¥1,000〜2,000",
      },
      {
        name: "穴子家 はなぶさ",
        place: "羽田空港 第3ターミナル",
        note: "穴子丼など空港らしい一品を食べたいとき。",
        mapsQuery: "穴子家 はなぶさ 羽田",
        budget: "目安 ¥1,500〜2,500",
      },
      {
        name: "本格手打うどん 麺くぼた",
        place: "天空橋・大鳥居周辺",
        note: "羽田神社寄りの街中うどん。空港に入らず済ませたいとき。",
        mapsQuery: "麺くぼた 大鳥居",
        budget: "目安 ¥800〜1,400",
      },
      {
        name: "ガスト 京急蒲田店",
        place: "京急蒲田",
        note: "京急アクセス時の保険。予算と時間を抑えたいとき。",
        mapsQuery: "ガスト 京急蒲田店",
        budget: "目安 ¥700〜1,300",
      },
    ],
    tips: [
      "京急・空港バスでアクセスしやすい",
      "参拝マナーを守る",
      "時間があれば立川の『バチェロレッテは終わらない』聖地も別日で",
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
