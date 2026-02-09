import { useJsApiLoader } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../../atoms/mapAtom";
import { useRef } from "react";
import MapView from "./MapView";
import MapEventSync from "../../hooks/useMapEventSync";
import EarthquakeDataController from "../controller/EarthquakeDataController";
import EarthquakePolygonLayer from "./layers/earthquake/EarthquakePolygonLayer";
import LegendUI from "./ui/LegendUI";
import FooterUI from "./ui/FooterUI";
// import { Library } from "@react-google-maps/api";

/**------------------------------------------------------------------
 * Map状態の管理・APIロードコンポーネント
 * ・GoogleMapを表示し、ユーザー操作(移動･ズーム)をjotaiのatomに同期させる
 * ・地図の状態：ローカルstateに閉じず、アプリ全体で共有
 --------------------------------------------------------------------*/
const LIBRARIES: "geometry"[] = ["geometry"];

export default function MapContainer() {
  // atomからstateを取得
  const [center] = useAtom(mapCenterAtom);
  //const center = { lat: 35.854, lng: 139.156 };
  const [zoom] = useAtom(mapZoomAtom);

  // mapインスタンスをrefに保存
  const mapRef = useRef<google.maps.Map | null>(null);

  // Mapイベント同期(custom hook)
  const mapEvents = MapEventSync({ mapRef });

  // useJsApiLoader = GoogleMaps JS APIを非同期で安全に読み込むためのHook
  // APIキーでMaps APIをロード
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  // clickhandler追加(東京都内か？)
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();

    const res = await fetch(`/api/area/tokyo/contains?lat=${lat}&lng=${lng}`);

    const isTokyo: boolean = await res.json();

    console.log(isTokyo ? "東京都内" : "東京都外");
  };

  // MapOption型の拡張
  interface MapOptionsWithPadding extends google.maps.MapOptions {
    padding?: {
      top?: number;
      bottom?: number;
      left?: number;
      right?: number;
    };
  }

  // ロードが終わるまではGoogleMapを描写しない
  if (!isLoaded) return <div>Loading map...</div>;

  // 本体
  return (
    <div className="map-root">
      <MapView
        center={center}
        zoom={zoom}
        onLoad={(map) => {
          if (!map) return; // null安全確認

          mapRef.current = map;

          (mapRef.current as any).setOptions({
            padding: { right: 320, bottom: 80 }
          });
        }}
        {...mapEvents} // onIdleをここで渡す
        onClick={handleMapClick}
      >
        <EarthquakePolygonLayer />
      </MapView>

      <LegendUI />

      <FooterUI />

      <EarthquakeDataController />
    </div>
  );
}
