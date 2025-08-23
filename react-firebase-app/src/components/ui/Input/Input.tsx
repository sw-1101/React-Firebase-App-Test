import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import styles from './Input.module.css';

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  autoResize?: boolean; // LINE風自動拡張
  maxRows?: number;
  className?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  'aria-label'?: string;
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  disabled = false,
  error,
  autoResize = false,
  maxRows = 5,
  className,
  onFocus,
  onBlur,
  onKeyDown,
  'aria-label': ariaLabel,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 自動リサイズ機能
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      
      // 最大高さを計算
      const lineHeight = 24; // 1行の高さ
      const maxHeight = lineHeight * maxRows;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      
      textarea.style.height = `${newHeight}px`;
    }
  }, [value, autoResize, maxRows]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const inputClasses = classNames(
    styles.input,
    {
      [styles.error]: error,
      [styles.disabled]: disabled,
      [styles.autoResize]: autoResize,
    },
    className
  );

  return (
    <motion.div className={styles.container}>
      {autoResize ? (
        <textarea
          ref={textareaRef}
          className={inputClasses}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
        />
      ) : (
        <input
          ref={inputRef}
          className={inputClasses}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
        />
      )}
      
      {error && (
        <motion.div
          className={styles.errorMessage}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Input;