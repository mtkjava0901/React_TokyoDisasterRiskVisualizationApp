import { useAtom } from "jotai";
import { useRiskPoint } from "./useRiskPoint";
import { riskUiAtom } from "@/atoms/riskUiAtom";
import { normalizePoint } from "@/domain/risk/normalizePoint";
import { riskResultAtom } from "@/atoms/riskResultAtom";
import { checkTokyoContains } from "@/api/tokyoAreaApi";
import { fetchNearestBoundary } from "@/api/boundaryApi";
import { areaModeAtom } from "@/atoms/areaModeAtom";

/**----------------------------------------
 * 順制御hook（オーケストレーションhook）
 * A-05(東京都内判定)
 * ⇒A-03(地震リスク判定)
 * ⇒A-04(洪水リスク) ※後に追加、単一リスク⇒マルチリスク統合フローに進化
 * ⇒A-06(最近接東京都境界取得)
 *
 * 役割：
 * ・処理順保障
 * ・UI状態管理
 * ・エラー制御
 * ・将来のAPI追加ポイント
 *
 * 後のメモ：
 * ・Flowは一つにまとめる(runRiskFlow())
 * ・runRiskFlow()⇒A-05⇒Promise.all(A03,A-04)⇒結果統合⇒UI更新
 * ・Map責務
 *      1.表示範囲⇒レイヤー取得
 *      2.クリック⇒リスクフロー
 *      3.UI表示
 ----------------------------------------*/
export type RiskFlowResult = {
  result: any | null;
  isTokyo: boolean;
  nearestPoint?: { lat: number; lng: number };
};

export function useRiskFlow() {
  const { fetchRisk, clearRisk } = useRiskPoint();
  const [, setUi] = useAtom(riskUiAtom);
  const [, setResult] = useAtom(riskResultAtom);
  const [, setAreaMode] = useAtom(areaModeAtom);

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

      // A-06 都外の場合
      if (!tokyoCheck.isTokyo) {
        setAreaMode("OUTSIDE_TOKYO");

        const nearest = await fetchNearestBoundary(point.lat, point.lng);

        setUi({ loading: false, error: null });

        return {
          result: null,
          isTokyo: false,
          nearestPoint: nearest.nearestPoint
        };
      }

      // 都内 → A-03
      setAreaMode("INSIDE_TOKYO");

      const result = await fetchRisk(point.lat, point.lng);

      if (!result) throw new Error("Risk fetch failed");

      setResult({
        lat: point.lat,
        lng: point.lng,
        earthquake: result.riskLevel
      });

      // --- A-06 UI更新（成功）
      setUi({ loading: false, error: null });

      return {
        result,
        isTokyo: true
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
        isTokyo: false
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
