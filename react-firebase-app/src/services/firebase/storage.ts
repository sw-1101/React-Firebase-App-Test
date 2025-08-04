import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  getMetadata
} from 'firebase/storage';
import { storage } from '../../config/firebase';

/**
 * Firebase Storage サービス
 * 
 * 設計原則:
 * - 音声ファイルの安全なアップロード
 * - プログレス監視対応
 * - ファイル管理（削除、メタデータ取得）
 * - エラーハンドリングは呼び出し元で実施
 */
export class StorageService {
  private readonly AUDIO_FOLDER = 'audio';
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  /**
   * 音声ファイルをアップロード（シンプル版）
   */
  async uploadAudioFile(
    userId: string, 
    audioBlob: Blob, 
    fileName?: string
  ): Promise<{ url: string; fileName: string; size: number }> {
    try {
      // ファイル名の生成
      const timestamp = Date.now();
      const finalFileName = fileName || `audio_${timestamp}.webm`;
      const filePath = `${this.AUDIO_FOLDER}/${userId}/${finalFileName}`;
      
      // ファイルサイズチェック
      if (audioBlob.size > this.MAX_FILE_SIZE) {
        throw new Error(`File size ${audioBlob.size} exceeds maximum ${this.MAX_FILE_SIZE} bytes`);
      }

      // Storage参照を作成
      const storageRef = ref(storage, filePath);

      // アップロード実行
      const uploadResult = await uploadBytes(storageRef, audioBlob);
      
      // ダウンロードURLを取得
      const downloadURL = await getDownloadURL(uploadResult.ref);

      return {
        url: downloadURL,
        fileName: finalFileName,
        size: audioBlob.size
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 音声ファイルをアップロード（プログレス監視版）
   */
  uploadAudioFileWithProgress(
    userId: string,
    audioBlob: Blob,
    fileName?: string,
    onProgress?: (progress: number) => void
  ): Promise<{ url: string; fileName: string; size: number }> {
    return new Promise((resolve, reject) => {
      try {
        // ファイル名の生成
        const timestamp = Date.now();
        const finalFileName = fileName || `audio_${timestamp}.webm`;
        const filePath = `${this.AUDIO_FOLDER}/${userId}/${finalFileName}`;
        
        // ファイルサイズチェック
        if (audioBlob.size > this.MAX_FILE_SIZE) {
          reject(new Error(`File size ${audioBlob.size} exceeds maximum ${this.MAX_FILE_SIZE} bytes`));
          return;
        }

        // Storage参照を作成
        const storageRef = ref(storage, filePath);

        // 再開可能アップロード
        const uploadTask = uploadBytesResumable(storageRef, audioBlob);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // プログレス計算
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              // アップロード完了時の処理
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({
                url: downloadURL,
                fileName: finalFileName,
                size: audioBlob.size
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * ファイルを削除
   */
  async deleteAudioFile(userId: string, fileName: string): Promise<void> {
    try {
      const filePath = `${this.AUDIO_FOLDER}/${userId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      await deleteObject(storageRef);
    } catch (error) {
      throw error;
    }
  }

  /**
   * ファイルのメタデータを取得
   */
  async getAudioFileMetadata(userId: string, fileName: string): Promise<{
    name: string;
    size: number;
    contentType: string;
    timeCreated: string;
    updated: string;
  }> {
    try {
      const filePath = `${this.AUDIO_FOLDER}/${userId}/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      const metadata = await getMetadata(storageRef);
      
      return {
        name: metadata.name,
        size: metadata.size,
        contentType: metadata.contentType || 'audio/webm',
        timeCreated: metadata.timeCreated,
        updated: metadata.updated
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * アップロード用のファイル名を生成
   */
  generateAudioFileName(prefix: string = 'audio'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${random}.webm`;
  }

  /**
   * ファイルサイズのバリデーション
   */
  validateFileSize(file: Blob): boolean {
    return file.size <= this.MAX_FILE_SIZE;
  }

  /**
   * サポートされているファイル形式かチェック
   */
  validateFileType(file: Blob): boolean {
    const supportedTypes = [
      'audio/webm',
      'audio/mp4',
      'audio/wav',
      'audio/ogg'
    ];
    
    return supportedTypes.includes(file.type);
  }

  /**
   * アップロード前の総合バリデーション
   */
  validateAudioFile(file: Blob): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!this.validateFileSize(file)) {
      errors.push(`File size ${file.size} exceeds maximum ${this.MAX_FILE_SIZE} bytes`);
    }
    
    if (!this.validateFileType(file)) {
      errors.push(`File type ${file.type} is not supported`);
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * ユーザーの使用容量を取得（概算）
   * 注意: Storageには直接的な容量取得APIがないため、Firestoreと組み合わせて管理
   */
  async getUserStorageUsage(_userId: string): Promise<number> {
    // 実装はFirestoreServiceと連携して、各メモのfileSizeを合計
    // ここでは基本的な実装のみ提供
    // getUserStorageUsage requires integration with FirestoreService
    return 0;
  }
}

// シングルトンインスタンス
export const storageService = new StorageService();