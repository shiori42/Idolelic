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

  it("解散グループの半日コースがある", () => {
    expect(
      findDayCourse("Bye-Bye Show", "BiSH")?.suggestedStopNames,
    ).toContain("浦安・鉄鋼通り（工業地帯）");
    expect(
      findDayCourse("LETTERS", "BiSH")?.suggestedStopNames.length,
    ).toBeGreaterThanOrEqual(3);
    expect(
      findDayCourse("僕たちは空を見る", "ラストアイドル")?.lunch.length,
    ).toBeGreaterThan(0);
    expect(
      findDayCourse("シルクハットパレード", "26時のマスカレイド")
        ?.suggestedStopNames,
    ).toContain("クリフサイド");
    expect(
      findDayCourse("Next Flight", "PASSPO☆")?.suggestedStopNames,
    ).toContain("羽田神社");
  });

  it("ランチの地図URLを作れる", () => {
    const course = findDayCourse("サイレントマジョリティー");
    const url = buildLunchMapsUrl(course!.lunch[0]);
    const params = new URL(url).searchParams;
    expect(url).toContain("google.com/maps/search");
    expect(params.get("query")).toBe(course!.lunch[0].mapsQuery);
  });

  it("全コースにランチ候補が複数ある", async () => {
    const { DAY_COURSES } = await import("@/data/day-courses");
    for (const course of DAY_COURSES) {
      expect(
        course.lunch.length,
        `${course.group} / ${course.workTitle}`,
      ).toBeGreaterThanOrEqual(5);
      for (const lunch of course.lunch) {
        expect(lunch.mapsQuery.length).toBeGreaterThan(0);
        expect(lunch.budget.length).toBeGreaterThan(0);
      }
    }
  });
});
