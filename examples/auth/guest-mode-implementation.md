# Guest模式系统实施指导

## 📋 模块概述

**目标**: 实现完整的Guest模式双模态架构，支持游客和认证用户的无缝切换  
**预期时间**: 2-3天  
**交付标准**: 功能完整的Guest模式体验 + 登录转化机制  
**前置条件**: 完成项目初始化模块  

## 🎯 本模块MVP交付目标

完成后你将拥有：
- ✅ 完整的Guest模式路由保护系统
- ✅ 智能的权限边界控制
- ✅ 本地数据管理和生命周期控制
- ✅ 登录转化引导机制
- ✅ 可独立运行的Guest模式应用

## 🚀 实施步骤

### Step 1: Guest模式状态管理基础

#### 1.1 创建Guest模式Store

**创建 `src/store/guestModeStore.ts`**（复用并优化现有实现）：

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Guest模式允许的路由列表
const GUEST_ALLOWED_ROUTES = [
  '/prescription/create',
  '/auth/login',
  '/auth/register',
  '/',
] as const

interface GuestModeState {
  // 状态
  isGuestMode: boolean
  allowedRoutes: string[]
  sessionStartTime: number
  
  // 动作
  enableGuestMode: () => void
  disableGuestMode: () => void  
  isRouteAllowed: (path: string) => boolean
  shouldRedirectToHome: () => boolean
  clearGuestSession: () => void
}

export const useGuestModeStore = create<GuestModeState>()(
  persist(
    (set, get) => ({
      // 默认启用Guest模式
      isGuestMode: true,
      allowedRoutes: [...GUEST_ALLOWED_ROUTES],
      sessionStartTime: Date.now(),
      
      enableGuestMode: () => set({
        isGuestMode: true,
        sessionStartTime: Date.now(),
      }),
      
      disableGuestMode: () => set({
        isGuestMode: false,
      }),
      
      isRouteAllowed: (path: string) => {
        const { allowedRoutes, isGuestMode } = get()
        if (!isGuestMode) return true
        
        return allowedRoutes.some(route => 
          route === path || path.startsWith(route)
        )
      },
      
      shouldRedirectToHome: () => {
        const { isGuestMode } = get()
        return isGuestMode
      },
      
      clearGuestSession: () => set({
        sessionStartTime: Date.now(),
      }),
    }),
    {
      name: 'guest-mode-storage',
      storage: createJSONStorage(() => sessionStorage), // 使用sessionStorage，浏览器关闭时自动清理
    }
  )
)
```

#### 1.2 集成现有的guestDataManager

**确保 `src/utils/guestDataManager.ts` 已正确复用**，这是经过验证的本地数据管理方案：

```bash
# 验证文件存在
ls -la src/utils/guestDataManager.ts

# 如果不存在，从原项目复制
cp /path/to/old-project/src/utils/guestDataManager.ts src/utils/
```

### Step 2: 路由保护系统实施

#### 2.1 集成GuestModeGuard组件

**确保 `src/components/auth/GuestModeGuard.tsx` 已正确复用**：

```bash
# 验证核心认证组件存在
ls -la src/components/auth/GuestModeGuard.tsx
ls -la src/components/auth/LoginPromptModal.tsx
ls -la src/components/auth/withAuth.tsx
```

这些组件已经过**24个测试验证**，是高质量的复用资产。

#### 2.2 创建路由保护配置

**创建 `src/lib/routeConfig.ts`**：

```typescript
// 路由权限配置
export const ROUTE_CONFIG = {
  // Guest模式允许的路由
  GUEST_ALLOWED: [
    '/',
    '/prescription/create',
    '/auth/login', 
    '/auth/register',
  ],
  
  // 需要认证的路由
  AUTH_REQUIRED: [
    '/doctor',
    '/doctor/history',
    '/doctor/templates',
    '/pharmacy',
    '/admin',
  ],
  
  // Guest模式重定向规则
  GUEST_REDIRECTS: {
    '/': '/prescription/create', // 首页重定向到处方创建
  },
  
  // 未授权访问的默认重定向
  DEFAULT_REDIRECT: '/prescription/create',
} as const

// 路由权限检查工具函数
export function isGuestAllowedRoute(path: string): boolean {
  return ROUTE_CONFIG.GUEST_ALLOWED.some(route => 
    path === route || path.startsWith(route)
  )
}

