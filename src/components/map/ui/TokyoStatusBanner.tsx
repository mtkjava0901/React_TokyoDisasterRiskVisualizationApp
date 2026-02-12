import "@/styles/StatusBanner.css";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { useAtom } from "jotai";

/**------------------------------
 *
 * 東京都内/都外バナー表示用UI
 *
 ------------------------------*/
export default function TokyoStatusBanner() {
  const [areaMode] = useAtom(areaModeAtom);

  if (areaMode === "INSIDE_TOKYO") return null;

  const messageMap = {
    OUTSIDE_TOKYO:
      "この地点は東京都外のため、最寄りの東京都境界へ移動しました。",
    UNSUPPORTED_AREA:
      "この地点は東京都外のため、最寄りの東京都境界へ移動しました。",
    API_ERROR: "この地点は東京都外のため、最寄りの東京都境界へ移動しました。"
  } as const;

  return <div className="tokyo-banner">{messageMap[areaMode]}</div>;
}
