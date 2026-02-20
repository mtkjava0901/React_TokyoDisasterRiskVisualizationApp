import { atom } from "jotai";
import { FloodPolygon } from "../types/Flood";

/**------------------------------------------------------------------
 * floodDataAtom：表示中の洪水レイヤーデータ本体
 *
 * ・API取得時にbbox付きへ変換済み
 * ・描画最適化済みデータを保持
 ------------------------------------------------------------------ */
export const floodDataAtom = atom<FloodPolygon[]>([]);
