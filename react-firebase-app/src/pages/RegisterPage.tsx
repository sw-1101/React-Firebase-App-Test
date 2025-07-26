// ユーザー登録ページコンポーネント
import React, { useEffect } from 'react'
import { Container, Box, Typography, Link } from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { RegisterForm } from '../components/auth'
import { useAuth } from '../contexts/AuthContext'

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useAuth()

  // 認証済みユーザーは自動的にダッシュボードへリダイレクト
  useEffect(() => {
    if (state.user && !state.loading) {
      navigate('/dashboard')
    }
  }, [state.user, state.loading, navigate])

  const handleRegisterSuccess = () => {
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
        <RegisterForm onSuccess={handleRegisterSuccess} />
        
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            すでにアカウントをお持ちの方は{' '}
            <Link component={RouterLink} to="/login">
              こちらからログイン
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default RegisterPage