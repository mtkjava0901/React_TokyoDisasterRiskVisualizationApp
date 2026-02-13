import { atom } from "jotai";
import { EarthquakeLayerDto } from "../types/Earthquake";

/**------------------------------------------------------------------
 * earthquakeDataAtom：表示中の地震レイヤーデータ本体
 *
 * ・A-01のレスポンスをそのまま保持する
 * ・(⇒バックエンドのEarthquakeLayerDtoと完全一致)
------------------------------------------------------------------ */
export const earthquakeDataAtom = atom<EarthquakeLayerDto[]>([]);
