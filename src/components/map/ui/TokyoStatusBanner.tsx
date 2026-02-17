import "@/styles/StatusBanner.css";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { useAtom, useAtomValue } from "jotai";
import { riskLocationStatusAtom } from "@/atoms/riskLocationAtom";

/**------------------------------
 *
 * 東京都内/都外バナー表示用UI
 *
 * INSIDE：非表示
 * BOUNDARY：黄
 * OUTSIDE：赤
 ------------------------------*/
export default function TokyoStatusBanner() {
  // 0217停止
  // const [areaMode] = useAtom(areaModeAtom);
  const areaMode = useAtomValue(areaModeAtom);
  const locationStatus = useAtomValue(riskLocationStatusAtom);

  /**----------------------
   * APIエラー
   ----------------------*/
  if (areaMode === "UNSUPPORTED_AREA") {
    return (
      <div className="tokyo-banner error">⚠この地点は対応エリア外です。</div>
    );
  }

  /**---------------------
    * 都外
    ---------------------*/
  if (areaMode === "OUTSIDE_TOKYO") {
    return (
      <div className="tokyo-banner outside">
        ⚠この地点は東京都外のため、情報を表示できません。
      </div>
    );
  }

  /**---------------------
    * 境界付近
    ---------------------*/
  if (locationStatus === "BOUNDARY") {
    return (
      <div className="tokyo-banner boundary">
        ⚠この地点は東京都外のため、情報を表示できません。
      </div>
    );
  }

  /**-----------------------
   * 通常（非表示）
   -----------------------*/
  return null;
}
