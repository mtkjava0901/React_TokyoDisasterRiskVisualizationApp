import { useAtomValue } from "jotai";
import { apiLoadingAtom } from "../../atoms/loadingAtom";
import "../../styles/api-loading-overlay.css";

export default function ApiLoadingOverlay() {
  const isLoading = useAtomValue(apiLoadingAtom);

  if (!isLoading) return null;

  return (
    <div className="api-loading-overlay">
      <div className="api-loading-content">
        <div className="api-loading-spinner"></div>
        <div className="api-loading-text">
          <h4>APIサーバーを起動・データ読み込み中...</h4>
          <p>（最大数分かかる場合があります）</p>
        </div>
      </div>
    </div>
  );
}
