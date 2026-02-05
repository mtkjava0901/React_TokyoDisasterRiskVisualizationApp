import { GoogleMap, Polygon } from "@react-google-maps/api";
import { ReactNode } from "react";
/**------------------------------------------------------------------
 * GoogleMapコンポーネント
 * (Marker / Polygon / Overlayの描画)
 * 「どう見せるか」だけに集中
 * ⇒自身は状態を持たない。atomも触らない。API通信もしない
 ------------------------------------------------------------------*/
// props用の型を定義
type MapViewProps = {
  // 地図の中心座標(GoogleMaps公式型)
  center: google.maps.LatLngLiteral;
  // 現在のズームレベル(=atom由来)
  zoom: number;
  // GoogleMapが初期化された瞬間(保持しない)
  onLoad: (map: google.maps.Map) => void;
  // ユーザー操作終了時(状態同期の入り口)
  onIdle: () => void;
  // 地図の上に乗せるもの(Marker/Polygon/OverlayView/災害レイヤー等)
  children?: ReactNode;
};

export default function MapView({
  center,
  zoom,
  onLoad,
  onIdle,
  children
}: MapViewProps) {
  console.log("MapView children:", children);

  return (
    <div className="map-container">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onIdle={onIdle}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false
        }}
      >
        {children}
      </GoogleMap>
    </div>
  );
}
