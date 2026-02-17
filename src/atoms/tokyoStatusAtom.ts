import { atom } from "jotai";

export type TokyoStatus = "INSIDE" | "BOUNDARY" | "OUTSIDE";

export const tokyoStatusAtom = atom<TokyoStatus>("INSIDE");
