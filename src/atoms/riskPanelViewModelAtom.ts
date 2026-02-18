import { atom } from "jotai";
import { riskResultAtom } from "./riskResultAtom";
import { toRiskPanelViewModel } from "@/mappers/riskPanelMapper";

/**-------------------------------------
 * RiskResult → ViewModel変換
 -------------------------------------*/
export const riskPanelViewModelAtom = atom((get) => {
  const result = get(riskResultAtom);

  // デバッグ
  console.log("riskResultAtom中身", result);

  return toRiskPanelViewModel(result);
});
