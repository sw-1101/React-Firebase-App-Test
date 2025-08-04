import React, { createContext, useContext, useReducer, useCallback } from 'react';
import {
  type ModalState,
  type RecordingModalState,
  type TranscribingModalState,
  type AudioPlayerUIState,
  type TimelineViewState,
  type SearchState,
  type ToastNotification,
  type ToastType,
  type LoadingState,
  type ErrorState,
  type TimelineViewMode,
  type SortOrder,
  type TimelineFilter
} from '@/types/memo/UI';

/**
 * UI状態管理用Context
 * 
 * 設計原則:
 * - モーダル状態の管理
 * - 音声プレイヤー状態の管理
 * - 通知システムの管理
 * - ローディング・エラー状態の管理
 */

// Combined UI State
interface UIState {
  modals: ModalState;
  recordingModal: RecordingModalState;
  transcribingModal: TranscribingModalState;
  audioPlayer: AudioPlayerUIState;
  timeline: TimelineViewState;
  search: SearchState;
  toasts: ToastNotification[];
  loading: LoadingState;
  errors: ErrorState;
  theme: 'light' | 'dark';
}

// Action types
type UIAction =
  // Modal actions
  | { type: 'OPEN_RECORDING_MODAL' }
  | { type: 'CLOSE_RECORDING_MODAL' }
  | { type: 'UPDATE_RECORDING_MODAL'; payload: Partial<RecordingModalState> }
  | { type: 'OPEN_TRANSCRIBING_MODAL'; payload?: { message?: string } }
  | { type: 'CLOSE_TRANSCRIBING_MODAL' }
  | { type: 'UPDATE_TRANSCRIBING_MODAL'; payload: Partial<TranscribingModalState> }
  | { type: 'OPEN_CONFIRM_DELETE_MODAL' }
  | { type: 'CLOSE_CONFIRM_DELETE_MODAL' }
  | { type: 'OPEN_SETTINGS_MODAL' }
  | { type: 'CLOSE_SETTINGS_MODAL' }
  
  // Audio player actions
  | { type: 'SET_CURRENTLY_PLAYING'; payload: string | null }
  | { type: 'SET_AUDIO_PLAYING'; payload: boolean }
  | { type: 'UPDATE_AUDIO_TIME'; payload: { currentTime: number; duration?: number } }
  | { type: 'SET_AUDIO_VOLUME'; payload: number }
  | { type: 'SET_AUDIO_MUTED'; payload: boolean }
  
  // Timeline view actions
  | { type: 'SET_VIEW_MODE'; payload: TimelineViewMode }
  | { type: 'SET_SORT_ORDER'; payload: SortOrder }
  | { type: 'SET_TIMELINE_FILTER'; payload: Partial<TimelineFilter> }
  | { type: 'SET_SELECTED_DATE'; payload: Date | undefined }
  
  // Search actions
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_LOADING'; payload: boolean }
  | { type: 'SET_SEARCH_RESULTS'; payload: any[] }
  | { type: 'ADD_RECENT_SEARCH'; payload: string }
  | { type: 'CLEAR_SEARCH' }
  
  // Toast actions
  | { type: 'ADD_TOAST'; payload: Omit<ToastNotification, 'id' | 'createdAt'> }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'CLEAR_ALL_TOASTS' }
  
  // Loading actions
  | { type: 'SET_LOADING'; payload: { key: keyof LoadingState; value: boolean } }
  
  // Error actions
  | { type: 'SET_ERROR'; payload: { key: keyof ErrorState; value: string | undefined } }
  | { type: 'CLEAR_ERROR'; payload: keyof ErrorState }
  | { type: 'CLEAR_ALL_ERRORS' }
  
  // Theme actions
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_THEME' };

// Initial state
const initialState: UIState = {
  modals: {
    recordingModalOpen: false,
    transcribingModalOpen: false,
    confirmDeleteModalOpen: false,
    settingsModalOpen: false
  },
  recordingModal: {
    isOpen: false,
    isRecording: false,
    duration: 0,
    maxDuration: 60,
    waveformData: new Float32Array(),
    error: undefined
  },
  transcribingModal: {
    isOpen: false,
    progress: 0,
    message: '音声を解析しています...',
    stage: 'processing'
  },
  audioPlayer: {
    currentlyPlaying: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false
  },
  timeline: {
    viewMode: 'timeline',
    sortOrder: 'newest',
    filterOptions: {
      type: 'all',
      hasTranscription: undefined,
      searchQuery: undefined
    }
  },
  search: {
    query: '',
    isSearching: false,
    results: [],
    suggestions: [],
    recentSearches: []
  },
  toasts: [],
  loading: {
    memos: false,
    recording: false,
    transcribing: false,
    uploading: false,
    deleting: false,
    searching: false
  },
  errors: {},
  theme: 'light'
};

