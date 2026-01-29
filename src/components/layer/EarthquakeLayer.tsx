import { useAtom } from "jotai";
import { earthquakeDataAtom } from "../../atoms/earthquakeDataAtom";

/**----------------------------------------
 * earthquakeDataAtomを読み込み、
 * MapViewのchildrenとして描画する
 ----------------------------------------*/
export default function EarthquakeLayer() {
  const [earthquakes] = useAtom(earthquakeDataAtom);

  if (earthquakes.length === 0) return null;

  return (
    <>
      <>{/* ここに Polygon / Overlay を描画していく */}</>
    </>
  );
}
