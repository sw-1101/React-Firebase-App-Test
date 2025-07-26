// 認証関連のユーティリティ関数
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth'
import { auth } from '../config/firebase'
import type { LoginCredentials, RegisterCredentials, User } from '../types/auth'

// Vue.js経験者向け解説:
// これらの関数はVueでいうcomposablesやutilsと同様の役割
// 再利用可能なロジックをカプセル化

// Firebase Userオブジェクトをアプリ用のUserオブジェクトに変換
export const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  emailVerified: firebaseUser.emailVerified,
})

// ログイン処理
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
    return mapFirebaseUser(userCredential.user)
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

// ユーザー登録処理
export const registerUser = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      credentials.email,
      credentials.password
    )
    
    // 表示名が提供されている場合は更新
    if (credentials.displayName) {
      await updateProfile(userCredential.user, {
        displayName: credentials.displayName
      })
    }
    
    return mapFirebaseUser(userCredential.user)
  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

// ログアウト処理
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Logout error:', error)
    throw error
  }
}