export type GeolocationErrorCode =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "UNSUPPORTED"
  | "INSECURE_CONTEXT"
  | "UNKNOWN";

export type GeolocationStatus = "idle" | "requesting" | "watching" | "error";
