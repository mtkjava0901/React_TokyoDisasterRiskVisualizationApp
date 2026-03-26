import "/src/styles/style.css/";
import "/src/styles/header.css";
import "/src/styles/legendUI.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MapContainer from "./components/map/MapContainer";
import Header from "./components/layout/Header";
import ApiLoadingOverlay from "./components/ui/ApiLoadingOverlay";

/**-----------------------------------------
 *
 * 画面レイアウト
 *
----------------------------------------- */

export default function App() {
  return (
    <div className="app">
      <Header />
      <ApiLoadingOverlay />
      <MapContainer />

      {/* 凡例 */}
      {/* <Legend /> */}

      {/* フッター */}
      {/* <Footer /> */}
    </div>
  );
}
