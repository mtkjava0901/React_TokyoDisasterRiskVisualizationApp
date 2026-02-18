import { useCallback } from "react";
import { useSetAtom } from "jotai";
import { locationAtom } from "@/atoms/locationAtom";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { useMapController } from "../map/useMapController";
import { useRiskFlow } from "@/hooks/useRiskFlow";

/**----------------------------
 *
 * 住所検索hook
 *
 * 役割：
 * ・住所⇒座標返還（Geocoding）
 * ・Map移動
 * ・RiskFlow実行
 *
 ----------------------------*/
export function useAddressSearch(
  mapRef: React.RefObject<google.maps.Map | null>
) {
  const setLocation = useSetAtom(locationAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);
  const { moveMap } = useMapController();

  const searchAddress = useCallback(async (address: string) => {
    if (!address) return;

    const geocoder = new google.maps.Geocoder();
    const response = await geocoder.geocode({ address });

    if (!response.results.length) return;

    const loc = response.results[0].geometry.location;
    const lat = loc.lat();
    const lng = loc.lng();

    moveMap({ lat, lng });

    // ★これが本体
    setLocation({ lat, lng });
    setTrigger("ADDRESS_SEARCH");
  }, []);

  return { searchAddress };
}

/************************************************************/
// 2/17以前
// export function useAddressSearch(
//   mapRef: React.RefObject<google.maps.Map | null>
// ) {
//   const { runRiskFlow } = useRiskFlow();

//   const searchAddress = useCallback(
//     async (address: string) => {
//       if (!address) return;

//       try {
//         const geocoder = new google.maps.Geocoder();

//         const response = await geocoder.geocode({ address });

//         if (!response.results.length) {
//           alert("住所が見つかりませんでした");
//           return;
//         }

//         const location = response.results[0].geometry.location;

//         const lat = location.lat();
//         const lng = location.lng();

//         // Map移動
//         mapRef.current?.panTo({ lat, lng });

//         // RiskFlow実行（UI更新も内部でやる）
//         await runRiskFlow(lat, lng);
//       } catch (err) {
//         console.error("[useAddressSearch]", err);
//         alert("住所検索に失敗しました");
//       }
//     },
//     [mapRef, runRiskFlow]
//   );

//   return { searchAddress };
// }
