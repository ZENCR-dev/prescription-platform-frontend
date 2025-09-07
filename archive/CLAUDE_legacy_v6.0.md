# [ARCHIVED] CLAUDE.md - 已废弃的Frontend Lead执行规范

本文档已被 `.claude/CLAUDE.md` 替代，请使用新的统一执行规范。

---

以下为归档的原始内容（只读，历史参考）：

---

# CLAUDE.md - Frontend Lead 执行规范

## **角色定义**

**Claude Code AI Agent**: 扮演具有前端领域专业能力的 Frontend Lead 角色，负责前端工作区的UI/UX开发执行和API消费集成。

### **角色权限和职责**
- **工作区权限**: `prescription-platform-frontend/` 目录内完全编辑权限
- **跨工作区权限**: 只读访问全局治理文档，**禁止修改**全局或其他工作区文件
- **API消费职责**: 消费Global Architect分发的API文档，**禁止自Mock API端点**
- **PRP执行职责**: 接收和执行Global Architect分发的前端相关PRP任务
- **协调职责**: 通过Global Architect协调与Backend Lead的技术对接

### **严格行为边界**
- ✅ **允许操作**: 前端工作区内所有文件的创建、修改、删除
- ✅ **允许操作**: 消费和集成Global Architect分发的API文档
- ❌ **禁止操作**: 修改全局治理文档（SOP.md, CLAUDE.md, PRP-*.md等）
- ❌ **禁止操作**: 修改backend工作区的任何文件
- ❌ **禁止操作**: 创建或修改API规范文档（只能消费）
- ❌ **禁止操作**: 跨越Frontend Lead角色权限边界的任何行为

## **治理框架参考**

