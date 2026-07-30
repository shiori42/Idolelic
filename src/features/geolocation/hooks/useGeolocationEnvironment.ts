"use client";

import { useSyncExternalStore } from "react";

import {
  readGeolocationEnvironment,
  SERVER_GEO_ENV,
  type GeolocationEnvironment,
} from "../lib/environment";

function subscribeNoop() {
  return () => {};
}

function envEquals(
  a: GeolocationEnvironment,
  b: GeolocationEnvironment,
): boolean {
  return (
    a.pageOrigin === b.pageOrigin &&
    a.isGeolocationSupported === b.isGeolocationSupported &&
    a.isSecureContext === b.isSecureContext &&
    a.canStart === b.canStart &&
    a.insecureContext === b.insecureContext
  );
}

/** getSnapshot は参照安定が必須。値が変わったときだけ新オブジェクトを返す */
let cachedClientEnv: GeolocationEnvironment = SERVER_GEO_ENV;

function getClientSnapshot(): GeolocationEnvironment {
  const next = readGeolocationEnvironment();
  if (envEquals(cachedClientEnv, next)) {
    return cachedClientEnv;
  }
  cachedClientEnv = next;
  return cachedClientEnv;
}

function getServerSnapshot(): GeolocationEnvironment {
  return SERVER_GEO_ENV;
}

export function useGeolocationEnvironment(): GeolocationEnvironment {
  return useSyncExternalStore(
    subscribeNoop,
    getClientSnapshot,
    getServerSnapshot,
  );
}
