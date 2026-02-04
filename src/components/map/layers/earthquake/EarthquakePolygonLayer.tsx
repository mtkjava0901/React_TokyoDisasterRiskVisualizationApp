import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Polygon } from "@react-google-maps/api";
import { earthquakeDataAtom } from "../../../../atoms/earthquakeDataAtom";
import { earthquakePolygonStyleMap } from "./earthquakeStyle";
import { mapZoomAtom } from "../../../../atoms/mapAtom";
import { mapBoundsAtom } from "../../../../atoms/mapBoundsAtom";
import { activeLayerAtom } from "../../../../atoms/activeLayerAtom";

/**---------------------------------------------
 * 地震Polygon描画専用コンポーネント
 * ・APIレスポンスデータ(EarthquakeLayerDto)を加工しない
 * ・riskLevelに応じた「見た目を決める」
 * ・描画だけに集中
 * ・再レンダリング最小化
 ---------------------------------------------*/
// zoom9未満では地震レイヤーは非表示
const DETAIL_RENDER_ZOOM = 9;
// 最大描画zoom(14以上非表示)
const MAX_RENDER_ZOOM = 13;
// 描画上限設定（パフォーマンスガード）
const MAX_POLYGON_COUNT = 3000;

function EarthquakePolygonLayer() {
  const earthquakes = useAtomValue(earthquakeDataAtom);
  // console.log("earthquakes:", earthquakes.length);
  const zoom = useAtomValue(mapZoomAtom);
  console.log("[EarthquakePolygonLayer] zoom =", zoom);
  const bounds = useAtomValue(mapBoundsAtom);
  // console.log("bounds:", bounds);
  const activeLayer = useAtomValue(activeLayerAtom);
  // console.log("activeLayer:", activeLayer);

  /*
  console.log(
    "[EarthquakePolygonLayer]",
    "zoom=",
    zoom,
    "earthquakes=",
    earthquakes.length,
    "activeLayer=",
    activeLayer
  );
  */

  /**---------------------------------------------
    * Polygon一覧をメモ化
    * （earthquakesが変わらない限り再生成しない）
   ---------------------------------------------*/
  const polygons = useMemo(() => {
    // レイヤー非アクティブの場合(入口ガード)
    if (activeLayer !== "earthquake") return null;
    if (!bounds) return null;

    // zoomガード
    if (zoom < DETAIL_RENDER_ZOOM || zoom > MAX_RENDER_ZOOM) return null;
    if (earthquakes.length === 0) return null;

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

    // RiskLevelに応じて色を決め、Polygon描画
    return filtered.map((eq) => (
      <Polygon
        key={eq.meshCode}
        paths={eq.polygon}
        // LOW/MEDIUM/HIGH
        options={earthquakePolygonStyleMap[eq.riskLevel]}
      />
    ));
  }, [earthquakes, bounds]);

  return <>{polygons}</>;
}

// memoでラップ（親の再描画に引きずられない）
export default memo(EarthquakePolygonLayer);
