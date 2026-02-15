import { LocationResult } from "@/types/location";

/**------------------------------------
 * 現在地取得hook
 *
 * 役割：
 * ・ブラウザGeolocationラップ
 * ・Promise化
 * ・型統一(LocationResult)
 ------------------------------------*/
export function useCurrentLocation() {
  const getCurrentLocation = (): Promise<LocationResult> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            label: "現在地"
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000
        }
      );
    });
  };

  return { getCurrentLocation };
}