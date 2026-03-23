// import axios from "axios";
import apiClient from "@/libs/apiClient";

/**---------------------------------------
 * A-03 地震リスク1点判定 API
 * backend:
 * GET /api/earthquake/risk/
 ----------------------------------------*/
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

/** APIレスポンス型（ThunderClient確認済） */
export type EarthquakeRiskResponse = {
  riskLevel: RiskLevel;
  intensity?: number; // 計測震度
  dataUpdatedAt?: string; // データ更新年月
};

/**------------------------
 * 地震リスク1点判定取得
------------------------ */
export async function fetchEarthquakeRisk(
  lat: number,
  lng: number
): Promise<EarthquakeRiskResponse | null> {
  try {
    // const response = await axios.get<EarthquakeRiskResponse>(
    const response = await apiClient.get<EarthquakeRiskResponse>(
      "/api/earthquake/risk",
      { params: { lat, lng } }
    );

    return response.data;
  } catch (error) {
    console.error("[fetchEarthquakeRisk] failed:", error);
    return null;
  }
}
