import React, { useState, useCallback } from 'react'
import classNames from 'classnames'
import styles from './SearchBox.module.css'

export interface SearchOption {
  label: string
  value: string
  category?: string
}

export interface SearchBoxProps {
  /** プレースホルダーテキスト */
  placeholder?: string
  /** 検索候補オプション */
  options?: SearchOption[]
  /** 選択された値 */
  value?: string
  /** 複数選択を許可するか */
  multiple?: boolean
  /** 選択された複数の値 */
  multipleValue?: string[]
  /** 検索ボックスの幅 */
  width?: number | string
  /** サイズ */
  size?: 'small' | 'medium'
  /** 無効化 */
  disabled?: boolean
  /** フィルターボタンの表示 */
  showFilter?: boolean
  /** ローディング状態 */
  loading?: boolean
  /** 検索実行時のコールバック */
  onSearch?: (query: string) => void
  /** 値変更時のコールバック */
  onChange?: (value: string) => void
  /** 複数値変更時のコールバック */
  onMultipleChange?: (values: string[]) => void
  /** クリア時のコールバック */
  onClear?: () => void
  /** フィルターボタンクリック時のコールバック */
  onFilterClick?: () => void
  /** 全幅表示 */
  fullWidth?: boolean
}

const SearchBox: React.FC<SearchBoxProps> = ({
  placeholder = '検索...',
  options = [],
  value = '',
  multiple = false,
  multipleValue = [],
  // width = '100%', // 一時的に未使用
  // size = 'medium', // 一時的に未使用
  disabled = false,
  showFilter = false,
  // loading = false, // 一時的に未使用
  fullWidth = false,
  onSearch,
  onChange,
  onMultipleChange,
  onClear,
  onFilterClick,
}) => {
  const [inputValue, setInputValue] = useState(value)

  const handleInputChange = useCallback((newValue: string) => {
    setInputValue(newValue)
    onChange?.(newValue)
  }, [onChange])

  const handleSearch = useCallback(() => {
    onSearch?.(inputValue)
  }, [onSearch, inputValue])

  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSearch()
    }
  }, [handleSearch])

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange?.('')
    onClear?.()
  }, [onChange, onClear])

  // 単一選択の場合
  if (!multiple) {
    return (
      <div className={classNames(
        styles.container,
        fullWidth ? styles.containerFullWidth : styles.containerFixedWidth
      )}>
        <div className={styles.inputContainer}>
          <div className={styles.iconContainer}>
            🔍
          </div>
          
          <input
            type="text"
            className={classNames(
              styles.input,
              styles.inputWithIcon,
              { 
                [styles.inputWithAction]: inputValue || showFilter,
                [styles.error]: false, // エラー状態は未実装
              }
            )}
            placeholder={placeholder}
            value={inputValue}
            disabled={disabled}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <div className={styles.actionContainer}>
            {inputValue && (
              <button
                type="button"
                className={classNames(styles.iconButton, styles.clearButton)}
                onClick={handleClear}
                disabled={disabled}
                aria-label="クリア"
              >
                ✕
              </button>
            )}
            
            {showFilter && (
              <button
                type="button"
                className={classNames(
                  styles.iconButton, 
                  styles.filterButton,
                  { [styles.filterButtonActive]: false } // アクティブ状態は未実装
                )}
                onClick={onFilterClick}
                disabled={disabled}
                aria-label="フィルター"
              >
                🔽
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // 複数選択の場合（簡略化版）
  const selectedOptions = options.filter(option => 
    multipleValue.includes(option.value)
  )
  
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className={classNames(
      styles.container,
      fullWidth ? styles.containerFullWidth : styles.containerFixedWidth
    )}>
      {/* 選択されたアイテムの表示 */}
      {selectedOptions.length > 0 && (
        <div className={styles.filtersContainer}>
          {selectedOptions.map(option => (
            <div key={option.value} className={styles.filterChip}>
              {option.label}
              <span 
                className={styles.filterChipRemove}
                onClick={() => {
                  const newValues = multipleValue.filter(v => v !== option.value)
                  onMultipleChange?.(newValues)
                }}
              >
                ×
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className={styles.inputContainer}>
        <div className={styles.iconContainer}>
          🔍
        </div>
        
        <input
          type="text"
          className={classNames(
            styles.input,
            styles.inputWithIcon,
            { [styles.inputWithAction]: selectedOptions.length > 0 || showFilter }
          )}
          placeholder={selectedOptions.length === 0 ? placeholder : ''}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
        />
        
        <div className={styles.actionContainer}>
          {selectedOptions.length > 0 && (
            <button
              type="button"
              className={classNames(styles.iconButton, styles.clearButton)}
              onClick={() => {
                onMultipleChange?.([])
                onClear?.()
              }}
              disabled={disabled}
              aria-label="すべてクリア"
            >
              ✕
            </button>
          )}
          
          {showFilter && (
            <button
              type="button"
              className={classNames(styles.iconButton, styles.filterButton)}
              onClick={onFilterClick}
              disabled={disabled}
              aria-label="フィルター"
            >
              🔽
            </button>
          )}
        </div>
      </div>
      
      {/* ドロップダウン */}
      {showDropdown && options.length > 0 && (
        <div className={styles.dropdown}>
          {options
            .filter(option => !inputValue || option.label.toLowerCase().includes(inputValue.toLowerCase()))
            .map(option => (
              <div
                key={option.value}
                className={styles.dropdownItem}
                onClick={() => {
                  if (!multipleValue.includes(option.value)) {
                    onMultipleChange?.([...multipleValue, option.value])
                  }
                  setShowDropdown(false)
                }}
              >
                <div style={{ fontWeight: '500' }}>{option.label}</div>
                {option.category && (
                  <div className={styles.dropdownItemCategory}>
                    {option.category}
                  </div>
                )}
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}

export default SearchBox