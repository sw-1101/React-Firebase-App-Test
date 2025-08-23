import React from 'react';
import { MicIcon, MicOffIcon } from '@/components/icons/CustomIcons';
import styles from './FloatingActionButton.module.css';

/**
 * フローティングアクションボタン - 音声録音用
 * 
 * 設計原則:
 * - カスタムCSS + CSS Modulesベース
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
  /** サイズ */
  size?: 'small' | 'medium' | 'large';
  /** アリアラベル（アクセシビリティ用） */
  ariaLabel?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  recording,
  onClick,
  disabled = false,
  error = false,
  size = 'large',
  ariaLabel
}) => {
  // アイコンの選択
  const getIcon = () => {
    if (error) return <MicOffIcon className={styles.icon} />;
    if (recording) return <MicOffIcon className={styles.icon} />;
    return <MicIcon className={styles.icon} />;
  };

  // カラークラスの選択
  const getColorClass = () => {
    if (error) return styles.error;
    if (recording) return styles.secondary;
    return styles.primary;
  };

  // アリアラベルの生成
  const getAriaLabel = () => {
    if (ariaLabel) return ariaLabel;
    if (error) return 'マイクエラー';
    if (recording) return '録音を停止';
    return '録音を開始';
  };

  // クラス名の組み立て
  const buttonClasses = [
    styles.fab,
    styles[size],
    getColorClass(),
    recording && styles.recording,
    error && styles.shake,
    disabled && styles.disabled
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      aria-label={getAriaLabel()}
    >
      {getIcon()}
    </button>
  );
};

export default FloatingActionButton;