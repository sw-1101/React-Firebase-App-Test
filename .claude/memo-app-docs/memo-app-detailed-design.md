# メモアプリ詳細設計書 v2.0 - LINE風紫系UI対応

## 1. 設計概要

### 1.1 要件定義書参照
- 音声・テキストメモの保存・検索アプリ
- コンセプト: 「ひらめきをパッと保存、パッと検索」
- 基本仕様: 音声録音（任意時間・手動停止）、自動文字起こし、LINE風タイムライン表示
- 新デザイン: 自分との対話を表現するLINE風チャット形式

### 1.2 技術スタック確認
- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: カスタムコンポーネント + Tailwind CSS + CSS Modules
- **Animation**: Framer Motion
- **State Management**: Context API
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Audio Processing**: Web Audio API
- **Speech-to-Text**: OpenAI Whisper API
- **Deployment**: Vercel

### 1.3 アーキテクチャ方針
- フロントエンドのみの構成（BaaS活用）
- リアルタイム同期（Firestore）
- PWA対応（オフライン機能）
- レスポンシブデザイン（モバイルファースト）
- Material-UI完全削除による軽量化

### 1.4 設計方針・原則
- **LINE風UI体験**: 親しみやすいメッセージング形式
- **紫系モダンデザイン**: 青紫〜純パープルのグラデーション
- **3色ルール遵守**: ベース（70%）・メイン（25%）・アクセント（5%）
- **共通規約準拠**: 責任分離、型安全性、エラーハンドリング
- **カスタムコンポーネント**: Atomic Design + 完全自作UI

## 2. システム構成・カラーパレット

### 2.1 全体アーキテクチャ
```
[LINE風UI Layer] ←→ [Custom Components] ←→ [Framer Motion]
        ↓
[React App] ←→ [Firebase Auth] ←→ [User Management]
     ↓
[Audio Recording] → [OpenAI Whisper] → [Text Processing]
     ↓                    ↓
[Firebase Storage] ← [Firestore] → [Real-time Sync]
     ↓                    ↓
[Message Timeline] ← [Search & Filter] ← [Chat Interface]
```

### 2.2 フロントエンド構成
- **SPA (Single Page Application)**
- **Client-side Routing**: React Router
- **State Management**: Context API + useReducer
- **Component Architecture**: Atomic Design
- **Styling**: Tailwind CSS + CSS Modules（Material-UI完全削除）
- **Animation**: Framer Motion（マイクロインタラクション）

### 2.3 カラーパレット設計（3色ルール）

#### ベースカラー（70%使用）
```css
/* プライマリ背景色 */
--base-primary: #FFFFFF;        /* メイン背景 */
--base-secondary: #F9FAFB;      /* セカンダリ背景・タイムライン */
--base-tertiary: #F3F4F6;       /* カード・入力エリア背景 */
--base-border: #E5E7EB;         /* ボーダー・区切り線 */
--base-text-primary: #111827;   /* メインテキスト */
--base-text-secondary: #6B7280; /* セカンダリテキスト */
```

#### メインカラー（25%使用）- 紫系グラデーション
```css
/* 紫系統のブランドカラー */
--main-primary: #7C3AED;        /* メインパープル - プライマリボタン */
--main-secondary: #6366F1;      /* 青紫 - グラデーション用 */
--main-light: #C4B5FD;          /* 薄紫 - 自分のメッセージバブル */
--main-dark: #5B21B6;           /* 濃紫 - アクティブ・ホバー状態 */
--main-gradient: linear-gradient(135deg, #7C3AED, #6366F1);
```

#### アクセントカラー（5%使用）
```css
/* 機能別アクセントカラー */
--accent-primary: #EC4899;      /* ピンク紫 - 録音・重要なアクション */
--accent-warning: #F59E0B;      /* アンバー - 警告・注意 */
--accent-success: #10B981;      /* エメラルド - 成功・完了 */
--accent-error: #EF4444;        /* レッド - エラー・削除 */
```

#### ダークモード対応
```css
/* ダークモードカラーセット */
--dark-base-primary: #1F2937;
--dark-base-secondary: #111827;
--dark-base-tertiary: #374151;
--dark-base-border: #4B5563;
--dark-text-primary: #F9FAFB;
--dark-text-secondary: #D1D5DB;
```

