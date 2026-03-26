import { atom } from "jotai";

/**
 * API通信中状態を管理するAtom
 * (true: 取得中, false: 待機中)
 */
export const apiLoadingAtom = atom<boolean>(false);
