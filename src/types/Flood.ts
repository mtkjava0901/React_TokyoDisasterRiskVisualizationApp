import { LatLng } from "./Earthquake";

/**------------------------------------------------------------------
 * 洪水の型定義
 * フロント全体で再利用可能なクラス
 ------------------------------------------------------------------ */
export type FloodRiskLevel = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export type FloodLayerResponse = {
  polygon: { lat: number; lng: number }[];
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  rank: number;
};

/**---------------------------------------------
 * LatLng（GoogleMap互換）
 ---------------------------------------------*/
export type LatLngLiteral = {
  lat: number;
  lng: number;
};

/**---------------------------------------------
 * polygon bounding box
 ---------------------------------------------*/
export type PolygonBBox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

/**---------------------------------------------
 * Backend DTO（そのまま）
 * A-02 /api/flood/layer
 ---------------------------------------------*/
export type FloodLayerDto = {
  rank: number;
  riskLevel: FloodRiskLevel;
  polygon: LatLng[];
};

/**---------------------------------------------
 * フロント表示専用モデル（bbox付き）
 ---------------------------------------------*/
export type FloodPolygon = FloodLayerDto & {
  bbox: PolygonBBox;
};
