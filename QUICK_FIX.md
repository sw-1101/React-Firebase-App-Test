# 音声アップロードCORSエラーの即座解決方法

## 方法1: Homebrewでgsutilをインストール（macOS）

```bash
# Google Cloud SDKをインストール
brew install --cask google-cloud-sdk

# インストール後、以下を実行
gcloud auth login
gcloud config set project react-firebase-app-e1407
gsutil cors set cors.json gs://react-firebase-app-e1407.appspot.com
```

## 方法2: Firebase Consoleから手動設定（最も簡単）

1. [Firebase Console](https://console.firebase.google.com/project/react-firebase-app-e1407/storage) を開く
2. 「Rules」タブの隣の「...」メニューから「Google Cloud Console」を選択
3. Cloud Consoleが開いたら、右上の「Cloud Shell」アイコンをクリック
4. Cloud Shellで以下を実行：

```bash
# cors.jsonを作成
cat > cors.json << 'EOF'
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": ["*"]
  }
]
EOF

# CORS設定を適用
gsutil cors set cors.json gs://react-firebase-app-e1407.appspot.com
```

## 方法3: 開発環境での一時的回避策

Firebase Storageのセキュリティルールを一時的に緩める：

1. [Firebase Console](https://console.firebase.google.com/project/react-firebase-app-e1407/storage) を開く
2. 「Rules」タブを選択
3. 以下のルールに変更（開発時のみ！）：

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // 開発時のみ - 本番環境では認証を必須にすること！
      allow read, write: if true;
    }
  }
}
```

## 注意事項

- 方法3は開発環境のみで使用してください
- 本番環境では必ず適切な認証とCORS設定を行ってください
- Cloud Shellを使う方法が最も確実です