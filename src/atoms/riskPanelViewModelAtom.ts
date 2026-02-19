import { atom } from "jotai";
import { riskResultAtom } from "./riskResultAtom";
import { toRiskPanelViewModel } from "@/mappers/riskPanelMapper";
import { mapZoomAtom } from "./mapAtom";

/**-------------------------------------
 * RiskResult → ViewModel変換
 -------------------------------------*/
export const riskPanelViewModelAtom = atom((get) => {
  const result = get(riskResultAtom);
  const zoom = get(mapZoomAtom);

  if (!result) return null;

  return toRiskPanelViewModel(result, zoom);
});
