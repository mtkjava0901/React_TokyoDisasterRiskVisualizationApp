/**------------------
 * Helper関数
 ------------------*/
export function getRiskClass(
  disasterType: "EARTHQUAKE" | "FLOOD",
  riskLevel?: string | null
) {
  if (!riskLevel) return "";

  const level = riskLevel.toLowerCase();

  if (disasterType === "FLOOD") {
    return `risk-flood-${level}`;
  }

  // default = 地震
  return `risk-earthquake-${level}`;
}

/*************************************************************/
// export function getRiskClass(level: string | null | undefined) {
//   if (!level) return "";

//   switch (level) {
//     case "HIGH":
//       return "risk-high";
//     case "MEDIUM":
//       return "risk-medium";
//     case "LOW":
//       return "risk-low";
//     default:
//       return "";
//   }
// }