### 2.4 バックエンド構成
- **Authentication**: Firebase Auth（メール/Google）
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **External API**: OpenAI Whisper API
- **Real-time**: Firestore Real-time Listeners

### 2.5 外部サービス連携
- **OpenAI Whisper API**: 音声文字起こし
- **Firebase Services**: 認証・DB・ストレージ
- **Vercel**: ホスティング・デプロイ

## 3. ファイル構成設計（LINE風UI対応）

### 3.1 新ディレクトリ構造（カスタムコンポーネント）
```
src/
├── views/                          # 画面コンポーネント（APIアクセス可）
│   ├── MemoTimelinePage.tsx       # メインタイムライン画面（LINE風）
│   ├── LoginPage.tsx              # ログイン画面
│   └── SettingsPage.tsx           # 設定画面
├── components/                     # UIコンポーネント（Material-UI非依存）
│   ├── ui/                        # 基本UIコンポーネント
│   │   ├── Button/                # カスタムボタン
│   │   │   ├── Button.tsx
│   │   │   ├── Button.module.css
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   ├── Card/                  # カードコンポーネント
│   │   │   ├── Card.tsx
│   │   │   ├── Card.module.css
│   │   │   └── index.ts
│   │   ├── Input/                 # 入力フィールド
│   │   │   ├── Input.tsx
│   │   │   ├── Input.module.css
│   │   │   └── index.ts
│   │   ├── Modal/                 # モーダルベース
│   │   │   ├── Modal.tsx
│   │   │   ├── Modal.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── memo/                      # メモ機能コンポーネント
│   │   ├── MessageBubble/         # LINE風メッセージバブル
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── MessageBubble.module.css
│   │   │   └── index.ts
│   │   ├── Timeline/              # タイムライン
│   │   │   ├── Timeline.tsx
│   │   │   ├── Timeline.module.css
│   │   │   └── index.ts
│   │   ├── AudioMessage/          # 音声メッセージ
│   │   │   ├── AudioMessage.tsx
│   │   │   ├── AudioMessage.module.css
│   │   │   └── index.ts
│   │   ├── TextMessage/           # テキストメッセージ
│   │   │   ├── TextMessage.tsx
│   │   │   ├── TextMessage.module.css
│   │   │   └── index.ts
│   │   ├── InputArea/             # 入力エリア
│   │   │   ├── InputArea.tsx
│   │   │   ├── InputArea.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── layout/                    # レイアウトコンポーネント
│   │   ├── Header/                # ヘッダーバー
│   │   │   ├── Header.tsx
│   │   │   ├── Header.module.css
│   │   │   └── index.ts
│   │   ├── ChatLayout/            # チャットレイアウト
│   │   │   ├── ChatLayout.tsx
│   │   │   ├── ChatLayout.module.css
│   │   │   └── index.ts
│   │   └── FloatingButton/        # フローティングアクションボタン
│   │       ├── FloatingButton.tsx
│   │       ├── FloatingButton.module.css
│   │       └── index.ts
│   ├── modals/                    # モーダル系コンポーネント
│   │   ├── RecordingModal/        # 録音中モーダル（フルスクリーン）
│   │   │   ├── RecordingModal.tsx
│   │   │   ├── RecordingModal.module.css
│   │   │   └── index.ts
│   │   ├── TranscribingModal/     # 文字起こし中モーダル
│   │   │   ├── TranscribingModal.tsx
│   │   │   ├── TranscribingModal.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── feedback/                  # フィードバック系
│   │   ├── TrophyNotification/    # トロフィー風通知
│   │   │   ├── TrophyNotification.tsx
│   │   │   ├── TrophyNotification.module.css
│   │   │   └── index.ts
│   │   ├── LoadingSpinner/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── LoadingSpinner.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── audio/                     # 音声関連コンポーネント
│   │   ├── WaveformVisualizer/    # 波形アニメーション
│   │   │   ├── WaveformVisualizer.tsx
│   │   │   ├── WaveformVisualizer.module.css
│   │   │   └── index.ts
│   │   ├── AudioPlayer/           # 音声再生
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── AudioPlayer.module.css
│   │   │   └── index.ts
│   │   └── index.ts
│   └── index.ts
├── stores/                        # 状態管理
│   ├── AuthContext.tsx           # 認証状態
│   ├── MemoContext.tsx           # メモデータ状態
│   ├── UIContext.tsx             # UI状態（モーダル、テーマ等）
│   └── index.ts
├── services/                      # API・サービス層
│   ├── firebase/
│   │   ├── auth.ts               # Firebase認証
│   │   ├── firestore.ts          # Firestoreアクセス
│   │   ├── storage.ts            # Firebase Storage
│   │   └── index.ts
│   ├── audio/
│   │   ├── recorder.ts           # 音声録音
│   │   ├── whisper.ts            # OpenAI Whisper API
│   │   └── index.ts
│   └── utils/
│       ├── dateFormatter.ts
│       ├── audioUtils.ts
│       └── index.ts
├── types/                         # TypeScript型定義
│   ├── Memo.ts
│   ├── User.ts
│   ├── Audio.ts
│   ├── Message.ts                # メッセージ型（LINE風）
│   └── index.ts
├── hooks/                         # カスタムフック
│   ├── useAudioRecording.ts      # 音声録音フック
│   ├── useFirestore.ts           # Firestoreフック
│   ├── useAuth.ts                # 認証フック
│   ├── useTheme.ts               # テーマ切り替えフック
│   └── index.ts
├── constants/
│   ├── audioConfig.ts            # 音声設定
│   ├── uiConfig.ts              # UI設定（カラー・サイズ）
│   ├── colors.ts                 # カラーパレット定数
│   └── index.ts
├── styles/
│   ├── globals.css               # グローバルスタイル
│   ├── variables.css             # CSS変数（カラーパレット）
│   ├── animations.css            # アニメーション定義
│   └── tailwind.config.js        # Tailwind設定
├── utils/                         # ユーティリティ関数
│   ├── classNames.ts             # CSS Modules用クラス結合
│   ├── animations.ts             # Framer Motion設定
│   └── index.ts
├── App.tsx
└── main.tsx
```