export function requiresAuth(path: string): boolean {
  return ROUTE_CONFIG.AUTH_REQUIRED.some(route => 
    path.startsWith(route)
  )
}
```

#### 2.3 在根布局中集成路由保护

**更新 `src/app/layout.tsx`**：

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GuestModeProvider } from '@/components/auth/GuestModeProvider'

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
          <GuestModeProvider>
            {children}
          </GuestModeProvider>
        </div>
      </body>
    </html>
  )
}
```

#### 2.4 创建GuestModeProvider

**创建 `src/components/auth/GuestModeProvider.tsx`**：

```typescript
'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useGuestModeStore } from '@/store/guestModeStore'
import { ROUTE_CONFIG } from '@/lib/routeConfig'

interface GuestModeProviderProps {
  children: React.ReactNode
}

export function GuestModeProvider({ children }: GuestModeProviderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { isGuestMode, shouldRedirectToHome } = useGuestModeStore()

  useEffect(() => {
    // Guest模式下的首页重定向逻辑
    if (isGuestMode && shouldRedirectToHome() && pathname === '/') {
      router.replace('/prescription/create')
      return
    }
  }, [pathname, isGuestMode, shouldRedirectToHome, router])

  return <>{children}</>
}
```

### Step 3: 处方创建页面集成

#### 3.1 创建处方创建路由

**创建 `src/app/prescription/create/page.tsx`**：

```typescript
import { GuestModeGuard } from '@/components/auth/GuestModeGuard'
import { PrescriptionCreator } from '@/components/prescription/PrescriptionCreator'

export default function PrescriptionCreatePage() {
  return (
    <GuestModeGuard>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">创建处方</h1>
          <p className="text-muted-foreground">
            在演示模式下创建和管理中医处方
          </p>
        </div>
        
        <PrescriptionCreator />
      </div>
    </GuestModeGuard>
  )
}
```

#### 3.2 验证核心组件集成

确保以下核心组件已正确复用：

```bash
# 验证处方相关组件
ls -la src/components/prescription/PrescriptionCreator.tsx
ls -la src/components/prescription/MedicineSearch.tsx

# 验证工具函数
ls -la src/utils/prescriptionCalculator.ts
ls -la src/utils/qrParser.ts

# 验证服务层
ls -la src/services/prescriptionService.ts
ls -la src/services/medicineService.ts
```

### Step 4: Guest模式用户体验优化

#### 4.1 创建Guest模式标识组件

**创建 `src/components/common/GuestModeBanner.tsx`**：

```typescript
'use client'

import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'
import { useGuestModeStore } from '@/store/guestModeStore'

export function GuestModeBanner() {
  const { isGuestMode } = useGuestModeStore()

  if (!isGuestMode) return null

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          您正在使用 <Badge variant="secondary">演示模式</Badge>
          ，数据仅供参考，不会保存到服务器
        </span>
      </AlertDescription>
    </Alert>
  )
}
```

#### 4.2 在关键页面添加Guest标识

**更新 `src/app/prescription/create/page.tsx`**：

```typescript
import { GuestModeGuard } from '@/components/auth/GuestModeGuard'
import { GuestModeBanner } from '@/components/common/GuestModeBanner'
import { PrescriptionCreator } from '@/components/prescription/PrescriptionCreator'

export default function PrescriptionCreatePage() {
  return (
    <GuestModeGuard>
      <div className="container mx-auto py-6">
        <GuestModeBanner />
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">创建处方</h1>
          <p className="text-muted-foreground">
            在演示模式下创建和管理中医处方
          </p>
        </div>
        
        <PrescriptionCreator />
      </div>
    </GuestModeGuard>
  )
}
```

### Step 5: 登录转化机制实施

#### 5.1 优化LoginPromptModal组件

**确保 `src/components/auth/LoginPromptModal.tsx` 包含良好的转化体验**：

检查组件是否包含以下关键要素：
- ✅ 清晰的价值主张说明
- ✅ 友好的转化文案
- ✅ 多种登录选项
- ✅ "继续演示"的回退选项

#### 5.2 创建认证页面结构

**创建 `src/app/auth/login/page.tsx`**：

