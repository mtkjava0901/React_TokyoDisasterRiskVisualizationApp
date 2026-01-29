import { useAtom } from "jotai";
import { useEffect } from "react";
import { mapZoomAtom } from "../../atoms/mapAtom";
import { fetchEarthquakeLayer } from "../../api/earthquakeLayerApi";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";
import { earthquakeDataAtom } from "../../atoms/earthquakeDataAtom";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";

/**------------------------------------------------------------------
 * MapBoundsAtomを監視
 * activeLayerAtomがearthquakeの時だけ動く
 * APIの取得
 * 結果をatomに格納
 * デバウンス / ガード制御
 * ⇒描画しない・UIを返さない
------------------------------------------------------------------ */
export default function EarthquakeDataController() {
  const [bounds] = useAtom(mapBoundsAtom);
  const [zoom] = useAtom(mapZoomAtom);
  const [activeLayer] = useAtom(activeLayerAtom);
  const [, setEarthquakes] = useAtom(earthquakeDataAtom);

  useEffect(() => {
    if (!bounds) return;
    if (activeLayer !== "earthquake") return;

    // 市レベル以上でのみ取得
    if (zoom < 10) return;

    const fetch = async () => {
      const data = await fetchEarthquakeLayer(
        bounds.minLat,
        bounds.maxLat,
        bounds.minLng,
        bounds.maxLng,
        zoom
      );
      setEarthquakes(data);
    };

    fetch();
  }, [bounds, zoom, activeLayer]);

  return null;
}
