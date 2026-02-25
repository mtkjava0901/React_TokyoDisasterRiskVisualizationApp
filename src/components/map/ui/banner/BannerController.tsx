import { useAtomValue, useSetAtom } from "jotai";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { bannerAtom } from "@/atoms/bannerAtom";
import { locationAtom } from "@/atoms/locationAtom";
import { useEffect } from "react";
import { fetchNearestBoundary } from "@/api/boundaryApi";
import { useMapController } from "@/hooks/map/useMapController";
import { useSetAtom as useJotaiSetAtom } from "jotai";
import { locationAtom as locAtom } from "@/atoms/locationAtom";
import { locationTriggerAtom as trigAtom } from "@/atoms/locationTriggerAtom";
/**----------------------------------
 * Banner表示制御（一本化）
 *
 * すべてのバナー表示ロジックをここに集約。
 * useLocationController / useAutoRiskController からは
 * バナー呼び出しを行わない。
 *
 * 表示ルール：
 * - OUTSIDE_TOKYO + ADDRESS_SEARCH  → confirm「境界まで移動しますか？」（永続）
 * - OUTSIDE_TOKYO + その他          → error「情報を表示できません」（永続）
 * - INSIDE_TOKYO / BOUNDARY         → バナー非表示
 * - API_ERROR                       → error（4秒）
----------------------------------*/
export default function BannerController() {
  const areaMode = useAtomValue(areaModeAtom);
  const trigger = useAtomValue(locationTriggerAtom);
  const location = useAtomValue(locationAtom);
  const setBanner = useSetAtom(bannerAtom);
  const { moveMap } = useMapController();
  const setLocation = useJotaiSetAtom(locAtom);
  const setTrigger = useJotaiSetAtom(trigAtom);
  useEffect(() => {
    if (!areaMode) return;
    if (areaMode === "API_ERROR") {
      setBanner({
        visible: true,
        type: "error",
        message: "⚠ 判定処理でエラーが発生しました。",
        duration: 4000,
        countdown: true
      });
      return;
    }
    if (areaMode === "UNSUPPORTED_AREA") {
      setBanner({
        visible: true,
        type: "error",
        message: "⚠ この地点は対応エリア外です。",
        duration: 4000
      });
      return;
    }
    // 都内 / 境界付近 → バナー非表示
    if (areaMode === "INSIDE_TOKYO" || areaMode === "BOUNDARY") {
      setBanner({ visible: false });
      return;
    }
    // 都外
    if (areaMode === "OUTSIDE_TOKYO") {
      // 住所検索の場合: confirm「境界まで移動しますか？」（永続）
      if (trigger === "ADDRESS_SEARCH") {
        const searchedLat = location?.lat;
        const searchedLng = location?.lng;
        setBanner({
          visible: true,
          type: "confirm",
          message: "⚠ 東京都外です。境界まで移動しますか？",
          confirmLabel: "移動する",
          cancelLabel: "このまま表示",
          // duration なし = 永続表示
          onConfirm: async () => {
            if (searchedLat == null || searchedLng == null) return;
            try {
              const nearest = await fetchNearestBoundary(
                searchedLat,
                searchedLng
              );
              if (nearest?.nearestPoint) {
                moveMap(nearest.nearestPoint, 13);
                setLocation(nearest.nearestPoint);
                setTrigger("MAP_CLICK");
              }
            } catch (e) {
              console.error("boundary move error", e);
            }
          },
          onCancel: () => {
            // このまま表示（バナーはボタンクリックで閉じる）
          }
        });
        return;
      }
      // 現在地 / MAP移動の場合: error「情報を表示できません」（永続）
      setBanner({
        visible: true,
        type: "error",
        message: "⚠ 東京都外です。情報を表示できません。"
        // duration なし = 永続表示
      });
      return;
    }
  }, [
    areaMode,
    trigger,
    location,
    setBanner,
    moveMap,
    setLocation,
    setTrigger
  ]);
  return null;
}
