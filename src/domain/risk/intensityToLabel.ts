/**------------------------------------
 * 計測震度 → 震度ラベル変換
 *
 * 例:
 * 6.3 → 震度6強
 * 5.2 → 震度5強
 *
 * ※気象庁基準の一般的区分を参照
 ------------------------------------*/
export function intensityToLabel(intensity: number | null | undefined): string {
  if (intensity == null) return "－";

  if (intensity < 0.5) return "震度0";
  if (intensity < 1.5) return "震度1";
  if (intensity < 2.5) return "震度2";
  if (intensity < 3.5) return "震度3";
  if (intensity < 4.5) return "震度4";
  if (intensity < 5.0) return "震度5弱";
  if (intensity < 5.5) return "震度5強";
  if (intensity < 6.0) return "震度6弱";
  if (intensity < 6.5) return "震度6強";

  return "震度7";
}
