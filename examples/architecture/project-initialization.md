# 项目初始化指导文档

## 📋 模块概述

**目标**: 搭建新项目脚手架，配置开发环境，建立代码复用基础  
**预期时间**: 1-2天  
**交付标准**: 可运行的项目基础 + 复用组件成功集成  
**前置条件**: Node.js 18+, Git, VS Code  

## 🎯 本模块MVP交付目标

完成后你将拥有：
- ✅ 全新的TypeScript + React项目
- ✅ 配置完整的开发环境
- ✅ 11个核心业务组件成功复用
- ✅ 基础的项目结构和规范
- ✅ 可运行的Hello World应用

## 🚀 实施步骤

### Step 1: 创建新项目基础架构

#### 1.1 初始化新项目
```bash
# 在你的工作目录中创建新项目
npx create-next-app@latest tcm-prescription-frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# 进入项目目录
cd tcm-prescription-frontend

# 安装核心依赖（基于现有项目成功经验）
npm install zustand @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-tabs
npm install lucide-react react-hook-form @hookform/resolvers zod
npm install jspdf qrcode.react class-variance-authority clsx tailwind-merge

# 安装开发依赖
npm install -D @types/jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

#### 1.2 配置基础项目结构
```bash
# 创建关键目录结构（基于现有项目的最佳实践）
mkdir -p src/components/{auth,prescription,ui,common}
mkdir -p src/utils src/services src/store src/types src/hooks
mkdir -p src/lib src/__tests__
```

#### 1.3 配置TypeScript（严格模式）
创建 `tsconfig.json`：
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Step 2: 复用核心业务组件

这是最关键的步骤！我们要将经过验证的业务组件迁移到新项目中。

#### 2.1 创建复用组件清单

创建 `code-reuse-manifest.md`：
```markdown
# 代码复用清单

## 🔥 高优先级复用组件（必须复用）

### 认证系统组件
- [ ] src/components/auth/GuestModeGuard.tsx
- [ ] src/components/auth/withAuth.tsx
- [ ] src/components/auth/LoginPromptModal.tsx

### 处方核心组件
- [ ] src/components/prescription/PrescriptionCreator.tsx
- [ ] src/components/prescription/MedicineSearch.tsx
- [ ] src/components/prescription/PrescriptionDetailModal.tsx

### 业务工具函数
- [ ] src/utils/prescriptionCalculator.ts
- [ ] src/utils/guestDataManager.ts
- [ ] src/utils/qrParser.ts

### 服务层
- [ ] src/services/prescriptionService.ts
- [ ] src/services/medicineService.ts

## 📋 复用操作记录
记录每个组件的复用状态和修改说明
```

#### 2.2 执行代码复用操作

**重要提醒**: 这些组件已经过完整测试，代码质量高，建议直接复制并做最小修改。

```bash
# 假设原项目路径为 /path/to/old-project，执行以下复制操作：

# 1. 复用认证系统组件（已通过24个测试）
cp /path/to/old-project/src/components/auth/GuestModeGuard.tsx src/components/auth/
cp /path/to/old-project/src/components/auth/withAuth.tsx src/components/auth/
cp /path/to/old-project/src/components/auth/LoginPromptModal.tsx src/components/auth/

# 2. 复用处方核心组件（核心业务逻辑）
cp /path/to/old-project/src/components/prescription/PrescriptionCreator.tsx src/components/prescription/
cp /path/to/old-project/src/components/prescription/MedicineSearch.tsx src/components/prescription/
cp /path/to/old-project/src/components/prescription/PrescriptionDetailModal.tsx src/components/prescription/

# 3. 复用业务工具函数（已验证的计算逻辑）
cp /path/to/old-project/src/utils/prescriptionCalculator.ts src/utils/
cp /path/to/old-project/src/utils/guestDataManager.ts src/utils/
cp /path/to/old-project/src/utils/qrParser.ts src/utils/

# 4. 复用服务层（API抽象层）
cp /path/to/old-project/src/services/prescriptionService.ts src/services/
cp /path/to/old-project/src/services/medicineService.ts src/services/

