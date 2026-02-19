import axios from "axios";

/**----------------------------------------------
 * 地図表示用に洪水データを取得するAPI関数(A-02)
 *
 * 地震A-01との違い：
 * ・meshLevelパラメータが不要（GeoJSONポリゴンのため）
 ------------------------------------------------*/
export const fetchFloodLayer = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number
) => {
  console.log("API request params (flood):", {
    minLat,
    maxLat,
    minLng,
    maxLng
  });

  const res = await axios.get("http://localhost:8080/api/flood/layer", {
    params: { minLat, maxLat, minLng, maxLng }
  });

  return res.data;
};
