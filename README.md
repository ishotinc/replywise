# Beauty Review Reply Generator

美容比較サイト向けのネガティブレビュー自動返信システム

## 概要

このシステムは、美容比較サイトに寄せられるネガティブなレビューやクレームに対して、Claude APIを使用して適切な返信文を自動生成します。中立的で建設的な返信を150-250文字で生成し、カスタマーサポートの効率化を支援します。

## 機能

- 🤖 Claude APIによる自動返信生成
- 📝 文字数カウント機能（150-250文字目標）
- 📋 ワンクリックでクリップボードにコピー
- 💅 美容業界らしいグラデーションデザイン
- 📱 レスポンシブ対応

## セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd replywise
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.example`を`.env`にコピーし、Anthropic APIキーを設定します：

```bash
cp .env.example .env
```

`.env`ファイルを編集：
```
ANTHROPIC_API_KEY=your_api_key_here
```

### 4. サーバーの起動

開発環境：
```bash
npm run dev
```

本番環境：
```bash
npm start
```

サーバーは`http://localhost:3000`で起動します。

## 使用方法

1. ブラウザで`http://localhost:3000`にアクセス
2. テキストエリアにネガティブなレビューやクレームを入力
3. 「返信を生成」ボタンをクリック（またはCtrl+Enter）
4. 生成された返信を確認
5. 「コピー」ボタンで返信文をクリップボードにコピー

## 技術スタック

- **フロントエンド**: HTML, CSS, JavaScript
- **バックエンド**: Node.js, Express
- **API**: Anthropic Claude API
- **スタイリング**: カスタムCSS（グラデーション使用）

## プロジェクト構造

```
replywise/
├── server.js           # Expressサーバー
├── public/             # 静的ファイル
│   ├── index.html     # メインHTML
│   ├── css/
│   │   └── styles.css # スタイルシート
│   └── js/
│       └── app.js     # フロントエンドJS
├── .env.example       # 環境変数サンプル
├── package.json       # 依存関係
└── README.md          # このファイル
```

## ライセンス

ISC