// import axios from "axios";
import apiClient from "@/libs/apiClient";

/**---------------------------------------
 * A-04 洪水リスク1点判定 API
 * backend:
 * GET /api/flood/risk/
 ----------------------------------------*/

/** APIレスポンス型 */
export type FloodRiskResponse = {
  riskLevel: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  rank: number | null;
  depthDescription: string | null;
  dataUpdatedAt?: string;
};

/**------------------------
 * 洪水リスク1点判定取得
 ------------------------ */
export async function fetchFloodRisk(
  lat: number,
  lng: number
): Promise<FloodRiskResponse | null> {
  try {
    // const response = await axios.get<FloodRiskResponse>(
    const response = await apiClient.get<FloodRiskResponse>("/api/flood/risk", {
      params: { lat, lng }
    });

    return response.data;
  } catch (error) {
    console.error("[fetchFloodRisk] failed:", error);
    return null;
  }
}
