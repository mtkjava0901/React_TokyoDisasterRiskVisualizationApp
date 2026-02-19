import { atom } from "jotai";

/**------------------------------
 * リスク結果保存用atom
 ------------------------------*/
export type RiskResult = {
  earthquake?: "HIGH" | "MEDIUM" | "LOW";
  address?: string;
  zoomLevel?: number;
  intensity?: number;
  updatedAt?: string;
};

// 2/18backup
// export type RiskResult = {
//   lat: number;
//   lng: number;
//   earthquake?: "HIGH" | "MEDIUM" | "LOW";
//   address?: string;
// };

export const riskResultAtom = atom<RiskResult | null>(null);
