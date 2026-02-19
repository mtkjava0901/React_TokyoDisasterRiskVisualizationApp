/**------------------------------------
 * RiskLevel → 表示ラベル変換
 *
 * HIGH   → 揺れやすい
 * MEDIUM → やや揺れやすい
 * LOW    → 比較的揺れにくい
 ------------------------------------*/
export function riskLevelToLabel(level: string | null | undefined): string {
  if (!level) return "－";

  switch (level) {
    case "HIGH":
      return "揺れやすい";
    case "MEDIUM":
      return "やや揺れやすい";
    case "LOW":
      return "比較的揺れにくい";
    default:
      return "－";
  }
}
