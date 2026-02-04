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
 * 地図表示用に地震データを取得するAPI関数
 ------------------------------------------------*/
export const fetchEarthquakeLayer = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  // meshLevel: MeshLevel
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

/* 0204 off

  // NONEの場合取得不要
  if (meshLevel === "NONE") {
    console.warn("[fetchEarthquakeLayer] meshLevel=NONE, fetch skipped");
    return [];
  }


  // バックエンド用に変換
  const meshLevelValue = meshLevelValueMap[meshLevel];
  if (!meshLevelValue) {
    console.error("[fetchEarthquakeLayer] invalid meshLevel:", meshLevel);
    return [];
  }

  console.log("API request params:", {
    minLat,
    maxLat,
    minLng,
    maxLng,
    meshLevel,
    meshLevelValue
  });

  const res = await axios.get("http://localhost:8080/api/earthquake/layer", {
    params: {
      minLat,
      maxLat,
      minLng,
      maxLng,
      meshLevel: meshLevelValue
    }
  });

  // ① 生レスポンス確認（最重要）
  console.log("[API] raw response:", res.data);
  console.log(
    "[API] raw response length:",
    Array.isArray(res.data) ? res.data.length : "not array"
  );

  // ② 1件目の中身を見る（構造確認）
  if (Array.isArray(res.data) && res.data.length > 0) {
    console.log("[API] first item:", res.data[0]);
  }

  return res.data;
};

*/
