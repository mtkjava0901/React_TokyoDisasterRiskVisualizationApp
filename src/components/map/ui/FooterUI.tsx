import "@styles/footer.css";
import { useAtomValue } from "jotai";
import { activeLayerAtom } from "../../../atoms/activeLayerAtom";
/**-------------------
 * フッターUI
 -------------------*/
export default function FooterUI() {
  const activeLayer = useAtomValue(activeLayerAtom);

  if (activeLayer === "map") return null;

  const sourceText =
    activeLayer === "earthquake"
      ? "出典：東京都オープンデータ"
      : "出典：国土交通省 国土数値情報";

  return <footer className="map-footer">{sourceText}</footer>;
}
