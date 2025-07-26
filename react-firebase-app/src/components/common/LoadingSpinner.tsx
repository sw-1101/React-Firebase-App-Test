// ローディング表示コンポーネント
import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

// Vue.js経験者向け解説:
// - propsの受け取り方がVueとは異なる（分割代入で受け取る）
// - コンポーネントの型定義はReact.FCまたは関数として定義

interface LoadingSpinnerProps {
  message?: string
  size?: number
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="200px"
      gap={2}
    >
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  )
}

export default LoadingSpinner