/**--------------------------------------------------
 * Google Maps zoom → 表示範囲ラベル変換
 *
 * 仕様:
 * 0 < zoom <= 8   → －
 * 8 < zoom <= 10  → 首都圏広域
 * 10 < zoom <= 13 → 区市町村
 * 13 < zoom <= 15 → 町丁目
 * 15 < zoom <= 17 → 丁目・街区
 * 17 <= zoom      → 番地
 --------------------------------------------------*/
export function zoomToScaleLabel(zoom: number | null | undefined): string {
  if (zoom == null) return "－";

  if (zoom <= 8) return "－";
  if (zoom <= 10) return "首都圏広域";
  if (zoom <= 13) return "区市町村";
  if (zoom <= 15) return "町丁目";
  if (zoom <= 17) return "丁目・街区";

  return "番地";
}
