/**-----------------------
 * A-05 座標の正規化
 *
 * 将来：
 * ・範囲チェック
 * ・丸め
 * ・mesh補正
 * ・東京外判定
 -----------------------*/
export function normalizePoint(lat: number, lng: number) {
  // 今は単純に丸めのみ
  return {
    lat: Number(lat.toFixed(6)),
    lng: Number(lng.toFixed(6))
  };
}
