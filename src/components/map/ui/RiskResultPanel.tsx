import { useAtomValue } from "jotai";
import { riskUiAtom } from "@/atoms/riskUiAtom";
import { riskResultAtom } from "@/atoms/riskResultAtom";

export default function RiskResultPanel() {
  const ui = useAtomValue(riskUiAtom);
  const result = useAtomValue(riskResultAtom);

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 80,
        width: 300,
        background: "white",
        padding: 16,
        borderLeft: "1px solid #ddd",
        boxShadow: "-2px 0 6px rgba(0,0,0,0.1)",
        zIndex: 999
      }}
    >
      <h3>リスク情報</h3>

      {ui.loading && <p>取得中...</p>}

      {ui.error && <p style={{ color: "red" }}>{ui.error}</p>}

      {!ui.loading && !result && <p>地点を選択してください</p>}

      {result && (
        <>
          <div>地震リスク: {result.earthquake}</div>
          <div>
            座標: {result.lat.toFixed(5)}, {result.lng.toFixed(5)}
          </div>
        </>
      )}
    </div>
  );
}