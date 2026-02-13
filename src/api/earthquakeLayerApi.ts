import axios from "axios";
import { MeshLevel } from "../domain/map/zoomRule";

/**----------------------------------------------
 * MeshLevelフロント ⇒ バックエンド値マッピング
---------------------------------------------- */
const meshLevelValueMap: Record<MeshLevel, number | null> = {
  NONE: null, // API呼び出し無し
  PRIMARY: 4,
  SECONDARY: 6,
  TERTIARY: 8
};

/**----------------------------------------------
 * 地図表示用に地震データを取得するAPI関数(A-01)
 ------------------------------------------------*/
export const fetchEarthquakeLayer = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  meshLevel: number // 0204追加
) => {
  console.log("API request params:", {
    minLat,
    maxLat,
    minLng,
    maxLng,
    meshLevel
  }); // 0204追加

  const res = await axios.get("http://localhost:8080/api/earthquake/layer", {
    params: { minLat, maxLat, minLng, maxLng, meshLevel }
  });

  return res.data; // 0204追加
};
