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

  // セキュリティ強化: 包括的なパスワード強度チェック
  const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
    if (!password) {
      return { isValid: false, message: 'パスワードを入力してください' }
    }
    
    // 最小長チェック（8文字以上）
    if (password.length < 8) {
      return { isValid: false, message: 'パスワードは8文字以上で入力してください' }
    }
    
    // 最大長チェック（128文字以下）
    if (password.length > 128) {
      return { isValid: false, message: 'パスワードは128文字以下で入力してください' }
    }
    
    // 文字種チェック
    const hasLowercase = /[a-z]/.test(password)
    const hasUppercase = /[A-Z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    
    const typesUsed = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length
    
    if (typesUsed < 3) {
      return { 
        isValid: false, 
        message: 'パスワードには以下のうち3種類以上を含めてください: 小文字、大文字、数字、記号' 
      }
    }
    
    // よくあるパスワードパターンのチェック
    const commonPatterns = [
      /^(.)\1+$/, // 同じ文字の繰り返し（例: aaaaaaa）
      /^(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/, // 連続する数字
      /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/, // 連続するアルファベット
      /(password|pass|123456|qwerty|admin|test|user)/i // よくあるパスワード
    ]
    
    for (const pattern of commonPatterns) {
      if (pattern.test(password)) {
        return { isValid: false, message: '推測しやすいパスワードは使用できません' }
      }
    }
    
    return { isValid: true }
  }
  const validatePassword = (password: string): string | undefined => {
    const result = validatePasswordStrength(password)
    return result.isValid ? undefined : result.message
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