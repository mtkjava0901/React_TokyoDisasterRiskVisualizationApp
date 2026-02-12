import { atom } from "jotai";

/**------------------
 *
 * AreaModeの切替用atom
 *
------------------ */
export type AreaMode =
  | "INSIDE_TOKYO"
  | "OUTSIDE_TOKYO"
  | "UNSUPPORTED_AREA"
  | "API_ERROR";

export const areaModeAtom = atom<AreaMode>("INSIDE_TOKYO");
