// 認証関連の型定義

// Vue.js経験者向け解説:
// TypeScriptの型定義はVue 3のComposition APIでの型注釈と同様の役割
// プロパティの型を明確にしてコード補完とエラー検出を改善

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  displayName?: string
}