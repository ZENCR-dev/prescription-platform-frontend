# CLAUDE.md - Frontend AI Collaboration Rules
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
**Layer 3职责**: Layer 3 TDD-Todos自主执行协议和3+1步骤执行模式  
**框架版本**: v6.0 Compliance - 3+1步骤敏捷执行，轻量级质量验证  

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

## 📋 Backend Coordination Protocol

### API Documentation Requirements
**Single Source of Truth**: `~/APIdocs/APIv1.md`
- **Maintained by**: Backend development team
- **Frontend Dependency**: Cannot proceed with API integration without this documentation
- **No Self-Mocking**: Frontend must wait for official API specifications

### Git Workflow & Branch Management

**三层Git工作流程** (与3+1步骤集成):

#### Branch 3 (日期分支) - 原子任务级别
```bash
# 1. 开始原子任务时创建分支
git checkout TASK01
git checkout -b 2024-01-15-1430

# 2. 执行3+1步骤开发循环
# 步骤1-3: 需求分析、实现自测、集成准备
# 步骤4: 质量验证与提交
git add .
git commit -m "atomic(01.1): [step4-verified] implement auth component"
```

#### Branch 2 (TASK分支) - Phase级别
```bash
# Phase完成时合并日期分支
git checkout TASK01
git merge 2024-01-15-1430 --no-ff
git branch -d 2024-01-15-1430  # 清理临时分支
git tag "TASK01-phase1"  # 标记Phase完成
```

#### Branch 1 (Main分支) - TASK文档级别  
```bash
# TASK文档完成时合并到main
git checkout main
git merge TASK01 --no-ff
git tag "TASK01-complete"
```

**质量验证与Git集成**:
- 第4步"质量验证与提交"必须包含Git commit操作
- 所有合并操作必须通过轻量级验证(test/lint/build)
- TodoWrite状态与Git分支状态保持同步

**详细命令参考**: See `DevEnv.md#workflow` for additional Git commands

---

## 🏗️ Layer 3: TDD-Todos自主执行协议 {#layer3-execution-protocol}

### Agent执行触发机制

当AI Agent接到Layer 2任务(来自`PRPs/TASK0X.md`中的atomic task)时，自动启动Layer 3执行协议：

**触发条件**:
1. 接收到来自Layer 2的具体atomic task assignment  
2. 确认Layer 1(PLANNING.md)约束和Layer 2(INITIAL.md + PRPs/TASK0X.md)验收标准
3. 创建对应的`PRPs/TASK0X_LOG.md`开发操作日志文档
4. 开始使用Claude Code内置`TodoWrite`工具生成临时TDD-Todos

**执行原则** (NON-NEGOTIABLE):
- **TDD强制执行**: 必须采用测试驱动开发，先写测试后写实现，严禁跳过TDD流程
- **串行执行**: 一次只执行一个原子任务，完成全部3+1步骤后才开始下一个原子任务
- **临时性**: Layer 3 TDD-Todos由Agent临时生成，**不创建持久化文档**
- **自主性**: Agent根据atomic task复杂度自主决定具体步骤数量和内容
- **3+1 TDD步骤**: 基于测试驱动的3+1步骤执行模式（测试-实现-重构-验证）
- **质量验证**: 实施轻量级Phase完成验证，原子任务仅做基础检查
- **操作记录**: 所有开发操作必须实时记录到对应的TASK0X_LOG.md文档

**🚨 关键约束**:
- ❌ **禁止并行执行原子任务**: 同时只能有一个原子任务处于active状态
- ❌ **禁止跳过测试编写**: 每个原子任务必须从编写失败测试开始
- ❌ **禁止批量创建todos**: 只为当前执行的原子任务创建3+1 todos
- ✅ **正确执行流程**: 选择原子任务 → 创建3+1 TDD todos → 完整执行 → 下一个原子任务

### 3+1 TDD步骤执行模式 (测试驱动开发流程)

Agent执行Layer 2 atomic task时，使用`TodoWrite`工具生成标准的**3+1 TDD步骤**执行流程：

#### 1. 测试设计与需求分析 【TDD红灯阶段】(主实现角色负责)
```bash
# SuperClaude命令 (根据任务类型选择)
/sc:analyze [atomic-task] --persona-[frontend|backend|architect] --tdd

# Agent行为
- 主实现角色分析atomic task的需求和技术方案
- **编写应该失败的测试用例（TDD红灯）**
- 定义清晰的验收标准和成功指标
- 识别依赖关系和潜在风险
- 确保测试用例覆盖核心功能需求
```

#### 2. 最小实现与测试通过 【TDD绿灯阶段】(主实现角色负责)
```bash
# SuperClaude命令
/sc:implement [feature] --persona-[frontend|backend|architect] --tdd-minimal
/sc:test --validate-green-light

# Agent行为
- 同一主实现角色编写最少代码使测试通过（TDD绿灯）
- **专注让失败的测试变为通过，不做过度设计**
- 执行代码格式化和基础lint检查
- 验证所有测试用例通过
- 满足Layer 2定义的验收标准
```

