import { atom } from "jotai";
import { locationAtom } from "./locationAtom";

/**------------------
 * Address用atom (Derived(派生) Atom化)
 ------------------*/
// export const addressAtom = atom<string>("");
export const addressAtom = atom(async (get) => {
  const location = get(locationAtom);
  if (!location) return "";

  if (!window.google) return "";

  const geocoder = new google.maps.Geocoder();

  return new Promise<string>((resolve) => {
    geocoder.geocode({ location }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        resolve(results[0].formatted_address);
      } else {
        resolve("");
      }
    });
  });
});
