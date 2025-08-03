# フロントエンド設計パターン

## 🎨 コンポーネント設計書

### 概要
React/Vue.jsにおいて実用的なコンポーネント設計を採用し、保守性・再利用性・理解しやすさを重視した構成を実現します。

## 📋 基本原則

### 1. 責任分離
- **views**: APIアクセス等を行う画面全体のコンポーネント
- **components/pages**: 画面専用だが再利用可能な部品
- **components/common**: 全画面で使える汎用部品

### 2. データフローの制限
- **APIアクセス**: views層のみ許可
- **データ受け渡し**: Props による一方向データフロー
- **状態管理**: Local（useState）+ Global（Zustand/Pinia）

## 🗂️ ディレクトリ構成

### React プロジェクト
```
src/
├── views/                     # 画面全体コンポーネント（APIアクセス可）
│   ├── HomePage.tsx           # ホーム画面
│   ├── LoginPage.tsx          # ログイン画面  
│   ├── ProductListPage.tsx    # 商品一覧画面
│   └── ProductDetailPage.tsx  # 商品詳細画面
├── components/
│   ├── common/                # 汎用コンポーネント
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.tsx
│   │   │   ├── SecondaryButton.tsx
│   │   │   └── index.ts       # エクスポート用
│   │   ├── forms/
│   │   │   ├── TextInput.tsx
│   │   │   ├── SelectBox.tsx
│   │   │   ├── CheckBox.tsx
│   │   │   └── index.ts
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── index.ts
│   │   ├── cards/
│   │   │   ├── UserCard.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   └── index.ts
│   │   ├── modals/
│   │   │   ├── ConfirmModal.tsx
│   │   │   ├── AlertModal.tsx
│   │   │   └── index.ts
│   │   └── feedback/
│   │       ├── ErrorMessage.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── SuccessToast.tsx
│   │       └── index.ts
│   └── pages/                 # 画面専用コンポーネント
│       ├── home/
│       │   ├── WelcomeSection.tsx
│       │   ├── NewsSection.tsx
│       │   └── index.ts
│       ├── auth/
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── PasswordResetForm.tsx
│       │   └── index.ts
│       └── products/
│           ├── ProductSearchForm.tsx
│           ├── ProductFilter.tsx
│           ├── ProductGrid.tsx
│           └── index.ts
├── stores/                    # 状態管理
│   ├── userStore.ts          # Zustand Store
│   ├── themeStore.ts
│   ├── notificationStore.ts
│   └── index.ts
├── types/                     # TypeScript型定義
│   ├── User.ts
│   ├── Product.ts
│   ├── ApiResponse.ts
│   └── index.ts
└── shared/
    ├── constants/
    ├── utils/
    └── types/
```

### Vue.js プロジェクト
```
src/
├── views/                     # 画面全体コンポーネント
│   ├── HomePage.vue
│   ├── LoginPage.vue
│   └── ProductListPage.vue
├── components/
│   ├── common/
│   │   ├── buttons/
│   │   │   ├── PrimaryButton.vue
│   │   │   └── SecondaryButton.vue
│   │   └── forms/
│   │       ├── TextInput.vue
│   │       └── SelectBox.vue
│   └── pages/
│       ├── home/
│       │   └── WelcomeSection.vue
│       └── auth/
│           └── LoginForm.vue
├── stores/                    # Pinia Store
│   ├── user.ts
│   ├── theme.ts
│   └── notification.ts
├── types/
└── shared/
```

## 💼 各層の責務と実装例

### 1. Views Layer
**責務**: APIアクセス、ページ全体の状態管理、コンポーネントの組み合わせ

```tsx
// React views/ProductListPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProductGrid, ProductSearchForm } from '@/components/pages/products';
import { ErrorMessage, LoadingSpinner } from '@/components/common/feedback';
import { useUserStore } from '@/stores/userStore';

interface Product {
  id: number;
  name: string;
  price: number;
}

const ProductListPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user } = useUserStore();

  // APIアクセス（views層のみ許可）
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('/api/products', {
          params: { search: searchQuery }
        });
        
        setProducts(response.data);
      } catch (err) {
        setError('商品の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="product-list-page">
      <h1>商品一覧</h1>
      
      <ProductSearchForm 
        onSearch={handleSearch}
        initialValue={searchQuery}
      />
      
      <ProductGrid 
        products={products}
        currentUserId={user?.id}
      />
    </div>
  );
};

export default ProductListPage;
```

```vue
<!-- Vue views/ProductListPage.vue -->
<template>
  <div class="product-list-page">
    <h1>商品一覧</h1>
    
    <ProductSearchForm 
      @search="handleSearch"
      :initial-value="searchQuery"
    />
    
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" />
    <ProductGrid 
      v-else
      :products="products"
      :current-user-id="userStore.user?.id"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';
import ProductGrid from '@/components/pages/products/ProductGrid.vue';
import ProductSearchForm from '@/components/pages/products/ProductSearchForm.vue';
import { LoadingSpinner, ErrorMessage } from '@/components/common/feedback';

interface Product {
  id: number;
  name: string;
  price: number;
}

const userStore = useUserStore();

const products = ref<Product[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const searchQuery = ref('');

// APIアクセス（views層のみ許可）
const fetchProducts = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const response = await axios.get('/api/products', {
      params: { search: searchQuery.value }
    });
    
    products.value = response.data;
  } catch (err) {
    error.value = '商品の取得に失敗しました';
  } finally {
    loading.value = false;
  }
};

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

watch(searchQuery, fetchProducts);
onMounted(fetchProducts);
</script>
```

