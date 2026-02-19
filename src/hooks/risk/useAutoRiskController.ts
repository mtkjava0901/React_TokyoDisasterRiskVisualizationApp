import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useRiskFlow } from "@/hooks/useRiskFlow";
import { locationAtom } from "@/atoms/locationAtom";
import { mapZoomAtom } from "@/atoms/mapAtom";

/**--------------------------------------------------
 * Map中央のリスク自動取得Controller
 *
 * ・locationAtom監視
 * ・debounce付きrisk取得
 *
 * ※バナー制御は BannerController に一本化
--------------------------------------------------*/
export function useAutoRiskController() {
  const location = useAtomValue(locationAtom);
  const zoom = useAtomValue(mapZoomAtom);
  const { runRiskFlow } = useRiskFlow();
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const key = `${location.lat.toFixed(6)}-${location.lng.toFixed(6)}`;
    if (lastKeyRef.current === key) return;

    const timer = setTimeout(async () => {
      lastKeyRef.current = key;
      await runRiskFlow(location.lat, location.lng, zoom);
    }, 400);

    return () => clearTimeout(timer);
  }, [location, zoom, runRiskFlow]);
}
/****************************************************************************************************/
// 2/18
// /**--------------------------------------------------
//  * Map中央のリスク自動取得Controller
//  *
//  * 役割：
//  * ・locationAtom監視
//  * ・debounce付きrisk取得
//  * ・MAP_CLICK（マップ移動）時の都外バナー表示
//  *   ⇒ ADDRESS_SEARCH / CURRENT_LOCATION はLocationController側で制御済み
// --------------------------------------------------*/
// export function useAutoRiskController() {
//   const location = useAtomValue(locationAtom);
//   const trigger = useAtomValue(locationTriggerAtom);
//   const { runRiskFlow } = useRiskFlow();
//   const showBanner = useSetAtom(bannerAtom);

//   const lastKeyRef = useRef<string | null>(null);

//   useEffect(() => {
//     if (!location) return;

//     const key = `${location.lat.toFixed(6)}-${location.lng.toFixed(6)}`;
//     if (lastKeyRef.current === key) return;

//     const timer = setTimeout(async () => {
//       lastKeyRef.current = key;
//       const flow = await runRiskFlow(location.lat, location.lng);

//       // MAP移動（ドラッグ）時のみバナー制御
//       // ADDRESS_SEARCH / CURRENT_LOCATION はLocationController側で制御済み
//       if (trigger === "MAP_CLICK" && flow && !flow.isTokyo) {
//         showBanner({
//           visible: true,
//           type: "error",
//           message: "⚠ 東京都外です。情報を表示できません。",
//           duration: 4000
//         });
//       }
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [location, runRiskFlow, trigger, showBanner]);
// }
