import { useAtomValue } from "jotai";
import { riskUiAtom } from "@/atoms/riskUiAtom";
import { riskResultAtom } from "@/atoms/riskResultAtom";
import "@/styles/risk-panel.css";
import { riskLocationStatusAtom } from "@/atoms/riskLocationAtom";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { riskPanelViewModelAtom } from "@/atoms/riskPanelViewModelAtom";
import { getRiskClass } from "@/utils/riskStyle";

/**-------------------------
 * 災害リスクパネル
 *
------------------------- */
export default function RiskResultPanel() {
  const ui = useAtomValue(riskUiAtom);
  const result = useAtomValue(riskResultAtom);
  // 状態表示テスト
  const status = useAtomValue(riskLocationStatusAtom);
  const areaMode = useAtomValue(areaModeAtom);

  const vm = useAtomValue(riskPanelViewModelAtom);
  if (!vm) return null;

  console.log("vm", vm);
  /**----------------------
   * 都外 ⇒ 非表示
   ----------------------*/
  if (areaMode === "OUTSIDE_TOKYO") return null;

  if (!result && ui.loading) return null;

  return (
    <div className="risk-panel">
      <div className="risk-panel-title">選択地点の災害リスク</div>
      {/* Loading */}
      {ui.loading && <div className="risk-panel-message">取得中...</div>}
      {/* error */}
      {ui.error && <div className="risk-panel-error">{ui.error}</div>}
      {/* 未選択 */}
      {!ui.loading && !vm && (
        <div className="risk-panel-message">
          地図を移動して地点を選択してください
        </div>
      )}

      {/* 結果 */}
      {vm && !ui.loading && (
        <>
          {/* リスクレベル */}
          <div className="risk-item">
            <span className="risk-label">地震リスク</span>
            {/* <span
              className={`risk-value risk-${result.earthquake?.toLowerCase()}`}
            > */}
            <span className={`risk-value ${getRiskClass(vm.riskLevel)}`}>
              {vm.riskLevel ?? "-"}
            </span>
          </div>

          {/* 住所 */}
          <div className="risk-item">
            <span className="risk-label">住所</span>
            {/* <span className="risk-value">{result.address ?? "-"}</span> */}
            <span className="risk-value">{vm.address ?? "-"}</span>
          </div>

          {/* ズームレベル */}
          <div className="risk-item">
            <span className="risk-label">ズームレベル</span>
            {/* <span className="risk-value">{result.zoomLevel ?? "-"}</span> */}
            <span className="risk-value">{vm.zoomLabel ?? "-"}</span>
          </div>

          {/* 想定震度 */}
          <div className="risk-item">
            <span className="risk-label">想定値</span>
            {/* <span className="risk-value">{result.intensity ?? "-"}</span> */}
            <span className="risk-value">{vm.hazardValue ?? "-"}</span>
          </div>

          {/* 最終更新 */}
          <div className="risk-item">
            <span className="risk-label">最終更新</span>
            {/* <span className="risk-value">{result.updatedAt ?? "-"}</span> */}
            <span className="risk-value">{vm.updatedAt ?? "-"}</span>
          </div>

          {/* 後に削除 */}
          <div>状態: {status}</div>
        </>
      )}
    </div>
  );
}
