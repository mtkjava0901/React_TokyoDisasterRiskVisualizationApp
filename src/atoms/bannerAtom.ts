import { atom } from "jotai";

/**----------------------------------
 * Banner表示タイプ
----------------------------------*/
export type BannerType = "error" | "boundary" | "outside" | "confirm";

/**----------------------------------
 * Banner状態
----------------------------------*/
export type BannerState = {
  visible: boolean;
  type?: BannerType;
  message?: string;

  /** 自動消滅(ms) */
  duration?: number;

  /** カウントダウン表示 */
  countdown?: boolean;

  /** confirm用 */
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export const bannerAtom = atom<BannerState>({
  visible: false,
  type: "boundary",
  message: ""
});

/******************************************************************************/
// 0217
// /**----------------------------------
//  * Banner表示タイプ
// ----------------------------------*/
// export type BannerType = "error" | "boundary" | "outside" | "confirm";

// /**----------------------------------
//  * Banner状態
// ----------------------------------*/
// export type BannerState = {
//   visible: boolean;
//   type?: BannerType;
//   message?: string;

//   duration?: number;

//   // 自動消滅(ms)
//   // autoHideMs?: number;

//   // カウントダウン表示
//   // countdown?: boolean;

//   // confirm用
//   confirmLabel?: string;
//   cancelLabel?: string;
//   onConfirm?: () => void;
//   onCancel?: () => void;
// };

// export const bannerAtom = atom<BannerState>({
//   visible: false
//   type: "info",
//   message: ""
// });
