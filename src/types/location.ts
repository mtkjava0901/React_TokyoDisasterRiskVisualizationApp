/**------------------------------
 * 検索結果の共通型
 * 住所検索 / 現在地 / 将来拡張すべて共通
 ------------------------------*/
export type LocationResult = {
  lat: number;
  lng: number;

  // 任意（住所表示などに使う）
  label?: string;
};