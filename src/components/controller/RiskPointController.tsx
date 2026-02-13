import { fetchNearestBoundary } from "@/api/boundaryApi";
import { fetchEarthquakeRisk } from "@/api/earthquakeRiskApi";
import { checkTokyoContains } from "@/api/tokyoAreaApi";
import { areaModeAtom } from "@/atoms/areaModeAtom";
import {
  riskLoadingAtom,
  riskPointAtom,
  selectedPointAtom
} from "@/atoms/riskPointAtom";
import { getDefaultStore } from "jotai";

/**-----------------------------------------------
 * RiskPointController：役割
 * ・入力座標を受け取る
 * ・A-05 ⇒ A-03 ⇒ A-06 を制御
 * ・atom更新
 *
 *  ※削除予定
 -----------------------------------------------*/
const store = getDefaultStore();

/**
 * リスク判定メイン処理
 */
export async function resolveRiskPoint(
  lat: number,
  lng: number
): Promise<void> {
  // 選択点保存（Markerなどで使う）
  store.set(selectedPointAtom, { lat, lng });

  // loading開始
  store.set(riskLoadingAtom, true);

  try {
    /** -----------------------------
     * A-05 東京都内判定
     ------------------------------*/
    const tokyo = await checkTokyoContains(lat, lng);

    if (!tokyo) {
      store.set(areaModeAtom, "API_ERROR");
      return;
    }

    if (!tokyo.isTokyo) {
      /** -----------------------------
       * 東京都外
       ------------------------------*/
      store.set(areaModeAtom, "OUTSIDE_TOKYO");
      store.set(riskPointAtom, null);

      // A-06 最近接境界取得（任意）
      try {
        const boundary = await fetchNearestBoundary(lat, lng);

        // 必要ならここで別atomに保存
        // store.set(nearestBoundaryAtom, boundary);
      } catch (e) {
        console.warn("boundary fetch failed", e);
      }

      return;
    }

    /** -----------------------------
     * 東京都内
     ------------------------------*/
    store.set(areaModeAtom, "INSIDE_TOKYO");

    /** -----------------------------
     * A-03 地震リスク1点判定
     ------------------------------*/
    const risk = await fetchEarthquakeRisk(lat, lng);

    if (!risk) {
      store.set(areaModeAtom, "API_ERROR");
      return;
    }

    store.set(riskPointAtom, risk.riskLevel);
  } catch (error) {
    console.error("resolveRiskPoint error:", error);
    store.set(areaModeAtom, "API_ERROR");
  } finally {
    store.set(riskLoadingAtom, false);
  }
}
