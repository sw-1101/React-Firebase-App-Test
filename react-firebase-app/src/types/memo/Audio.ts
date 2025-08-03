/**
 * Audio recording configuration
 */
export interface AudioConfig {
  sampleRate: number;
  channels: number;
  bitDepth: number;
  maxDuration: number; // seconds
  maxFileSize: number; // bytes
  supportedFormats: string[];
}

/**
 * Recording state
 */
export type RecordingState = 
  | 'idle'
  | 'initializing'
  | 'recording'
  | 'paused'
  | 'stopping'
  | 'completed'
  | 'error';

/**
 * Audio recording data
 */
export interface AudioRecording {
  blob: Blob;
  duration: number; // seconds
  size: number; // bytes
  mimeType: string;
  waveformData?: Float32Array;
  url?: string; // Object URL for preview
}

/**
 * Recording session info
 */
export interface RecordingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  state: RecordingState;
  audioData?: AudioRecording;
  error?: string;
}

/**
 * Audio processing options
 */
export interface AudioProcessingOptions {
  normalize: boolean;
  removeNoise: boolean;
  compressLevel: number; // 0-100
}

/**
 * Waveform data for visualization
 */
export interface WaveformData {
  peaks: number[];
  duration: number;
  sampleRate: number;
  channels: number;
}

/**
 * Audio player state
 */
export type AudioPlayerState = 
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';

/**
 * Audio player info
 */
export interface AudioPlayerInfo {
  url: string;
  duration: number;
  currentTime: number;
  state: AudioPlayerState;
  volume: number; // 0-1
  muted: boolean;
}

/**
 * Audio analysis result
 */
export interface AudioAnalysis {
  duration: number;
  fileSize: number;
  format: string;
  quality: AudioQuality;
  waveform: WaveformData;
  volume: {
    peak: number;
    rms: number;
    average: number;
  };
}

/**
 * Audio quality assessment
 */
export type AudioQuality = 'excellent' | 'good' | 'fair' | 'poor';

/**
 * Audio error types
 */
export type AudioErrorType = 
  | 'permission_denied'
  | 'device_not_found'
  | 'not_supported'
  | 'file_too_large'
  | 'invalid_format'
  | 'processing_failed'
  | 'network_error'
  | 'unknown_error';

/**
 * Audio error info
 */
export interface AudioError {
  type: AudioErrorType;
  message: string;
  details?: any;
  timestamp: Date;
}

/**
 * Media recorder options extension
 */
export interface ExtendedMediaRecorderOptions extends MediaRecorderOptions {
  timeslice?: number;
  onDataAvailable?: (data: Blob) => void;
  onError?: (error: AudioError) => void;
}

/**
 * Browser compatibility info
 */
export interface AudioCompatibility {
  mediaRecorder: boolean;
  webAudioAPI: boolean;
  getUserMedia: boolean;
  supportedMimeTypes: string[];
  recommendedMimeType: string;
}

/**
 * Audio file metadata
 */
export interface AudioFileMetadata {
  fileName: string;
  mimeType: string;
  size: number;
  duration: number;
  createdAt: Date;
  lastModified: Date;
  checksum?: string;
}