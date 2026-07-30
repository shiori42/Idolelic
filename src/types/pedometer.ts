/** 歩数検証の判定結果 */
export type StepValidationStatus =
  | "ok"
  | "insufficient_data"
  | "excluded_movement"
  | "shake_detected"
  | "capped_by_gps";

export type StepValidationResult = {
  status: StepValidationStatus;
  rawSteps: number;
  /** 不正疑いを除いた有効歩数 */
  validatedSteps: number;
  gpsDistanceMeters: number;
  /** 歩数から換算した推定距離（m） */
  impliedDistanceMeters: number;
  /** gps / implied（0〜∞、データ不足時は null） */
  distanceRatio: number | null;
  rejectedSteps: number;
};
