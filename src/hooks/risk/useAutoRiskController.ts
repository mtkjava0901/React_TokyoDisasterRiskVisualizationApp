import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { useRiskFlow } from "@/hooks/useRiskFlow";
import { locationAtom } from "@/atoms/locationAtom";
import { useMapController } from "@/hooks/map/useMapController";
import { mapCenterAtom } from "@/atoms/mapAtom";

/**--------------------------------------------------
 * Map中央のリスク自動取得Controller
 *
 * 役割：
 * ・mapCenter変更監視
 * ・debounce付きrisk取得
 * ・重複API防止
 * ・遷移を行わない(LocationControllerのみ)
 *
 * 2/18 locationAtom監視に修正
--------------------------------------------------*/
export function useAutoRiskController() {
  const location = useAtomValue(locationAtom);
  const { runRiskFlow } = useRiskFlow();

  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const key = `${location.lat.toFixed(6)}-${location.lng.toFixed(6)}`;
    if (lastKeyRef.current === key) return;

    const timer = setTimeout(async () => {
      lastKeyRef.current = key;
      await runRiskFlow(location.lat, location.lng);
    }, 400);

    return () => clearTimeout(timer);
  }, [location, runRiskFlow]);
}
/*****************************************************************/
// 2/17以前
// export function useAutoRiskController() {
//   const center = useAtomValue(mapCenterAtom);
//   const { runRiskFlow } = useRiskFlow();
//   // const { moveMap } = useMapController(); //2017停止

//   // 同一点再取得防止
//   const lastKeyRef = useRef<string | null>(null);

//   useEffect(() => {
//     if (!center) return;

//     /** -----------------------
//      * 同一点チェック
//      -----------------------*/
//     const key = `${center.lat.toFixed(6)}-${center.lng.toFixed(6)}`;
//     if (lastKeyRef.current === key) return;

//     /** -----------------------
//      * debounce
//      * ドラッグ中連打防止
//      -----------------------*/
//     const timer = setTimeout(async () => {
//       lastKeyRef.current = key;

//       try {
//         await runRiskFlow(center.lat, center.lng);
//       } catch (err) {
//         console.error("[AutoRiskController]", err);
//       }
//     }, 400); // UX最適値 300〜500ms

//     return () => clearTimeout(timer);
//   }, [center, runRiskFlow]);
// }
