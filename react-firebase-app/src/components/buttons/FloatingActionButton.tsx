import React from 'react';
import { Fab, type SxProps, type Theme } from '@mui/material';
import { Mic, Stop, MicOff } from '@mui/icons-material';

/**
 * フローティングアクションボタン - 音声録音用
 * 
 * 設計原則:
 * - Material-UI Fabベース
 * - 録音状態に応じたアイコン・色変更
 * - アニメーション効果
 * - アクセシビリティ対応
 */

interface FloatingActionButtonProps {
  /** 録音中かどうか */
  recording: boolean;
  /** ボタンクリック時の処理 */
  onClick: () => void;
  /** ボタンが無効かどうか */
  disabled?: boolean;
  /** エラー状態かどうか */
  error?: boolean;
  /** カスタムスタイル */
  sx?: SxProps<Theme>;
  /** アリアラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  recording,
  onClick,
  disabled = false,
  error = false,
  sx,
  ariaLabel
}) => {
  // アイコンの選択
  const getIcon = () => {
    if (error) return <MicOff />;
    if (recording) return <Stop />;
    return <Mic />;
  };

  // カラーの選択
  const getColor = (): 'primary' | 'secondary' | 'error' => {
    if (error) return 'error';
    if (recording) return 'secondary';
    return 'primary';
  };

  // アリアラベルの生成
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (error) return 'マイクエラー';
    if (recording) return '録音を停止';
    return '録音を開始';
  };

  // スタイルの設定
  const fabSx: SxProps<Theme> = {
    position: 'fixed',
    bottom: 80,
    right: 16,
    zIndex: 1000,
    // 録音中のパルスアニメーション
    animation: recording ? 'pulse 1.5s infinite' : 'none',
    // ホバー効果
    '&:hover': {
      transform: 'scale(1.1)',
      transition: 'transform 0.2s ease-in-out'
    },
    // フォーカス効果（キーボードナビゲーション用）
    '&:focus': {
      outline: '2px solid',
      outlineColor: 'primary.main',
      outlineOffset: '2px'
    },
    // アニメーション定義
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(25, 118, 210, 0.7)'
      },
      '50%': {
        transform: 'scale(1.05)',
        boxShadow: '0 0 0 10px rgba(25, 118, 210, 0)'
      },
      '100%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(25, 118, 210, 0)'
      }
    },
    // エラー状態のアニメーション
    ...(error && {
      animation: 'shake 0.5s ease-in-out',
      '@keyframes shake': {
        '0%, 100%': { transform: 'translateX(0)' },
        '25%': { transform: 'translateX(-5px)' },
        '75%': { transform: 'translateX(5px)' }
      }
    }),
    // カスタムスタイルをマージ
    ...sx
  };

  return (
    <Fab
      color={getColor()}
      onClick={onClick}
      disabled={disabled}
      sx={fabSx}
      aria-label={getAriaLabel()}
      size="large"
    >
      {getIcon()}
    </Fab>
  );
};

export default FloatingActionButton;