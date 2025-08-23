// ログインページコンポーネント
import React from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { LoginForm } from '../components/auth'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import styles from './LoginPage.module.css'

// カスタムCSS + CSS Modules実装
// - レスポンシブデザイン対応
// - アクセシビリティ対応のフォーカス管理
// - カスタムテーマ変数活用

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { state } = useAuth()

  // 認証済みユーザーは自動的にダッシュボードへリダイレクト
  useEffect(() => {
    if (state.user && !state.loading) {
      navigate('/menu')
    }
  }, [state.user, state.loading, navigate])

  const handleLoginSuccess = () => {
    navigate('/menu')
  }

  if (state.loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingText}>読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm onSuccess={handleLoginSuccess} />
        
        <div className={styles.registerLinkContainer}>
          <div className={styles.registerText}>
            アカウントをお持ちでない方は{' '}
            <RouterLink to="/register" className={styles.registerLink}>
              こちらから登録
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage