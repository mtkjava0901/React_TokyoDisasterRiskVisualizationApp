import { useAtom } from "jotai";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";
import "../../styles/header.css";
import "../../styles/style.css";

/**-------------------------
 * Headerパーツ
 -------------------------*/
export default function Header() {
  const [activeLayer, setActiveLayer] = useAtom(activeLayerAtom);

  const toggleEarthquake = () => {
    setActiveLayer((prev) => (prev === "earthquake" ? null : "earthquake"));
  };

  const toggleFlood = () => {
    setActiveLayer((prev) => (prev === "flood" ? null : "flood"));
  };

  return (
    <header className="header">
      {/* 左 */}
      <div className="header-left">
        <input
          className="search-input"
          placeholder="住所・駅名・地名を入力"
          disabled
        />
        <button className="icon-button" title="現在地">
          <i className="bi bi-geo-alt-fill" />
        </button>
      </div>

      {/* 中央 */}
      <div className="header-center">東京都災害リスク可視化アプリ</div>

      {/* 右 */}
      <div className="header-right">
        <button
          className={`layer-button ${activeLayer === "earthquake" ? "active" : ""}`}
          onClick={toggleEarthquake}
        >
          地震
        </button>

        <button
          className={`layer-button ${activeLayer === "flood" ? "active" : ""}`}
          onClick={toggleFlood}
        >
          洪水
        </button>

        <button className="readme-button">ReadMe</button>
      </div>
    </header>
  );
}
