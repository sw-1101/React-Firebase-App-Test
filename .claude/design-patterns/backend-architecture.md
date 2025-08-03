# バックエンド設計パターン

## 🏗️ クリーンアーキテクチャ設計書

### 概要
バックエンド開発においてクリーンアーキテクチャの4層構造を採用し、保守性と拡張性を重視した設計を実現します。

## 📋 基本原則

### 1. 4層構造
```
Presentation Layer    (プレゼンテーション層)
     ↓
Use Case Layer       (ユースケース層)
     ↓
Domain Layer         (ドメイン層) ※今回は省略
     ↓
Infrastructure Layer (インフラストラクチャ層)
```

### 2. 依存関係のルール
- 外側の層は内側の層に依存できる
- 内側の層は外側の層に依存してはいけない
- データフローは一方向のみ

## 🗂️ ディレクトリ構成

### ASP.NET Core
```
src/
├── Presentation/
│   ├── Controllers/
│   │   ├── UsersController.cs
│   │   └── ProductsController.cs
│   └── DTOs/
│       ├── Commands/
│       │   ├── CreateUserCommand.cs
│       │   └── UpdateUserCommand.cs
│       └── Queries/
│           ├── UserListDto.cs
│           └── UserDetailDto.cs
├── UseCase/
│   ├── Services/
│   │   ├── UserService.cs
│   │   └── ProductService.cs
│   └── Interfaces/
│       └── IUserRepository.cs
├── Infrastructure/
│   ├── Repositories/
│   │   ├── UserRepository.cs
│   │   └── ProductRepository.cs
│   ├── External/
│   │   └── EmailService.cs
│   └── Data/
│       ├── Entities/
│       │   ├── User.cs
│       │   └── Product.cs
│       └── ApplicationDbContext.cs
└── Shared/
    ├── Constants/
    │   ├── ApiConstants.cs
    │   ├── MessageConstants.cs
    │   └── BusinessConstants.cs
    ├── Utils/
    │   ├── ValidationUtils.cs
    │   ├── FormatUtils.cs
    │   └── LoggerUtils.cs
    └── Types/
        └── CommonTypes.cs
```

### Next.js (Pages Router)
```
src/
├── pages/
│   └── api/
│       ├── users/
│       │   ├── index.ts          # GET/POST /api/users
│       │   └── [id].ts           # GET/PUT/DELETE /api/users/:id
│       └── products/
│           └── index.ts
├── services/
│   ├── userService.ts
│   └── productService.ts
├── repositories/
│   ├── userRepository.ts
│   └── productRepository.ts
├── entities/
│   ├── User.ts
│   └── Product.ts
├── types/
│   ├── commands/
│   │   ├── CreateUserCommand.ts
│   │   └── UpdateUserCommand.ts
│   └── dtos/
│       ├── UserListDto.ts
│       └── UserDetailDto.ts
└── shared/
    ├── constants/
    ├── utils/
    └── types/
```

## 💼 各層の責務

### 1. Presentation Layer (プレゼンテーション層)
**責務**: HTTP リクエスト/レスポンスの処理、入力検証、認証・認可

```csharp
// ASP.NET Core Controller例
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserCommand command)
    {
        try
        {
            var result = await _userService.CreateUserAsync(command);
            return Ok(result);
        }
        catch (ValidationException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _userService.GetUsersAsync();
        return Ok(users);
    }
}
```

