import { atom } from "jotai";

/**----------------
 * リスク結果保存用atom
 ----------------*/
export type RiskResult = {
  lat: number;
  lng: number;
  earthquake?: "HIGH" | "MEDIUM" | "LOW";
};

export const riskResultAtom = atom<RiskResult | null>(null);