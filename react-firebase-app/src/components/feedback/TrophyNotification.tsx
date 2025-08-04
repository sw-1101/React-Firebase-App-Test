import React, { useState, useEffect } from 'react';
import {
  Snackbar,
  Box,
  Typography,
  IconButton,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { type TransitionProps } from '@mui/material/transitions';
import {
  Close,
  EmojiEvents,
  Star,
  Celebration,
  VolumeUp
} from '@mui/icons-material';

/**
 * PlayStation風トロフィー通知コンポーネント
 * 
 * 設計原則:
 * - PlayStation風のスタイリング
 * - サウンド付き通知
 * - アニメーション豊富
 * - アクセシビリティ対応
 */

// トロフィータイプ
export type TrophyType = 'bronze' | 'silver' | 'gold' | 'platinum';

// 通知データ
export interface TrophyNotificationData {
  id: string;
  type: TrophyType;
  title: string;
  description: string;
  icon?: React.ReactNode;
  sound?: boolean;
  autoHideDuration?: number;
}

interface TrophyNotificationProps {
  /** 通知データ */
  notification: TrophyNotificationData | null;
  /** 通知を閉じる */
  onClose: () => void;
  /** 効果音を再生するか */
  enableSound?: boolean;
  /** 位置 */
  position?: {
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
  };
}

// スライドトランジション
const SlideTransition = React.forwardRef<unknown, TransitionProps & { children: React.ReactElement }>(
  function SlideTransition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
  }
);

// トロフィーカラー設定
const getTrophyColors = (type: TrophyType) => {
  switch (type) {
    case 'bronze':
      return {
        primary: '#CD7F32',
        secondary: '#8B5A2B',
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B5A2B 100%)',
        shadow: '0 4px 12px rgba(205, 127, 50, 0.3)'
      };
    case 'silver':
      return {
        primary: '#C0C0C0',
        secondary: '#808080',
        gradient: 'linear-gradient(135deg, #C0C0C0 0%, #808080 100%)',
        shadow: '0 4px 12px rgba(192, 192, 192, 0.3)'
      };
    case 'gold':
      return {
        primary: '#FFD700',
        secondary: '#DAA520',
        gradient: 'linear-gradient(135deg, #FFD700 0%, #DAA520 100%)',
        shadow: '0 4px 12px rgba(255, 215, 0, 0.4)'
      };
    case 'platinum':
      return {
        primary: '#E5E4E2',
        secondary: '#B5B5B5',
        gradient: 'linear-gradient(135deg, #E5E4E2 0%, #B5B5B5 100%, #E5E4E2 100%)',
        shadow: '0 6px 16px rgba(229, 228, 226, 0.5)'
      };
    default:
      return {
        primary: '#CD7F32',
        secondary: '#8B5A2B',
        gradient: 'linear-gradient(135deg, #CD7F32 0%, #8B5A2B 100%)',
        shadow: '0 4px 12px rgba(205, 127, 50, 0.3)'
      };
  }
};

// トロフィーアイコン取得
const getTrophyIcon = (type: TrophyType) => {
  switch (type) {
    case 'bronze':
    case 'silver':
    case 'gold':
      return <EmojiEvents />;
    case 'platinum':
      return <Star />;
    default:
      return <EmojiEvents />;
  }
};

