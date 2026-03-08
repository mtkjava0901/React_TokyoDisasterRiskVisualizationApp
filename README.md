# 東京都災害リスク可視化アプリ (フロントエンド)

東京都の各種災害リスク（地震、水害等）を地図上に可視化するアプリケーションのフロントエンド部分です。

## 技術スタック
- **ライブラリ/フレームワーク**: React 18, Vite
- **言語**: JavaScript / TypeScript 対応環境
- **状態管理**: Jotai
- **データフェッチ**: React Query (@tanstack/react-query), Axios
- **ルーティング**: React Router DOM
- **地図・UIコンポーネント**: Google Maps API (@react-google-maps/api), React-Bootstrap, React-Icons

## ディレクトリ構成
```
src/
  ├── api/         # API通信に関する処理 (Axios等)
  ├── atoms/       # Jotaiによる状態管理 (グローバルステート)
  ├── components/  # Reactコンポーネント群 (UI部品)
  ├── constants/   # 定数定義ファイル
  ├── data/        # 静的データ等
  ├── domain/      # ドメインロジック関連
  ├── hooks/       # カスタムフック
  ├── mappers/     # データの変換処理
  ├── styles/      # スタイルシートやCSS Modules
  ├── types/       # TypeScriptの型定義
  └── utils/       # 共通のユーティリティ関数
```

## セットアップと起動方法

1. **パッケージのインストール**
   ```bash
   npm install
   ```
2. **環境変数の設定**
   `.env`ファイルを作成し、必要に応じて環境変数（Google Maps APIキーやAPIのエンドポイント等）を設定してください。
3. **開発用サーバーの起動**
   ```bash
   npm run dev
   ```
   ブラウザで `http://localhost:5173` （デフォルト）にアクセスして確認できます。

## ビルド手順

本番環境用のビルドを行う場合は以下のコマンドを実行します。
```bash
npm run build
```
ビルド完了後、`dist`フォルダが生成され、デプロイ可能な静的ファイルが出力されます。
