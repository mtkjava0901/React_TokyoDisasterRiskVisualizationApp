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
  zoom?: number | null;
  scaleLabel?: string;

  // 2/20 洪水リスク追加
  flood?: "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";
  floodRank?: number | null;
  floodDepthDescription?: string | null;
  floodUpdatedAt?: string;
};

export const riskResultAtom = atom<RiskResult | null>(null);