export const TrophyNotification: React.FC<TrophyNotificationProps> = ({
  notification,
  onClose,
  enableSound = true,
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [playingSound, setPlayingSound] = useState(false);

  // 効果音再生
  useEffect(() => {
    if (notification && enableSound && notification.sound !== false) {
      setPlayingSound(true);
      
      // Web Audio API を使用した効果音生成
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const playTrophySound = () => {
        // トロフィータイプに応じた音階を設定
        const frequencies = {
          bronze: [523.25, 659.25, 783.99], // C5, E5, G5
          silver: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6
          gold: [523.25, 659.25, 783.99, 1046.50, 1318.51], // C5, E5, G5, C6, E6
          platinum: [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98] // C5, E5, G5, C6, E6, G6
        };
        
        const noteFrequencies = frequencies[notification.type] || frequencies.bronze;
        
        noteFrequencies.forEach((frequency, index) => {
          setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'triangle';
            
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
          }, index * 100);
        });
      };
      
      // ユーザーインタラクション後に再生
      const playSound = () => {
        try {
          if (audioContext.state === 'suspended') {
            audioContext.resume().then(playTrophySound);
          } else {
            playTrophySound();
          }
        } catch (error) {
    // エラーハンドリング
  }
        setPlayingSound(false);
      };
      
      playSound();
    }
  }, [notification, enableSound]);

  if (!notification) return null;

  const colors = getTrophyColors(notification.type);
  const trophyIcon = notification.icon || getTrophyIcon(notification.type);

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={notification.autoHideDuration || 5000}
      onClose={onClose}
      anchorOrigin={position}
      TransitionComponent={SlideTransition}
      sx={{
        '& .MuiSnackbar-root': {
          top: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24
        }
      }}
    >
      <Box
        sx={{
          background: colors.gradient,
          boxShadow: colors.shadow,
          borderRadius: 2,
          border: `2px solid ${colors.primary}`,
          minWidth: isMobile ? 280 : 400,
          maxWidth: isMobile ? 320 : 500,
          position: 'relative',
          overflow: 'hidden'
        }}
        role="alert"
        aria-live="assertive"
      >
        {/* 背景アニメーション */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            left: -50,
            width: 100,
            height: 100,
            background: `radial-gradient(circle, ${colors.primary}40 0%, transparent 70%)`,
            animation: 'sparkle 2s ease-in-out infinite',
            '@keyframes sparkle': {
              '0%, 100%': {
                opacity: 0,
                transform: 'scale(0.8) rotate(0deg)'
              },
              '50%': {
                opacity: 1,
                transform: 'scale(1.2) rotate(180deg)'
              }
            }
          }}
        />

        {/* メイン内容 */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            position: 'relative',
            zIndex: 1
          }}
        >
          {/* トロフィーアイコン */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              mr: 2,
              animation: 'bounce 1s ease-in-out 2',
              '@keyframes bounce': {
                '0%, 20%, 53%, 80%, 100%': {
                  transform: 'translateY(0)'
                },
                '40%, 43%': {
                  transform: 'translateY(-8px)'
                },
                '70%': {
                  transform: 'translateY(-4px)'
                },
                '90%': {
                  transform: 'translateY(-2px)'
                }
              }
            }}
          >
            {trophyIcon}
          </Box>

          {/* テキスト内容 */}
          <Box sx={{ flex: 1, color: 'white' }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 'bold',
                mb: 0.5,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              {notification.title}
              {notification.type === 'platinum' && <Celebration fontSize="small" />}
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                lineHeight: 1.3
              }}
            >
              {notification.description}
            </Typography>
          </Box>

          {/* 効果音アイコン */}
          {playingSound && (
            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 40,
                color: 'white',
                opacity: 0.7,
                animation: 'pulse 0.5s ease-in-out infinite alternate'
              }}
            >
              <VolumeUp fontSize="small" />
            </Box>
          )}

          {/* 閉じるボタン */}
          <IconButton
            size="small"
            onClick={onClose}
            sx={{
              color: 'white',
              opacity: 0.8,
              '&:hover': {
                opacity: 1,
                bgcolor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
            aria-label="通知を閉じる"
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>

        {/* プログレスバー */}
        <Box
          sx={{
            height: 3,
            bgcolor: 'rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box
            sx={{
              height: '100%',
              bgcolor: 'white',
              animation: `progress ${notification.autoHideDuration || 5000}ms linear`,
              '@keyframes progress': {
                '0%': {
                  width: '100%'
                },
                '100%': {
                  width: '0%'
                }
              }
            }}
          />
        </Box>
      </Box>
    </Snackbar>
  );
};

// 通知管理フック
export const useTrophyNotification = () => {
  const [notification, setNotification] = useState<TrophyNotificationData | null>(null);

  const showNotification = (data: Omit<TrophyNotificationData, 'id'>) => {
    const newNotification: TrophyNotificationData = {
      ...data,
      id: `trophy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    setNotification(newNotification);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  // よく使用される通知のヘルパー関数
  const showSuccessNotification = (title: string, description: string) => {
    showNotification({
      type: 'gold',
      title,
      description,
      sound: true
    });
  };

  const showAchievementNotification = (title: string, description: string, type: TrophyType = 'bronze') => {
    showNotification({
      type,
      title,
      description,
      sound: true
    });
  };

  return {
    notification,
    showNotification,
    hideNotification,
    showSuccessNotification,
    showAchievementNotification
  };
};

export default TrophyNotification;