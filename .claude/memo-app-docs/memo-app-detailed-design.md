# メモアプリ詳細設計書

## 1. 設計概要

### 1.1 要件定義書参照
- 音声・テキストメモの保存・検索アプリ
- コンセプト: 「ひらめきをパッと保存、パッと検索」
- 基本仕様: 音声録音（30秒〜1分）、自動文字起こし、タイムライン表示

### 1.2 技術スタック確認
- **Frontend**: React 19 + TypeScript + Vite
- **UI Framework**: Material-UI + Tailwind CSS
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

### 1.4 設計方針・原則
- 共通規約準拠（責任分離、型安全性、エラーハンドリング）
- Atomic Design適用
- アクセシビリティ対応
- パフォーマンス最適化

## 2. システム構成

### 2.1 全体アーキテクチャ
```
[React App] ←→ [Firebase Auth] ←→ [User Management]
     ↓
[Audio Recording] → [OpenAI Whisper] → [Text Processing]
     ↓                    ↓
[Firebase Storage] ← [Firestore] → [Real-time Sync]
     ↓                    ↓
[Timeline View] ← [Search & Filter] ← [User Interface]
```

### 2.2 フロントエンド構成
- **SPA (Single Page Application)**
- **Client-side Routing**: React Router
- **State Management**: Context API + useReducer
- **Component Architecture**: Atomic Design
- **Styling**: Material-UI + Tailwind CSS

### 2.3 バックエンド構成
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **File Storage**: Firebase Storage
- **External API**: OpenAI Whisper API
- **Real-time**: Firestore Real-time Listeners

### 2.4 外部サービス連携
- **OpenAI Whisper API**: 音声文字起こし
- **Firebase Services**: 認証・DB・ストレージ
- **Vercel**: ホスティング・デプロイ

## 3. ファイル構成設計

### 3.1 ディレクトリ構造
```
src/
├── views/                          # 画面コンポーネント（APIアクセス可）
│   ├── MemoListPage.tsx           # メインタイムライン画面
│   ├── LoginPage.tsx              # ログイン画面
│   └── SettingsPage.tsx           # 設定画面
├── components/                     # UIコンポーネント
│   ├── common/                    # 汎用コンポーネント
│   │   ├── buttons/
│   │   │   ├── FloatingActionButton.tsx  # 🎤 録音ボタン
│   │   │   ├── IconButton.tsx
│   │   │   └── index.ts
│   │   ├── forms/
│   │   │   ├── TextInput.tsx
│   │   │   ├── SearchBox.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx
│   │   │   ├── AppLayout.tsx
│   │   │   └── index.ts
│   │   ├── modals/
│   │   │   ├── RecordingModal.tsx     # 録音中モーダル
│   │   │   ├── TranscribingModal.tsx  # 文字起こし中モーダル
│   │   │   ├── ConfirmModal.tsx
│   │   │   └── index.ts
│   │   ├── feedback/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   ├── SuccessToast.tsx       # PSトロフィー風通知
│   │   │   └── index.ts
│   │   └── audio/
│   │       ├── WaveformVisualizer.tsx  # 波形アニメーション
│   │       ├── AudioPlayer.tsx         # 音声再生
│   │       └── index.ts
│   └── pages/                     # 画面専用コンポーネント
│       ├── memo/
│       │   ├── MemoTimeline.tsx       # タイムライン表示
│       │   ├── MemoCard.tsx           # 個別メモカード
│       │   ├── MemoInput.tsx          # テキスト入力エリア
│       │   └── index.ts
│       └── auth/
│           ├── LoginForm.tsx
│           └── index.ts
├── stores/                        # 状態管理
│   ├── AuthContext.tsx           # 認証状態
│   ├── MemoContext.tsx           # メモデータ状態
│   ├── UIContext.tsx             # UI状態（モーダル等）
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
│   └── index.ts
├── hooks/                         # カスタムフック
│   ├── useAudioRecording.ts      # 音声録音フック
│   ├── useFirestore.ts           # Firestoreフック
│   ├── useAuth.ts                # 認証フック
│   └── index.ts
├── constants/
│   ├── audioConfig.ts            # 音声設定
│   ├── uiConfig.ts              # UI設定
│   └── index.ts
├── styles/
│   ├── globals.css
│   ├── theme.ts                  # Material-UIテーマ
│   └── tailwind.config.js
├── App.tsx
└── main.tsx
```

