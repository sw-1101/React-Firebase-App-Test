// データ関連の型定義

// Vue.js経験者向け解説:
// Firestoreのドキュメント構造に対応する型定義
// VueでAPIレスポンスの型を定義するのと同様

export interface DataItem extends BaseEntity {
  title: string
  description: string
  category: 'work' | 'personal' | 'study' | 'other'
  priority: 'high' | 'medium' | 'low'
  completed: boolean
  userId: string
}

export interface CreateDataItem {
  title: string
  description: string
  category: 'work' | 'personal' | 'study' | 'other'
  priority: 'high' | 'medium' | 'low'
  completed?: boolean
}

export interface UpdateDataItem {
  title?: string
  description?: string
  category?: 'work' | 'personal' | 'study' | 'other'
  priority?: 'high' | 'medium' | 'low'
  completed?: boolean
}