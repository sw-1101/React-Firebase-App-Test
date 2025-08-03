/**
 * OpenAI Whisper API related types
 */

/**
 * Whisper API request options
 */
export interface WhisperTranscriptionRequest {
  file: File | Blob;
  model?: string; // Default: 'whisper-1'
  prompt?: string;
  response_format?: WhisperResponseFormat;
  temperature?: number; // 0-1
  language?: string; // ISO-639-1 code
}

/**
 * Whisper API response formats
 */
export type WhisperResponseFormat = 
  | 'json'
  | 'text'  
  | 'srt'
  | 'verbose_json'
  | 'vtt';

/**
 * Whisper API response (json format)
 */
export interface WhisperTranscriptionResponse {
  text: string;
}

/**
 * Whisper API response (verbose_json format)
 */
export interface WhisperVerboseResponse {
  task: string;
  language: string;
  duration: number;
  text: string;
  segments: WhisperSegment[];
}

/**
 * Whisper transcription segment
 */
export interface WhisperSegment {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
}

/**
 * Transcription service configuration
 */
export interface TranscriptionConfig {
  apiKey: string;
  baseUrl?: string;
  model: string;
  language?: string;
  temperature?: number;
  maxRetries: number;
  retryDelay: number; // ms
  timeout: number; // ms
}

/**
 * Transcription request with metadata
 */
export interface TranscriptionRequest {
  id: string;
  audioFile: Blob;
  audioUrl?: string;
  memoId: string;
  userId: string;
  options: Partial<WhisperTranscriptionRequest>;
  createdAt: Date;
  retryCount: number;
}

/**
 * Transcription result
 */
export interface TranscriptionResult {
  id: string;
  memoId: string;
  text: string;
  language?: string;
  confidence?: number;
  duration: number;
  segments?: WhisperSegment[];
  processedAt: Date;
  processingTime: number; // ms
}

/**
 * Transcription error
 */
export interface TranscriptionError {
  id: string;
  memoId: string;
  type: TranscriptionErrorType;
  message: string;
  code?: string;
  details?: any;
  occurredAt: Date;
  isRetryable: boolean;
}

/**
 * Transcription error types
 */
export type TranscriptionErrorType = 
  | 'api_error'
  | 'network_error'
  | 'file_too_large'
  | 'invalid_format'
  | 'quota_exceeded'
  | 'authentication_failed'
  | 'processing_timeout'
  | 'unknown_error';

/**
 * Transcription service status
 */
export interface TranscriptionServiceStatus {
  isOnline: boolean;
  responseTime: number; // ms
  quotaRemaining?: number;
  lastChecked: Date;
  errorRate: number; // 0-1
}

/**
 * Transcription queue item
 */
export interface TranscriptionQueueItem {
  request: TranscriptionRequest;
  priority: TranscriptionPriority;
  addedAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: TranscriptionQueueStatus;
}

/**
 * Transcription priority levels
 */
export type TranscriptionPriority = 'high' | 'normal' | 'low';

/**
 * Transcription queue status
 */
export type TranscriptionQueueStatus = 
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

/**
 * Batch transcription request
 */
export interface BatchTranscriptionRequest {
  requests: TranscriptionRequest[];
  batchId: string;
  createdAt: Date;
  priority: TranscriptionPriority;
}

/**
 * Batch transcription result
 */
export interface BatchTranscriptionResult {
  batchId: string;
  results: (TranscriptionResult | TranscriptionError)[];
  completedAt: Date;
  totalProcessingTime: number;
  successCount: number;
  errorCount: number;
}