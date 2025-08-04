import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { 
  type Memo, 
  type CreateMemoData, 
  type UpdateMemoData,
  type MemoFilter,
  type MemoSort 
} from '../types/memo';
import { firestoreService } from '../services/firebase/firestore';
import { authService } from '../services/firebase/auth';

/**
 * メモデータ状態管理用Context
 * 
 * 設計原則:
 * - Firestore との連携
 * - リアルタイム更新対応
 * - ページング・検索機能
 * - エラーハンドリング
 */

// State interface
interface MemoState {
  memos: Memo[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  isSearching: boolean;
  searchResults: Memo[];
  filter: MemoFilter | null;
  sort: MemoSort;
}

// Action types
type MemoAction =
  | { type: 'MEMOS_LOADING' }
  | { type: 'MEMOS_LOADED'; payload: { memos: Memo[]; hasMore: boolean } }
  | { type: 'MEMO_ADDED'; payload: Memo }
  | { type: 'MEMO_UPDATED'; payload: Memo }
  | { type: 'MEMO_DELETED'; payload: string }
  | { type: 'MEMOS_ERROR'; payload: string }
  | { type: 'MEMOS_RESET' }
  | { type: 'SEARCH_START' }
  | { type: 'SEARCH_SUCCESS'; payload: Memo[] }
  | { type: 'SEARCH_ERROR'; payload: string }
  | { type: 'SEARCH_CLEAR' }
  | { type: 'SET_FILTER'; payload: MemoFilter | null }
  | { type: 'SET_SORT'; payload: MemoSort };

// Initial state
const initialState: MemoState = {
  memos: [],
  loading: false,
  error: null,
  hasMore: true,
  isSearching: false,
  searchResults: [],
  filter: null,
  sort: { field: 'createdAt', direction: 'desc' }
};

// Reducer function
const memoReducer = (state: MemoState, action: MemoAction): MemoState => {
  switch (action.type) {
    case 'MEMOS_LOADING':
      return { ...state, loading: true, error: null };
    
    case 'MEMOS_LOADED':
      return {
        ...state,
        memos: action.payload.memos,
        hasMore: action.payload.hasMore,
        loading: false,
        error: null
      };
    
    case 'MEMO_ADDED':
      return {
        ...state,
        memos: [action.payload, ...state.memos]
      };
    
    case 'MEMO_UPDATED':
      return {
        ...state,
        memos: state.memos.map(memo =>
          memo.id === action.payload.id ? action.payload : memo
        )
      };
    
    case 'MEMO_DELETED':
      return {
        ...state,
        memos: state.memos.filter(memo => memo.id !== action.payload)
      };
    
    case 'MEMOS_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'MEMOS_RESET':
      return { 
        ...initialState,
        filter: state.filter,
        sort: state.sort
      };
    
    case 'SEARCH_START':
      return { ...state, isSearching: true, error: null };
    
    case 'SEARCH_SUCCESS':
      return { 
        ...state, 
        isSearching: false, 
        searchResults: action.payload 
      };
    
    case 'SEARCH_ERROR':
      return { 
        ...state, 
        isSearching: false, 
        error: action.payload 
      };
    
    case 'SEARCH_CLEAR':
      return { ...state, searchResults: [], isSearching: false };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SORT':
      return { ...state, sort: action.payload };
    
    default:
      return state;
  }
};

// Context interface
interface MemoContextType {
  state: MemoState;
  // Data operations
  loadMemos: () => Promise<void>;
  loadMoreMemos: () => Promise<void>;
  createMemo: (memoData: CreateMemoData) => Promise<string>;
  updateMemo: (memoId: string, updateData: UpdateMemoData) => Promise<void>;
  deleteMemo: (memoId: string) => Promise<void>;
  // Search operations
  searchMemos: (query: string) => Promise<void>;
  clearSearch: () => void;
  // Filter/Sort operations
  setFilter: (filter: MemoFilter | null) => void;
  setSort: (sort: MemoSort) => void;
  // Utility operations
  refreshMemos: () => Promise<void>;
  clearError: () => void;
}

// Create context
const MemoContext = createContext<MemoContextType | undefined>(undefined);

// Provider component
interface MemoProviderProps {
  children: React.ReactNode;
}

export const MemoProvider: React.FC<MemoProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(memoReducer, initialState);
  
  // Track pagination
  const lastDocRef = React.useRef<any>(null);
  const unsubscribeRef = React.useRef<(() => void) | null>(null);

  /**
   * Load initial memos
   */
  const loadMemos = useCallback(async () => {
    const userId = authService.getCurrentUserId();
    if (!userId) return;

    dispatch({ type: 'MEMOS_LOADING' });

    try {
      const result = await firestoreService.getMemos(
        userId,
        state.filter || undefined,
        state.sort,
        { limit: 50, hasMore: true }
      );

      dispatch({ 
        type: 'MEMOS_LOADED', 
        payload: { 
          memos: result.memos, 
          hasMore: result.hasMore 
        } 
      });

      lastDocRef.current = result.lastDoc;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load memos';
      dispatch({ type: 'MEMOS_ERROR', payload: errorMessage });
    }
  }, [state.filter, state.sort]);

