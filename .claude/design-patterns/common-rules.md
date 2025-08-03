# 共通ルール・規約定義書

## 📐 プロジェクト共通規約

### 概要
フロントエンド・バックエンド共通で適用される開発規約とルールを定義し、チーム全体でのコード品質と保守性を確保します。

## 📁 プロジェクト構成ルール

### 1. 基本ディレクトリ構成
```
project-root/
├── .claude/                   # Claude Code設定
│   ├── agents/               # エージェント設定
│   └── design-patterns/      # 設計パターンドキュメント
├── frontend/                 # フロントエンドコード
│   ├── src/
│   │   ├── views/           # 画面コンポーネント（APIアクセス可）
│   │   ├── components/      # UIコンポーネント
│   │   ├── stores/          # 状態管理
│   │   ├── types/           # TypeScript型定義
│   │   └── shared/          # 共通機能
│   ├── public/
│   └── package.json
├── backend/                  # バックエンドコード
│   ├── src/
│   │   ├── Presentation/    # Controllers, API Routes
│   │   ├── UseCase/         # Services, Business Logic
│   │   ├── Infrastructure/  # Repositories, Data Access
│   │   └── Shared/          # 共通機能
│   └── package.json
├── docs/                     # プロジェクトドキュメント
├── README.md
└── .gitignore
```

### 2. import/export ルール

#### 絶対パスエイリアス使用
```typescript
// ✅ 正しい
import { UserCard } from '@/components/common/cards';
import { userService } from '@/services/userService';

// ❌ 避ける
import { UserCard } from '../../components/common/cards';
import { userService } from '../services/userService';
```

#### index.ts によるエクスポート管理
```typescript
// components/common/buttons/index.ts
export { default as PrimaryButton } from './PrimaryButton';
export { default as SecondaryButton } from './SecondaryButton';
export { default as IconButton } from './IconButton';

// 使用側
import { PrimaryButton, SecondaryButton } from '@/components/common/buttons';
```

## 🏷️ 命名規則

### 1. ファイル・ディレクトリ命名

#### TypeScript/JavaScript
```
✅ 正しい命名
- PascalCase: UserCard.tsx, ProductService.ts
- camelCase: userUtils.ts, apiClient.ts  
- kebab-case: user-profile.css
- lowercase: components/, services/, types/

❌ 避ける命名
- snake_case: user_card.tsx
- UPPERCASE: USERCARD.tsx
- 混在: UserCard.js.tsx
```

#### C#
```
✅ 正しい命名
- PascalCase: UserController.cs, UserService.cs
- PascalCase: Controllers/, Services/, Repositories/

❌ 避ける命名
- camelCase: userController.cs
- snake_case: user_controller.cs
```

### 2. 変数・関数命名

#### TypeScript/JavaScript
```typescript
// ✅ 正しい
const userName = 'John';
const API_BASE_URL = 'https://api.example.com';
const getUserData = async () => {};
const handleSubmit = () => {};

// Interface/Type
interface UserData {
  id: number;
  name: string;
}

type ApiResponse<T> = {
  data: T;
  status: number;
};

// ❌ 避ける
const UserName = 'John';           // 変数はcamelCase
const api_base_url = 'https://';   // 定数はUPPER_SNAKE_CASE
const GetUserData = async () => {}; // 関数はcamelCase
```

#### C#
```csharp
// ✅ 正しい
public class UserService
{
    private readonly IUserRepository _userRepository;
    public const string API_BASE_URL = "https://api.example.com";
    
    public async Task<UserDto> GetUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user;
    }
}

// ❌ 避ける  
public class userService          // クラスはPascalCase
{
    private readonly IUserRepository userRepository; // フィールドは_camelCase
    public const string apiBaseUrl = "https://";     // 定数はUPPER_SNAKE_CASE
}
```

## 🔧 コード品質ルール

### 1. TypeScript 必須設定
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true
  }
}
```

### 2. 型定義ルール
```typescript
// ✅ 正しい型定義
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// ユニオン型を活用
type Theme = 'light' | 'dark';
type Status = 'loading' | 'success' | 'error';

// ❌ 避ける
interface User {
  id: any;           // any型は避ける
  name: string;
  email?: string;    // 不必要なoptionalは避ける
}
```

### 3. エラーハンドリングルール
```typescript
// ✅ 正しいエラーハンドリング
const fetchUserData = async (id: number): Promise<User | null> => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error('API Error:', error.response?.data);
    } else {
      console.error('Unexpected Error:', error);
    }
    return null;
  }
};

// ❌ 避ける
const fetchUserData = async (id: number) => {
  const response = await axios.get(`/api/users/${id}`); // エラーハンドリングなし
  return response.data;
};
```

### 4. 関数・メソッドルール
```typescript
// ✅ 正しい関数定義
// 1つの責務に集中
const formatUserName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

// 引数が多い場合はオブジェクトを使用
interface CreateUserParams {
  name: string;
  email: string;
  age: number;
  department: string;
}

const createUser = (params: CreateUserParams): User => {
  // 実装
};

// ❌ 避ける
const processUser = (name: string, email: string, age: number, dept: string, active: boolean, role: string) => {
  // 引数が多すぎる
  // 複数の責務を持っている
};
```

## 🔒 セキュリティルール

### 1. 入力検証ルール
```typescript
// ✅ 正しい入力検証
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().min(18).max(120)
});

const validateUser = (data: unknown) => {
  return userSchema.parse(data);
};

