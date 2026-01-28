import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useAtom } from "jotai";
import { mapCenterAtom, mapZoomAtom } from "../atoms/mapAtom";
import { useRef } from "react";
import { fetchEarthquakeLayer } from "../api/earthquakeApi";

/**------------------------------------------------------------------
 * GoogleMapを表示し、ユーザー操作(移動･ズーム)をjotaiのatomに同期させる
 * 地図の状態：ローカルstateに閉じず、アプリ全体で共有
 --------------------------------------------------------------------*/
export default function MapContainer() {
  // atomからstateを取得
  const [center, setCenter] = useAtom(mapCenterAtom);
  const [zoom, setZoom] = useAtom(mapZoomAtom);
  // mapインスタンスをrefに保存
  // getCenter(),getZoomで取得する
  const mapRef = useRef(null);

  // useJsApiLoader = GoogleMaps JS APIを非同期で安全に読み込むためのHook
  const { isLoaded, loadError } = useJsApiLoader({
    // APIキーでMaps APIをロード
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  // 失敗時メッセージ：
  if (loadError) return <div>Map load error</div>;
  // ロード中メッセージ：
  if (!isLoaded) return <div>Loading map...</div>;
  // ※ロードが終わるまではGoogleMapを描写しない

  // コンポーネント本体
  return (
    <GoogleMap
      // 地図を表示するDOMサイズの指定
      mapContainerStyle={{ width: "100%", height: "400px" }}
      // center/zoomの指定 (atomをそのまま渡す)
      center={center}
      zoom={zoom}
      // mapインスタンスを保持(初期化した瞬間呼ばれる)
      // map=GoogleMapsAPIのMapオブジェクト
      // ⇒mapRef.current.getCenter(); , mapRef.current.getZoom(); が利用可能に
      onLoad={(map) => {
        mapRef.current = map;
      }}
      // ここから新規
      onIdle={async () => {
        if (!mapRef.current) return;

        const c = mapRef.current.getCenter();
        const z = mapRef.current.getZoom();
        const bounds = mapRef.current.getBounds();

        if (!c || z == null || !bounds) return;

        // atom更新(Map中心･ズーム管理)
        setCenter({ lat: c.lat(), lng: c.lng() });
        setZoom(z);

        // bounds ⇒ min/max
        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const minLat = sw.lat();
        const maxLat = ne.lat();
        const minLng = sw.lng();
        const maxLng = ne.lng();

        console.log("map state:", {
          center: { lat: c.lat(), lng: c.lng() },
          zoom: z,
          minLat,
          maxLat,
          minLng,
          maxLng
        });

        // APIの疎通確認
        const data = await fetchEarthquakeLayer(
          minLat,
          maxLat,
          minLng,
          maxLng,
          z
        );

        console.log("earthquake layer response:", data);
      }}
    />
  );
}

/*
      // 地図移動を検知した場合：
      onCenterChanged={() => {
        // mapインスタンスから中心を取得
        const c = mapRef.current?.getCenter();
        // null/undefinedチェック(初期化されてないのにsetCenterしない様にする)
        if (!c) return;
        // GoogleMaps独自オブジェクト⇒数値に変換
        setCenter({ lat: c.lat(), lng: c.lng() });
      }}
      // ズーム変更を検知した場合：
      onZoomChanged={() => {
        // Mapが持っている最新zoom値を取得
        const z = mapRef.current?.getZoom();
        // null/undefinedチェック（0は弾かない）
        if (z == null) return;
        // 取得zoom値をそのままatomに反映
        // ⇒他コンポーネント･API取得が反応
        setZoom(z);
      }}
    />
  );
}
*/
