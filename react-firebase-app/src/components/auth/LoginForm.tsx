// ログインフォームコンポーネント
import React, { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material'
import { loginUser } from '../../utils/auth'
import { useAuth } from '../../contexts/AuthContext'
import type { LoginCredentials } from '../../types/auth'

// Vue.js経験者向け解説:
// - useState: Vue 3のref()やreactive()と同様のリアクティブ状態
// - onSubmit: Vue.jsの@submitと同様のイベントハンドリング
// - フォームバリデーションはVueでいうvee-validateのような実装

interface LoginFormProps {
  onSuccess?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { dispatch } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await loginUser(formData)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました')
      dispatch({ type: 'AUTH_ERROR', payload: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          ログイン
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="メールアドレス"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            margin="normal"
            autoComplete="email"
          />
          
          <TextField
            fullWidth
            label="パスワード"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            margin="normal"
            autoComplete="current-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default LoginForm