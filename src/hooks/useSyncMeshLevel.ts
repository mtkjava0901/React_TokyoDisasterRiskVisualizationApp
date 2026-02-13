import { mapZoomAtom } from "@/atoms/mapAtom";
import { meshLevelAtom } from "@/atoms/meshLevelAtom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { MeshLevel } from "@/domain/map/zoomRule";

/**----------------------------
 *
 * zoom→meshLevel 同期用hook
 *
 ----------------------------*/
export function useSyncMeshLevel() {
  const [zoom] = useAtom(mapZoomAtom);
  const [, setMeshLevel] = useAtom(meshLevelAtom);

  useEffect(() => {
    console.log("[mesh sync] force tertiary", zoom);
    setMeshLevel(MeshLevel.TERTIARY);
  }, [zoom]);
}
// 可変meshLevel(今は使わない)
// console.log("[mesh sync]", zoom, level);
// setMeshLevel(level);
