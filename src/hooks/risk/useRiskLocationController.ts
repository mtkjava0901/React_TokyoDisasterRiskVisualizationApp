import { useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";

import { mapCenterAtom } from "@/atoms/mapAtom";
import {
  riskLocationStatusAtom,
  riskTriggerAtom,
  distanceToTokyoAtom
} from "@/atoms/riskLocationAtom";

import { RiskLocationStatus } from "@/domain/risk/riskLocationStatus";
import { locationAtom } from "@/atoms/locationAtom";

/**------------------------------------
 *
 * RiskLocationController
 *
 * 責務：
 * ・locationAtom監視
 * ・東京都内判定
 * ・境界距離計算
 * ・INSIDE / BOUNDARY / OUTSIDE 更新
 *
 * NOTE:
 * 現在は仮Geoロジック
 * 将来 TokyoBoundary(domain)へ置換
 *
 ------------------------------------*/

/**---------------------------------------
 * 境界距離しきい値（500m）
 ---------------------------------------*/
const BOUNDARY_THRESHOLD_METER = 500;

/**---------------------------------------
 * 仮：東京都内判定
 * TODO: TokyoBoundaryに差し替え
 ---------------------------------------*/
function isInsideTokyo(lat: number, lng: number): boolean {
  return lat >= 35.4 && lat <= 35.9 && lng >= 139.3 && lng <= 140.0;
}

/**---------------------------------------
 * 仮：境界距離計算
 * TODO: backend/Geoロジック接続
 ---------------------------------------*/
function getDistanceToTokyoBoundary(lat: number, lng: number): number {
  const centerLat = 35.68;
  const centerLng = 139.76;

  const dLat = lat - centerLat;
  const dLng = lng - centerLng;

  return Math.sqrt(dLat * dLat + dLng * dLng) * 111000;
}

/**---------------------------------------
 * Controller
 ---------------------------------------*/
export function useRiskLocationController() {
  // LocationController/MapEvent/AddressSearchなどの最終入力
  const location = useAtomValue(locationAtom);
  const setStatus = useSetAtom(riskLocationStatusAtom);
  const setDistance = useSetAtom(distanceToTokyoAtom);
  // const center = useAtomValue(mapCenterAtom);

  useEffect(() => {
    if (!location) return;

    const { lat, lng } = location;

    // console.log("[RiskLocation] center", lat, lng);

    /** 都内判定 */
    const inside = isInsideTokyo(lat, lng);

    if (!inside) {
      setStatus("OUTSIDE" as RiskLocationStatus);
      setDistance(null);
      return;
    }

    /** 境界計算距離 */
    const distance = getDistanceToTokyoBoundary(lat, lng);
    setDistance(distance);

    /** 境界付近判定 */
    if (distance < BOUNDARY_THRESHOLD_METER) {
      setStatus("BOUNDARY" as RiskLocationStatus);
      return;
    }

    /** 都内 */
    setStatus("INSIDE" as RiskLocationStatus);
  }, [location, setStatus, setDistance]);
}
