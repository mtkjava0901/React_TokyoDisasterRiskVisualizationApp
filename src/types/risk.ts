/**-----------------
 * 型定義ファイル
 * 目的：
 * リスク色管理を型安全化するための下地(HIGH/MEDIUM/LOW)
 -----------------*/

/** リスクレベル */
export const RISK_LEVELS = ["HIGH", "MEDIUM", "LOW"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];
