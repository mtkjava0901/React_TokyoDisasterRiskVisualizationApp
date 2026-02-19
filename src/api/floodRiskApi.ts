import axios from "axios";

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
    console.log("fetchFloodRisk params", { lat, lng });
    const response = await axios.get<FloodRiskResponse>(
      "http://localhost:8080/api/flood/risk",
      { params: { lat, lng } }
    );

    return response.data;
  } catch (error) {
    console.error("[fetchFloodRisk] failed:", error);
    return null;
  }
}
