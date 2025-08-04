import React, { useState } from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { PlayArrow, Pause, VolumeUp } from '@mui/icons-material';

interface AudioPlayerProps {
  audioData?: string; // Base64音声データ
  transcript?: string; // 文字起こしテキスト
  label?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ 
  audioData, 
  transcript, 
  label = "音声" 
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (!audioData) return;

    try {
      if (audio && !audio.paused) {
        // 再生中 → 停止
        audio.pause();
        setIsPlaying(false);
      } else {
        // 停止中 → 再生
        if (audio) {
          audio.play();
          setIsPlaying(true);
        } else {
          // 新しいAudioオブジェクトを作成
          const audioBlob = new Blob(
            [Uint8Array.from(atob(audioData), c => c.charCodeAt(0))],
            { type: 'audio/wav' }
          );
          const audioUrl = URL.createObjectURL(audioBlob);
          const newAudio = new Audio(audioUrl);
          
          newAudio.onended = () => {
            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
          };
          
          newAudio.onerror = () => {

            setIsPlaying(false);
            URL.revokeObjectURL(audioUrl);
          };
          
          setAudio(newAudio);
          newAudio.play();
          setIsPlaying(true);
        }
      }
    } catch (error) {
    // エラーハンドリング
  }
  };

  if (!audioData && !transcript) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <VolumeUp fontSize="small" color="action" />
        <Typography variant="caption" color="text.secondary">
          {label}:
        </Typography>
        {audioData && (
          <IconButton
            size="small"
            onClick={togglePlayback}
            title={isPlaying ? "再生停止" : "音声を再生"}
          >
            {isPlaying ? <Pause fontSize="small" /> : <PlayArrow fontSize="small" />}
          </IconButton>
        )}
      </Box>
      
      {transcript && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontStyle: 'italic', 
            backgroundColor: 'grey.50',
            padding: 1,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'grey.200'
          }}
        >
          "{transcript}"
        </Typography>
      )}
    </Box>
  );
};

export default AudioPlayer;