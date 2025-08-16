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
**Detailed Commands & Procedures**: See `DevEnv.md#workflow`

---

## 🏗️ Layer 3: TDD-Todos自主执行协议 {#layer3-execution-protocol}

### Agent执行触发机制

当AI Agent接到Layer 2任务(来自`PRPs/TASK0X.md`中的atomic task)时，自动启动Layer 3执行协议：

**触发条件**:
1. 接收到来自Layer 2的具体atomic task assignment  
2. 确认Layer 1(PLANNING.md)约束和Layer 2(INITIAL.md + PRPs/TASK0X.md)验收标准
3. 创建对应的`PRPs/TASK0X_LOG.md`开发操作日志文档
4. 开始使用Claude Code内置`TodoWrite`工具生成临时TDD-Todos

**执行原则**:
- **临时性**: Layer 3 TDD-Todos由Agent临时生成，**不创建持久化文档**
- **自主性**: Agent根据atomic task复杂度自主决定具体步骤数量和内容
- **3+1步骤**: 基于简化的3+1步骤执行模式（一个主实现角色 + 一个验证角色）
- **质量门控**: 深度检查上移至Layer 2智能质量门控，原子任务仅做基础验证
- **操作记录**: 所有开发操作必须实时记录到对应的TASK0X_LOG.md文档

### 3+1步骤执行模式 (简化的原子任务开发流程)

Agent执行Layer 2 atomic task时，使用`TodoWrite`工具生成标准的**3+1步骤**执行流程：

#### 1. 需求分析与设计 (主实现角色负责)
```bash
# SuperClaude命令 (根据任务类型选择)
/sc:analyze [atomic-task] --persona-[frontend|backend|architect]

# Agent行为
- 主实现角色分析atomic task的需求和技术方案
- 设计实现路径和技术架构
- 识别依赖关系和潜在风险
- 确定验证标准和成功指标
```

#### 2. 实现与自测 (主实现角色负责)
```bash
# SuperClaude命令
/sc:implement [feature] --persona-[frontend|backend|architect]
/sc:test --type unit --basic

# Agent行为
- 同一主实现角色完成功能实现
- 编写基础单元测试确保功能正确
- 执行代码格式化和基础lint检查
- 满足Layer 2定义的验收标准
```

#### 3. 集成准备 (主实现角色负责)
```bash
# SuperClaude命令
/sc:test --type integration --prepare
/sc:validate --dependencies

# Agent行为
- 同一主实现角色准备集成环境
- 验证与其他模块的接口兼容性
- 准备集成所需的配置和文档
- 确保代码符合项目约定和规范
```

#### 4. 质量验证与提交 (qa persona负责)
```bash
# SuperClaude命令
/sc:test --type basic --validate
/sc:git --validate --commit

# Agent行为
- qa persona执行基础质量检查
- 运行单元测试和代码规范检查
- 验证功能完整性和集成准备状态
- 提交代码并更新任务状态
```

### 深度检查已上移至Layer 2智能质量门控

以下检查步骤已从原子任务级别移除，现在由Layer 2智能质量门控在Phase完成时自动执行：

- **安全合规检查**: `/sc:analyze --persona-security --focus security --automated`
- **性能基准测试**: `/sc:test --type performance --baseline --automated`  
- **代码质量分析**: `/sc:analyze --focus quality --persona-refactorer --automated`
- **集成测试验证**: `/sc:test --type integration --persona-qa --automated`

这些深度检查会根据Phase的风险等级智能选择执行深度（Minimal/Standard/Comprehensive），检查失败时自动生成targeted fix todos。

### AI Agent估算与执行适配

**多维度估算体系** (替代传统时长估算):
- **步骤数量**: Simple (3-5步)、Moderate (6-10步)、Complex (11-20步)
- **代码生成量**: Light (1-3文件)、Medium (4-8文件)、Heavy (9+文件)
- **迭代轮次**: Straightforward (1-2轮)、Standard (3-4轮)、Complex (5+轮)
- **上下文复杂度**: Isolated (独立模块)、Integrated (跨模块)、Systemic (系统级)

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

**TodoWrite数据结构示例**:
```javascript  
// Agent生成的临时TodoWrite示例 (3+1步骤模式)
TodoWrite([
  {
    id: "task0x-step1",
    content: "【frontend persona】需求分析与设计 - 分析组件需求，设计技术方案", 
    status: "completed",
    priority: "high"
  },
  {
    id: "task0x-step2",
    content: "【frontend persona】实现与自测 - 完成组件开发和基础单元测试", 
    status: "in_progress",
    priority: "high"
  },
  {
    id: "task0x-step3", 
    content: "【frontend persona】集成准备 - 验证接口兼容性，准备集成文档",
    status: "pending",
    priority: "medium"
  },
  {
    id: "task0x-step4",
    content: "【qa persona】质量验证与提交 - 运行测试，代码审查，提交代码",  
    status: "pending",
    priority: "high"
  }
])
```

### 开发操作日志记录规范

**日志文档**: 每个TASK执行时创建对应的`PRPs/TASK0X_LOG.md`文档

**记录原则**:
- **纯操作记录**: 只记录实际执行的开发动作，不做评价或预测
- **倒序排列**: 最新操作在顶部，格式：`[时间戳] 阶段标识 操作描述`
- **技术语言**: 简洁准确的技术描述，避免主观性语言
- **阶段标注**: 使用3+1步骤的阶段标识 (📋 分析设计、🚀 实现自测、🔧 集成准备、✅ 质量提交)
- **Git独行**: commit信息独立section，包含完整commit hash和message

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

**日志维护责任**:
- Agent在每个开发循环阶段完成时立即更新日志
- 记录所有文件修改、配置变更、命令执行
- Git commit信息单独记录，便于版本追踪
- 不记录进度评估、性能预测或改进建议

---

## 🤖 SuperClaude Command Integration

### Project-Specific Commands

**`/build`** - Frontend build process with optimization
- **Context**: Next.js/React build with TypeScript validation
- **Auto-Activation**: Frontend persona, Magic MCP for UI components
- **Quality Gates**: ESLint, TypeScript check, build verification
- **Output**: Optimized production build with performance analysis

**`/implement [feature]`** - Component and feature implementation
- **Context**: Supabase-first architecture with RLS integration
- **Auto-Activation**: Frontend persona, Context7 for patterns, Magic for UI
- **Constraints**: Must follow privacy compliance, no patient PII
- **Validation**: Component testing, accessibility, responsive design

**`/analyze [target]`** - Code analysis and architecture review
- **Context**: Privacy compliance scanning, architecture violation detection
- **Auto-Activation**: Analyzer persona, Sequential MCP for structured analysis
- **Focus Areas**: Security, performance, compliance, technical debt
- **Output**: Actionable recommendations with risk assessment

**`/improve [target]`** - Code quality enhancement and optimization
- **Context**: Performance optimization, accessibility compliance, security hardening
- **Auto-Activation**: Performance persona, Refactorer persona based on target
- **Integration**: Wave mode for comprehensive improvements
- **Validation**: Before/after metrics, quality gate compliance

**`/test [type]`** - Testing workflows and validation
- **Context**: Jest unit tests, React Testing Library, E2E with Playwright
- **Auto-Activation**: QA persona, Playwright MCP for E2E testing
- **Coverage**: Unit tests (≥80%), integration tests, accessibility testing
- **Compliance**: GDPR/HIPAA validation, security testing

### Command Execution Constraints

**Architecture Compliance**:
- All commands must respect three-layer navigation (PLANNING → INITIAL → PRPs/TASK)
- Cannot create custom API clients or authentication systems
- Must use Supabase-first architecture exclusively
- Privacy compliance validation required for all data operations

**Backend Coordination**:
- Commands requiring API integration blocked without `~/APIdocs/APIv1.md`
- No self-mocking of backend APIs permitted
- Must coordinate with backend team for schema changes
- Production deployment requires backend validation

**Quality Requirements**:
- All commands trigger quality gates (lint, typecheck, tests)
- Performance budgets enforced (Core Web Vitals compliance)
- Accessibility standards required (WCAG 2.1 AA)
- Security validation for all user-facing features

---

**This CLAUDE.md provides execution rules and collaboration protocols only. All strategic decisions, task navigation, and environment configuration are maintained in linked documents:**

- **Strategic Context**: `PLANNING.md#architecture` | `PLANNING.md#quality-gates`
- **Task Navigation**: `INITIAL.md#progress-tracker` 
- **Environment Setup**: `DevEnv.md#commands` | `DevEnv.md#workflow`
- **Task Details**: `PRPs/TASK0x.md`