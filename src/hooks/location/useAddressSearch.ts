import { useCallback } from "react";
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
  const { runRiskFlow } = useRiskFlow();

  const searchAddress = useCallback(
    async (address: string) => {
      if (!address) return;

      try {
        const geocoder = new google.maps.Geocoder();

        const response = await geocoder.geocode({ address });

        if (!response.results.length) {
          alert("住所が見つかりませんでした");
          return;
        }

        const location = response.results[0].geometry.location;

        const lat = location.lat();
        const lng = location.lng();

        // Map移動
        mapRef.current?.panTo({ lat, lng });

        // RiskFlow実行（UI更新も内部でやる）
        await runRiskFlow(lat, lng);
      } catch (err) {
        console.error("[useAddressSearch]", err);
        alert("住所検索に失敗しました");
      }
    },
    [mapRef, runRiskFlow]
  );

  return { searchAddress };
}
