import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Polygon } from "@react-google-maps/api";
import { floodDataAtom } from "../../../../atoms/floodDataAtom";
import { floodPolygonStyleMap } from "./floodStyle";
import { mapZoomAtom } from "../../../../atoms/mapAtom";
import { mapBoundsAtom } from "../../../../atoms/mapBoundsAtom";
import { activeLayerAtom } from "../../../../atoms/activeLayerAtom";

/**---------------------------------------------
 * 洪水Polygonの描画専用コンポーネント
 * ・EarthquakePolygonLayerと同じ設計
 * ・riskLevelに応じた「見た目を決める」
 * ・描画だけに集中
 * ・再レンダリング最小化
 ---------------------------------------------*/
// zoom9未満では洪水レイヤーは非表示
const DETAIL_RENDER_ZOOM = 9;
// 最大描画zoom(14以上非表示)
const MAX_RENDER_ZOOM = 14;
// 描画上限設定（パフォーマンスガード）
const MAX_POLYGON_COUNT = 5000;

function FloodPolygonLayer() {
  const floods = useAtomValue(floodDataAtom);
  const zoom = useAtomValue(mapZoomAtom);
  const bounds = useAtomValue(mapBoundsAtom);
  const activeLayer = useAtomValue(activeLayerAtom);

  /**---------------------------------------------
    * Polygon一覧をメモ化
   ---------------------------------------------*/
  const polygons = useMemo(() => {
    // レイヤー非アクティブの場合
    if (activeLayer !== "flood") return [];
    if (!bounds) return [];
    // zoomガード
    if (zoom < DETAIL_RENDER_ZOOM || zoom > MAX_RENDER_ZOOM) return [];
    if (floods.length === 0) return [];

    // 表示範囲に含まれるポリゴンのみ抽出
    const filtered = floods.filter((f) =>
      f.polygon.some(
        (p) =>
          p.lat >= bounds.minLat &&
          p.lat <= bounds.maxLat &&
          p.lng >= bounds.minLng &&
          p.lng <= bounds.maxLng
      )
    );

    if (filtered.length > MAX_POLYGON_COUNT) {
      console.warn(
        `[FloodPolygonLayer] polygon count over limit: ${filtered.length}`
      );
      return null;
    }

    return filtered.map((f, index) => (
      <Polygon
        key={`flood-${index}`}
        paths={f.polygon}
        options={floodPolygonStyleMap[f.riskLevel]}
      />
    ));
  }, [floods, bounds, activeLayer, zoom]);

  return <>{polygons}</>;
}

export default memo(FloodPolygonLayer);
