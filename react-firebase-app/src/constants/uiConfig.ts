/**
 * UI configuration constants
 */
export const UI_CONFIG = {
  // Animation durations (ms)
  MODAL_FADE_DURATION: 300,
  TOAST_DURATION: 3000,
  ERROR_TOAST_DURATION: 5000,
  
  // Pagination
  MEMOS_PER_PAGE: 50,
  INFINITE_SCROLL_THRESHOLD: 200, // px from bottom
  
  // Breakpoints (matches Material-UI)
  BREAKPOINTS: {
    mobile: 599,
    tablet: 1023,
    desktop: 1024,
  },
  
  // Tap target sizes
  MIN_TAP_TARGET: 44, // px
  
  // Header height
  HEADER_HEIGHT: 44, // px
  INPUT_AREA_HEIGHT: 60, // px
  
  // Z-index layers
  Z_INDEX: {
    MODAL: 1300,
    TOAST: 1400,
    FLOATING_BUTTON: 1200,
  },
  
  // Colors (will be overridden by Material-UI theme)
  COLORS: {
    primary: '#1976D2',
    secondary: '#DC004E',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
  },
} as const;

export const MEMO_TYPES = {
  AUDIO: 'audio',
  TEXT: 'text',
  MIXED: 'mixed',
} as const;

export const DATE_SECTIONS = {
  TODAY: 'Today',
  YESTERDAY: 'Yesterday',
  OLDER: 'older',
} as const;