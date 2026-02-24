// import { useAtom } from "jotai";
// import { outsideConfirmAtom } from "@/atoms/outsideConfirmAtom";
// import { useMapController } from "@/hooks/map/useMapController";
// import "@/styles/Confirm.css";

// export default function OutsideTokyoConfirm() {
//   const [state, setState] = useAtom(outsideConfirmAtom);
//   const { moveMap } = useMapController();

//   if (!state.visible || !state.nearestPoint) return null;

//   const handleMove = () => {
//     if (!state.nearestPoint) return;

//     moveMap(state.nearestPoint, 13);
//     setState({ visible: false });
//   };

//   const handleStay = () => {
//     setState({ visible: false });
//   };

//   return (
//     <div className="outside-confirm">
//       <div className="outside-confirm-message">
//         最寄りの東京都境界へ移動しますか？
//       </div>

//       <div className="outside-confirm-actions">
//         <button className="outside-confirm-move" onClick={handleMove}>
//           移動する
//         </button>

//         <button className="outside-confirm-stay" onClick={handleStay}>
//           このまま
//         </button>
//       </div>
//     </div>
//   );
// }