// Reducer function
const uiReducer = (state: UIState, action: UIAction): UIState => {
  switch (action.type) {
    // Modal actions
    case 'OPEN_RECORDING_MODAL':
      return {
        ...state,
        modals: { ...state.modals, recordingModalOpen: true },
        recordingModal: { ...state.recordingModal, isOpen: true }
      };
    
    case 'CLOSE_RECORDING_MODAL':
      return {
        ...state,
        modals: { ...state.modals, recordingModalOpen: false },
        recordingModal: { ...initialState.recordingModal }
      };
    
    case 'UPDATE_RECORDING_MODAL':
      return {
        ...state,
        recordingModal: { ...state.recordingModal, ...action.payload }
      };
    
    case 'OPEN_TRANSCRIBING_MODAL':
      return {
        ...state,
        modals: { ...state.modals, transcribingModalOpen: true },
        transcribingModal: {
          ...state.transcribingModal,
          isOpen: true,
          message: action.payload?.message || '音声を解析しています...',
          progress: 0,
          stage: 'processing'
        }
      };
    
    case 'CLOSE_TRANSCRIBING_MODAL':
      return {
        ...state,
        modals: { ...state.modals, transcribingModalOpen: false },
        transcribingModal: { ...initialState.transcribingModal }
      };
    
    case 'UPDATE_TRANSCRIBING_MODAL':
      return {
        ...state,
        transcribingModal: { ...state.transcribingModal, ...action.payload }
      };
    
    case 'OPEN_CONFIRM_DELETE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, confirmDeleteModalOpen: true }
      };
    
    case 'CLOSE_CONFIRM_DELETE_MODAL':
      return {
        ...state,
        modals: { ...state.modals, confirmDeleteModalOpen: false }
      };
    
    case 'OPEN_SETTINGS_MODAL':
      return {
        ...state,
        modals: { ...state.modals, settingsModalOpen: true }
      };
    
    case 'CLOSE_SETTINGS_MODAL':
      return {
        ...state,
        modals: { ...state.modals, settingsModalOpen: false }
      };

    // Audio player actions
    case 'SET_CURRENTLY_PLAYING':
      return {
        ...state,
        audioPlayer: {
          ...state.audioPlayer,
          currentlyPlaying: action.payload,
          isPlaying: action.payload !== null
        }
      };
    
    case 'SET_AUDIO_PLAYING':
      return {
        ...state,
        audioPlayer: { ...state.audioPlayer, isPlaying: action.payload }
      };
    
    case 'UPDATE_AUDIO_TIME':
      return {
        ...state,
        audioPlayer: {
          ...state.audioPlayer,
          currentTime: action.payload.currentTime,
          ...(action.payload.duration && { duration: action.payload.duration })
        }
      };
    
    case 'SET_AUDIO_VOLUME':
      return {
        ...state,
        audioPlayer: { ...state.audioPlayer, volume: action.payload }
      };
    
    case 'SET_AUDIO_MUTED':
      return {
        ...state,
        audioPlayer: { ...state.audioPlayer, isMuted: action.payload }
      };

    // Timeline view actions
    case 'SET_VIEW_MODE':
      return {
        ...state,
        timeline: { ...state.timeline, viewMode: action.payload }
      };
    
    case 'SET_SORT_ORDER':
      return {
        ...state,
        timeline: { ...state.timeline, sortOrder: action.payload }
      };
    
    case 'SET_TIMELINE_FILTER':
      return {
        ...state,
        timeline: {
          ...state.timeline,
          filterOptions: { ...state.timeline.filterOptions, ...action.payload }
        }
      };
    
    case 'SET_SELECTED_DATE':
      return {
        ...state,
        timeline: { ...state.timeline, selectedDate: action.payload }
      };

    // Search actions
    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        search: { ...state.search, query: action.payload }
      };
    
    case 'SET_SEARCH_LOADING':
      return {
        ...state,
        search: { ...state.search, isSearching: action.payload }
      };
    
    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        search: { ...state.search, results: action.payload, isSearching: false }
      };
    
    case 'ADD_RECENT_SEARCH':
      const newRecentSearches = [
        action.payload,
        ...state.search.recentSearches.filter(s => s !== action.payload)
      ].slice(0, 10); // Keep only last 10
      
      return {
        ...state,
        search: { ...state.search, recentSearches: newRecentSearches }
      };
    
    case 'CLEAR_SEARCH':
      return {
        ...state,
        search: {
          ...initialState.search,
          recentSearches: state.search.recentSearches
        }
      };

    // Toast actions
    case 'ADD_TOAST':
      const newToast: ToastNotification = {
        ...action.payload,
        id: `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date()
      };
      
      return {
        ...state,
        toasts: [...state.toasts, newToast]
      };
    
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(toast => toast.id !== action.payload)
      };
    
    case 'CLEAR_ALL_TOASTS':
      return {
        ...state,
        toasts: []
      };

    // Loading actions
    case 'SET_LOADING':
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value }
      };

    // Error actions
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value }
      };
    
    case 'CLEAR_ERROR':
      const { [action.payload]: _, ...remainingErrors } = state.errors;
      return {
        ...state,
        errors: remainingErrors
      };
    
    case 'CLEAR_ALL_ERRORS':
      return {
        ...state,
        errors: {}
      };

    // Theme actions
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    
    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light'
      };

    default:
      return state;
  }
};

// Context interface
interface UIContextType {
  state: UIState;
  
  // Modal actions
  openRecordingModal: () => void;
  closeRecordingModal: () => void;
  updateRecordingModal: (updates: Partial<RecordingModalState>) => void;
  openTranscribingModal: (message?: string) => void;
  closeTranscribingModal: () => void;
  updateTranscribingModal: (updates: Partial<TranscribingModalState>) => void;
  openConfirmDeleteModal: () => void;
  closeConfirmDeleteModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  
  // Audio player actions
  setCurrentlyPlaying: (memoId: string | null) => void;
  setAudioPlaying: (isPlaying: boolean) => void;
  updateAudioTime: (currentTime: number, duration?: number) => void;
  setAudioVolume: (volume: number) => void;
  setAudioMuted: (muted: boolean) => void;
  
  // Timeline view actions
  setViewMode: (mode: TimelineViewMode) => void;
  setSortOrder: (order: SortOrder) => void;
  setTimelineFilter: (filter: Partial<TimelineFilter>) => void;
  setSelectedDate: (date: Date | undefined) => void;
  
  // Search actions
  setSearchQuery: (query: string) => void;
  setSearchLoading: (loading: boolean) => void;
  setSearchResults: (results: any[]) => void;
  addRecentSearch: (query: string) => void;
  clearSearch: () => void;
  
  // Toast actions
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  showSuccessToast: (title: string, message?: string) => void;
  showErrorToast: (title: string, message?: string) => void;
  showWarningToast: (title: string, message?: string) => void;
  showInfoToast: (title: string, message?: string) => void;
  removeToast: (toastId: string) => void;
  clearAllToasts: () => void;
  
  // Loading actions
  setLoading: (key: keyof LoadingState, value: boolean) => void;
  
  // Error actions
  setError: (key: keyof ErrorState, value: string | undefined) => void;
  clearError: (key: keyof ErrorState) => void;
  clearAllErrors: () => void;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Create context
const UIContext = createContext<UIContextType | undefined>(undefined);

// Provider component
interface UIProviderProps {
  children: React.ReactNode;
}

export const UIProvider: React.FC<UIProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);

  // Modal actions
  const openRecordingModal = useCallback(() => {
    dispatch({ type: 'OPEN_RECORDING_MODAL' });
  }, []);

  const closeRecordingModal = useCallback(() => {
    dispatch({ type: 'CLOSE_RECORDING_MODAL' });
  }, []);

  const updateRecordingModal = useCallback((updates: Partial<RecordingModalState>) => {
    dispatch({ type: 'UPDATE_RECORDING_MODAL', payload: updates });
  }, []);

  const openTranscribingModal = useCallback((message?: string) => {
    dispatch({ type: 'OPEN_TRANSCRIBING_MODAL', payload: { message } });
  }, []);

  const closeTranscribingModal = useCallback(() => {
    dispatch({ type: 'CLOSE_TRANSCRIBING_MODAL' });
  }, []);

  const updateTranscribingModal = useCallback((updates: Partial<TranscribingModalState>) => {
    dispatch({ type: 'UPDATE_TRANSCRIBING_MODAL', payload: updates });
  }, []);

  const openConfirmDeleteModal = useCallback(() => {
    dispatch({ type: 'OPEN_CONFIRM_DELETE_MODAL' });
  }, []);

  const closeConfirmDeleteModal = useCallback(() => {
    dispatch({ type: 'CLOSE_CONFIRM_DELETE_MODAL' });
  }, []);

  const openSettingsModal = useCallback(() => {
    dispatch({ type: 'OPEN_SETTINGS_MODAL' });
  }, []);

  const closeSettingsModal = useCallback(() => {
    dispatch({ type: 'CLOSE_SETTINGS_MODAL' });
  }, []);

  // Audio player actions
  const setCurrentlyPlaying = useCallback((memoId: string | null) => {
    dispatch({ type: 'SET_CURRENTLY_PLAYING', payload: memoId });
  }, []);

  const setAudioPlaying = useCallback((isPlaying: boolean) => {
    dispatch({ type: 'SET_AUDIO_PLAYING', payload: isPlaying });
  }, []);

  const updateAudioTime = useCallback((currentTime: number, duration?: number) => {
    dispatch({ type: 'UPDATE_AUDIO_TIME', payload: { currentTime, duration } });
  }, []);

  const setAudioVolume = useCallback((volume: number) => {
    dispatch({ type: 'SET_AUDIO_VOLUME', payload: volume });
  }, []);

  const setAudioMuted = useCallback((muted: boolean) => {
    dispatch({ type: 'SET_AUDIO_MUTED', payload: muted });
  }, []);

  // Timeline view actions
  const setViewMode = useCallback((mode: TimelineViewMode) => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  }, []);

  const setSortOrder = useCallback((order: SortOrder) => {
    dispatch({ type: 'SET_SORT_ORDER', payload: order });
  }, []);

  const setTimelineFilter = useCallback((filter: Partial<TimelineFilter>) => {
    dispatch({ type: 'SET_TIMELINE_FILTER', payload: filter });
  }, []);

  const setSelectedDate = useCallback((date: Date | undefined) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  }, []);

  // Search actions
  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  const setSearchLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_SEARCH_LOADING', payload: loading });
  }, []);

  const setSearchResults = useCallback((results: any[]) => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, []);

  const addRecentSearch = useCallback((query: string) => {
    if (query.trim()) {
      dispatch({ type: 'ADD_RECENT_SEARCH', payload: query.trim() });
    }
  }, []);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'CLEAR_SEARCH' });
  }, []);

  // Toast actions
  const showToast = useCallback((
    type: ToastType, 
    title: string, 
    message?: string, 
    duration?: number
  ) => {
    dispatch({ 
      type: 'ADD_TOAST', 
      payload: { type, title, message, duration } 
    });
  }, []);

  const showSuccessToast = useCallback((title: string, message?: string) => {
    showToast('success', title, message, 3000);
  }, [showToast]);

  const showErrorToast = useCallback((title: string, message?: string) => {
    showToast('error', title, message, 5000);
  }, [showToast]);

  const showWarningToast = useCallback((title: string, message?: string) => {
    showToast('warning', title, message, 4000);
  }, [showToast]);

  const showInfoToast = useCallback((title: string, message?: string) => {
    showToast('info', title, message, 3000);
  }, [showToast]);

  const removeToast = useCallback((toastId: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: toastId });
  }, []);

  const clearAllToasts = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_TOASTS' });
  }, []);

  // Loading actions
  const setLoading = useCallback((key: keyof LoadingState, value: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: { key, value } });
  }, []);

  // Error actions
  const setError = useCallback((key: keyof ErrorState, value: string | undefined) => {
    dispatch({ type: 'SET_ERROR', payload: { key, value } });
  }, []);

  const clearError = useCallback((key: keyof ErrorState) => {
    dispatch({ type: 'CLEAR_ERROR', payload: key });
  }, []);

  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL_ERRORS' });
  }, []);

  // Theme actions
  const setTheme = useCallback((theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  }, []);

  const toggleTheme = useCallback(() => {
    dispatch({ type: 'TOGGLE_THEME' });
  }, []);

  const contextValue: UIContextType = {
    state,
    
    // Modal actions
    openRecordingModal,
    closeRecordingModal,
    updateRecordingModal,
    openTranscribingModal,
    closeTranscribingModal,
    updateTranscribingModal,
    openConfirmDeleteModal,
    closeConfirmDeleteModal,
    openSettingsModal,
    closeSettingsModal,
    
    // Audio player actions
    setCurrentlyPlaying,
    setAudioPlaying,
    updateAudioTime,
    setAudioVolume,
    setAudioMuted,
    
    // Timeline view actions
    setViewMode,
    setSortOrder,
    setTimelineFilter,
    setSelectedDate,
    
    // Search actions
    setSearchQuery,
    setSearchLoading,
    setSearchResults,
    addRecentSearch,
    clearSearch,
    
    // Toast actions
    showToast,
    showSuccessToast,
    showErrorToast,
    showWarningToast,
    showInfoToast,
    removeToast,
    clearAllToasts,
    
    // Loading actions
    setLoading,
    
    // Error actions
    setError,
    clearError,
    clearAllErrors,
    
    // Theme actions
    setTheme,
    toggleTheme
  };

  return (
    <UIContext.Provider value={contextValue}>
      {children}
    </UIContext.Provider>
  );
};

// Custom hook for using UI context
export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};