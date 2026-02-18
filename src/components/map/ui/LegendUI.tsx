import "@styles/LegendUI.css";
import { useAtomValue } from "jotai";
import { activeLayerAtom } from "@/atoms/activeLayerAtom";
import { LEGEND_CONFIG } from "@/components/map/ui/legendConfig";

/**----------------------------------------
 * 汎用UIコンポーネント
 * (凡例 + 地震/洪水で切替)
 ----------------------------------------*/
export default function LegendUI() {
  const activeLayer = useAtomValue(activeLayerAtom);

  if (activeLayer === "map") return null;

  const config = LEGEND_CONFIG[activeLayer];
  if (!config) return null;

  return (
    <div className="legend">
      <div className="legend-title">{config.title}</div>

      <ul className="legend-list">
        {config.items.map((item) => (
          <li key={item.key}>
            <span
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
