import { useState } from "react";
import "../../styles/readme-modal.css";
type ReadMeModalProps = {
  isOpen: boolean;
  onClose: () => void;
};
export default function ReadMeModal({ isOpen, onClose }: ReadMeModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  if (!isOpen) return null;
  const tabs = [
    {
      id: 0,
      icon: "bi-info-circle",
      title: "このアプリについて",
      content: (
        <>
          <p>
            本システムは、東京都（小笠原諸島を除く）における地震および洪水の災害リスク傾向を、東京都オープンデータと国土数値情報、GoogleMapsを用いて可視化したポートフォリオ作品です。
          </p>
          <p>本システムの地図データは編集・加工を行っています。</p>
          <p className="warning-text">
            本システムは防災意識向上を目的とした可視化アプリであり、実際の避難判断や被害予測を代替するものではありません。
          </p>
        </>
      )
    },
    {
      id: 1,
      icon: "bi-layers",
      title: "表示内容について",
      content: (
        <>
          <div className="accordion-section">
            <h4>レイヤー共通</h4>
            <ul>
              <li>地震･洪水レイヤーの同時表示非対応</li>
              <li>矩形メッシュ：約1km × 1km(地震･洪水共通)</li>
              <li>表示範囲：関東･首都圏広域～丁目・街区レベル</li>
            </ul>
          </div>
          <div className="accordion-section">
            <h4>地震ボタン</h4>
            <ul>
              <li>想定災害：都心南部直下地震 M7.3</li>
              <li>震源モデル：中央区･港区･新宿区(南部)･渋谷区･文京区(南部)</li>
            </ul>
          </div>
          <div className="accordion-section">
            <h4>洪水ボタン</h4>
            <ul>
              <li>
                想定災害：想定最大規模による洪水
                <div style={{ fontSize: "0.9em", color: "#666", marginTop: "4px" }}>
                  (地域で起こり得る最大クラスの豪雨：概ね1000年に1回程度)
                </div>
              </li>
            </ul>
          </div>
          <div className="accordion-section">
            <h4>地図ボタン</h4>
            <ul>
              <li>
                地震・洪水レイヤー表示なし。GoogleMapのみを表示するモードです。
              </li>
            </ul>
          </div>
        </>
      )
    },
    {
      id: 2,
      icon: "bi-mouse",
      title: "操作方法",
      content: (
        <ul>
          <li>[地震][洪水][地図]ボタンで表示切替</li>
          <li>中央のピン指定位置データを右上パネルに表示</li>
          <li>レイヤーの濃淡でリスク段階を表現(3段階)</li>
          <li>地図は拡大･縮小･移動が可能</li>
          <li>住所検索機能･現在地検索機能で指定位置へ移動可能</li>
        </ul>
      )
    },
    {
      id: 3,
      icon: "bi-database",
      title: "データ出典",
      content: (
        <div className="source-list">
          <div className="source-item">
            <h4>地図：Google Maps Platform</h4>
            <p>© Google</p>
          </div>
          <div className="source-item">
            <h4>地震：東京都オープンデータカタログサイト（東京都）</h4>
            <p>利用データ：計測震度50mメッシュ別_都心南部直下地震</p>
            <p>クリエイティブ・コモンズ 表示 4.0 国際（CC BY 4.0）</p>
            <a
              href="https://catalog.data.metro.tokyo.lg.jp/dataset/cf6ba556-f86c-4e17-84fe-804198af7b29/resource/0cffb515-4f55-4467-8588-67acc0f30be4"
              target="_blank"
              rel="noopener noreferrer"
            >
              データ元リンク
            </a>
          </div>
          <div className="source-item">
            <h4>洪水：国土交通省「国土数値情報」</h4>
            <p>利用データ：洪水浸水想定区域（想定最大規模）</p>
            <p>※同データを独自に加工して作成</p>
            <a
              href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A31a-2024.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              データ元リンク
            </a>
          </div>
          <div className="source-item">
            <h4>行政区域：国土交通省「国土数値情報」</h4>
            <p>利用データ：行政区域データ（東京都）</p>
            <p>※同データを独自に加工して作成</p>
            <a
              href="https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-N03-2025.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              データ元リンク
            </a>
          </div>
        </div>
      )
    },
    {
      id: 4,
      icon: "bi-exclamation-triangle",
      title: "注意事項",
      content: (
        <>
          <p>本アプリは東京都による公式アプリではありません。</p>
          <p>本アプリで使用しているデータは最新でない可能性があります。</p>
          
          <div className="system-notice" style={{ marginTop: "16px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "8px", borderLeft: "4px solid #ffbc00" }}>
            <h4 style={{ fontSize: "0.95em", marginBottom: "8px", color: "#333", fontWeight: "bold" }}>【初回読み込み時の遅延について】</h4>
            <p style={{ fontSize: "0.9em", color: "#555", lineHeight: "1.5", margin: 0 }}>
              本アプリのバックエンドAPIは、RenderのFreeプラン上で動作しているため、<br/>
              ・初回アクセス時<br/>
              ・約15分以上アクセスが無かった後の再アクセス時<br/>
              には、サーバーの起動（コールドスタート）により、地震・洪水メッシュの表示に30秒～数分程度かかる場合があります。<br/>
              画面がしばらく無反応に見える場合は、そのまましばらくお待ちください。
            </p>
          </div>

          <p className="warning-text" style={{ marginTop: "16px" }}>
            防災情報は必ず自治体の公式発表をご確認ください。
          </p>
        </>
      )
    }
  ];
  return (
    <div className="readme-modal-overlay" onClick={onClose}>
      <div
        className="readme-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダーエリア */}
        <div className="readme-modal-header">
          <h3>ReadMe</h3>
          <button className="close-button" onClick={onClose}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        {/* タブナビゲーション（横スワイプ対応） */}
        <div className="readme-tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`readme-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`bi ${tab.icon} tab-icon`}></i>
              <span className="tab-title">{tab.title}</span>
            </button>
          ))}
        </div>
        {/* コンテンツエリア */}
        <div className="readme-tab-content">
          <h4 className="content-title">
            <i className="bi bi-exclamation-triangle-fill warning-icon"></i>
            {tabs[activeTab].title}
          </h4>
          <div className="content-body">{tabs[activeTab].content}</div>
        </div>
      </div>
    </div>
  );
}
