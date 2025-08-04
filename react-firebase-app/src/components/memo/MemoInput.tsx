import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Button,
  Paper,
  Typography,
  Fade,
  CircularProgress,
  Alert,
  Tooltip,
  LinearProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Send,
  Mic,
  MicOff,
  Clear,
  TextFields
} from '@mui/icons-material';
import { useMemos } from '@/contexts/MemoContext';
import { type CreateMemoData } from '@/types/memo';
import { memoAudioService, type AudioProcessingProgress } from '@/services/audio/memoAudioService';
import { useTrophyNotification } from '@/components/feedback/TrophyNotification';
import { authService } from '@/services/firebase/auth';

/**
 * メモ入力コンポーネント
 * 
 * 設計原則:
 * - LINE風のチャット入力インターフェース
 * - テキスト・音声・混合メモ対応
 * - リアルタイムバリデーション
 * - アクセシビリティ対応
 */

interface MemoInputProps {
  /** 入力モード */
  mode?: 'text' | 'audio' | 'mixed';
  /** プレースホルダーテキスト */
  placeholder?: string;
  /** 最大文字数 */
  maxLength?: number;
  /** 送信成功時のコールバック */
  onSubmitSuccess?: (memoId: string) => void;
  /** 送信エラー時のコールバック */
  onSubmitError?: (error: Error) => void;
  /** モード変更時のコールバック */
  onModeChange?: (mode: 'text' | 'audio' | 'mixed') => void;
}

