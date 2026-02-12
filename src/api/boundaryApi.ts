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
  const res = await axios.get("/api/area/tokyo/nearest-boundary", {
    params: { lat, lng }
  });

  return {
    isTokyo: res.data.tokyo,
    distanceMeter: res.data.nearestBoundary.distanceMeter,
    nearestPoint: {
      lat: res.data.nearestBoundary.lat,
      lng: res.data.nearestBoundary.lng
    }
  };
};
