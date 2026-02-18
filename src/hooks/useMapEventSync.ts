import { useAtom, useSetAtom } from "jotai";
import { useAtomValue } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../atoms/mapAtom";
import { mapBoundsAtom } from "../atoms/mapBoundsAtom";
import { RefObject, useCallback, useEffect } from "react";
import { useMapController } from "./map/useMapController";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { locationAtom } from "@/atoms/locationAtom";

/**---------------------------------------------
 * Mapのイベントをstateに反映するカスタムフック
 * 処理順：
 * Map ⇒ Controller ⇒ atom (一方向同期)
 *
 * ・onIdle
 * ・onBoundsChanged
 * ・onZoomChanged
 * 「Map ⇒ atom」の一方向同期
 * -GoogleMapの「事実」をatomに流すだけ
 * -解釈(zoom→MeshLevel等)は一切しない
 *
 * Map中央 ⇒ LocationAtom同期追加
 * Map移動 ＝ MAP_CLICK扱い
--------------------------------------------- */
// props用の型を定義
type UseMapEventSyncProps = {
  // google.maps.Mapの実態を保持しているref
  mapRef: RefObject<google.maps.Map | null>;
};

export default function useMapEventSync({ mapRef }: UseMapEventSyncProps) {
  const { updateCenter, updateZoom } = useMapController();
  const [, setBounds] = useAtom(mapBoundsAtom);

  const setLocation = useSetAtom(locationAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);
  const location = useAtomValue(locationAtom);

  console.log("MapEventSync locationAtom", locationAtom);

  // location監視ログ
  useEffect(() => {
    console.log("📍 locationAtom changed:", location);
  }, [location]);

  // MAP状態確定時
  const onIdle = useCallback(() => {
    // console.log("onIdle fired");

    // mapが無ければ何もしない
    if (!mapRef.current) return;

    // Mapから｢生の状態｣を取得(Map⇒atomの入り口)
    const map = mapRef.current;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bounds = map.getBounds();

    // 取得失敗時のガード
    // getCenterがnull/getZoomがundefined(未定義)/bounds(境界)未確定
    if (!center || zoom == null || !bounds) return;

    const lat = center.lat();
    const lng = center.lng();

    // Map ⇒ Controller
    updateCenter({ lat, lng });
    updateZoom(zoom);

    // 2/18追加
    // 差分チェック
    const locationChanged =
      !location || location.lat !== lat || location.lng !== lng;

    if (locationChanged) {
      console.log("MAP_CLICK fired", { lat, lng });
      setLocation({ lat, lng });
      setTrigger("MAP_CLICK");
    }

    // boundsをatomに同期
    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    // 地図の表示範囲を正規化
    const nextBounds = {
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng()
    };

    // 境界値のセット
    setBounds((prev) => {
      if (!prev) return nextBounds;

      // 前回と同様なら同じ参照を返す
      return prev.minLat === nextBounds.minLat &&
        prev.maxLat === nextBounds.maxLat &&
        prev.minLng === nextBounds.minLng &&
        prev.maxLng === nextBounds.maxLng
        ? prev
        : nextBounds;
    });
  }, [mapRef, updateCenter, updateZoom, setBounds, setLocation, setTrigger]);

  // GoogleMapに渡すイベントハンドラ
  return { onIdle };
}

/**---------------------------------------------
 * 全体の流れ
 * 1.ユーザーが地図操作
 * 2.GoogleMap onIdle発火
 * 3.MapEventSync.onIdle実行
 * 4.Map状態を取得
 * 5.差分があればatom更新
 * 6.必要なControllerが反応(API取得など)
 * 7.Overlayが再描画
 ---------------------------------------------*/