### 3.2 CSS Modules + Tailwind構成
```
src/styles/
├── globals.css                    # Tailwind基本設定・グローバルスタイル
├── variables.css                  # カラーパレット・サイズ変数
├── animations.css                 # キーフレーム・アニメーション
└── components/                    # コンポーネント別スタイル
    ├── MessageBubble.module.css   # メッセージバブルスタイル
    ├── Timeline.module.css        # タイムラインスタイル
    ├── RecordingModal.module.css  # 録音モーダルスタイル
    └── ...
```

### 3.3 主要ファイル一覧（新UI対応）
| ファイル | 責務 | 技術要素 |
|---------|------|----------|
| MemoTimelinePage.tsx | メイン画面、LINE風レイアウト | Firestore Listener |
| MessageBubble.tsx | メッセージバブル（自分・システム） | CSS Modules + Tailwind |
| RecordingModal.tsx | 録音UI、波形表示 | Framer Motion + Web Audio |
| TranscribingModal.tsx | 文字起こし進行表示 | グラデーションアニメーション |
| Timeline.tsx | 無限スクロールタイムライン | 仮想スクロール + 日付グループ化 |
| AudioMessage.tsx | 音声メッセージバブル | HTML5 Audio + 波形可視化 |
| InputArea.tsx | LINE風入力エリア | 自動拡張テキストエリア |
| useAudioRecording.ts | 録音ロジック | MediaRecorder API |

### 3.4 命名規則適用
- **コンポーネント**: PascalCase (`MessageBubble.tsx`)
- **CSS Modules**: PascalCase + `.module.css` (`MessageBubble.module.css`)
- **フック**: camelCase with "use" prefix (`useAudioRecording.ts`)
- **型定義**: PascalCase (`Message.ts`, `AudioRecording.ts`)
- **サービス**: camelCase (`audioRecorder.ts`)

### 3.5 依存関係・Material-UI移行
```typescript
// 新しい依存関係
// views層 → components/memo → components/ui → components/layout
// CSS Modules層 → Tailwind Utility Classes
// Framer Motion → マイクロインタラクション
// services層 → 外部API・Firebase（変更なし）
// hooks層 → services層 + UI制御
// stores層 → services層・hooks層（変更なし）

// Material-UI削除による変更
// 削除: @mui/material, @mui/icons-material, @emotion/*
// 追加: framer-motion, classnames (CSS Modules用)
```

