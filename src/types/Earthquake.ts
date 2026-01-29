/**------------------------------------------------------------------
 * 地震の型定義
------------------------------------------------------------------ */
// 今後の為に分離して管理
export type EarthquakeRiskLevel = "HIGH" | "MIDEUM" | "LOW";

export type EarthquakeLayerDto = {
  meshCode: string;
  riskLevel: EarthquakeRiskLevel;
};
