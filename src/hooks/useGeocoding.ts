import { useCallback } from "react";

/**------------------------
 *
 * 住所 → 座標変換カスタムフック
 *
 ------------------------*/
export default function useGeocoding() {
  const geocode = useCallback(
    async (address: string): Promise<google.maps.LatLngLiteral | null> => {
      if (!window.google) return null;

      const geocoder = new google.maps.Geocoder();

      try {
        const res = await geocoder.geocode({ address });

        if (!res.results.length) return null;

        const loc = res.results[0].geometry.location;

        return {
          lat: loc.lat(),
          lng: loc.lng()
        };
      } catch (e) {
        console.error("geocode error", e);
        return null;
      }
    },
    []
  );

  return { geocode };
}
