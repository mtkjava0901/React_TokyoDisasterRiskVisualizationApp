import { useAtom } from "jotai";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";

import "../../styles/header.css";
import "../../styles/style.css";
import { useState } from "react";
import { useLocationController } from "@/hooks/location/useLocationController";

/**-------------------------
 * Headerパーツ
 -------------------------*/
export default function Header() {
  const [activeLayer, setActiveLayer] = useAtom(activeLayerAtom);

  // 住所入力
  const [address, setAddress] = useState("");
  // Location操作
  const { searchAddress, moveToCurrentLocation } = useLocationController();

  // Layer toggle Earthquake
  const toggleEarthquake = () => {
    setActiveLayer((prev) => (prev === "earthquake" ? null : "earthquake"));
  };

  // Layer toggle Flood
  const toggleFlood = () => {
    setActiveLayer((prev) => (prev === "flood" ? null : "flood"));
  };

  // 住所検索
  const handleSearch = async () => {
    if (!address.trim()) return;

    const result = await searchAddress(address);

    if (!result) {
      alert("住所が見つかりません");
      return;
    }

    setAddress("");
  };

  // Enterで検索
  const handlekeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="header">
      {/* 左 */}
      <div className="header-left">
        <input
          className="search-input"
          placeholder="住所・駅名・地名を入力"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handlekeyDown}
        />

        <button
          className="icon-button"
          title="現在地"
          onClick={moveToCurrentLocation}
        >
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
