/** ラベルなし・色味は残る Voyager（メイン） */
export const SOFT_MAP_TILES = {
  url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
  subdomains: "abcd",
} as const;

/** ラベルなし予備（より淡いパステル） */
export const SOFT_MAP_TILES_FALLBACK = {
  url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
  maxZoom: 20,
  subdomains: "abcd",
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

/** ラベルなし CARTO のみ（OSM には絶対フォールバックしない） */
export function addSoftMapTiles(
  L: typeof import("leaflet"),
  map: import("leaflet").Map,
) {
  const layers = [
    createTileLayer(L, SOFT_MAP_TILES),
    createTileLayer(L, SOFT_MAP_TILES_FALLBACK),
  ];

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
      // 一時的な読み込み失敗で切り替えないよう多めに待つ
      if (errorCount < 12) return;
      if (activeIndex < layers.length - 1) {
        showLayer(activeIndex + 1);
      }
    });
  }

  return { soft: layers[0], fallback: layers[1], switched: () => activeIndex > 0 };
}
