import { useJsApiLoader } from "@react-google-maps/api";
import MapView from "./MapView";
import EarthquakePolygonLayer from "./layers/earthquake/EarthquakePolygonLayer";
import LegendUI from "./ui/LegendUI";
import FooterUI from "./ui/FooterUI";
import RiskResultPanel from "./ui/RiskResultPanel";

import useMapEventSync from "@/hooks/useMapEventSync";
import { useEarthquakeLayer } from "@/hooks/useEarthquakeLayer";
import { useSyncMeshLevel } from "@/hooks/useSyncMeshLevel";

import { useRef } from "react";

import { useLocationController } from "@/hooks/location/useLocationController";
import { useMapController } from "@/hooks/map/useMapController";
import EarthquakeDataController from "../controller/EarthquakeDataController";
import { useAutoRiskController } from "@/hooks/risk/useAutoRiskController";
import CrosshairUI from "@/components/map/ui/CrosshairUI";
import { useRiskLocationController } from "@/hooks/risk/useRiskLocationController";
import Banner from "./ui/banner/Bannner";
import BannerController from "./ui/banner/BannerController";
import { useInitializeLocation } from "@/hooks/useInitializeLocation";

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
    language: "ja",
    libraries: LIBRARIES
  });

  // Global state
  // const center = useAtomValue(mapCenterAtom);
  // const zoom = useAtomValue(mapZoomAtom);
  const { center, zoom } = useMapController();

  // Map instance
  const mapRef = useRef<google.maps.Map | null>(null);

  /**--------------------------------------
   * hookの実行(副作用系)
   --------------------------------------*/
  // Map状態の同期
  const mapEvents = useMapEventSync({ mapRef });
  // zoom→meshの同期
  useSyncMeshLevel();
  // 地震レイヤー取得
  useEarthquakeLayer();
  // Map中心地リスク取得
  useAutoRiskController();
  //
  useRiskLocationController();
  // 初回時に1回だけ動かす
  useInitializeLocation();

  /**--------------------------------------
   * Location操作（クリック・現在地・住所検索）
   --------------------------------------*/
  const { handleMapClick, moveToCurrentLocation, searchAddress } =
    // useLocationController(mapRef);
    useLocationController();

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

      <CrosshairUI />

      <RiskResultPanel />

      {/* <TokyoStatusBanner /> */}
      <Banner />
      <BannerController />
      <LegendUI />
      <FooterUI />

      <EarthquakeDataController />
    </div>
  );
}

/***********************************************************************************************/
