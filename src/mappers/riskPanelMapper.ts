import { zoomToScaleLabel } from "@/domain/map/zoomToScaleLabel";
import { RiskPanelViewModel } from "@/types/RiskPanelViewModel";

/**------------------------------
 * APIレスポンス → ViewModel変換
------------------------------ */
export function toRiskPanelViewModel(
  result: any,
  zoom: number | null | undefined
): RiskPanelViewModel | null {
  if (!result) return null;

  return {
    disasterType: "EARTHQUAKE",

    riskLevel: result.earthquake ?? null,

    address: result.address,

    zoomLabel: zoomToScaleLabel(zoom),

    // 地震用
    hazardValue: result.intensity,

    updatedAt: result.updatedAt
  };
}
