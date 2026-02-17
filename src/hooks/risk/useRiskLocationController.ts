import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { mapCenterAtom } from "@/atoms/mapAtom";
import {
  riskLocationStatusAtom,
  riskTriggerAtom,
  distanceToTokyoAtom
} from "@/atoms/riskLocationAtom";

import { RiskLocationStatus } from "@/domain/risk/riskLocationStatus";

// ※削除予定

/**---------------------------------------
 * 境界距離しきい値（500m）
 ---------------------------------------*/
const BOUNDARY_THRESHOLD_METER = 500;

/**---------------------------------------
 * 仮：東京都内判定
 * TODO: TokyoBoundaryに差し替え
 ---------------------------------------*/
function isInsideTokyo(lat: number, lng: number): boolean {
  // 仮バウンディング（東京付近）
  return lat >= 35.4 && lat <= 35.9 && lng >= 139.3 && lng <= 140.0;
}

/**---------------------------------------
 * 仮：境界距離計算
 * TODO: backend/Geoロジック接続
 ---------------------------------------*/
function getDistanceToTokyoBoundary(lat: number, lng: number): number {
  // 仮：中心からの距離っぽく見せるだけ
  const centerLat = 35.68;
  const centerLng = 139.76;

  const dLat = lat - centerLat;
  const dLng = lng - centerLng;

  return Math.sqrt(dLat * dLat + dLng * dLng) * 111000;
}

/**---------------------------------------------------
 * RiskLocationController
 *
 * 責務：
 * ・Map中心の都内判定
 * ・境界距離計算
 * ・INSIDE / BOUNDARY / OUTSIDE更新
 ---------------------------------------------------*/
export function useRiskLocationController() {
  const center = useAtomValue(mapCenterAtom);

  const setStatus = useSetAtom(riskLocationStatusAtom);
  const setDistance = useSetAtom(distanceToTokyoAtom);

  useEffect(() => {
    if (!center) return;

    const { lat, lng } = center;

    console.log("[RiskLocation] center", lat, lng);

    /** 都内判定 */
    const inside = isInsideTokyo(lat, lng);

    if (!inside) {
      setStatus("OUTSIDE");
      setDistance(null);
      return;
    }

    /** 境界距離 */
    const distance = getDistanceToTokyoBoundary(lat, lng);

    setDistance(distance);

    /** 境界付近判定 */
    if (distance < BOUNDARY_THRESHOLD_METER) {
      setStatus("BOUNDARY");
      return;
    }

    setStatus("INSIDE");
  }, [center, setStatus, setDistance]);
}