## 4. コンポーネント設計（LINE風UI）

### 4.1 コンポーネント階層（Atomic Design + LINE風）

#### Atoms（原子）- 基本UIコンポーネント
```typescript
// Button.tsx - カスタムボタン（Material-UI代替）
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

// Input.tsx - カスタム入力フィールド
interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoResize?: boolean; // LINE風自動拡張
  maxRows?: number;
  className?: string;
}

// Card.tsx - カードベース
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  className?: string;
}

// Modal.tsx - モーダルベース
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  fullScreen?: boolean; // 録音モーダル用
  backdrop?: 'blur' | 'dark' | 'transparent';
}
```

#### Molecules（分子）- LINE風メッセージング
```typescript
// MessageBubble.tsx - LINE風メッセージバブル
interface MessageBubbleProps {
  type: 'own' | 'system';
  children: React.ReactNode;
  timestamp: Date;
  showTime?: boolean;
  className?: string;
}

// AudioMessage.tsx - 音声メッセージ
interface AudioMessageProps {
  audioUrl: string;
  duration: number;
  transcription?: string;
  timestamp: Date;
  isPlaying?: boolean;
  onPlay: () => void;
  onPause: () => void;
}

// TextMessage.tsx - テキストメッセージ
interface TextMessageProps {
  content: string;
  timestamp: Date;
  type: 'own' | 'system';
  showTime?: boolean;
}

// InputArea.tsx - LINE風入力エリア
interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onStartRecording: () => void;
  disabled?: boolean;
  placeholder?: string;
}
```

#### Organisms（組織）- 複合コンポーネント
```typescript
// Timeline.tsx - LINE風タイムライン
interface TimelineProps {
  messages: Message[];
  loading: boolean;
  hasMore: boolean;
  currentPlayingId?: string;
  onLoadMore: () => void;
  onPlayAudio: (messageId: string) => void;
  onDeleteMessage: (messageId: string) => void;
}

// RecordingModal.tsx - 録音フルスクリーンモーダル
interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioBlob: Blob) => void;
  maxDuration?: number;
  showWaveform?: boolean;
}

// TranscribingModal.tsx - 文字起こし処理モーダル
interface TranscribingModalProps {
  isOpen: boolean;
  progress: number;
  stage: 'uploading' | 'transcribing' | 'saving';
  message?: string;
}

// Header.tsx - アプリヘッダー
interface HeaderProps {
  title: string;
  onSearchToggle?: () => void;
  onThemeToggle?: () => void;
  onSettingsClick?: () => void;
  searchVisible?: boolean;
}
```

#### Templates（テンプレート）- レイアウト
```typescript
// ChatLayout.tsx - チャットアプリレイアウト
interface ChatLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  inputArea?: React.ReactNode;
  floatingButton?: React.ReactNode;
  className?: string;
}

// AuthLayout.tsx - 認証画面レイアウト
interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}
```

### 4.2 重要コンポーネント実装例

#### MessageBubble（LINE風メッセージバブル）
```typescript
// components/memo/MessageBubble/MessageBubble.tsx
import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  type: 'own' | 'system';
  children: React.ReactNode;
  timestamp: Date;
  showTime?: boolean;
  className?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  children,
  timestamp,
  showTime = true,
  className
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={classNames(
        styles.container,
        styles[type],
        className
      )}
    >
      <div className={classNames(styles.bubble, styles[type])}>
        {children}
      </div>
      {showTime && (
        <span className={styles.timestamp}>
          {formatTime(timestamp)}
        </span>
      )}
    </motion.div>
  );
};

export default MessageBubble;
```

```css
/* components/memo/MessageBubble/MessageBubble.module.css */
.container {
  @apply flex flex-col mb-2;
}

.container.own {
  @apply items-end;
}

.container.system {
  @apply items-start;
}

.bubble {
  @apply max-w-[70%] px-4 py-3 rounded-[18px] break-words;
  word-wrap: break-word;
}

.bubble.own {
  @apply text-white;
  background: var(--main-gradient);
  border-radius: 18px 18px 4px 18px;
  box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25);
}

.bubble.system {
  @apply bg-base-tertiary text-base-text-primary;
  border-radius: 18px 18px 18px 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.timestamp {
  @apply text-xs text-base-text-secondary mt-1 px-2;
}

.container.own .timestamp {
  @apply text-right;
}

.container.system .timestamp {
  @apply text-left;
}
```

