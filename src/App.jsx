import "/src/styles/style.css/";
import "/src/styles/header.css";
import "/src/styles/legendUI.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import MapContainer from "./components/map/MapContainer";
import Header from "./components/layout/Header";

/**-----------------------------------------
 *
 * 画面レイアウト
 *
----------------------------------------- */

export default function App() {
  return (
    <div className="app">
      <Header />
      <MapContainer />

      {/* 凡例 */}
      {/* <Legend /> */}

      {/* フッター */}
      {/* <Footer /> */}
    </div>
  );
}
