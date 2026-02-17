import { useAtomValue, useSetAtom } from "jotai";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { bannerAtom } from "@/atoms/bannerAtom";
import { useEffect } from "react";

/**----------------------------------
 * Banner表示制御
 * TokyoStatusBannerの代替
----------------------------------*/
export default function BannerController() {
  const areaMode = useAtomValue(areaModeAtom);
  const trigger = useAtomValue(locationTriggerAtom);

  // 現在のBanner状態取得
  const currentBanner = useAtomValue(bannerAtom);
  const setBanner = useSetAtom(bannerAtom);

  useEffect(() => {
    if (!areaMode) return;

    // Confirm表示中は上書きしない
    if (currentBanner.visible && currentBanner.type === "confirm") {
      return;
    }

    /**------------------
     * APIエラー
    ------------------*/
    if (areaMode === "API_ERROR") {
      setBanner({
        visible: true,
        type: "error",
        message: "⚠判定処理でエラーが発生しました。",
        duration: 4000,
        countdown: true
      });
      return;
    }

    /**------------------
     * 未対応エリア
    ------------------*/
    if (areaMode === "UNSUPPORTED_AREA") {
      setBanner({
        visible: true,
        type: "error",
        message: "⚠この地点は対応エリア外です。",
        duration: 4000
      });
      return;
    }

    /**----------------------
     * 都内
     ----------------------*/
    if (areaMode === "INSIDE_TOKYO") {
      setBanner({ visible: false });
      return;
    }

    /**------------------
     * 都外
    ------------------*/
    if (areaMode === "OUTSIDE_TOKYO") {
      const messageMap = {
        ADDRESS_SEARCH: "⚠この地点は東京都外です。",
        CURRENT_LOCATION: "⚠現在地は東京都外です。",
        MAP_CLICK: "⚠この地点は東京都外です。"
      } as const;

      setBanner({
        visible: true,
        type: "outside",
        message: messageMap[trigger] ?? messageMap.MAP_CLICK
        // duration: 3000
      });

      return;
    }

    /**------------------
     * 境界付近
    ------------------*/
    if (areaMode === "BOUNDARY") {
      setBanner({
        visible: true,
        type: "boundary",
        message: "⚠東京都の境界付近です。",
        duration: 2500
      });
    }
  }, [areaMode, trigger, setBanner]);

  return null;
}
