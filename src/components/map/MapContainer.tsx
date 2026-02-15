import { useJsApiLoader } from "@react-google-maps/api";
import MapView from "./MapView";
import EarthquakePolygonLayer from "./layers/earthquake/EarthquakePolygonLayer";
import LegendUI from "./ui/LegendUI";
import FooterUI from "./ui/FooterUI";
import TokyoStatusBanner from "./ui/TokyoStatusBanner";
import RiskResultPanel from "./ui/RiskResultPanel";

import useMapEventSync from "@/hooks/useMapEventSync";
import { useEarthquakeLayer } from "@/hooks/useEarthquakeLayer";
import { useSyncMeshLevel } from "@/hooks/useSyncMeshLevel";

import { useRef } from "react";
import { useAtomValue } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "@/atoms/mapAtom";

import LocationTest from "../debug/LocationTest";
import { useLocationController } from "@/hooks/location/useLocationController";

const LIBRARIES: "geometry"[] = ["geometry"];

/**------------------------------------------------------------------
 *
 * MapContainer（組み立て専用）
 *
 * やる事：
 * ・GoogleMapロード
 * ・hook呼び出し
 * ・UI配置
 * ・MapViewへprops渡し
 * 
 * やらない事：
 * ・APIロジック
 * ・地図操作ロジック
 * ・Risk処理
 *
 --------------------------------------------------------------------*/
export default function MapContainer() {
  // GoogleMapsAPIロード
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  // Global state
  const center = useAtomValue(mapCenterAtom);
  const zoom = useAtomValue(mapZoomAtom);

  // Map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  /**--------------------------------------
   * hookの実行(副作用系)
   --------------------------------------*/
  const mapEvents =
    // Map状態の同期
    useMapEventSync({ mapRef });
  // zoom→meshの同期
  useSyncMeshLevel();
  // A-01.EarthquakeLayer取得
  useEarthquakeLayer();

  /**--------------------------------------
   * Location操作（クリック・現在地・住所検索）
   --------------------------------------*/
  const { handleMapClick, moveToCurrentLocation, searchAddress } =
    useLocationController(mapRef);

  // A-05⇒A-03(A-04)⇒A-06 リスクフロー
  // const { runRiskFlow } = useRiskFlow();

  // 現在地hook取得
  // const { getCurrentLocation } = useCurrentLocation();

  // Mapクリック⇒座標抽出⇒Flow
  // const handleMapClick = (e: google.maps.MapMouseEvent) => {
  //   if (!e.latLng) return;
  //   runRiskFlow(e.latLng.lat(), e.latLng.lng());
  // };

  // 現在地⇒RiskFlow
  // const handleCurrentLocation = async () => {
  //   const loc = await getCurrentLocation();

  //   if (!loc) {
  //     console.log("現在地取得失敗");
  //     return;
  //   }

  //   console.log("現在地:", loc);

  //   // RiskFlow実行
  //   await runRiskFlow(loc.lat, loc.lng);

  //   // Mapを現在地へ移動
  //   mapRef.current?.panTo(loc);
  //   mapRef.current?.setZoom(13);
  // };

  // 読み込み中
  if (!isLoaded) return <div>Now Loading...</div>;

  // 本体
  return (
    <div className="map-root">
      <MapView
        center={center}
        zoom={zoom}
        onLoad={(map) => {
          console.log("MAP LOADED");
          mapRef.current = map;
          }}
        onClick={handleMapClick}
        {...mapEvents}
      >
        <EarthquakePolygonLayer />
      </MapView>

      <RiskResultPanel />

      <TokyoStatusBanner />
      <LegendUI />
      <FooterUI />

      <LocationTest
        onCurrentLocation={moveToCurrentLocation}
        onSearchAddress={searchAddress}
      />
    </div>
  );
}

/***********************************************************************************************/

/*
  // atomからstateを取得
  const [center] = useAtom(mapCenterAtom);
  // const center = { lat: 35.854, lng: 139.156 };
  const [zoom] = useAtom(mapZoomAtom);
  // meshLevelの同期
  const [, setMeshLevel] = useAtom(meshLevelAtom);
  useEffect(() => {
    setMeshLevel(getMeshLevelFromZoom(zoom));
  }, [zoom]);

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

  // zoomに応じて取得
  const currentMeshLevel = 8;

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

        {markerPosition && <Marker position={markerPosition} />}

        <EarthquakePolygonLayer />
      </MapView>

      <TokyoStatusBanner />

      <button
        style={{ position: "absolute", top: 10, left: 10, zIndex: 999 }}
        onClick={async () => {
          const result = await fetchEarthquakeRisk(
            35.66890651477193,
            139.38249822835303,
            currentMeshLevel
          );
          console.log("A-03 test result:", result);
        }}
      >
        A-03 TEST
      </button>

      <LegendUI />
      <FooterUI />
      <EarthquakeDataController />
    </div>
  );
}

*/
