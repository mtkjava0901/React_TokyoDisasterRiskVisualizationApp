import { useAtom } from "jotai";
import { earthquakeDataAtom } from "../../atoms/earthquakeDataAtom";
import { Polygon } from "@react-google-maps/api";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";

/**----------------------------------------
 * earthquakeDataAtomを読み込み、
 * MapViewのchildrenとして描画する
 ----------------------------------------*/
export default function EarthquakeLayer() {
  const [earthquakes] = useAtom(earthquakeDataAtom);

  if (earthquakes.length === 0) return null;

  // 仮ポリゴン用
  const [bounds] = useAtom(mapBoundsAtom);

  if (!bounds) return null;
  if (earthquakes.length === 0) return null;

  // 仮ポリゴン（表示範囲）
  const paths = [
    { lat: bounds.minLat, lng: bounds.minLng },
    { lat: bounds.minLat, lng: bounds.maxLng },
    { lat: bounds.maxLat, lng: bounds.maxLng },
    { lat: bounds.maxLat, lng: bounds.minLng }
  ];

  return (
    <>
      {earthquakes.map((eq) => (
        <Polygon
          key={eq.meshCode}
          paths={paths}
          options={{
            fillColor: "red",
            fillOpacity: 0.3,
            strokeOpacity: 0
          }}
        />
      ))}
    </>
  );
}
