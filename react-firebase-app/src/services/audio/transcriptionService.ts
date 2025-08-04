import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { type AudioFormat } from '../../types/memo';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * 音声ファイル文字起こしサービス
 * 
 * 設計原則:
 * - Whisper API統合
 * - Firebase Storage連携
 * - プログレス監視
 * - エラーハンドリング
 * - 複数フォーマット対応
 */

// 文字起こし結果インターフェース
export interface TranscriptionResult {
  text: string;
  language?: string;
  confidence?: number;
  segments?: TranscriptionSegment[];
  duration?: number;
}

// 文字起こしセグメント
export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  confidence?: number;
}

// アップロード進捗情報
export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number; // 0-100
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
}

// 文字起こし設定
export interface TranscriptionOptions {
  language?: string; // 'ja', 'en', 'auto' など
  model?: string; // Gemini モデル名（将来の拡張用）
  temperature?: number; // 0-1
  prompt?: string;
  response_format?: 'json' | 'text'; // Gemini用に簡略化
}

class TranscriptionService {
  private readonly MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB (Whisper API制限)
  private readonly SUPPORTED_FORMATS: AudioFormat[] = [
    'mp3', 'mp4', 'mpeg', 'mpga', 'm4a', 'wav', 'webm'
  ];

  /**
   * 音声ファイルをFirebase Storageにアップロード
   */
  async uploadAudioFile(
    audioBlob: Blob,
    userId: string,
    fileName: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      // ファイルサイズチェック
      if (audioBlob.size > this.MAX_FILE_SIZE) {
        throw new Error(`ファイルサイズが制限を超えています (最大: ${this.MAX_FILE_SIZE / 1024 / 1024}MB)`);
      }

      // ファイル形式チェック
      const format = this.detectAudioFormat(audioBlob);
      if (!this.SUPPORTED_FORMATS.includes(format)) {
        throw new Error(`サポートされていないファイル形式です: ${format}`);
      }

      // Storage参照作成
      const storageRef = ref(storage, `audio/${userId}/${Date.now()}_${fileName}`);

      // シンプルなuploadBytesを使用（CORSエラー回避）
      onProgress?.({
        bytesTransferred: 0,
        totalBytes: audioBlob.size,
        progress: 0,
        state: 'running'
      });

      // メタデータ設定
      const metadata = {
        contentType: audioBlob.type || 'audio/webm',
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          userId: userId
        }
      };

      // uploadBytesを使用（より信頼性が高い）
      const snapshot = await uploadBytes(storageRef, audioBlob, metadata);
      
      onProgress?.({
        bytesTransferred: audioBlob.size,
        totalBytes: audioBlob.size,
        progress: 100,
        state: 'success'
      });

