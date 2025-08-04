import React, { useCallback, useMemo, useRef } from 'react';
import {
  List,
  ListItem,
  Typography,
  Box,
  Divider,
  Skeleton,
  Button,
  Alert,
  Fade
} from '@mui/material';
import { FixedSizeList as VirtualList } from 'react-window';
// @ts-ignore
import InfiniteLoader from 'react-window-infinite-loader';
import { MemoCard } from './MemoCard';
import { type Memo } from '@/types/memo';
import { Refresh, ErrorOutline } from '@mui/icons-material';

/**
 * メモタイムラインコンポーネント
 * 
 * 設計原則:
 * - 仮想スクロール対応（パフォーマンス最適化）
 * - 無限スクロール
 * - 日付グループ化
 * - ローディング・エラー状態
 */

interface MemoTimelineProps {
  /** メモ一覧 */
  memos: Memo[];
  /** ローディング中かどうか */
  loading: boolean;
  /** エラーメッセージ */
  error?: string | null;
  /** さらに読み込むデータがあるか */
  hasMore: boolean;
  /** 現在再生中のメモID */
  currentlyPlaying: string | null;
  /** 現在の再生時間 */
  currentPlayTime: number;
  /** 実際の音声時間 */
  currentAudioDuration?: number;
  /** 追加データの読み込み */
  onLoadMore: () => Promise<void>;
  /** 音声再生開始 */
  onPlayAudio: (memoId: string, audioUrl: string) => void;
  /** 音声再生停止 */
  onPauseAudio: () => void;
  /** メモ削除 */
  onDeleteMemo: (memoId: string) => void;
  /** メモ編集 */
  onEditMemo?: (memoId: string) => void;
  /** メモ共有 */
  onShareMemo?: (memoId: string) => void;
  /** リフレッシュ */
  onRefresh?: () => void;
  /** 仮想スクロールを使用するか */
  useVirtualScroll?: boolean;
  /** タイムラインの高さ */
  height?: number;
}

// 日付グループ化されたアイテムの型
interface TimelineItem {
  type: 'header' | 'memo' | 'loading';
  id: string;
  data?: Memo;
  date?: string;
}

