# 🚀 セットアップガイド

このプロジェクトを個人のFirebaseプロジェクトで動作させるためのセットアップ手順です。

## 📋 必要なもの

- Node.js 18.0.0以上
- Googleアカウント（Firebase用）
- Googleアカウント（Gemini API用）

## 🔧 1. リポジトリのクローン

```bash
git clone <このリポジトリのURL>
cd react-firebase-app
npm install
```

## 🔥 2. Firebaseプロジェクトの設定

### 🆕 新規プロジェクトを作成する場合

#### 2-1. Firebase Consoleにアクセス
https://console.firebase.google.com/

#### 2-2. 新しいプロジェクトを作成
1. 「プロジェクトを追加」をクリック
2. プロジェクト名を入力（例: `my-multimodal-test`）
3. Google Analyticsは任意（推奨：無効）
4. 「プロジェクトを作成」をクリック

#### 2-3. Webアプリを追加
1. プロジェクト概要で「ウェブ」アイコン（</>）をクリック
2. アプリのニックネームを入力（例: `multimodal-app`）
3. Firebase Hostingは不要（チェックを外す）
4. 「アプリを登録」をクリック

### 🔄 既存プロジェクトを流用する場合

#### 2-1. 既存プロジェクトを選択
1. Firebase Consoleで既存プロジェクトを選択
2. **⚠️ 注意**: 他のアプリのデータと同じプロジェクトになります

#### 2-2. 新しいWebアプリを追加（オプション）
1. プロジェクト設定 → 「全般」タブ
2. 「アプリを追加」→「ウェブ」を選択
3. アプリ名を入力（例: `multimodal-test-app`）

#### 2-3. 既存アプリの設定を使用（シンプル）
- 既存のWebアプリ設定をそのまま使用も可能
- 同じ認証・データベースを共有

### 📋 設定情報をコピー
Firebase Console → プロジェクト設定 → 「全般」タブの設定情報：
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc123"
};
```

## 🔐 3. Firebase Authentication設定

### 3-1. Authentication有効化
1. 左メニューから「Authentication」をクリック
2. 「始める」をクリック

### 3-2. ログイン方法を設定
1. 「Sign-in method」タブをクリック
2. 「メール/パスワード」を選択
3. 「有効にする」をオンにして保存

## 🗄️ 4. Firestore Database設定

### 4-1. Firestore有効化
1. 左メニューから「Firestore Database」をクリック
2. 「データベースの作成」をクリック

### 4-2. セキュリティルール設定
1. 「テストモードで開始」を選択（推奨）
2. ロケーション選択（asia-northeast1推奨）
3. 「完了」をクリック

### 4-3. セキュリティルール更新

#### 🆕 新規Firebaseプロジェクトの場合
「ルール」タブで以下のルールに変更：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーは自分のコンテンツのみアクセス可能
    match /contents/{contentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

#### 🔄 既存Firebaseプロジェクトを流用する場合
既存のセキュリティルールに**以下の部分のみ追加**：
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 既存のルール（そのまま維持）
    // ... existing rules ...
    
    // 🆕 このアプリ用ルールを追加
    match /contents/{contentId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

### 4-4. データベース構造について

**🔥 重要**: Firestoreでは事前のテーブル作成は不要です！

- **コレクション**（`contents`）は初回データ保存時に自動作成
- **ドキュメント構造**は動的に決定
- **スキーマ定義不要**で柔軟なデータ構造

初回テスト実行時に以下が自動作成されます：
```
📁 contents (コレクション)
└── 📄 auto-generated-id (ドキュメント)
    ├── userId: string
    ├── timestamp: Date
    ├── summary: string
    ├── tags: string[]
    └── category: string
```

## 🤖 5. Gemini API設定

### 5-1. Google AI Studioにアクセス
https://aistudio.google.com/apikey

### 5-2. APIキーを作成
1. 「Create API key」をクリック
2. 「Create API key in new project」を選択
3. 生成されたAPIキーをコピー（後で使用）

## ⚙️ 6. 環境変数設定

### 6-1. .env.localファイル作成
プロジェクトルートに`.env.local`ファイルを作成：

```bash
# Firebase設定
VITE_FIREBASE_API_KEY=AIza... # Firebaseの設定からコピー
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123:web:abc123

# Gemini API設定
VITE_GEMINI_API_KEY=AIza... # Google AI Studioで作成したAPIキー
```

### 6-2. 設定値の確認
- Firebase設定はFirebase Consoleの「プロジェクトの設定」→「全般」→「マイアプリ」で確認
- Gemini API キーはGoogle AI Studioで確認

## 🚀 7. アプリケーション起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 にアクセス

## ✅ 8. 動作確認

### 8-1. アカウント作成
1. 「新規登録」からアカウントを作成
2. メール認証が必要な場合は確認

### 8-2. 機能テスト
1. ダッシュボードにアクセス
2. 「音声とアップロードテスト」をクリック
3. 各機能をテスト：
   - テキスト入力
   - 音声録音
   - ファイルアップロード
   - 検索機能

## 🔧 トラブルシューティング

### Firebase接続エラー
- `.env.local`の設定値を再確認
- Firebase Consoleでプロジェクト設定を確認
- ブラウザのキャッシュをクリア

### Gemini API エラー
- APIキーの有効性を確認
- 月間無料枠の残量を確認
- ネットワーク接続を確認

### 認証エラー
- Firebase Authenticationが有効か確認
- メール/パスワード認証が有効か確認

### Firestoreエラー
- セキュリティルールを確認
- ブラウザの開発者ツールでエラー詳細を確認

### インデックスエラー
以下のようなエラーが出る場合：
```
The query requires an index. You can create it here: https://console.firebase.google.com/...
```

**解決方法**:
1. エラーメッセージ内のリンクをクリック
2. Firebase Consoleでインデックス作成
3. 数分待ってからアプリを再試行

**または手動作成**:
1. Firebase Console → Firestore Database → インデックス
2. 「複合インデックスを作成」
3. 必要なフィールドを追加してインデックス作成

## 📱 本番環境への展開

### Firebase Hosting（オプション）
```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🔒 セキュリティ注意事項

⚠️ **重要な注意点**

### APIキーの管理
- `.env.local`ファイルは絶対にGitにコミットしない
- APIキーを他人と共有しない
- 定期的にAPIキーを再生成する

### Firestoreセキュリティ
- 本番環境では適切なセキュリティルールを設定
- テストモードは開発時のみ使用

### 費用管理
- Firebase使用量を定期的に確認
- Gemini API無料枠を確認
- 不要なデータは定期的に削除

## 📞 サポート

問題が発生した場合：
1. まずトラブルシューティングを確認
2. ブラウザの開発者ツールでエラーを確認
3. Firebase Console、Google AI Studioで設定を再確認

---

**🎉 セットアップ完了！**

これで個人のFirebaseプロジェクトでマルチモーダルテストアプリが動作します。