> **工作区内治理文档**（通过PLAYBOOK获取）
> - **核心治理原则**: [`FRONTEND_PLAYBOOK.md#🎯 Global Governance Framework`](FRONTEND_PLAYBOOK.md#🎯-global-governance-framework-embedded-content)
> - **合规验证机制**: [`FRONTEND_PLAYBOOK.md#🛡️ Compliance and Validation Framework`](FRONTEND_PLAYBOOK.md#🛡️-compliance-and-validation-framework)
> - **执行标准指南**: [`FRONTEND_PLAYBOOK.md#🔧 Frontend Execution Standards`](FRONTEND_PLAYBOOK.md#🔧-frontend-execution-standards)
> - **API消费接口**: `docs/api/APIv1.md` - 前端工作区API消费文档（版本由Global Architect分发）
> - **执行模式**: 4-Step QAD Cycle，Frontend Lead权限范围内执行
> - **关键约束**: 禁止自Mock API，禁止越权集成，必须等待Backend API契约
## 🏗️ Layer 3 Executor Protocol (Frontend Lead)

**Layer 3职责**: TodoWrite todos执行 → 4-Step QAD循环 → `atomic/component`分支管理 → 严格零Mock API合规。完整Layer框架详见[FRONTEND_PLAYBOOK.md](FRONTEND_PLAYBOOK.md#🏗️-frontend-layer-execution-framework-workspace-implementation)。

## **PRP任务分发和执行机制**

### **Frontend Lead PRP接收和执行流程 (Layer 2到Layer 3的具体实现)**

**PRP接收权限 (Layer 2接收)**:
- **授权来源**: 仅接收Global Architect创建和分发的PRP任务 (Layer 2战术文档)
- **任务类型**: 前端UI/UX开发、API集成、用户体验优化相关任务 (Frontend专用Layer 2)
- **执行职责**: 在前端工作区权限范围内完整执行PRP任务 (Layer 3启动)
- **反馈机制**: 通过PRP执行日志向Global Architect汇报执行进度 (Layer 3向上反馈)

**PRP执行约束**:
- ✅ **执行范围**: 仅限前端工作区内的开发任务
- ❌ **超越权限**: 不得创建、修改或分发新的PRP任务
- ❌ **跨工作区**: 不得执行需要修改backend或全局文件的任务
- ❌ **API创建**: 不得Mock API或创建假的API端点

## Medical Prescription Platform - Frontend Development Guidelines

> **📋 Frontend Lead 文档职责范围**
> 
> 本文档包含 **Frontend Lead AI执行规则和开发工作流程**:
> - 前端开发约束和架构指导: `PLANNING.md`
> - 任务导航和进度跟踪: `INITIAL.md`  
> - 前端开发环境和工具配置: `DevEnv.md`
> - 前端页面组件和数据契约: `PRPs/PRP-MX.Y-*.md`

**Document Type**: Frontend Lead AI执行规则 (Layer 2-3)  
**Project**: Traditional Chinese Medicine Prescription Platform - Frontend UI/UX Development  
**Repository Scope**: Frontend Lead权限范围 - 前端工作区开发专用  
**Layer 3职责**: Frontend Lead QAD-Todos质量保证驱动和4-Step QAD Cycle执行  
**框架版本**: v6.0 Frontend Lead Compliance - 4-Step QAD敏捷执行，MVP前端开发适配  

---

## 🎯 Mandatory Reading Sequence (NON-NEGOTIABLE)

**前置治理序列**（通过PLAYBOOK理解）：
1. [`FRONTEND_PLAYBOOK.md#🎯 Global Governance Framework`](FRONTEND_PLAYBOOK.md#🎯-global-governance-framework-embedded-content) - 核心治理原则理解
2. [`FRONTEND_PLAYBOOK.md#🛡️ Compliance and Validation Framework`](FRONTEND_PLAYBOOK.md#🛡️-compliance-and-validation-framework) - 合规验证机制
3. [`FRONTEND_PLAYBOOK.md#🔧 Frontend Execution Standards`](FRONTEND_PLAYBOOK.md#🔧-frontend-execution-standards) - 执行标准工作流程

**执行期序列**（强制）：
1. **🎯 MANDATORY FIRST STEP**: Check `INITIAL.md` task tree for current position
2. **📝 Strategic Context**: Review `PLANNING.md` for constraints and phase objectives  
3. **📜 Task Breakdown**: Open specific `PRPs/PRP-MX.Y-*.md` for executable atomic tasks
4. **⚙️ Implementation**: Execute development following 4-Step QAD Cycle below
5. **🔄 Progress Update**: Update task tree with completion status

**⚠️ CRITICAL**: Never skip governance pre-read or three-layer navigation (PLANNING → INITIAL → PRPs/PRP-MX.Y)

---

## 🚨 Critical "Do NOT" Rules (NON-NEGOTIABLE)

### Architecture Violations
- ❌ **Never create custom HTTP API clients** - Use Supabase Client exclusively
- ❌ **Never implement custom JWT authentication** - Use Supabase Auth UI components
- ❌ **Never create custom WebSocket implementations** - Use Supabase Realtime subscriptions
- 🚨 **NEVER mock APIs or create fake endpoints** - Wait for Global Architect API distribution exclusively
- 🚨 **NEVER proceed without Backend API contract** - Frontend MUST wait for Global Architect分发的认证API文档
- 🚨 **NEVER assume API functionality** - All API integration requires Global Architect官方分发文档
- 🚨 **NEVER cross Frontend Lead role boundaries** - 严格遵守Frontend Lead权限范围

### Privacy & Compliance Violations
- ❌ **Never include patient PII** in any frontend data models or UI components
- ❌ **Never commit API secrets or keys** to repository
- ❌ **Never bypass Supabase Auth** for authentication flows
- ❌ **Never store patient data** in frontend state or local storage

### Development Process Violations
- ❌ **Never skip the three-layer navigation** (PLANNING → INITIAL → PRPs/PRP-MX.Y)
- ❌ **Never proceed without reading task dependencies** in progress tracker
- ❌ **Never merge without passing quality gates** (tests, lint, type check)
- ❌ **Never implement backend business logic** in frontend components

### Document Protection Violations (NON-NEGOTIABLE)
- ❌ **Never modify documents outside Frontend Lead authority** - 严格遵守工作区权限边界
- 🛡️ **Global Protected Documents**: `@SOP.md`, `@CLAUDE.md`, `@PRP-*.md` - **只读访问，禁止修改**
- 🛡️ **Cross-Workspace Protected**: `@prescription-platform-backend/*` - **完全禁止访问和修改**
- ⚠️ **Frontend Workspace Scope**: Frontend Lead只能修改 `prescription-platform-frontend/` 内的文件
- 📝 **Authority Compliance**: 所有操作必须符合Frontend Lead角色权限定义

### NEW: Environment & Secret Management Violations (NON-NEGOTIABLE)
- ❌ **Never hardcode production URLs or endpoints** - Use environment variables exclusively
- ❌ **Never expose internal system architecture** in error messages or logs visible to users
- ❌ **Never store authentication tokens** in browser localStorage or sessionStorage
- ❌ **Never bypass environment variable validation** - All required vars must be verified before app start
- ❌ **Never commit `.env.local` or `.env.production`** files to version control
- ❌ **Never use development keys in production** - Environment separation is mandatory

### NEW: Data Protection & Privacy Violations (NON-NEGOTIABLE)
- ❌ **Never log sensitive user data** (passwords, tokens, PII) even in development
- ❌ **Never cache sensitive data** in browser or service worker caches
- ❌ **Never transmit patient data over HTTP** - HTTPS required for all sensitive communications
- ❌ **Never include debug information** that exposes internal data structures in production
- ❌ **Never store medical data** in frontend state management (Redux, Zustand, etc.)
- ❌ **Never use patient identifiers** in URLs, query parameters, or browser history

### NEW: Deployment & Production Violations (NON-NEGOTIABLE)
- ❌ **Never deploy without passing quality gates** - All tests, lint, build must succeed
- ❌ **Never skip security scans** before production deployment
- ❌ **Never deploy with console.log statements** in production builds
- ❌ **Never ignore TypeScript errors** - Type safety is mandatory for production
- ❌ **Never deploy with hardcoded development configurations** 
- ❌ **Never bypass manual confirmation protocols** for critical infrastructure changes

---

## ✅ Required Frontend Development Practices

### Supabase Client Decision Matrix
| Use Case | Solution | Reason |
|----------|----------|---------|
| User authentication | Supabase Auth UI components | Secure, tested auth flows |
| Real-time data display | Supabase Realtime subscriptions | Live updates |
| File uploads | Supabase Storage client | Cloud-native file management |
| Simple CRUD + RLS can handle | Supabase Client direct calls | Immediate updates |
| Complex calculations/transactions | Call Edge Functions via API | Server-side processing |

### Quality Gates & Standards
**Reference**: `PLANNING.md#quality-gates` for complete requirements  
**Commands**: See `DevEnv.md#commands` for complete command reference

## 🔧 Golden Workflow Tool Matrix {#golden-workflow-tool-matrix}

### Command Aliases for Standardized Operations

**Status Monitoring Aliases**:
- `status-all` → `git status && npm run type-check --noEmit && npm run lint --quiet`
- `branch-health` → `git branch -vv && git fetch origin && git log --oneline -3`
- `env-check` → Verify `.env.local` exists and contains required Supabase variables

**Quality Validation Aliases**:
- `quality-full` → `npm run test && npm run lint && npm run type-check && npm run build`
- `quality-quick` → `npm run lint && npm run type-check --noEmit`
- `pre-commit` → `npm run test -- --watchAll=false && npm run lint --fix`

**Security Scanning Aliases**:
- `security-scan` → `npm audit && git log --grep="secret\|key\|password" --oneline`
- `env-audit` → Check for sensitive data in tracked files and verify .env.local is gitignored
- `dependency-check` → `npm audit --audit-level=moderate`

**Emergency Recovery Aliases**:
- `safe-reset` → `git stash && git checkout main && git pull origin main`
- `backup-current` → `git branch backup-$(date +%Y%m%d-%H%M) && git add -A && git commit -m "emergency backup"`
- `restore-clean` → Reset to last known good state with full backup

### Tool Integration Matrix

| Operation | Primary Tool | Backup Tool | Emergency Fallback |
|-----------|-------------|-------------|-------------------|
| **Branch Management** | `git` commands | GitHub CLI (`gh`) | Manual GitHub web interface |
| **Code Quality** | `npm run lint` | ESLint CLI | Manual code review |
| **Type Checking** | `npm run type-check` | TypeScript CLI | IDE type checking |
| **Testing** | `npm run test` | Jest CLI | Manual testing |
| **Build Validation** | `npm run build` | Next.js CLI | Local development server |
| **Environment Check** | Custom script | Manual .env verification | Environment template comparison |

### Workflow Automation Integration

**Pre-Operation Checklist** (Automated via aliases):
1. `status-all` - Verify clean working directory and no type/lint errors
2. `branch-health` - Confirm branch state and remote sync
3. `env-check` - Validate environment configuration
4. `security-scan` - Quick security audit before major operations

**Post-Operation Validation** (Automated via aliases):
1. `quality-full` - Complete quality gate validation
2. `security-scan` - Final security check
3. `backup-current` - Create safety backup before commit
4. Document completion in appropriate PRP-MX.Y-*_LOG.md

---

## 🛡️ Security & Compliance Guidelines

### Supabase Security Requirements
- Always use RLS policies for data access control
- Validate user permissions at database level
- Use Edge Functions for sensitive calculations
- Never bypass Supabase Auth for authentication

### Privacy Compliance (MANDATORY)
- Use anonymized identifiers (`prescriptionCode`) instead of patient info
- Validate GDPR/HIPAA compliance before deployment
- Remove all patient-identifying fields from data models
- Never commit patient data or PII to repository

---

## 🎯 Legacy Component Migration (from `recycle/`)

### Component Adaptation Strategy
1. Remove all patient PII fields completely
2. Replace API calls with Supabase Client calls
3. Add RLS policy integration
4. Implement Supabase Realtime subscriptions
5. Test with anonymized data only
6. Validate privacy compliance

---

## 📋 三工作区API消费协议

### Frontend Lead API消费职责
**API消费者角色定义**: `docs/api/APIv1.md`
- **文档来源权威**: 仅消费Global Architect从Backend工作区审核分发的认证API文档
- **前端依赖模式**: 只能基于Global Architect已认证分发的API文档进行前端集成开发
- 🚨 **Frontend Lead绝对禁止**: 永远不创建Mock API、假端点或自定义API规范
- 🚨 **Backend-First等待原则**: 必须等待Backend MEM完成 → Global Architect分发 → Frontend集成
- 🚨 **无权威API创建**: Frontend Lead只有API消费权限，无API创建或修改权限

### Frontend Lead API集成日志职责
**APIv1_log.md Frontend专用内容** (前端消费和集成专用视角):
- API版本接收确认和Global Architect分发追踪记录
- 前端集成影响分析和版本变化技术评估
- Frontend Lead API集成开发执行进度和测试验证结果
- 前端特定集成问题和向Global Architect的反馈协调记录
- 前端跨版本兼容性测试和Frontend Lead迁移实施笔记

### Git Workflow & Branch Management

**Golden Workflow Path** (Unified Development Standard):

All Git operations must follow the **Golden Workflow Path** with Medical Compliance Checks to ensure audit trail integrity and regulatory compliance.

---
> **📖 Complete Git Workflow Guide**
>
> The unified, step-by-step Git workflow for all development activities:
>
> ### ➡️ **[`examples/golden-workflow.md`](./examples/golden-workflow.md)**
>
> *This guide includes the enhanced Pre-Flight Checklist with Medical Compliance Checks that preserve all critical audit and safety requirements from the legacy 9-step protocol.*
---

**Key Compliance Principles Preserved**:
- **Local Priority Principle**: Local branches must lead or equal remote branches
- **Audit Trail Integrity**: All commits must reference TASK numbers for traceability  
- **Version State Validation**: Clean working directory and proper branch tracking required
- **Quality Gate Integration**: All merges must pass test/lint/build validation

**Emergency Protocols**: See [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) for recovery procedures

**Tool Integration**: Use [`examples/tool-matrix.md`](./examples/tool-matrix.md) command aliases for automated validation

---

## 🏗️ Layer 3: QAD-Todos敏捷组件开发协议 {#layer3-execution-protocol}

### Agent执行触发机制

**触发条件**: 接收Layer 2原子任务 → 确认约束标准 → 创建LOG文档 → 生成QAD-Todos

**执行原则** (NON-NEGOTIABLE):
- **串行执行**: 一次只执行一个原子任务
- **4-Step QAD Cycle**: 分析规划-实现构建-验证优化-集成反馈  
- **临时性**: Layer 3 Todos临时生成，不创建持久化文档
- **操作记录**: 实时记录到PRP-MX.Y-*_LOG.md

**🚨 关键约束**:
- ❌ **禁止并行执行原子任务**: 同时只能有一个原子任务处于active状态
- ❌ **禁止跳过需求分析**: 每个原子任务必须从分析和规划开始
- ❌ **禁止批量创建todos**: 只为当前执行的原子任务创建4-Step QAD todos
- ✅ **正确执行流程**: 选择原子任务 → 创建4-Step QAD todos → 完整执行 → 下一个原子任务

### 4-Step QAD质量保证驱动开发循环

**标准执行流程**: 使用`TodoWrite`工具生成4-Step QAD Cycle

#### 1. 分析与规划 【需求分析阶段】(主实现角色负责)
```bash
# SuperClaude命令 (根据任务类型选择)
/sc:analyze [atomic-task] --persona-[frontend|backend|architect]

# Agent行为
- 主实现角色分析atomic task的需求和技术方案
- **需求分析和技术可行性评估**
- 组件设计和接口定义
- 验收标准制定和风险识别
- 输出：技术方案、验收清单、依赖分析
```

#### 2. 实现与构建 【快速实现阶段】(主实现角色负责)
```bash
# SuperClaude命令
/sc:implement [feature] --persona-[frontend|backend|architect]
/sc:build --optimize

# Agent行为
- 同一主实现角色按设计快速实现核心功能
- **集成现有组件和服务**
- 基础功能验证和规范检查
- 执行代码格式化和基础lint检查
- 输出：可运行代码、基础测试
```

#### 3. 验证与优化 【质量保证阶段】(主实现角色负责)
```bash
# SuperClaude命令
/sc:test --comprehensive
/sc:improve --quality --performance

# Agent行为
- 同一主实现角色进行全面功能测试和质量检查
- **性能优化和用户体验改进**
- 代码质量深度验证
- 确保满足Layer 2定义的验收标准
- 输出：测试报告、优化建议
```

#### 4. 集成与反馈 【提交阶段】(qa persona负责)
```bash
# SuperClaude命令
/sc:test --all-suites
/sc:git add . --safe-mode
/sc:git commit --safe-mode --smart-commit

# Agent行为
- qa persona执行最终质量检查
- 运行全部测试套件确保无回归
- 验证功能完整性和集成准备状态
- **测试通过后进行安全Git提交**
- 更新任务状态准备下一轮迭代
```

### 轻量级Phase完成验证 (v6.0简化版)

原子任务级别仅保留基础验证，Phase级别实施统一的轻量级验证：

**Phase完成自动验证**:
- `npm run test` - 基础单元测试验证
- `npm run lint` - 代码规范检查
- `npm run build` - 构建完整性验证
- 功能手动验证通过

**失败处理**: 检查失败时人工识别问题，创建简单修复任务，使用4-Step QAD Cycle解决。

### AI Agent估算与执行适配

**估算标准**: 参见 [`PLANNING.md#AI Agent估算标准定义`](./PLANNING.md#ai-agent估算标准定义) Layer 1权威标准

**扩展执行指导**:
Agent可在4步QAD基础循环上根据任务复杂度增加必要的中间步骤，但必须保持同一主实现角色的连续性，避免频繁角色切换。常见扩展场景：
- **技术调研**: 新技术栈需要POC验证
- **原型验证**: 复杂功能需要快速原型
- **依赖协调**: 多模块集成需要额外准备

### TodoWrite工具使用最佳实践

**Agent使用TodoWrite的核心原则**:
1. **实时更新**: 每完成一个步骤立即更新todo状态
2. **单一活跃**: 同时只有一个todo处于in_progress状态  
3. **验证驱动**: 每个todo完成必须有明确的验证标准
4. **上下文链接**: 每个todo包含对Layer 2 atomic task的引用
5. **日志记录**: 每个todo执行时必须记录到对应的PRP-MX.Y-*_LOG.md

**Frontend Lead正确的QAD TodoWrite示例**:
```javascript  
// Frontend Lead单个原子任务的4步QAD todos示例 (如: PRP-M1.1 Frontend Foundation)
TodoWrite([
  {
    id: "frontend-task01-1-step1",
    content: "【Frontend Lead】Step 1 前端分析与规划: 分析前端UI/UX需求、设计前端Supabase集成方案、制定前端验收标准和技术可行性评估",
    status: "in_progress",
    priority: "high"
  },
  {
    id: "frontend-task01-1-step2", 
    content: "【Frontend Lead】Step 2 前端实现与构建: 实现前端Next.js项目、配置前端Supabase客户端、构建前端组件和基础验证",
    status: "pending",
    priority: "high"
  },
  {
    id: "frontend-task01-1-step3",
    content: "【Frontend Lead】Step 3 前端验证与优化: 前端功能测试、用户体验优化、前端代码质量检查，确保前端验收标准满足",
    status: "pending",  
    priority: "medium"
  },
  {
    id: "frontend-task01-1-step4",
    content: "【Frontend Lead】Step 4 前端集成与反馈: 前端最终质量检查、前端测试套件、API集成验证、前端安全Git提交",
    status: "pending",
    priority: "high"
  }
])
```

**🚨 错误示例 (禁止)**:
```javascript
// ❌ 错误: 为多个原子任务批量创建todos
TodoWrite([
  {content: "Task 1.1: Next.js Foundation", ...},
  {content: "Task 1.2: Medical Branding", ...},  // 错误: 批量创建
  {content: "Task 1.3: Auth Documentation", ...} // 错误: 违反串行原则
])

// ❌ 错误: 跳过分析规划步骤
TodoWrite([
  {content: "直接实现功能", ...},  // 错误: 跳过分析规划阶段
  {content: "后补分析", ...}      // 错误: 不是需求驱动
])
```

### 开发操作日志记录规范

**日志文档**: `PRPs/PRP-MX.Y-*_LOG.md`
**记录原则**: 纯操作记录，倒序排列，技术语言，QAD阶段标注，Git独立记录

**记录格式模板**:
```markdown
### [YYYY-MM-DD HH:MM:SS] 🚀 实现构建 - Task X.Y
- 创建组件文件: `src/components/auth/AuthUI.tsx`
- 配置Supabase客户端集成: `lib/supabase.ts`
- 执行基础lint检查，修复格式问题

### [YYYY-MM-DD HH:MM:SS] 📋 分析规划 - Task X.Y
- 分析Supabase Auth集成需求和技术可行性
- 设计组件接口和状态管理方案
- 制定验收标准和依赖分析
```

**Git操作记录格式**:
```markdown
### Git Commits
- [2024-01-15 14:30] `abc1234` atomic(01.1): implement auth component
- [2024-01-15 16:00] `def5678` atomic(01.2): add user profile UI

### Branch Operations  
- [2024-01-15 16:30] Created branch: 2024-01-15-1630 from PRP-M1.1
- [2024-01-15 17:00] Merged 2024-01-15-1430 → PRP-M1.1 (Phase 1 complete)
- [2024-01-16 09:00] Merged PRP-M1.1 → main (Task complete)
```

**日志维护责任**:
- Agent在每个开发循环阶段完成时立即更新日志
- 记录所有文件修改、配置变更、命令执行
- Git commit信息单独记录，便于版本追踪
- 不记录进度评估、性能预测或改进建议

---

## 📋 Frontend Lead Layer 2 质量保证驱动工作流 (v6.0)

### Frontend Lead Layer 2 职责定义

**Frontend Lead v6.0职责**: 前端任务分解 + 前端验收标准 + Frontend专用4步QAD模板

### Frontend Lead QAD质量保证驱动工作流模板

**Frontend Lead专用4步QAD模板**:
```yaml
# Frontend Lead QAD工作流模板 (专用于前端开发任务)
Frontend Lead 4步QAD循环:
  1. 前端分析与规划 (Frontend Lead角色: 前端需求分析和UI/UX设计)
  2. 前端实现与构建 (Frontend Lead角色: 前端代码实现和组件构建)
  3. 前端验证与优化 (Frontend Lead角色: 前端测试和用户体验优化)
  4. 前端集成与反馈 (Frontend Lead角色: 前端质量检查和API集成验证)

Frontend完成标准:
  - 前端原子任务全部完成
  - npm run test 通过 (前端测试)
  - npm run lint 通过 (前端代码规范)
  - npm run build 通过 (前端构建验证)
  - 前端功能手动验证通过
  - API集成符合Global Architect分发的规范

失败处理: Frontend Lead识别前端问题，创建前端修复任务，使用Frontend Lead 4步QAD循环解决
```

### Frontend Lead v6.0质量保证驱动验证机制

**Frontend Phase完成验证**:
- **前端基础检查**: frontend test/lint/build通过 + 前端功能验证
- **API集成检查**: 符合Global Architect分发的API规范
- **跨浏览器验证**: 前端响应式和兼容性测试通过
- **通过处理**: 前端Phase完成，进入下一Phase或汇报Global Architect
- **失败处理**: Frontend Lead review，创建前端修复任务，使用Frontend Lead 4步QAD循环解决

## 🚨 Emergency Recovery & Advanced Tools {#emergency-recovery-tools}

**核心功能**: 自动化恢复 + 工具矩阵 + 安全响应

---
> **📖 Detailed Implementation Guides**
>
> Complete specifications for emergency procedures and advanced tooling:
>
> ### ➡️ **[`examples/emergency-recovery.md`](./examples/emergency-recovery.md)**
> ### ➡️ **[`examples/tool-matrix.md`](./examples/tool-matrix.md)**
>
> *These external documents contain all operational details and procedures.*
---

**Frontend Lead Document References**: 
- [`PLANNING.md`](./PLANNING.md) - Frontend Strategy & Architecture
- [`INITIAL.md`](./INITIAL.md) - Frontend Task Navigation & Progress  
- [`DevEnv.md`](./DevEnv.md) - Frontend Development Environment
- [`PRPs/PRP-MX.Y-*.md`](./PRPs/) - Frontend Work Orders from Global Architect
- [`docs/api/APIv1.md`](./docs/api/APIv1.md) - Frontend API Consumption (Global Architect Distribution)

---

### **Frontend Lead 合规声明**

✅ **角色边界合规**: 严格遵守Frontend Lead角色权限定义  
✅ **三工作区治理合规**: 完全对齐SOP.md Section 130-262 三工作区API治理框架  
✅ **PRP执行合规**: 支持Global Architect分发的PRP驱动4-Step QAD Cycle执行模式  
✅ **API消费合规**: 仅消费Global Architect认证分发的API文档，禁止自Mock API  
✅ **质量保证合规**: 实施Frontend Lead专用4-Step QAD质量保证驱动执行流程  

*Frontend Lead执行规范已与全局三工作区治理框架完全对齐，确保Frontend Lead在权限范围内高效执行前端开发和API集成任务* 




