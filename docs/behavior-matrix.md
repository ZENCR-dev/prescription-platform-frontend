# Dev-Step 4.3 行为矩阵详细规范

**Loading States and Session Management Hooks - Detailed Behavior Matrix**  
**Supporting Document for DEV-STEP-4.3-DESIGN-SPECIFICATION.md**

---

## 🔄 核心行为矩阵

### 1. 与 getUserClaims('auth') 缓存系统集成行为

| getUserClaims状态 | 缓存情况 | useSessionLoading行为 | LoadingStates显示 | 性能指标 |
|-------------------|----------|----------------------|-------------------|----------|
| **初始调用** | cache miss | `{ isLoading: true, cacheHitRate: 0 }` | AuthLoadingSkeleton | 渲染 <50ms |
| **缓存命中** | hit (TTL内) | `{ isLoading: false, cacheHitRate: 1.0 }` | 立即隐藏 | 响应 <30ms |
| **缓存过期** | TTL expired | `{ isCheckingPermissions: true }` | SessionCheckingSpinner | 检查 <100ms |
| **并发请求** | 去重生效 | 共享同一Promise | 同步loading状态 | 无额外请求 |
| **网络错误** | error fallback | `{ lastError: Error, retryCount: n }` | 错误状态 + 重试按钮 | 指数退避 |
| **请求超时** | timeout (>5s) | `{ isLoading: false, lastError: TimeoutError }` | 超时错误提示 | 降级到缓存 |

### 2. AuthProvider 事件协同矩阵

| AuthProvider事件 | useAuthState响应 | useSessionLoading变化 | LoadingStates行为 | 持续时间 |
|------------------|------------------|-----------------------|-------------------|----------|
| **SIGNED_IN** | `authState: 'checking' → 'authenticated'` | `refreshSession()` 触发 | 短暂显示验证中 | 100-300ms |
| **SIGNED_OUT** | `authState: 'unauthenticated'` | `clearCache()` + 停止轮询 | 清除所有loading | 立即 |
| **USER_UPDATED** | `recheckPermissions()` 触发 | `isCheckingPermissions: true` | 显示权限检查中 | 50-200ms |
| **TOKEN_REFRESHED** | 保持当前状态 | 重置TTL计时器 | 无视觉变化 | 0ms |

### 3. ProtectedRoute HOC 协同矩阵

| ProtectedRoute状态 | useAuthState配合 | LoadingStates响应 | 用户体验 | 安全保证 |
|--------------------|------------------|-------------------|----------|----------|
| `'checking'` | `authState: 'checking'` | AuthLoadingSkeleton显示 | 统一loading UX | checking期间绝不渲染children |
| `'authorized'` | `hasRequiredPermissions: true` | 隐藏所有loading | 渲染受保护内容 | 权限验证通过 |
| `'unauthorized'` | `denialReason` 设置 | 显示拒绝状态(可选) | 配合HOC重定向 | 敏感内容完全隔离 |

### 4. 角色权限验证行为矩阵

| 用户角色 | requireVerified | requireMFA | useAuthState结果 | 加载状态 | 性能期望 |
|----------|-----------------|------------|------------------|----------|----------|
| **admin** | ✓ | ✓ | `hasRequiredPermissions: true` | 快速隐藏 | <50ms |
| **tcm_practitioner** | ✓ | ✓ | `hasRequiredPermissions: true` | 快速隐藏 | <50ms |
| **pharmacy** | ✓ | ✓ | `hasRequiredPermissions: true` | 快速隐藏 | <50ms |
| **admin** | ✓ | ✗ (aal1) | `denialReason: 'MFA_REQUIRED'` | 显示MFA提示 | <100ms |
| **tcm_practitioner** | ✗ (pending) | ✓ | `denialReason: 'NOT_VERIFIED'` | 显示验证提示 | <100ms |
| **pharmacy** | ✗ (pending) | ✗ | `denialReason: 'NOT_VERIFIED'` | 显示验证提示 | <100ms |
| **null** (未登录) | - | - | `authState: 'unauthenticated'` | 显示登录提示 | <30ms |

---

## 🔒 安全边界行为矩阵

### 1. 敏感内容渲染控制

