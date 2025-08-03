# 推奨コマンド一覧

## 開発
```bash
npm run dev          # 開発サーバー起動 (localhost:5173)
npm run build        # 本番ビルド
npm run preview      # ビルド結果プレビュー
```

## 品質管理・リント
```bash
npm run type-check   # TypeScript型チェック
npm run lint         # ESLint実行
```

## テスト
```bash
npm run test         # ユニットテスト（現在は空実装）
npm run test:e2e     # E2Eテスト（Playwright）
npm run test:e2e:ui  # E2EテストUIモード
npm run test:e2e:report  # E2Eテストレポート表示
```

## Storybook
```bash
npm run storybook        # Storybook開発サーバー (localhost:6006)
npm run build-storybook  # Storybookビルド
npm run test-storybook   # Storybookテスト
```

## Firebase
```bash
firebase login       # Firebase認証
firebase init        # Firebase初期化
firebase deploy      # デプロイ
```

## Git
```bash
git status          # 状態確認
git add .           # ステージング
git commit -m ""    # コミット
git push           # プッシュ
```