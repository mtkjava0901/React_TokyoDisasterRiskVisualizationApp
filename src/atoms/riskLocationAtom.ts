import { atom } from "jotai";
import {
  RiskLocationStatus,
  RiskTrigger
} from "@/domain/risk/riskLocationStatus";

export const riskLocationStatusAtom = atom<RiskLocationStatus>("INSIDE");

export const riskTriggerAtom = atom<RiskTrigger>("INIT");

/** 境界までの距離(m) */
export const distanceToTokyoAtom = atom<number | null>(null);
