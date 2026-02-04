import { EarthquakeRiskLevel } from "../../../../types/Earthquake";

/**----------------------------------------------
 * 地震地図描画用の専用ルール（Mapに依存）
 * riskLevel = キー対応
 * PolygonLayer = 色の意味を知らない(このファイルで意味を持つ)
 ----------------------------------------------*/

export type PolygonStyle = {
  fillColor: string;
  fillOpacity: number;
  strokeColor: string;
  strokeWeight: number;
};

export const earthquakePolygonStyleMap: Record<
  EarthquakeRiskLevel,
  PolygonStyle
> = {
  HIGH: {
    fillColor: "#ff0000",
    fillOpacity: 0.5,
    strokeColor: "#aa0000",
    strokeWeight: 2
  },
  MIDEUM: {
    fillColor: "#ffa500",
    fillOpacity: 0.5,
    strokeColor: "#cc8400",
    strokeWeight: 2
  },
  LOW: {
    fillColor: "#ffff00",
    fillOpacity: 0.5,
    strokeColor: "#cccc00",
    strokeWeight: 2
  }
};
