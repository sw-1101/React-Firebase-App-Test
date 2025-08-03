import { Timestamp } from 'firebase/firestore';

/**
 * Base memo interface
 */
export interface BaseMemo {
  id: string;
  userId: string;
  title?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  type: MemoType;
}

/**
 * Audio memo specific properties
 */
export interface AudioMemo extends BaseMemo {
  type: 'audio';
  audioUrl: string;
  audioFileName: string;
  duration: number; // seconds
  transcription?: string;
  transcriptionStatus: TranscriptionStatus;
  transcriptionRetryCount: number;
  waveformData?: number[];
  fileSize: number; // bytes
}

/**
 * Text-only memo
 */
export interface TextMemo extends BaseMemo {
  type: 'text';
  textContent: string;
}

/**
 * Mixed memo (audio + manual text)
 */
export interface MixedMemo extends BaseMemo {
  type: 'mixed';
  audioUrl: string;
  audioFileName: string;
  duration: number;
  transcription?: string;
  transcriptionStatus: TranscriptionStatus;
  transcriptionRetryCount: number;
  textContent: string; // manual text addition
  waveformData?: number[];
  fileSize: number;
}

/**
 * Union type for all memo types
 */
export type Memo = AudioMemo | TextMemo | MixedMemo;

/**
 * Memo type enum
 */
export type MemoType = 'audio' | 'text' | 'mixed';

/**
 * Transcription status
 */
export type TranscriptionStatus = 
  | 'pending'     // Not started
  | 'processing'  // In progress
  | 'completed'   // Successfully completed
  | 'failed'      // Failed (retryable)
  | 'error';      // Error (non-retryable)

/**
 * Memo creation data (before saving to Firestore)
 */
export interface CreateMemoData {
  userId: string;
  title?: string;
  type: MemoType;
  // Audio-specific fields
  audioUrl?: string;
  audioFileName?: string;
  duration?: number;
  waveformData?: number[];
  fileSize?: number;
  // Text-specific fields
  textContent?: string;
}

/**
 * Memo update data
 */
export interface UpdateMemoData {
  title?: string;
  transcription?: string;
  transcriptionStatus?: TranscriptionStatus;
  transcriptionRetryCount?: number;
  textContent?: string;
  updatedAt?: Timestamp;
}

/**
 * Memo filter options
 */
export interface MemoFilter {
  type?: MemoType;
  dateFrom?: Date;
  dateTo?: Date;
  hasTranscription?: boolean;
  searchQuery?: string;
}

/**
 * Memo sort options
 */
export interface MemoSort {
  field: 'createdAt' | 'updatedAt' | 'title' | 'duration';
  direction: 'asc' | 'desc';
}

/**
 * Pagination options
 */
export interface MemoPagination {
  limit: number;
  lastDoc?: any; // Firestore DocumentSnapshot
  hasMore: boolean;
}

/**
 * Type guards
 */
export const isAudioMemo = (memo: Memo): memo is AudioMemo => {
  return memo.type === 'audio';
};

export const isTextMemo = (memo: Memo): memo is TextMemo => {
  return memo.type === 'text';
};

export const isMixedMemo = (memo: Memo): memo is MixedMemo => {
  return memo.type === 'mixed';
};

export const hasAudio = (memo: Memo): memo is AudioMemo | MixedMemo => {
  return memo.type === 'audio' || memo.type === 'mixed';
};

export const hasText = (memo: Memo): memo is TextMemo | MixedMemo => {
  return memo.type === 'text' || memo.type === 'mixed';
};