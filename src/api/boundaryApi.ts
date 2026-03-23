import apiClient from "@/libs/apiClient";
import axios from "axios";

/**-------------------------------
 * 最近接東京都境界API (A-06)
 -------------------------------*/
export type NearestBoundaryResponse = {
  isTokyo: boolean;
  distanceMeter: number;
  nearestPoint: {
    lat: number;
    lng: number;
  };
};

export const fetchNearestBoundary = async (
  lat: number,
  lng: number
): Promise<NearestBoundaryResponse> => {
  // const res = await axios.get("/api/area/tokyo/nearest-boundary", {
  const res = await apiClient.get("/api/area/tokyo/nearest-boundary", {
    params: { lat, lng }
  });

  // 仮実装
  const isTokyo = res.data.tokyo;
  const nearest = res.data.nearestBoundary;

  if (!nearest) {
    console.error("Nearest data is missing in response!", res.data);
    throw new Error("Nearest data is missing");
  }

  return {
    isTokyo: isTokyo,
    distanceMeter: nearest.distanceMeter,
    nearestPoint: {
      lat: nearest.lat,
      lng: nearest.lng
    }
  };
};
