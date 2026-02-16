/**---------------
 * 状態&原因を分離
 ---------------*/
// 状態
export type RiskLocationStatus = "INSIDE" | "BOUNDARY" | "OUTSIDE";

// 原因
export type RiskTrigger = "MAP_MOVE" | "SEARCH" | "GEOLOCATION" | "INIT";
