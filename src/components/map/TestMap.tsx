import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";

/**----------------------------
 * 描写テスト用
 ----------------------------*/
export default function TestMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  if (!isLoaded) return null;

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "400px" }}
      center={{ lat: 35.68, lng: 139.76 }}
      zoom={13}
      onLoad={(map) => {
        console.log("Map loaded", map);
        console.log("Map bounds", map.getBounds()?.toString());
      }}
    >
      {(() => {
        console.log("Polygon render");
        return null;
      })()}

      <Polygon
        paths={[
          { lat: 35.68, lng: 139.76 },
          { lat: 35.69, lng: 139.76 },
          { lat: 35.69, lng: 139.77 }
        ]}
        options={{
          fillColor: "#ff0000",
          fillOpacity: 0.4,
          strokeColor: "#ff0000",
          strokeWeight: 2
        }}
      />
    </GoogleMap>
  );
}
