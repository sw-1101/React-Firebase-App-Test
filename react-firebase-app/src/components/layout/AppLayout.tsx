// アプリケーションの基本レイアウトコンポーネント
import React from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'

// Vue.js経験者向け解説:
// - CssBaseline: VueのNormalize.cssのような役割でCSS初期化
// - ThemeProvider: VueのprovideInjectのようにテーマを下位コンポーネントに提供
// - createTheme: Material Designテーマをカスタマイズ

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  typography: {
    h1: {
      fontSize: '2.5rem',
      '@media (max-width:600px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontSize: '2rem',
      '@media (max-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontSize: '1.5rem',
      '@media (max-width:600px)': {
        fontSize: '1.25rem',
      },
    },
  },
})

interface AppLayoutProps {
  children: React.ReactNode
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'grey.100',
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  )
}

export default AppLayout