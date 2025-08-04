#!/bin/bash

echo "Firebase Storage CORS設定スクリプト"
echo "=================================="
echo ""

# Google Cloud SDKのインストール確認
if ! command -v gcloud &> /dev/null; then
    echo "Google Cloud SDKがインストールされていません。"
    echo ""
    echo "インストール方法:"
    echo "1. Homebrewを使用（macOS）:"
    echo "   brew install --cask google-cloud-sdk"
    echo ""
    echo "2. 公式インストーラを使用:"
    echo "   https://cloud.google.com/sdk/docs/install"
    echo ""
    echo "インストール後、このスクリプトを再実行してください。"
    exit 1
fi

# プロジェクトID
PROJECT_ID="react-firebase-app-e1407"
BUCKET_NAME="gs://react-firebase-app-e1407.appspot.com"

echo "プロジェクト: $PROJECT_ID"
echo "バケット: $BUCKET_NAME"
echo ""

# ログイン確認
echo "Google Cloudにログインしています..."
gcloud auth login

# プロジェクト設定
echo "プロジェクトを設定中..."
gcloud config set project $PROJECT_ID

# CORS設定を適用
echo "CORS設定を適用中..."
gsutil cors set cors.json $BUCKET_NAME

# 設定確認
echo ""
echo "現在のCORS設定:"
gsutil cors get $BUCKET_NAME

echo ""
echo "✅ CORS設定が完了しました！"
echo "ブラウザをリロードして、音声アップロードを再試行してください。"