import { GoogleMap, Polygon } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { ReactNode } from "react";
import { mapBoundsAtom } from "../../atoms/mapBoundsAtom";
import { activeLayerAtom } from "../../atoms/activeLayerAtom";

/**------------------------------------------------------------------
 * GoogleMapコンポーネント
 * (Marker / Polygon / Overlayの描画)
 * 「どう見せるか」だけに集中
 * ⇒自身は状態を持たない。atomも触らない。API通信もしない
 ------------------------------------------------------------------*/
// props用の型を定義
type MapViewProps = {
  // 地図の中心座標
  center: { lat: number; lng: number };
  // 現在のズームレベル(=atom由来)
  zoom: number;
  // GoogleMapが初期化された瞬間に呼ばれる(保持しない)
  onLoad: (map: google.maps.Map) => void;
  // ユーザー操作(移動･ズーム)が終わったタイミング(状態同期の入り口)
  onIdle: () => void;
  // 地図の上に乗せるもの(Marker/Polygon/OverlayView/災害レイヤー)
  children?: ReactNode;
};

export default function MapView({
  center,
  zoom,
  onLoad,
  onIdle,
  children
}: MapViewProps) {
  const [bounds] = useAtom(mapBoundsAtom);
  const [activeLayer] = useAtom(activeLayerAtom);

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onIdle={onIdle}
    >
      {/* 安定化ガード(必須) */}
      {bounds && activeLayer === "earthquake" && (
        <Polygon
          paths={[
            { lat: 35.68, lng: 139.76 },
            { lat: 35.69, lng: 139.76 },
            { lat: 35.69, lng: 139.77 }
          ]}
          options={{
            fillColor: "red",
            fillOpacity: 0.4,
            strokeColor: "red",
            strokeWeight: 2
          }}
        />
      )}
      {children}
    </GoogleMap>
  );
}
