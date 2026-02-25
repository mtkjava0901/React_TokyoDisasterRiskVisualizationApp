import { useEffect, useRef } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { useRiskFlow } from "@/hooks/useRiskFlow";
import { locationAtom } from "@/atoms/locationAtom";
import { mapZoomAtom } from "@/atoms/mapAtom";

/**--------------------------------------------------
 * Map中央のリスク自動取得Controller
 *
 * ・locationAtom監視
 * ・debounce付きrisk取得
 *
 * ※バナー制御は BannerController に一本化
--------------------------------------------------*/
export function useAutoRiskController() {
  const location = useAtomValue(locationAtom);
  const zoom = useAtomValue(mapZoomAtom);
  const { runRiskFlow } = useRiskFlow();
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location) return;

    const key = `${location.lat.toFixed(6)}-${location.lng.toFixed(6)}`;
    if (lastKeyRef.current === key) return;

    const timer = setTimeout(async () => {
      lastKeyRef.current = key;
      await runRiskFlow(location.lat, location.lng, zoom);
    }, 400);

    return () => clearTimeout(timer);
  }, [location, zoom, runRiskFlow]);
}
