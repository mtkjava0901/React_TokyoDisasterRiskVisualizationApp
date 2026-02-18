import { RiskLevel } from "@/types/risk";
import { riskClassMap } from "@/constants/riskStyleMap";

/**------------------
 * Helper関数
 ------------------*/
export function getRiskClass(level?: RiskLevel | null) {
  if (!level) return "";
  return riskClassMap[level];
}
