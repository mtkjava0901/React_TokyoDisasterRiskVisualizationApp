/**---------------------------
 * ViewModel設計
 *
 * 地震/洪水兼用
 ---------------------------*/

/** -------------------------
 * 災害タイプ
------------------------- */
export type DisasterType = "EARTHQUAKE" | "FLOOD";

/** -------------------------
 * リスクレベル
------------------------- */
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW" | null;

/** -------------------------
 * RiskResultPanel表示用 ViewModel
 *
 * UIはこの型だけを参照する
------------------------- */
export type RiskPanelViewModel = {
  disasterType: DisasterType;

  // riskLevel: RiskLevel;
  riskLevel: string | null; // HIGH/MEDIUM/LOW
  riskLevelLabel: string; // 揺れやすい など

  address?: string;
  zoomLabel?: string;

  /** 地震なら震度 / 洪水なら浸水深 */
  hazardValue?: string;

  updatedAt?: string;
};
