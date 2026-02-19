/**----------------------------------
 * 住所表示整形
 *
 * 東京都千代田区 東京駅
 * ↓
 * 東京都千代田区\n東京駅
 *
 * 想定：
 * ・最初のスペースで分割
 * ・施設名が無ければそのまま
----------------------------------*/
export function formatAddress(address?: string): string {
  if (!address) return "";

  const parts = address.trim().split(/\s+/);

  // 市区町村のみ
  if (parts.length <= 1) return address;

  // 市区町村 + 施設名
  return `${parts[0]}\n${parts.slice(1).join(" ")}`;
}
