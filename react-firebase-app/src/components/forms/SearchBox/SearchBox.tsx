import React, { useState, useCallback } from 'react'
import { 
  TextField, 
  InputAdornment, 
  IconButton, 
  Box,
  Autocomplete,
  Chip,
  Paper
} from '@mui/material'
import { Search, Clear, FilterList } from '@mui/icons-material'

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
  width = '100%',
  size = 'medium',
  disabled = false,
  showFilter = false,
  loading = false,
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
      <Box sx={{ width: fullWidth ? '100%' : width }}>
        <TextField
          fullWidth
          size={size}
          placeholder={placeholder}
          value={inputValue}
          disabled={disabled}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color={disabled ? 'disabled' : 'action'} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {inputValue && (
                    <IconButton
                      size="small"
                      onClick={handleClear}
                      disabled={disabled}
                      aria-label="クリア"
                    >
                      <Clear />
                    </IconButton>
                  )}
                  {showFilter && (
                    <IconButton
                      size="small"
                      onClick={onFilterClick}
                      disabled={disabled}
                      aria-label="フィルター"
                    >
                      <FilterList />
                    </IconButton>
                  )}
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    )
  }

  // 複数選択の場合（Autocomplete使用）
  const selectedOptions = options.filter(option => 
    multipleValue.includes(option.value)
  )

  return (
    <Box sx={{ width }}>
      <Autocomplete
        multiple
        size={size}
        disabled={disabled}
        loading={loading}
        options={options}
        value={selectedOptions}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        onChange={(_, newValue) => {
          const values = newValue.map(option => option.value)
          onMultipleChange?.(values)
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={selectedOptions.length === 0 ? placeholder : ''}
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <Search color={disabled ? 'disabled' : 'action'} />
                </InputAdornment>
              ),
              endAdornment: (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {selectedOptions.length > 0 && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        onMultipleChange?.([])
                        onClear?.()
                      }}
                      disabled={disabled}
                      aria-label="すべてクリア"
                    >
                      <Clear />
                    </IconButton>
                  )}
                  {showFilter && (
                    <IconButton
                      size="small"
                      onClick={onFilterClick}
                      disabled={disabled}
                      aria-label="フィルター"
                    >
                      <FilterList />
                    </IconButton>
                  )}
                  {params.InputProps.endAdornment}
                </Box>
              ),
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index })
            return (
              <Chip
                key={key}
                label={option.label}
                size="small"
                {...tagProps}
              />
            )
          })
        }
        renderOption={(props, option) => (
          <Box component="li" {...props}>
            <Box>
              <Box sx={{ fontWeight: 'medium' }}>{option.label}</Box>
              {option.category && (
                <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {option.category}
                </Box>
              )}
            </Box>
          </Box>
        )}
        PaperComponent={({ children, ...other }) => (
          <Paper {...other} sx={{ mt: 1 }}>
            {children}
          </Paper>
        )}
      />
    </Box>
  )
}

export default SearchBox