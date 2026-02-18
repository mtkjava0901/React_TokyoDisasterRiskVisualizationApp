/**--------------------------------
 * Google Geocoder
 * ・Geocodeを返すカスタムフック
 --------------------------------*/
export function useReverseGeocode() {
  async function getAddress(lat: number, lng: number): Promise<string> {
    if (!window.google) return "";

    const geocoder = new google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode(
        { location: { lat, lng }, language: "ja" },
        (results, status) => {
          // 失敗時を先に排除
          if (status !== "OK" || !results || !results[0]) {
            resolve("");
            return;
          }

          // ここから下は results[0] が必ず存在
          const components = results[0].address_components;

          const find = (type: string) =>
            components.find((c) => c.types.includes(type))?.long_name ?? "";

          const prefecture = find("administrative_area_level_1");
          const city = find("locality") || find("administrative_area_level_2");

          const place =
            components.find((c) => c.types.includes("establishment"))
              ?.long_name ?? "";

          resolve(
            place ? `${prefecture}${city} ${place}` : `${prefecture}${city}`
          );
        }
      );
    });
  }

  return { getAddress };
}
