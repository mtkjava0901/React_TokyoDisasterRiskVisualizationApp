import { useAtomValue } from "jotai";
import { riskUiAtom } from "@/atoms/riskUiAtom";
import { riskResultAtom } from "@/atoms/riskResultAtom";
import "@/styles/risk-panel.css";
import { riskLocationStatusAtom } from "@/atoms/riskLocationAtom";

/**-------------------------
 * 災害リスクパネル
 *
------------------------- */
export default function RiskResultPanel() {
  const ui = useAtomValue(riskUiAtom);
  const result = useAtomValue(riskResultAtom);
  // 状態表示テスト
  const status = useAtomValue(riskLocationStatusAtom);

  return (
    <div className="risk-panel">
      <div className="risk-panel-title">選択地点の災害リスク</div>
      {/* Loading */}
      {ui.loading && <div className="risk-panel-message">取得中...</div>}
      {/* error */}
      {ui.error && <div className="risk-panel-error">{ui.error}</div>}
      {/* 未選択 */}
      {!ui.loading && !result && (
        <div className="risk-panel-message">
          地図を移動して地点を選択してください
        </div>
      )}

      {/* 結果 */}
      {result && !ui.loading && (
        <>
          <div className="risk-item">
            <span className="risk-label">地震リスク</span>
            <span className="risk-value">{result.earthquake}</span>
          </div>

          <div>状態: {status}</div>

          {/* Step3で住所追加予定 */}
          {/* Step4でリスク色追加予定 */}
        </>
      )}
    </div>
  );
}
