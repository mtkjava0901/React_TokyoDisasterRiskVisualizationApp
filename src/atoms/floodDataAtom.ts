import { atom } from "jotai";
import { FloodLayerDto } from "../types/Flood";

/**------------------------------------------------------------------
 * floodDataAtom：表示中の洪水レイヤーデータ本体
 *
 * ・A-02のレスポンスをそのまま保持する
 * ・(⇒バックエンドのFloodLayerDtoと完全一致)
 ------------------------------------------------------------------ */
export const floodDataAtom = atom<FloodLayerDto[]>([]);
