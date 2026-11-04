import { describe, expect, it } from "vitest";

import type { MockSpot } from "@/data/mock-spots";
import {
  decodeWorkTourId,
  encodeWorkTourId,
  filterWorkTours,
  findWorkTour,
  groupSpotsByWork,
  orderTourSpots,
  suggestTourTravelMode,
} from "@/lib/spots/work-tours";

function spot(partial: Partial<MockSpot> & Pick<MockSpot, "id" | "name">): MockSpot {
  return {
    workTitle: "作品",
    group: "グループ",
    category: "MV",
    prefecture: "東京都",
    region: "関東",
    address: "住所",
    description: "",
    source: "official",
    ...partial,
  };
}

describe("work tour id", () => {
  it("グループとタイトルを往復できる", () => {
    const id = encodeWorkTourId("欅坂46", "サイレントマジョリティー");
    expect(decodeWorkTourId(id)).toEqual({
      group: "欅坂46",
      workTitle: "サイレントマジョリティー",
    });
  });
});

describe("groupSpotsByWork", () => {
  it("同じタイトルをまとめ、か所数が多い順にする", () => {
    const tours = groupSpotsByWork([
      spot({ id: "a", name: "A", workTitle: "一か所" }),
      spot({ id: "b", name: "B", workTitle: "四か所" }),
      spot({ id: "c", name: "C", workTitle: "四か所" }),
      spot({ id: "d", name: "D", workTitle: "四か所" }),
    ]);
    expect(tours.map((tour) => tour.workTitle)).toEqual(["四か所", "一か所"]);
    expect(tours[0].spots).toHaveLength(3);
  });
});

describe("filterWorkTours", () => {
  it("曲名・グループ名で絞り込む", () => {
    const tours = groupSpotsByWork([
      spot({
        id: "a",
        name: "A",
        group: "欅坂46",
        workTitle: "サイレントマジョリティー",
      }),
      spot({
        id: "b",
        name: "B",
        group: "乃木坂46",
        workTitle: "世界には愛しかない",
      }),
    ]);
    expect(
      filterWorkTours(tours, "サイレント").map((tour) => tour.workTitle),
    ).toEqual(["サイレントマジョリティー"]);
    expect(filterWorkTours(tours, "乃木坂").map((tour) => tour.group)).toEqual([
      "乃木坂46",
    ]);
    expect(filterWorkTours(tours, "")).toHaveLength(2);
  });
});

describe("findWorkTour", () => {
  it("指定タイトルの聖地だけ返す", () => {
    const tour = findWorkTour(
      [
        spot({ id: "a", name: "A", workTitle: "SUNDAY MORNING" }),
        spot({ id: "b", name: "B", workTitle: "別" }),
      ],
      "グループ",
      "SUNDAY MORNING",
    );
    expect(tour?.spots.map((item) => item.id)).toEqual(["a"]);
  });
});

describe("orderTourSpots", () => {
  it("先頭から近い順に並べる", () => {
    const ordered = orderTourSpots([
      spot({
        id: "start",
        name: "Start",
        latitude: 35.0,
        longitude: 139.0,
      }),
      spot({
        id: "far",
        name: "Far",
        latitude: 35.2,
        longitude: 139.2,
      }),
      spot({
        id: "near",
        name: "Near",
        latitude: 35.01,
        longitude: 139.01,
      }),
    ]);
    expect(ordered.map((item) => item.id)).toEqual(["start", "near", "far"]);
  });
});

describe("suggestTourTravelMode", () => {
  it("近ければ徒歩、遠ければ車", () => {
    expect(
      suggestTourTravelMode([
        spot({ id: "a", name: "A", latitude: 35.659, longitude: 139.7 }),
        spot({ id: "b", name: "B", latitude: 35.66, longitude: 139.701 }),
      ]),
    ).toBe("walking");

    expect(
      suggestTourTravelMode([
        spot({ id: "a", name: "A", latitude: 43.77, longitude: 142.36 }),
        spot({ id: "b", name: "B", latitude: 43.42, longitude: 142.27 }),
      ]),
    ).toBe("driving");
  });
});