  /**
   * Load more memos (pagination)
   */
  const loadMoreMemos = useCallback(async () => {
    const userId = authService.getCurrentUserId();
    if (!userId || !state.hasMore || state.loading) return;

    dispatch({ type: 'MEMOS_LOADING' });

    try {
      const result = await firestoreService.getMemos(
        userId,
        state.filter || undefined,
        state.sort,
        { 
          limit: 50, 
          hasMore: true,
          lastDoc: lastDocRef.current 
        }
      );

      const updatedMemos = [...state.memos, ...result.memos];
      
      dispatch({ 
        type: 'MEMOS_LOADED', 
        payload: { 
          memos: updatedMemos, 
          hasMore: result.hasMore 
        } 
      });

      lastDocRef.current = result.lastDoc;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load more memos';
      dispatch({ type: 'MEMOS_ERROR', payload: errorMessage });
    }
  }, [state.filter, state.sort, state.hasMore, state.loading, state.memos]);

  /**
   * Create new memo
   */
  const createMemo = useCallback(async (memoData: CreateMemoData): Promise<string> => {
    try {
      const memoId = await firestoreService.createMemo(memoData);
      
      // 作成したメモを取得して即座に表示
      const newMemo = await firestoreService.getMemo(memoId);
      if (newMemo) {
        dispatch({ type: 'MEMO_ADDED', payload: newMemo });
      }
      
      return memoId;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create memo';
      dispatch({ type: 'MEMOS_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Update existing memo
   */
  const updateMemo = useCallback(async (memoId: string, updateData: UpdateMemoData): Promise<void> => {
    try {
      await firestoreService.updateMemo(memoId, updateData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update memo';
      dispatch({ type: 'MEMOS_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Delete memo
   */
  const deleteMemo = useCallback(async (memoId: string): Promise<void> => {
    try {
      await firestoreService.deleteMemo(memoId);
      dispatch({ type: 'MEMO_DELETED', payload: memoId });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete memo';
      dispatch({ type: 'MEMOS_ERROR', payload: errorMessage });
      throw error;
    }
  }, []);

  /**
   * Search memos
   */
  const searchMemos = useCallback(async (query: string): Promise<void> => {
    const userId = authService.getCurrentUserId();
    if (!userId || !query.trim()) return;

    dispatch({ type: 'SEARCH_START' });

    try {
      const results = await firestoreService.searchMemos(userId, query);
      dispatch({ type: 'SEARCH_SUCCESS', payload: results });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';
      dispatch({ type: 'SEARCH_ERROR', payload: errorMessage });
    }
  }, []);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    dispatch({ type: 'SEARCH_CLEAR' });
  }, []);

  /**
   * Set memo filter
   */
  const setFilter = useCallback((filter: MemoFilter | null) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
    lastDocRef.current = null; // Reset pagination
  }, []);

  /**
   * Set memo sort
   */
  const setSort = useCallback((sort: MemoSort) => {
    dispatch({ type: 'SET_SORT', payload: sort });
    lastDocRef.current = null; // Reset pagination
  }, []);

  /**
   * Refresh memos (reload from server)
   */
  const refreshMemos = useCallback(async () => {
    lastDocRef.current = null;
    await loadMemos();
  }, [loadMemos]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'MEMOS_ERROR', payload: '' });
  }, []);

  /**
   * Setup real-time listener when user is authenticated
   */
  useEffect(() => {
    const userId = authService.getCurrentUserId();
    if (!userId) {
      // Cleanup if user logs out
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      dispatch({ type: 'MEMOS_RESET' });
      return;
    }

    // Setup real-time listener
    try {
      const unsubscribe = firestoreService.subscribeToMemos(
        userId,
        (memos) => {
          dispatch({ 
            type: 'MEMOS_LOADED', 
            payload: { 
              memos, 
              hasMore: memos.length >= 50 
            } 
          });
        },
        state.filter || undefined,
        state.sort,
        50
      );

      unsubscribeRef.current = unsubscribe;
    } catch (error) {

      // Fallback to manual loading
      loadMemos();
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [state.filter, state.sort, loadMemos]);

  /**
   * Reload memos when filter or sort changes
   */
  useEffect(() => {
    const userId = authService.getCurrentUserId();
    if (userId) {
      refreshMemos();
    }
  }, [state.filter, state.sort, refreshMemos]);

  const contextValue: MemoContextType = {
    state,
    loadMemos,
    loadMoreMemos,
    createMemo,
    updateMemo,
    deleteMemo,
    searchMemos,
    clearSearch,
    setFilter,
    setSort,
    refreshMemos,
    clearError
  };

  return (
    <MemoContext.Provider value={contextValue}>
      {children}
    </MemoContext.Provider>
  );
};

// Custom hook for using memo context
export const useMemos = () => {
  const context = useContext(MemoContext);
  if (context === undefined) {
    throw new Error('useMemos must be used within a MemoProvider');
  }
  return context;
};