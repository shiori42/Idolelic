"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import type { MockSpot } from "@/data/mock-spots";
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_ZOOM,
  type MapSpot,
  toMapSpots,
} from "@/lib/spots/map-spots";
import { addSoftMapTiles } from "@/lib/spots/map-tiles";
import { cn } from "@/lib/utils/cn";

type SpotsMapProps = {
  spots: MockSpot[];
  fill?: boolean;
  className?: string;
  interactive?: boolean;
  /** 配列順の番号ピン（旅程マップ用） */
  numbered?: boolean;
  /** 番号ピン同士を線でつなぐ */
  showRouteLine?: boolean;
  /** 埋め込み時にズーム余白を抑える */
  compactControls?: boolean;
};

function createPinIcon(source: MockSpot["source"]) {
  const isCommunity = source === "community";
  const bubbleClass = isCommunity
    ? "spots-map-marker-bubble spots-map-marker-bubble-community"
    : "spots-map-marker-bubble";
  const glyph = isCommunity ? "✿" : "♥";

  return L.divIcon({
    className: "spots-map-marker",
    html: `<span class="spots-map-marker-stack">
      <span class="spots-map-marker-halo" aria-hidden="true"></span>
      <span class="${bubbleClass}">
        <span class="spots-map-marker-glyph" aria-hidden="true">${glyph}</span>
      </span>
      <span class="spots-map-marker-sparkle spots-map-marker-sparkle--a" aria-hidden="true">✦</span>
      <span class="spots-map-marker-sparkle spots-map-marker-sparkle--b" aria-hidden="true">♡</span>
    </span>`,
    iconSize: [42, 46],
    iconAnchor: [21, 40],
    popupAnchor: [0, -34],
  });
}

function createNumberIcon(order: number) {
  return L.divIcon({
    className: "spots-map-marker spots-map-marker-numbered",
    html: `<span class="spots-map-number-pin" aria-hidden="true">${order}</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

function isMapAlive(map: L.Map | null): map is L.Map {
  if (!map) return false;
  const container = map.getContainer();
  return Boolean(container?.isConnected && map.getPane("mapPane"));
}

function safeInvalidateSize(map: L.Map | null) {
  if (!isMapAlive(map)) return;
  try {
    map.invalidateSize({ animate: false });
  } catch {
    // アンマウント直後など、Leaflet 内部状態が壊れている場合は無視
  }
}

export function SpotsMap({
  spots,
  fill = false,
  className,
  interactive = true,
  numbered = false,
  showRouteLine = false,
  compactControls = false,
}: SpotsMapProps) {
  const router = useRouter();
  const pathname = usePathname();
  const design = pathname.startsWith("/design");
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeRef = useRef<L.Polyline | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    let cancelled = false;
    const map = L.map(container, {
      zoomControl: false,
      attributionControl: true,
    }).setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM);

    L.control.zoom({ position: "bottomright" }).addTo(map);
    addSoftMapTiles(L, map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    const resizeObserver = new ResizeObserver(() => {
      if (cancelled) return;
      safeInvalidateSize(mapRef.current);
    });
    resizeObserver.observe(container);

    // 初回レイアウト確定後にサイズを合わせる
    rafRef.current = requestAnimationFrame(() => {
      if (!cancelled) safeInvalidateSize(mapRef.current);
    });

    return () => {
      cancelled = true;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      resizeObserver.disconnect();
      markersRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const group = markersRef.current;
    if (!isMapAlive(map) || !group) return;

    group.clearLayers();
    if (routeRef.current) {
      routeRef.current.remove();
      routeRef.current = null;
    }

    // 表示順を保つ（番号ピン用）。toMapSpots はフィルタのみだが順序は維持される
    const mapSpots: MapSpot[] = toMapSpots(spots);
    const latLngs: L.LatLngExpression[] = [];
    const spotBase = design ? "/design/spots" : "/spots";
    // spots 配列上の番号（座標なしを飛ばしても元の選択順番号を保つ）
    const orderById = new Map(
      spots.map((spot, index) => [spot.id, index + 1] as const),
    );

    for (const spot of mapSpots) {
      const latLng: L.LatLngExpression = [spot.latitude, spot.longitude];
      latLngs.push(latLng);

      const order = orderById.get(spot.id) ?? latLngs.length;
      const marker = L.marker(latLng, {
        icon: numbered ? createNumberIcon(order) : createPinIcon(spot.source),
        zIndexOffset: numbered ? order * 10 : 0,
      });

      marker.bindPopup(
        numbered
          ? `<strong>${order}. ${spot.name}</strong><br><span style="font-size:12px;color:#9a7888">${spot.group}</span>`
          : `<span style="color:#e85d8a;font-size:12px;letter-spacing:0.06em">♡ ✦</span><br><strong>${spot.name}</strong><br><span style="font-size:12px;color:#9a7888">${spot.group}</span>`,
      );

      if (interactive) {
        marker.on("click", () => {
          router.push(`${spotBase}/${spot.id}`);
        });
      }

      group.addLayer(marker);
    }

    if (showRouteLine && latLngs.length >= 2) {
      routeRef.current = L.polyline(latLngs, {
        color: "#2f6b4f",
        weight: 3,
        opacity: 0.75,
        dashArray: "8 10",
      }).addTo(map);
    }

    try {
      if (latLngs.length === 1) {
        map.setView(latLngs[0], 14, { animate: false });
      } else if (latLngs.length > 1) {
        map.fitBounds(L.latLngBounds(latLngs), {
          padding: compactControls ? [28, 28] : [48, 48],
          maxZoom: 14,
          animate: false,
        });
      } else {
        map.setView(DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM, { animate: false });
      }
    } catch {
      // fitBounds 失敗時は現在表示を維持
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      safeInvalidateSize(mapRef.current);
      rafRef.current = null;
    });

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [spots, interactive, numbered, showRouteLine, compactControls, router, design]);

  return (
    <div
      className={cn(
        "spots-map-shell",
        fill && "spots-map-fill",
        compactControls && "spots-map-compact",
        className,
      )}
    >
      <div className="spots-map-deco spots-map-deco--a" aria-hidden>
        ✦
      </div>
      <div className="spots-map-deco spots-map-deco--b" aria-hidden>
        ♡
      </div>
      <div className="spots-map-deco spots-map-deco--c" aria-hidden>
        ✿
      </div>
      <div
        ref={containerRef}
        className="spots-map"
        aria-label="聖地マップ"
      />
    </div>
  );
}
