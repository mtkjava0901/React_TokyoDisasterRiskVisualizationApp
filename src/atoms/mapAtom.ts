import { atom } from "jotai";

/**------------------------------------------------------------
 * 地図の中心座標とズームレベルを、アプリ全体で共有するための状態定義
 --------------------------------------------------------------*/
// MapCenter型定義
export type MapCenter = {
  lat: number;
  lng: number;
};

// 地図中心のatom（座標指定:東京都庁）
export const mapCenterAtom = atom<MapCenter>({
  lat: 35.6894,
  lng: 139.6917
});

// ズームレベルのatom(初期値)
export const mapZoomAtom = atom<number>(11);
