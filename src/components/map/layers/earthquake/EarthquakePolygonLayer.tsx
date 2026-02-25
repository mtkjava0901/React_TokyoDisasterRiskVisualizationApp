import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Polygon } from "@react-google-maps/api";
import { earthquakeDataAtom } from "../../../../atoms/earthquakeDataAtom";
import { earthquakePolygonStyleMap } from "./earthquakeStyle";
import { mapZoomAtom, mapCenterAtom } from "../../../../atoms/mapAtom";
import { mapBoundsAtom } from "../../../../atoms/mapBoundsAtom";
import { activeLayerAtom } from "../../../../atoms/activeLayerAtom";

/**---------------------------------------------
 * 地震Polygonの描画専用コンポーネント
 * ・APIレスポンスデータ(EarthquakeLayerDto)を加工しない
 * ・riskLevelに応じた「見た目を決める」
 * ・描画だけに集中
 * ・再レンダリング最小化
 ---------------------------------------------*/
// zoom8未満では地震レイヤーは非表示
const DETAIL_RENDER_ZOOM = 9;
// 最大描画zoom(17以上非表示)
const MAX_RENDER_ZOOM = 16;
// 描画上限設定（パフォーマンスガード）
const MAX_POLYGON_COUNT = 3000;

function EarthquakePolygonLayer() {
  const earthquakes = useAtomValue(earthquakeDataAtom);
  const zoom = useAtomValue(mapZoomAtom);
  const center = useAtomValue(mapCenterAtom);
  const bounds = useAtomValue(mapBoundsAtom);
  const activeLayer = useAtomValue(activeLayerAtom);
  /**---------------------------------------------
    * Polygon一覧をメモ化
   ---------------------------------------------*/
  const polygons = useMemo(() => {
    // レイヤー非アクティブの場合
    if (activeLayer !== "earthquake") return [];
    if (!bounds) return [];
    // zoomガード
    if (zoom < DETAIL_RENDER_ZOOM || zoom > MAX_RENDER_ZOOM) return [];
    if (earthquakes.length === 0) return [];
    // 表示範囲に含まれるポリゴンのみ抽出
    const filtered = earthquakes.filter((eq) =>
      eq.polygon.some(
        (p) =>
          p.lat >= bounds.minLat &&
          p.lat <= bounds.maxLat &&
          p.lng >= bounds.minLng &&
          p.lng <= bounds.maxLng
      )
    );
    if (filtered.length > MAX_POLYGON_COUNT) {
      console.warn(
        `[EarthquakePolygonLayer] polygon const over limit: ${filtered.length}`
      );
      return null;
    }

    // 検証用ログ出力（zoom、Polygon数、中心座標）
    console.log(
      `[EarthquakePolygonLayer] Zoom: ${zoom}, Center: [${center.lat.toFixed(
        4
      )}, ${center.lng.toFixed(4)}], Polygons (Filtered/Total): ${
        filtered.length
      }/${earthquakes.length}`
    );

    return filtered.map((eq) => (
      <Polygon
        key={eq.meshCode}
        paths={eq.polygon}
        options={earthquakePolygonStyleMap[eq.riskLevel]}
      />
    ));
    // --- 修正箇所：依存配列に activeLayer、zoom、center を追加 ---
  }, [earthquakes, bounds, activeLayer, zoom, center]);
  // -----------------------------------------------------
  return <>{polygons}</>;
}
export default memo(EarthquakePolygonLayer);
