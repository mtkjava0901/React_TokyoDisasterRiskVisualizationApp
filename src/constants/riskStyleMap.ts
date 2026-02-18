import { RiskLevel } from "@/types/risk";

/** リスクレベル → CSS class */
export const riskClassMap: Record<RiskLevel, string> = {
  HIGH: "risk-high",
  MEDIUM: "risk-medium",
  LOW: "risk-low"
};
