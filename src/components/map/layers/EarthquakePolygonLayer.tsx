import { useAtom } from "jotai";
import { earthquakeDataAtom } from "../../../atoms/earthquakeDataAtom";
import { Polygon } from "@react-google-maps/api";

/**---------------------------------------------
 * APIレスポンス(EarthquakeLayerDto)を加工せず、
 * riskLevelに応じた「見た目を決める」
 ---------------------------------------------*/
export default function EarthquakePolygonLayer() {
  const [polygonOptions] = {
    fillColor: "ff0000",
    fillOpacity: 0.4,
    strokeColor: "ff0000",
    strokeWeight: 2
  };

  const [earthquakes] = useAtom(earthquakeDataAtom);

  return (
    <>
      {earthquakes.map((eq, i) => (
        <Polygon
          key={eq.meshCode}
          paths={eq.riskLevel}
          options={polygonOptions}
        />
      ))}
    </>
  );
}
