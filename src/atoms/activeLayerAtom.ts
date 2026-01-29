import { atom } from "jotai";

/**----------------------------------------
 * レイヤー切替の管理（汎用UIもこれで連動させる）
 * 現在表示中のレイヤーを管理
 * null = 何も表示していない
 ----------------------------------------*/
export type ActiveLayer = "earthquake" | "flood" | null;

export const activeLayerAtom = atom<ActiveLayer>("earthquake");
