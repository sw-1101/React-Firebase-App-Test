// ダッシュボード（メニュー画面）ページ
import React from 'react'
import {
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material'
import { 
  AccountCircle, 
  List, 
  Logout,
  Person,
  Storage,
  RecordVoiceOver,
  Mic
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useAuthActions } from '../hooks/useAuthActions'

// Vue.js経験者向け解説:
// - Grid: Vuetifyのv-rowとv-colのようなレスポンシブレイアウト
// - Card: マテリアルデザインのカードコンポーネント
// - AppBar: ナビゲーションヘッダー（VuetifyのVAppBarと同様）

const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useAuth()
  const { logout } = useAuthActions()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
    // エラーハンドリング
  }
  }

  const menuItems = [
    {
      title: 'VoiceMemo',
      description: '音声・テキストメモの保存・検索',
      icon: <Mic fontSize="large" />,
      path: '/memos',
      color: 'info' as const,
    },
    {
      title: 'プロフィール',
      description: 'ユーザー情報の表示・編集',
      icon: <Person fontSize="large" />,
      path: '/profile',
      color: 'primary' as const,
    },
    {
      title: 'データ一覧',
      description: 'Firestoreデータの管理',
      icon: <Storage fontSize="large" />,
      path: '/data',
      color: 'secondary' as const,
    },
    {
      title: '音声とアップロードテスト',
      description: 'マルチモーダル入力機能のテスト',
      icon: <RecordVoiceOver fontSize="large" />,
      path: '/content',
      color: 'success' as const,
    },
  ]

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            React Firebase App
          </Typography>
          <IconButton color="inherit" onClick={() => navigate('/profile')}>
            <AccountCircle />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <Logout />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: { xs: 2, md: 4 }, px: { xs: 2, sm: 3 } }}>
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.75rem', sm: '2rem' } }}>
            ダッシュボード
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
            こんにちは、{state.user?.displayName || state.user?.email}さん！
          </Typography>
        </Box>

        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 3,
          }}
        >
          {menuItems.map((item) => (
            <Card 
              key={item.path}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2, color: `${item.color}.main` }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="contained"
                  color={item.color}
                  onClick={() => navigate(item.path)}
                  startIcon={<List />}
                >
                  開く
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      </Container>
    </>
  )
}

export default DashboardPage