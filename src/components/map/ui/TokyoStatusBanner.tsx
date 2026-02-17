import "@/styles/StatusBanner.css";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { riskLocationStatusAtom } from "@/atoms/riskLocationAtom";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { useEffect } from "react";

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
  // const locationStatus = useAtomValue(riskLocationStatusAtom);
  const trigger = useAtomValue(locationTriggerAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);

  /**--------------------------------
   * OUTSIDE:1回表示後にtriggerリセット
  --------------------------------*/
  useEffect(() => {
    if (areaMode === "OUTSIDE_TOKYO") {
      const id = setTimeout(() => {
        setTrigger("MAP_CLICK");
      }, 0);

      return () => clearTimeout(id);
    }
  }, [areaMode, setTrigger]);

  // if (areaMode === "OUTSIDE_TOKYO") {
  //   const messageMap = {
  //     ADDRESS_SEARCH: "⚠東京都外のため、最寄りの東京都境界へ移動しました。",
  //     CURRENT_LOCATION: "⚠現在地は東京都外のためリスク情報を表示できません。",
  //     MAP_CLICK: "⚠この地点は東京都外です。"
  //   } as const;

  //   const message = messageMap[trigger] ?? messageMap.MAP_CLICK;

  //   // 表示後にリセット(1回表示)
  //   setTimeout(() => setTrigger("MAP_CLICK"), 0);

  //   return <div className="tokyo-banner outside">{message}</div>;
  // }

  /**----------------------
   * APIエラー
   ----------------------*/
  if (areaMode === "API_ERROR") {
    return (
      <div className="tokyo-banner error">
        ⚠判定処理でエラーが発生しました。
      </div>
    );
  }

  /**----------------------
   * 未対応エリア
   ----------------------*/
  if (areaMode === "UNSUPPORTED_AREA") {
    return (
      <div className="tokyo-banner error">⚠この地点は対応エリア外です。</div>
    );
  }

  /**------------------------
   * 都外(trigger別メッセージ)
   ------------------------*/
  if (areaMode === "OUTSIDE_TOKYO") {
    const messageMap = {
      ADDRESS_SEARCH: "⚠東京都外のため、最寄りの東京都境界へ移動しました。",
      CURRENT_LOCATION: "⚠現在地は東京都外のためリスク情報を表示できません。",
      MAP_CLICK: "⚠この地点は東京都外です。"
    } as const;

    const message = messageMap[trigger] ?? messageMap.MAP_CLICK;

    return <div className="tokyo-banner outside">{message}</div>;
  }

  /**---------------------------
   * 境界付近
   ---------------------------*/
  if (areaMode === "BOUNDARY") {
    return <div className="tokyo-banner boundary">⚠東京都の境界付近です。</div>;
  }

  // if (locationStatus === "BOUNDARY") {
  //   return (
  //     <>
  //       <div className="tokyo-banner boundary">⚠東京都の境界付近です。</div>
  //     </>
  //   );
  // }

  /**-----------------------
   * 通常（非表示）
   -----------------------*/
  return null;
}
