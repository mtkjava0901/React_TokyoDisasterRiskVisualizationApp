import { atom } from "jotai";
import type { LocationTrigger } from "@/hooks/location/useLocationController";

/**-------------------
 * Trigger保存用atom
------------------- */
export const locationTriggerAtom = atom<LocationTrigger>("MAP_CLICK");