// ❌ 避ける
const validateUser = (data: any) => {
  // 検証なしでそのまま使用
  return data;
};
```

### 2. 環境変数管理
```typescript
// ✅ 正しい環境変数使用
// .env.example
const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
  databaseUrl: process.env.DATABASE_URL || '',
  jwtSecret: process.env.JWT_SECRET || ''
};

// 環境変数の存在チェック
if (!config.jwtSecret) {
  throw new Error('JWT_SECRET is required');
}

// ❌ 避ける
const config = {
  apiUrl: 'https://api.production.com', // ハードコーディング
  jwtSecret: 'my-secret-key'           // 機密情報をコードに含める
};
```

### 3. 認証・認可ルール
```typescript
// ✅ 正しい認証チェック
const authenticatedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const user = await verifyToken(token);
    // 処理続行
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ❌ 避ける
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // 認証チェックなし
  const users = await getAllUsers();
  res.json(users);
};
```

## 📝 コメント・ドキュメントルール

### 1. コメントガイドライン
```typescript
// ✅ 有用なコメント
/**
 * ユーザーデータを取得し、表示用に整形する
 * @param userId - 取得するユーザーのID
 * @returns 整形されたユーザー情報、存在しない場合はnull
 */
const fetchAndFormatUser = async (userId: number): Promise<FormattedUser | null> => {
  // 複雑なビジネスロジックの説明
  const user = await userRepository.findById(userId);
  
  if (!user) {
    return null;
  }
  
  // データ変換の理由を説明
  return {
    displayName: `${user.firstName} ${user.lastName}`,
    // タイムゾーンを考慮した日時表示
    joinDate: formatDateForDisplay(user.createdAt)
  };
};

// ❌ 不要なコメント
const getUserName = (user: User): string => {
  // ユーザーの名前を返す（コードを読めば分かる）
  return user.name;
};
```

### 2. README.md 必須項目
```markdown
# プロジェクト名

## 概要
プロジェクトの目的と概要

## 技術スタック
- Frontend: React/Vue.js + TypeScript
- Backend: Next.js/C# + ASP.NET Core
- Database: Firebase/Supabase
- State Management: Zustand/Pinia

## セットアップ
```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local

# 開発サーバー起動
npm run dev
```

## ディレクトリ構成
プロジェクト構成の説明

## 開発ルール
設計パターンドキュメントへのリンク
```

## 🧪 テストルール

### 1. テストファイル配置
```
src/
├── components/
│   ├── UserCard.tsx
│   └── UserCard.test.tsx        # 同一ディレクトリ
├── services/
│   ├── userService.ts
│   └── userService.test.ts
└── __tests__/                   # または専用ディレクトリ
    ├── components/
    └── services/
```

### 2. テスト命名
```typescript
// ✅ 正しいテスト命名
describe('UserCard', () => {
  it('should display user name and email', () => {
    // テスト実装
  });
  
  it('should show edit button when user is owner', () => {
    // テスト実装
  });
  
  it('should handle loading state correctly', () => {
    // テスト実装
  });
});

// ❌ 避ける
describe('UserCard', () => {
  it('test1', () => {}); // 内容が分からない
  it('works', () => {}); // 曖昧
});
```

## 🔄 Git ルール

### 1. ブランチ命名
```bash
# ✅ 正しいブランチ命名
feature/user-authentication
fix/login-validation-error
hotfix/security-patch
docs/api-documentation

# ❌ 避ける
new-feature
fix
john-branch
```

### 2. コミットメッセージ
```bash
# ✅ 正しいコミットメッセージ
feat: add user authentication system
fix: resolve login validation error
docs: update API documentation
refactor: improve error handling logic

# 詳細が必要な場合
feat: add user authentication system

- Implement JWT-based authentication
- Add login/logout functionality
- Create protected route middleware
- Add user session management

# ❌ 避ける
update
fix bug
changes
wip
```

### 3. PR (Pull Request) ルール
```markdown
## 変更内容
- ユーザー認証システムの実装
- ログイン/ログアウト機能の追加

## テスト
- [ ] 単体テスト実行
- [ ] 結合テスト実行
- [ ] 手動テスト完了

## チェックリスト
- [ ] 設計パターンに準拠している
- [ ] セキュリティ要件を満たしている
- [ ] エラーハンドリングが適切
- [ ] ドキュメント更新済み
```

## ⚠️ 例外承認プロセス

### 1. 設計パターン逸脱の場合
設計パターンから逸脱する必要がある場合：

1. **事前相談**: 実装前に必ず相談
2. **理由説明**: 逸脱が必要な技術的理由を文書化
3. **代替案検討**: 他の解決方法の検討結果
4. **影響範囲**: 変更による影響範囲の評価
5. **承認**: プロジェクトリーダーによる承認

### 2. 承認が必要なケース
- パフォーマンス要件で設計変更が必要
- 外部ライブラリ制約で標準パターンが使用不可
- 技術的負債解決のためのリファクタリング
- セキュリティ要件で特別な実装が必要

## ✅ 品質チェックリスト

### 開発時チェック項目
- [ ] 命名規則に従っている
- [ ] 型安全性を確保している
- [ ] エラーハンドリングを実装している
- [ ] セキュリティルールに準拠している
- [ ] テストを作成している
- [ ] ドキュメントを更新している

### コードレビューチェック項目
- [ ] 設計パターンに準拠している
- [ ] コード品質が基準を満たしている
- [ ] セキュリティ脆弱性がない
- [ ] パフォーマンスが適切
- [ ] 保守性が確保されている

これらのルールに従うことで、チーム全体での開発効率と品質を向上させることができます。