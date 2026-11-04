import { describe, expect, it } from "vitest";

import {
  buildGoogleMapsDirectionsUrl,
  buildGoogleMapsTourUrl,
} from "@/lib/spots/google-maps";

const stream = {
  latitude: 35.659,
  longitude: 139.7005,
  address: "渋谷ストリーム",
};
const inari = {
  latitude: 35.6585,
  longitude: 139.7018,
  address: "稲荷橋",
};
const sakura = {
  latitude: 35.6608,
  longitude: 139.7012,
  address: "さくら通り",
};
const seibu = {
  latitude: 35.6597,
  longitude: 139.7001,
  address: "西武渋谷店前",
};
const extra = {
  latitude: 35.661,
  longitude: 139.703,
  address: "5か所目",
};

describe("buildGoogleMapsDirectionsUrl", () => {
  it("座標があれば目的地に緯度経度を使う", () => {
    const url = buildGoogleMapsDirectionsUrl(stream, "walking");
    const params = new URL(url).searchParams;
    expect(params.get("api")).toBe("1");
    expect(params.get("destination")).toBe("35.659,139.7005");
    expect(params.get("travelmode")).toBe("walking");
  });
});

describe("buildGoogleMapsTourUrl", () => {
  it("複数聖地を経由地付きの徒歩ルートにする", () => {
    const url = buildGoogleMapsTourUrl([stream, inari, sakura, seibu], {
      travelMode: "walking",
    });
    expect(url).toBeTruthy();
    const params = new URL(url!).searchParams;
    expect(params.get("origin")).toBeNull();
    expect(params.get("destination")).toBe("35.6597,139.7001");
    expect(params.get("waypoints")).toBe(
      "35.659,139.7005|35.6585,139.7018|35.6608,139.7012",
    );
    expect(params.get("travelmode")).toBe("walking");
  });

  it("出発地を指定できる", () => {
    const url = buildGoogleMapsTourUrl([stream, inari, sakura], {
      travelMode: "driving",
      origin: "大宮駅",
    });
    const params = new URL(url!).searchParams;
    expect(params.get("origin")).toBe("大宮駅");
    expect(params.get("travelmode")).toBe("driving");
    expect(params.get("waypoints")).toBe("35.659,139.7005|35.6585,139.7018");
    expect(params.get("destination")).toBe("35.6608,139.7012");
  });

  it("スマホ上限の4か所を超えたら先頭から切る", () => {
    const url = buildGoogleMapsTourUrl(
      [stream, inari, sakura, seibu, extra],
      { travelMode: "walking" },
    );
    const params = new URL(url!).searchParams;
    expect(params.get("waypoints")?.split("|")).toHaveLength(3);
    expect(params.get("destination")).toBe("35.6597,139.7001");
    expect(params.get("waypoints")).not.toContain("35.661");
  });

  it("電車は経由地を付けない", () => {
    const url = buildGoogleMapsTourUrl([stream, inari, sakura], {
      travelMode: "transit",
      origin: "大宮駅",
    });
    const params = new URL(url!).searchParams;
    expect(params.get("waypoints")).toBeNull();
    expect(params.get("origin")).toBe("大宮駅");
    expect(params.get("destination")).toBe("35.6608,139.7012");
    expect(params.get("travelmode")).toBe("transit");
  });

  it("空なら null", () => {
    expect(buildGoogleMapsTourUrl([])).toBeNull();
    expect(buildGoogleMapsTourUrl([{ address: "  " }])).toBeNull();
  });
});