### 3.2 主要ファイル一覧
| ファイル | 責務 | 技術要素 |
|---------|------|----------|
| MemoListPage.tsx | メイン画面、データ取得 | Firestore Listener |
| RecordingModal.tsx | 録音UI、波形表示 | Web Audio API |
| TranscribingModal.tsx | 文字起こし進行表示 | OpenAI API |
| MemoTimeline.tsx | タイムライン表示 | 仮想スクロール |
| AudioPlayer.tsx | 音声再生 | HTML5 Audio |
| useAudioRecording.ts | 録音ロジック | MediaRecorder API |

### 3.3 命名規則適用
- **コンポーネント**: PascalCase (`MemoCard.tsx`)
- **フック**: camelCase with "use" prefix (`useAudioRecording.ts`)
- **型定義**: PascalCase (`Memo.ts`, `AudioRecording.ts`)
- **サービス**: camelCase (`audioRecorder.ts`)

### 3.4 依存関係
```typescript
// views層 → components/pages → components/common
// services層 → 外部API・Firebase
// hooks層 → services層
// stores層 → services層・hooks層
```

## 4. コンポーネント設計

### 4.1 コンポーネント階層（Atomic Design）

#### Atoms（原子）
```typescript
// FloatingActionButton.tsx - 録音開始ボタン
interface FloatingActionButtonProps {
  onClick: () => void;
  recording: boolean;
  disabled?: boolean;
}

// IconButton.tsx - 汎用アイコンボタン
interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

// WaveformVisualizer.tsx - 波形表示
interface WaveformVisualizerProps {
  audioData: Float32Array;
  isRecording: boolean;
  duration: number;
}

// AudioPlayer.tsx - 音声再生
interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
  onPlay?: () => void;
  onPause?: () => void;
}
```

#### Molecules（分子）
```typescript
// MemoCard.tsx - 個別メモ表示
interface MemoCardProps {
  memo: Memo;
  onPlay: (audioUrl: string) => void;
  onDelete: (memoId: string) => void;
}

// MemoInput.tsx - テキスト入力
interface MemoInputProps {
  onSubmit: (text: string) => void;
  onStartRecording: () => void;
  disabled?: boolean;
}

// SearchBox.tsx - 検索入力
interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}
```

#### Organisms（組織）
```typescript
// MemoTimeline.tsx - タイムライン全体
interface MemoTimelineProps {
  memos: Memo[];
  loading: boolean;
  onLoadMore: () => void;
  onPlayAudio: (audioUrl: string) => void;
}

// RecordingModal.tsx - 録音モーダル
interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioBlob: Blob) => void;
  maxDuration: number;
}

// TranscribingModal.tsx - 文字起こしモーダル
interface TranscribingModalProps {
  isOpen: boolean;
  progress: number;
  message: string;
}
```

#### Templates（テンプレート）
```typescript
// AppLayout.tsx - アプリ全体レイアウト
interface AppLayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  showFloatingButton?: boolean;
}
```

### 4.2 共通コンポーネント

#### FloatingActionButton（録音ボタン）
```typescript
// components/common/buttons/FloatingActionButton.tsx
import React from 'react';
import { Fab } from '@mui/material';
import { Mic, Stop } from '@mui/icons-material';

interface FloatingActionButtonProps {
  recording: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  recording,
  onClick,
  disabled = false
}) => {
  return (
    <Fab
      color={recording ? "secondary" : "primary"}
      onClick={onClick}
      disabled={disabled}
      sx={{
        position: 'fixed',
        bottom: 80,
        right: 16,
        animation: recording ? 'pulse 1s infinite' : 'none',
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' }
        }
      }}
    >
      {recording ? <Stop /> : <Mic />}
    </Fab>
  );
};

export default FloatingActionButton;
```

#### RecordingModal（録音モーダル）
```typescript
// components/common/modals/RecordingModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  IconButton,
  Box,
  LinearProgress
} from '@mui/material';
import { Stop, CheckCircle } from '@mui/icons-material';
import { WaveformVisualizer } from '@/components/common/audio';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (audioBlob: Blob) => void;
  maxDuration?: number;
}

const RecordingModal: React.FC<RecordingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  maxDuration = 60
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
    // 録音停止ロジック
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
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullScreen
      sx={{ '& .MuiDialog-paper': { bgcolor: 'black', color: 'white' } }}
    >
      <DialogContent sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <Typography variant="h4" sx={{ mb: 4, color: 'white' }}>
          録音中
        </Typography>
        
        <WaveformVisualizer
          audioData={audioData}
          isRecording={true}
          duration={duration}
        />
        
        <Typography variant="h2" sx={{ my: 4, color: 'white' }}>
          {formatTime(duration)}
        </Typography>
        
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ width: '80%', mb: 4 }}
        />
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <IconButton
            onClick={handleStop}
            sx={{ 
              bgcolor: 'red', 
              color: 'white',
              width: 80,
              height: 80,
              '&:hover': { bgcolor: 'darkred' }
            }}
          >
            <Stop fontSize="large" />
          </IconButton>
          
          <IconButton
            onClick={handleStop}
            sx={{ 
              bgcolor: 'green', 
              color: 'white',
              width: 80,
              height: 80,
              '&:hover': { bgcolor: 'darkgreen' }
            }}
          >
            <CheckCircle fontSize="large" />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingModal;
```

