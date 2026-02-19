import { RiskLevel } from "@/types/risk";
import { riskClassMap } from "@/constants/riskStyleMap";

/**------------------
 * Helper関数
 ------------------*/
export function getRiskClass(level: string | null | undefined) {
  if (!level) return "";

  switch (level) {
    case "HIGH":
      return "risk-high";
    case "MEDIUM":
      return "risk-medium";
    case "LOW":
      return "risk-low";
    default:
      return "";
  }
  // switch (level) {
  //   case "揺れやすい":
  //     return "risk-high";
  //   case "やや揺れやすい":
  //     return "risk-medium";
  //   case "比較的揺れにくい":
  //     return "risk-low";
  //   default:
  //     return "";
  // }
}

/*************************************************************/
// 2/19
// export function getRiskClass(level?: RiskLevel | null) {
//   if (!level) return "";
//   return riskClassMap[level];
// }
