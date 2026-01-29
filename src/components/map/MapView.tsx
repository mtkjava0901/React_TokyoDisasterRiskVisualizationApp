import { GoogleMap } from "@react-google-maps/api";
import { ReactNode } from "react";

/**------------------------------------------------------------------
 * GoogleMapコンポーネント
 * (Marker / Polygon / Overlayの描画)
 * 「どう見せるか」だけに集中
 ------------------------------------------------------------------*/
// props用の型を定義
type MapViewProps = {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  onLoad: (map: google.maps.Map) => void;
  onIdle: () => void;
  children?: ReactNode;
};

export default function MapView({
  center,
  zoom,
  onLoad,
  onIdle,
  children
}: MapViewProps) {
  return (
    <GoogleMap
      // 地図を表示するDOMサイズの指定
      mapContainerStyle={{ width: "100%", height: "400px" }}
      // center/zoomの指定 (atomをそのまま渡す)
      center={center}
      zoom={zoom}
      onLoad={onLoad}
      onIdle={onIdle}
    >
      {children}
    </GoogleMap>
  );
}
