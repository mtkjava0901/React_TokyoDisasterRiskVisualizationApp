import { useAtom } from "jotai";
import { useEffect } from "react";
import { mapZoomAtom } from "../../atoms/mapAtom";
import { fetchEarthquakeLayer } from "../../api/earthquakeLayerApi";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";
import { earthquakeDataAtom } from "../../atoms/earthquakeDataAtom";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";

/**------------------------------------------------------------------
 * MapBoundsAtom(Mapの表示範囲)を監視
 * ⇒activeLayerAtomがearthquakeの時だけ動く(APIの取得)
 * 結果を別のatomに格納する
 * 役割：デバウンス / ガード制御
 * ⇒描画しない・UIを返さない。副作用のために存在するcomponent
------------------------------------------------------------------ */
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
    if (activeLayer !== "earthquake") return;
    // ズームが浅すぎたら取得しない(市レベル以上でのみ取得)
    if (zoom < 10) return;

    /**-------------------------------------------------
     * 現在の地図範囲・ズームを使い、地震データAPIを呼び出す
     * 取得結果を"earthquakeDataAtom"に保存
     * それを描画コンポーネント側が勝手に使う
     -------------------------------------------------*/
    const fetch = async () => {
      const data = await fetchEarthquakeLayer(
        bounds.minLat,
        bounds.maxLat,
        bounds.minLng,
        bounds.maxLng,
        zoom
      );
      // 取得結果を保存
      setEarthquakes(data);
    };

    // [bounds, zoom, activeLayer]が変更される度に条件チェック
    // OKなら地震データを再取得
    fetch();
  }, [bounds, zoom, activeLayer]);

  // 画面には何も表示しない(このcomponentの役割)
  return null;
}
