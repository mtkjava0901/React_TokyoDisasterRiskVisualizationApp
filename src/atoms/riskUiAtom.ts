import { atom } from "jotai";

/**-------------------
 * UI状態管理atom
 * ⇒APIとは分離する
 -------------------*/
export type RiskUiState = {
  loading: boolean;
  error: string | null;
};

export const riskUiAtom = atom<RiskUiState>({
  loading: false,
  error: null
});
