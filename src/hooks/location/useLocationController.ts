import useGeocoding from "../useGeocoding";
import { useCallback } from "react";
import { useCurrentLocation } from "./useCurrentLocation";
import { useSetAtom } from "jotai";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { locationAtom } from "@/atoms/locationAtom";
import { useMapController } from "../map/useMapController";
import { bannerAtom } from "@/atoms/bannerAtom";
import { useRiskFlow } from "../useRiskFlow";
import { areaModeAtom } from "@/atoms/areaModeAtom";

/**-------------------------------------------------
 * Location統合Controller
 *
 * 責務：
 * ・現在地検索 / 住所検索 / Mapクリック
 * ・locationAtom / locationTriggerAtom の更新
 *
 * バナー制御は BannerController に一本化。
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
  /** 住所検索 */
  const searchAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) return null;
      const loc = await geocode(address);
      if (!loc) return null;
      moveMap({ lat: loc.lat, lng: loc.lng }, 13);
      setTrigger("ADDRESS_SEARCH");
      setLocation({ lat: loc.lat, lng: loc.lng });
      return loc;
    },
    [geocode, moveMap, setLocation, setTrigger]
  );
  /** 現在地ボタン */
  const moveToCurrentLocation = useCallback(async () => {
    const loc = await getCurrentLocation();
    if (!loc) return;
    moveMap({ lat: loc.lat, lng: loc.lng }, 13);
    setTrigger("CURRENT_LOCATION");
    setLocation({ lat: loc.lat, lng: loc.lng });
  }, [getCurrentLocation, moveMap, setLocation, setTrigger]);
  /** Mapクリック */
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      setTrigger("MAP_CLICK");
      setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    },
    [setLocation, setTrigger]
  );
  return {
    moveToCurrentLocation,
    searchAddress,
    handleMapClick
  };
}
/*************************************************************************************************************/
// export type LocationTrigger =
//   | "MAP_CLICK"
//   | "CURRENT_LOCATION"
//   | "ADDRESS_SEARCH";

// export function useLocationController() {
//   const { getCurrentLocation } = useCurrentLocation();
//   const { geocode } = useGeocoding();
//   const { runRiskFlow } = useRiskFlow();

//   const setLocation = useSetAtom(locationAtom);
//   const setTrigger = useSetAtom(locationTriggerAtom);
//   const { moveMap } = useMapController();
//   const showBanner = useSetAtom(bannerAtom);
//   const setAreaMode = useSetAtom(areaModeAtom);

//   /**----------------------------------
//    * 住所検索
//    * ・先に地点へ遷移
//    * ・都外: REDバナー「境界まで移動しますか？」
//    * ・都内: パネル更新
//    ----------------------------------*/
//   const searchAddress = useCallback(
//     async (address: string) => {
//       if (!address.trim()) return null;

//       const loc = await geocode(address);
//       if (!loc) return null;

//       // 先に地点へ移動
//       moveMap({ lat: loc.lat, lng: loc.lng }, 13);
//       setLocation({ lat: loc.lat, lng: loc.lng });
//       setTrigger("ADDRESS_SEARCH");

//       // リスク判定
//       const flow = await runRiskFlow(loc.lat, loc.lng);

//       if (flow && !flow.isTokyo) {
//         // 都外: REDバナー（confirm）
//         const nearestPoint = flow.nearestPoint;
//         showBanner({
//           visible: true,
//           type: "confirm",
//           message: "⚠ 東京都外です。境界まで移動しますか？",
//           confirmLabel: "移動する",
//           cancelLabel: "このまま表示",
//           onConfirm: () => {
//             if (nearestPoint) {
//               moveMap(nearestPoint, 13);
//               setLocation(nearestPoint);
//               setTrigger("MAP_CLICK");
//               // 境界地点でリスク再取得
//               runRiskFlow(nearestPoint.lat, nearestPoint.lng);
//             }
//           },
//           onCancel: () => {
//             // 何もしない（このまま表示）
//           }
//         });
//       }

//       return loc;
//     },
//     [
//       geocode,
//       moveMap,
//       setLocation,
//       setTrigger,
//       runRiskFlow,
//       showBanner,
//       setAreaMode
//     ]
//   );

//   /**----------------------------------
//    * 現在地ボタン
//    * ・先に地点へ遷移
//    * ・都外: REDバナー「情報を表示できません」
//    * ・都内: パネル更新
//    ----------------------------------*/
//   const moveToCurrentLocation = useCallback(async () => {
//     const loc = await getCurrentLocation();
//     if (!loc) return;

//     // 先に地点へ移動
//     moveMap({ lat: loc.lat, lng: loc.lng }, 14);
//     setLocation({ lat: loc.lat, lng: loc.lng });
//     setTrigger("CURRENT_LOCATION");

//     // リスク判定
//     const flow = await runRiskFlow(loc.lat, loc.lng);

//     if (flow && !flow.isTokyo) {
//       // 都外: REDバナー（情報なし）
//       showBanner({
//         visible: true,
//         type: "error",
//         message: "⚠ 東京都外です。情報を表示できません。",
//         duration: 5000
//       });
//     }
//   }, [
//     getCurrentLocation,
//     moveMap,
//     setLocation,
//     setTrigger,
//     runRiskFlow,
//     showBanner
//   ]);

//   /**----------------------------------
//    * Mapクリック（都外バナーはuseAutoRiskController側で制御）
//    ----------------------------------*/
//   const handleMapClick = useCallback(
//     (e: google.maps.MapMouseEvent) => {
//       if (!e.latLng) return;
//       setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
//       setTrigger("MAP_CLICK");
//     },
//     [setLocation, setTrigger]
//   );

//   return {
//     moveToCurrentLocation,
//     searchAddress,
//     handleMapClick
//   };
// }
