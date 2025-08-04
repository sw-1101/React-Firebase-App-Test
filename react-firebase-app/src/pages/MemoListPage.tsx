import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Dialog,
  Slide,
  useMediaQuery,
  useTheme,
  Fab,
} from '@mui/material';
import { type TransitionProps } from '@mui/material/transitions';
import {
  ArrowBack,
  Search,
  Add,
  Refresh
} from '@mui/icons-material';
import { MemoProvider, useMemos } from '@/contexts/MemoContext';
import { MemoTimeline } from '@/components/memo/MemoTimeline';
import { MemoInput } from '@/components/memo/MemoInput';
import SearchBox from '@/components/forms/SearchBox/SearchBox';
import { useAuth } from '@/contexts/AuthContext';

/**
 * メモ一覧ページ
 * 
 * 設計原則:
 * - モバイルファーストデザイン
 * - LINE風のチャット表示
 * - 無限スクロール対応
 * - リアルタイム更新
 * - オフライン対応
 */

// フルスクリーン遷移コンポーネント
const Transition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement }>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

// メイン画面コンポーネント
const MemoListPageContent: React.FC = () => {
  const { 
    state: { memos, loading, error, hasMore, isSearching, searchResults },
    loadMemos,
    loadMoreMemos,
    searchMemos,
    clearSearch,
    deleteMemo,
    refreshMemos
  } = useMemos();
  
  const { state: { user } } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // UI状態
  const [showInput, setShowInput] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [currentPlayTime, setCurrentPlayTime] = useState(0);
  const [currentAudioDuration, setCurrentAudioDuration] = useState(0); // 実際の音声時間
  const [searchQuery, setSearchQuery] = useState('');
  
  // Audio管理
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初期ロード
  useEffect(() => {
    if (user) {
      loadMemos();
    }
  }, [user, loadMemos]);

  // Audio時間更新
  useEffect(() => {
    if (currentlyPlaying && audioRef.current) {
      audioUpdateTimerRef.current = setInterval(() => {
        if (audioRef.current) {
          // 小数点第1位まで丸める
          setCurrentPlayTime(Math.round(audioRef.current.currentTime * 10) / 10);
        }
      }, 500); // 100ms → 500msに変更（更新頻度を下げる）
    } else {
      if (audioUpdateTimerRef.current) {
        clearInterval(audioUpdateTimerRef.current);
      }
    }

    return () => {
      if (audioUpdateTimerRef.current) {
        clearInterval(audioUpdateTimerRef.current);
      }
    };
  }, [currentlyPlaying]);

  // 音声再生開始
  const handlePlayAudio = useCallback((memoId: string, audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(audioUrl);
    audio.onloadedmetadata = () => {
      setCurrentlyPlaying(memoId);
      
      // 実際の音声時間を設定
      const actualDuration = audio.duration;
      if (actualDuration && !isNaN(actualDuration) && isFinite(actualDuration)) {
        setCurrentAudioDuration(actualDuration);
        console.log('実際の音声時間:', actualDuration);
      } else {
        console.warn('Invalid audio duration:', actualDuration);
        setCurrentAudioDuration(0);
      }
      
      audio.play();
    };
    
    audio.onended = () => {
      setCurrentlyPlaying(null);
      setCurrentPlayTime(0);
      setCurrentAudioDuration(0);
    };
    
    audio.onerror = (error) => {
      console.error('Audio playback error:', error);
      setCurrentlyPlaying(null);
      setCurrentPlayTime(0);
      setCurrentAudioDuration(0);
    };
    
    audioRef.current = audio;
  }, []);

  // 音声再生停止
  const handlePauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentlyPlaying(null);
    setCurrentPlayTime(0);
    setCurrentAudioDuration(0);
  }, []);

  // メモ削除
  const handleDeleteMemo = useCallback(async (memoId: string) => {
    try {
      await deleteMemo(memoId);
      
      // 再生中のメモが削除された場合は停止
      if (currentlyPlaying === memoId) {
        handlePauseAudio();
      }
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  }, [deleteMemo, currentlyPlaying, handlePauseAudio]);

  // 検索処理
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchMemos(query);
    } else {
      clearSearch();
    }
  }, [searchMemos, clearSearch]);

  // 検索クリア
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    clearSearch();
  }, [clearSearch]);

  // メモ入力成功時
  const handleMemoSubmitSuccess = useCallback((_memoId: string) => {
    setShowInput(false);
    // 新しいメモが追加されたのでリフレッシュ
    refreshMemos();
  }, [refreshMemos]);

  // 表示するメモ一覧
  const displayMemos = isSearching || searchResults.length > 0 ? searchResults : memos;

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* アプリバー */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📝 音声メモ
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 検索ボタン */}
            <IconButton
              color="inherit"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="検索"
            >
              <Search />
            </IconButton>
            
            {/* リフレッシュボタン */}
            <IconButton
              color="inherit"
              onClick={refreshMemos}
              disabled={loading}
              aria-label="更新"
            >
              <Refresh />
            </IconButton>
          </Box>
        </Toolbar>
        
        {/* 検索バー */}
        {showSearch && (
          <Box sx={{ px: 2, pb: 1 }}>
            <SearchBox
              value={searchQuery}
              onChange={handleSearch}
              onClear={handleClearSearch}
              placeholder="メモを検索..."
              loading={isSearching}
              fullWidth
            />
          </Box>
        )}
      </AppBar>

      {/* メイン内容 */}
      <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
        <Container
          maxWidth="md"
          sx={{
            height: '100%',
            px: { xs: 1, sm: 2 },
            py: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {/* メモタイムライン */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            <MemoTimeline
              memos={displayMemos}
              loading={loading}
              error={error}
              hasMore={hasMore && !isSearching}
              currentlyPlaying={currentlyPlaying}
              currentPlayTime={currentPlayTime}
              currentAudioDuration={currentAudioDuration}
              onLoadMore={loadMoreMemos}
              onPlayAudio={handlePlayAudio}
              onPauseAudio={handlePauseAudio}
              onDeleteMemo={handleDeleteMemo}
              onRefresh={refreshMemos}
              useVirtualScroll={false} // 仮想スクロールを無効化
              height={window.innerHeight - (showSearch ? 160 : 120)}
            />
          </Box>
        </Container>

        {/* 新規作成ボタン */}
        <Fab
          color="primary"
          aria-label="新しいメモを作成"
          onClick={() => setShowInput(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
        >
          <Add />
        </Fab>
      </Box>

      {/* メモ入力ダイアログ */}
      <Dialog
        fullScreen={isMobile}
        open={showInput}
        onClose={() => setShowInput(false)}
        TransitionComponent={Transition}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: isMobile ? '100vh' : '60vh',
            ...(isMobile && {
              margin: 0,
              borderRadius: 0
            })
          }
        }}
      >
        {/* ダイアログヘッダー */}
        {isMobile && (
          <AppBar position="static" elevation={0}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={() => setShowInput(false)}
                aria-label="閉じる"
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1 }}>
                新しいメモ
              </Typography>
            </Toolbar>
          </AppBar>
        )}
        
        {/* メモ入力フォーム */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 0, sm: 2 }
          }}
        >
          <MemoInput
            onSubmitSuccess={handleMemoSubmitSuccess}
            onSubmitError={(error) => {
              console.error('Memo submission error:', error);
            }}
          />
        </Box>
      </Dialog>

      {/* 隠しオーディオ要素 */}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </Box>
  );
};

// メインページコンポーネント（Context Provider付き）
const MemoListPage: React.FC = () => {
  return (
    <MemoProvider>
      <MemoListPageContent />
    </MemoProvider>
  );
};

export default MemoListPage;