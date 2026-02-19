import { fetchEarthquakeRisk } from "@/api/earthquakeRiskApi";
import { riskPointAtom } from "@/atoms/riskPointAtom";
import { useAtom } from "jotai";

/**---------------------------------
 * A-03 地震リスク1点判定hook
 *
 * 役割：
 * ・API呼び出し
 * ・atom保存
 * ・UI非依存
 ---------------------------------*/
export function useRiskPoint() {
  const [, setRiskPoint] = useAtom(riskPointAtom);

  const fetchRisk = async (lat: number, lng: number) => {
    try {
      const result = await fetchEarthquakeRisk(lat, lng);

      if (!result) return null;

      // 2/19修正
      setRiskPoint(result.riskLevel);

      return result;
    } catch (err) {
      console.error("[useRiskPoint] error:", err);
      return null;
    }
  };

  const clearRisk = () => {
    setRiskPoint(null);
  };

  return {
    fetchRisk,
    clearRisk
  };
}
