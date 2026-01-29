import { atom } from "jotai";

/**------------------------------------------------------------------
 * Mapの表示範囲という純粋な状態
 * (south / west / north / east)
 * API取得・描画判断の起点
 ------------------------------------------------------------------*/
export type MapBounds = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export const mapBoundsAtom = atom<MapBounds | null>(null);

/**------------------------------------------------------------------
 * 以降、今後の拡張を想定した追記コード
 * (まだ使わない ⇒ STEP15｢レスポンス最適化｣で使用)
 * 「地図を少し動かしただけでAPIを叩きまくる問題」←これの解決用
 ------------------------------------------------------------------*/
/*
// 前回値と比較して「意味のある移動か？」を判定
export const mapBoundsChangedAtom = atom(
  (get) => get(mapBoundsAtom),
  (get, set, next: MapBounds) => {
    const prev = get(mapBoundsAtom);

    if (!prev) {
      set(mapBoundsAtom, next);
      return;
    }

    const threshold = 0.01; // 約1km

    const isChanged =
      Math.abs(prev.minLat - next.minLat) > threshold ||
      Math.abs(prev.maxLat - next.maxLat) > threshold ||
      Math.abs(prev.minLng - next.minLng) > threshold ||
      Math.abs(prev.maxLng - next.maxLng) > threshold;

    if (isChanged) {
      set(mapBoundsAtom, next);
    }
  }
);

*/
