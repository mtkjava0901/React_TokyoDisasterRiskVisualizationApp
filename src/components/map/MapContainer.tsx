import { useJsApiLoader } from "@react-google-maps/api";
import { useAtom, useSetAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../../atoms/mapAtom";
import { useRef } from "react";
import MapView from "./MapView";
import MapEventSync from "../../hooks/useMapEventSync";
import EarthquakeDataController from "../controller/EarthquakeDataController";
import EarthquakePolygonLayer from "./layers/earthquake/EarthquakePolygonLayer";
import LegendUI from "./ui/LegendUI";
import FooterUI from "./ui/FooterUI";
import { Marker } from "@react-google-maps/api";
import { useState } from "react";
import {
  fetchNearestBoundary,
  NearestBoundaryResponse
} from "@/api/boundaryApi";
import TokyoStatusBanner from "./ui/TokyoStatusBanner";
import { areaModeAtom } from "@/atoms/areaModeAtom";

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
  // 東京都外/都内用
  const setAreaMode = useSetAtom(areaModeAtom);

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

  // Marker用state
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(null);

  // 東京都境界用state
  const [boundaryResult, setBoundaryResult] =
    useState<NearestBoundaryResponse | null>(null);

  // clickhandler追加(東京都内か？)　※デバッグ用
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;

    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarkerPosition({ lat, lng });

    try {
      const result = await fetchNearestBoundary(lat, lng);

      console.log("clicked:", { lat, lng });
      console.log("A-06 result:", result);
      // console.log("nearestPoint:", result.nearestPoint);

      if (!result) {
        setAreaMode("API_ERROR");
        return;
      }

      // 東京都外
      if (!result.isTokyo) {
        setAreaMode("OUTSIDE_TOKYO");

        // 最寄り東京都境界へ移動
        mapRef.current?.panTo({
          lat: result.nearestPoint.lat,
          lng: result.nearestPoint.lng
        });

        return;
      }

      // 東京都内
      setAreaMode("INSIDE_TOKYO");
    } catch (error) {
      console.error(error);
      setAreaMode("API_ERROR");
    }
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
        onClick={handleMapClick} // デバック用
      >
        {/* クリックしたらMarker表示（デバッグ用） */}
        {markerPosition && <Marker position={markerPosition} />}

        <EarthquakePolygonLayer />
      </MapView>

      <TokyoStatusBanner />
      <LegendUI />
      <FooterUI />
      <EarthquakeDataController />
    </div>
  );
}