      // ダウンロードURL取得
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
      
    } catch (error) {
      console.error('Upload error details:', error);
      
      // より詳細なエラーメッセージ
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          throw new Error('CORSエラー: Firebase Storageの設定を確認してください');
        }
        if (error.message.includes('Unauthorized')) {
          throw new Error('認証エラー: ログイン状態を確認してください');
        }
        if (error.message.includes('Quota')) {
          throw new Error('容量制限: Firebase Storageの容量を確認してください');
        }
        throw error;
      }
      
      throw new Error('アップロードに失敗しました');
    }
  }

  /**
   * 音声ファイルの文字起こし（Gemini API）
   */
  async transcribeAudio(
    audioUrl: string,
    options: TranscriptionOptions = {}
  ): Promise<TranscriptionResult> {
    try {
      let audioBlob: Blob;
      
      // Base64データの場合は直接使用
      if (audioUrl.startsWith('data:audio')) {
        // Base64からBlobに変換
        const response = await fetch(audioUrl);
        audioBlob = await response.blob();
      } else {
        // 通常のURLの場合
        const response = await fetch(audioUrl);
        if (!response.ok) {
          throw new Error('音声ファイルの取得に失敗しました');
        }
        audioBlob = await response.blob();
      }

      // Gemini API初期化
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

      // 音声をBase64に変換
      const audioBase64 = await this.blobToBase64(audioBlob);

      // プロンプト作成
      const language = options.language === 'ja' ? '日本語' : options.language || '自動検出';
      const prompt = `
        この音声ファイルを文字起こししてください。
        言語: ${language}
        ${options.prompt ? `追加指示: ${options.prompt}` : ''}
        
        以下の形式で出力してください：
        - 文字起こし結果のみを出力
        - 句読点を適切に追加
        - 改行は段落の切れ目のみ
      `;

      // Gemini APIに送信
      const result = await model.generateContent([
        { text: prompt },
        {
          inlineData: {
            mimeType: audioBlob.type || 'audio/webm',
            data: audioBase64
          }
        }
      ]);

      const transcription = result.response.text();

      // 結果を返す
      return {
        text: transcription,
        language: options.language || 'ja',
        confidence: 0.95 // Gemini APIは信頼度を返さないため、高い値を設定
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * BlobをBase64に変換（内部ヘルパー）
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // data:mime;base64, の部分を除去
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * バックアップ文字起こし（Web Speech API）
   */
  async transcribeAudioWebSpeech(
    audioBlob: Blob,
    language: string = 'ja-JP'
  ): Promise<TranscriptionResult> {
    return new Promise((resolve, reject) => {
      // Web Speech API が利用可能かチェック
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        reject(new Error('このブラウザは音声認識をサポートしていません'));
        return;
      }

      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = language;
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        let fullTranscript = '';
        let hasResults = false;

        recognition.onresult = (event: any) => {
          hasResults = true;
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              fullTranscript += event.results[i][0].transcript + ' ';
            }
          }
        };

        recognition.onerror = (event: any) => {
          reject(new Error(`音声認識エラー: ${event.error}`));
        };

        recognition.onend = () => {
          if (hasResults) {
            resolve({
              text: fullTranscript.trim(),
              language,
              confidence: 0.8 // Web Speech APIでは正確な信頼度を取得できないため概算値
            });
          } else {
            reject(new Error('音声を認識できませんでした'));
          }
        };

        // 音声ファイルから直接認識はできないため、
        // 一時的にオーディオ要素を作成して再生しながら認識
        const audio = new Audio(URL.createObjectURL(audioBlob));
        audio.oncanplaythrough = () => {
          recognition.start();
          audio.play();
        };

        audio.onended = () => {
          setTimeout(() => {
            recognition.stop();
          }, 1000); // 少し待ってから停止
        };

        audio.onerror = () => {
          reject(new Error('音声ファイルの再生に失敗しました'));
        };

      } catch (error) {
        reject(new Error(`Web Speech API初期化エラー: ${error}`));
      }
    });
  }

  /**
   * 音声ファイル削除
   */
  async deleteAudioFile(audioUrl: string): Promise<void> {
    try {
      const audioRef = ref(storage, audioUrl);
      await deleteObject(audioRef);
    } catch (error) {
      throw new Error('音声ファイルの削除に失敗しました');
    }
  }

  /**
   * 音声形式検出
   */
  private detectAudioFormat(audioBlob: Blob): AudioFormat {
    const mimeType = audioBlob.type.toLowerCase();
    
    if (mimeType.includes('webm')) return 'webm';
    if (mimeType.includes('mp3')) return 'mp3';
    if (mimeType.includes('mp4')) return 'mp4';
    if (mimeType.includes('wav')) return 'wav';
    if (mimeType.includes('m4a')) return 'm4a';
    if (mimeType.includes('mpeg')) return 'mpeg';
    if (mimeType.includes('mpga')) return 'mpga';
    
    // デフォルトはwebm（MediaRecorderの標準出力）
    return 'webm';
  }

  /**
   * ファイルサイズを人間が読める形式に変換
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * 音声継続時間を推定
   */
  async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // loadedmetadataイベントで duration を取得
      const handleLoadedMetadata = () => {
        const duration = audio.duration;
        URL.revokeObjectURL(audioUrl);
        
        // NaNチェック
        if (isNaN(duration) || !isFinite(duration)) {
          console.warn('Duration is NaN, returning 0');
          resolve(0);
        } else {
          console.log('Audio duration:', duration);
          resolve(duration);
        }
      };
      
      // エラーハンドリング
      const handleError = (error: any) => {
        URL.revokeObjectURL(audioUrl);
        console.error('Audio duration error:', error);
        resolve(0); // エラー時は0を返す
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);
      
      // 一部のブラウザではloadが必要
      audio.load();
    });
  }
}

// シングルトンインスタンス
export const transcriptionService = new TranscriptionService();
export default transcriptionService;