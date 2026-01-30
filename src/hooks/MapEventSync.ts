import { useAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../atoms/mapAtom";
import { mapBoundsAtom } from "../atoms/mapBoundsAtom";
import { RefObject } from "react";

/**---------------------------------------------
 * Mapのイベントをstateに反映するカスタムフック
 * ・onIdle
 * ・onBoundsChanged
 * ・onZoomChanged
 * 「Map ⇒ atom」の一方向同期
--------------------------------------------- */
// props用の型を定義
type UseMapEventSyncProps = {
  // google.maps.Mapの実態を保持しているref
  mapRef: RefObject<google.maps.Map | null>;
};

export default function MapEventSync({ mapRef }: UseMapEventSyncProps) {
  const [, setCenter] = useAtom(mapCenterAtom);
  const [, setZoom] = useAtom(mapZoomAtom);
  const [, setBounds] = useAtom(mapBoundsAtom);

  // onIdle=今の地図状態が確定した瞬間に呼ばれる
  const onIdle = () => {
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

    // centerをatomに反映(差分チェック付き)
    const nextCenter = {
      lat: center.lat(),
      lng: center.lng()
    };

    // Map中央値セット
    setCenter((prev) => {
      // 前回と同じなら同じ参照を返す
      if (!prev) return nextCenter;

      // 変わった時だけ更新
      return prev.lat === nextCenter.lat && prev.lng === nextCenter.lng
        ? prev
        : nextCenter;
    });

    // zoom値セット、差分チェック(値が同じなら更新しない)
    setZoom((prev) => (prev === zoom ? prev : zoom));

    // boundsをatomに反映
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
      const same =
        prev.minLat === nextBounds.minLat &&
        prev.maxLat === nextBounds.maxLat &&
        prev.minLng === nextBounds.minLng &&
        prev.maxLng === nextBounds.maxLng;

      return same ? prev : nextBounds;
    });
  };

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
