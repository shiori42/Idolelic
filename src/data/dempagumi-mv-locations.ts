import {
  sacredPlacesToMockSpots,
  type SacredPlace,
} from "@/data/sacred-place";

export const dempagumiMvLocations: SacredPlace[] = [
  {
    group: "でんぱ組.inc",
    name: "L'atelier onze",
    prefecture: "千葉県",
    address: "千葉県大網白里市季美の森南2丁目28-24",
    latitude: 35.5543,
    longitude: 140.2987,
    description:
      "南仏プロヴァンス風のハウススタジオ。『好感Daybook♡』のMV撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "好感Daybook♡",
  },
  {
    group: "でんぱ組.inc",
    name: "旧海岸第十三スタジオ",
    prefecture: "東京都",
    address: "東京都大田区南六郷1丁目20-10 1F",
    latitude: 35.5506,
    longitude: 139.7208,
    description:
      "大田区南六郷にある大型撮影スタジオ。『我ら令和のかえるちゃん！』のMV撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "我ら令和のかえるちゃん！",
  },
  {
    group: "でんぱ組.inc",
    name: "CONTACT STUDIO",
    prefecture: "千葉県",
    address: "千葉県山武郡九十九里町作田5633-312",
    latitude: 35.549802,
    longitude: 140.46522,
    description:
      "九十九里浜近くにある自然光撮影スタジオ。『サクラあっぱれーしょん』のMV撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "サクラあっぱれーしょん",
  },
  {
    group: "でんぱ組.inc",
    name: "山下公園・沈床花壇",
    prefecture: "神奈川県",
    address: "神奈川県横浜市中区山下町279",
    latitude: 35.445702,
    longitude: 139.649897,
    description:
      "山下公園内の沈床花壇。『ファンシーほっぺ♡ウ・フ・フ』の屋外シーン撮影地。",
    category: "MV",
    region: "関東",
    workTitle: "ファンシーほっぺ♡ウ・フ・フ",
  },
  {
    group: "でんぱ組.inc",
    name: "三浦海岸",
    prefecture: "神奈川県",
    address: "神奈川県三浦市南下浦町上宮田",
    latitude: 35.184212,
    longitude: 139.654361,
    description:
      "『アイノカタチ』のMVが全編撮影された海岸。公式発表および音楽メディアで撮影地が確認されている。",
    category: "MV",
    region: "関東",
    workTitle: "アイノカタチ",
  },
  {
    group: "でんぱ組.inc",
    name: "STUDIO HONJO SLUM",
    prefecture: "埼玉県",
    address: "埼玉県児玉郡美里町沼上85-2",
    latitude: 36.1867,
    longitude: 139.1815,
    description:
      "瓦工場跡を利用した大型廃工場スタジオ。施設紹介で『形而上学的、魔法』のMV撮影実績が明記されている。",
    category: "MV",
    region: "関東",
    workTitle: "形而上学的、魔法",
  },
  {
    group: "でんぱ組.inc",
    name: "オノデン本館",
    prefecture: "東京都",
    address: "東京都千代田区外神田1丁目2-7",
    latitude: 35.698306,
    longitude: 139.770972,
    description:
      "秋葉原の家電量販店。『アキハバライフ♪』のMV撮影地として確認されている。",
    category: "MV",
    region: "関東",
    workTitle: "アキハバライフ♪",
  },
];

export const DEMPAGUMI_MOCK_SPOTS = sacredPlacesToMockSpots(
  dempagumiMvLocations,
  "dempagumi",
);