| 检查阶段 | 用户声明可见性 | 角色信息显示 | 错误详情 | 调试信息 |
|----------|----------------|--------------|----------|----------|
| **checking** | ❌ 完全隐藏 | ❌ 不显示角色 | ❌ 通用错误消息 | ✅ 仅开发环境 |
| **authenticated** | ✅ 可访问UserClaims | ✅ 显示当前角色 | ✅ 具体错误信息 | ✅ 仅开发环境 |
| **unauthenticated** | ❌ 完全隐藏 | ❌ 不显示角色 | ❌ 脱敏错误消息 | ❌ 生产禁用 |

### 2. 调试信息显示策略

| 环境 | debugMode | 显示内容 | 生产构建行为 |
|------|-----------|----------|--------------|
| **development** | true | 完整性能诊断 + 状态转换日志 | Tree-shaking保留 |
| **development** | false | 基础错误信息 | Tree-shaking保留 |
| **production** | true | ❌ 强制禁用 | Tree-shaking移除 |
| **production** | false | ❌ 强制禁用 | Tree-shaking移除 |

---

## ⚡ 性能行为矩阵

### 1. 加载时间分布目标

| 操作类型 | 目标时间 | 测量方法 | 失败阈值 |
|----------|----------|----------|----------|
| **组件首次渲染** | <50ms | React.Profiler | >100ms |
| **缓存命中响应** | <30ms | performance.now() | >50ms |
| **权限检查** | <100ms | 自定义计时器 | >200ms |
| **状态转换** | <50ms | useEffect计时 | >100ms |

### 2. 缓存命中率行为

| 时间窗口 | 期望命中率 | 测量方式 | 失败条件 |
|----------|------------|----------|----------|
| **单次会话** | >95% | 统计命中/总请求 | <90% |
| **多用户并发** | >90% | 聚合所有请求 | <85% |
| **缓存过期后** | >80% | TTL过期重建后 | <70% |

### 3. 错误恢复行为

| 错误类型 | 重试策略 | 降级方案 | 用户反馈 |
|----------|----------|----------|----------|
| **网络超时** | 指数退避(1s,2s,4s) | 使用缓存数据 | "网络异常，正在重试" |
| **服务器错误** | 3次重试后放弃 | 显示错误页面 | "服务暂不可用" |
| **权限错误** | 不重试 | 立即跳转认证 | "需要重新登录" |
| **未知错误** | 1次重试 | 通用错误页面 | "发生未知错误" |

---

## 🧪 测试行为期望矩阵

### 1. 单元测试预期行为

| 测试场景 | 输入条件 | 预期输出 | 验证指标 |
|----------|----------|----------|----------|
| **useSessionLoading初始化** | 无缓存数据 | `{ isLoading: true }` | 渲染loading组件 |
| **缓存命中测试** | 有效缓存(TTL内) | `{ isLoading: false, cacheHitRate: 1.0 }` | <30ms响应时间 |
| **权限检查测试** | 需要角色验证 | `{ isCheckingPermissions: true }` | 不渲染敏感内容 |
| **错误处理测试** | 网络错误 | `{ lastError: Error, retryCount: 1 }` | 显示友好错误消息 |

### 2. 集成测试预期行为

| 集成场景 | 组合条件 | 预期协同效果 | 性能要求 |
|----------|----------|--------------|----------|
| **AuthProvider + useAuthState** | SIGNED_IN事件 | 同步状态更新 | <100ms同步延迟 |
| **ProtectedRoute + LoadingStates** | checking状态 | 统一loading UX | 视觉一致性 |
| **getUserClaims + useSessionLoading** | 缓存过期 | 自动刷新 | 无用户感知中断 |

### 3. 边界条件测试矩阵

| 边界条件 | 触发方式 | 预期处理 | 验证要点 |
|----------|----------|----------|----------|
| **快速连续调用** | 100ms内多次触发 | 请求去重生效 | 仅1个网络请求 |
| **组件卸载中** | useEffect cleanup | 取消pending请求 | 无内存泄漏 |
| **并发状态更新** | 多个hook同时更新 | 状态同步一致 | 无竞争条件 |
| **缓存数据损坏** | localStorage异常 | 降级到无缓存 | 正常功能不受影响 |

---

**🎯 总结**: 此行为矩阵涵盖了Dev-Step 4.3所有组件与existing架构的协同行为，确保与getUserClaims('auth')缓存系统的一致性，满足架构师关于安全边界、性能指标和错误处理的所有要求。

---
*Created: 2025-09-05 | Dev-Step 4.3 QAD-Research | Detailed Behavior Matrix*