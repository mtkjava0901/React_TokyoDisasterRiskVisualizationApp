import { useAtomValue } from "jotai";
import RiskResultPanel from "./RiskResultPanel";
import { activeLayerAtom } from "@/atoms/activeLayerAtom";

// 将来
// import FloodResultPanel from "./FloodResultPanel";

export default function DisasterPanelContainer() {
  const layer = useAtomValue(activeLayerAtom);

  // 地図タブ → 非表示
  if (layer === "map") return null;

  if (layer === "earthquake") {
    return <RiskResultPanel />;
  }

  if (layer === "flood") {
    return <div>洪水パネル（未実装）</div>;
  }

  return null;
}
