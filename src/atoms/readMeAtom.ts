import { atom } from "jotai";
// ReadMeモーダルの開閉状態を管理するAtom（初期値はfalse：閉じている）
export const isReadMeOpenAtom = atom<boolean>(false);
