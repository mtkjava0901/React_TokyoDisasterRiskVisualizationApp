/**---------------------------------------
 * Map Zoom ルール定義
 * zoom値を「表示戦略」に変換する
--------------------------------------- */

/**---------------------------------------
 * メッシュ粒度
 * （バックエンドのMeshLevelと対応させる想定）
 ---------------------------------------*/
export type MeshLevel =
  | "NONE" // メッシュ無し（集約・非表示）
  | "PRIMARY" // 1次メッシュ
  | "SECONDARY" // 2次メッシュ
  | "TERTIARY"; // 3次メッシュ

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
  MIN: 6,
  MAX: 13
} as const;

/**---------------------------------------
 * zoom値から表示ルールを決定する
--------------------------------------- */
export function resolveZoomRule(zoom: number): ZoomRuleResult {
  // ズームアウトしすぎ
  if (zoom < ZOOM_LIMIT.MIN) {
    return {
      fetchable: false,
      meshLevel: "NONE",
      message: "これ以上ズームアウト出来ません"
    };
  }

  // 広域（集約表示）
  if (zoom <= 6) {
    return {
      fetchable: false,
      meshLevel: "NONE"
    };
  }

  // 中間（間引き・クラスタ）
  if (zoom >= 7 && zoom <= 9) {
    return {
      fetchable: true,
      meshLevel: zoom <= 8 ? "PRIMARY" : "SECONDARY"
    };
  }

  // 詳細（生データ）
  if (zoom >= 10 && zoom <= 12) {
    return {
      fetchable: true,
      meshLevel: "TERTIARY"
    };
  }

  // ズームインしすぎ
  return {
    fetchable: false,
    meshLevel: "NONE",
    message: "これ以上ズームインできません"
  };
}
