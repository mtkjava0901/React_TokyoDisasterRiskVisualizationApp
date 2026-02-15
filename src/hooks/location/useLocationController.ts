import { useCallback } from "react";
import { useRiskFlow } from "../useRiskFlow";
import { useCurrentLocation } from "./useCurrentLocation";

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
 * MapContainerを薄くするための整理層
 -------------------------------------------------*/
export function useLocationController(
  mapRef?: React.RefObject<google.maps.Map | null>
) {
  // 現在地取得
  const { getCurrentLocation } = useCurrentLocation();
  // リスク処理
  const { runRiskFlow } = useRiskFlow();

  /**----------------------------------
   * Map移動共通（Promise化）
   ----------------------------------*/
  const smoothPan = useCallback(
    (lat: number, lng: number): Promise<void> => {
      return new Promise((resolve) => {
        // mapRefがない場合即修了
        if (!mapRef?.current) {
          console.log("mapRef null → 移動スキップ");
          resolve();
          return;
        }

        console.log("moving map");

        const map = mapRef.current;
        const start = map.getCenter();

        // 中心が取れない場合も終了
        if (!start) {
          resolve();
          return;
        }

        const startLat = start.lat();
        const startLng = start.lng();

        const steps = 20; // なめらかさ
        const duration = 300; // ms
        let i = 0;

        const animate = () => {
          i++;
          const progress = i / steps;

          const nextLat = startLat + (lat - startLat) * progress;
          const nextLng = startLng + (lng - startLng) * progress;

          map.panTo({ lat: nextLat, lng: nextLng });

          if (i < steps) {
            setTimeout(animate, duration / steps);
          } else {
            // アニメーション完了
            console.log("moving map done");
            resolve();
          }
        };

        animate();
      });
    },
    [mapRef]
  );

  /**----------------------------------
 * 現在地へ移動
----------------------------------*/
  const moveToCurrentLocation = useCallback(async () => {
    try {
      if (!mapRef?.current) return null;
      // 1. 現在地取得 (ここはawait必須)
      //    UX向上のため、ここでLoading表示を出しても良い
      const location = await getCurrentLocation();
      const { lat, lng } = location;
      // 2. 移動 & Risk取得 (並列実行)
      //    移動が終わるのとAPIが返ってくるのを同時に待つ
      console.log("Start: Pan & API");

      const [_, flow] = await Promise.all([
        smoothPan(lat, lng), // リクエスト直後に移動開始
        runRiskFlow(lat, lng) // 移動中に裏でAPIコール
      ]);
      console.log("Finish: Pan & API", flow);
      // 3. 東京都外なら最近接へ再移動
      //    (ここもsmoothPanをawaitしてもしなくても良いが、UX的にはawaitした方が丁寧)
      if (!flow.isTokyo && flow.nearestPoint) {
        await smoothPan(flow.nearestPoint.lat, flow.nearestPoint.lng);
      }
      return { lat, lng };
    } catch (err) {
      console.error("[moveToCurrentLocation]", err);
      return null;
    }
  }, [getCurrentLocation, runRiskFlow, mapRef, smoothPan]);

  // const moveToCurrentLocation = useCallback(async () => {
  //   try {
  //     if (!mapRef?.current) {
  //       console.log("mapRef null ⇒ 移動できない");
  //       return null;
  //     }

  //     // ★ここを既存hookに変更
  //     const location = await getCurrentLocation();

  //     const lat = location.lat;
  //     const lng = location.lng;

  //     // 1. まず移動
  //     smoothPan(lat, lng);

  //     // 2. UX待機
  //     await new Promise((r) => setTimeout(r, 300));

  //     // 3. Risk取得
  //     const flow = await runRiskFlow(lat, lng);
  //     console.log("flow =", flow);

  //     // 4. 東京都外なら最近接へ
  //     if (!flow.isTokyo && flow.nearestPoint) {
  //       smoothPan(flow.nearestPoint.lat, flow.nearestPoint.lng);
  //     }

  //     return { lat, lng };
  //   } catch (err) {
  //     console.error("[moveToCurrentLocation]", err);
  //     return null;
  //   }
  // }, [getCurrentLocation, runRiskFlow, mapRef]);

  /**----------------------------------
   * Geocoder
   ----------------------------------*/
  const geocodeAddress = (address: string) =>
    new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
      try {
        const geocoder = new google.maps.Geocoder();

        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK" && results) resolve(results);
          else reject(new Error(status));
        });
      } catch (err) {
        reject(err);
      }
    });

  //   const geocodeAddress = (address: string) =>
  //     new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
  //       try {
  //         const geocoder = new google.maps.Geocoder();

  //         geocoder.geocode({ address }, (results, status) => {
  //           if (status === "OK" && results) {
  //             resolve(results);
  //           } else {
  //             reject(new Error(status));
  //           }
  //         });
  //       } catch (err) {
  //         reject(err);
  //       }
  //     });

  /*----------------------------------
   住所検索 → Map移動 → Risk
  ----------------------------------*/
  const searchAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) return null;
      try {
        const results = await geocodeAddress(address);
        if (!results.length) return null;
        const loc = results[0].geometry.location;
        const lat = loc.lat();
        const lng = loc.lng();
        // 並列実行
        // アニメーション中にAPIが終わっていれば即座に結果を表示できる
        const [_, flow] = await Promise.all([
          smoothPan(lat, lng),
          runRiskFlow(lat, lng)
        ]);
        if (!flow.isTokyo && flow.nearestPoint) {
          await smoothPan(flow.nearestPoint.lat, flow.nearestPoint.lng);
        }
        return { lat, lng };
      } catch (err) {
        console.error("[searchAddress]", err);
        return null;
      }
    },
    [runRiskFlow, mapRef, smoothPan]
  );

  // const searchAddress = useCallback(
  //   async (address: string) => {
  //     if (!address.trim()) return null;

  //     try {
  //       const results = await geocodeAddress(address);

  //       if (!results.length) return null;

  //       const loc = results[0].geometry.location;
  //       const lat = loc.lat();
  //       const lng = loc.lng();

  //       // 1. まず移動
  //       smoothPan(lat, lng);

  //       // 2.待機
  //       await new Promise((r) => setTimeout(r, 300));

  //       // 3. Risk判定
  //       const flow = await runRiskFlow(lat, lng);

  //       // 東京都外なら最近接へ
  //       if (!flow.isTokyo && flow.nearestPoint) {
  //         smoothPan(flow.nearestPoint.lat, flow.nearestPoint.lng);
  //       }

  //       return { lat, lng };
  //     } catch (err) {
  //       console.error("[searchAddress]", err);
  //       return null;
  //     }
  //   },
  //   [runRiskFlow, mapRef]
  // );

  /*----------------------------------
   Mapクリック → Risk
  ----------------------------------*/
  const handleMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      // 並列実行
      const [_, flow] = await Promise.all([
        smoothPan(lat, lng),
        runRiskFlow(lat, lng)
      ]);
      if (!flow.isTokyo && flow.nearestPoint) {
        await smoothPan(flow.nearestPoint.lat, flow.nearestPoint.lng);
      }
    },
    [runRiskFlow, mapRef, smoothPan]
  );

  // const handleMapClick = useCallback(
  //   async (e: google.maps.MapMouseEvent) => {
  //     if (!e.latLng) return;

  //     const lat = e.latLng.lat();
  //     const lng = e.latLng.lng();

  //     // クリック地点へまず移動（UX）
  //     smoothPan(lat, lng);

  //     const flow = await runRiskFlow(lat, lng);

  //     // 東京都外なら最近接へ
  //     if (!flow.isTokyo && flow.nearestPoint) {
  //       smoothPan(flow.nearestPoint.lat, flow.nearestPoint.lng);
  //     }
  //   },
  //   [runRiskFlow, mapRef]
  // );

  return {
    moveToCurrentLocation,
    searchAddress,
    handleMapClick
  };
}
