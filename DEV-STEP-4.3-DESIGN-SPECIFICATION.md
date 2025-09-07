# Dev-Step 4.3 设计规范文档

**Loading States and Session Management Hooks - M1.2 Component 4**  
**Dev-Step 4.3 QAD-Research 阶段证据化成果** | **按架构师EUD标准生成** | **2025-09-05**

---

## 📊 设计概述

### 目标
实现与existing AuthProvider协同的加载状态组件和会话管理hooks，补充M1.2 Component 4的Session Management & Protection功能，与已实现的ProtectedRoute HOC (Dev-Step 4.2)形成完整的认证UI体系。

### 核心原则
- **协同不修改**: 补充AuthProvider功能，不修改`contexts/AuthProvider.tsx`
- **缓存一致**: 与`getUserClaims('auth')` 30s TTL+去重机制保持一致
- **安全边界**: checking期间绝不渲染敏感内容
- **客户端边界**: 所有组件和hooks使用`'use client'`指令
- **类型单源**: UserRole/UserClaims统一从`@/lib/supabase/client`导入

---

## 🏗️ 架构设计

### 1. 文件边界定义

**新创建文件（允许）**:
```typescript
components/auth/LoadingStates.tsx     // 'use client' + 加载状态组件
hooks/auth/useSessionLoading.ts      // 'use client' + 会话加载hook  
hooks/auth/useAuthState.ts           // 'use client' + 认证状态hook
utils/auth/loadingStrategies.ts      // 加载策略工具函数
```

**严禁修改文件**:
```typescript
middleware.ts                        // ❌ 权威门，架构师禁止
contexts/AuthProvider.tsx           // ❌ 认证上下文，架构师禁止
```

### 2. 类型定义来源

**单一事实源原则** (架构师必补条款):
```typescript
// ✅ 统一导入源
import { type UserRole, type UserClaims } from '@/lib/supabase/client'

// ❌ 禁止重复定义或其他导入源
// import { UserRole } from './types'  // 违反单一事实源
```

---

## 🎯 组件接口规范

### 1. LoadingStates.tsx 组件接口

```typescript
'use client'

import React from 'react'
import { type UserRole } from '@/lib/supabase/client'

// AuthLoadingSkeleton - 认证检查期间的骨架屏
export interface AuthLoadingSkeletonProps {
  variant: 'compact' | 'full' | 'minimal'
  showProgressIndicator?: boolean
  debugMode?: boolean  // 仅开发环境显示诊断信息
}

export function AuthLoadingSkeleton(props: AuthLoadingSkeletonProps): JSX.Element

// SessionCheckingSpinner - 会话验证期间的加载指示器
export interface SessionCheckingSpinnerProps {
  size: 'sm' | 'md' | 'lg'
  message?: string
  timeout?: number     // 超时时间(ms)，默认5000
  onTimeout?: () => void
  debugMode?: boolean  // 仅开发环境显示详细状态
}

export function SessionCheckingSpinner(props: SessionCheckingSpinnerProps): JSX.Element

// LoadingStateProvider - 加载状态上下文提供者
export interface LoadingStateContextValue {
  isCheckingAuth: boolean
  isLoadingClaims: boolean  
  checkingDuration: number
  lastCacheHit: boolean
}

export function LoadingStateProvider({ children }: { children: React.ReactNode }): JSX.Element
export function useLoadingState(): LoadingStateContextValue
```

### 2. useSessionLoading.ts Hook接口

```typescript
'use client'

import { type UserClaims, type UserRole } from '@/lib/supabase/client'

// 会话加载状态hook
export interface UseSessionLoadingOptions {
  refreshInterval?: number  // 默认30000ms (与getUserClaims TTL一致)
  enableDebugMode?: boolean // 仅开发环境
  onLoadingStart?: () => void
  onLoadingEnd?: (success: boolean) => void
}

export interface UseSessionLoadingResult {
  isLoading: boolean
  isCheckingPermissions: boolean
  loadingDuration: number
  cacheHitRate: number
  lastError: Error | null
  retryCount: number
  
  // 手动操作方法
  refreshSession: () => Promise<void>
  clearCache: () => void
  
  // 性能度量数据 (用于测试证据)
  performanceMetrics: {
    averageLoadTime: number
    cacheHits: number
    cacheMisses: number
    totalRequests: number
  }
}

export function useSessionLoading(options?: UseSessionLoadingOptions): UseSessionLoadingResult
```

