import { atom } from "jotai";

/**------------------------
 * 1点リスク判定結果
 * A-03の結果を保持
 ------------------------*/
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

export const riskPointAtom = atom<RiskLevel | null>(null);

// クリック/検索された座標
export const selectedPointAtom = atom<google.maps.LatLngLiteral | null>(null);

// ローディング状態
export const riskLoadingAtom = atom<boolean>(false);