#### RecordingModal（録音フルスクリーンモーダル）
```typescript
// components/modals/RecordingModal/RecordingModal.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import { Modal } from '@/components/ui';
import { WaveformVisualizer } from '@/components/audio';
import styles from './RecordingModal.module.css';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioBlob: Blob) => void;
  maxDuration?: number;
  showWaveform?: boolean;
}

const RecordingModal: React.FC<RecordingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  maxDuration = 60,
  showWaveform = true
}) => {
  const [duration, setDuration] = useState(0);
  const [audioData, setAudioData] = useState<Float32Array>(new Float32Array());

  useEffect(() => {
    if (!isOpen) {
      setDuration(0);
      return;
    }

    const interval = setInterval(() => {
      setDuration(prev => {
        if (prev >= maxDuration) {
          handleStop();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, maxDuration]);

  const handleStop = () => {
    // 実際の録音停止ロジックはuseAudioRecordingフックで処理
    onComplete(new Blob()); // 実際のaudioBlobを渡す
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (duration / maxDuration) * 100;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen
      backdrop="dark"
    >
      <div className={styles.container}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.title}
        >
          音声録音中
        </motion.h1>
        
        {showWaveform && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.waveformContainer}
          >
            <WaveformVisualizer
              audioData={audioData}
              isRecording={true}
              duration={duration}
            />
          </motion.div>
        )}
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={styles.timeDisplay}
        >
          {formatTime(duration)} / {formatTime(maxDuration)}
        </motion.div>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80%' }}
          transition={{ delay: 0.4 }}
          className={styles.progressContainer}
        >
          <div 
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className={styles.buttonContainer}
        >
          <button
            onClick={handleStop}
            className={classNames(styles.actionButton, styles.stopButton)}
          >
            <span className={styles.buttonIcon}>⏹</span>
            停止
          </button>
          
          <button
            onClick={handleStop}
            className={classNames(styles.actionButton, styles.completeButton)}
          >
            <span className={styles.buttonIcon}>✓</span>
            完了
          </button>
        </motion.div>
      </div>
    </Modal>
  );
};

export default RecordingModal;
```

```css
/* components/modals/RecordingModal/RecordingModal.module.css */
.container {
  @apply flex flex-col items-center justify-center h-full p-8;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.95), rgba(17, 24, 39, 0.95));
  backdrop-filter: blur(20px);
}

.title {
  @apply text-4xl font-bold text-white mb-8;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.waveformContainer {
  @apply mb-8;
}

.timeDisplay {
  @apply text-6xl font-mono text-white mb-6;
  text-shadow: 0 2px 8px rgba(124, 58, 237, 0.5);
}

.progressContainer {
  @apply h-2 bg-gray-700 rounded-full mb-8 relative overflow-hidden;
}

.progressBar {
  @apply h-full rounded-full transition-all duration-1000 ease-out;
  background: var(--main-gradient);
  box-shadow: 0 0 10px rgba(124, 58, 237, 0.5);
}

.buttonContainer {
  @apply flex gap-6;
}

.actionButton {
  @apply flex flex-col items-center justify-center w-20 h-20 rounded-full text-white font-semibold transition-all duration-200;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.actionButton:hover {
  @apply transform scale-105;
}

.actionButton:active {
  @apply transform scale-95;
}

.stopButton {
  background: linear-gradient(135deg, #EF4444, #DC2626);
}

.stopButton:hover {
  background: linear-gradient(135deg, #DC2626, #B91C1C);
}

.completeButton {
  background: var(--main-gradient);
}

.completeButton:hover {
  background: linear-gradient(135deg, #6366F1, #5B21B6);
}

.buttonIcon {
  @apply text-2xl mb-1;
}
```

### 4.3 スタイル設定・アニメーション設計