```typescript
// Next.js API Route例
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'POST':
        const command: CreateUserCommand = req.body;
        const result = await userService.createUser(command);
        return res.status(201).json(result);
        
      case 'GET':
        const users = await userService.getUsers();
        return res.status(200).json(users);
        
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### 2. Use Case Layer (ユースケース層)
**責務**: ビジネスロジック、データ変換、トランザクション制御

```csharp
// C# Service例
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserDetailDto> CreateUserAsync(CreateUserCommand command)
    {
        // ビジネスロジック
        if (await _userRepository.ExistsByEmailAsync(command.Email))
        {
            throw new ValidationException("Email already exists");
        }

        // Entity作成
        var user = new User
        {
            Name = command.Name,
            Email = command.Email,
            CreatedAt = DateTime.UtcNow
        };

        // 保存
        var savedUser = await _userRepository.CreateAsync(user);

        // DTOに変換して返却
        return new UserDetailDto
        {
            Id = savedUser.Id,
            Name = savedUser.Name,
            Email = savedUser.Email
        };
    }

    public async Task<IEnumerable<UserListDto>> GetUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        
        return users.Select(u => new UserListDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email
        });
    }
}
```

### 3. Infrastructure Layer (インフラストラクチャ層)
**責務**: データベースアクセス、外部API連携、ファイルI/O

```csharp
// C# Repository例
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<IEnumerable<User>> GetAllAsync()
    {
        return await _context.Users
            .Where(u => u.IsActive)
            .OrderBy(u => u.Name)
            .ToListAsync();
    }

    public async Task<bool> ExistsByEmailAsync(string email)
    {
        return await _context.Users
            .AnyAsync(u => u.Email == email && u.IsActive);
    }
}
```

## 🔄 データフローパターン

### Command (書き込み系)
```
Controller/API Route
    ↓ CreateUserCommand
Service
    ↓ User Entity
Repository
    ↓ User Entity
Database
```

### Query (読み込み系)
```
Controller/API Route
    ↓
Service
    ↓ User Entity
Repository
    ↓ UserListDto/UserDetailDto
Controller/API Route
```

## 📝 命名規則

### ファイル・クラス名
- **Controller**: `UsersController.cs`
- **Service**: `UserService.cs`
- **Repository**: `UserRepository.cs`
- **Entity**: `User.cs`
- **Command**: `CreateUserCommand.cs`
- **DTO**: `UserListDto.cs`, `UserDetailDto.cs`

### メソッド名
- **Create**: `CreateAsync`, `CreateUserAsync`
- **Read**: `GetAsync`, `GetByIdAsync`, `GetAllAsync`
- **Update**: `UpdateAsync`, `UpdateUserAsync`
- **Delete**: `DeleteAsync`, `DeleteUserAsync`

### 定数・共通関数
- **定数**: `UPPER_SNAKE_CASE`
- **関数**: `camelCase`
- **ファイル**: 機能別分割（`apiConstants.ts`, `validationUtils.ts`）

## 🛡️ セキュリティ考慮事項

### 1. 入力検証
```csharp
// Command/DTOレベルでの検証
public class CreateUserCommand
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }
}
```

### 2. 認証・認可
```csharp
[Authorize]
[HttpGet("{id}")]
public async Task<IActionResult> GetUser(int id)
{
    // 認可チェック
    if (!await _authService.CanAccessUser(User.Identity.Name, id))
    {
        return Forbid();
    }
    
    var user = await _userService.GetUserAsync(id);
    return Ok(user);
}
```

### 3. SQLインジェクション対策
```csharp
// パラメータ化クエリ使用
public async Task<User> GetByEmailAsync(string email)
{
    return await _context.Users
        .FirstOrDefaultAsync(u => u.Email == email); // EF Coreが自動的にパラメータ化
}
```

## 🚀 BaaS (Firebase/Supabase) との連携

### フロントエンド直接接続パターン
```typescript
// フロントエンドから直接BaaSアクセス
// views/UsersPage.tsx
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Firebase/Supabaseから直接データ取得
    const fetchUsers = async () => {
      const { data } = await supabase
        .from('users')
        .select('*');
      setUsers(data);
    };
    
    fetchUsers();
  }, []);
  
  return <UserList users={users} />;
};
```

### 将来的なバックエンド経由パターン
```typescript
// Next.js API Route経由でBaaS接続
// pages/api/users/index.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);
  
  const { data, error } = await supabase
    .from('users')
    .select('*');
    
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  res.json(data);
}
```

## ✅ 設計原則チェックリスト

### 必須項目
- [ ] 4層構造の依存関係が正しい
- [ ] Controller/API Routeの戻り値がIActionResult/Response形式
- [ ] Service層でビジネスロジックを実装
- [ ] Repository層でデータアクセスを実装
- [ ] Command/DTOでデータ転送
- [ ] 命名規則に従っている

### 推奨項目
- [ ] 入力検証を適切に実装
- [ ] エラーハンドリングを統一
- [ ] ログ出力を適切に配置
- [ ] セキュリティ対策を実装
- [ ] テスタビリティを考慮

この設計により、保守性が高く、拡張しやすいバックエンドアーキテクチャを実現します。