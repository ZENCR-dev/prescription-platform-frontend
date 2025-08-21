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
- **🔄 Backend Sync**: Check [Backend Dependencies](#backend-sync) before proceeding

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

**标准4步ACD循环**: 所有任务统一采用分析规划→实现构建→验证优化→集成反馈的敏捷开发模式。

**完整工作流定义**: 详见 [`FRONTEND_PLAYBOOK.md`](./FRONTEND_PLAYBOOK.md#前端PRP标准模板) - ACD执行循环章节

### AI Agent简化估算体系 (v6.0敏捷版)

**统一估算标准**: 采用4维度体系(步骤/文件/轮次/复杂度)进行快速估算。

**权威定义**: 详见 [`PLANNING.md#AI Agent估算标准定义`](./PLANNING.md#ai-agent估算标准定义) 和 [`FRONTEND_PLAYBOOK.md`](./FRONTEND_PLAYBOOK.md#AI-Agent估算)

### 人工修复机制 (v6.0简化版)

**轻量级失败处理**: 基础验证失败时人工识别问题，创建修复任务，使用4步ACD循环解决。

**完整修复流程**: 详见 [`FRONTEND_PLAYBOOK.md`](./FRONTEND_PLAYBOOK.md) - 质量保证与修复机制章节

### 轻量级验证系统 (v6.0敏捷版)

**统一Phase完成验证**: test/lint/build通过 + 功能验证，失败时人工review修复。

**详细验证标准**: 详见 [`CLAUDE.md#轻量级Phase完成验证`](./CLAUDE.md) 和 [`FRONTEND_PLAYBOOK.md`](./FRONTEND_PLAYBOOK.md) - 质量验证章节

### SuperClaude Development Acceleration Framework

**Task-Specific Command Mappings**:
- **TASK01 (Foundation)**: `/sc:build --frontend --optimize` + `/sc:implement foundation --supabase` + `/sc:test --integration --basic`
- **TASK02 (Infrastructure)**: `/sc:implement setup --frontend-env` + `/sc:validate env-config --supabase` + `/sc:test connectivity --basic`  
- **TASK03 (Auth Migration)**: `/sc:analyze auth --migration-strategy` + `/sc:implement auth --supabase --secure` + `/sc:test auth --comprehensive`
- **TASK04 (Database Integration)**: `/sc:implement supabase-client --rls-integration` + `/sc:test data-access --permissions` + `/sc:validate privacy --compliance`
- **TASK05 (Component Migration)**: `/sc:analyze components --migration-levels` + `/sc:implement migration --supabase` + `/sc:test components --privacy`
- **TASK06 (Payment Integration)**: `/sc:implement payment-ui --stripe-client` + `/sc:test payment-flows --comprehensive` + `/sc:validate security --frontend`
- **TASK07 (Realtime)**: `/sc:implement realtime-subscriptions --supabase` + `/sc:test notifications --client-side` + `/sc:validate performance --realtime`
- **TASK08 (Production)**: `/sc:build --production` + `/sc:implement monitoring --frontend` + `/sc:validate deployment --vercel`
- **TASK09 (Testing & QA)**: `/sc:design testing --framework` + `/sc:implement tests --comprehensive` + `/sc:validate quality --coverage`

**⚡ Workflow Acceleration Patterns**:
```bash
# Foundation Development (TASK01)
/sc:build --frontend --optimize --medical-theme
/sc:implement foundation --supabase --auth --privacy-compliant
# → Auto-activates: Magic for UI, Next.js optimization, Medical branding

# Infrastructure Setup (TASK02) 
/sc:implement client-setup --supabase --env-config
/sc:test connectivity --supabase --validation
# → Auto-activates: Sequential logic, Context7 for Supabase patterns

# Auth Migration (TASK03)
/sc:analyze auth --migration-strategy --security-focus
/sc:implement auth --supabase-client --ui-integration
# → Auto-activates: Frontend auth components, Client-side integration, Privacy compliance

# Database Integration (TASK04)
/sc:implement client-integration --supabase --rls-aware
/sc:test data-access --permissions --privacy
# → Auto-activates: Frontend data layer, Client permissions, Data privacy

# Component Migration (TASK05)
/sc:analyze components --migration-levels --strategy
/sc:implement migration --supabase --privacy --parallel
# → Auto-activates: Frontend components, Privacy compliance, Architecture migration

# Payment Integration (TASK06)
/sc:implement payment-ui --stripe-client --secure
/sc:test payment-flows --comprehensive --frontend
# → Auto-activates: Frontend payment UI, Client-side processing, Security validation
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

| SOP                          | Phase                    | Atomic Tasks | AI Agent Est.   | Status        | Target Branch              | Branch Health Status            | Backend Dependencies                 |
| ---------------------------- | ------------------------ | ------------ | --------------- | ------------- | -------------------------- | ------------------------------- | ------------------------------------ |
| [`TASK00`](./PRPs/TASK00.md) | Framework Upgrade        | 9 Tasks      | 46 steps        | ✅ Complete  | `TASK00` → `main`          | ✅ **Merged & Synced**        | None (Documentation only)            |
| [`TASK01`](./PRPs/TASK01.md) | Foundation Setup         | 5 Tasks      | 30 steps        | 📋 Ready     | `TASK01` → `main`          | 🔄 **Local Lead Required**    | Environment alignment                |
| [`TASK02`](./PRPs/TASK02.md) | Infrastructure Setup     | 5 Tasks      | 28 steps        | 📋 Ready     | `TASK02` → `main`          | 🔄 **Local Lead Required**    | Shared Supabase project              |
| [`TASK03`](./PRPs/TASK03.md) | Auth Migration           | 4 Tasks      | 24 steps        | 📋 Ready     | `TASK03` → `main`          | 🔄 **Local Lead Required**    | Auth system alignment                |
| [`TASK04`](./PRPs/TASK04.md) | Database & RLS           | 4 Tasks      | 22 steps        | 🚫 Blocked   | `TASK04` → `main`          | ⚠️ **Validation Required**    | 🚨 **Waiting for data schema from backend** |
| [`TASK05`](./PRPs/TASK05.md) | Component Migration      | 4 Tasks      | 20 steps        | 📋 Ready     | `TASK05` → `main`          | 🔄 **Local Lead Required**    | Integration testing                  |
| [`TASK06`](./PRPs/TASK06.md) | Edge Functions & Payment | 5 Tasks      | 30 steps        | 🚫 Blocked   | `TASK06` → `main`          | ⚠️ **Validation Required**    | 🚨 **`~/APIdocs/APIv1.md` required** |
| [`TASK07`](./PRPs/TASK07.md) | Realtime & Notifications | 4 Tasks      | 24 steps        | 📋 Ready     | `TASK07` → `main`          | 🔄 **Local Lead Required**    | Realtime endpoints                   |
| [`TASK08`](./PRPs/TASK08.md) | Production Deployment    | 5 Tasks      | 32 steps        | 🚫 Blocked   | `TASK08` → `main`          | ⚠️ **Validation Required**    | 🚨 **Waiting for production API validation** |
| [`TASK09`](./PRPs/TASK09.md) | Quality Assurance        | 5 Tasks      | 30 steps        | 📋 Ready     | `TASK09` → `main`          | 🔄 **Local Lead Required**    | E2E testing coordination             |

### Branch Health Status Legend
**Primary Workflow**: [`examples/golden-workflow.md`](./examples/golden-workflow.md) - Complete Git workflow with Medical Compliance Checks
**Emergency Protocols**: [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) - Recovery procedures
**Tool Integration**: [`examples/tool-matrix.md`](./examples/tool-matrix.md) - Command aliases and automation

| Branch Health Indicator | Meaning | Action Required | Recovery Reference |
|-------------------------|---------|-----------------|-------------------|
| ✅ **Merged & Synced** | Branch successfully merged, local and remote fully synchronized | None - Continue to next task | N/A |
| 🔄 **Local Lead Required** | Local development must begin to establish lead over remote | Execute 9-step pre-operation validation before Git operations | [`examples/golden-workflow.md`](./examples/golden-workflow.md) |
| ⚠️ **Validation Required** | Remote-local sync status needs verification before proceeding | Check remote branch state, ensure local priority principle | [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) |
| 🚨 **Conflict Detected** | Version inconsistency or remote-ahead situation detected | Apply conflict resolution protocol, analyze branch divergence | [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) |
| 🛡️ **Security Hold** | Branch contains potential security issues or failed security scan | Run security audit, resolve issues before proceeding | [`examples/emergency-recovery.md#security-incident-response`](./examples/emergency-recovery.md#security-incident-response) |
| 🚧 **Quality Gate Failed** | Branch failed automated quality checks (test/lint/build) | Fix quality issues using TDD approach | [`examples/golden-workflow.md#pre-flight-checklist`](./examples/golden-workflow.md#pre-flight-checklist) |

**Golden Workflow Integration**: Follow the unified Git workflow in [`examples/golden-workflow.md`](./examples/golden-workflow.md) for all development activities. The enhanced Pre-Flight Checklist includes Medical Compliance Checks that preserve audit trail integrity while maintaining development efficiency.

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

## 🔄 Backend Dependencies {#backend-sync}

### Critical Dependency Checkpoints
- **🔄 Sync Point A** (Week 3): Data model alignment - Details: `PLANNING.md#syncpoints-detail`
- **🔄 Sync Point B** (Week 4): API contract review - Requires: `~/APIdocs/APIv1.md`  
- **🔄 Sync Point C** (Week 5): Edge Functions integration - Backend endpoints ready
- **🔄 Sync Point D** (Week 6): Production API validation - E2E testing coordination

### How to Handle Blocked Tasks
1. **Check Dependencies**: Review backend dependency requirements above
2. **Request**: Contact backend team for required deliverables
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
- **Dependency Updates**: Notify frontend team when dependency requirements are resolved
- **Dependency Resolution**: Unblock frontend tasks by providing required deliverables

### Team Lead Responsibilities
- **Review & Approval**: Review and approve SOP branch merges
- **Dependency Oversight**: Ensure backend dependency requirements are resolved
- **Quality Validation**: Ensure all quality gates pass before task completion

---

**Document References**: [`PLANNING.md`](./PLANNING.md) (Strategy) | [`CLAUDE.md`](./CLAUDE.md) (Execution) | [`DevEnv.md`](./DevEnv.md) (Environment) | [`PRPs/TASK0x.md`](./PRPs/) (Tasks)