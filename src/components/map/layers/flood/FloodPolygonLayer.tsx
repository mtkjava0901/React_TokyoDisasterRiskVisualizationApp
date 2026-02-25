import { memo, useMemo } from "react";
import { useAtomValue } from "jotai";
import { Polygon } from "@react-google-maps/api";
import { floodDataAtom } from "../../../../atoms/floodDataAtom";
import { earthquakeDataAtom } from "../../../../atoms/earthquakeDataAtom";
import { floodPolygonStyleMap } from "./floodStyle";
import { mapZoomAtom, mapCenterAtom } from "../../../../atoms/mapAtom";
import { mapBoundsAtom } from "../../../../atoms/mapBoundsAtom";
import { activeLayerAtom } from "../../../../atoms/activeLayerAtom";

/**---------------------------------------------
 * 洪水Polygonの描画専用コンポーネント (アプローチA対応)
 * ・地震APIのデータ(earthquakeDataAtom)を「ベースマス目」として間借りする
 * ・ベースマス目を「NONE（安全）」として敷き詰め、上に洪水の色を乗せる
 ---------------------------------------------*/
// zoom8未満では洪水レイヤーは非表示
const DETAIL_RENDER_ZOOM = 8;
// 最大描画zoom(17以上非表示)
const MAX_RENDER_ZOOM = 16;
// 描画上限設定（パフォーマンスガード）
const MAX_POLYGON_COUNT = 5000;

function FloodPolygonLayer() {
  const floods = useAtomValue(floodDataAtom);
  const earthquakeBase = useAtomValue(earthquakeDataAtom);
  const zoom = useAtomValue(mapZoomAtom);
  const center = useAtomValue(mapCenterAtom);
  const bounds = useAtomValue(mapBoundsAtom);
  const activeLayer = useAtomValue(activeLayerAtom);

  const polygons = useMemo(() => {
    // 各種ガード処理
    if (activeLayer !== "flood") return [];
    if (!bounds) return [];
    if (zoom < DETAIL_RENDER_ZOOM || zoom > MAX_RENDER_ZOOM) return [];

    // ベースとなる地震APIのメッシュデータがまだ無い場合は描画しない
    if (earthquakeBase.length === 0) return [];

    // 1. 画面内に収まる「ベースとなるマス目」を地震データから抽出
    const visibleBaseMeshes = earthquakeBase.filter((eq) =>
      eq.polygon.some(
        (p) =>
          p.lat >= bounds.minLat &&
          p.lat <= bounds.maxLat &&
          p.lng >= bounds.minLng &&
          p.lng <= bounds.maxLng
      )
    );

    // 2. 洪水データを扱いやすいように、meshCodeをキーにしたMap（辞書）に変換
    const floodMap = new Map();
    floods.forEach((f) => {
      // ※現在の洪水データにはmeshCodeが含まれていない可能性があるため、
      // ポリゴンの代表座標（最初の点）の文字列などを強引にキーにするか、
      // バックエンドが同じメッシュ順で返していることを前提にする必要があります。
      // ここでは安全に、地震マス目の中点と洪水マス目の中点の距離でマッチングします。

      const centerLat = (f.bbox.minLat + f.bbox.maxLat) / 2;
      const centerLng = (f.bbox.minLng + f.bbox.maxLng) / 2;

      // 緯度経度を文字列化して一意のキーにする（概算）
      const key = `${centerLat.toFixed(3)}_${centerLng.toFixed(3)}`;
      floodMap.set(key, f);
    });

    const renderData = [];

    // 3. ベースマス目をループし、洪水データがあれば上書き、無ければNONEとして採用
    for (const baseMesh of visibleBaseMeshes) {
      // 地震マス目の中心点を計算
      const latSum = baseMesh.polygon.reduce((sum, p) => sum + p.lat, 0);
      const lngSum = baseMesh.polygon.reduce((sum, p) => sum + p.lng, 0);
      const centerLat = latSum / baseMesh.polygon.length;
      const centerLng = lngSum / baseMesh.polygon.length;

      const key = `${centerLat.toFixed(3)}_${centerLng.toFixed(3)}`;

      // 洪水データとマッチした場合は洪水データを採用、そうでない場合は安全(NONE)マスデータを生成
      if (floodMap.has(key)) {
        renderData.push(floodMap.get(key));
      } else {
        // 安全なマスのデータをダミー生成
        renderData.push({
          polygon: baseMesh.polygon,
          riskLevel: "NONE"
        });
      }
    }

    // 検証用ログ出力
    console.log(
      `[FloodPolygonLayer] Zoom: ${zoom}, Center: [${center.lat.toFixed(
        4
      )}, ${center.lng.toFixed(4)}], Polygons (Visible Grid): ${renderData.length}`
    );

    // 描画上限をカット
    const safe = renderData.slice(0, MAX_POLYGON_COUNT);

    return safe.map((data, index) => (
      <Polygon
        key={`flood-${index}`}
        paths={data.polygon}
        options={
          floodPolygonStyleMap[
            data.riskLevel as import("../../../../types/Flood").FloodRiskLevel
          ]
        }
      />
    ));
  }, [floods, earthquakeBase, bounds, activeLayer, zoom, center]);

  return <>{polygons}</>;
}

export default memo(FloodPolygonLayer);
