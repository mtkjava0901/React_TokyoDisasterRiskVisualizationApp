import { atom } from "jotai";

/**----------------------------------------
 * activeLayerAtom 表示モードの管理
 *
 * ・どのレイヤーを表示するか
 * ・UI状態
 * ・表示切替制御
 *
 *  ⇒表示ON/OFFのスイッチを司る
 ----------------------------------------*/
export type ActiveLayer = "earthquake" | "flood" | null;

export const activeLayerAtom = atom<ActiveLayer>("earthquake");
