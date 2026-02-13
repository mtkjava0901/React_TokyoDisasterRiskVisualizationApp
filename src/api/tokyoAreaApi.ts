import axios from "axios";

export type TokyoContainsResponse = {
  isTokyo: boolean;
};

/**--------------------------------
 * 東京都内判定用API(A-05)
 --------------------------------*/
export const checkTokyoContains = async (
  lat: number,
  lng: number
): Promise<TokyoContainsResponse> => {
  const res = await axios.get<TokyoContainsResponse>(
    "/api/area/tokyo/contains",
    { params: { lat, lng } }
  );
  return res.data;
};
