import { useState } from "react";

/**-------------------------
 * useCurrentLocationテスト用
 -------------------------*/
export type Props = {
  onCurrentLocation: () => Promise<{ lat: number; lng: number } | null>;
  onSearchAddress: (
    address: string
  ) => Promise<{ lat: number; lng: number } | null>;
};

export default function LocationTest({
  onCurrentLocation,
  onSearchAddress
}: Props) {
  const [address, setAddress] = useState("");

  /** 現在地テスト */
  const handleCurrent = async () => {
    const result = await onCurrentLocation();
    console.log("現在地結果:", result);
  };

  /** 住所検索テスト */
  const handleSearch = async () => {
    if (!address.trim()) return;

    const result = await onSearchAddress(address);
    console.log("住所検索結果:", result);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 9999,
        background: "white",
        padding: 10,
        borderRadius: 8
      }}
    >
      <button onClick={handleCurrent}>現在地テスト</button>

      <div style={{ marginTop: 8 }}>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="住所入力"
        />
        <button onClick={handleSearch}>住所検索</button>
      </div>
    </div>
  );
}