### 4.3 ページコンポーネント

#### MemoTimeline（タイムライン表示）
```typescript
// components/pages/memo/MemoTimeline.tsx
import React from 'react';
import { 
  List, 
  ListItem, 
  Divider, 
  Typography, 
  Box 
} from '@mui/material';
import { MemoCard } from './MemoCard';
import { Memo } from '@/types';

interface MemoTimelineProps {
  memos: Memo[];
  loading: boolean;
  onPlayAudio: (audioUrl: string) => void;
  onDeleteMemo: (memoId: string) => void;
}

const MemoTimeline: React.FC<MemoTimelineProps> = ({
  memos,
  loading,
  onPlayAudio,
  onDeleteMemo
}) => {
  // 日付でグループ化
  const groupedMemos = memos.reduce((groups, memo) => {
    const date = memo.createdAt.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(memo);
    return groups;
  }, {} as Record<string, Memo[]>);

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('ja-JP', {
        month: 'long',
        day: 'numeric'
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {Object.entries(groupedMemos).map(([dateString, dayMemos]) => (
        <Box key={dateString}>
          <Typography
            variant="h6"
            sx={{
              px: 2,
              py: 1,
              bgcolor: 'grey.100',
              color: 'text.secondary',
              fontWeight: 'bold'
            }}
          >
            {formatDateHeader(dateString)}
          </Typography>
          
          {dayMemos.map((memo, index) => (
            <React.Fragment key={memo.id}>
              <ListItem sx={{ px: 1 }}>
                <MemoCard
                  memo={memo}
                  onPlay={() => onPlayAudio(memo.audioUrl)}
                  onDelete={() => onDeleteMemo(memo.id)}
                />
              </ListItem>
              {index < dayMemos.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Box>
      ))}
    </List>
  );
};

export default MemoTimeline;
```

#### MemoCard（個別メモカード）
```typescript
// components/pages/memo/MemoCard.tsx
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Delete,
  MusicNote
} from '@mui/icons-material';
import { Memo } from '@/types';

interface MemoCardProps {
  memo: Memo;
  onPlay: () => void;
  onDelete: () => void;
  isPlaying?: boolean;
}

const MemoCard: React.FC<MemoCardProps> = ({
  memo,
  onPlay,
  onDelete,
  isPlaying = false
}) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString('ja-JP', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      sx={{ 
        width: '100%', 
        mb: 1,
        boxShadow: 1,
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            💭 {memo.title || 'メモ'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatTime(memo.createdAt)}
          </Typography>
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          "{memo.transcription || memo.textContent}"
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={onPlay}
              size="small"
              sx={{ 
                bgcolor: isPlaying ? 'secondary.main' : 'primary.main',
                color: 'white',
                '&:hover': { 
                  bgcolor: isPlaying ? 'secondary.dark' : 'primary.dark' 
                }
              }}
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
            
            <Chip
              icon={<MusicNote />}
              label={formatDuration(memo.duration)}
              size="small"
              variant="outlined"
            />
          </Box>
          
          <IconButton
            onClick={onDelete}
            size="small"
            sx={{ color: 'error.main' }}
          >
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemoCard;
```

### 4.4 Storybook設定

#### Button Stories
```typescript
// components/common/buttons/FloatingActionButton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { FloatingActionButton } from './FloatingActionButton';

const meta: Meta<typeof FloatingActionButton> = {
  title: 'Common/Buttons/FloatingActionButton',
  component: FloatingActionButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    recording: {
      control: 'boolean',
      description: '録音中かどうか',
    },
    disabled: {
      control: 'boolean',
      description: '無効状態',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    recording: false,
    onClick: () => console.log('録音開始'),
  },
};

export const Recording: Story = {
  args: {
    recording: true,
    onClick: () => console.log('録音停止'),
  },
};

export const Disabled: Story = {
  args: {
    recording: false,
    disabled: true,
    onClick: () => console.log('無効状態'),
  },
};
```

## 5. 状態管理設計

### 5.1 状態管理戦略
- **Local State**: コンポーネント内部状態（useState）
- **Global State**: Context API + useReducer
- **Server State**: カスタムフック（useFirestore）
- **Derived State**: useMemo、useCallback

### 5.2 Context構成

#### AuthContext（認証状態）
```typescript
// stores/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/services/firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: User | null }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { user: action.payload, loading: false, error: null };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { user: null, loading: false, error: null };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((user) => {
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    });
    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      await authService.login(email, password);
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error instanceof Error ? error.message : 'ログインに失敗しました' 
      });
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error instanceof Error ? error.message : 'ログアウトに失敗しました' 
      });
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_LOADING' });
      await authService.signUp(email, password);
    } catch (error) {
      dispatch({ 
        type: 'AUTH_ERROR', 
        payload: error instanceof Error ? error.message : '登録に失敗しました' 
      });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

#### MemoContext（メモデータ状態）
```typescript
// stores/MemoContext.tsx
import React, { createContext, useContext, useReducer } from 'react';
import { Memo } from '@/types';

interface MemoState {
  memos: Memo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
}

type MemoAction =
  | { type: 'MEMOS_LOADING' }
  | { type: 'MEMOS_LOADED'; payload: { memos: Memo[]; hasMore: boolean } }
  | { type: 'MEMO_ADDED'; payload: Memo }
  | { type: 'MEMO_UPDATED'; payload: Memo }
  | { type: 'MEMO_DELETED'; payload: string }
  | { type: 'MEMOS_ERROR'; payload: string }
  | { type: 'MEMOS_RESET' };

const memoReducer = (state: MemoState, action: MemoAction): MemoState => {
  switch (action.type) {
    case 'MEMOS_LOADING':
      return { ...state, loading: true, error: null };
    case 'MEMOS_LOADED':
      return {
        ...state,
        memos: action.payload.memos,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null
      };
    case 'MEMO_ADDED':
      return {
        ...state,
        memos: [action.payload, ...state.memos]
      };
    case 'MEMO_UPDATED':
      return {
        ...state,
        memos: state.memos.map(memo =>
          memo.id === action.payload.id ? action.payload : memo
        )
      };
    case 'MEMO_DELETED':
      return {
        ...state,
        memos: state.memos.filter(memo => memo.id !== action.payload)
      };
    case 'MEMOS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'MEMOS_RESET':
      return { memos: [], loading: false, error: null, hasMore: true };
    default:
      return state;
  }
};

interface MemoContextType extends MemoState {
  loadMemos: () => Promise<void>;
  addMemo: (memo: Omit<Memo, 'id' | 'createdAt'>) => Promise<void>;
  updateMemo: (id: string, updates: Partial<Memo>) => Promise<void>;
  deleteMemo: (id: string) => Promise<void>;
  searchMemos: (query: string) => Promise<void>;
}

const MemoContext = createContext<MemoContextType | undefined>(undefined);

export const MemoProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(memoReducer, {
    memos: [],
    loading: false,
    error: null,
    hasMore: true
  });

  // 実装は後述のサービス層で詳細化
  const loadMemos = async () => {
    // firestoreService.getMemos() 実装
  };

  const addMemo = async (memo: Omit<Memo, 'id' | 'createdAt'>) => {
    // firestoreService.addMemo() 実装
  };

  const updateMemo = async (id: string, updates: Partial<Memo>) => {
    // firestoreService.updateMemo() 実装
  };

  const deleteMemo = async (id: string) => {
    // firestoreService.deleteMemo() 実装
  };

  const searchMemos = async (query: string) => {
    // firestoreService.searchMemos() 実装
  };

  return (
    <MemoContext.Provider value={{
      ...state,
      loadMemos,
      addMemo,
      updateMemo,
      deleteMemo,
      searchMemos
    }}>
      {children}
    </MemoContext.Provider>
  );
};

export const useMemos = () => {
  const context = useContext(MemoContext);
  if (!context) {
    throw new Error('useMemos must be used within a MemoProvider');
  }
  return context;
};
```

#### UIContext（UI状態）
```typescript
// stores/UIContext.tsx
import React, { createContext, useContext, useReducer } from 'react';

interface UIState {
  recordingModalOpen: boolean;
  transcribingModalOpen: boolean;
  currentlyPlaying: string | null;
  searchQuery: string;
  theme: 'light' | 'dark';
}

