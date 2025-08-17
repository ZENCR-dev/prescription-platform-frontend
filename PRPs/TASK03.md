# TASK03.md - Authentication System Migration
## Complete Migration from Custom JWT to Supabase Auth

**Task Category**: Authentication & Security  
**Phase**: Week 2 - Foundation Setup  
**Priority**: Critical (Enables all user-based features)  
  
### AI Agent估算
- **步骤数量**: 24步
- **代码文件**: 8个文件
- **迭代轮次**: 3轮
- **复杂度**: 高  
**Prerequisites**: TASK02 completed successfully  
**Backend Coordination**: AUTH integration patterns and session management

---

## 🎯 Task Objectives

Complete migration from custom JWT authentication to Supabase Auth with privacy-compliant user management, guest mode integration, and authentication component adaptation.

### User Stories Served
- **US6**: As a developer, I want JWT authentication eliminated so the codebase uses secure Supabase Auth
- **US7**: As a user, I want reliable authentication so I can securely access platform features
- **US8**: As a medical practitioner, I want role-based access appropriate for my professional context
- **US9**: As a privacy-conscious user, I want guest mode so I can use the platform without full registration
- **US10**: As a system administrator, I want RLS policies so user data is properly isolated

### Success Criteria
- [ ] All custom JWT authentication code eliminated (zero references remaining)
- [ ] Supabase Auth fully integrated with user profiles and role management
- [ ] Guest mode system operational with anonymous sessions
- [ ] Authentication components adapted for Supabase compatibility  
- [ ] RLS policies validated with real user sessions
- [ ] Privacy-compliant user registration and login flows functional

---

## 🔧 统一3+1工作流模板

### 标准3+1步骤序列
Step_1: 需求分析与设计 (主实现角色: backend)
  - 分析atomic task需求和技术方案
  - 设计实现路径和技术架构
  - 识别依赖关系和潜在风险
  - 确定验证标准和成功指标

Step_2: 实现与自测 (同一主实现角色: backend)
  - 完成功能实现
  - 编写基础单元测试确保功能正确
  - 执行代码格式化和基础lint检查
  - 满足验收标准

Step_3: 集成准备 (同一主实现角色: backend)
  - 准备集成环境
  - 验证与其他模块的接口兼容性
  - 准备集成所需的配置和文档
  - 确保代码符合项目约定和规范

Step_4: 质量验证与提交 (qa persona)
  - 执行基础质量检查
  - 运行单元测试和代码规范检查
  - 验证功能完整性和集成准备状态
  - 提交代码并更新任务状态

基础完成标准:
  - 所有原子任务完成
  - npm run test 通过
  - npm run lint 通过
  - npm run build 通过
  - 功能手动验证通过

失败处理: 人工识别问题，创建简单修复任务，使用3+1步骤解决

---

## 📋 Atomic Task Breakdown (3+1步骤模式)

### Task 3.1: Custom JWT Code Elimination
**User Story**: US6 - JWT authentication eliminated for secure Supabase Auth
**Deliverable**: Codebase completely free of custom JWT authentication code
**Dependencies**: None
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 0个文件
迭代轮次: 2轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 审计代码库中JWT相关模式
   - 识别所有JWT依赖位置
   - 制定删除策略
   
2. **实现与自测** (frontend persona)
   - 删除JWT签名/验证代码
   - 移除passport.js实现
   - 清理环境变量和依赖
   
3. **集成准备** (frontend persona) 
   - 验证无JWT引用残留
   - 确保应用编译通过
   
4. **质量验证与提交** (qa persona)
   - 代码库全面扫描
   - 依赖安全检查
   - Git提交: `refactor(auth): eliminate custom JWT authentication`

**SuperClaude Commands**:
```bash
/sc:analyze codebase --pattern "jwt|JWT|jsonwebtoken" --comprehensive
/sc:refactor remove-jwt --safe-mode --validate
/sc:test --type security --no-jwt
/sc:git --smart-commit --type refactor
```

**Requirements**:
- Audit entire codebase for JWT-related code patterns
- Remove all custom JWT signing and verification logic
- Eliminate JWT middleware and passport.js implementations
- Remove JWT secret environment variables
- Update package.json to remove JWT dependencies
- Verify no JWT references remain in any file

**Acceptance Criteria**:
- [ ] Zero references to jsonwebtoken, jwt.sign, jwt.verify in codebase
- [ ] No JWT_SECRET or Bearer token handling in environment files
- [ ] All passport.js and custom session middleware removed
- [ ] Package.json contains no JWT-related dependencies
- [ ] Comprehensive audit confirms complete JWT elimination
- [ ] All authentication-related localStorage calls updated

