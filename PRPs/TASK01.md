# TASK01.md - Frontend Foundation Setup
## Complete Next.js + Supabase Starter Kit with Medical Platform Branding

**Task Category**: Frontend Foundation & Development Environment  
**Phase**: Week 1 - Foundation Setup  
**Priority**: Critical (Enables all subsequent frontend development)  
### AI Agent估算
- **步骤数量**: 30步
- **代码文件**: 15个文件
- **迭代轮次**: 3轮
- **复杂度**: 高  
**Prerequisites**: 完成 [🚀 开发前准备清单](#prerequisites) 和 [✅ 开发前自检验证](#pre-development-checklist)  
**Backend Coordination**: Shared Supabase project configuration  

---

## 🎯 Task Objectives

Establish a complete Next.js frontend foundation with Supabase integration, medical platform branding, and development environment ready for prescription platform development.

### User Stories Served
- **US1**: As a developer, I want a working Next.js + Supabase foundation so I can build medical platform UI
- **US2**: As a medical platform user, I want a branded interface that reflects prescription platform context  
- **US3**: As a backend developer, I want clear AUTH API contracts so I can coordinate with frontend team
- **US4**: As a developer, I want configured development environment so I can work efficiently
- **US5**: As a team member, I want Git workflow setup so I can manage code changes effectively

### Success Criteria
- [ ] Next.js 14 application running with Supabase client integration
- [ ] Medical platform branding and theme implemented
- [ ] Authentication UI components functional
- [ ] Development environment configured with compliance settings
- [ ] Git workflow operational with branch management
- [ ] AUTH API documentation prepared for backend coordination

---

## 🔧 统一3+1工作流模板

### 标准3+1步骤序列
```yaml
Step_1: 需求分析与设计 (主实现角色: frontend)
  - 分析atomic task需求和技术方案
  - 设计实现路径和技术架构
  - 识别依赖关系和潜在风险
  - 确定验证标准和成功指标

Step_2: 实现与自测 (同一主实现角色: frontend)
  - 完成功能实现
  - 编写基础单元测试确保功能正确
  - 执行代码格式化和基础lint检查
  - 满足验收标准

Step_3: 集成准备 (同一主实现角色: frontend)
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
```

---

## 🚀 开发前准备清单 {#prerequisites}

**⚠️ 重要提示**: 在开始执行任何原子任务之前，必须完成以下所有准备工作并通过自检验证。

### 必备账户与服务注册

#### 1. Supabase 后端服务（必需）
- **注册**: [https://supabase.com/dashboard](https://supabase.com/dashboard)
- **项目创建**: 创建新项目，等待数据库初始化完成
- **获取配置信息**:
  - 项目设置 → API → 复制项目URL和API密钥
  - `NEXT_PUBLIC_SUPABASE_URL`: `https://dosbevgbkxrtixemfjfl.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc2Jldmdia3hydGl4ZW1mamZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDcwMjEsImV4cCI6MjA2OTc4MzAyMX0.xDbE8E8Fg84109qRQi9SFbi4PPUtCTBL1-Jj2R80lmI` 
  - `SUPABASE_SERVICE_ROLE_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc2Jldmdia3hydGl4ZW1mamZsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDIwNzAyMSwiZXhwIjoyMDY5NzgzMDIxfQ.YP5G83U-qVWqqCuAcEHUxFCE7f7mAyxR4T2cA3fQe_Y` (服务端密钥，保密)

#### 2. GitHub 代码管理（必需）
- **GitHub账户**: https://github.com/ZENCR-dev
- **GitHub CLI安装**: 
  ```bash
  # macOS
  brew install gh
  # 认证
  gh auth login
  ```
- **验证访问权限**: `gh repo view https://github.com/ZENCR-dev/prescription-platform-frontend --web`

#### 3. Vercel 部署服务（推荐）
- **注册**: [https://vercel.com](https://vercel.com)
- **GitHub集成**: 连接GitHub账户用于自动部署
- **项目准备**: 后续用于生产环境部署

#### 4. Stripe 支付服务（TASK06需要，可预先准备）
- **注册**: [https://stripe.com](https://stripe.com)
- **获取测试密钥**: Dashboard → Developers → API keys
  - `STRIPE_SECRET_KEY`: `[从Stripe Dashboard获取测试密钥]`
  - `STRIPE_PUBLISHABLE_KEY`: `[从Stripe Dashboard获取公开密钥]`
- **Webhook配置**: 后续TASK06时配置

### 开发工具与环境

#### Node.js 环境（必需）
- **版本要求**: Node.js 18+ 和 npm/yarn/pnpm
- **验证安装**: 
  ```bash
  node --version  # 应显示 v18+ 
  npm --version   # 或 yarn/pnpm
  ```

#### Supabase CLI（必需）
```bash
# 安装方法1: Homebrew (推荐 for macOS)
brew install supabase/tap/supabase

# 安装方法2: npm
npm install supabase --save-dev

# 验证安装
supabase --version
```

#### 其他工具（可选但推荐）
- **VS Code扩展**: Supabase、Tailwind CSS IntelliSense、TypeScript
- **Stripe CLI**: 用于本地webhook测试（TASK06时安装）

### 环境变量配置模板

在项目根目录创建 `.env.local` 文件：
```env
# Supabase Configuration (必填)
NEXT_PUBLIC_SUPABASE_URL=https://dosbevgbkxrtixemfjfl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc2Jldmdia3hydGl4ZW1mamZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyMDcwMjEsImV4cCI6MjA2OTc4MzAyMX0.xDbE8E8Fg84109qRQi9SFbi4PPUtCTBL1-Jj2R80lmI
SUPABASE_SERVICE_ROLE_KEY=[待填写: 你的Supabase服务密钥]

# Stripe Configuration (TASK06需要，可预留)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[待填写: 你的Stripe公开密钥]
STRIPE_SECRET_KEY=[待填写: 你的Stripe私有密钥]
STRIPE_WEBHOOK_SECRET=[待填写: Stripe Webhook密钥]

# Vercel Configuration (部署时需要)
VERCEL_URL=[待填写: 部署域名]
```

### 医疗平台特殊要求

#### GDPR/HIPAA 合规性了解
- **零患者PII存储**: 前端绝不存储患者个人身份信息
- **数据匿名化**: 使用 `prescriptionCode` 等匿名标识符
- **隐私保护**: 所有敏感数据通过环境变量管理

#### 医疗术语和品牌规范
- **色彩方案**: 医疗级蓝绿色系，符合医疗行业标准
- **术语使用**: Traditional Chinese Medicine (TCM) 相关术语
- **可访问性**: 严格遵循 WCAG 2.1 AA 标准

---

## ✅ 开发前自检验证 {#pre-development-checklist}

**⚠️ 强制要求**: 必须完成所有检查项并确认 ✅ 才可开始 Task 1.1

### Phase 1: 基础环境验证
- [ ] **Node.js版本**: `node --version` 显示 v18.0.0 或更高
- [ ] **包管理器**: `npm --version` 或 `yarn --version` 正常运行
- [ ] **网络连通性**: 能够访问 https://supabase.com 和 https://github.com
- [ ] **项目目录**: 已在正确的项目目录中，Git初始化完成

### Phase 2: 账户与服务验证
- [ ] **Supabase项目**: 项目已创建，数据库状态为 "Ready"
- [ ] **Supabase连接测试**: 
  ```bash
  # 测试项目连接（需要先配置环境变量）
  curl -X GET 'https://dosbevgbkxrtixemfjfl.supabase.co/rest/v1/' \
       -H "apikey: YOUR_SUPABASE_ANON_KEY_HERE"
  # 应返回 {"message":"ok"} 或类似成功响应
  ```
- [ ] **GitHub CLI认证**: `gh auth status` 显示已登录状态
- [ ] **GitHub仓库访问**: `gh repo view` 能够正常访问项目仓库

### Phase 3: 配置文件验证
- [ ] **环境变量文件**: `.env.local` 文件已创建，包含所有必需的Supabase配置
- [ ] **环境变量有效性**: 所有 `[待填写]` 占位符已替换为实际值
- [ ] **密钥保密**: `.env.local` 已添加到 `.gitignore` 中
- [ ] **配置语法**: 环境变量格式正确，无语法错误

### Phase 4: 工具和权限验证
- [ ] **Supabase CLI**: `supabase --version` 正常输出版本信息
- [ ] **文件权限**: 对项目目录有读写权限
- [ ] **Git配置**: 用户名和邮箱已设置 (`git config user.name` 和 `git config user.email`)

### Phase 5: 前瞻性准备验证（可选但推荐）
- [ ] **Vercel账户**: 已注册，准备用于后续部署
- [ ] **Stripe账户**: 已注册（即使TASK06才用到，提前准备避免阻塞）
- [ ] **品牌素材**: 医疗平台logo、色彩规范等设计素材已准备

### ✅ 最终确认
- [ ] **所有Phase 1-4检查项**: 已全部完成并确认
- [ ] **准备状态确认**: 我已阅读并理解医疗平台的特殊要求（零PII、GDPR/HIPAA合规）
- [ ] **开发意识**: 我了解这是医疗处方平台，将严格遵循隐私和安全标准
- [ ] **文档理解**: 我已理解TASK01的5个原子任务和预期交付物

**🎯 准备完成标志**: 当所有上述检查项都标记为 ✅ 时，可以开始执行 Task 1.1: Next.js Starter Kit Foundation

---

## 📋 Atomic Task Breakdown

### Task 1.1: Next.js Starter Kit Foundation
**User Story**: US1 - Working Next.js + Supabase foundation for medical platform UI development
**Deliverable**: Functional Next.js 14 application with Supabase client integration
**Dependencies**: ✅ 开发前自检验证 全部完成
**AI Agent Estimation**:
```yaml
步骤数量: 8步
代码文件: 6个文件
迭代轮次: 3轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 分析Next.js 14项目架构需求
   - 设计Supabase客户端集成方案
   - 规划基础认证UI结构
   
2. **实现与自测** (frontend persona)
   - 初始化Next.js 14 + TypeScript项目
   - 安装配置Supabase客户端SDK
   - 创建基础认证页面和路由
   
3. **集成准备** (frontend persona) 
   - 验证Supabase客户端连接
   - 测试TypeScript编译通过
   - 准备生产构建配置
   
4. **质量验证与提交** (qa persona)
   - 功能验证测试
   - 构建性能检查
   - Git提交: `feat(foundation): setup Next.js 14 with Supabase integration`

**SuperClaude Commands**:
```bash
/sc:implement "Next.js foundation" --persona-frontend --next14 --supabase
/sc:test foundation --type integration --supabase-connection
/sc:git --smart-commit --foundation
```

**Acceptance Criteria**:
- [ ] Next.js application runs on localhost with no errors
- [ ] Supabase client successfully connects to project
- [ ] Basic authentication pages accessible
- [ ] TypeScript compilation passes
- [ ] Application builds for production

### Task 1.2: Medical Platform Branding
**User Story**: US2 - Branded interface reflecting prescription platform context
**Deliverable**: Customized UI with medical platform branding and WCAG compliance
**Dependencies**: Task 1.1 completed
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 3个文件
迭代轮次: 2轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 设计医疗平台主题方案
   - 规划品牌资产和UI元素
   - 制定WCAG 2.1 AA合规策略
   
2. **实现与自测** (frontend persona)
   - 创建医疗级色彩和排版系统
   - 实现响应式设计和无障碍功能
   - 更新页面元数据和医疗术语
   
3. **集成准备** (frontend persona) 
   - 验证品牌一致性应用
   - 测试无障碍功能完整性
   - 准备品牌资产优化
   
4. **质量验证与提交** (qa persona)
   - WCAG合规性验证
   - 跨设备响应式测试
   - Git提交: `feat(branding): implement medical platform theme and accessibility`

**SuperClaude Commands**:
```bash
/sc:design theme --medical --accessibility --wcag
/sc:implement branding --responsive --medical-theme
/sc:validate accessibility --wcag-aa --comprehensive
```

**Acceptance Criteria**:
- [ ] Medical theme applied consistently across application
- [ ] Accessibility validation passes WCAG 2.1 AA standards
- [ ] Responsive design functions on mobile and desktop
- [ ] Medical terminology used appropriately in UI copy
- [ ] Platform branding assets integrated and optimized

### Task 1.3: Authentication API Documentation
**User Story**: US3 - Clear AUTH API contracts for backend team coordination
**Deliverable**: Complete AUTH API documentation and TypeScript interfaces
**Dependencies**: Task 1.1 completed
**AI Agent Estimation**:
```yaml
步骤数量: 7步
代码文件: 4个文件
迭代轮次: 2轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 分析认证API需求和数据结构
   - 设计用户角色和权限模型
   - 规划错误处理和响应格式
   
2. **实现与自测** (frontend persona)
   - 创建TypeScript接口定义
   - 编写API端点文档
   - 实现模拟数据结构
   
3. **集成准备** (frontend persona) 
   - 验证接口完整性
   - 准备后端集成指南
   - 测试模拟实现可用性
   
4. **质量验证与提交** (qa persona)
   - 文档准确性检查
   - 接口一致性验证
   - Git提交: `docs(auth): add comprehensive API documentation and TypeScript interfaces`

**SuperClaude Commands**:
```bash
/sc:design auth-api --typescript --rbac --medical-roles
/sc:document api-contracts --comprehensive --backend-integration
/sc:validate interfaces --consistency --mock-data
```

**Acceptance Criteria**:
- [ ] AUTH API endpoints documented with request/response schemas
- [ ] TypeScript interfaces defined for all auth-related data
- [ ] Role definitions established (practitioner, pharmacy, admin, guest)
- [ ] Error handling patterns documented
- [ ] Backend integration guidelines prepared
- [ ] Mock implementations available for testing

### Task 1.4: Development Environment Configuration
**User Story**: US4 - Configured development environment for efficient work
**Deliverable**: Complete development environment with compliance settings
**Dependencies**: Task 1.1 completed
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 2个文件
迭代轮次: 2轮
复杂度: 中
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 分析环境配置需求
   - 设计多环境配置策略
   - 规划合规性验证机制
   
2. **实现与自测** (frontend persona)
   - 配置环境变量和安全设置
   - 实现GDPR/HIPAA合规验证
   - 设置性能监控和日志系统
   
3. **集成准备** (frontend persona) 
   - 验证环境切换功能
   - 测试合规性验证脚本
   - 准备环境文档
   
4. **质量验证与提交** (qa persona)
   - 环境配置完整性检查
   - 安全设置验证
   - Git提交: `config(env): setup development environment with compliance settings`

**SuperClaude Commands**:
```bash
/sc:config environment --multi-env --compliance --gdpr-hipaa
/sc:implement monitoring --performance --privacy-compliant
/sc:validate security --environment --comprehensive
```

**Acceptance Criteria**:
- [ ] Environment variables configured for dev/test/prod
- [ ] GDPR/HIPAA compliance validation active
- [ ] Privacy-compliant logging operational
- [ ] Security validation scripts functional
- [ ] Performance monitoring configured
- [ ] Environment switching tested and documented

### Task 1.5: Git Workflow Setup
**User Story**: US5 - Git workflow setup for effective code change management
**Deliverable**: GitHub CLI and branch workflow configured for SOP development
**Dependencies**: None (can run in parallel with other tasks)
**AI Agent Estimation**:
```yaml
步骤数量: 4步
代码文件: 2个文件
迭代轮次: 1轮
复杂度: 低
```

**3+1步骤执行**:
1. **需求分析与设计** (frontend persona)
   - 分析Git工作流需求
   - 设计分支策略和提交规范
   - 规划PR模板和审查流程
   
2. **实现与自测** (frontend persona)
   - 安装配置GitHub CLI
   - 创建分支工作流和提交钩子
   - 设置PR模板和验证脚本
   
3. **集成准备** (frontend persona) 
   - 测试分支创建和合并流程
   - 验证提交消息验证功能
   - 准备团队使用文档
   
4. **质量验证与提交** (qa persona)
   - 工作流完整性测试
   - 团队协作流程验证
   - Git提交: `config(git): setup GitHub CLI and team workflow`

**SuperClaude Commands**:
```bash
/sc:config git --github-cli --branch-strategy --pr-templates
/sc:implement workflow --commit-hooks --validation
/sc:test git-workflow --branch-merge --comprehensive
```

**Acceptance Criteria**:
- [ ] GitHub CLI authenticated and functional
- [ ] Feature branch workflow operational
- [ ] PR templates configured and tested
- [ ] Commit message validation active
- [ ] Branch creation and merge workflow tested
- [ ] Team workflow documentation complete

---

## 🚨 Backend Coordination Requirements

**Shared Supabase Project**: Coordination required for shared project configuration
- Frontend needs Supabase project URL and anonymous key
- Backend team needs same project for API development
- Coordinate environment variable sharing
- Establish AUTH flow integration approach

**Coordination Timing**: After Task 1.3 completion (AUTH API documentation)
**Responsible Party**: Frontend provides AUTH interface documentation, Backend confirms compatibility
**Completion Criteria**: Both teams can develop AUTH features independently with shared foundation

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

## ✅ Completion Criteria

### Task Validation Requirements
- [ ] All 5 atomic tasks completed and validated
- [ ] Next.js application operational with Supabase integration
- [ ] Medical platform branding implemented and accessible
- [ ] AUTH API documentation prepared for backend coordination
- [ ] Development environment configured for team use
- [ ] Git workflow functional for task-based development

### Quality Gates
- [ ] Application builds and runs without errors
- [ ] TypeScript compilation passes with strict mode
- [ ] Accessibility validation meets WCAG 2.1 AA standards
- [ ] Environment security settings validated
- [ ] Branch workflow tested end-to-end
- [ ] Backend coordination materials prepared

---

**Task Dependencies**: Node.js 18+ installation  
**Next Task**: TASK02 (Shared Supabase Project & AUTH Integration)  
**Critical Success Factor**: Complete foundation enables parallel frontend-backend development  
**Branch Strategy**: `feature/task01-starter-foundation`