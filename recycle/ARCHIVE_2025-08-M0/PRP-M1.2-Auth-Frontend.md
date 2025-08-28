---
# --- 架构师定义区 (由PRP_GENERATION_PLAN自动生成) ---
title: "PRP-M1.2: 认证UI集成模块"
layer: "Layer 2 - 战术规划"
log_file: "PRPs/LOGS/LOG-PRP-M1.2-Auth-Frontend.md"
milestone: "M1: 核心处方创建闭环"
owner: "Frontend Team"
depends_on: ["M1.1"]
unlocks: "M1.3: 处方核心模块"
engineering_units:
  components: 3
  dev_steps: ~10
  files: ~4
module_exit_criteria:
  - "受保护路由/会话持久化可用"
  - "禁止自定义JWT/HTTP客户端；使用Supabase Client"
  - "登录/登出/受保护页回归用例通过"
---

## 模块目标
# ... (由架构师定义) ...

## 模块出厂门 (MEM)
# ... (由架构师定义) ...

---
## **[工程师自主规划区]**

### 阶段一：Supabase Auth UI集成
- **阶段目标**: 集成Supabase Auth UI组件，实现完整的登录/注册界面和基础认证流程
- **阶段验收标准**: 
  - Supabase Auth UI组件在Storybook中正确渲染和交互
  - 登录/注册表单能正确处理输入验证和错误显示
  - 基础认证状态管理(logged in/out)功能正常
  - 认证组件符合医疗平台设计系统规范

#### 原子任务1.1: Supabase Auth UI组件配置
- **描述**: 配置和集成Supabase Auth UI组件库，创建符合项目设计系统的认证界面组件
- **验收标准**: 
  - `@supabase/auth-ui-react`和`@supabase/auth-ui-shared`正确安装和配置
  - Auth UI组件使用项目统一的shadcn/ui主题样式
  - 支持邮箱/密码登录和第三方OAuth provider集成 **[具体provider列表TBD: Awaiting Final APIv1.md from M1.1]**
  - 组件在Storybook中有完整的交互演示

#### 原子任务1.2: 认证页面路由集成
- **描述**: 创建`/auth/login`和`/auth/register`页面，集成Supabase Auth UI组件并实现页面路由
- **验收标准**:
  - Next.js App Router中正确配置认证相关路由
  - 登录页面集成Supabase Auth UI登录组件
  - 注册页面集成Supabase Auth UI注册组件
  - 页面支持Guest模式和认证模式的切换导航
  - 页面符合响应式设计标准(移动端兼容)

### 阶段二：认证状态管理与会话持久化
- **阶段目标**: 实现基于Supabase的认证状态管理系统，确保会话持久化和实时状态同步
- **阶段验收标准**:
  - Zustand store正确管理认证状态和用户信息
  - Supabase session能正确持久化和自动恢复
  - 认证状态变更能实时响应和更新UI
  - 支持token自动刷新和安全logout

#### 原子任务2.1: Zustand认证状态Store设计
- **描述**: 设计和实现基于Zustand的认证状态管理store，集成Supabase session管理
- **验收标准**:
  - `useAuthStore` hook提供完整的认证状态管理功能
  - Store状态包含`user`, `session`, `isLoading`, `isAuthenticated`字段
  - 提供`login`, `logout`, `refreshSession`等action方法
  - 集成Supabase `onAuthStateChange`监听器实现实时状态同步
  - Store状态变更时自动更新相关UI组件

#### 原子任务2.2: Session持久化与自动恢复
- **描述**: 实现Supabase session的持久化存储和应用启动时的自动恢复机制
- **验收标准**:
  - 利用Supabase Client内置的session持久化机制
  - 应用初始化时自动检查和恢复有效session
  - 支持跨浏览器tab的session同步
  - **[具体session刷新策略和超时处理TBD: Awaiting Final APIv1.md from M1.1]**

### 阶段三：路由守卫与权限控制
- **阶段目标**: 实现基于认证状态的路由保护系统，确保未认证用户无法访问受保护页面
- **阶段验收标准**:
  - `withAuth` HOC能正确保护需要认证的页面和组件
  - 未认证访问自动重定向到登录页面
  - Guest模式和认证模式路由规则正确执行
  - 路由守卫与现有GuestModeGuard系统无冲突集成

#### 原子任务3.1: withAuth HOC重构为Supabase Auth
- **描述**: 重构现有的`withAuth.tsx`高阶组件，替换自定义JWT验证为Supabase Auth集成
- **验收标准**:
  - 完全移除对localStorage JWT token的依赖
  - 使用`supabase.auth.getSession()`进行认证状态检查
  - 未认证用户自动重定向到`/auth/login`
  - 保持现有HOC接口兼容性，最小化对现有代码的影响
  - 支持认证加载状态显示和错误处理

#### 原子任务3.2: 受保护路由配置与测试
- **描述**: 配置需要认证的页面路由，实现路由级别的权限控制
- **验收标准**:
  - 明确定义需要认证的路由列表:`/doctor/*`, `/admin/*`, `/pharmacy/*`
  - Guest模式允许的路由保持不变:`/`, `/prescription/create`, `/auth/*`
  - 路由守卫能正确处理直接URL访问和程序化导航
  - 实现完整的E2E测试覆盖认证流程和路由保护
  - **[具体用户权限和角色路由映射TBD: Awaiting Final APIv1.md from M1.1]**

### 阶段四：认证集成测试与错误处理
- **阶段目标**: 实现完整的认证系统集成测试，确保错误处理和用户体验优化
- **阶段验收标准**:
  - 所有认证相关功能通过E2E测试验证
  - 网络错误和API异常有友好的用户提示
  - 认证失败场景有清晰的错误信息和恢复指导
  - 系统在离线/在线状态切换时行为正确

#### 原子任务4.1: 认证错误处理与用户提示
- **描述**: 实现全面的认证错误处理机制和用户友好的错误提示系统
- **验收标准**:
  - 网络连接错误时显示离线状态提示和重试机制
  - **[具体API错误码处理逻辑TBD: Awaiting Final APIv1.md from M1.1]**
  - 认证超时时自动提示用户重新登录
  - 使用Toast组件显示认证相关的成功/错误消息
  - 错误信息支持中英文国际化显示

#### 原子任务4.2: E2E认证流程测试
- **描述**: 使用Playwright实现完整的认证流程端到端测试
- **验收标准**:
  - 测试覆盖完整的登录->受保护页面访问->登出流程
  - 测试Guest模式到认证模式的转换流程
  - 测试未认证用户访问受保护页面的重定向行为
  - 测试session过期和自动刷新机制
  - 所有认证相关测试在CI/CD环境中稳定通过

### 总体验收标准
- **功能完整性**: 认证UI、状态管理、路由守卫三大核心功能完全可用
- **Supabase集成**: 完全基于Supabase Auth，零自定义JWT/HTTP客户端
- **测试覆盖**: E2E测试覆盖率>90%，单元测试覆盖率>95%
- **代码质量**: TypeScript严格模式，ESLint零警告，符合项目代码规范
- **用户体验**: 认证流程流畅，错误处理友好，响应式设计兼容
- **依赖准备**: 为M1.3处方核心模块提供完整的认证基础设施

---
## 版本控制策略 (Version Control Strategy)
- task分支：`task/M1.2-auth-frontend`
- atomic分支：`atomic/M1.2.1-auth-pages`

---
## Layer 3 执行说明
> 日志与时间戳: 记录至 `log_file`；时间戳使用 `date '+%Y-%m-%d %H:%M:%S'`。


