import { Memo } from './Memo';

/**
 * UI state for modals
 */
export interface ModalState {
  recordingModalOpen: boolean;
  transcribingModalOpen: boolean;
  confirmDeleteModalOpen: boolean;
  settingsModalOpen: boolean;
}

/**
 * Recording modal state
 */
export interface RecordingModalState {
  isOpen: boolean;
  isRecording: boolean;
  duration: number;
  maxDuration: number;
  waveformData: Float32Array;
  error?: string;
}

/**
 * Transcribing modal state
 */
export interface TranscribingModalState {
  isOpen: boolean;
  progress: number; // 0-100
  message: string;
  stage: TranscriptionStage;
}

/**
 * Transcription processing stages
 */
export type TranscriptionStage = 
  | 'uploading'
  | 'processing'
  | 'finalizing'
  | 'completed'
  | 'error';

/**
 * Audio player UI state
 */
export interface AudioPlayerUIState {
  currentlyPlaying: string | null; // memo ID
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
}

/**
 * Timeline view state
 */
export interface TimelineViewState {
  selectedDate?: Date;
  viewMode: TimelineViewMode;
  sortOrder: SortOrder;
  filterOptions: TimelineFilter;
}

/**
 * Timeline view modes
 */
export type TimelineViewMode = 'timeline' | 'grid' | 'list';

/**
 * Sort order options
 */
export type SortOrder = 'newest' | 'oldest' | 'title' | 'duration';

/**
 * Timeline filter options
 */
export interface TimelineFilter {
  type?: 'all' | 'audio' | 'text' | 'mixed';
  dateRange?: DateRange;
  hasTranscription?: boolean;
  searchQuery?: string;
}

/**
 * Date range filter
 */
export interface DateRange {
  from: Date;
  to: Date;
}

/**
 * Search state
 */
export interface SearchState {
  query: string;
  isSearching: boolean;
  results: Memo[];
  suggestions: string[];
  recentSearches: string[];
}

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification
 */
export interface ToastNotification {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms
  action?: ToastAction;
  createdAt: Date;
}

/**
 * Toast action
 */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

/**
 * Loading states
 */
export interface LoadingState {
  memos: boolean;
  recording: boolean;
  transcribing: boolean;
  uploading: boolean;
  deleting: boolean;
  searching: boolean;
}

/**
 * Error states
 */
export interface ErrorState {
  memos?: string;
  recording?: string;
  transcribing?: string;
  uploading?: string;
  deleting?: string;
  searching?: string;
  general?: string;
}

/**
 * Pagination state
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * App settings UI
 */
export interface AppSettingsUI {
  theme: 'light' | 'dark' | 'system';
  language: string;
  autoTranscribe: boolean;
  transcriptionRetries: number;
  recordingQuality: 'low' | 'medium' | 'high';
  notifications: NotificationSettings;
}

/**
 * Notification settings
 */
export interface NotificationSettings {
  enabled: boolean;
  transcriptionComplete: boolean;
  transcriptionFailed: boolean;
  storageWarning: boolean;
}

/**
 * Responsive breakpoint state
 */
export interface BreakpointState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
}

/**
 * Keyboard shortcuts
 */
export interface KeyboardShortcuts {
  startRecording: string; // e.g., 'Space'
  stopRecording: string;
  playPause: string;
  search: string;
  newTextMemo: string;
}

/**
 * Accessibility settings
 */
export interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  fontSize: 'small' | 'medium' | 'large';
  screenReaderOptimized: boolean;
}