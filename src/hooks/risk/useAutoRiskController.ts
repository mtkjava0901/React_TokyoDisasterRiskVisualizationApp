import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { mapCenterAtom } from "@/atoms/mapAtom";
import { useRiskFlow } from "@/hooks/useRiskFlow";

/**--------------------------------------------------
 * Map中央のリスク自動取得Controller
 *
 * 役割：
 * ・mapCenter変更監視
 * ・debounce付きrisk取得
 * ・重複API防止
 * ・東京都外なら最近接へ自動移動
--------------------------------------------------*/
export function useAutoRiskController() {
  const center = useAtomValue(mapCenterAtom);
  const { runRiskFlow } = useRiskFlow();

  // 同一点再取得防止
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!center) return;

    /** -----------------------
     * 同一点チェック
     -----------------------*/
    const key = `${center.lat.toFixed(6)}-${center.lng.toFixed(6)}`;
    if (lastKeyRef.current === key) return;

    /** -----------------------
     * debounce
     * ドラッグ中連打防止
     -----------------------*/
    const timer = setTimeout(async () => {
      lastKeyRef.current = key;

      try {
        const flow = await runRiskFlow(center.lat, center.lng);

        // 東京都外なら最近接へ移動
        if (!flow.isTokyo && flow.nearestPoint) {
          console.log("[AutoRisk] move nearest Tokyo");

          // mapController経由で移動
          const { useMapController } =
            await import("@/hooks/map/useMapController");
          const { moveMap } = useMapController();

          moveMap(flow.nearestPoint, 13);
        }
      } catch (err) {
        console.error("[AutoRiskController]", err);
      }
    }, 400); // UX最適値 300〜500ms

    return () => clearTimeout(timer);
  }, [center, runRiskFlow]);
}