### Task 3.2: Supabase Auth Client Integration
**User Story**: US7 - Reliable authentication through Supabase Auth service
**Deliverable**: Complete Supabase Auth client setup with user profile management
**Dependencies**: Task 3.1 completed
**AI Agent Estimation**:
```yaml
步骤数量: 7步
代码文件: 4个文件
迭代轮次: 3轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 设计认证上下文架构
   - 规划用户配置管理
   - 定义会话管理策略
   
2. **实现与自测** (frontend persona)
   - 配置Supabase客户端
   - 创建React认证上下文
   - 实现辅助函数
   
3. **集成准备** (frontend persona)
   - 验证用户配置创建
   - 测试会话持久化
   
4. **质量验证与提交** (qa persona)
   - 认证流程测试
   - 角色管理验证
   - Git提交: `feat(auth): integrate Supabase Auth client`

**SuperClaude Commands**:
```bash
/sc:design auth-context --framework react --supabase
/sc:implement supabase-auth --with-profiles --roles
/sc:test auth-flows --all-roles
```

**Requirements**:
- Configure Supabase client with authentication settings
- Create authentication context provider for React application
- Implement user profile creation and management
- Set up session management with auto-refresh tokens
- Configure authentication state persistence
- Create auth helper functions for common operations

**Acceptance Criteria**:
- [ ] Supabase client configured with proper auth settings
- [ ] React authentication context provider functional
- [ ] User profile creation works for all roles (practitioner, pharmacy, admin)
- [ ] Session management handles token refresh automatically
- [ ] Authentication state persists across browser sessions
- [ ] Auth helper functions available for user operations

### Task 3.3: Guest Mode and Anonymous Authentication
**User Story**: US9 - Guest mode for privacy-conscious users without full registration
**Deliverable**: Anonymous authentication system integrated with Supabase
**Dependencies**: Task 3.2 completed
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 3个文件
迭代轮次: 2轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 设计匿名认证流程
   - 规划访客身份管理
   - 定义升级路径
   
2. **实现与自测** (frontend persona)
   - 实现匿名认证
   - 创建访客模式UI
   - 配置访客会话管理
   
3. **集成准备** (frontend persona)
   - 验证隐私合规性
   - 测试升级流程
   
4. **质量验证与提交** (qa persona)
   - 匿名会话测试
   - 隐私保护验证
   - Git提交: `feat(auth): implement guest mode authentication`

**SuperClaude Commands**:
```bash
/sc:design guest-mode --privacy-compliant
/sc:implement anonymous-auth --supabase
/sc:validate privacy --guest-sessions
```

**Requirements**:
- Implement Supabase anonymous authentication
- Create guest user profile management
- Configure anonymous session handling
- Set up guest mode UI components and workflows
- Implement guest-to-registered user upgrade path
- Establish privacy compliance for anonymous sessions

**Acceptance Criteria**:
- [ ] Anonymous authentication functional through Supabase
- [ ] Guest profiles created automatically for anonymous users
- [ ] Guest mode accessible from authentication pages
- [ ] Guest sessions properly managed and isolated
- [ ] Guest-to-registered upgrade workflow operational
- [ ] Privacy compliance verified for anonymous sessions

### Task 3.4: Authentication Component Adaptation
**User Story**: US8, US10 - Role-based access and RLS policy integration
**Deliverable**: Authentication components fully adapted for Supabase with RLS validation
**Dependencies**: Task 3.3 completed
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 3个文件
迭代轮次: 2轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 分析现有组件适配需求
   - 设计RLS集成方案
   - 规划RBAC UI实现
   
2. **实现与自测** (frontend persona)
   - 适配GuestModeGuard
   - 更新withAuth HOC
   - 创建登录/注册页面
   
3. **集成准备** (frontend persona)
   - 验证RLS策略
   - 测试角色权限
   
4. **质量验证与提交** (qa persona)
   - 组件功能测试
   - RLS策略验证
   - Git提交: `feat(auth): adapt components for Supabase and RLS`

**SuperClaude Commands**:
```bash
/sc:adapt components --auth-supabase
/sc:implement auth-pages --login --register
/sc:test rls-policies --all-components
```

**Requirements**:
- Adapt GuestModeGuard component for Supabase auth state
- Update withAuth HOC for Supabase compatibility
- Create login and registration page components
- Implement role-based access control UI
- Validate RLS policies work with authentication flows
- Test authentication components with real user sessions

**Acceptance Criteria**:
- [ ] GuestModeGuard works with Supabase authentication state
- [ ] withAuth HOC properly wraps components with auth requirements
- [ ] Login page functional with error handling and validation
- [ ] Registration page supports role selection and profile creation
- [ ] Role-based access control properly restricts UI elements
- [ ] RLS policies tested and validated with authenticated users

---

## 🚨 Backend Coordination Requirements

**Authentication Integration**: Coordination required for AUTH patterns and session management
- Frontend uses Supabase Auth for all authentication flows
- Backend uses same Supabase project for user validation
- Coordinate RLS policy implementation across teams
- Establish user profile schema and role definitions

**Coordination Timing**: After Task 3.2 completion (Supabase Auth integration)
**Responsible Party**: Frontend provides auth integration patterns, Backend confirms RLS policies
**Completion Criteria**: Both teams can authenticate and authorize users using shared Supabase auth

---

## ✅ Completion Criteria

### Migration Validation Requirements
- [ ] All 4 atomic tasks completed and validated
- [ ] Complete JWT code elimination verified through codebase audit
- [ ] Supabase Auth integration fully functional
- [ ] Guest mode and anonymous authentication operational
- [ ] Authentication components adapted and tested

### Security and Privacy Gates
- [ ] RLS policies prevent cross-user data access
- [ ] User sessions properly isolated and managed
- [ ] Privacy compliance verified for all authentication flows
- [ ] Role-based access control functional
- [ ] Authentication state management reliable across browser sessions
- [ ] Guest mode maintains privacy compliance

---

## ✅ 轻量级Phase完成验证

### 基础检查
- npm run test 通过
- npm run lint 通过  
- npm run build 通过
- 功能手动验证通过

### 通过处理
- 直接进入下一Phase

### 失败处理
- 人工review，创建修复任务，使用3+1步骤解决

---

**Task Dependencies**: TASK02 (Shared Supabase Project Setup)  
**Next Task**: TASK04 (Data Model & RLS Implementation)  
**Critical Success Factor**: Complete JWT elimination with secure Supabase Auth replacement  
**Security Requirement**: 100% RLS policy coverage with user session validation
**Branch Strategy**: `feature/task03-auth-migration` → `main`