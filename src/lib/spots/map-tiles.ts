/**
 * CARTO ベースマップ（見た目用）。
 * 2025〜 API キー必須: https://carto.com/basemaps/apikey/
 * URL に ?key= を付ける。キーはブラウザ公開想定なので NEXT_PUBLIC_。
 */

function withCartoKey(url: string) {
  const key = process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim();
  if (!key) return url;
  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}key=${encodeURIComponent(key)}`;
}

function hasCartoKey() {
  return Boolean(process.env.NEXT_PUBLIC_CARTO_API_KEY?.trim());
}

/** ラベルなし・色味は残る Voyager（メイン） */
export const SOFT_MAP_TILES = {
  url: withCartoKey(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  ),
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
  subdomains: "abcd",
} as const;

/** ラベルなし予備（より淡いパステル） */
export const SOFT_MAP_TILES_FALLBACK = {
  url: withCartoKey(
    "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
  ),
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
  subdomains: "abcd",
} as const;

/** キー未設定時の緊急フォールバック（無料 OSM） */
export const OSM_MAP_TILES = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  maxZoom: 19,
  subdomains: "abc",
} as const;

export type MapTileConfig = {
  url: string;
  attribution: string;
  maxZoom: number;
  subdomains: string;
};

export function createTileLayer(
  L: typeof import("leaflet"),
  config: MapTileConfig,
) {
  return L.tileLayer(config.url, {
    attribution: config.attribution,
    maxZoom: config.maxZoom,
    subdomains: config.subdomains,
  });
}

/** CARTO（キーあり）→ なければ OSM */
export function addSoftMapTiles(
  L: typeof import("leaflet"),
  map: import("leaflet").Map,
) {
  const layers = hasCartoKey()
    ? [
        createTileLayer(L, SOFT_MAP_TILES),
        createTileLayer(L, SOFT_MAP_TILES_FALLBACK),
      ]
    : [createTileLayer(L, OSM_MAP_TILES)];

  let activeIndex = 0;
  let errorCount = 0;

  const showLayer = (index: number) => {
    for (const layer of layers) {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
    activeIndex = index;
    errorCount = 0;
    layers[index].addTo(map);
  };

  showLayer(0);

  for (const layer of layers) {
    layer.on("tileerror", () => {
      if (!map.hasLayer(layer) || layer !== layers[activeIndex]) return;
      errorCount += 1;
      if (errorCount < 12) return;
      if (activeIndex < layers.length - 1) {
        showLayer(activeIndex + 1);
      }
    });
  }

  return {
    soft: layers[0],
    fallback: layers[1] ?? layers[0],
    switched: () => activeIndex > 0,
    usingCarto: hasCartoKey(),
  };
}
