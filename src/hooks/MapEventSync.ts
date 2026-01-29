import { useAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../atoms/mapAtom";
import { mapBoundsAtom } from "../atoms/mapBoundsAtom";
import { RefObject } from "react";

/**------------------------------------------------------------------
 * Mapのイベントをstateに反映するカスタムフック
 * ・onIdle
 * ・onBoundsChanged
 * ・onZoomChanged
 * 「Map ⇒ atom」の一方向同期
------------------------------------------------------------------ */
type UseMapEventSyncProps = {
  mapRef: RefObject<google.maps.Map | null>;
};

export default function MapEventSync({ mapRef }: UseMapEventSyncProps) {
  const [, setCenter] = useAtom(mapCenterAtom);
  const [, setZoom] = useAtom(mapZoomAtom);
  const [, setBounds] = useAtom(mapBoundsAtom);

  const onIdle = () => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bounds = map.getBounds();

    if (!center || zoom == null || !bounds) return;

    const nextCenter = {
      lat: center.lat(),
      lng: center.lng()
    };

    setCenter((prev) => {
      if (!prev) return nextCenter;

      return prev.lat === nextCenter.lat && prev.lng === nextCenter.lng
        ? prev
        : nextCenter;
    });

    setZoom((prev) => (prev === zoom ? prev : zoom));

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const nextBounds = {
      minLat: sw.lat(),
      maxLat: ne.lat(),
      minLng: sw.lng(),
      maxLng: ne.lng()
    };

    setBounds((prev) => {
      if (!prev) return nextBounds;

      const same =
        prev.minLat === nextBounds.minLat &&
        prev.maxLat === nextBounds.maxLat &&
        prev.minLng === nextBounds.minLng &&
        prev.maxLng === nextBounds.maxLng;

      return same ? prev : nextBounds;
    });
  };

  return { onIdle };
}
