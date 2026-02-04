import { useAtomValue } from "jotai";
import { earthquakeDataAtom } from "../../../../atoms/earthquakeDataAtom";
import { mapZoomAtom } from "../../../../atoms/mapAtom";

/**---------------------------------------------------
 * ガイドUI専用コンポーネント
 * ・Polygonを描かない条件の時に理由をユーザーに伝える
 * ・API取得ロジックには触らない
 * ・Polygon描画ロジックも壊さない(完全分離)
 ---------------------------------------------------*/
const MIN_RENDER_ZOOM = 10;
const MAX_RENDER_ZOOM = 12;
const MAX_POLYGON_COUNT = 1500;

export default function EarthquakePolygonGuide() {
  const zoom = useAtomValue(mapZoomAtom);
  const earthquakes = useAtomValue(earthquakeDataAtom);

  // ズームアウトしすぎ
  if (zoom > MIN_RENDER_ZOOM) {
    return (
      <GuideMessage>
        地震レイヤーを見るにはズームインしてください(Lv10以上)
      </GuideMessage>
    );
  }

  // ズームインしすぎ
  if (zoom > MAX_RENDER_ZOOM) {
    return (
      <GuideMessage>
        このズームレベルでは地震レイヤーは表示されません
      </GuideMessage>
    );
  }

  // 件数超過
  if (earthquakes.length > MAX_POLYGON_COUNT) {
    return (
      <GuideMessage>
        表示件数が多すぎます。ズームインして範囲を狭めてください
      </GuideMessage>
    );
  }

  // 問題なし ⇒ 何も表示しない
  return null;
}

/**------------------------
 * 共通メッセージUI（最小）
 ------------------------*/
function GuideMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0,0,0,0.7)",
        color: "#fff",
        padding: "8px 12px",
        borderRadius: 6,
        fontSize: 13,
        pointerEvents: "none"
      }}
    >
      {children}
    </div>
  );
}
