import { atom } from "jotai";
import { TokyoContainsResponse } from "@/api/tokyoAreaApi";

/**-------------------
 * 東京エリアの状態管理
 -------------------*/
export const tokyoAreaAtom = atom<TokyoContainsResponse | null>(null);
