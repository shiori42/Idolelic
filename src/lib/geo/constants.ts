/** 徒歩とみなす上限時速（km/h）。これ以上は乗り物・不正として除外 */
export const WALK_SPEED_MAX_KMH = 10;

/** セグメント速度の移動平均ウィンドウ数 */
export const SPEED_AVERAGE_WINDOW = 5;

/** この時速を超える1セグメントは GPS ジャンプとして無視 */
export const MAX_PLAUSIBLE_SEGMENT_SPEED_KMH = 200;

/** 精度がこれより悪いサンプルは速度計算から除外（m） */
export const MAX_ACCEPTABLE_ACCURACY_METERS = 80;

/** 速度計算に必要な最小時間差（ms） */
export const MIN_SEGMENT_DURATION_MS = 500;
