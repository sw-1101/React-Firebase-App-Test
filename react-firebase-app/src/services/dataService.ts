// Firestoreデータ操作サービス
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  type DocumentData,
  type QuerySnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import type { DataItem, CreateDataItem, UpdateDataItem } from '../types/data'

// Vue.js経験者向け解説:
// - サービス層: VueでいうAPIクライアントやリポジトリパターンと同様
// - onSnapshot: Vueのリアクティブ機能のようにデータ変更を監視
// - serverTimestamp: サーバー側のタイムスタンプ（データ整合性のため）

const COLLECTION_NAME = 'dataItems'

// Firestoreドキュメントから型付きデータに変換
const convertToDataItem = (doc: DocumentData): DataItem => ({
  id: doc.id,
  ...doc.data(),
  createdAt: doc.data().createdAt?.toDate() || new Date(),
  updatedAt: doc.data().updatedAt?.toDate() || new Date(),
})

// データ一覧を取得（ユーザー固有）
export const getDataItems = async (userId: string): Promise<DataItem[]> => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(convertToDataItem)
  } catch (error) {
    console.error('Error fetching data items:', error)
    throw error
  }
}

// データアイテムを作成
export const createDataItem = async (
  userId: string,
  item: CreateDataItem
): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...item,
      userId,
      completed: item.completed || false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating data item:', error)
    throw error
  }
}

// データアイテムを更新
export const updateDataItem = async (
  itemId: string,
  updates: UpdateDataItem
): Promise<void> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, itemId)
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error updating data item:', error)
    throw error
  }
}

// データアイテムを削除
export const deleteDataItem = async (itemId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, itemId))
  } catch (error) {
    console.error('Error deleting data item:', error)
    throw error
  }
}

// 特定のデータアイテムを取得
export const getDataItem = async (itemId: string): Promise<DataItem | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, itemId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return convertToDataItem(docSnap)
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching data item:', error)
    throw error
  }
}

// リアルタイムでデータ変更を監視
export const subscribeToDataItems = (
  userId: string,
  callback: (items: DataItem[]) => void
): Unsubscribe => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('updatedAt', 'desc')
  )

  return onSnapshot(q, (querySnapshot: QuerySnapshot) => {
    const items = querySnapshot.docs.map(convertToDataItem)
    callback(items)
  }, (error) => {
    console.error('Error in data subscription:', error)
  })
}