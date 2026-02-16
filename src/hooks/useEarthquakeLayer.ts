import { fetchEarthquakeLayer } from "@/api/earthquakeLayerApi";
import { activeLayerAtom } from "@/atoms/activeLayerAtom";
import { earthquakeDataAtom } from "@/atoms/earthquakeDataAtom";
import { mapZoomAtom } from "@/atoms/mapAtom";
import { mapBoundsAtom } from "@/atoms/mapBoundsAtom";
import { meshLevelAtom } from "@/atoms/meshLevelAtom";
import { MeshLevel, resolveZoomRule } from "@/domain/map/zoomRule";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

/**----------------------
 * mesh mapping
 ----------------------*/
const meshLevelValueMap: Record<MeshLevel, number | null> = {
  NONE: null,
  PRIMARY: 4,
  SECONDARY: 6,
  TERTIARY: 8
};

/**------------------------------
 * A-01 地震ポリゴン取得hook
 *
 * 役割：
 * ・map状態監視
 * ・layer API取得
 * ・atom保存
 *
 * ※未使用予定
 ------------------------------*/
export function useEarthquakeLayer() {
  const bounds = useAtomValue(mapBoundsAtom);
  const setData = useSetAtom(earthquakeDataAtom);

  useEffect(() => {
    if (!bounds) return;

    // const meshLevel = useAtomValue(meshLevelAtom);
    const meshLevel: MeshLevel = "TERTIARY";
    const meshValue = meshLevelValueMap[meshLevel];

    if (meshValue == null) return;

    const load = async () => {
      try {
        console.log("[useEarthquakeLayer] fetch start");

        const data = await fetchEarthquakeLayer(
          bounds.minLat,
          bounds.maxLat,
          bounds.minLng,
          bounds.maxLng,
          meshValue
        );

        setData(data ?? []);
      } catch (err) {
        console.error("[useEarthquakeLayer] fetch failed", err);
        setData([]);
      }
    };

    load();
  }, [bounds, setData]);
}
