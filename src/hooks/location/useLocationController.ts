import { useCallback } from "react";
import { useRiskFlow } from "../useRiskFlow";
import { useCurrentLocation } from "./useCurrentLocation";
import { useMapController } from "../map/useMapController";
import useGeocoding from "../useGeocoding";

/**-------------------------------------------------
 * Location統合Controller
 *
 * 責務：
 * ・現在地検索
 * ・住所検索
 * ・Mapクリック
 * ・Map移動
 * ・RiskFlow実行
*
* UI ⇒ Location ⇒ Map/Risk の司令塔役
-------------------------------------------------*/
export function useLocationController() {
  // 現在地取得
  const { getCurrentLocation } = useCurrentLocation();
  // リスク処理
  const { runRiskFlow } = useRiskFlow();
  // Map状態更新
  const { moveMap } = useMapController();
  // 住所 ⇒ 座標変換
  const { geocode } = useGeocoding();

  /**----------------------------------
  * 共通：
  * ・座標 ⇒ Map移動 ⇒ Risk
  * ・全てここを通す
  ----------------------------------*/
  const runLocationFlow = useCallback(
    async (lat: number, lng: number, zoom?: number) => {
      try {
        // Map移動 + Risk並列
        const [_, flow] = await Promise.all([
          Promise.resolve(moveMap({ lat, lng }, zoom)),
          runRiskFlow(lat, lng)
        ]);

        // 東京都外なら最近接へ
        if (!flow.isTokyo && flow.nearestPoint) {
          moveMap(flow.nearestPoint, zoom);
        }

        return flow;
      } catch (err) {
        console.error("[runLocationFlow]", err);
        return null;
      }
    },
    [moveMap, runRiskFlow]
  );

  /**----------------------------------
  * 現在地へ移動
  ----------------------------------*/
  const moveToCurrentLocation = useCallback(async () => {
    const location = await getCurrentLocation();
    if (!location) return null;

    const { lat, lng } = location;

    // Map移動+Risk並列
    // const [_, flow] = await Promise.all([
    //   Promise.resolve(moveMap({ lat, lng }, 13)),
    //   runRiskFlow(lat, lng)
    // ]);

    // 都外なら最近接へ
    // if (!flow.isTokyo && flow.nearestPoint) {
    //   moveMap(flow.nearestPoint, 13);
    // }

    await runLocationFlow(lat, lng, 13);

    return location;
  }, [getCurrentLocation, runLocationFlow]);

  /**----------------------------------
   * 住所検索 ⇒ Geocode ⇒ Flow
   ----------------------------------*/
  const searchAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) return null;

      const loc = await geocode(address);
      if (!loc) return null;

      await runLocationFlow(loc.lat, loc.lng, 15);

      return loc;
    },
    [geocode, runLocationFlow]
  );

  // const geocodeAddress = async (
  //   address: string
  // ): Promise<google.maps.GeocoderResult[]> => {
  //   if (!address.trim()) return [];

  //   const geocoder = new google.maps.Geocoder();

  //   try {
  //     // Promise形式で直接awaitできる
  //     const { results } = await geocoder.geocode({ address });

  //     return results ?? [];
  //   } catch (err) {
  //     console.error("[geocodeAddress]", err);
  //     throw err;
  //   }
  // };

  /*----------------------------------
   * 住所検索 → Map移動 → Risk
  ----------------------------------*/
  // const searchAddress = useCallback(
  //   async (address: string) => {
  //     if (!address.trim()) return null;
  //     try {
  //       const results = await geocodeAddress(address);
  //       if (!results.length) return null;
  //       const loc = results[0].geometry.location;
  //       const lat = loc.lat();
  //       const lng = loc.lng();
  //       // 並列実行
  //       // アニメーション中にAPIが終わっていれば即座に結果を表示できる
  //       const [_, flow] = await Promise.all([
  //         Promise.resolve(moveMap({ lat, lng }, 15)),
  //         runRiskFlow(lat, lng)
  //       ]);

  //       if (!flow.isTokyo && flow.nearestPoint) {
  //         moveMap(flow.nearestPoint, 15);
  //       }

  //       return { lat, lng };
  //     } catch (err) {
  //       console.error("[searchAddress]", err);
  //       return null;
  //     }
  //   },
  //   [runRiskFlow, moveMap]
  // );

  /*----------------------------------
   Mapクリック → Flow
  ----------------------------------*/
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      // 並列実行
      // const [_, flow] = await Promise.all([
      //   Promise.resolve(moveMap({ lat, lng })),
      //   runRiskFlow(lat, lng)
      // ]);

      // if (!flow.isTokyo && flow.nearestPoint) {
      //   moveMap(flow.nearestPoint);
      // }
      await runLocationFlow(lat, lng);
    },
    [runLocationFlow]
  );

  /**----------------------------------
   * Map移動共通（Promise化）(未使用予定)
  ----------------------------------*/
  // const smoothPan = useCallback(
  //   (lat: number, lng: number): Promise<void> => {
  //     return new Promise((resolve) => {
  //       // mapRefがない場合即修了
  //       if (!mapRef?.current) {
  //         console.log("mapRef null → 移動スキップ");
  //         resolve();
  //         return;
  //       }

  //       console.log("moving map");

  //       const map = mapRef.current;
  //       const start = map.getCenter();

  //       // 中心が取れない場合も終了
  //       if (!start) {
  //         resolve();
  //         return;
  //       }

  //       const startLat = start.lat();
  //       const startLng = start.lng();

  //       const steps = 20; // なめらかさ
  //       const duration = 300; // ms
  //       let i = 0;

  //       const animate = () => {
  //         i++;
  //         const progress = i / steps;

  //         const nextLat = startLat + (lat - startLat) * progress;
  //         const nextLng = startLng + (lng - startLng) * progress;

  //         map.panTo({ lat: nextLat, lng: nextLng });

  //         if (i < steps) {
  //           setTimeout(animate, duration / steps);
  //         } else {
  //           // アニメーション完了
  //           console.log("moving map done");
  //           resolve();
  //         }
  //       };

  //       animate();
  //     });
  //   },
  //   [mapRef]
  // );

  return {
    moveToCurrentLocation,
    searchAddress,
    handleMapClick
  };
}