#### globals.css（Tailwind + CSS変数）
```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* CSS変数定義 */
:root {
  /* ベースカラー */
  --base-primary: #FFFFFF;
  --base-secondary: #F9FAFB;
  --base-tertiary: #F3F4F6;
  --base-border: #E5E7EB;
  --base-text-primary: #111827;
  --base-text-secondary: #6B7280;
  
  /* メインカラー */
  --main-primary: #7C3AED;
  --main-secondary: #6366F1;
  --main-light: #C4B5FD;
  --main-dark: #5B21B6;
  --main-gradient: linear-gradient(135deg, #7C3AED, #6366F1);
  
  /* アクセントカラー */
  --accent-primary: #EC4899;
  --accent-warning: #F59E0B;
  --accent-success: #10B981;
  --accent-error: #EF4444;
}

/* ダークモード */
[data-theme="dark"] {
  --base-primary: #1F2937;
  --base-secondary: #111827;
  --base-tertiary: #374151;
  --base-border: #4B5563;
  --base-text-primary: #F9FAFB;
  --base-text-secondary: #D1D5DB;
}

/* グローバルスタイル */
* {
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans JP', sans-serif;
  background-color: var(--base-secondary);
  color: var(--base-text-primary);
  margin: 0;
  padding: 0;
  line-height: 1.6;
}

/* スクロールバー */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--base-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--main-primary);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--main-dark);
}

/* フォーカス */
*:focus {
  outline: 2px solid var(--main-primary);
  outline-offset: 2px;
}

/* アニメーション */
.fade-in {
  animation: fadeIn 0.3s ease-out;
}

.slide-in-up {
  animation: slideInUp 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInUp {
  from { 
    opacity: 0; 
    transform: translateY(20px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}
```

#### Tailwind設定（tailwind.config.js）
```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // カスタムカラーパレット
        'base-primary': 'var(--base-primary)',
        'base-secondary': 'var(--base-secondary)',
        'base-tertiary': 'var(--base-tertiary)',
        'base-border': 'var(--base-border)',
        'base-text-primary': 'var(--base-text-primary)',
        'base-text-secondary': 'var(--base-text-secondary)',
        
        'main-primary': 'var(--main-primary)',
        'main-secondary': 'var(--main-secondary)',
        'main-light': 'var(--main-light)',
        'main-dark': 'var(--main-dark)',
        
        'accent-primary': 'var(--accent-primary)',
        'accent-warning': 'var(--accent-warning)',
        'accent-success': 'var(--accent-success)',
        'accent-error': 'var(--accent-error)',
      },
      spacing: {
        '18': '4.5rem', // 72px (メッセージバブル用)
        '88': '22rem',   // 352px
        '128': '32rem',  // 512px
      },
      borderRadius: {
        'bubble': '18px', // LINE風角丸
      },
      fontFamily: {
        'sans': [
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'Noto Sans JP', 
          'sans-serif'
        ],
      },
      boxShadow: {
        'bubble': '0 2px 8px rgba(124, 58, 237, 0.25)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'modal': '0 4px 20px rgba(124, 58, 237, 0.4)',
      },
      animation: {
        'pulse-recording': 'pulse-recording 1.5s ease-in-out infinite',
        'trophy-slide': 'trophy-slide 3s ease-in-out',
      },
      keyframes: {
        'pulse-recording': {
          '0%, 100%': { 
            transform: 'scale(1)', 
            boxShadow: '0 0 0 0 rgba(236, 72, 153, 0.7)' 
          },
          '50%': { 
            transform: 'scale(1.05)', 
            boxShadow: '0 0 0 10px rgba(236, 72, 153, 0)' 
          },
        },
        'trophy-slide': {
          '0%': { transform: 'translateX(100%)' },
          '10%': { transform: 'translateX(0)' },
          '90%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
  darkMode: ['class', '[data-theme="dark"]'],
}
```

## 5. 実装優先順位・移行計画

### 5.1 Phase 1: 基盤構築（Material-UI削除）
#### 優先度: 最高 🔥
1. **カラーパレット・CSS変数設定**
   - `globals.css`、`tailwind.config.js`作成
   - CSS変数によるテーマシステム構築

2. **基本UIコンポーネント**
   - `Button`、`Input`、`Card`、`Modal`コンポーネント
   - CSS Modules + Tailwindによる実装

3. **レイアウトコンポーネント**
   - `ChatLayout`、`Header`コンポーネント
   - LINE風レスポンシブレイアウト

