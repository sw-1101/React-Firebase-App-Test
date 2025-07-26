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
  Link,
  CircularProgress,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
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

interface ValidationErrors {
  email?: string
  password?: string
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { dispatch } = useAuth()
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'メールアドレスを入力してください'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return '正しいメールアドレスを入力してください'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'パスワードを入力してください'
    if (password.length < 6) return 'パスワードは6文字以上で入力してください'
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name as keyof ValidationErrors]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: undefined
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let error: string | undefined

    if (name === 'email') {
      error = validateEmail(value)
    } else if (name === 'password') {
      error = validatePassword(value)
    }

    if (error) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: error
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all fields
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    
    const errors: ValidationErrors = {}
    if (emailError) errors.email = emailError
    if (passwordError) errors.password = passwordError
    
    setValidationErrors(errors)
    
    // Don't submit if there are validation errors
    if (Object.keys(errors).length > 0) {
      return
    }

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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          ログイン
        </Typography>
        
        {error && (
          <Alert severity="error" role="alert" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="メールアドレス"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={!!validationErrors.email}
            helperText={validationErrors.email}
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
            onBlur={handleBlur}
            error={!!validationErrors.password}
            helperText={validationErrors.password}
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
            {loading && <CircularProgress size={20} sx={{ mr: 1 }} role="progressbar" />}
            {loading ? 'ログイン中...' : 'ログイン'}
          </Button>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link component={RouterLink} to="/register" variant="body2">
              新規登録はこちら
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default LoginForm