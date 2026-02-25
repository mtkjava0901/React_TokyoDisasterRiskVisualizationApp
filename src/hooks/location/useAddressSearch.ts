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