export const MemoInput: React.FC<MemoInputProps> = ({
  mode = 'text',
  placeholder = 'メモを入力してください...',
  maxLength = 1000,
  onSubmitSuccess,
  onSubmitError,
  onModeChange
}) => {
  const { createMemo } = useMemos();
  const { showSuccessNotification } = useTrophyNotification();
  
  // フォーム状態
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState(mode);
  const [processingProgress, setProcessingProgress] = useState<AudioProcessingProgress | null>(null);
  
  // 音声録音状態
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // Refs
  const textFieldRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // フォーカス制御
  useEffect(() => {
    if (currentMode === 'text' && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [currentMode]);

  // 録音時間更新
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, [isRecording]);

  // 時間フォーマット
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // テキスト変更処理
  const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length <= maxLength) {
      setText(value);
      setError(null);
    }
  }, [maxLength]);

  // モード変更処理
  const handleModeChange = useCallback((newMode: 'text' | 'audio' | 'mixed') => {
    setCurrentMode(newMode);
    setError(null);
    onModeChange?.(newMode);
  }, [onModeChange]);

  // 音声録音開始
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        
        // ストリームを停止
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setError(null);
      
    } catch (error) {

      setError('マイクへのアクセスが許可されていません');
    }
  }, []);

  // 音声録音停止
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // 録音時間は保持する（リセットしない）
    }
  }, [isRecording]);

  // 音声削除
  const clearAudio = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setRecordingTime(0); // 削除時のみリセット
  }, [audioUrl]);

  // バリデーション
  const validateInput = useCallback((): string | null => {
    if (currentMode === 'text' && !text.trim()) {
      return 'テキストを入力してください';
    }
    
    if (currentMode === 'audio' && !audioBlob) {
      return '音声を録音してください';
    }
    
    if (currentMode === 'mixed' && !text.trim() && !audioBlob) {
      return 'テキストまたは音声を入力してください';
    }
    
    return null;
  }, [currentMode, text, audioBlob]);

  // メモ送信処理
  const handleSubmit = useCallback(async () => {
    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setProcessingProgress(null);

    try {
      // メモデータ作成
      const userId = authService.getCurrentUserId();
      if (!userId) {
        throw new Error('ユーザーが認証されていません');
      }
      
      const memoData: CreateMemoData = {
        userId,
        type: currentMode,
        title: text.slice(0, 50) || '新しいメモ', // 最初の50文字をタイトルに
        ...(currentMode === 'text' || currentMode === 'mixed' ? { textContent: text } : {}),
        ...(audioBlob && { 
          audioBlob,
          duration: recordingTime > 0 ? recordingTime : 0 // 録音時間をdurationとして追加（0以下の場合は0）
        }) // 音声データがある場合は追加
      };

      let memoId: string;

      // 音声がある場合は専用サービスを使用
      if (currentMode === 'audio' || (currentMode === 'mixed' && audioBlob)) {
        memoId = await memoAudioService.createAudioMemo(
          memoData,
          (progress) => {
            setProcessingProgress(progress);
          }
        );
      } else {
        // テキストのみの場合は通常のcreateMemoを使用
        memoId = await createMemo(memoData);
      }
      
      // 成功通知
      showSuccessNotification(
        'メモが作成されました！',
        currentMode === 'audio' ? '音声の文字起こしも完了しました' : 'テキストメモが保存されました'
      );
      
      // フォームリセット
      setText('');
      clearAudio();
      setProcessingProgress(null);
      
      onSubmitSuccess?.(memoId);
      
    } catch (error) {
      console.error('メモ送信エラーの詳細:', error);
      console.error('エラーオブジェクト:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        raw: error
      });
      const errorMessage = error instanceof Error ? error.message : 'メモの送信に失敗しました';
      setError(errorMessage);
      setProcessingProgress(null);
      onSubmitError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setIsSubmitting(false);
    }
  }, [validateInput, currentMode, text, audioBlob, createMemo, memoAudioService, showSuccessNotification, clearAudio, onSubmitSuccess, onSubmitError]);

  // Enterキーでの送信
  const handleKeyPress = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey && !isSubmitting) {
      event.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit, isSubmitting]);

  // 送信可能かどうか
  const canSubmit = !isSubmitting && (
    (currentMode === 'text' && text.trim()) ||
    (currentMode === 'audio' && audioBlob) ||
    (currentMode === 'mixed' && (text.trim() || audioBlob))
  );

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider'
      }}
    >
      <Box sx={{ p: 2 }}>
        {/* モード選択 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, justifyContent: 'center' }}>
          <Tooltip title="テキストメモ">
            <IconButton
              onClick={() => handleModeChange('text')}
              color={currentMode === 'text' ? 'primary' : 'default'}
              size="small"
              disabled={isSubmitting || isRecording}
            >
              <TextFields />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="音声メモ">
            <IconButton
              onClick={() => handleModeChange('audio')}
              color={currentMode === 'audio' ? 'primary' : 'default'}
              size="small"
              disabled={isSubmitting}
            >
              <Mic />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="テキスト＋音声メモ">
            <IconButton
              onClick={() => handleModeChange('mixed')}
              color={currentMode === 'mixed' ? 'primary' : 'default'}
              size="small"
              disabled={isSubmitting || isRecording}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TextFields fontSize="small" />
                <Mic fontSize="small" />
              </Box>
            </IconButton>
          </Tooltip>
        </Box>

        {/* エラー表示 */}
        {error && (
          <Fade in={true}>
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </Fade>
        )}

        {/* 処理進捗表示 */}
        {processingProgress && (
          <Fade in={true}>
            <Box sx={{ mb: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {processingProgress.message}
              </Typography>
              
              <LinearProgress 
                variant="determinate" 
                value={processingProgress.progress} 
                sx={{ mb: 1 }}
              />
              
              <Stepper activeStep={
                processingProgress.stage === 'uploading' ? 0 :
                processingProgress.stage === 'transcribing' ? 1 :
                processingProgress.stage === 'saving' ? 2 :
                processingProgress.stage === 'complete' ? 3 : 0
              } alternativeLabel>
                <Step>
                  <StepLabel>アップロード</StepLabel>
                </Step>
                <Step>
                  <StepLabel>文字起こし</StepLabel>
                </Step>
                <Step>
                  <StepLabel>保存</StepLabel>
                </Step>
                <Step>
                  <StepLabel>完了</StepLabel>
                </Step>
              </Stepper>
              
              {processingProgress.transcriptionResult && (
                <Box sx={{ mt: 2, p: 1, bgcolor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="caption" color="success.contrastText">
                    文字起こし結果プレビュー:
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {processingProgress.transcriptionResult.text.slice(0, 100)}
                    {processingProgress.transcriptionResult.text.length > 100 && '...'}
                  </Typography>
                </Box>
              )}
            </Box>
          </Fade>
        )}

        {/* テキスト入力 */}
        {(currentMode === 'text' || currentMode === 'mixed') && (
          <TextField
            ref={textFieldRef}
            fullWidth
            multiline
            minRows={2}
            maxRows={4}
            value={text}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={isSubmitting || isRecording}
            helperText={`${text.length}/${maxLength}文字`}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: text && (
                <IconButton
                  size="small"
                  onClick={() => setText('')}
                  disabled={isSubmitting || isRecording}
                >
                  <Clear />
                </IconButton>
              )
            }}
          />
        )}

        {/* 音声録音・再生 */}
        {(currentMode === 'audio' || currentMode === 'mixed') && (
          <Box sx={{ mb: 2 }}>
            {/* 録音コントロール */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              {!isRecording ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Mic />}
                  onClick={startRecording}
                  disabled={isSubmitting}
                  size="large"
                >
                  録音開始
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<MicOff />}
                  onClick={stopRecording}
                  size="large"
                >
                  録音停止 ({formatTime(recordingTime)})
                </Button>
              )}

              {audioUrl && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <audio controls src={audioUrl} style={{ height: '40px' }} />
                  <IconButton
                    size="small"
                    onClick={clearAudio}
                    disabled={isSubmitting || isRecording}
                    color="error"
                  >
                    <Clear />
                  </IconButton>
                </Box>
              )}
            </Box>

            {/* 録音中インジケータ */}
            {isRecording && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: 'error.main',
                    animation: 'pulse 1s infinite'
                  }}
                />
                <Typography variant="caption">
                  録音中... {formatTime(recordingTime)}
                </Typography>
              </Box>
            )}
          </Box>
        )}

        {/* 送信ボタン */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            endIcon={isSubmitting ? <CircularProgress size={16} /> : <Send />}
            onClick={handleSubmit}
            disabled={!canSubmit}
            size="large"
          >
            {isSubmitting ? '送信中...' : '送信'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MemoInput;