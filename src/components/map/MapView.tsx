import { GoogleMap } from "@react-google-maps/api";
import { ReactNode } from "react";

/**------------------------------------------------------------------
 * GoogleMapコンポーネント
 * (Marker / Polygon / Overlayの描画)
 * 「どう見せるか」だけに集中
 * ⇒自身は状態を持たない。atomも触らない。API通信もしない
 ------------------------------------------------------------------*/
// props用の型を定義
type MapViewProps = {
  // 地図の中心座標(=atom由来)
  center: {
    lat: number;
    lng: number;
  };
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
  return (
    <GoogleMap
      // 地図を表示するDOMサイズの指定
      mapContainerStyle={{ width: "100%", height: "400px" }}
      // center/zoomの指定 (atomをそのまま渡す)
      center={center}
      zoom={zoom}
      // イベントは全て外へ委譲する(onLoad/onIdle)
      onLoad={onLoad}
      onIdle={onIdle}
    >
      {children}
    </GoogleMap>
  );
}
