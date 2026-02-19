import { zoomToScaleLabel } from "@/domain/map/zoomToScaleLabel";
import { intensityToLabel } from "@/domain/risk/intensityToLabel";
import { riskLevelToLabel } from "@/domain/risk/riskLavelToLabel";
import { formatAddress } from "@/domain/address/formatAddress";
import { RiskPanelViewModel } from "@/types/RiskPanelViewModel";
import { ActiveLayer } from "@/atoms/activeLayerAtom";

/**------------------------------
 * APIレスポンス → ViewModel変換
------------------------------ */
export function toRiskPanelViewModel(
  result: any,
  zoom: number | null | undefined,
  activeLayer?: ActiveLayer
): RiskPanelViewModel | null {
  console.log("API earthquake:", result.earthquake);

  if (!result) return null;

  // 洪水タブ選択時
  if (activeLayer === "flood") {
    return toFloodViewModel(result, zoom);
  }

  // デフォルト: 地震
  return {
    disasterType: "EARTHQUAKE",

    riskLevel: result.earthquake ?? null,
    riskLevelLabel: riskLevelToLabel(result.earthquake),

    address: formatAddress(result.address),

    zoomLabel: zoomToScaleLabel(zoom),

    // 地震用
    hazardValue: intensityToLabel(result.intensity),

    updatedAt: result.updatedAt
  };
}

/**------------------------------
 * 洪水ViewModel変換
 ------------------------------ */
function toFloodViewModel(
  result: any,
  zoom: number | null | undefined
): RiskPanelViewModel {
  return {
    disasterType: "FLOOD",

    riskLevel: result.flood ?? null,
    riskLevelLabel: floodRiskLevelToLabel(result.flood),

    address: formatAddress(result.address),

    zoomLabel: zoomToScaleLabel(zoom),

    // 洪水用: 浸水深説明
    hazardValue: result.floodDepthDescription ?? "－",

    updatedAt: result.floodUpdatedAt
  };
}

/**------------------------------
 * 洪水リスクレベル → ラベル変換
 ------------------------------ */
function floodRiskLevelToLabel(level: string | null | undefined): string {
  if (!level || level === "UNKNOWN") return "－";

  switch (level) {
    case "HIGH":
      return "浸水リスク高";
    case "MEDIUM":
      return "浸水リスク中";
    case "LOW":
      return "浸水リスク低";
    default:
      return "－";
  }
}
