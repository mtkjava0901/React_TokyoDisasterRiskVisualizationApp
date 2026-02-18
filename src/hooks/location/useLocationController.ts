import useGeocoding from "../useGeocoding";
import { useCallback } from "react";
import { useCurrentLocation } from "./useCurrentLocation";
import { useSetAtom } from "jotai";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { locationAtom } from "@/atoms/locationAtom";
import { useMapController } from "../map/useMapController";
import { bannerAtom } from "@/atoms/bannerAtom";
import { useRiskFlow } from "../useRiskFlow";

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
*
* 2/18 座標をlocationAtomに流すだけ に修正
-------------------------------------------------*/
export type LocationTrigger =
  | "MAP_CLICK"
  | "CURRENT_LOCATION"
  | "ADDRESS_SEARCH";

export function useLocationController() {
  const { getCurrentLocation } = useCurrentLocation();
  const { geocode } = useGeocoding();

  const setLocation = useSetAtom(locationAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);
  const { moveMap } = useMapController();

  /** 共通：location更新 */
  const updateLocation = useCallback(
    (lat: number, lng: number, trigger: LocationTrigger) => {
      setLocation({ lat, lng });
      setTrigger(trigger);
      moveMap({ lat, lng }, 13);
    },
    [setLocation, setTrigger]
  );

  /** 現在地 */
  const moveToCurrentLocation = useCallback(async () => {
    const loc = await getCurrentLocation();
    if (!loc) return;

    updateLocation(loc.lat, loc.lng, "CURRENT_LOCATION");
  }, [getCurrentLocation, updateLocation]);

  /** 住所検索 */
  const searchAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) return null;

      const loc = await geocode(address);
      if (!loc) return null;

      updateLocation(loc.lat, loc.lng, "ADDRESS_SEARCH");
      return loc;
    },
    [geocode, updateLocation]
  );

  /** Mapクリック */
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      updateLocation(e.latLng.lat(), e.latLng.lng(), "MAP_CLICK");
    },
    [updateLocation]
  );

  return {
    moveToCurrentLocation,
    searchAddress,
    handleMapClick
  };
}

/**************************************************************/
// 以下0217
// // trigger種別
// export type LocationTrigger =
//   | "MAP_CLICK"
//   | "CURRENT_LOCATION"
//   | "ADDRESS_SEARCH";

// export function useLocationController() {
//   // 現在地取得
//   const { getCurrentLocation } = useCurrentLocation();
//   // リスク処理
//   const { runRiskFlow } = useRiskFlow();
//   // Map状態更新
//   const { moveMap } = useMapController();
//   // 住所 ⇒ 座標変換
//   const { geocode } = useGeocoding();

//   // trigger保存
//   const setTrigger = useSetAtom(locationTriggerAtom);
//   // Banner制御
//   const showBanner = useSetAtom(bannerAtom);

//   /**----------------------------------
//   * 共通フロー：
//   * ・Map移動
//   * ・RiskFlow
//   * ・triggerごとに補正制御
//   * ⇒全てここを通す
//   ----------------------------------*/
//   const runLocationFlow = useCallback(
//     async (
//       lat: number,
//       lng: number,
//       zoom?: number,
//       trigger: LocationTrigger = "MAP_CLICK"
//     ) => {
//       try {
//         console.log("[runLocationFlow]", { lat, lng, trigger });

//         // risk判定
//         const flow = await runRiskFlow(lat, lng);
//         if (!flow) return null;

//         setTrigger(trigger);

//         if (trigger === "ADDRESS_SEARCH") {
//           moveMap({ lat, lng }, zoom);
//         }
//         /**------------------
//        * 住所検索 → confirm
//        ------------------*/
//         if (
//           trigger === "ADDRESS_SEARCH" &&
//           !flow.isTokyo &&
//           flow.nearestPoint
//         ) {
//           showBanner({
//             visible: true,
//             type: "confirm",
//             message:
//               "⚠この地点は東京都外です。最も近い東京都境界へ移動しますか？",
//             confirmLabel: "移動する",
//             cancelLabel: "このまま表示",

//             onConfirm: () => {
//               moveMap(flow.nearestPoint!, zoom);
//             }
//           });

//           // 移動しない
//           return flow;
//         }

//         /**------------------
//        * 地図クリック / 現在地
//        ------------------*/
//         if (
//           (trigger === "MAP_CLICK" || trigger === "CURRENT_LOCATION") &&
//           !flow.isTokyo
//         ) {
//           showBanner({
//             visible: true,
//             type: "outside",
//             message: "⚠この地点は東京都外のため、情報を表示できません。",
//             duration: 4000
//           });

//           // 移動しない
//           return flow;
//         }

//         /** -------------------------
//        * 境界付近
//        ------------------------- */
//         if (flow.isBoundary) {
//           showBanner({
//             visible: true,
//             type: "boundary",
//             message: "⚠東京都の境界付近です。",
//             duration: 2500
//           });
//         }

//         /** -------------------------
//        * 都内 or 境界 → 移動
//        ------------------------- */
//         moveMap({ lat, lng }, zoom);

//         return flow;
//       } catch (err) {
//         console.error("[runLocationFlow]", err);
//         return null;
//       }
//     },
//     [moveMap, runRiskFlow, setTrigger, showBanner]
//   );

//   /**----------------------------------
//   * 現在地へ移動
//   ----------------------------------*/
//   const moveToCurrentLocation = useCallback(async () => {
//     const location = await getCurrentLocation();
//     if (!location) return null;

//     const { lat, lng } = location;

//     await runLocationFlow(lat, lng, 13, "CURRENT_LOCATION");

//     return location;
//   }, [getCurrentLocation, runLocationFlow]);

//   /**----------------------------------
//    * 住所検索
//    ----------------------------------*/
//   const searchAddress = useCallback(
//     async (address: string) => {
//       if (!address.trim()) return null;

//       const loc = await geocode(address);
//       if (!loc) return null;

//       await runLocationFlow(loc.lat, loc.lng, 13, "ADDRESS_SEARCH");

//       return loc;
//     },
//     [geocode, runLocationFlow]
//   );

//   /*----------------------------------
//    Mapクリック　※後に削除予定
//   ----------------------------------*/
//   const handleMapClick = useCallback(
//     async (e: google.maps.MapMouseEvent) => {
//       if (!e.latLng) return;

//       const lat = e.latLng.lat();
//       const lng = e.latLng.lng();

//       await runLocationFlow(lat, lng, undefined, "MAP_CLICK");
//     },
//     [runLocationFlow]
//   );

//   return {
//     moveToCurrentLocation,
//     searchAddress,
//     handleMapClick
//   };
// }
