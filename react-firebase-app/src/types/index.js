// アプリケーション全体で使用する共通型定義

// Vue.js経験者向け解説:
// TypeScriptの型定義により、Vueでpropsの型を定義するのと同様に
// コンポーネント間でのデータの型安全性を確保

// 基本的なレスポンス型
export interface ApiResponse<T = any> {
  data: T
  message?: string
  error?: string
}

// ページネーション型
export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// データ一覧で使用する型
export interface ListResponse<T> extends ApiResponse<T[]> {
  pagination?: Pagination
}

// 共通的に使用されるEntity型の基底
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// 各型定義をエクスポート
export * from './auth'
export * from './data'
export * from './content'
export * from './memo'