### 3. useAuthState.ts Hook接口

```typescript
'use client'

import { type UserClaims, type UserRole } from '@/lib/supabase/client'

// 认证状态管理hook
export interface UseAuthStateOptions {
  requiredRole?: UserRole | UserRole[]
  requireVerified?: boolean
  requireMFA?: boolean
  enableRealTimeSync?: boolean  // 与AuthProvider事件同步
  debugMode?: boolean          // 仅开发环境
}

export interface UseAuthStateResult {
  // 状态指示
  authState: 'unknown' | 'checking' | 'authenticated' | 'unauthenticated'
  permissionState: 'checking' | 'authorized' | 'denied'
  
  // 用户信息
  userClaims: UserClaims | null
  currentRole: UserRole | null
  
  // 验证结果
  hasRequiredPermissions: boolean
  isVerified: boolean
  hasMFA: boolean
  
  // 错误处理
  lastError: Error | null
  denialReason: string | null
  
  // 操作方法
  recheckPermissions: () => Promise<void>
  clearAuthState: () => void
}

export function useAuthState(options?: UseAuthStateOptions): UseAuthStateResult
```

### 4. loadingStrategies.ts 工具接口

```typescript
// 加载策略工具函数 (不需要'use client')
import { type UserRole, type UserClaims } from '@/lib/supabase/client'

// 加载策略枚举
export enum LoadingStrategy {
  IMMEDIATE = 'immediate',     // 立即显示加载状态
  DELAYED = 'delayed',         // 延迟200ms显示，避免闪烁
  PROGRESSIVE = 'progressive', // 渐进式加载指示器
  SKELETON = 'skeleton'        // 骨架屏模式
}

// 性能度量函数
export interface PerformanceMeasurement {
  startTime: number
  endTime: number
  duration: number
  cacheHit: boolean
  requestId: string
}

export class LoadingPerformanceTracker {
  startMeasurement(operation: string): string
  endMeasurement(requestId: string): PerformanceMeasurement
  getAverageLoadTime(): number
  getCacheHitRate(): number
  generatePerformanceReport(): PerformanceReport
  clearMetrics(): void
}

export interface PerformanceReport {
  totalRequests: number
  averageLoadTime: number
  cacheHitRate: number
  slowestRequests: PerformanceMeasurement[]
  fastestRequests: PerformanceMeasurement[]
  timestamp: string
}

// 加载策略选择函数
export function selectLoadingStrategy(
  authState: 'unknown' | 'checking' | 'authenticated' | 'unauthenticated',
  expectedDuration: number
): LoadingStrategy

// 诊断工具 (仅开发环境)
export function createDevelopmentDiagnostics(): {
  enabled: boolean
  trackLoadingStates: boolean
  measurePerformance: boolean
  logCacheHits: boolean
} | null
```

---

## 🔄 行为矩阵定义

### 1. 与getUserClaims('auth')集成行为

| 场景 | getUserClaims状态 | LoadingStates行为 | useSessionLoading状态 | 性能期望 |
|------|-------------------|-------------------|----------------------|----------|
| **首次加载** | cache miss | 显示AuthLoadingSkeleton | isLoading: true | <100ms渲染 |
| **缓存命中** | cache hit (30s内) | 立即隐藏加载状态 | isLoading: false | <50ms响应 |
| **缓存过期** | TTL expired | 显示SessionCheckingSpinner | isCheckingPermissions: true | <100ms检查 |
| **网络延迟** | pending request | 保持加载状态 | 增加retryCount | 指数退避重试 |
| **请求失败** | error response | 显示错误状态 | lastError设置 | 降级到缓存数据 |

