// ユーザー登録フォームコンポーネント
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
import { registerUser } from '../../utils/auth'
import { useAuth } from '../../contexts/AuthContext'
import type { RegisterCredentials } from '../../types/auth'

// Vue.js経験者向け解説:
// - バリデーション処理もVueのリアクティブ機能と同様にuseStateで管理
// - 条件付きレンダリングはVueのv-ifの代わりに{condition && <Component />}

interface RegisterFormProps {
  onSuccess?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { dispatch } = useAuth()
  const [formData, setFormData] = useState<RegisterCredentials>({
    email: '',
    password: '',
    displayName: '',
  })
  const [confirmPassword, setConfirmPassword] = useState('')
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

    // パスワード確認
    if (formData.password !== confirmPassword) {
      setError('パスワードが一致しません')
      setLoading(false)
      return
    }

    // パスワード強度チェック
    if (formData.password.length < 6) {
      setError('パスワードは6文字以上で入力してください')
      setLoading(false)
      return
    }

    try {
      const user = await registerUser(formData)
      dispatch({ type: 'AUTH_SUCCESS', payload: user })
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'アカウント作成に失敗しました')
      dispatch({ type: 'AUTH_ERROR', payload: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          アカウント作成
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="表示名"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            margin="normal"
            autoComplete="name"
          />
          
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
            autoComplete="new-password"
            helperText="6文字以上で入力してください"
          />
          
          <TextField
            fullWidth
            label="パスワード確認"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            margin="normal"
            autoComplete="new-password"
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'アカウント作成中...' : 'アカウント作成'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default RegisterForm