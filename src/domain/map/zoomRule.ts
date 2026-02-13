/**---------------------------------------
 * Map Zoom ルール定義
 * zoom値を「表示戦略」に変換する
--------------------------------------- */

/**---------------------------------------
 * メッシュ粒度
 * （バックエンドのMeshLevelと対応させる想定）
 ---------------------------------------*/
// export type MeshLevel =
//   | "NONE" // メッシュ無し（集約・非表示）
//   | "PRIMARY" // 1次メッシュ
//   | "SECONDARY" // 2次メッシュ
//   | "TERTIARY"; // 3次メッシュ

/**---------------------------------------
 * zoomから導かれる表示ルール
 ---------------------------------------*/
export type ZoomRuleResult = {
  // データを取得して良いか
  fetchable: boolean;

  // 使用するメッシュ粒度
  meshLevel: MeshLevel;

  // UIメッセージ
  message?: string;
};

/**---------------------------------------
 * 許可するzoom範囲
 ---------------------------------------*/
export const ZOOM_LIMIT = {
  MIN: 7,
  MAX: 14
} as const;

/**---------------------------------------
 * MeshLevel定義
 ---------------------------------------*/
export const MeshLevel = {
  NONE: "NONE",
  PRIMARY: "PRIMARY",
  SECONDARY: "SECONDARY",
  TERTIARY: "TERTIARY"
} as const;

export type MeshLevel = (typeof MeshLevel)[keyof typeof MeshLevel];

/**---------------------------------------
 * zoom値から表示ルールを決定する
--------------------------------------- */
export function resolveZoomRule(zoom: number): ZoomRuleResult {
  // zoom8以下は何もしない
  if (zoom <= 8) {
    return {
      fetchable: false,
      meshLevel: "NONE"
    };
  }

  // zoom9～13は詳細表示
  if (zoom >= 9 && zoom <= 14) {
    return {
      fetchable: true,
      meshLevel: "TERTIARY"
    };
  }

  // zoom14以上は非対応
  return {
    fetchable: false,
    meshLevel: "NONE"
  };
}

/**---------------------------------------
 * zoom値とmeshLevelを連動
--------------------------------------- */
export function getMeshLevelFromZoom(zoom: number): number {
  if (zoom <= 8) return 4;
  if (zoom <= 12) return 6;
  return 8;
}
