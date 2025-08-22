# CLAUDE.md - Frontend AI Collaboration Rules

> 指南V3.2指针（只链接不复制）
> 执行阶段流程、4步循环的适用层级、并行白名单策略，统一以《指南V3.2》为准：
> `../Supabase-First架构下前后端协作与PRP生成指南V3.1.md` 中 1.5/1.6、2.0、4.2、4.3 的规定。
> - 组件级执行=4步ACD循环；禁止跨组件并行
> - PRP与Git强绑定（task/ 与 atomic/）按模板执行
## Medical Prescription Platform - Frontend Development Guidelines

> **📋 Document Purpose & References**
> 
> This document contains **AI execution rules and development workflows only**:
> - Strategic constraints & architecture: see `PLANNING.md`
> - Task navigation & progress: see `INITIAL.md`
> - Development environment/ports/CORS/commands: see `DevEnv.md`
> - Page/component/data contracts & acceptance: see `PRPs/TASK0x.md`

**Document Type**: AI Collaboration & Execution Rules (Layer 2-3)  
**Project**: Traditional Chinese Medicine Prescription Platform - Frontend UI/UX  
**Repository Scope**: Frontend Development Only  
**Layer 3职责**: Layer 3 ACD-Todos敏捷组件开发协议和4步执行模式  
**框架版本**: v6.0 Compliance - 4步ACD敏捷执行，MVP开发适配  

---

## 🎯 Mandatory Reading Sequence (NON-NEGOTIABLE)

1. **🎯 MANDATORY FIRST STEP**: Check `INITIAL.md` task tree for current position
2. **📝 Strategic Context**: Review `PLANNING.md` for constraints and phase objectives  
3. **📜 Task Breakdown**: Open specific `PRPs/TASK0X.md` for executable atomic tasks
4. **⚙️ Implementation**: Execute development following rules below
5. **🔄 Progress Update**: Update task tree with completion status

**⚠️ CRITICAL**: Never skip the three-layer navigation (PLANNING → INITIAL → PRPs/TASK)

---

## 🚨 Critical "Do NOT" Rules (NON-NEGOTIABLE)

### Architecture Violations
- ❌ **Never create custom HTTP API clients** - Use Supabase Client exclusively
- ❌ **Never implement custom JWT authentication** - Use Supabase Auth UI components
- ❌ **Never create custom WebSocket implementations** - Use Supabase Realtime subscriptions
- ❌ **Never mock APIs without backend approval** - Wait for `~/APIdocs/APIv1.md`

### Privacy & Compliance Violations
- ❌ **Never include patient PII** in any frontend data models or UI components
- ❌ **Never commit API secrets or keys** to repository
- ❌ **Never bypass Supabase Auth** for authentication flows
- ❌ **Never store patient data** in frontend state or local storage

### Development Process Violations
- ❌ **Never skip the three-layer navigation** (PLANNING → INITIAL → PRPs/TASK)
- ❌ **Never proceed without reading task dependencies** in progress tracker
- ❌ **Never merge without passing quality gates** (tests, lint, type check)
- ❌ **Never implement backend business logic** in frontend components

### Document Protection Violations (NON-NEGOTIABLE)
- ❌ **Never modify core project documents without explicit user authorization**
- 🛡️ **Protected Documents**: `@CLAUDE.md`, `@INITIAL.md`, `@PLANNING.md`, `@PRPs/TASK0X.md`
- ⚠️ **Authorization Required**: AI agents must receive explicit user instruction to modify protected documents
- 📝 **Scope**: This protection applies to all structural modifications, content changes, and deletions

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
4. Document completion in appropriate TASK0X_LOG.md

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

## 📋 Backend API Consumption Protocol

### API Documentation Requirements
**Single Source of Truth**: `~/APIdocs/APIv1.md`
- **Maintained by**: Backend development team
- **Frontend Dependency**: Cannot proceed with API integration without this documentation
- **No Self-Mocking**: Frontend must wait for official API specifications

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

## 🏗️ Layer 3: ACD-Todos敏捷组件开发协议 {#layer3-execution-protocol}

### Agent执行触发机制

**触发条件**: 接收Layer 2原子任务 → 确认约束标准 → 创建LOG文档 → 生成ACD-Todos

**执行原则** (NON-NEGOTIABLE):
- **串行执行**: 一次只执行一个原子任务
- **4步ACD循环**: 分析规划-实现构建-验证优化-集成反馈  
- **临时性**: Layer 3 Todos临时生成，不创建持久化文档
- **操作记录**: 实时记录到TASK0X_LOG.md

