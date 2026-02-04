import { EarthquakeRiskLevel } from "../../../../types/Earthquake";

/**----------------------------------------------
 * 地震地図描画用の専用ルール（Mapに依存）
 * riskLevel = キー対応
 * PolygonLayer = 色の意味を知らない(このファイルで意味を持つ)
 ----------------------------------------------*/

export type PolygonStyle = {
  fillColor: string; // 塗りつぶし色
  fillOpacity: number; // 塗りつぶしの不透明度
  strokeColor: string; // 輪郭色
  strokeOpacity: number; // 輪郭の不透明度
  strokeWeight: number; // 輪郭の太さ
};

export const earthquakePolygonStyleMap: Record<
  EarthquakeRiskLevel,
  PolygonStyle
> = {
  HIGH: {
    fillColor: "#FF0000",
    fillOpacity: 0.5,
    strokeColor: "#AA0000",
    strokeOpacity: 0.7,
    strokeWeight: 1
  },
  MEDIUM: {
    fillColor: "#FF9900",
    fillOpacity: 0.4,
    strokeColor: "#AA6600",
    strokeOpacity: 0.6,
    strokeWeight: 1
  },
  LOW: {
    fillColor: "#FFFF00",
    fillOpacity: 0.03,
    strokeColor: "#AAAA00",
    strokeOpacity: 0.5,
    strokeWeight: 1
  }
};