```typescript
import { LoginModal } from '@/components/auth/LoginModal'

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">登录账户</h1>
          <p className="text-muted-foreground">
            登录以使用完整功能并保存您的数据
          </p>
        </div>
        
        <LoginModal />
        
        <div className="mt-4 text-center">
          <a 
            href="/prescription/create" 
            className="text-sm text-muted-foreground hover:underline"
          >
            继续使用演示模式
          </a>
        </div>
      </div>
    </div>
  )
}
```

### Step 6: 测试和验证

#### 6.1 创建Guest模式功能测试

**创建 `src/__tests__/guest-mode.test.tsx`**：

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useGuestModeStore } from '@/store/guestModeStore'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/prescription/create',
  }),
  usePathname: () => '/prescription/create',
}))

describe('Guest模式功能测试', () => {
  beforeEach(() => {
    // 重置store状态
    useGuestModeStore.getState().enableGuestMode()
  })

  it('Guest模式默认启用', () => {
    const { isGuestMode } = useGuestModeStore.getState()
    expect(isGuestMode).toBe(true)
  })

  it('允许的路由检查正确', () => {
    const { isRouteAllowed } = useGuestModeStore.getState()
    
    expect(isRouteAllowed('/prescription/create')).toBe(true)
    expect(isRouteAllowed('/auth/login')).toBe(true)
    expect(isRouteAllowed('/doctor/history')).toBe(false)
  })

  it('首页重定向逻辑正确', () => {
    const { shouldRedirectToHome } = useGuestModeStore.getState()
    expect(shouldRedirectToHome()).toBe(true)
  })
})
```

#### 6.2 端到端功能验证

**手动测试清单**：

```bash
# 启动开发服务器
npm run dev

# 测试以下功能：
1. 访问 http://localhost:3000 → 自动重定向到 /prescription/create
2. 访问 /prescription/create → 正常显示处方创建页面
3. 尝试访问 /doctor/history → 显示登录引导弹窗
4. 点击"继续演示" → 返回处方创建页面
5. Guest模式标识横幅正常显示
```

## ✅ 完成标准检查清单

### 📋 Guest模式状态管理
- [ ] guestModeStore 正确集成和配置
- [ ] 状态持久化正常工作（sessionStorage）
- [ ] 路由权限检查逻辑正确
- [ ] 会话生命周期管理正常

### 📋 路由保护系统
- [ ] GuestModeGuard 组件正确集成
- [ ] 路由权限配置完整
- [ ] 首页重定向逻辑正常
- [ ] 未授权路由正确拦截

### 📋 用户体验
- [ ] Guest模式标识清晰显示
- [ ] LoginPromptModal 转化体验良好
- [ ] 页面导航流畅自然
- [ ] 错误处理用户友好

### 📋 核心功能集成
- [ ] 处方创建页面正常工作
- [ ] 药品搜索功能正常
- [ ] 本地数据管理正常
- [ ] PDF导出功能正常

### 📋 测试验证
- [ ] 单元测试通过
- [ ] 手动测试清单完成
- [ ] 无控制台错误
- [ ] 性能表现良好

## 🚨 常见问题排除

### 问题1: 路由重定向不工作
```bash
解决方案: 检查 next/navigation 的 useRouter 和 usePathname 使用是否正确
```

### 问题2: Guest模式状态不持久
```bash
解决方案: 确认 zustand persist 中间件配置正确，使用 sessionStorage
```

### 问题3: LoginPromptModal 不显示
```bash
解决方案: 检查 GuestModeGuard 中的路由权限检查逻辑
```

## 📊 成功指标

完成本模块后，你应该拥有：
- ✅ **功能完整的Guest模式体验** - 用户可以完整体验处方创建流程
- ✅ **智能的权限控制** - 受限功能显示登录引导，不破坏用户体验  
- ✅ **良好的转化机制** - 用户可以平滑从Guest模式转为登录用户
- ✅ **独立可运行的应用** - 完全不依赖后端的功能完整应用

## ➡️ 下一步

完成本模块后，请继续阅读 `04-prescription-core/prescription-creator.md` 开始处方核心功能的深度集成和优化。

---

**重要提醒**: Guest模式是这个项目的核心竞争优势，确保用户体验流畅自然。复用的GuestModeGuard组件已经过24个测试验证，是高质量的实现，请保持其核心逻辑不变。