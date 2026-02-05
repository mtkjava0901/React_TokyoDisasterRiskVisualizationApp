/**------------------------
 * 汎用UI 責務分離用
 ------------------------*/

export const LEGEND_CONFIG = {
  earthquake: {
    title: "震度",
    items: [
      { key: "high", label: "揺れやすい", color: "#FF0000" },
      { key: "medium", label: "やや揺れやすい", color: "#FF9900" },
      { key: "low", label: "比較的揺れにくい", color: "#FFFF00" }
    ]
  },
  flood: {
    title: "浸水リスク",
    items: [
      { key: "high", label: "浸水深が深い", color: "#0000FF" },
      { key: "medium", label: "浸水深が中程度", color: "#0099FF" },
      { key: "low", label: "浸水深が浅い", color: "#66CCFF" }
    ]
  }
} as const;
