import "@/styles/risk-panel.css";
import { useAtomValue } from "jotai";
import { riskUiAtom } from "@/atoms/riskUiAtom";
import { riskResultAtom } from "@/atoms/riskResultAtom";
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

  console.log("riskLevel:", vm.riskLevel);
  console.log("riskLevelLabel:", vm.riskLevelLabel);

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
            <span className="risk-label">
              {vm.disasterType === "EARTHQUAKE" ? "地震リスク" : "洪水リスク"}
            </span>
            <span className={`risk-value ${getRiskClass(vm.riskLevel)}`}>
              {vm.riskLevelLabel ?? "-"}
            </span>
          </div>

          {/* 住所 */}
          <div className="risk-item">
            <span className="risk-label">対象地域</span>
            <span className="risk-value">{vm.address ?? "-"}</span>
          </div>

          {/* ズームレベル */}
          <div className="risk-item">
            <span className="risk-label">表示範囲</span>
            <span className="risk-value">{vm.zoomLabel ?? "-"}</span>
          </div>

          {/* 想定震度 */}
          <div className="risk-item">
            <span className="risk-label">
              {vm.disasterType === "EARTHQUAKE" ? "想定震度" : "想定浸水深"}
            </span>
            <span className="risk-value">{vm.hazardValue ?? "-"}</span>
          </div>

          {/* 最終更新 */}
          <div className="risk-item">
            <span className="risk-label">最終更新</span>
            <span className="risk-value">{vm.updatedAt ?? "-"}</span>
          </div>

          {/* 後に削除/状態確認用 */}
          {/* <div>状態: {status}</div> */}
        </>
      )}
    </div>
  );
}
