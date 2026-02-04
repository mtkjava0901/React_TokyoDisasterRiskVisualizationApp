import { useAtom } from "jotai";
import { useEffect } from "react";
import { fetchEarthquakeLayer } from "../../api/earthquakeLayerApi";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";
import { earthquakeDataAtom } from "../../atoms/earthquakeDataAtom";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";
import { MeshLevel, resolveZoomRule } from "../../domain/map/zoomRule";
import { mapZoomAtom } from "../../atoms/mapAtom";

/**--------------------------------------------------------------
 * MapBoundsAtom(Mapの表示範囲)を監視
 * ⇒activeLayerAtomがearthquakeの時だけ動く(APIの取得)
 * 結果を別のatomに格納する
 * 役割：デバウンス / ガード制御
 * ⇒描画しない・UIを返さない。副作用のために存在するcomponent
 * 『今の地図状態をどう解釈して、何を取得するか』
-------------------------------------------------------------- */

/**--------------------------------------------------------------
 * MeshLevel ⇒ バックエンド値マッピング
-------------------------------------------------------------- */
const meshLevelValueMap: Record<MeshLevel, number | null> = {
  NONE: null,
  PRIMARY: 4,
  SECONDARY: 6,
  TERTIARY: 8
};

export default function EarthquakeDataController() {
  // 今地図に表示されている範囲
  const [bounds] = useAtom(mapBoundsAtom);
  // 現在のズームレベル
  const [zoom] = useAtom(mapZoomAtom);
  // 今有効なレイヤー(earthquake/flood)
  const [activeLayer] = useAtom(activeLayerAtom);
  // 取得した地震データの保存先
  const [, setEarthquakes] = useAtom(earthquakeDataAtom);

  // 地図状態or表示モードの変更で再判定(useEffect)
  useEffect(() => {
    // bounds(境界)が無い場合はそのまま返す
    if (!bounds) return;

    // earthquakeレイヤー以外では動かない
    if (activeLayer !== "earthquake") {
      setEarthquakes([]);
      return;
    }

    // ズーム値の解釈
    const rule = resolveZoomRule(zoom);
    // fetch不可
    if (!rule.fetchable) {
      setEarthquakes([]);
      return;
    }

    const meshValue = meshLevelValueMap[rule.meshLevel];
    // meshなし = 表示無し
    if (meshValue === null) {
      setEarthquakes([]);
      return;
    }

    /**-------------------------------------------------
     * 現在の地図範囲・ズームを使い、地震データAPIを呼び出す
     * 取得結果を"earthquakeDataAtom"に保存
     * それを描画コンポーネント側が勝手に使う
     -------------------------------------------------*/
    const fetch = async () => {
      // meshValueがnullの場合取得不要
      if (meshValue === null) {
        console.log("[EDC] meshLevel NONE, fetch skipped");
        setEarthquakes([]);
        return;
      }

      try {
        // fetchEarthquakeLayerのmeshLevel引数はnumber型に変更済み
        const data = await fetchEarthquakeLayer(
          bounds.minLat,
          bounds.maxLat,
          bounds.minLng,
          bounds.maxLng,
          meshValue
        );

        // 取得結果を保存
        setEarthquakes(data);
      } catch (err) {
        console.error("[EDC] fetchEarthquakeLayer error", err);
        setEarthquakes([]); // エラー時は空配列
      }
    };

    // [bounds, zoom, activeLayer]が変更される度に条件チェック
    // OKなら地震データを再取得
    fetch();
  }, [bounds, zoom, activeLayer, setEarthquakes]);

  // 画面には何も表示しない(このcomponentの役割)
  return null;
}
