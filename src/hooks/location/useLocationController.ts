import useGeocoding from "../useGeocoding";
import { useCallback } from "react";
import { useCurrentLocation } from "./useCurrentLocation";
import { useSetAtom } from "jotai";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";
import { locationAtom } from "@/atoms/locationAtom";
import { useMapController } from "../map/useMapController";
import { bannerAtom } from "@/atoms/bannerAtom";
import { useRiskFlow } from "../useRiskFlow";
import { areaModeAtom } from "@/atoms/areaModeAtom";

/**-------------------------------------------------
 * Location統合Controller
 *
 * 責務：
 * ・現在地検索 / 住所検索 / Mapクリック
 * ・locationAtom / locationTriggerAtom の更新
 *
 * バナー制御は BannerController に一本化。
-------------------------------------------------*/
export type LocationTrigger =
  | "MAP_CLICK"
  | "CURRENT_LOCATION"
  | "ADDRESS_SEARCH";
export function useLocationController() {
  const { getCurrentLocation } = useCurrentLocation();
  const { geocode } = useGeocoding();
  const setLocation = useSetAtom(locationAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);
  const { moveMap } = useMapController();

  /** 住所検索 */
  const searchAddress = useCallback(
    async (address: string) => {
      if (!address.trim()) return null;
      const loc = await geocode(address);
      if (!loc) return null;
      moveMap({ lat: loc.lat, lng: loc.lng }, 13);
      setTrigger("ADDRESS_SEARCH");
      setLocation({ lat: loc.lat, lng: loc.lng });
      return loc;
    },
    [geocode, moveMap, setLocation, setTrigger]
  );

  /** 現在地ボタン */
  const moveToCurrentLocation = useCallback(async () => {
    const loc = await getCurrentLocation();
    if (!loc) return;
    moveMap({ lat: loc.lat, lng: loc.lng }, 13);
    setTrigger("CURRENT_LOCATION");
    setLocation({ lat: loc.lat, lng: loc.lng });
  }, [getCurrentLocation, moveMap, setLocation, setTrigger]);

  /** Mapクリック */
  const handleMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      setTrigger("MAP_CLICK");
      setLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    },
    [setLocation, setTrigger]
  );
  return {
    moveToCurrentLocation,
    searchAddress,
    handleMapClick
  };
}
