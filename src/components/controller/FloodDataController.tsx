import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { fetchFloodLayer } from "../../api/floodLayerApi";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";
import { floodDataAtom } from "../../atoms/floodDataAtom";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";
import { mapZoomAtom } from "../../atoms/mapAtom";

/**--------------------------------------------------------------
 * Floodデータ司令塔
 * 責務：
 * ・Map状態監視(bounds/zoom/layer)
 * ・自動データ取得
 * ・取得頻度制御
 * ・重複fetch防止
 *
 * EarthquakeDataControllerと同じ設計
 * ※meshLevelの概念がないためシンプル
 -------------------------------------------------------------- */

// 洪水レイヤー表示可能なzooom範囲
const FLOOD_MIN_ZOOM = 9;

export default function FloodDataController() {
  const [bounds] = useAtom(mapBoundsAtom);
  const [zoom] = useAtom(mapZoomAtom);
  const [activeLayer] = useAtom(activeLayerAtom);
  const [, setFloods] = useAtom(floodDataAtom);
  const lastFetchKeyRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (!bounds) return;

    // floodレイヤー以外では動かない
    if (activeLayer !== "flood") {
      return;
    }

    // zoomガード
    if (zoom < FLOOD_MIN_ZOOM) {
      return;
    }

    // fetch条件キー生成（同条件なら再取得しない）
    const fetchKey = [
      bounds.minLat.toFixed(8),
      bounds.maxLat.toFixed(8),
      bounds.minLng.toFixed(8),
      bounds.maxLng.toFixed(8),
      zoom,
      activeLayer
    ].join("-");

    // 同条件ならskip
    if (lastFetchKeyRef.current === fetchKey) return;

    // fetch中ならskip
    if (isFetchingRef.current) return;

    // debounce（ドラッグ中連打防止）
    const timer = setTimeout(async () => {
      lastFetchKeyRef.current = fetchKey;
      isFetchingRef.current = true;

      try {
        const data = await fetchFloodLayer(
          bounds.minLat,
          bounds.maxLat,
          bounds.minLng,
          bounds.maxLng
        );
        setFloods(data);
      } catch (err) {
        console.error("[FDC] fetchFloodLayer error", err);
      } finally {
        isFetchingRef.current = false;
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [bounds, zoom, activeLayer, setFloods]);

  return null;
}