type UIAction =
  | { type: 'OPEN_RECORDING_MODAL' }
  | { type: 'CLOSE_RECORDING_MODAL' }
  | { type: 'OPEN_TRANSCRIBING_MODAL' }
  | { type: 'CLOSE_TRANSCRIBING_MODAL' }
  | { type: 'SET_CURRENTLY_PLAYING'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'TOGGLE_THEME' };

const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    case 'OPEN_RECORDING_MODAL':
      return { ...state, recordingModalOpen: true };
    case 'CLOSE_RECORDING_MODAL':
      return { ...state, recordingModalOpen: false };
    case 'OPEN_TRANSCRIBING_MODAL':
      return { ...state, transcribingModalOpen: true };
    case 'CLOSE_TRANSCRIBING_MODAL':
      return { ...state, transcribingModalOpen: false };
    case 'SET_CURRENTLY_PLAYING':
      return { ...state, currentlyPlaying: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'TOGGLE_THEME':
      return { 
        ...state, 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      };
    default:
      return state;
  }
};

interface UIContextType extends UIState {
  openRecordingModal: () => void;
  closeRecordingModal: () => void;
  openTranscribingModal: () => void;
  closeTranscribingModal: () => void;
  setCurrentlyPlaying: (memoId: string | null) => void;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, dispatch] = useReducer(uiReducer, {
    recordingModalOpen: false,
    transcribingModalOpen: false,
    currentlyPlaying: null,
    searchQuery: '',
    theme: 'light'
  });

  const openRecordingModal = () => dispatch({ type: 'OPEN_RECORDING_MODAL' });
  const closeRecordingModal = () => dispatch({ type: 'CLOSE_RECORDING_MODAL' });
  const openTranscribingModal = () => dispatch({ type: 'OPEN_TRANSCRIBING_MODAL' });
  const closeTranscribingModal = () => dispatch({ type: 'CLOSE_TRANSCRIBING_MODAL' });
  const setCurrentlyPlaying = (memoId: string | null) => 
    dispatch({ type: 'SET_CURRENTLY_PLAYING', payload: memoId });
  const setSearchQuery = (query: string) => 
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const toggleTheme = () => dispatch({ type: 'TOGGLE_THEME' });

  return (
    <UIContext.Provider value={{
      ...state,
      openRecordingModal,
      closeRecordingModal,
      openTranscribingModal,
      closeTranscribingModal,
      setCurrentlyPlaying,
      setSearchQuery,
      toggleTheme
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
```

### 5.3 Store構成
```typescript
// stores/index.ts
export { AuthProvider, useAuth } from './AuthContext';
export { MemoProvider, useMemos } from './MemoContext';
export { UIProvider, useUI } from './UIContext';

// App.tsx での使用例
const App = () => {
  return (
    <AuthProvider>
      <MemoProvider>
        <UIProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MemoListPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </Router>
        </UIProvider>
      </MemoProvider>
    </AuthProvider>
  );
};
```

### 5.4 データフロー
```typescript
// 録音→保存→表示のフロー例
const handleStartRecording = () => {
  openRecordingModal(); // UI State
  // 録音開始
};

const handleCompleteRecording = async (audioBlob: Blob) => {
  closeRecordingModal(); // UI State
  openTranscribingModal(); // UI State
  
  try {
    // 1. 音声ファイルをStorageに保存
    const audioUrl = await storageService.uploadAudio(audioBlob);
    
    // 2. 文字起こし実行
    const transcription = await whisperService.transcribe(audioBlob);
    
    // 3. Firestoreに保存
    const memo = await addMemo({
      audioUrl,
      transcription,
      duration: audioDuration,
      // ...other properties
    });
    
    closeTranscribingModal(); // UI State
    // 4. 成功通知表示
    showSuccessToast('メモを保存しました');
    
  } catch (error) {
    closeTranscribingModal();
    showErrorMessage('保存に失敗しました');
  }
};
```

### 5.5 キャッシュ戦略
```typescript
// hooks/useFirestore.ts - Server State管理
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/services/firebase';

export const useRealtimeMemos = (userId: string) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const memosQuery = query(
      collection(db, 'memos'),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(
      memosQuery,
      (snapshot) => {
        const memosData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Memo[];
        
        setMemos(memosData);
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [userId]);

  return { memos, loading, error };
};
```

このように、Context APIを使用したState管理により、各コンポーネント間でのデータ共有とリアルタイム更新を実現します。次にFirestoreのデータベース設計に進みます。