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
    setMeshLevel(MeshLevel.TERTIARY);
  }, [zoom]);
}