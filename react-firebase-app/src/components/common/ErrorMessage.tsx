// エラーメッセージ表示コンポーネント
import React from 'react'
import { Alert, AlertTitle, Box } from '@mui/material'

// Vue.js経験者向け解説:
// - MUIのAlertコンポーネントはVuetifyのv-alertと同様の役割
// - オプションプロパティは?マークで表現（VueのOptionalと同じ）

interface ErrorMessageProps {
  title?: string
  message: string
  severity?: 'error' | 'warning' | 'info' | 'success'
  onClose?: () => void
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title,
  message,
  severity = 'error',
  onClose
}) => {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Alert 
        severity={severity}
        onClose={onClose}
        variant="filled"
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Box>
  )
}

export default ErrorMessage