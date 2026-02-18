import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { locationAtom } from "@/atoms/locationAtom";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";

/**-------------------------------
 * 初回表示用 location 初期化
 * アプリ起動時に1回だけ実行
 -------------------------------*/
export function useInitializeLocation() {
  const setLocation = useSetAtom(locationAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);

  useEffect(() => {
    // 初期座標（例：東京駅）
    const initial = {
      lat: 35.681236,
      lng: 139.767125
    };

    console.log("🚀 initialize location", initial);

    setLocation(initial);
    setTrigger("MAP_CLICK");
  }, [setLocation, setTrigger]);
}
