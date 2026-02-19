import { useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { fetchEarthquakeLayer } from "../../api/earthquakeLayerApi";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";
import { earthquakeDataAtom } from "../../atoms/earthquakeDataAtom";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";
import { MeshLevel, resolveZoomRule } from "../../domain/map/zoomRule";
import { mapZoomAtom } from "../../atoms/mapAtom";

/**--------------------------------------------------------------
 * Earthquakeデータ司令塔
 * 責務：
 * ・Map状態監視(bounds/zoom/layer)
 * ・自動データ取得
 * ・取得頻度制御
 * ・重複fetch防止
 *
 * 旧EarthquakeDataControllerからの追加項目：
 * ・debounce（UX+API保護）
 * ・同条件fetch防止
 * ・fetch中の再実行防止
 *
 * ※後に実装予定？
-------------------------------------------------------------- */
const meshLevelValueMap: Record<MeshLevel, number | null> = {
  NONE: null,
  PRIMARY: 4,
  SECONDARY: 6,
  TERTIARY: 8
};

export default function EarthquakeDataController() {
  const [bounds] = useAtom(mapBoundsAtom);
  const [zoom] = useAtom(mapZoomAtom);
  const [activeLayer] = useAtom(activeLayerAtom);
  const [, setEarthquakes] = useAtom(earthquakeDataAtom);
  const lastFetchKeyRef = useRef<string | null>(null);
  const isFetchingRef = useRef(false);
  useEffect(() => {
    if (!bounds) return;
    // --- 修正箇所：タブ切り替え時のクリアを削除 ---
    if (activeLayer !== "earthquake") {
      // setEarthquakes([]); // この行をコメントアウトまたは削除
      return;
    }
    const rule = resolveZoomRule(zoom);
    if (!rule.fetchable) {
      // setEarthquakes([]); // ズーム外でのクリアも削除（キャッシュとして維持）
      return;
    }
    const meshValue = meshLevelValueMap[rule.meshLevel];
    if (meshValue === null) {
      // setEarthquakes([]); // メッシュなしの場合のクリアも削除
      return;
    }
    // --------------------------------------------
    const fetchKey = [
      bounds.minLat.toFixed(8),
      bounds.maxLat.toFixed(8),
      bounds.minLng.toFixed(8),
      bounds.maxLng.toFixed(8),
      zoom,
      activeLayer,
      meshValue
    ].join("-");
    if (lastFetchKeyRef.current === fetchKey) return;
    if (isFetchingRef.current) return;
    const timer = setTimeout(async () => {
      lastFetchKeyRef.current = fetchKey;
      isFetchingRef.current = true;
      try {
        const data = await fetchEarthquakeLayer(
          bounds.minLat,
          bounds.maxLat,
          bounds.minLng,
          bounds.maxLng,
          meshValue
        );
        setEarthquakes(data);
      } catch (err) {
        console.error("[EDC] fetchEarthquakeLayer error", err);
        // setEarthquakes([]); // エラー時はクリアしても良い
      } finally {
        isFetchingRef.current = false;
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [bounds, zoom, activeLayer, setEarthquakes]);
  return null;
}

/*******************************************************************************************/
// 2/19
/**--------------------------------------------------------------
 * MeshLevel ⇒ バックエンド値マッピング
-------------------------------------------------------------- */
// export default function EarthquakeDataController() {
//   const [bounds] = useAtom(mapBoundsAtom);
//   const [zoom] = useAtom(mapZoomAtom);
//   const [activeLayer] = useAtom(activeLayerAtom);
//   const [, setEarthquakes] = useAtom(earthquakeDataAtom);

//   // 内部制御用
//   const lastFetchKeyRef = useRef<string | null>(null);
//   const isFetchingRef = useRef(false);

//   // 地図状態or表示モードの変更で再判定(useEffect)
//   useEffect(() => {
//     // bounds(境界)が無い場合はそのまま返す
//     if (!bounds) return;
//     console.log("bounds =", bounds);

//     // earthquakeレイヤー以外では動かない
//     if (activeLayer !== "earthquake") {
//       setEarthquakes([]);
//       return;
//     }

//     // ズーム値の解釈
//     const rule = resolveZoomRule(zoom);
//     // fetch不可
//     if (!rule.fetchable) {
//       setEarthquakes([]);
//       return;
//     }

//     const meshValue = meshLevelValueMap[rule.meshLevel];

//     // meshなし = 表示無し
//     if (meshValue === null) {
//       setEarthquakes([]);
//       return;
//     }

//     /**-------------------------------------------------
//  * fetch条件キー生成
//  * 同条件なら再取得しない
//  -------------------------------------------------*/
//     const fetchKey = [
//       bounds.minLat.toFixed(8),
//       bounds.maxLat.toFixed(8),
//       bounds.minLng.toFixed(8),
//       bounds.maxLng.toFixed(8),
//       zoom,
//       activeLayer,
//       meshValue
//     ].join("-");

//     // 同条件ならskip
//     if (lastFetchKeyRef.current === fetchKey) return;

//     // fetch中ならskip
//     if (isFetchingRef.current) return;

//     /** -------------------------
//      * debounce（ドラッグ中連打防止）
//      * -------------------------*/
//     const timer = setTimeout(async () => {
//       lastFetchKeyRef.current = fetchKey;
//       isFetchingRef.current = true;

//       try {
//         const data = await fetchEarthquakeLayer(
//           bounds.minLat,
//           bounds.maxLat,
//           bounds.minLng,
//           bounds.maxLng,
//           meshValue
//         );

//         setEarthquakes(data);
//       } catch (err) {
//         console.error("[EDC] fetchEarthquakeLayer error", err);
//         setEarthquakes([]);
//       } finally {
//         isFetchingRef.current = false;
//       }
//     }, 350); // 300～500ms

//     return () => clearTimeout(timer);
//   }, [bounds, zoom, activeLayer, setEarthquakes]);

//   return null;
// }
