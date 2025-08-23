/**
 * UI state for modals (JSDoc記録用)
 * @typedef {Object} ModalState
 * @property {boolean} recordingModalOpen
 * @property {boolean} transcribingModalOpen
 * @property {boolean} confirmDeleteModalOpen
 * @property {boolean} settingsModalOpen
 */

/**
 * Recording modal state
 * @typedef {Object} RecordingModalState
 * @property {boolean} isOpen
 * @property {boolean} isRecording
 * @property {number} duration
 * @property {number} maxDuration
 * @property {Float32Array} waveformData
 * @property {string} [error]
 */

/**
 * Transcribing modal state
 * @typedef {Object} TranscribingModalState
 * @property {boolean} isOpen
 * @property {number} progress - 0-100
 * @property {string} message
 * @property {TranscriptionStage} stage
 */

/**
 * Transcription processing stages
 * @typedef {'uploading' | 'processing' | 'finalizing' | 'completed' | 'error'} TranscriptionStage
 */

/**
 * Audio player UI state
 * @typedef {Object} AudioPlayerUIState
 * @property {string | null} currentlyPlaying - memo ID
 * @property {boolean} isPlaying
 * @property {number} currentTime
 * @property {number} duration
 * @property {number} volume
 * @property {boolean} isMuted
 */

/**
 * Timeline view state
 * @typedef {Object} TimelineViewState
 * @property {Date} [selectedDate]
 * @property {TimelineViewMode} viewMode
 * @property {SortOrder} sortOrder
 * @property {TimelineFilter} filterOptions
 */

/**
 * Timeline view modes
 * @typedef {'list' | 'grid' | 'timeline'} TimelineViewMode
 */

/**
 * Sort order options
 * @typedef {'newest' | 'oldest' | 'title' | 'duration'} SortOrder
 */

/**
 * Timeline filter options
 * @typedef {Object} TimelineFilter
 * @property {'all' | 'audio' | 'text' | 'mixed'} [type]
 * @property {DateRange} [dateRange]
 * @property {boolean} [hasTranscription]
 * @property {string} [searchQuery]
 */

/**
 * Date range filter
 * @typedef {Object} DateRange
 * @property {Date} from
 * @property {Date} to
 */

/**
 * Search state
 * @typedef {Object} SearchState
 * @property {string} query
 * @property {boolean} isSearching
 * @property {Object[]} results
 * @property {string[]} suggestions
 * @property {string[]} recentSearches
 */

/**
 * Toast notification types
 * @typedef {'success' | 'error' | 'warning' | 'info'} ToastType
 */

/**
 * Toast notification
 * @typedef {Object} ToastNotification
 * @property {string} id
 * @property {ToastType} type
 * @property {string} title
 * @property {string} [message]
 * @property {number} [duration] - ms
 * @property {ToastAction} [action]
 * @property {Date} createdAt
 */

/**
 * Toast action
 * @typedef {Object} ToastAction
 * @property {string} label
 * @property {function(): void} onClick
 */

/**
 * Loading states
 * @typedef {Object} LoadingState
 * @property {boolean} memos
 * @property {boolean} recording
 * @property {boolean} transcribing
 * @property {boolean} uploading
 * @property {boolean} deleting
 * @property {boolean} searching
 */

/**
 * Error states
 * @typedef {Object} ErrorState
 * @property {string} [memos]
 * @property {string} [recording]
 * @property {string} [transcribing]
 * @property {string} [uploading]
 * @property {string} [deleting]
 * @property {string} [searching]
 * @property {string} [general]
 */

/**
 * Pagination state
 * @typedef {Object} PaginationState
 * @property {number} currentPage
 * @property {number} totalPages
 * @property {number} totalItems
 * @property {number} itemsPerPage
 * @property {boolean} hasNextPage
 * @property {boolean} hasPreviousPage
 */

/**
 * App settings UI
 * @typedef {Object} AppSettingsUI
 * @property {'light' | 'dark' | 'system'} theme
 * @property {string} language
 * @property {boolean} autoTranscribe
 * @property {number} transcriptionRetries
 * @property {'low' | 'medium' | 'high'} recordingQuality
 * @property {NotificationSettings} notifications
 */

/**
 * Notification settings
 * @typedef {Object} NotificationSettings
 * @property {boolean} enabled
 * @property {boolean} transcriptionComplete
 * @property {boolean} transcriptionFailed
 * @property {boolean} storageWarning
 */

/**
 * Responsive breakpoint state
 * @typedef {Object} BreakpointState
 * @property {boolean} isMobile
 * @property {boolean} isTablet
 * @property {boolean} isDesktop
 * @property {number} screenWidth
 * @property {number} screenHeight
 */

/**
 * Keyboard shortcuts
 * @typedef {Object} KeyboardShortcuts
 * @property {string} startRecording - e.g., 'Space'
 * @property {string} stopRecording
 * @property {string} playPause
 * @property {string} search
 * @property {string} newTextMemo
 */

/**
 * Accessibility settings
 * @typedef {Object} AccessibilitySettings
 * @property {boolean} reducedMotion
 * @property {boolean} highContrast
 * @property {'small' | 'medium' | 'large'} fontSize
 * @property {boolean} screenReaderOptimized
 */

// Exportは何もしないが、JSDoc定義を読み込むために空のオブジェクトをexport
export {};