#### 3. 重构优化与集成准备 【TDD重构阶段】(主实现角色负责)
```bash
# SuperClaude命令
/sc:refactor --maintain-tests --optimize
/sc:validate --dependencies --integration

# Agent行为
- 同一主实现角色改进代码结构和性能（TDD重构）
- **保持所有测试持续通过，绝不破坏测试**
- 验证与其他模块的接口兼容性
- 准备集成所需的配置和文档
- 确保代码符合项目约定和规范
```

#### 4. 质量验证与提交 【最终验证阶段】(qa persona负责)
```bash
# SuperClaude命令
/sc:test --comprehensive --all-suites
/sc:git --validate --commit

# Agent行为
- qa persona执行完整质量检查
- 运行全部测试套件确保无回归
- 验证功能完整性和集成准备状态
- 执行最终的lint和build检查
- 提交代码并更新任务状态
```

### 轻量级Phase完成验证 (v6.0简化版)

原子任务级别仅保留基础验证，Phase级别实施统一的轻量级验证：

**Phase完成自动验证**:
- `npm run test` - 基础单元测试验证
- `npm run lint` - 代码规范检查
- `npm run build` - 构建完整性验证
- 功能手动验证通过

**失败处理**: 检查失败时人工识别问题，创建简单修复任务，使用3+1步骤模式解决。

### AI Agent估算与执行适配

**估算标准**: 参见 [`PLANNING.md#AI Agent估算标准定义`](./PLANNING.md#ai-agent估算标准定义) Layer 1权威标准

**扩展执行指导**:
Agent可在3+1基础步骤上根据任务复杂度增加必要的中间步骤，但必须保持同一主实现角色的连续性，避免频繁角色切换。常见扩展场景：
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

**正确的TDD TodoWrite示例**:
```javascript  
// 单个原子任务的正确3+1 TDD todos示例 (如: Task 1.1 Next.js Foundation)
TodoWrite([
  {
    id: "task01-1-step1",
    content: "【frontend persona】Step 1 TDD红灯: 编写Next.js初始化测试、Supabase连接测试、路由配置失败测试用例",
    status: "in_progress",
    priority: "high"
  },
  {
    id: "task01-1-step2", 
    content: "【frontend persona】Step 2 TDD绿灯: 实现Next.js项目、配置Supabase客户端，使所有测试通过",
    status: "pending",
    priority: "high"
  },
  {
    id: "task01-1-step3",
    content: "【frontend persona】Step 3 TDD重构: 优化代码结构、提升性能，保持测试通过",
    status: "pending",  
    priority: "medium"
  },
  {
    id: "task01-1-step4",
    content: "【qa persona】Step 4 最终验证: 运行完整测试套件、lint检查、build验证、git commit",
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

// ❌ 错误: 跳过测试编写步骤
TodoWrite([
  {content: "直接实现功能", ...},  // 错误: 跳过TDD红灯阶段
  {content: "后补测试", ...}      // 错误: 不是测试驱动
])
```

### 开发操作日志记录规范

**日志文档**: 每个TASK执行时创建对应的`PRPs/TASK0X_LOG.md`文档

**记录原则**:
- **纯操作记录**: 只记录实际执行的开发动作，不做评价或预测
- **倒序排列**: 最新操作在顶部，格式：`[时间戳] 阶段标识 操作描述`
- **技术语言**: 简洁准确的技术描述，避免主观性语言
- **阶段标注**: 使用3+1步骤的阶段标识 (📋 分析设计、🚀 实现自测、🔧 集成准备、✅ 质量提交)
- **Git独行**: commit信息独立section，包含完整commit hash和不超过一行字的标题式message

**记录格式模板**:
```markdown
### [YYYY-MM-DD HH:MM:SS] 🚀 实现自测 - Task X.Y
- 创建组件文件: `src/components/auth/AuthUI.tsx`
- 编写单元测试: `__tests__/auth/AuthUI.test.tsx`
- 执行基础lint检查，修复格式问题

### [YYYY-MM-DD HH:MM:SS] 📋 分析设计 - Task X.Y
- 分析Supabase Auth集成需求
- 设计组件接口和状态管理方案
- 确定测试策略和验证标准
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

**v6.0职责**: 任务分解和验收标准制定 + 统一3+1工作流模板

**简化原则**: 移除复杂分类和智能门控，专注功能交付和基础质量保障

### 统一敏捷工作流模板

**所有任务统一使用3+1步骤模板**:
```yaml
# 统一工作流模板 (适用于所有任务类型)
标准3+1步骤序列:
  1. 需求分析与设计 (主实现角色: frontend/backend/architect)
  2. 实现与自测 (同一主实现角色)
  3. 集成准备 (同一主实现角色)
  4. 质量验证与提交 (qa角色)

基础完成标准:
  - 所有原子任务完成
  - npm run test 通过
  - npm run lint 通过
  - 功能手动验证通过

失败处理: 人工识别问题，创建简单修复任务
```

### v6.0敏捷验证机制

**Phase完成轻量级验证**:
- **基础检查**: test/lint/build通过 + 功能验证
- **通过处理**: 直接进入下一Phase
- **失败处理**: 人工review，创建修复任务，使用3+1步骤解决

---

**Document References**: [`PLANNING.md`](./PLANNING.md) (Strategy) | [`INITIAL.md`](./INITIAL.md) (Navigation) | [`DevEnv.md`](./DevEnv.md) (Environment) | [`PRPs/TASK0x.md`](./PRPs/) (Tasks) 