export const MemoTimeline: React.FC<MemoTimelineProps> = ({
  memos,
  loading,
  error,
  hasMore,
  currentlyPlaying,
  currentPlayTime,
  currentAudioDuration,
  onLoadMore,
  onPlayAudio,
  onPauseAudio,
  onDeleteMemo,
  onEditMemo,
  onShareMemo,
  onRefresh,
  useVirtualScroll = true,
  height = 600
}) => {
  const infiniteLoaderRef = useRef<InfiniteLoader>(null);

  // 日付フォーマット
  const formatDateHeader = useCallback((date: Date): string => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const targetDate = new Date(date);
    
    if (targetDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (targetDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return targetDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }, []);

  // メモを日付でグループ化してタイムラインアイテムに変換
  const timelineItems = useMemo(() => {
    const items: TimelineItem[] = [];
    const groupedMemos: Record<string, Memo[]> = {};

    // 日付でグループ化
    memos.forEach(memo => {
      // createdAtがFirestoreのTimestampオブジェクトの場合はtoDate()を呼び、既にDateの場合はそのまま使う
      const createdAtDate = memo.createdAt && typeof memo.createdAt.toDate === 'function' 
        ? memo.createdAt.toDate() 
        : memo.createdAt instanceof Date 
        ? memo.createdAt 
        : new Date();
      const dateKey = createdAtDate.toDateString();
      if (!groupedMemos[dateKey]) {
        groupedMemos[dateKey] = [];
      }
      groupedMemos[dateKey].push(memo);
    });

    // タイムラインアイテムを構築
    Object.entries(groupedMemos)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime()) // 新しい日付順
      .forEach(([dateString, dayMemos]) => {
        // 日付ヘッダーを追加
        items.push({
          type: 'header',
          id: `header-${dateString}`,
          date: formatDateHeader(new Date(dateString))
        });

        // その日のメモを追加
        dayMemos
          .sort((a, b) => {
            const aTime = a.createdAt && typeof a.createdAt.toMillis === 'function' 
              ? a.createdAt.toMillis()
              : a.createdAt instanceof Date 
              ? a.createdAt.getTime()
              : 0;
            const bTime = b.createdAt && typeof b.createdAt.toMillis === 'function'
              ? b.createdAt.toMillis()
              : b.createdAt instanceof Date
              ? b.createdAt.getTime()
              : 0;
            return bTime - aTime;
          }) // 新しい時間順
          .forEach(memo => {
            items.push({
              type: 'memo',
              id: memo.id,
              data: memo
            });
          });
      });

    // ローディング中の場合はローディングアイテムを追加
    if (loading && hasMore) {
      items.push({
        type: 'loading',
        id: 'loading'
      });
    }

    return items;
  }, [memos, loading, hasMore, formatDateHeader]);

  // アイテムがロード済みかチェック
  const isItemLoaded = useCallback((index: number) => {
    return !!timelineItems[index];
  }, [timelineItems]);

  // 仮想スクロール用のアイテムレンダラー
  const VirtualItem = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const item = timelineItems[index];

    if (!item) {
      return (
        <div style={style}>
          <Skeleton variant="rectangular" height={100} sx={{ mx: 1, mb: 1 }} />
        </div>
      );
    }

    return (
      <div style={style}>
        {item.type === 'header' && (
          <Box sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'text.secondary',
                fontWeight: 'bold'
              }}
            >
              {item.date}
            </Typography>
          </Box>
        )}

        {item.type === 'memo' && item.data && (
          <Box sx={{ px: 1 }}>
            <MemoCard
              memo={item.data}
              isPlaying={currentlyPlaying === item.data.id}
              currentTime={currentlyPlaying === item.data.id ? currentPlayTime : 0}
              actualDuration={currentlyPlaying === item.data.id ? currentAudioDuration : undefined}
              onPlay={() => {
                if (item.data && 'audioUrl' in item.data) {
                  onPlayAudio(item.data.id, item.data.audioUrl);
                }
              }}
              onPause={onPauseAudio}
              onDelete={() => onDeleteMemo(item.data!.id)}
              onEdit={onEditMemo ? () => onEditMemo(item.data!.id) : undefined}
              onShare={onShareMemo ? () => onShareMemo(item.data!.id) : undefined}
            />
          </Box>
        )}

        {item.type === 'loading' && (
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
            <Skeleton variant="rectangular" width="100%" height={80} />
          </Box>
        )}
      </div>
    );
  }, [timelineItems, currentlyPlaying, currentPlayTime, currentAudioDuration, onPlayAudio, onPauseAudio, onDeleteMemo, onEditMemo, onShareMemo]);

  // 通常スクロール用のレンダリング
  const renderNormalScroll = () => (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {timelineItems.map((item, index) => (
        <React.Fragment key={item.id}>
          {item.type === 'header' && (
            <ListItem sx={{ px: 2, py: 1, bgcolor: 'grey.50' }}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  fontWeight: 'bold'
                }}
              >
                {item.date}
              </Typography>
            </ListItem>
          )}

          {item.type === 'memo' && item.data && (
            <ListItem sx={{ px: 1, pb: 0 }}>
              <MemoCard
                memo={item.data}
                isPlaying={currentlyPlaying === item.data.id}
                currentTime={currentlyPlaying === item.data.id ? currentPlayTime : 0}
                actualDuration={currentlyPlaying === item.data.id ? currentAudioDuration : undefined}
                onPlay={() => {
                  if (item.data && 'audioUrl' in item.data) {
                    onPlayAudio(item.data.id, item.data.audioUrl);
                  }
                }}
                onPause={onPauseAudio}
                onDelete={() => onDeleteMemo(item.data!.id)}
                onEdit={onEditMemo ? () => onEditMemo(item.data!.id) : undefined}
                onShare={onShareMemo ? () => onShareMemo(item.data!.id) : undefined}
              />
            </ListItem>
          )}

          {item.type === 'loading' && (
            <ListItem>
              <Skeleton variant="rectangular" width="100%" height={80} />
            </ListItem>
          )}

          {index < timelineItems.length - 1 && timelineItems[index + 1].type === 'header' && (
            <Divider sx={{ my: 1 }} />
          )}
        </React.Fragment>
      ))}
    </List>
  );

  // エラー状態の表示
  if (error) {
    return (
      <Fade in={true}>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Alert
            severity="error"
            icon={<ErrorOutline />}
            action={
              onRefresh && (
                <Button
                  color="inherit"
                  size="small"
                  onClick={onRefresh}
                  startIcon={<Refresh />}
                >
                  再読み込み
                </Button>
              )
            }
          >
            <Typography variant="body2">
              {error}
            </Typography>
          </Alert>
        </Box>
      </Fade>
    );
  }

  // 空状態の表示
  if (!loading && memos.length === 0) {
    return (
      <Fade in={true}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: 400,
            textAlign: 'center',
            color: 'text.secondary'
          }}
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            📝 メモがありません
          </Typography>
          <Typography variant="body2">
            🎤ボタンを押して最初のメモを作成しましょう
          </Typography>
        </Box>
      </Fade>
    );
  }

  // 仮想スクロールの場合
  if (useVirtualScroll && timelineItems.length > 20) {
    return (
      <Box sx={{ height, width: '100%' }}>
        <InfiniteLoader
          ref={infiniteLoaderRef}
          isItemLoaded={isItemLoaded}
          itemCount={hasMore ? timelineItems.length + 1 : timelineItems.length}
          loadMoreItems={onLoadMore}
        >
          {({ onItemsRendered, ref }: any) => (
            <VirtualList
              ref={ref}
              height={height}
              width="100%"
              itemCount={timelineItems.length}
              itemSize={140}
              onItemsRendered={onItemsRendered}
              overscanCount={5}
            >
              {VirtualItem}
            </VirtualList>
          )}
        </InfiniteLoader>
      </Box>
    );
  }

  // 通常スクロールの場合
  return (
    <Box
      sx={{
        height: useVirtualScroll ? height : 'auto',
        overflowY: useVirtualScroll ? 'hidden' : 'auto'
      }}
    >
      {renderNormalScroll()}
      
      {/* 追加読み込みボタン */}
      {hasMore && !loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <Button variant="outlined" onClick={onLoadMore}>
            さらに読み込む
          </Button>
        </Box>
      )}
      
      {/* ローディング表示 */}
      {loading && (
        <Box sx={{ p: 2 }}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              height={100}
              sx={{ mb: 1 }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default MemoTimeline;