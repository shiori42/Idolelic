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
    expect(course?.lunch.length).toBeGreaterThanOrEqual(1);
  });

  it("ランチの地図URLを作れる", () => {
    const course = findDayCourse("サイレントマジョリティー");
    const url = buildLunchMapsUrl(course!.lunch[0]);
    const params = new URL(url).searchParams;
    expect(url).toContain("google.com/maps/search");
    expect(params.get("query")).toBe(course!.lunch[0].mapsQuery);
  });
});
