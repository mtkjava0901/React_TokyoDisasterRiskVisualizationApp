import axios from "axios";
import { calcPolygonBBox } from "../utils/calcPolygonBBox";
import { FloodLayerResponse } from "../types/Flood";

/**----------------------------------------------
 * 地図表示用に洪水データを取得するAPI関数(A-02)
 *
 * 地震A-01との違い：
 * ・meshLevelパラメータが不要（GeoJSONポリゴンのため）
 ------------------------------------------------*/
export type FloodPolygon = FloodLayerResponse & {
  bbox: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
};

export const fetchFloodLayer = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number
): Promise<FloodPolygon[]> => {
  console.log("API request params (flood):", {
    minLat,
    maxLat,
    minLng,
    maxLng
  });

  // 2/20
  const res = await axios.get<FloodLayerResponse[]>(
    "http://localhost:8080/api/flood/layer",
    {
      params: { minLat, maxLat, minLng, maxLng }
    }
  );

  // polygon ⇒ bbox変換
  return res.data.map((item) => ({
    ...item,
    bbox: calcPolygonBBox(item.polygon)
  }));

  // return res.data;
};
