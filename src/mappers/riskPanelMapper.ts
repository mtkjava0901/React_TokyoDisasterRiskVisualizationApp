import { zoomToScaleLabel } from "@/domain/map/zoomToScaleLabel";
import { intensityToLabel } from "@/domain/risk/intensityToLabel";
import { riskLevelToLabel } from "@/domain/risk/riskLavelToLabel";
import { RiskPanelViewModel } from "@/types/RiskPanelViewModel";

/**------------------------------
 * APIレスポンス → ViewModel変換
------------------------------ */
export function toRiskPanelViewModel(
  result: any,
  zoom: number | null | undefined
): RiskPanelViewModel | null {
  console.log("API earthquake:", result.earthquake);

  if (!result) return null;

  return {
    disasterType: "EARTHQUAKE",

    riskLevel: result.earthquake ?? null,
    riskLevelLabel: riskLevelToLabel(result.earthquake),

    address: result.address,

    zoomLabel: zoomToScaleLabel(zoom),

    // 地震用
    hazardValue: intensityToLabel(result.intensity),

    updatedAt: result.updatedAt
  };
}
