import { atom } from "jotai";

/**------------------------------------------------------------------
 * Mapの表示範囲という純粋な状態
 * (south / west / north / east)
 * API取得・描画判断の起点
 ------------------------------------------------------------------*/
export type MapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export const mapBoundsAtom = atom<MapBounds | null>(null);
