/**----------------------------
 * BBox計算ユーティリティ
 ----------------------------*/
export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export type PolygonBBox = {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
};

export function calcPolygonBBox(points: LatLngLiteral[]) {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  for (const p of points) {
    if (p.lat < minLat) minLat = p.lat;
    if (p.lat > maxLat) maxLat = p.lat;
    if (p.lng < minLng) minLng = p.lng;
    if (p.lng > maxLng) maxLng = p.lng;
  }

  return { minLat, maxLat, minLng, maxLng };
}
