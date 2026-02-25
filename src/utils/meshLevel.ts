import { MeshLevel } from "../types/MeshLevel";

export function getMeshLevelByZoom(zoom: number): MeshLevel {
  if (zoom <= 9) {
    return "PRIMARY";
  }
  if (zoom <= 12) {
    return "SECONDARY";
  }
  return "TERTIARY";
}
