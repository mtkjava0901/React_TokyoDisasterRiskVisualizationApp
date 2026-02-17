import { atom } from "jotai";

/**---------------------
 * ConfirmUIの状態制御
 ---------------------*/
export type OutsideConfirmState = {
  visible: boolean; //UI表示制御
  nearestPoint?: { lat: number; lng: number }; // ユーザー検索地点
  searchedPoint?: { lat: number; lng: number }; // 「はい」押した時の遷移先
};

export const outsideConfirmAtom = atom<OutsideConfirmState>({
  visible: false
});
