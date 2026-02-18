import { useAtom, useSetAtom } from "jotai";
import { useRiskPoint } from "./useRiskPoint";
import { riskUiAtom } from "@/atoms/riskUiAtom";
import { normalizePoint } from "@/domain/risk/normalizePoint";
import { riskResultAtom } from "@/atoms/riskResultAtom";
import { checkTokyoContains } from "@/api/tokyoAreaApi";
import { fetchNearestBoundary } from "@/api/boundaryApi";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { tokyoStatusAtom } from "@/atoms/tokyoStatusAtom";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
// bannerAtomはController側で制御するためimport不要

/**----------------------------------------
 * 順制御hook（オーケストレーションhook）
 * A-05(東京都内判定)
 * ⇒A-03(地震リスク判定)
 * ⇒A-04(洪水リスク)
 * ⇒A-06(最近接東京都境界取得)
 *
 * 役割：
 * ・処理順保障
 * ・UI状態管理
 * ・エラー制御
 *
 * バナー表示はController側（useLocationController / useAutoRiskController）で行う
 ----------------------------------------*/
export type RiskFlowResult = {
  result: any | null;
  isTokyo: boolean;
  isBoundary: boolean;
  nearestPoint?: { lat: number; lng: number };
};

export function useRiskFlow() {
  const { fetchRisk, clearRisk } = useRiskPoint();
  const { getAddress } = useReverseGeocode();

  const [, setUi] = useAtom(riskUiAtom);
  const [, setResult] = useAtom(riskResultAtom);
  const [, setAreaMode] = useAtom(areaModeAtom);
  const setTokyoStatus = useSetAtom(tokyoStatusAtom);

  // 境界判定しきい値（30～50m推奨）
  const BOUNDARY_THRESHOLD = 50;

  /**------------------------------------
   * メイン実行フロー
   ------------------------------------*/
  const runRiskFlow = async (
    lat: number,
    lng: number
  ): Promise<RiskFlowResult> => {
    console.log("[runRiskFlow] called:", lat, lng);

    try {
      // UI loading ON
      setUi({ loading: true, error: null });

      // A-05 前処理
      const point = normalizePoint(lat, lng);

      // A-05 東京都内判定
      const tokyoCheck = await checkTokyoContains(point.lat, point.lng);

      // ■ 都外
      if (!tokyoCheck.isTokyo) {
        console.log("[RiskFlow] OUTSIDE_TOKYO");

        setTokyoStatus("OUTSIDE");
        setAreaMode("OUTSIDE_TOKYO");
        setUi({ loading: false, error: null });

        // 最近接点を取得して返す（バナー制御はController側で行う）
        let nearestPoint: { lat: number; lng: number } | undefined;
        try {
          const nearest = await fetchNearestBoundary(point.lat, point.lng);
          nearestPoint = nearest?.nearestPoint;
        } catch {
          // 取得失敗は無視
        }

        return { result: null, isTokyo: false, isBoundary: false, nearestPoint };
      }

      // ■ 都内: 境界距離判定
      const nearest = await fetchNearestBoundary(point.lat, point.lng);
      const distance = nearest.distanceMeter ?? Infinity;
      const isBoundary = distance < BOUNDARY_THRESHOLD;

      if (isBoundary) {
        setTokyoStatus("BOUNDARY");
        setAreaMode("BOUNDARY");
      } else {
        setTokyoStatus("INSIDE");
        setAreaMode("INSIDE_TOKYO");
      }

      // A-03 リスク取得 + 住所取得（並列処理）
      const [risk, address] = await Promise.all([
        fetchRisk(point.lat, point.lng),
        getAddress(point.lat, point.lng)
      ]);

      // 結果統合
      setResult({
        lat: point.lat,
        lng: point.lng,
        earthquake: risk?.riskLevel,
        address
      });

      setUi({ loading: false, error: null });

      return {
        result: risk,
        isTokyo: true,
        isBoundary,
        nearestPoint: nearest.nearestPoint
      };
    } catch (err) {
      console.error("[useRiskFlow]", err);

      setAreaMode("API_ERROR");

      setUi({
        loading: false,
        error: "リスク取得に失敗しました"
      });

      clearRisk();

      return {
        result: null,
        isTokyo: false,
        isBoundary: false
      };
    }
  };

  const clear = () => {
    clearRisk();
    setUi({ loading: false, error: null });
  };

  return {
    runRiskFlow,
    clear
  };
}
