import { useJsApiLoader } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../../atoms/mapAtom";
import { useRef } from "react";
import MapView from "./MapView";
import MapEventSync from "../../hooks/MapEventSync";
import EarthquakeDataController from "../controller/EarthquakeDataController";

/**------------------------------------------------------------------
 * GoogleMapを表示し、ユーザー操作(移動･ズーム)をjotaiのatomに同期させる
 * 地図の状態：ローカルstateに閉じず、アプリ全体で共有
 --------------------------------------------------------------------*/
export default function MapContainer() {
  // atomからstateを取得
  const [center] = useAtom(mapCenterAtom);
  const [zoom] = useAtom(mapZoomAtom);

  // mapインスタンスをrefに保存
  const mapRef = useRef(null);

  // Mapイベント同期(custom hook)
  const mapEvents = MapEventSync({ mapRef });

  // useJsApiLoader = GoogleMaps JS APIを非同期で安全に読み込むためのHook
  // APIキーでMaps APIをロード
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // ロードが終わるまではGoogleMapを描写しない
  if (!isLoaded) return <div>Loading map...</div>;

  // 本体
  return (
    <>
      <MapView
        center={center}
        zoom={zoom}
        onLoad={(map) => (mapRef.current = map)}
        {...mapEvents} // onIdleをここで渡す
      />
      <EarthquakeDataController />
    </>
  );
}