### 5.2 Phase 2: メッセージング機能（LINE風UI）
#### 優先度: 高 ⭐
1. **MessageBubble実装**
   - 自分・システムメッセージ対応
   - Framer Motionアニメーション追加

2. **Timeline機能**
   - 無限スクロール、日付グループ化
   - メッセージ送信・表示ロジック

3. **InputArea実装**
   - 自動拡張テキストエリア
   - 🎤ボタン統合

### 5.3 Phase 3: 録音・音声機能
#### 優先度: 高 ⭐
1. **RecordingModal実装**
   - フルスクリーンモーダル
   - 波形アニメーション、プログレス表示

2. **AudioMessage実装**
   - 音声再生、波形可視化
   - 再生状態管理

3. **音声録音・文字起こし機能**
   - 既存のuseAudioRecordingフック活用
   - UI統合

### 5.4 Phase 4: 仕上げ・最適化
#### 優先度: 中 📝
1. **アニメーション・マイクロインタラクション**
   - メッセージ送信アニメーション
   - トロフィー風通知
   - ホバー・フォーカス効果

2. **ダークモード対応**
   - テーマ切り替え機能
   - CSS変数活用

3. **アクセシビリティ対応**
   - キーボードナビゲーション
   - スクリーンリーダー対応

## 6. 技術移行・削除内容

### 6.1 削除対象（Material-UI関連）
```json
// package.json - 削除対象
{
  "dependencies": {
    "@mui/material": "^5.x.x",
    "@mui/icons-material": "^5.x.x",
    "@emotion/react": "^11.x.x",
    "@emotion/styled": "^11.x.x"
  }
}
```

### 6.2 追加対象（新UI技術）
```json
// package.json - 追加対象
{
  "dependencies": {
    "framer-motion": "^10.x.x",
    "classnames": "^2.x.x"
  },
  "devDependencies": {
    "@types/classnames": "^2.x.x"
  }
}
```

### 6.3 移行作業マップ
| 旧コンポーネント | 新コンポーネント | 移行作業 |
|------------------|------------------|----------|
| `@mui/material/Fab` | `FloatingButton.tsx` | カスタム実装 |
| `@mui/material/Dialog` | `Modal.tsx` | ベースコンポーネント作成 |
| `@mui/material/List` | `Timeline.tsx` | LINE風レイアウト |
| `@mui/material/Card` | `MessageBubble.tsx` | バブル形状実装 |
| `@mui/material/TextField` | `Input.tsx` | 自動拡張機能 |
| Material-UIテーマ | CSS変数システム | 完全置き換え |

## 7. 品質保証・テスト戦略

### 7.1 視覚回帰テスト
- **Storybook**: 全カスタムコンポーネントのStory作成
- **Chromatic**: 視覚的差分検出（Material-UI→カスタムUI）

### 7.2 ユーザビリティテスト
- **LINE風UI**: 使いやすさの検証
- **タッチ操作**: モバイルでのタップ精度確認
- **アニメーション**: 過剰でないか、快適性確認

### 7.3 パフォーマンステスト
- **バンドルサイズ**: Material-UI削除による軽量化測定
- **レンダリング**: 大量メッセージでの描画性能
- **メモリ**: 長時間利用時のメモリリーク検証

## 8. 完了チェックリスト

### 基盤・設計 ✅
- [x] 要件定義書との整合性確認
- [x] UI設計書との整合性確認  
- [x] カラーパレット・CSS変数定義
- [x] ファイル構成設計更新
- [x] コンポーネント設計（Atomic Design + LINE風）

### 技術設計 ✅
- [x] Material-UI完全削除計画
- [x] Tailwind CSS + CSS Modules設計
- [x] Framer Motionアニメーション設計
- [x] レスポンシブデザイン設計

### 実装指針 ✅
- [x] 実装優先順位明確化
- [x] 移行作業マップ作成
- [x] パフォーマンス最適化方針
- [x] テスト戦略定義

---

## 改版履歴
- **v2.0 (2024-08-10)**: LINE風紫系UIへ全面刷新、Material-UI削除、カスタムコンポーネント設計
- **v1.0 (2024-08-03)**: 初版作成（Material-UI基盤）

**次ステップ**: UI実装開始（Phase 1: 基盤構築）