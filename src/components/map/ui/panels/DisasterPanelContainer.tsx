import { useAtomValue } from "jotai";
import RiskResultPanel from "./RiskResultPanel";
import { activeLayerAtom } from "@/atoms/activeLayerAtom";

export default function DisasterPanelContainer() {
  const layer = useAtomValue(activeLayerAtom);

  // 地図タブ → 非表示
  if (layer === "map") return null;

  // if (layer === "earthquake") {
  //   return <RiskResultPanel />;
  // }

  // if (layer === "flood") {
  //   return <RiskResultPanel />;
  // }

  return <RiskResultPanel />;
}
