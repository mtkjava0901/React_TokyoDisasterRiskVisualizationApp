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
// 最小描画ズーム値
const MIN_RENDER_ZOOM = 7;
// 最大描画ズーム値
const MAX_RENDER_ZOOM = 13;
// 描画上限設定（パフォーマンスガード）
const MAX_POLYGON_COUNT = 3000;

function EarthquakePolygonLayer() {
  const earthquakes = useAtomValue(earthquakeDataAtom);
  // console.log("earthquakes:", earthquakes.length);
  const zoom = useAtomValue(mapZoomAtom);
  const bounds = useAtomValue(mapBoundsAtom);
  console.log("bounds:", bounds);
  const activeLayer = useAtomValue(activeLayerAtom);
  // console.log("activeLayer:", activeLayer);

  console.log(
    "[EarthquakePolygonLayer]",
    "zoom=",
    zoom,
    "earthquakes=",
    earthquakes.length,
    "activeLayer=",
    activeLayer
  );

  // Polygon一覧をメモ化（earthquakesが変わらない限り再生成しない）
  const polygons = useMemo(() => {
    console.log("[useMemo] start");

    if (activeLayer !== "earthquake") {
      // console.log("[useMemo] inactive layer", activeLayer);
      return null;
    }

    if (!bounds) return null;

    // zoomガード(条件外なら描画しない)
    if (zoom < MIN_RENDER_ZOOM || zoom > MAX_RENDER_ZOOM) {
      // console.log("[useMemo] zoom out of range", zoom);
      return null;
    }

    if (earthquakes.length === 0) {
      //console.log("[Polygon sample]", earthquakes[0].polygon);
      return null;
    }

    // 0204
    const filteredEarthquakes = earthquakes.filter((eq) =>
      eq.polygon.some(
        (p) =>
          p.lat >= bounds.minLat &&
          p.lat <= bounds.maxLat &&
          p.lng >= bounds.minLng &&
          p.lng <= bounds.maxLng
      )
    );

    console.log(
      "[filtered polygons]",
      filteredEarthquakes.length,
      "/",
      earthquakes.length
    );

    if (filteredEarthquakes.length > MAX_POLYGON_COUNT) {
      console.warn(
        `[EarthquakePolygonLayer] polygon count over limit: ${filteredEarthquakes.length}`
      );
      return null;
    }

    // console.log("[useMemo] render polygons", earthquakes.length);

    // 0204
    // console.log(
    //   "[Polygon point sample]",
    //   earthquakes[0].polygon[0],
    //   typeof earthquakes[0].polygon[0].lat,
    //   typeof earthquakes[0].polygon[0].lng
    // );

    // 件数ガード(オーバーなら描画をしない) (0204:非表示)
    // if (earthquakes.length > MAX_POLYGON_COUNT) {
    //   console.warn(
    //     `[EarthquakePolygonLayer] polygon count over limit: ${earthquakes.length}`
    //   );
    //   return null;
    // }

    return earthquakes.map((eq) => (
      <Polygon
        key={eq.meshCode}
        paths={eq.polygon}
        options={{
          // earthquakePolygonStyleMap[eq.riskLevel]
          // 以下一時的レイヤー(0204)
          strokeColor: "#ff0000",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillColor: "#ff0000",
          fillOpacity: 0.3
        }}
      />
    ));
  }, [earthquakes, zoom, bounds, activeLayer]);

  return <>{polygons}</>;
}

// memoでラップ（親の再描画に引きずられない）
export default memo(EarthquakePolygonLayer);
