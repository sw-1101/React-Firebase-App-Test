# React Firebase Sample App

React + Firebase で構築されたサンプルアプリケーション。Vue.js 経験者の React 学習用プロジェクトとして設計されています。

## 🚀 クイックスタート

### 前提条件
- Node.js 18+
- npm または yarn
- Firebase プロジェクト

### インストール

1. **リポジトリのクローン**
```bash
git clone <repository-url>
cd react-firebase-app
```

2. **依存関係のインストール**
```bash
npm install
```

3. **環境変数の設定**
```bash
# .env.local ファイルを作成
cp .env.example .env.local

# Firebase の設定値を入力
# Firebase Console > プロジェクト設定 > アプリ から取得
```

4. **開発サーバーの起動**
```bash
npm run dev
```

http://localhost:5173 でアプリケーションが起動します。

## 🔧 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# 型チェック
npm run type-check

# リンター実行
npm run lint

# コードフォーマット
npm run format
```

## 🎯 主要機能

### 認証機能
- ✅ ユーザー登録
- ✅ ログイン・ログアウト
- ✅ プロフィール管理
- ✅ 認証状態による画面制御

### データ管理
- ✅ CRUD 操作（作成・読み取り・更新・削除）
- ✅ リアルタイム同期
- ✅ ユーザー固有のデータ管理
- ✅ カテゴリ・優先度による分類

### UI/UX
- ✅ レスポンシブデザイン
- ✅ Material Design
- ✅ ダークモード対応（テーマシステム）
- ✅ モバイル最適化

## 📁 プロジェクト構成

```
src/
├── components/           # 再利用可能なUIコンポーネント
│   ├── auth/            # 認証関連
│   ├── common/          # 共通コンポーネント
│   ├── data/            # データ関連
│   └── layout/          # レイアウト
├── contexts/            # React Context（状態管理）
├── hooks/               # カスタムフック
├── pages/               # ページコンポーネント
├── routes/              # ルーティング設定
├── services/            # API・外部サービス連携
├── types/               # TypeScript 型定義
├── utils/               # ユーティリティ関数
└── config/              # 設定ファイル
```

詳細な構成については [ARCHITECTURE.md](./ARCHITECTURE.md) を参照してください。

## 🔑 Firebase 設定

### 1. Firebase プロジェクトの作成
1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新しいプロジェクトを作成
3. Authentication と Firestore を有効化

### 2. Authentication の設定
```bash
# Firebase Console > Authentication > Sign-in method
# メール/パスワード を有効化
```

### 3. Firestore の設定
```bash
# Firebase Console > Firestore Database
# テストモードで開始（後でセキュリティルールを設定）
```

### 4. セキュリティルールの設定
```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dataItems/{document} {
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🔄 Vue.js からの移行ポイント

### 概念の対応表

| Vue.js | React | 説明 |
|--------|-------|------|
| `data()` | `useState` | コンポーネントの状態管理 |
| `computed` | `useMemo` | 算出プロパティ |
| `watch` | `useEffect` | 副作用とライフサイクル |
| `props` | `props` | 親から子への データ受け渡し |
| `emit` | コールバック | 子から親への イベント送信 |
| `v-if` | `{condition && <Component />}` | 条件付きレンダリング |
| `v-for` | `{items.map(item => <Item />)}` | リスト表示 |
| Vuex/Pinia | Context API + useReducer | 状態管理 |
| Vue Router | React Router | ルーティング |
| Composables | Custom Hooks | ロジックの再利用 |

### 学習のポイント
1. **JSX の理解**: Vue のテンプレートとは異なる記法
2. **フックの概念**: useEffect、useState などの理解
3. **状態の不変性**: React では状態を直接変更しない
4. **Context API**: Vuex/Pinia に相当する状態管理

## 🧪 テスト

### テストファイルの配置
```bash
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── LoginForm.test.tsx  # テストファイル
```

### テスト実行
```bash
# すべてのテストを実行
npm run test

# ウォッチモードでテスト実行
npm run test:watch

# カバレッジレポート生成
npm run test:coverage
```

## 📦 デプロイ

### Firebase Hosting へのデプロイ

1. **Firebase CLI のインストール**
```bash
npm install -g firebase-tools
```

2. **Firebase にログイン**
```bash
firebase login
```

3. **プロジェクトの初期化**
```bash
firebase init hosting
# dist を public directory として設定
```

4. **ビルドとデプロイ**
```bash
npm run build
firebase deploy
```

### その他のデプロイ オプション
- **Vercel**: 自動デプロイ対応
- **Netlify**: Git 連携デプロイ
- **AWS S3 + CloudFront**: 手動設定
- **Docker**: コンテナ化デプロイ

## 🔧 開発ツール

### 推奨 VS Code 拡張機能
- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Prettier - Code formatter
- ESLint

### 推奨 Chrome 拡張機能
- React Developer Tools
- Firebase Extension for Chrome DevTools

## 🐛 トラブルシューティング

### よくある問題

#### Firebase 接続エラー
```bash
# 環境変数の確認
cat .env.local

# Firebase プロジェクトの確認
firebase projects:list
```

#### ビルドエラー
```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# TypeScript エラーの確認
npm run type-check
```

#### ルーティングエラー
```bash
# React Router の設定確認
# BrowserRouter が正しく設定されているかチェック
```

## 📚 学習リソース

### React 学習
- [React 公式ドキュメント](https://react.dev/)
- [React TypeScript Cheatsheet](https://github.com/typescript-cheatsheets/react)

### Firebase 学習
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling Best Practices](https://firebase.google.com/docs/firestore/data-model)

### Vue から React への移行
- [Vue to React Migration Guide](https://blog.logrocket.com/migrating-vue-react/)

## 🤝 コントリビューション

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下で公開されています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 📞 サポート

質問や問題がある場合は、以下の方法でお問い合わせください：

- 🐛 バグ報告: GitHub Issues
- 💡 機能提案: GitHub Issues
- 📧 その他: メール または Discord

---

**Happy Coding! 🎉**