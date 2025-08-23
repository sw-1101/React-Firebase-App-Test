/**
 * Audio recording configuration (JSDoc記録用)
 * @typedef {Object} AudioConfig
 * @property {number} sampleRate
 * @property {number} channels
 * @property {number} bitDepth
 * @property {number} maxDuration - seconds
 * @property {number} maxFileSize - bytes
 * @property {string[]} supportedFormats
 */

/**
 * Recording state
 * @typedef {'idle' | 'initializing' | 'recording' | 'paused' | 'stopping' | 'completed' | 'error'} RecordingState
 */

/**
 * Audio recording data
 * @typedef {Object} AudioRecording
 * @property {Blob} blob
 * @property {number} duration - seconds
 * @property {number} size - bytes
 * @property {string} mimeType
 * @property {Float32Array} [waveformData]
 * @property {string} [url] - Object URL for preview
 */

/**
 * Recording session info
 * @typedef {Object} RecordingSession
 * @property {string} id
 * @property {Date} startTime
 * @property {Date} [endTime]
 * @property {number} duration
 * @property {RecordingState} state
 * @property {AudioRecording} [audioData]
 * @property {string} [error]
 */

/**
 * Audio processing options
 * @typedef {Object} AudioProcessingOptions
 * @property {boolean} normalize
 * @property {boolean} removeNoise
 * @property {number} compressLevel - 0-100
 */

/**
 * Waveform data for visualization
 * @typedef {Object} WaveformData
 * @property {number[]} peaks
 * @property {number} duration
 * @property {number} sampleRate
 * @property {number} channels
 */

/**
 * Audio player state
 * @typedef {'loading' | 'ready' | 'playing' | 'paused' | 'ended' | 'error'} AudioPlayerState
 */

/**
 * Audio player info
 * @typedef {Object} AudioPlayerInfo
 * @property {string} url
 * @property {number} duration
 * @property {number} currentTime
 * @property {AudioPlayerState} state
 * @property {number} volume - 0-1
 * @property {boolean} muted
 */

/**
 * Audio quality assessment
 * @typedef {'high' | 'medium' | 'low'} AudioQuality
 */

/**
 * Audio analysis result
 * @typedef {Object} AudioAnalysis
 * @property {number} duration
 * @property {number} fileSize
 * @property {string} format
 * @property {AudioQuality} quality
 * @property {WaveformData} waveform
 * @property {Object} volume
 * @property {number} volume.peak
 * @property {number} volume.rms
 * @property {number} volume.average
 */

/**
 * Audio error types
 * @typedef {'permission_denied' | 'device_not_found' | 'not_supported' | 'file_too_large' | 'invalid_format' | 'processing_failed' | 'network_error' | 'unknown_error'} AudioErrorType
 */

/**
 * Audio error info
 * @typedef {Object} AudioError
 * @property {AudioErrorType} type
 * @property {string} message
 * @property {any} [details]
 * @property {Date} timestamp
 */

/**
 * Media recorder options extension
 * @typedef {Object} ExtendedMediaRecorderOptions
 * @property {string} [mimeType]
 * @property {number} [audioBitsPerSecond]
 * @property {number} [videoBitsPerSecond]
 * @property {number} [bitsPerSecond]
 * @property {number} [timeslice]
 * @property {function(Blob): void} [onDataAvailable]
 * @property {function(AudioError): void} [onError]
 */

/**
 * Browser compatibility info
 * @typedef {Object} AudioCompatibility
 * @property {boolean} mediaRecorder
 * @property {boolean} webAudioAPI
 * @property {boolean} getUserMedia
 * @property {string[]} supportedMimeTypes
 * @property {string} recommendedMimeType
 */

/**
 * Audio file metadata
 * @typedef {Object} AudioFileMetadata
 * @property {string} fileName
 * @property {string} mimeType
 * @property {number} size
 * @property {number} duration
 * @property {Date} createdAt
 * @property {Date} lastModified
 * @property {string} [checksum]
 */

// Exportは何もしないが、JSDoc定義を読み込むために空のオブジェクトをexport
export {};