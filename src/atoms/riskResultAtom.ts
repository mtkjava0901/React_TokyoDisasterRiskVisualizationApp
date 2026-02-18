import { atom } from "jotai";

/**------------------------------
 * リスク結果保存用atom
 ------------------------------*/
export type RiskResult = {
  lat: number;
  lng: number;
  earthquake?: "HIGH" | "MEDIUM" | "LOW";
  address?: string;
};

export const riskResultAtom = atom<RiskResult | null>(null);

/*
// 0218 derived atom (停止)
export const riskResultAtom = atom(async (get) => {
  const location = get(locationAtom);
  if (!location) return null;

  return fetchEarthquakeRisk(location.lat, location.lng);
});
*/
