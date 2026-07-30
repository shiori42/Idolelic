/** 1歩あたりの平均歩幅（m）— 後でユーザー設定可能に */
export const DEFAULT_STRIDE_LENGTH_M = 0.7;

/**
 * GPS距離 / 歩数換算距離 の許容下限。
 * これ未満は「振り子・シェイクで歩数だけ増加」とみなす。
 */
export const MIN_STEP_GPS_DISTANCE_RATIO = 0.45;

/**
 * 許容上限。これを超えると歩数を GPS ベースに切り詰める。
 */
export const MAX_STEP_GPS_DISTANCE_RATIO = 2.0;

/** 加速度ピーク検出: 歩の最小間隔（ms）— ゆっくり振りを歩行と区別 */
export const MIN_STEP_INTERVAL_MS = 400;

/**
 * 加速度ピーク検出: 閾値（m/s²）。
 * ゆるい振りで誤検知しにくくするためやや高め。
 */
export const STEP_ACCELERATION_THRESHOLD = 1.35;

/** ピーク間で必要な加速度の振れ幅（m/s²） */
export const MIN_STEP_DYNAMIC_SWING = 0.55;
