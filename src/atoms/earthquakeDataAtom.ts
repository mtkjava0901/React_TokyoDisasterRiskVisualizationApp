import { atom } from "jotai";
import { EarthquakeLayerDto } from "../types/Earthquake";

/**------------------------------------------------------------------
 * 表示中の地震レイヤーデータ
 * A-01のレスポンスをそのまま保持する
 * (⇒バックエンドのEarthquakeLayerDtoと完全一致)
------------------------------------------------------------------ */
export const earthquakeDataAtom = atom<EarthquakeLayerDto[]>([]);
