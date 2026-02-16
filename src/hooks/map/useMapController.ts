import { useAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "@/atoms/mapAtom";
import { mapBoundsAtom } from "@/atoms/mapBoundsAtom";

/**----------------------------------
 * Map状態管理Controller
 * ⇒「Map状態の"唯一"の更新入り口」
 *
 * 責務:
 * ・center更新
 * ・zoom更新
 * ・bounds更新
 * ・差分チェック
 * ・Map更新ロジック集中管理
 ----------------------------------*/
// bounds型管理
export type MapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export function useMapController() {
  const [center, setCenter] = useAtom(mapCenterAtom);
  const [zoom, setZoom] = useAtom(mapZoomAtom);
  const [bounds, setBounds] = useAtom(mapBoundsAtom);

  // 地図移動 (center + zoom)
  // ⇒UI操作・検索結果移動・現在地移動など
  const moveMap = (newCenter: google.maps.LatLngLiteral, newZoom?: number) => {
    // setCenter(newCenter);
    updateCenter(newCenter);

    if (newZoom !== undefined) {
      // setZoom(newZoom);
      updateZoom(newZoom);
    }
  };
  // const moveMap = (lat: number, lng: number) => {
  //   setCenter({ lat, lng });
  // };

  // Center更新（差分チェック）
  const updateCenter = (newCenter: google.maps.LatLngLiteral) => {
    // setCenter(newCenter);
    setCenter((prev) =>
      !prev || prev.lat !== newCenter.lat || prev.lng !== newCenter.lng
        ? newCenter
        : prev
    );
  };

  // zoom更新（差分チェック）
  const updateZoom = (newZoom: number) => {
    // setZoom(newZoom);
    setZoom((prev) => (prev === newZoom ? prev : newZoom));
  };

  // bounds更新（差分チェック）
  const updateBounds = (next: MapBounds) => {
    setBounds((prev) => {
      if (!prev) return next;

      const isSame =
        prev.minLat === next.minLat &&
        prev.maxLat === next.maxLat &&
        prev.minLng === next.minLng &&
        prev.maxLng === next.maxLng;

      return isSame ? prev : next;
    });
  };

  return {
    // state
    center,
    zoom,
    bounds,

    // actions
    moveMap,
    updateCenter,
    updateZoom,
    updateBounds
  };
}
