/**------------------------------------------------------------------
 * 地震の型定義
 * フロント全体で再利用可能なクラス
------------------------------------------------------------------ */
// 今後の為に分離して管理
export type EarthquakeRiskLevel = "HIGH" | "MEDIUM" | "LOW";

export type LatLng = {
  lat: number;
  lng: number;
};

export type EarthquakeLayerDto = {
  meshCode: string;
  riskLevel: EarthquakeRiskLevel;
  polygon: LatLng[];
};
