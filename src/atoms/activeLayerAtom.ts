import { atom } from "jotai";

/**----------------------------------------
 * activeLayerAtom 表示モードの管理
 *
 * "map"       : レイヤーなし（地図のみ）
 * "earthquake": 地震レイヤー
 * "flood"     : 洪水レイヤー
 *
 *  ⇒表示ON/OFFのスイッチを司る
 ----------------------------------------*/
export type ActiveLayer = "map" | "earthquake" | "flood";

export const activeLayerAtom = atom<ActiveLayer>("earthquake");
