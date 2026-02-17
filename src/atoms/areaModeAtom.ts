import { atom } from "jotai";

/**------------------
 *
 * AreaModeの切替用atom
 *
------------------ */
export type AreaMode =
  | "INSIDE_TOKYO" // 都内
  | "BOUNDARY" // 都内境界付近
  | "OUTSIDE_TOKYO" // 都外
  | "UNSUPPORTED_AREA" // サポート対応外エリア
  | "API_ERROR"; //　APIエラー

export const areaModeAtom = atom<AreaMode>("INSIDE_TOKYO");
