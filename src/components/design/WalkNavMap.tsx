"use client";

import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef } from "react";

import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from "@/lib/spots/map-spots";
import { addSoftMapTiles } from "@/lib/spots/map-tiles";
import type { GeoCoordinate } from "@/types/geo";
import { cn } from "@/lib/utils/cn";

type WalkNavMapProps = {
  userPosition: GeoCoordinate | null;
  destination: (GeoCoordinate & { name: string }) | null;
  routeCoordinates: GeoCoordinate[];
  className?: string;
};

function createUserIcon() {
  return L.divIcon({
    className: "walk-nav-marker",
    html: `<span class="walk-nav-user-dot" aria-hidden="true"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

function createDestinationIcon() {
  return L.divIcon({
    className: "walk-nav-marker",
    html: `<span class="walk-nav-dest-pin" aria-hidden="true">♥</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 32],
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
    // ignore
  }
}

export function WalkNavMap({
  userPosition,
  destination,
  routeCoordinates,
  className,
}: WalkNavMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layersRef = useRef<L.LayerGroup | null>(null);
  const fittedKeyRef = useRef<string>("");

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
    layersRef.current = L.layerGroup().addTo(map);

    const resizeObserver = new ResizeObserver(() => {
      if (!cancelled) safeInvalidateSize(mapRef.current);
    });
    resizeObserver.observe(container);
    const raf = requestAnimationFrame(() => {
      if (!cancelled) safeInvalidateSize(mapRef.current);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      layersRef.current = null;
      mapRef.current = null;
      map.remove();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layers = layersRef.current;
    if (!isMapAlive(map) || !layers) return;

    layers.clearLayers();

    const points: L.LatLngExpression[] = [];

    if (routeCoordinates.length >= 2) {
      const latLngs = routeCoordinates.map(
        (c) => [c.latitude, c.longitude] as L.LatLngExpression,
      );
      L.polyline(latLngs, {
        color: "#e83e8c",
        weight: 5,
        opacity: 0.85,
        lineJoin: "round",
        lineCap: "round",
      }).addTo(layers);
      points.push(...latLngs);
    }

    if (destination) {
      L.marker([destination.latitude, destination.longitude], {
        icon: createDestinationIcon(),
        interactive: false,
      }).addTo(layers);
      points.push([destination.latitude, destination.longitude]);
    }

    if (userPosition) {
      L.marker([userPosition.latitude, userPosition.longitude], {
        icon: createUserIcon(),
        interactive: false,
        zIndexOffset: 500,
      }).addTo(layers);
      points.push([userPosition.latitude, userPosition.longitude]);
    }

    if (points.length === 0) return;

    const fitKey = [
      userPosition
        ? `${userPosition.latitude.toFixed(4)},${userPosition.longitude.toFixed(4)}`
        : "no-user",
      destination
        ? `${destination.latitude.toFixed(4)},${destination.longitude.toFixed(4)}`
        : "no-dest",
      String(routeCoordinates.length),
    ].join("|");

    // 初回 or ルート確定時だけ fit。以後はユーザー追跡でパン。
    if (fittedKeyRef.current !== fitKey && routeCoordinates.length >= 2) {
      fittedKeyRef.current = fitKey;
      try {
        map.fitBounds(L.latLngBounds(points), {
          padding: [36, 36],
          maxZoom: 16,
          animate: false,
        });
      } catch {
        // ignore
      }
    } else if (userPosition) {
      map.panTo([userPosition.latitude, userPosition.longitude], {
        animate: true,
        duration: 0.4,
      });
    } else if (destination && fittedKeyRef.current !== fitKey) {
      fittedKeyRef.current = fitKey;
      map.setView([destination.latitude, destination.longitude], 15, {
        animate: false,
      });
    }
  }, [userPosition, destination, routeCoordinates]);

  return (
    <div className={cn("walk-nav-map-shell", className)}>
      <div ref={containerRef} className="walk-nav-map" />
    </div>
  );
}
