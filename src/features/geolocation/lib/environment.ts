export type GeolocationEnvironment = {
  pageOrigin: string;
  isGeolocationSupported: boolean;
  isSecureContext: boolean;
  canStart: boolean;
  insecureContext: boolean;
};

/** SSR / ハイドレーション時の固定値（クライアント初回スナップショットと一致させる） */
export const SERVER_GEO_ENV: GeolocationEnvironment = {
  pageOrigin: "",
  isGeolocationSupported: false,
  isSecureContext: false,
  canStart: false,
  insecureContext: false,
};

export function readGeolocationEnvironment(): GeolocationEnvironment {
  if (typeof window === "undefined") {
    return SERVER_GEO_ENV;
  }

  const isGeolocationSupported =
    typeof navigator !== "undefined" && "geolocation" in navigator;
  const isSecureContext = window.isSecureContext;
  const insecureContext = !isSecureContext;

  return {
    pageOrigin: window.location.origin,
    isGeolocationSupported,
    isSecureContext,
    insecureContext,
    canStart: isGeolocationSupported && !insecureContext,
  };
}

export function isGeolocationSupported(): boolean {
  return readGeolocationEnvironment().isGeolocationSupported;
}

export function isSecureGeolocationContext(): boolean {
  return readGeolocationEnvironment().isSecureContext;
}
