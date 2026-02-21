import { useAtomValue } from "jotai";
import { isReadMeOpenAtom } from "@/atoms/readMeAtom";

/**-----------------------
 * 中央にクロスヘアUIを設置
 -----------------------*/
export default function CrossHairUI() {
  // 追加: Atomの値を読み取る（値を見るだけなので useAtomValue で十分）
  const isReadMeOpen = useAtomValue(isReadMeOpenAtom);
  // 追加: ReadMeが開いているときは非表示にする
  if (isReadMeOpen) return null;
  return (
    <div className="crosshair-root">
      <div className="crosshair" />
    </div>
  );
}
