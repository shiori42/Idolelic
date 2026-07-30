/** WGS84 座標 */
export type GeoCoordinate = {
  latitude: number;
  longitude: number;
};

/** GPS サンプル（位置 + 時刻 + 精度） */
export type GeoSample = GeoCoordinate & {
  timestamp: number;
  accuracy?: number;
};

/** 徒歩 / 乗り物・不正除外 / 判定不能 */
export type MovementKind = "walking" | "excluded" | "unknown";

/** 2点間の速度計測結果 */
export type SpeedSegment = {
  speedKmh: number;
  distanceMeters: number;
  durationMs: number;
};

/** 速度フィルタの集計結果 */
export type SpeedFilterResult = {
  kind: MovementKind;
  instantSpeedKmh: number | null;
  averageSpeedKmh: number | null;
  segmentCount: number;
};
