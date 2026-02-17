import { useAtom } from "jotai";
import { bannerAtom } from "@/atoms/bannerAtom";
import { useEffect, useState } from "react";
import "@/styles/Banner.css";

/**----------------------------------
 * 共通Banner UI
----------------------------------*/
export default function Banner() {
  const [state, setState] = useAtom(bannerAtom);
  const [count, setCount] = useState<number | null>(null);

  /**------------------------------
   * 自動消滅
  ------------------------------*/
  useEffect(() => {
    if (!state.visible || !state.duration) return;
    if (state.type === "confirm") return;

    const timer = setTimeout(() => {
      setState({ visible: false });
    }, state.duration);

    return () => clearTimeout(timer);
  }, [state.visible, state.duration, state.type, setState]);

  /**------------------------------
   * カウントダウン
  ------------------------------*/
  useEffect(() => {
    if (!state.visible || !state.duration || !state.countdown) return;

    setCount(Math.ceil(state.duration / 1000));

    const id = setInterval(() => {
      setCount((v) => (v ? v - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, [state.visible, state.duration, state.countdown]);

  if (!state.visible) return null;

  return (
    <div className={`banner show ${state.type ?? ""}`}>
      <div className="banner-content">
        <span>{state.message}</span>

        {state.countdown && count !== null && (
          <span className="banner-count">({count}s)</span>
        )}
      </div>

      {/* confirm用ボタン */}
      {state.type === "confirm" && (
        <div className="banner-actions">
          <button
            className="banner-btn confirm"
            onClick={() => {
              state.onConfirm?.();
              setState({ visible: false });
            }}
          >
            {state.confirmLabel ?? "移動する"}
          </button>

          <button
            className="banner-btn cancel"
            onClick={() => {
              state.onCancel?.();
              setState({ visible: false });
            }}
          >
            {state.cancelLabel ?? "このまま表示"}
          </button>
        </div>
      )}
    </div>
  );
}
