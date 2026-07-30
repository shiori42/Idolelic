"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { GeoSample } from "@/types/geo";

import {
  isGeolocationSupported,
  isSecureGeolocationContext,
} from "../lib/environment";
import type {
  GeolocationErrorCode,
  GeolocationStatus,
} from "../types";

const MAX_SAMPLES = 120;

type UseGeolocationWatcherOptions = {
  maximumAge?: number;
  timeout?: number;
  enableHighAccuracy?: boolean;
};

function mapGeolocationError(error: GeolocationPositionError): GeolocationErrorCode {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "PERMISSION_DENIED";
    case error.POSITION_UNAVAILABLE:
      return "POSITION_UNAVAILABLE";
    case error.TIMEOUT:
      return "TIMEOUT";
    default:
      return "UNKNOWN";
  }
}

function positionToSample(position: GeolocationPosition): GeoSample {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    timestamp: position.timestamp,
    accuracy: position.coords.accuracy,
  };
}

export function useGeolocationWatcher(
  options: UseGeolocationWatcherOptions = {},
) {
  const {
    maximumAge = 0,
    timeout = 20_000,
    enableHighAccuracy = true,
  } = options;

  const [status, setStatus] = useState<GeolocationStatus>("idle");
  const [errorCode, setErrorCode] = useState<GeolocationErrorCode | null>(null);
  const [latestSample, setLatestSample] = useState<GeoSample | null>(null);
  const [samples, setSamples] = useState<GeoSample[]>([]);
  const watchIdRef = useRef<number | null>(null);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null && typeof navigator !== "undefined") {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const beginWatch = useCallback(() => {
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const sample = positionToSample(position);
        setLatestSample(sample);
        setStatus("watching");
        setSamples((prev) => {
          const next = [...prev, sample];
          return next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next;
        });
      },
      (error) => {
        setStatus("error");
        setErrorCode(mapGeolocationError(error));
        clearWatch();
      },
      { enableHighAccuracy, maximumAge, timeout },
    );
  }, [clearWatch, enableHighAccuracy, maximumAge, timeout]);

  const start = useCallback(() => {
    if (!isGeolocationSupported()) {
      setStatus("error");
      setErrorCode("UNSUPPORTED");
      return;
    }

    if (!isSecureGeolocationContext()) {
      setStatus("error");
      setErrorCode("INSECURE_CONTEXT");
      return;
    }

    clearWatch();
    setErrorCode(null);
    setStatus("requesting");

    // iOS など: watch より先に getCurrentPosition で権限ダイアログを出す
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const sample = positionToSample(position);
        setLatestSample(sample);
        setSamples((prev) => {
          const next = [...prev, sample];
          return next.length > MAX_SAMPLES ? next.slice(-MAX_SAMPLES) : next;
        });
        setStatus("watching");
        beginWatch();
      },
      (error) => {
        setStatus("error");
        setErrorCode(mapGeolocationError(error));
        clearWatch();
      },
      { enableHighAccuracy, maximumAge, timeout },
    );
  }, [beginWatch, clearWatch, enableHighAccuracy, maximumAge, timeout]);

  const stop = useCallback(() => {
    clearWatch();
    setStatus("idle");
  }, [clearWatch]);

  const reset = useCallback(() => {
    stop();
    setSamples([]);
    setLatestSample(null);
    setErrorCode(null);
  }, [stop]);

  useEffect(() => () => clearWatch(), [clearWatch]);

  return {
    status,
    errorCode,
    latestSample,
    samples,
    start,
    stop,
    reset,
    isWatching: status === "watching" || status === "requesting",
    isRequesting: status === "requesting",
  };
}
