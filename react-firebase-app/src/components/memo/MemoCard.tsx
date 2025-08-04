import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Delete,
  Edit,
  Share,
  MoreVert,
  VolumeUp,
  VolumeOff,
  TextFields,
  MicNone
} from '@mui/icons-material';
import { type Memo, hasAudio, hasText } from '@/types/memo';

/**
 * メモカードコンポーネント
 * 
 * 設計原則:
 * - LINE風のチャット表示
 * - 音声・テキスト・混合メモ対応
 * - アクセシビリティ対応
 * - インタラクション豊富
 */

interface MemoCardProps {
  /** メモデータ */
  memo: Memo;
  /** 再生中かどうか */
  isPlaying?: boolean;
  /** 現在の再生時間（秒） */
  currentTime?: number;
  /** 実際の音声時間（再生時に取得） */
  actualDuration?: number;
  /** 音声再生開始 */
  onPlay: () => void;
  /** 音声再生停止 */
  onPause: () => void;
  /** メモ削除 */
  onDelete: () => void;
  /** メモ編集 */
  onEdit?: () => void;
  /** メモ共有 */
  onShare?: () => void;
}

export const MemoCard: React.FC<MemoCardProps> = ({
  memo,
  isPlaying = false,
  currentTime = 0,
  actualDuration,
  onPlay,
  onPause,
  onDelete,
  onEdit,
  onShare
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  // メニューの開閉
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // 時間フォーマット
  const formatTime = (timestamp: Date): string => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const diffHours = diff / (1000 * 60 * 60);
    
    if (diffHours < 24) {
      return timestamp.toLocaleTimeString('ja-JP', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return timestamp.toLocaleDateString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  // 再生時間フォーマット
  const formatDuration = (seconds: number): string => {
    // NaN、Infinity、無効な値をチェック
    if (!seconds || isNaN(seconds) || !isFinite(seconds) || seconds <= 0) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // 整数に丸める
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 再生進捗
  const getPlayProgress = (): number => {
    const duration = actualDuration || memo.duration;
    if (!hasAudio(memo) || !duration || duration === 0 || !isFinite(duration)) return 0;
    if (!currentTime || !isFinite(currentTime)) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  };

  // メモタイプアイコン
  const getTypeIcon = () => {
    switch (memo.type) {
      case 'audio':
        return <MicNone fontSize="small" />;
      case 'text':
        return <TextFields fontSize="small" />;
      case 'mixed':
        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <MicNone fontSize="small" />
            <TextFields fontSize="small" />
          </Box>
        );
      default:
        return null;
    }
  };

  // タイトル生成
  const getTitle = (): string => {
    if (memo.title) return memo.title;
    
    // 文字起こしまたはテキストから自動生成
    let content = '';
    if (hasText(memo) && memo.textContent) {
      content = memo.textContent;
    } else if (hasAudio(memo) && memo.transcription) {
      content = memo.transcription;
    }
    
    if (content) {
      return content.slice(0, 20) + (content.length > 20 ? '...' : '');
    }
    
    return `${memo.type === 'audio' ? '音声' : 'テキスト'}メモ`;
  };

  // 内容プレビュー
  const getContentPreview = (): string => {
    let content = '';
    
    // 混合モードの場合は両方を表示
    if (memo.type === 'mixed') {
      const textPart = memo.textContent || '';
      const transcriptionPart = memo.transcription || '';
      
      if (textPart && transcriptionPart) {
        content = `${textPart}\n\n[文字起こし]\n${transcriptionPart}`;
      } else if (textPart) {
        content = textPart;
      } else if (transcriptionPart) {
        content = `[文字起こし]\n${transcriptionPart}`;
      }
    } else if (hasText(memo) && memo.textContent) {
      content = memo.textContent;
    } else if (hasAudio(memo) && memo.transcription) {
      content = memo.transcription;
    }
    
    if (!content) return '内容なし';
    
    return content.length > 100 ? content.slice(0, 100) + '...' : content;
  };

  return (
    <Card
      sx={{
        width: '100%',
        mb: 1,
        boxShadow: 1,
        '&:hover': {
          boxShadow: 3,
          transform: 'translateY(-1px)'
        },
        transition: 'all 0.2s ease-in-out',
        border: isPlaying ? '2px solid' : '1px solid',
        borderColor: isPlaying ? 'primary.main' : 'divider'
      }}
      role="article"
      aria-label={`メモ: ${getTitle()}`}
    >
      <CardContent sx={{ pb: 1, '&:last-child': { pb: 1 } }}>
        {/* ヘッダー行 */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 1
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
            {getTypeIcon()}
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                flex: 1,
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {getTitle()}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatTime(
                memo.createdAt && typeof memo.createdAt.toDate === 'function'
                  ? memo.createdAt.toDate()
                  : memo.createdAt instanceof Date
                  ? memo.createdAt
                  : new Date()
              )}
            </Typography>
            
            <IconButton
              size="small"
              onClick={handleMenuOpen}
              aria-label="メニューを開く"
              aria-expanded={menuOpen}
              aria-haspopup="true"
            >
              <MoreVert fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* メニュー */}
        <Menu
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {onEdit && (
            <MenuItem onClick={() => { onEdit(); handleMenuClose(); }}>
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              <ListItemText>編集</ListItemText>
            </MenuItem>
          )}
          
          {onShare && (
            <MenuItem onClick={() => { onShare(); handleMenuClose(); }}>
              <ListItemIcon>
                <Share fontSize="small" />
              </ListItemIcon>
              <ListItemText>共有</ListItemText>
            </MenuItem>
          )}
          
          <MenuItem
            onClick={() => { onDelete(); handleMenuClose(); }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon>
              <Delete fontSize="small" sx={{ color: 'error.main' }} />
            </ListItemIcon>
            <ListItemText>削除</ListItemText>
          </MenuItem>
        </Menu>

        {/* 内容プレビュー */}
        <Typography
          variant="body2"
          sx={{
            mb: 2,
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: memo.type === 'mixed' ? 5 : 3, // 混合モードでは行数を増やす
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.4,
            whiteSpace: 'pre-line' // 改行を表示
          }}
        >
          {getContentPreview()}
        </Typography>

        {/* 音声コントロール */}
        {hasAudio(memo) && (
          <Box sx={{ mb: 1 }}>
            {/* 再生プログレスバー */}
            <Box
              sx={{
                width: '100%',
                height: 4,
                bgcolor: 'grey.300',
                borderRadius: 2,
                mb: 1,
                overflow: 'hidden'
              }}
            >
              <Box
                sx={{
                  width: `${getPlayProgress()}%`,
                  height: '100%',
                  bgcolor: 'primary.main',
                  borderRadius: 2,
                  transition: 'width 0.1s ease-out'
                }}
              />
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={isPlaying ? onPause : onPlay}
                  size="small"
                  sx={{
                    bgcolor: isPlaying ? 'secondary.main' : 'primary.main',
                    color: 'white',
                    '&:hover': {
                      bgcolor: isPlaying ? 'secondary.dark' : 'primary.dark'
                    }
                  }}
                  aria-label={isPlaying ? '再生を停止' : '音声を再生'}
                >
                  {isPlaying ? <Pause /> : <PlayArrow />}
                </IconButton>

                <Typography variant="caption" color="text.secondary">
                  {formatDuration(currentTime)} / {formatDuration(actualDuration || memo.duration)}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* 文字起こし状態 */}
                {memo.transcriptionStatus && (
                  <Chip
                    label={
                      memo.transcriptionStatus === 'completed'
                        ? '文字起こし完了'
                        : memo.transcriptionStatus === 'processing'
                        ? '処理中'
                        : memo.transcriptionStatus === 'failed'
                        ? 'エラー'
                        : '待機中'
                    }
                    size="small"
                    color={
                      memo.transcriptionStatus === 'completed'
                        ? 'success'
                        : memo.transcriptionStatus === 'processing'
                        ? 'primary'
                        : memo.transcriptionStatus === 'failed'
                        ? 'error'
                        : 'default'
                    }
                    variant="outlined"
                  />
                )}

                {/* 音声アイコン */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isPlaying ? <VolumeUp fontSize="small" /> : <VolumeOff fontSize="small" />}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* フッター情報 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pt: 1,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            {/* ファイルサイズ */}
            {hasAudio(memo) && memo.fileSize && (
              <Chip
                label={`${Math.round(memo.fileSize / 1024)}KB`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}

            {/* 文字数 */}
            {hasText(memo) && memo.textContent && (
              <Chip
                label={`${memo.textContent.length}文字`}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            )}
          </Box>

          {/* 更新日時 */}
          {memo.updatedAt && memo.createdAt && (
            (() => {
              const updatedTime = memo.updatedAt && typeof memo.updatedAt.toMillis === 'function'
                ? memo.updatedAt.toMillis()
                : memo.updatedAt instanceof Date
                ? memo.updatedAt.getTime()
                : 0;
              const createdTime = memo.createdAt && typeof memo.createdAt.toMillis === 'function'
                ? memo.createdAt.toMillis()
                : memo.createdAt instanceof Date
                ? memo.createdAt.getTime()
                : 0;
              
              if (updatedTime !== createdTime && updatedTime > 0) {
                const updatedDate = memo.updatedAt && typeof memo.updatedAt.toDate === 'function'
                  ? memo.updatedAt.toDate()
                  : memo.updatedAt instanceof Date
                  ? memo.updatedAt
                  : new Date();
                
                return (
                  <Typography variant="caption" color="text.disabled">
                    編集: {formatTime(updatedDate)}
                  </Typography>
                );
              }
              return null;
            })()
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default MemoCard;