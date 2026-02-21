import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { locationAtom } from "@/atoms/locationAtom";
import { locationTriggerAtom } from "@/atoms/locationTriggerAtom";

/**-------------------------------
 * 初回表示用 location 初期化
 * アプリ起動時に1回だけ実行
 * 初期座標：東京都千代田区（千代田区役所付近）
 -------------------------------*/
export function useInitializeLocation() {
  const setLocation = useSetAtom(locationAtom);
  const setTrigger = useSetAtom(locationTriggerAtom);

  useEffect(() => {
    // 初期座標：東京都千代田区
    const initial = {
      lat: 35.694003,
      lng: 139.753634
    };

    // デバッグ用
    // console.log("initialize location", initial);

    setLocation(initial);
    setTrigger("MAP_CLICK");
  }, [setLocation, setTrigger]);
}
