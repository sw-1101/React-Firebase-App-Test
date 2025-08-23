/**
 * OpenAI Whisper API related types (JSDoc記録用)
 */

/**
 * Whisper API request options
 * @typedef {Object} WhisperTranscriptionRequest
 * @property {File | Blob} file
 * @property {string} [model] - Default: 'whisper-1'
 * @property {string} [prompt]
 * @property {WhisperResponseFormat} [response_format]
 * @property {number} [temperature] - 0-1
 * @property {string} [language] - ISO-639-1 code
 */

/**
 * Whisper API response formats
 * @typedef {'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'} WhisperResponseFormat
 */

/**
 * Whisper API response (json format)
 * @typedef {Object} WhisperTranscriptionResponse
 * @property {string} text
 */

/**
 * Whisper API response (verbose_json format)
 * @typedef {Object} WhisperVerboseResponse
 * @property {string} task
 * @property {string} language
 * @property {number} duration
 * @property {string} text
 * @property {WhisperSegment[]} segments
 */

/**
 * Whisper transcription segment
 * @typedef {Object} WhisperSegment
 * @property {number} id
 * @property {number} seek
 * @property {number} start
 * @property {number} end
 * @property {string} text
 * @property {number[]} tokens
 * @property {number} temperature
 * @property {number} avg_logprob
 * @property {number} compression_ratio
 * @property {number} no_speech_prob
 */

/**
 * Transcription service configuration
 * @typedef {Object} TranscriptionConfig
 * @property {string} apiKey
 * @property {string} [baseUrl]
 * @property {string} model
 * @property {string} [language]
 * @property {number} [temperature]
 * @property {number} maxRetries
 * @property {number} retryDelay - ms
 * @property {number} timeout - ms
 */

/**
 * Transcription request with metadata
 * @typedef {Object} TranscriptionRequest
 * @property {string} id
 * @property {Blob} audioFile
 * @property {string} [audioUrl]
 * @property {string} memoId
 * @property {string} userId
 * @property {Partial<WhisperTranscriptionRequest>} options
 * @property {Date} createdAt
 * @property {number} retryCount
 */

/**
 * Transcription result
 * @typedef {Object} TranscriptionResult
 * @property {string} id
 * @property {string} memoId
 * @property {string} text
 * @property {string} [language]
 * @property {number} [confidence]
 * @property {number} duration
 * @property {WhisperSegment[]} [segments]
 * @property {Date} processedAt
 * @property {number} processingTime - ms
 */

/**
 * Transcription error types
 * @typedef {'api_error' | 'network_error' | 'file_too_large' | 'invalid_format' | 'quota_exceeded' | 'authentication_failed' | 'processing_timeout' | 'unknown_error'} TranscriptionErrorType
 */

/**
 * Transcription error
 * @typedef {Object} TranscriptionError
 * @property {string} id
 * @property {string} memoId
 * @property {TranscriptionErrorType} type
 * @property {string} message
 * @property {string} [code]
 * @property {any} [details]
 * @property {Date} occurredAt
 * @property {boolean} isRetryable
 */

/**
 * Transcription service status
 * @typedef {Object} TranscriptionServiceStatus
 * @property {boolean} isOnline
 * @property {number} responseTime - ms
 * @property {number} [quotaRemaining]
 * @property {Date} lastChecked
 * @property {number} errorRate - 0-1
 */

/**
 * Transcription priority levels
 * @typedef {'low' | 'normal' | 'high' | 'urgent'} TranscriptionPriority
 */

/**
 * Transcription queue status
 * @typedef {'queued' | 'processing' | 'completed' | 'failed' | 'cancelled'} TranscriptionQueueStatus
 */

/**
 * Transcription queue item
 * @typedef {Object} TranscriptionQueueItem
 * @property {TranscriptionRequest} request
 * @property {TranscriptionPriority} priority
 * @property {Date} addedAt
 * @property {Date} [startedAt]
 * @property {Date} [completedAt]
 * @property {TranscriptionQueueStatus} status
 */

/**
 * Batch transcription request
 * @typedef {Object} BatchTranscriptionRequest
 * @property {TranscriptionRequest[]} requests
 * @property {string} batchId
 * @property {Date} createdAt
 * @property {TranscriptionPriority} priority
 */

/**
 * Batch transcription result
 * @typedef {Object} BatchTranscriptionResult
 * @property {string} batchId
 * @property {(TranscriptionResult | TranscriptionError)[]} results
 * @property {Date} completedAt
 * @property {number} totalProcessingTime
 * @property {number} successCount
 * @property {number} errorCount
 */

// Exportは何もしないが、JSDoc定義を読み込むために空のオブジェクトをexport
export {};