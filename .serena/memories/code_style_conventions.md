# コードスタイル・規約

## TypeScript設定
- **厳格モード**: 有効
- **型安全性**: 重視
- **モジュール形式**: ES Module

## ESLint設定
- **@eslint/js**: 推奨設定
- **typescript-eslint**: TypeScript用設定
- **react-hooks**: React Hooks推奨設定
- **react-refresh**: Vite用設定
- **storybook**: Storybook用設定

## ファイル構成
```
src/
├── components/     # UIコンポーネント
│   ├── auth/       # 認証関連
│   ├── common/     # 共通コンポーネント
│   ├── forms/      # フォーム関連
│   └── layout/     # レイアウト
├── contexts/       # React Context
├── hooks/          # カスタムフック
├── pages/          # ページコンポーネント
├── services/       # 外部サービス連携
└── types/          # TypeScript型定義
```

## 命名規則
- **コンポーネント**: PascalCase
- **ファイル**: PascalCase (.tsx), camelCase (.ts)
- **フック**: useXxx形式
- **型定義**: PascalCase

## コンポーネント設計
- **Atomic Design**: 部分的に採用
- **Props型定義**: 必須
- **Story作成**: 推奨
- **単一責任原則**: 重視