import { atom } from "jotai";

/**------------------------
 * 「座標移動＝全て更新」
 * 上記規定atom
 ------------------------*/
export type MapLocation = {
  lat: number;
  lng: number;
};

export const locationAtom = atom<MapLocation | null>(null);
