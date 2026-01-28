import axios from "axios";

/**----------------------------------------------
 * 地図表示用に地震データを取得するAPI関数
 ------------------------------------------------*/
export const fetchEarthquakeLayer = async (
  minLat: number,
  maxLat: number,
  minLng: number,
  maxLng: number,
  zoom: number
) => {
  console.log("API request params:", {
    minLat,
    maxLat,
    minLng,
    maxLng,
    zoom
  });

  const res = await axios.get("http://localhost:8080/api/earthquake/layer", {
    params: {
      minLat,
      maxLat,
      minLng,
      maxLng,
      zoom
    }
  });
  return res.data;
};
