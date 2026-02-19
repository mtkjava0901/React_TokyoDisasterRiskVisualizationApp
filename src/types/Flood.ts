/**------------------------------------------------------------------
 * 洪水の型定義
 * フロント全体で再利用可能なクラス
 ------------------------------------------------------------------ */
import { LatLng } from "./Earthquake";

export type FloodRiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type FloodLayerDto = {
  rank: number;
  riskLevel: FloodRiskLevel;
  polygon: LatLng[];
};
