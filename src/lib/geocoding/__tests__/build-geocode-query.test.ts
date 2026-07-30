import { describe, expect, it } from "vitest";

import { buildGeocodeQuery } from "@/lib/geocoding/build-geocode-query";

describe("buildGeocodeQuery", () => {
  it("都道府県が含まれない住所には都道府県を付ける", () => {
    expect(buildGeocodeQuery("渋谷区道玄坂", "東京都")).toBe(
      "東京都渋谷区道玄坂",
    );
  });

  it("住所に都道府県が含まれる場合はそのまま使う", () => {
    expect(buildGeocodeQuery("東京都渋谷区道玄坂", "東京都")).toBe(
      "東京都渋谷区道玄坂",
    );
  });

  it("住所が空のときは都道府県のみ返す", () => {
    expect(buildGeocodeQuery("  ", "大阪府")).toBe("大阪府");
  });
});