### 2. Components/Pages Layer
**責務**: 画面専用の再利用可能なコンポーネント（APIアクセス禁止）

```tsx
// React components/pages/products/ProductGrid.tsx
import React from 'react';
import { ProductCard } from '@/components/common/cards';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductGridProps {
  products: Product[];
  currentUserId?: number;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  currentUserId 
}) => {
  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500">
        商品が見つかりませんでした
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          showEditButton={currentUserId === product.ownerId}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
```

```tsx
// React components/pages/auth/LoginForm.tsx
import React, { useState } from 'react';
import { TextInput, PrimaryButton } from '@/components/common/forms';
import { ErrorMessage } from '@/components/common/feedback';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ 
  onSubmit, 
  loading = false, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="メールアドレス"
        type="email"
        value={email}
        onChange={setEmail}
        required
      />
      
      <TextInput
        label="パスワード"
        type="password"
        value={password}
        onChange={setPassword}
        required
      />
      
      {error && <ErrorMessage message={error} />}
      
      <PrimaryButton
        type="submit"
        loading={loading}
        disabled={!email || !password || loading}
      >
        ログイン
      </PrimaryButton>
    </form>
  );
};

export default LoginForm;
```

### 3. Components/Common Layer
**責務**: 全画面で使用可能な汎用コンポーネント

```tsx
// React components/common/buttons/PrimaryButton.tsx
import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  type = 'button',
  loading = false,
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${className}`}
    >
      {loading ? (
        <span className="flex items-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          処理中...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;
```

```tsx
// React components/common/forms/TextInput.tsx
import React from 'react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-1 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : ''}
        `}
      />
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default TextInput;
```

```tsx
// React components/common/feedback/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  className = '' 
}) => {
  return (
    <div className={`
      bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md
      ${className}
    `}>
      <div className="flex items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
```

## 🗄️ 状態管理

### React (Zustand)
```typescript
// stores/userStore.ts
import { create } from 'zustand';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ 
    user, 
    isAuthenticated: !!user 
  }),
  
  logout: () => set({ 
    user: null, 
    isAuthenticated: false 
  })
}));
```

```typescript
// stores/themeStore.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  
  setTheme: (theme) => set({ theme }),
  
  toggleTheme: () => {
    const currentTheme = get().theme;
    set({ theme: currentTheme === 'light' ? 'dark' : 'light' });
  }
}));
```

### Vue.js (Pinia)
```typescript
// stores/user.ts
import { defineStore } from 'pinia';

interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false
  }),
  
  actions: {
    setUser(user: User | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },
    
    logout() {
      this.user = null;
      this.isAuthenticated = false;
    }
  }
});
```

## 📝 命名規則

### コンポーネント
- **ファイル名**: PascalCase (`UserCard.tsx`, `LoginForm.vue`)
- **コンポーネント名**: PascalCase (`const UserCard = () => {}`)
- **Props**: camelCase (`userName`, `onSubmit`)

### ディレクトリ
- **小文字**: `buttons/`, `forms/`, `modals/`
- **機能別**: `auth/`, `products/`, `users/`

### フック・Store
- **React Hook**: `useUserStore`, `useThemeStore`
- **Vue Composable**: `useUser`, `useTheme`
- **Custom Hook**: `useUsers`, `useProducts`

## 🔄 データフローパターン

### 正しいパターン
```typescript
// views層でAPIアクセス
Views → API → setState
  ↓ Props
Components/Pages → UI表示
  ↓ Props  
Components/Common → UI部品
```

### 禁止パターン
```typescript
// ❌ components層でのAPIアクセス
Components/Common → API (禁止)
Components/Pages → API (禁止)
```

## 🛡️ BaaS 連携パターン

### Firebase連携例
```tsx
// views/UsersPage.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/config';

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
    };
    
    fetchUsers();
  }, []);
  
  return <UserList users={users} />;
};
```

### Supabase連携例
```tsx
// views/ProductsPage.tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/config';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true);
        
      if (!error) {
        setProducts(data);
      }
    };
    
    fetchProducts();
  }, []);
  
  return <ProductGrid products={products} />;
};
```

## ✅ 設計原則チェックリスト

### 必須項目
- [ ] views層のみAPIアクセスを実行
- [ ] components層はpropsでデータを受け取る
- [ ] common/pages の責務分離が適切
- [ ] 状態管理（Zustand/Pinia）でグローバル状態を管理
- [ ] 命名規則に従っている
- [ ] エクスポート用index.tsファイルを配置

### 推奨項目
- [ ] TypeScriptの型定義を適切に実装
- [ ] エラーハンドリングを統一
- [ ] ローディング状態を適切に管理
- [ ] アクセシビリティを考慮
- [ ] レスポンシブデザインを実装

この設計により、保守性が高く、理解しやすいフロントエンドアーキテクチャを実現します。