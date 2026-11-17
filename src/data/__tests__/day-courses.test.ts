import { describe, expect, it } from "vitest";

import {
  buildLunchMapsUrl,
  findDayCourse,
} from "@/data/day-courses";

describe("day courses", () => {
  it("サイレントマジョリティーの半日コースとランチがある", () => {
    const course = findDayCourse("サイレントマジョリティー", "欅坂46");
    expect(course?.title).toBe("渋谷・半日コース");
    expect(course?.suggestedStopNames).toContain("稲荷橋");
    expect(course?.lunch.length).toBeGreaterThanOrEqual(4);
  });

  it("SUNDAY MORNING と世界には愛しかないにもコースがある", () => {
    expect(findDayCourse("SUNDAY MORNING", "Pimm's")?.lunch.length).toBeGreaterThan(0);
    expect(
      findDayCourse("世界には愛しかない", "欅坂46")?.suggestedStopNames,
    ).toContain("伊納大橋");
  });

  it("乃木坂・櫻坂・日向坂にも半日コースがある", () => {
    expect(
      findDayCourse("僕は僕を好きになる", "乃木坂46")?.suggestedStopNames,
    ).toContain("スペイン坂");
    expect(
      findDayCourse("歩道橋", "乃木坂46")?.suggestedStopNames.length,
    ).toBeGreaterThanOrEqual(3);
    expect(
      findDayCourse("ソンナコトナイヨ", "日向坂46")?.lunch.length,
    ).toBeGreaterThan(0);
    expect(
      findDayCourse("偶然の答え", "櫻坂46")?.suggestedStopNames,
    ).toContain("スペイン坂");
  });

  it("ランチの地図URLを作れる", () => {
    const course = findDayCourse("サイレントマジョリティー");
    const url = buildLunchMapsUrl(course!.lunch[0]);
    const params = new URL(url).searchParams;
    expect(url).toContain("google.com/maps/search");
    expect(params.get("query")).toBe(course!.lunch[0].mapsQuery);
  });
});
