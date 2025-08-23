import { Timestamp } from 'firebase/firestore';

/**
 * Base memo interface (JSDoc記録用)
 * @typedef {Object} BaseMemo
 * @property {string} id
 * @property {string} userId
 * @property {string} [title]
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 * @property {MemoType} type
 */

/**
 * Audio memo specific properties
 * @typedef {Object} AudioMemo
 * @property {string} id
 * @property {string} userId
 * @property {string} [title]
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 * @property {'audio'} type
 * @property {string} audioUrl
 * @property {string} audioFileName
 * @property {number} duration - seconds
 * @property {string} [transcription]
 * @property {TranscriptionStatus} transcriptionStatus
 * @property {number} transcriptionRetryCount
 * @property {number[]} [waveformData]
 * @property {number} fileSize - bytes
 */

/**
 * Text-only memo
 * @typedef {Object} TextMemo
 * @property {string} id
 * @property {string} userId
 * @property {string} [title]
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 * @property {'text'} type
 * @property {string} textContent
 */

/**
 * Mixed memo (audio + manual text)
 * @typedef {Object} MixedMemo
 * @property {string} id
 * @property {string} userId
 * @property {string} [title]
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 * @property {'mixed'} type
 * @property {string} audioUrl
 * @property {string} audioFileName
 * @property {number} duration
 * @property {string} [transcription]
 * @property {TranscriptionStatus} transcriptionStatus
 * @property {number} transcriptionRetryCount
 * @property {string} textContent - manual text addition
 * @property {number[]} [waveformData]
 * @property {number} fileSize
 */

/**
 * Union type for all memo types
 * @typedef {AudioMemo | TextMemo | MixedMemo} Memo
 */

/**
 * Memo type enum
 * @typedef {'audio' | 'text' | 'mixed'} MemoType
 */

/**
 * Transcription status
 * @typedef {'pending' | 'processing' | 'completed' | 'failed' | 'error'} TranscriptionStatus
 */

/**
 * Memo creation data (before saving to Firestore)
 * @typedef {Object} CreateMemoData
 * @property {string} [userId]
 * @property {string} [title]
 * @property {MemoType} type
 * @property {string} [audioUrl] - Audio-specific fields
 * @property {string} [audioFileName]
 * @property {number} [duration]
 * @property {number[]} [waveformData]
 * @property {number} [fileSize]
 * @property {Blob} [audioBlob]
 * @property {string} [textContent] - Text-specific fields
 */

/**
 * Memo update data
 * @typedef {Object} UpdateMemoData
 * @property {string} [title]
 * @property {string} [audioUrl]
 * @property {number} [duration]
 * @property {string} [transcription]
 * @property {TranscriptionStatus} [transcriptionStatus]
 * @property {number} [transcriptionRetryCount]
 * @property {string} [textContent]
 * @property {string} [language]
 * @property {number} [confidence]
 * @property {any[]} [segments]
 * @property {number} [fileSize]
 * @property {Timestamp} [updatedAt]
 */

/**
 * Memo filter options
 * @typedef {Object} MemoFilter
 * @property {MemoType} [type]
 * @property {Date} [dateFrom]
 * @property {Date} [dateTo]
 * @property {boolean} [hasTranscription]
 * @property {string} [searchQuery]
 */

/**
 * Memo sort options
 * @typedef {Object} MemoSort
 * @property {'createdAt' | 'updatedAt' | 'title' | 'duration'} field
 * @property {'asc' | 'desc'} direction
 */

/**
 * Pagination options
 * @typedef {Object} MemoPagination
 * @property {number} limit
 * @property {any} [lastDoc] - Firestore DocumentSnapshot
 * @property {boolean} hasMore
 */

/**
 * Type guards
 */
export const isAudioMemo = (memo) => {
  return memo.type === 'audio';
};

export const isTextMemo = (memo) => {
  return memo.type === 'text';
};

export const isMixedMemo = (memo) => {
  return memo.type === 'mixed';
};

export const hasAudio = (memo) => {
  return memo.type === 'audio' || memo.type === 'mixed';
};

export const hasText = (memo) => {
  return memo.type === 'text' || memo.type === 'mixed';
};