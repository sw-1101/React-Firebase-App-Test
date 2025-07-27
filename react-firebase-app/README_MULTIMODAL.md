# AI議事録システム - マルチモーダル入力対応

## 概要

音声、ファイル、テキスト入力を組み合わせてAIが自動で議事録を作成し、検索可能なシステムです。

## 主な機能

### 1. マルチモーダル入力
- **音声録音**: ブラウザのマイクで直接録音
- **ファイルアップロード**: ドラッグ&ドロップ対応
  - 音声ファイル (MP3, WAV, etc.)
  - 動画ファイル (MP4, MOV, etc.)
  - 画像ファイル (JPEG, PNG, etc.)
  - PDFドキュメント
  - Excelファイル
- **テキスト入力**: 自由形式のテキスト

### 2. AI処理 (Gemini API)
- 自動要約生成
- キーポイント抽出
- 音声の文字起こし
- タグ自動生成
- カテゴリ分類

### 3. 検索機能
- 自然言語検索: "こんな感じのもの探してみて"
- AIによる関連性判定
- カテゴリ・タグフィルター

### 4. データ管理 (Firebase)
- リアルタイム同期
- ユーザー認証
- セキュアなデータ保存

## セットアップ

### 1. 環境変数設定

`.env`ファイルを作成:

```env
# Firebase設定
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Gemini API設定
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 2. 依存関係インストール

```bash
npm install
```

### 3. 開発サーバー起動

```bash
npm run dev
```

### 4. アクセス

ブラウザで `http://localhost:5173/content` にアクセス

## 使用方法

### 1. 新規コンテンツ作成
1. `/content` ページの「新規作成」タブを選択
2. 以下のいずれかまたは組み合わせで入力:
   - テキストボックスにメッセージ入力
   - ファイルをドラッグ&ドロップ
   - マイクボタンで音声録音
3. 「送信」ボタンでAI処理開始

### 2. コンテンツ検索
1. 「保存済み」タブを選択
2. 検索ボックスに自然言語で入力
   - 例: "会議の決定事項について"
   - 例: "プロジェクトの進捗が分かるもの"
3. 「検索」ボタンでAI検索実行

### 3. フィルタリング
- カテゴリドロップダウンで絞り込み
- タグをクリックして関連コンテンツ表示

## 技術スタック

### フロントエンド
- **React 19** + TypeScript
- **Material-UI** (コンポーネント)
- **Vite** (ビルドツール)

### バックエンド/API
- **Firebase Firestore** (データベース)
- **Firebase Authentication** (認証)
- **Google Gemini API** (AI処理)

### 主要ライブラリ
- `@google/generative-ai`: Gemini API SDK
- `firebase`: Firebase SDK
- `@mui/material`: UI コンポーネント
- `react-router-dom`: ルーティング

## ファイル構成

```
src/
├── components/
│   ├── multimodal/
│   │   └── MultimodalInput.tsx    # マルチモーダル入力UI
│   ├── content/
│   │   └── ContentList.tsx        # コンテンツ一覧・検索
│   └── auth/                      # 認証関連
├── services/
│   ├── geminiService.ts           # Gemini API統合
│   └── contentService.ts          # Firebase操作
├── pages/
│   └── ContentPage.tsx            # メインページ
└── config/
    └── firebase.ts                # Firebase設定
```

## API仕様

### Gemini API
- **モデル**: `gemini-2.0-flash-exp`
- **入力形式**: マルチモーダル (text, audio, image, video, pdf)
- **出力**: JSON形式の構造化データ

### Firebase Firestore
- **コレクション**: `contents`
- **ドキュメント構造**:
  ```typescript
  {
    timestamp: Timestamp,
    userId: string,
    originalText?: string,
    processedText: string,
    summary: string,
    tags: string[],
    category: string,
    files: Array<{name, type, size, uri?}>,
    audioTranscript?: string
  }
  ```

## 制限事項

### ファイルサイズ
- **インライン**: 20MB以下
- **Files API**: 20MB以上〜2GB

### 対応形式
- **音声**: MP3, WAV, FLAC, AAC
- **動画**: MP4, MOV, AVI (最大2GB)
- **画像**: JPEG, PNG, WebP
- **文書**: PDF (最大1000ページ)
- **スプレッドシート**: Excel (.xlsx, .xls)

### ブラウザ要件
- Chrome, Firefox, Safari, Edge (最新版)
- マイクアクセス許可が必要

## トラブルシューティング

### 1. APIキーエラー
- `.env`ファイルの設定を確認
- Gemini API キーの有効性確認
- Firebase プロジェクト設定確認

### 2. 音声録音ができない
- ブラウザのマイク許可設定確認
- HTTPSまたはlocalhostで実行確認

### 3. ファイルアップロードエラー
- ファイルサイズ制限確認 (2GB以下)
- 対応形式確認
- ネットワーク接続確認

## 拡張機能

### 今後の予定
- [ ] リアルタイム音声ストリーミング (Live API)
- [ ] 動画の自動字幕生成
- [ ] チーム共有機能
- [ ] API キー管理UI
- [ ] 高度な検索フィルター

### カスタマイズ
- `geminiService.ts`: AI処理ロジック
- `MultimodalInput.tsx`: UI拡張
- `ContentList.tsx`: 表示カスタマイズ