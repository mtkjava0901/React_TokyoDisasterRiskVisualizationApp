import axios from "axios";
import { apiClient } from "./client";

/**---------------------------------------
 * A-03 地震リスク1点判定 API
 * backend:
 * POST /api/earthquake/risk/point
 ----------------------------------------*/

/** APIリクエスト型 */
export type EarthquakeRiskRequest = {
  lat: number;
  lng: number;
  meshLevel: number;
};

/** APIレスポンス型（ThunderClient確認済） */
export type EarthquakeRiskResponse = {
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
};

/**------------------------
 * 地震リスク1点判定取得
------------------------ */
export async function fetchEarthquakeRisk(
  lat: number,
  lng: number,
  meshLevel: number
): Promise<EarthquakeRiskResponse | null> {
  try {
    const response = await axios.get<EarthquakeRiskResponse>(
      "http://localhost:8080/api/earthquake/risk",
      { params: { lat, lng, meshLevel } }
    );

    return response.data;
  } catch (error) {
    console.error("[fetchEarthquakeRisk] failed:", error);
    return null;
  }
}
