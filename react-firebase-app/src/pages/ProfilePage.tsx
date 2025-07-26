// プロフィールページコンポーネント
import React, { useState } from 'react'
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Avatar,
} from '@mui/material'
import { ArrowBack, Save, AccountCircle } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { updateProfile } from 'firebase/auth'
import { auth } from '../config/firebase'

// Vue.js経験者向け解説:
// - プロフィール更新機能の実装
// - Firebase Authentication APIの直接利用例

const ProfilePage: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState(state.user?.displayName || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) return

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await updateProfile(auth.currentUser, {
        displayName: displayName || null,
      })
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'プロフィールの更新に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            プロフィール設定
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar
                sx={{ 
                  width: 80, 
                  height: 80, 
                  mb: 2,
                  bgcolor: 'primary.main'
                }}
                src={state.user?.photoURL || ''}
              >
                {state.user?.displayName ? (
                  state.user.displayName.charAt(0).toUpperCase()
                ) : (
                  <AccountCircle sx={{ fontSize: 48 }} />
                )}
              </Avatar>
              <Typography variant="h5" gutterBottom>
                ユーザープロフィール
              </Typography>
            </Box>

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                プロフィールが正常に更新されました
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="メールアドレス"
                value={state.user?.email || ''}
                margin="normal"
                disabled
                helperText="メールアドレスは変更できません"
              />

              <TextField
                fullWidth
                label="表示名"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                margin="normal"
                helperText="他のユーザーに表示される名前です"
              />

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={loading}
                  sx={{ flexGrow: 1 }}
                >
                  {loading ? '更新中...' : '保存'}
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  キャンセル
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="h6" gutterBottom>
                アカウント情報
              </Typography>
              <Typography variant="body2" color="text.secondary">
                UID: {state.user?.uid}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                メール認証: {state.user?.emailVerified ? '済み' : '未認証'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default ProfilePage