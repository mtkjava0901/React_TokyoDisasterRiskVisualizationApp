/**--------------------------------------------------
 * Google Maps zoom → 表示範囲ラベル変換
 *
 * 仕様:
 * 0 <= zoom < 8   → －
 * 8 <= zoom < 10  → 首都圏広域
 * 10 <= zoom < 12 → 区市町村
 * 12 <= zoom < 14 → 町丁目
 * 14 <= zoom < 16 → 丁目・街区
 * 16 <= zoom      → 番地
 --------------------------------------------------*/
export function zoomToScaleLabel(zoom: number | null | undefined): string {
  if (zoom == null) return "－";

  if (zoom < 8) return "－";
  if (zoom < 10) return "首都圏広域";
  if (zoom < 12) return "区市町村";
  if (zoom < 14) return "町丁目";
  if (zoom < 16) return "丁目・街区";

  return "番地";
}