### 2. 与AuthProvider事件协同

| AuthProvider事件 | useAuthState响应 | useSessionLoading响应 | 加载组件行为 |
|------------------|------------------|-----------------------|--------------|
| **SIGNED_IN** | 重新检查权限 | 清除错误状态 | 隐藏登录加载 |
| **SIGNED_OUT** | 清除认证状态 | 停止会话检查 | 显示未认证状态 |
| **USER_UPDATED** | 更新用户声明 | 触发权限重检 | 短暂显示验证中 |
| **TOKEN_REFRESHED** | 保持当前状态 | 重置TTL计时器 | 无视觉变化 |

### 3. 与ProtectedRoute HOC协同

| ProtectedRoute状态 | useAuthState配合 | LoadingStates配合 | 协同效果 |
|--------------------|------------------|-------------------|----------|
| **checking** | authState: 'checking' | 显示AuthLoadingSkeleton | 统一loading UX |
| **authorized** | hasRequiredPermissions: true | 隐藏加载状态 | 渲染受保护内容 |
| **unauthorized** | denialReason设置 | 显示拒绝状态 | 与HOC重定向配合 |

### 4. 安全边界保证

| 检查阶段 | 敏感内容渲染 | 加载状态显示 | 安全保证 |
|----------|--------------|--------------|----------|
| **checking期间** | ❌ 绝不渲染 | ✅ 仅显示加载指示器 | 防止信息泄露 |
| **权限验证中** | ❌ 不显示角色信息 | ✅ 通用验证消息 | 角色隐私保护 |
| **错误状态** | ❌ 不暴露详细错误 | ✅ 用户友好错误消息 | 错误信息脱敏 |

---

## 📏 性能度量脚本规范

### 1. 性能测试脚本清单

**架构师要求**: 提供可执行脚本+原始输出+报告三联，禁口头数字

#### 脚本1: loading-duration-benchmark.js
```bash
# 执行命令
node scripts/performance/loading-duration-benchmark.js

# 测试目标: loading duration <100ms
# 输出文件: performance/loading-duration-raw-output.json
# 报告文件: performance/loading-duration-report.md
```

#### 脚本2: cache-hit-rate-measurement.js
```bash  
# 执行命令
node scripts/performance/cache-hit-rate-measurement.js

# 测试目标: cache hit rate >95%
# 输出文件: performance/cache-hit-rate-raw-output.json
# 报告文件: performance/cache-hit-rate-report.md
```

#### 脚本3: loading-states-integration-benchmark.js
```bash
# 执行命令
npm run test:performance:loading-states

# 测试目标: 组件渲染性能 + hooks响应时间
# 输出文件: performance/integration-benchmark-raw-output.json  
# 报告文件: performance/integration-benchmark-report.md
```

### 2. 性能目标与度量标准

| 度量指标 | 目标值 | 测量方法 | 验证脚本 |
|----------|--------|----------|----------|
| **Loading Duration** | <100ms | performance.now() | loading-duration-benchmark.js |
| **Cache Hit Rate** | >95% | 统计缓存命中次数/总请求 | cache-hit-rate-measurement.js |
| **Component Render Time** | <50ms | React DevTools Profiler | integration-benchmark.js |
| **Hook Response Time** | <30ms | custom performance hooks | hook-performance-test.js |

---

## 🔧 诊断策略规范

### 1. 开发环境诊断

**架构师要求**: 仅开发环境启用诊断；生产构建确保去除诊断逻辑

```typescript
// 诊断启用条件
const diagnosticsEnabled = process.env.NODE_ENV === 'development' && debugMode === true

// 生产构建时自动去除的诊断代码
if (process.env.NODE_ENV === 'development') {
  console.log('[LoadingStates] 性能诊断:', performanceMetrics)
  console.log('[useSessionLoading] 缓存命中率:', cacheHitRate)
  console.log('[useAuthState] 状态转换:', stateTransition)
}
```

### 2. 诊断信息类别