# 5. 复用类型定义
cp /path/to/old-project/src/types/prescription.ts src/types/
cp /path/to/old-project/src/types/medicine.ts src/types/
cp /path/to/old-project/src/types/auth.ts src/types/
```

#### 2.3 解决依赖问题

复用的组件可能有一些依赖需要调整：

**创建 `src/lib/utils.ts`**：
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**创建基础UI组件** (如果复用组件需要):
```bash
# 创建基础的shadcn/ui组件
npx shadcn-ui@latest add button dialog input label select tabs card badge alert
```

### Step 3: 创建最小化的运行环境

#### 3.1 创建基础的App结构

**更新 `src/app/layout.tsx`**：
```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TCM Prescription Platform',
  description: 'Traditional Chinese Medicine Prescription Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-background">
          {children}
        </div>
      </body>
    </html>
  )
}
```

#### 3.2 创建首页测试复用组件

**创建 `src/app/page.tsx`**：
```typescript
import { GuestModeGuard } from '@/components/auth/GuestModeGuard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function HomePage() {
  return (
    <GuestModeGuard>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">TCM Prescription Platform</h1>
        <div className="space-y-4">
          <p>项目重建成功！以下是复用的核心组件验证：</p>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded">
              <h3 className="font-semibold">✅ Guest模式路由守卫</h3>
              <p className="text-sm text-muted-foreground">已成功集成GuestModeGuard组件</p>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-semibold">🔍 药品搜索系统</h3>
              <Link href="/prescription/create">
                <Button variant="outline">测试处方创建</Button>
              </Link>
            </div>
            
            <div className="p-4 border rounded">
              <h3 className="font-semibold">💾 本地数据管理</h3>
              <p className="text-sm text-muted-foreground">guestDataManager已就绪</p>
            </div>
          </div>
        </div>
      </div>
    </GuestModeGuard>
  )
}
```

### Step 4: 验证和测试

#### 4.1 运行项目检查
```bash
# 启动开发服务器
npm run dev

# 在浏览器中访问 http://localhost:3000
# 检查是否有编译错误
```

#### 4.2 解决常见问题

**问题1: TypeScript类型错误**
- 检查 `src/types/` 目录下的类型定义是否完整
- 确保所有import路径正确

**问题2: 缺少UI组件**
- 使用 `npx shadcn-ui@latest add [component-name]` 添加缺少的组件
- 或者创建简单的placeholder组件

**问题3: 环境变量问题**
- 创建 `.env.local` 文件
- 添加必要的环境变量

#### 4.3 创建基础测试

**创建 `src/__tests__/basic.test.tsx`**：
```typescript
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import HomePage from '@/app/page'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/',
  }),
}))

describe('基础功能测试', () => {
  it('首页正常渲染', () => {
    render(<HomePage />)
    expect(screen.getByText('TCM Prescription Platform')).toBeInTheDocument()
  })

  it('复用组件验证信息显示', () => {
    render(<HomePage />)
    expect(screen.getByText('Guest模式路由守卫')).toBeInTheDocument()
    expect(screen.getByText('药品搜索系统')).toBeInTheDocument()
  })
})
```

运行测试：
```bash
npm test
```

## ✅ 完成标准检查清单

在进入下一个模块之前，请确认以下项目已完成：

### 📋 项目基础
- [ ] Next.js + TypeScript 项目成功创建
- [ ] 项目目录结构按规范建立
- [ ] 核心依赖包安装完成
- [ ] TypeScript 配置正确（严格模式）

### 📋 代码复用
- [ ] 11个核心业务组件成功复用
- [ ] 所有复用组件无TypeScript错误
- [ ] 基础UI组件库配置完成
- [ ] 代码复用清单记录完整

### 📋 运行验证
- [ ] `npm run dev` 成功启动
- [ ] 首页可以正常访问
- [ ] 无控制台错误信息
- [ ] 基础测试通过

### 📋 开发环境
- [ ] ESLint 配置正确
- [ ] Prettier 代码格式化正常
- [ ] Git 仓库初始化
- [ ] VS Code 插件配置推荐

## 🚨 故障排除

### 常见问题及解决方案

**问题**: 复用组件导入错误
```bash
解决方案: 检查文件路径和export/import语法
```

**问题**: shadcn/ui组件缺失
```bash
解决方案: npx shadcn-ui@latest add [component-name]
```

**问题**: TypeScript类型错误
```bash
解决方案: 确保 src/types/ 目录下的类型文件完整
```

## ➡️ 下一步

完成本模块后，请继续阅读 `01-core-infrastructure/routing-system.md` 开始核心基础设施的搭建。

---

**重要提醒**: 这个阶段的目标是快速建立可运行的基础，不要在细节上花费太多时间。确保11个核心组件成功复用是最重要的成功指标。