**🚨 关键约束**:
- ❌ **禁止并行执行原子任务**: 同时只能有一个原子任务处于active状态
- ❌ **禁止跳过需求分析**: 每个原子任务必须从分析和规划开始
- ❌ **禁止批量创建todos**: 只为当前执行的原子任务创建4步ACD todos
- ✅ **正确执行流程**: 选择原子任务 → 创建4步ACD todos → 完整执行 → 下一个原子任务

### 4步ACD敏捷开发循环

**标准执行流程**: 使用`TodoWrite`工具生成4步ACD循环

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

**失败处理**: 检查失败时人工识别问题，创建简单修复任务，使用4步ACD模式解决。

### AI Agent估算与执行适配

**估算标准**: 参见 [`PLANNING.md#AI Agent估算标准定义`](./PLANNING.md#ai-agent估算标准定义) Layer 1权威标准

**扩展执行指导**:
Agent可在4步ACD基础循环上根据任务复杂度增加必要的中间步骤，但必须保持同一主实现角色的连续性，避免频繁角色切换。常见扩展场景：
- **技术调研**: 新技术栈需要POC验证
- **原型验证**: 复杂功能需要快速原型
- **依赖协调**: 多模块集成需要额外准备

### TodoWrite工具使用最佳实践

**Agent使用TodoWrite的核心原则**:
1. **实时更新**: 每完成一个步骤立即更新todo状态
2. **单一活跃**: 同时只有一个todo处于in_progress状态  
3. **验证驱动**: 每个todo完成必须有明确的验证标准
4. **上下文链接**: 每个todo包含对Layer 2 atomic task的引用
5. **日志记录**: 每个todo执行时必须记录到对应的TASK0X_LOG.md

**正确的ACD TodoWrite示例**:
```javascript  
// 单个原子任务的正确4步ACD todos示例 (如: Task 1.1 Next.js Foundation)
TodoWrite([
  {
    id: "task01-1-step1",
    content: "【frontend persona】Step 1 分析与规划: 分析Next.js项目需求、设计Supabase集成方案、制定验收标准和技术可行性评估",
    status: "in_progress",
    priority: "high"
  },
  {
    id: "task01-1-step2", 
    content: "【frontend persona】Step 2 实现与构建: 快速实现Next.js项目、配置Supabase客户端、集成组件和基础验证",
    status: "pending",
    priority: "high"
  },
  {
    id: "task01-1-step3",
    content: "【frontend persona】Step 3 验证与优化: 全面功能测试、性能优化、代码质量检查，确保验收标准满足",
    status: "pending",  
    priority: "medium"
  },
  {
    id: "task01-1-step4",
    content: "【qa persona】Step 4 集成与反馈: 最终质量检查、运行测试套件、测试通过后安全Git提交",
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

**日志文档**: `PRPs/TASK0X_LOG.md`
**记录原则**: 纯操作记录，倒序排列，技术语言，ACD阶段标注，Git独立记录

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
- [2024-01-15 16:30] Created branch: 2024-01-15-1630 from TASK01
- [2024-01-15 17:00] Merged 2024-01-15-1430 → TASK01 (Phase 1 complete)
- [2024-01-16 09:00] Merged TASK01 → main (Task complete)
```

**日志维护责任**:
- Agent在每个开发循环阶段完成时立即更新日志
- 记录所有文件修改、配置变更、命令执行
- Git commit信息单独记录，便于版本追踪
- 不记录进度评估、性能预测或改进建议

---
## 📋 Layer 2 统一敏捷工作流定义 (v6.0简化版)

### Layer 2 职责简化定义

**v6.0职责**: 任务分解 + 验收标准 + 统一4步ACD模板

### 统一ACD敏捷工作流模板

**所有任务统一使用4步ACD模板**:
```yaml
# 统一ACD工作流模板 (适用于所有任务类型)
标准4步ACD循环:
  1. 分析与规划 (主实现角色: frontend/backend/architect)
  2. 实现与构建 (同一主实现角色)
  3. 验证与优化 (同一主实现角色)
  4. 集成与反馈 (qa角色)

基础完成标准:
  - 所有原子任务完成
  - npm run test 通过
  - npm run lint 通过
  - 功能手动验证通过

失败处理: 人工识别问题，创建简单修复任务，使用4步ACD循环解决
```

### v6.0敏捷验证机制

**Phase完成轻量级验证**:
- **基础检查**: test/lint/build通过 + 功能验证
- **通过处理**: 直接进入下一Phase
- **失败处理**: 人工review，创建修复任务，使用4步ACD循环解决

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

**Document References**: [`PLANNING.md`](./PLANNING.md) (Strategy) | [`INITIAL.md`](./INITIAL.md) (Navigation) | [`DevEnv.md`](./DevEnv.md) (Environment) | [`PRPs/TASK0x.md`](./PRPs/) (Tasks)

---

## 📚 Legacy Protocols (Deprecated)

*The following protocols are preserved for historical and compliance context but are superseded by the Golden Workflow Path.*

### Deprecated: 9-Step Mandatory Git Validation Protocol

**Historical Context**: This complex validation system was designed for maximum audit trail preservation but has been simplified into the Medical Compliance Checks in the Golden Workflow.

**三层Git工作流程** (与3+1步骤集成):

#### Pre-Operation Mandatory Validation (强制前置验证)
**Reference**: [`PLANNING.md#强制性分支操作协议`](./PLANNING.md) - Layer 1权威协议  
**执行时机**: 每次Git分支操作前强制执行  
**估算**: 9步验证流程 (3步本地检查 + 4步远程管理 + 2步执行验证)

```bash
# Step 1-3: 操作前强制验证 (Pre-Operation Validation)
git status                    # 步骤1: 验证工作目录清洁
git branch -vv               # 步骤1: 检查本地分支追踪状态
git fetch origin             # 步骤2: 获取最新远程状态
git log --oneline -10        # 步骤2: 对比本地与远程commit历史
# 步骤3: 确认本地分支领先或等同于远程分支 (本地优先原则)

# Step 4-7: 远程分支管理策略 (Remote Branch Management)
# 步骤4: 验证本地优先原则 - 禁止远程领先本地TASK分支
# 步骤5-6: 根据三层分支架构执行推送策略
# 步骤7: 监控分支健康状态和架构合规性

# Step 8-9: 操作执行与验证 (Operation Execution)
# 步骤8: 执行Git操作 (create/merge/push)
# 步骤9: 验证操作结果和更新状态追踪
```

#### Branch 3 (日期分支) - 原子任务级别
```bash
# 1. 执行强制前置验证 (9步协议)
# 参见上方Pre-Operation Mandatory Validation

# 2. 开始原子任务时创建分支
git checkout TASK01
git checkout -b 2024-01-15-1430
git push -u origin 2024-01-15-1430  # 立即建立远程追踪

# 3. 执行3+1步骤开发循环
# 步骤1-3: 测试设计、最小实现、重构优化
# 步骤4: 质量验证与提交
git add .
git commit -m "atomic(01.1): [step4-verified] implement auth component"
git push origin 2024-01-15-1430     # 推送原子任务进度
```

#### Branch 2 (TASK分支) - Phase级别
```bash
# 1. 执行强制前置验证 (9步协议)
# 验证TASK分支领先或等同于远程main分支

# 2. Phase完成时合并日期分支
git checkout TASK01
git merge 2024-01-15-1430 --no-ff
git branch -d 2024-01-15-1430       # 清理临时分支
git tag "TASK01-phase1"              # 标记Phase完成
git push origin TASK01               # 推送Phase级别进度
git push origin --tags               # 推送标签
```

#### Branch 1 (Main分支) - TASK文档级别  
```bash
# 1. 执行强制前置验证 (9步协议)  
# 确保main分支不领先于TASK分支 (版本一致性)

# 2. TASK文档完成时通过PR合并到main
# 使用GitHub PR替代直接合并，保持审查流程
# git checkout main
# git merge TASK01 --no-ff          # 生产环境改用PR流程
# git tag "TASK01-complete"
```

**Remote Branch Protection & Version Consistency**:
- **本地优先原则**: 本地分支必须始终领先或等同于对应远程分支
- **版本倒置检测**: 发现远程领先时立即暂停并分析原因
- **分支健康监控**: 定期检查分支同步状态和架构合规性
- **标准化冲突处理**: 使用git log分析分歧点和建立回滚机制

**质量验证与Git集成**:
- 第4步"质量验证与提交"必须包含Git commit操作
- 所有合并操作必须通过轻量级验证(test/lint/build)
- TodoWrite状态与Git分支状态保持同步
- 执行9步强制验证协议预防版本混乱 
