// ログインページコンポーネント
import React from 'react'
import { Container, Box, Typography, Link } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

// Vue.js経験者向け解説:
// - useNavigate: Vue RouterのuseRouter().push()と同様の機能
// - useEffect: Vue 3のwatchEffect()と同様のライフサイクル管理
// - 認証済みユーザーのリダイレクト処理

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useAuth()

  // 認証済みユーザーは自動的にダッシュボードへリダイレクト
  useEffect(() => {
    if (state.user && !state.loading) {
      navigate('/dashboard')
    }
  }, [state.user, state.loading, navigate])

  const handleLoginSuccess = () => {
    navigate('/dashboard')
  }

  if (state.loading) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Typography>読み込み中...</Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <LoginForm onSuccess={handleLoginSuccess} />
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            アカウントをお持ちでない方は{' '}
            <Link component={RouterLink} to="/register">
              こちらから登録
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginPage