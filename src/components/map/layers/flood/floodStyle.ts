import { FloodRiskLevel } from "../../../../types/Flood";

/**----------------------------------------------
 * 洪水地図描画用の専用ルール（Mapに依存）
 * riskLevel = キー対応
 *
 * 地震と区別するため青系の色を使用
 ----------------------------------------------*/

export type PolygonStyle = {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeOpacity: number;
  strokeWeight: number;
};

export const floodPolygonStyleMap: Record<
  FloodRiskLevel,
  PolygonStyle
> = {
  HIGH: {
    fillColor: "#0000FF",
    fillOpacity: 0.5,
    strokeColor: "#0000AA",
    strokeOpacity: 0.7,
    strokeWeight: 1
  },
  MEDIUM: {
    fillColor: "#3399FF",
    fillOpacity: 0.4,
    strokeColor: "#2266AA",
    strokeOpacity: 0.6,
    strokeWeight: 1
  },
  LOW: {
    fillColor: "#99CCFF",
    fillOpacity: 0.3,
    strokeColor: "#6699AA",
    strokeOpacity: 0.5,
    strokeWeight: 1
  }
};
