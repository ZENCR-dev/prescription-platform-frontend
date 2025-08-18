# INITIAL.md - Frontend Task Navigation & Progress Hub

> **📋 Document Purpose & Boundaries**
> 
> This document provides **task navigation and progress tracking only**:
> - Strategic constraints: see `PLANNING.md`
> - Execution rules: see `CLAUDE.md`  
> - Development environment: see `DevEnv.md`
> - Current executable tasks: see active `PRPs/TASK0x.md`

---

## 🎯 Quick Start - Active Task Entry Point

### Current Active Development
- **📍 Current Position**: `PRPs/TASK01.md` (Foundation Setup) - Ready to begin after v6.0 framework upgrade ✅
- **🚀 Enter Development**: Click → [`PRPs/TASK01.md`](./PRPs/TASK01.md) ← for page specs & acceptance criteria
- **📝 Progress Update**: Mark tasks complete in [Progress Tracker](#progress-tracker) below
- **🔄 Backend Sync**: Check [Backend Coordination](#backend-sync) before proceeding

---

## 🏛️ 任务导航系统

### 三层结构导航
**Architecture Details**: 参见 [`PLANNING.md#task-tree-layer1`](./PLANNING.md#task-tree-layer1) 完整架构定义

**Navigation Flow**:
- **Layer 1**: [`PLANNING.md`](./PLANNING.md) - 战略约束和架构决策
- **Layer 2**: 本文档 + [`PRPs/TASK0X.md`](./PRPs/) - 执行任务和验收标准  
- **Layer 3**: `TodoWrite`临时生成 - Agent自主开发循环

### 当前状态
- ✅ **Layer 1**: [`PLANNING.md`](./PLANNING.md) 战略框架完成
- ✅ **Layer 2**: [`TASK01-09`](./PRPs/) 执行任务就绪
- 🚀 **Layer 3**: Agent可开始TASK01执行

---

## 文档导航协议 (Document Navigation Protocol)

**重要澄清**: 此协议为文档查阅导航步骤，不是上述任务树的层级结构

**AGENT执行协议**: Agent执行任务时的文档导航顺序：

1. **Check Position**: Use [Progress Tracker](#progress-tracker) below for current status
2. **Strategic Context**: Reference `PLANNING.md` for phase understanding  
3. **Get Tasks**: Open specific `PRPs/TASK0X.md` for atomic task breakdown
4. **Execute**: Implement following `CLAUDE.md` development cycle
5. **Update Status**: Mark completion in progress tracker and identify next steps

### 统一ACD敏捷工作流模板 (v6.0 MVP适配版)

**ACD工作流定义** (所有任务类型采用ACD敏捷模板):
```yaml
# 统一ACD工作流模板 (适用于所有任务类型)
标准4步ACD循环:
  1. 分析与规划 【需求分析】(主实现角色: frontend/backend/architect)
     - 需求分析和技术可行性评估
     - 组件设计和接口定义
  2. 实现与构建 【快速实现】(同一主实现角色)
     - 按设计快速实现核心功能
     - 集成现有组件和服务
  3. 验证与优化 【质量保证】(同一主实现角色)
     - 全面功能测试和质量检查
     - 性能优化和用户体验改进
  4. 集成与反馈 【提交阶段】(qa角色)
     - 最终质量检查和测试套件
     - 测试通过后进行安全Git提交

ACD执行约束:
  - ❌ 禁止跳过需求分析 - 每个原子任务必须从分析规划开始
  - ❌ 禁止并行执行原子任务 - 一次只执行一个原子任务的4步ACD循环
  - ❌ 禁止批量创建todos - 只为当前原子任务创建4步ACD todos
  - ✅ 正确执行流程 - 分析规划→实现构建→验证优化→集成反馈→下一个原子任务

基础完成标准:
  - 当前原子任务的4步ACD循环全部完成
  - npm run test 通过 (功能测试套件)
  - npm run lint 通过
  - 功能手动验证通过

失败处理: 人工识别问题，创建简单修复任务，使用4步ACD循环解决
```

### AI Agent简化估算体系 (v6.0敏捷版)

**统一估算标准**: 参见 [`PLANNING.md#AI Agent估算标准定义`](./PLANNING.md#ai-agent估算标准定义) - Layer 1权威标准

### 人工修复机制 (v6.0简化版)

**轻量级失败处理** (敏捷修复流程):
```yaml
Manual_Fix_Mechanism:
  Basic_Validation_Failure:
    - 触发: npm run test/lint/build 失败
    - 处理: 人工识别问题，创建简单修复任务
    - 解决: 使用4步ACD循环处理具体问题
    
  Human_Review_Process:
    1. 识别具体失败原因
    2. 创建针对性修复任务
    3. 使用标准工作流解决
    4. 验证修复效果
    
  Agile_Principles:
    - 直接有效的问题解决
    - 减少自动化复杂性
    - 保持人工灵活性和判断力
```

### 轻量级验证系统 (v6.0敏捷版)

**统一Phase完成验证**: 所有任务类型使用相同的轻量级验证标准，详见[`CLAUDE.md#轻量级Phase完成验证`](./CLAUDE.md)

**基础验证标准** (统一对所有任务类型):
- **npm run test 通过**: 基础单元测试验证
- **npm run lint 通过**: 代码规范检查
- **npm run build 通过**: 构建完整性验证  
- **功能手动验证通过**: 基础功能正确性验证

**简化触发机制**: Phase内所有原子任务完成时自动执行，检查失败时人工review和修复

### SuperClaude Development Acceleration Framework

**Task-Specific Command Mappings**:
- **TASK01 (Foundation)**: `/sc:build --frontend --optimize` + `/sc:implement foundation --supabase` + `/sc:test --integration --basic`
- **TASK02 (Infrastructure)**: `/sc:design schema --privacy-compliant` + `/sc:implement setup --security` + `/sc:validate compliance --gdpr`  
- **TASK03 (Auth Migration)**: `/sc:analyze auth --migration-strategy` + `/sc:implement auth --supabase --secure` + `/sc:test auth --comprehensive`
- **TASK04 (Database & RLS)**: `/sc:design schema --medical --privacy` + `/sc:implement rls-policies --comprehensive` + `/sc:validate security --data`
- **TASK05 (Component Migration)**: `/sc:analyze components --migration-levels` + `/sc:implement migration --supabase` + `/sc:test components --privacy`
- **TASK06 (Edge Functions)**: `/sc:design edge-functions --secure` + `/sc:implement payment --stripe --audit` + `/sc:validate security --comprehensive`
- **TASK07 (Realtime)**: `/sc:design realtime --subscriptions` + `/sc:implement notifications --optimization` + `/sc:test performance --realtime`
- **TASK08 (Production)**: `/sc:design deployment --production` + `/sc:implement monitoring --comprehensive` + `/sc:validate production --security`
- **TASK09 (Testing & QA)**: `/sc:design testing --framework` + `/sc:implement tests --comprehensive` + `/sc:validate quality --coverage`

**⚡ Workflow Acceleration Patterns**:
```bash
# Foundation Development (TASK01)
/sc:build --frontend --optimize --medical-theme
/sc:implement foundation --supabase --auth --privacy-compliant
# → Auto-activates: Magic for UI, Next.js optimization, Medical branding

# Infrastructure Setup (TASK02) 
/sc:design schema --privacy-compliant --medical --security
/sc:implement setup --supabase --team-access --comprehensive
# → Auto-activates: Sequential logic, Context7 for Supabase patterns

# Auth Migration (TASK03)
/sc:analyze auth --migration-strategy --security-focus
/sc:implement auth --supabase --secure --rls-integration
# → Auto-activates: Backend auth logic, RLS integration, Privacy compliance

# Database & RLS (TASK04)
/sc:design schema --medical --privacy --comprehensive
/sc:implement rls-policies --security --data-isolation
# → Auto-activates: Architect design, Backend RLS policies, Data privacy

# Component Migration (TASK05)
/sc:analyze components --migration-levels --strategy
/sc:implement migration --supabase --privacy --parallel
# → Auto-activates: Frontend components, Backend privacy, Architecture migration

# Edge Functions & Payment (TASK06)
/sc:design edge-functions --secure --stripe --audit-trail
/sc:implement payment --comprehensive --security --monitoring
# → Auto-activates: Backend logic, Architect patterns, Payment processing
```

**🎯 Persona Auto-Activation Intelligence** (v6.0简化角色系统):
- **frontend**: UI components, branding, accessibility (auto-triggers: component, responsive, accessibility)
- **backend**: AUTH flows, API integration, data processing (auto-triggers: auth, api, data, server)
- **architect**: System design, coordination protocols (auto-triggers: architecture, system, coordination)
- **qa**: Testing, validation, quality assurance (auto-triggers: test, quality, validation)

**🔧 MCP Server Optimization**:
- **Context7** (`--c7`): Supabase documentation, framework patterns, best practices lookup
- **Sequential** (`--seq`): Complex AUTH logic, multi-step analysis, systematic coordination
- **Magic** (`--magic`): UI component generation, design system integration, responsive layouts
- **Playwright** (`--play`): E2E testing, AUTH flow validation, browser automation

**🌊 Wave Mode Recommendations**:
- **TASK01/02**: Multi-component tasks → `--wave-mode` with systematic/progressive strategies
- **Complex Analysis**: System-wide changes → `--wave-strategy adaptive` with `--wave-delegation tasks`
- **Token Efficiency**: Intensive sessions → `--uc` + `--wave-mode` for optimized resource usage

**🚀 Efficiency Multipliers**:
- `--delegate` for parallel component development (40-70% time savings)
- `--uc` for token optimization during intensive development sessions  
- `--wave-mode` for compound intelligence across multi-stage tasks
- `--loop` for iterative improvement workflows

### Status Legend & Completion Rules
- ✅ **Complete**: Development finished, tests passing, merged to main
- ⏳ **Active**: Currently in development (only ONE task can be Active)
- 📋 **Ready**: Prerequisites met, dependencies resolved, ready to start
- 🚫 **Blocked**: Waiting for dependencies or backend coordination
- 🚨 **Coordination Required**: Backend team alignment needed before proceeding

**📝 How to Mark Complete**: 
1. Verify all atomic tasks in SOP completed and tested
2. Change status from ⏳ to ✅ in progress tracker below
3. Update branch status to ready for review/merge
4. Identify next active SOP from ready tasks

---

## 📊 Progress Tracker & Task Tree {#progress-tracker}

### Development Status Overview

| SOP                          | Phase                    | Atomic Tasks | AI Agent Est.   | Status        | Target Branch              | Branch Health Status            | Backend Coordination                 |
| ---------------------------- | ------------------------ | ------------ | --------------- | ------------- | -------------------------- | ------------------------------- | ------------------------------------ |
| [`TASK00`](./PRPs/TASK00.md) | Framework Upgrade        | 9 Tasks      | 46 steps        | ✅ Complete  | `TASK00` → `main`          | ✅ **Merged & Synced**        | None (Documentation only)            |
| [`TASK01`](./PRPs/TASK01.md) | Foundation Setup         | 5 Tasks      | 30 steps        | 📋 Ready     | `TASK01` → `main`          | 🔄 **Local Lead Required**    | Environment alignment                |
| [`TASK02`](./PRPs/TASK02.md) | Infrastructure Setup     | 5 Tasks      | 28 steps        | 📋 Ready     | `TASK02` → `main`          | 🔄 **Local Lead Required**    | Shared Supabase project              |
| [`TASK03`](./PRPs/TASK03.md) | Auth Migration           | 4 Tasks      | 24 steps        | 📋 Ready     | `TASK03` → `main`          | 🔄 **Local Lead Required**    | Auth system alignment                |
| [`TASK04`](./PRPs/TASK04.md) | Database & RLS           | 4 Tasks      | 22 steps        | 🚫 Blocked   | `TASK04` → `main`          | ⚠️ **Validation Required**    | 🚨 **Data schema confirmation**      |
| [`TASK05`](./PRPs/TASK05.md) | Component Migration      | 4 Tasks      | 20 steps        | 📋 Ready     | `TASK05` → `main`          | 🔄 **Local Lead Required**    | Integration testing                  |
| [`TASK06`](./PRPs/TASK06.md) | Edge Functions & Payment | 5 Tasks      | 30 steps        | 🚫 Blocked   | `TASK06` → `main`          | ⚠️ **Validation Required**    | 🚨 **`~/APIdocs/APIv1.md` required** |
| [`TASK07`](./PRPs/TASK07.md) | Realtime & Notifications | 4 Tasks      | 24 steps        | 📋 Ready     | `TASK07` → `main`          | 🔄 **Local Lead Required**    | Realtime endpoints                   |
| [`TASK08`](./PRPs/TASK08.md) | Production Deployment    | 5 Tasks      | 32 steps        | 🚫 Blocked   | `TASK08` → `main`          | ⚠️ **Validation Required**    | 🚨 **Production API validation**     |
| [`TASK09`](./PRPs/TASK09.md) | Quality Assurance        | 5 Tasks      | 30 steps        | 📋 Ready     | `TASK09` → `main`          | 🔄 **Local Lead Required**    | E2E testing coordination             |

### Branch Health Status Legend
**Reference**: [`PLANNING.md#强制性分支操作协议`](./PLANNING.md) - 9步验证流程详细说明
**Golden Workflow Integration**: [`examples/golden-workflow.md`](./examples/golden-workflow.md) - Happy Path procedures
**Emergency Protocols**: [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) - Recovery procedures

| Branch Health Indicator | Meaning | Action Required | Recovery Reference |
|-------------------------|---------|-----------------|-------------------|
| ✅ **Merged & Synced** | Branch successfully merged, local and remote fully synchronized | None - Continue to next task | N/A |
| 🔄 **Local Lead Required** | Local development must begin to establish lead over remote | Execute 9-step pre-operation validation before Git operations | [`examples/golden-workflow.md`](./examples/golden-workflow.md) |
| ⚠️ **Validation Required** | Remote-local sync status needs verification before proceeding | Check remote branch state, ensure local priority principle | [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) |
| 🚨 **Conflict Detected** | Version inconsistency or remote-ahead situation detected | Apply conflict resolution protocol, analyze branch divergence | [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) |
| 🛡️ **Security Hold** | Branch contains potential security issues or failed security scan | Run security audit, resolve issues before proceeding | [`examples/emergency-recovery.md#security-incident-response`](./examples/emergency-recovery.md#security-incident-response) |
| 🚧 **Quality Gate Failed** | Branch failed automated quality checks (test/lint/build) | Fix quality issues using TDD approach | [`examples/golden-workflow.md#pre-flight-checklist`](./examples/golden-workflow.md#pre-flight-checklist) |

**Golden Workflow Integration**: Before any Git branch operations, execute the 9-step mandatory validation protocol from PLANNING.md to prevent version confusion and ensure "local development always leads" principle. For standard development, follow the Happy Path procedures in [`examples/golden-workflow.md`](./examples/golden-workflow.md).

**Tool Integration**: Use [`examples/tool-matrix.md`](./examples/tool-matrix.md) command aliases for automated status checking and quality validation.

### Quick Task Navigation
**Click any TASK link above to jump directly to detailed atomic tasks and acceptance criteria.**

### Development Operation Logs
**Parallel LOG documents for operational tracking**:
- [`TASK00_LOG.md`](./PRPs/TASK00_LOG.md) - Framework Upgrade operations log
- [`TASK01_LOG.md`](./PRPs/TASK01_LOG.md) - Foundation Setup operations log
- [`TASK02_LOG.md`](./PRPs/TASK02_LOG.md) - Supabase Project Setup operations log  
- [`TASK03_LOG.md`](./PRPs/TASK03_LOG.md) - AUTH Migration operations log
- [`TASK04_LOG.md`](./PRPs/TASK04_LOG.md) - Database & RLS operations log
- [`TASK05_LOG.md`](./PRPs/TASK05_LOG.md) - Component Migration operations log
- [`TASK06_LOG.md`](./PRPs/TASK06_LOG.md) - Edge Functions operations log
- [`TASK07_LOG.md`](./PRPs/TASK07_LOG.md) - Realtime Features operations log
- [`TASK08_LOG.md`](./PRPs/TASK08_LOG.md) - Production Deployment operations log
- [`TASK09_LOG.md`](./PRPs/TASK09_LOG.md) - Quality Assurance operations log

**Note**: LOG documents are created automatically when Agent begins executing corresponding TASK. They record actual development operations in reverse chronological order using technical language only.

---

## 🔄 Backend Synchronization Points {#backend-sync}

### Critical Coordination Checkpoints
- **🔄 Sync Point A** (Week 3): Data model alignment - Details: `PLANNING.md#syncpoints-detail`
- **🔄 Sync Point B** (Week 4): API contract review - Requires: `~/APIdocs/APIv1.md`  
- **🔄 Sync Point C** (Week 5): Edge Functions integration - Backend endpoints ready
- **🔄 Sync Point D** (Week 6): Production API validation - E2E testing coordination

### How to Handle Blocked Tasks
1. **Check Dependencies**: Review backend coordination requirements above
2. **Coordinate**: Contact backend team for required deliverables
3. **Work Around**: Focus on non-blocked tasks in parallel
4. **Document**: Update progress tracker when dependencies resolved

### Backend Dependencies
- **🚨 TASK04 & TASK06**: Blocked until backend provides `~/APIdocs/APIv1.md`
- **🚨 TASK08**: Blocked until production API endpoints validated
- **All Other Tasks**: Can proceed independently with Supabase integration

---

## ⚡ Development Environment Quick Start

### Today's Development Actions
```bash
# 1. Check current position in progress tracker above ↑
# 2. Navigate to strategic context:
open PLANNING.md    # Architecture & constraints

# 3. Navigate to current executable tasks:
open PRPs/TASK01.md  # (or current active SOP from tracker)

# 4. Development environment setup:
open DevEnv.md      # For ports, commands, CORS setup
```

### Environment & Commands Reference
**All technical setup consolidated in**: `DevEnv.md`
- Port allocation & CORS configuration
- Development commands & scripts
- Supabase local setup & troubleshooting
- Quality gates commands (lint, test, build)

---

## 📋 Progress Update Responsibilities

### Developer Responsibilities
- **Status Updates**: Change task status in progress tracker above
- **Branch Management**: Keep feature branches updated and ready for review
- **Documentation**: Update any API impacts in `~/APIdocs/APIv1_log.md` (if applicable)
- **Next Task Identification**: Determine next active SOP from ready tasks

### Backend Team Responsibilities  
- **API Documentation**: Maintain `~/APIdocs/APIv1.md` for frontend dependencies
- **Sync Point Communication**: Notify frontend team when coordination requirements met
- **Dependency Resolution**: Unblock frontend tasks by providing required deliverables

### Team Lead Responsibilities
- **Review & Approval**: Review and approve SOP branch merges
- **Coordination Oversight**: Ensure backend synchronization points are met
- **Quality Validation**: Ensure all quality gates pass before task completion

---

**Document References**: [`PLANNING.md`](./PLANNING.md) (Strategy) | [`CLAUDE.md`](./CLAUDE.md) (Execution) | [`DevEnv.md`](./DevEnv.md) (Environment) | [`PRPs/TASK0x.md`](./PRPs/) (Tasks)