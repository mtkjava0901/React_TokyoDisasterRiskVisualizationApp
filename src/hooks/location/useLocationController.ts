import { useCallback } from "react";
import { useRiskFlow } from "../useRiskFlow";
import { useCurrentLocation } from "./useCurrentLocation";
import { useMapController } from "../map/useMapController";
import useGeocoding from "../useGeocoding";

/**-------------------------------------------------
 * Location統合Controller
 * ⇒ユーザー操作の制御
 *
 * 責務：
 * ・現在地検索
 * ・住所検索
 * ・Mapクリック
 * ・Map移動
 * ・RiskFlow実行
 * ⇒入力レイヤ
*
* UI ⇒ Location ⇒ Map/Risk の司令塔役
-------------------------------------------------*/
// trigger種別
export type LocationTrigger =
  | "MAP_CLICK"
  | "CURRENT_LOCATION"
  | "ADDRESS_SEARCH";

export function useLocationController() {
  // 現在地取得
  const { getCurrentLocation } = useCurrentLocation();
  // リスク処理
  const { runRiskFlow } = useRiskFlow();
  // Map状態更新
  const { moveMap } = useMapController();
  // 住所 ⇒ 座標変換
  const { geocode } = useGeocoding();

  /**----------------------------------
  * 共通フロー：
  * ・Map移動
  * ・RiskFlow
  * ・triggerごとに補正制御
  * ⇒全てここを通す
  ----------------------------------*/
  const runLocationFlow = useCallback(
    async (
      lat: number,
      lng: number,
      zoom?: number,
      trigger: LocationTrigger = "MAP_CLICK"
    ) => {
      try {
        console.log("[runLocationFlow]", { lat, lng, trigger });

        // Map移動 + Risk並列
        const [_, flow] = await Promise.all([
          Promise.resolve(moveMap({ lat, lng }, zoom)),
          runRiskFlow(lat, lng)
        ]);

        // 東京都外なら最近接へ(0216停止)
        // if (!flow.isTokyo && flow.nearestPoint) {
        //   moveMap(flow.nearestPoint, zoom);
        // }
        if (!flow) return null;

        // trigger別挙動
        switch (trigger) {
          // 住所検索 ⇒ 都外なら補正
          case "ADDRESS_SEARCH":
            if (!flow.isTokyo && flow.nearestPoint) {
              console.log("[Location] outside ⇒ move nearest Tokyo");
              moveMap(flow.nearestPoint, zoom);
            }
            break;

          // 現在地 ⇒ 補正しない
          case "CURRENT_LOCATION":
            // 状態だけOUTSIDE表示
            break;

          // Mapクリック ⇒ 補正しない
          case "MAP_CLICK":
            // 状態だけOUTSIDE表示
            break;
        }

        return flow;
      } catch (err) {
        console.error("[runLocationFlow]", err);
        return null;
      }
    },
    [moveMap, runRiskFlow]
  );

  /**----------------------------------
  * 現在地へ移動
  ----------------------------------*/
  const moveToCurrentLocation = useCallback(async () => {
    const location = await getCurrentLocation();
    if (!location) return null;

    const { lat, lng } = location;

    await runLocationFlow(lat, lng, 13, "CURRENT_LOCATION");

    return location;
  }, [getCurrentLocation, runLocationFlow]);

  /**----------------------------------
   * 住所検索
   ----------------------------------*/
  const searchAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) return null;

      const loc = await geocode(address);
      if (!loc) return null;

      await runLocationFlow(loc.lat, loc.lng, 13, "ADDRESS_SEARCH");

      return loc;
    },
    [geocode, runLocationFlow]
  );

  /*----------------------------------
   Mapクリック　※後に削除予定
  ----------------------------------*/
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      await runLocationFlow(lat, lng, undefined, "MAP_CLICK");
    },
    [runLocationFlow]
  );

  return {
    moveToCurrentLocation,
    searchAddress,
    handleMapClick
  };
}