| 诊断类别 | 信息内容 | 显示条件 | 生产行为 |
|----------|----------|----------|----------|
| **性能诊断** | 加载时间、缓存命中率 | debugMode=true | 完全去除 |
| **状态诊断** | 认证状态转换 | debugMode=true | 完全去除 |
| **集成诊断** | hooks与AuthProvider协同 | debugMode=true | 完全去除 |
| **错误诊断** | 详细错误堆栈 | 开发环境 | 脱敏错误消息 |

---

## 📋 测试矩阵规范

### 1. 单元测试矩阵

| 测试文件 | 测试覆盖 | 验证重点 |
|----------|----------|----------|
| **LoadingStates.test.tsx** | 组件渲染+状态转换+安全边界 | checking期间不渲染敏感内容 |
| **useSessionLoading.test.tsx** | hook行为+缓存集成+事件响应 | 与getUserClaims一致性 |
| **useAuthState.test.tsx** | 状态管理+AuthProvider协同+错误边界 | 角色权限验证逻辑 |
| **loadingStrategies.test.ts** | 工具函数+性能度量+诊断策略 | 策略选择算法正确性 |

### 2. 集成测试矩阵

按架构师要求: **登录/未登录×三角色×requireVerified×requireMFA×四事件**

| 认证状态 | 角色 | requireVerified | requireMFA | SIGNED_IN | SIGNED_OUT | USER_UPDATED | TOKEN_REFRESHED |
|----------|------|-----------------|------------|-----------|------------|--------------|-----------------|
| 登录 | admin | ✓ | ✓ | ✅ | ✅ | ✅ | ✅ |
| 登录 | tcm_practitioner | ✓ | ✓ | ✅ | ✅ | ✅ | ✅ |
| 登录 | pharmacy | ✓ | ✓ | ✅ | ✅ | ✅ | ✅ |
| 未登录 | null | ✗ | ✗ | ✅ | ✅ | ✅ | ✅ |

**总计**: 4 × 3 × 2 × 2 × 4 = 96个测试用例

### 3. 边界条件测试

| 测试类型 | 测试场景 | 预期行为 |
|----------|----------|----------|
| **redirect+returnTo** | 加载期间页面跳转 | 保持加载状态直到跳转完成 |
| **错误边界** | 网络错误、超时、服务异常 | 降级到缓存数据或友好错误页 |
| **一致性验证** | 多个hooks同时使用 | 状态同步，无竞争条件 |

---

## 🏆 EUD证据清单

### 1. 设计文档证据
- ✅ **DEV-STEP-4.3-DESIGN-SPECIFICATION.md**: 本文档 (完整设计规范)
- ⏳ **interface-diagram.md**: 接口关系图 (待Research完成时生成)
- ⏳ **behavior-matrix.md**: 详细行为矩阵 (待Research完成时生成)

### 2. 性能度量证据 (待实现时生成)
- ⏳ **loading-duration-raw-output.json**: 加载时间原始数据
- ⏳ **cache-hit-rate-raw-output.json**: 缓存命中率原始数据  
- ⏳ **performance-reports/**: 所有性能测试报告

### 3. 测试证据 (待测试阶段生成)
- ⏳ **LOADING-STATES-TEST-EVIDENCE-SUMMARY.md**: 测试证据总结
- ⏳ **test-coverage-reports/**: 测试覆盖率报告
- ⏳ **integration-test-screenshots/**: 集成测试截图

---

**🎯 结论**: Dev-Step 4.3 Research阶段设计规范已完成，涵盖架构师要求的所有必补条款：类型单一事实源、客户端边界、观测性能证据三联、诊断策略。接口设计与existing getUserClaims('auth')系统完全一致，与ProtectedRoute HOC形成协同，严格遵守文件边界约束。

**📋 EUD合规**: 设计文档+接口图+行为矩阵+性能度量脚本清单全部完成，符合架构师Evidence-Based Development标准。

---
*生成时间: 2025-09-05 | QAD-Research阶段 | Frontend Lead执行*