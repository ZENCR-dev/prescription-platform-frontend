# PLANNING.md - Frontend M1 PRP Index
## Core Authentication & User Management - Frontend Components

> **📋 Document Purpose: M1 PRP Index**
> 
> This document provides **M1 module navigation and PRP index only**:
> - Strategic governance: see `~/INITIAL.md`, `~/SOP.md`, `~/GOVERNANCE.md`
> - Execution workflows: see `FRONTEND_PLAYBOOK.md`
> - Current PRP tasks: see `PRPs/PRP-M1.X-*.md` files below
> - API contracts: see `~/APIdocs/APIv1.md` & `APIv1_log.md`

**Document Type**: PRP Index Document (M1 Modules)  
**Project**: Traditional Chinese Medicine Prescription Platform - Frontend UI/UX  
**Architecture**: Supabase-First Frontend Integration  
> 指南V3.2指针（只链接不复制）
> 本文件已指针化，所有流程/模板/规则以《Supabase-First架构下前后端协作与PRP生成指南V3.2》为唯一权威。
> 请参见项目根：`../Supabase-First架构下前后端协作与PRP生成指南V3.2.md`
> - 废弃：CKP、时间分期、TASK*.md命名
> - 请参阅：第二章（价值流路线图）、第四章（4.0/4.2/4.3）、第五章（5.0滚动式规划）
**Timeline**: 7-Week Frontend MVP Delivery  
**Repository Scope**: Frontend UI/UX Development Only  

## 🔧 Enforcement & Scripts

**Governance Validation Scripts**:
- **[`/dev/scripts/validate-governance.sh`](/dev/scripts/validate-governance.sh)** - Comprehensive governance compliance validation
- **[`scripts/prp-boundary-validator.sh`](scripts/prp-boundary-validator.sh)** - Frontend-Backend职责边界验证
- **[`scripts/api-consistency-checker.sh`](scripts/api-consistency-checker.sh)** - Frontend API依赖与Backend API规范一致性检查

**API变更与兼容策略**:
- **版本管理**: 语义化版本控制和弃用窗口策略由 [`~/APIdocs/APIv1_log.md`](~/APIdocs/APIv1_log.md) 统一管理
- **Frontend适配**: API变更对Frontend组件影响评估和适配策略集中定义

*Frontend专用的governance脚本配置和执行时机详见各质量保证章节*

---

## 🔄 Golden Workflow & Security Protocols {#golden-workflow-path}

This project operates under a single, mandatory "Golden Workflow Path" to ensure security, quality, and predictability. All development activities must adhere to this protocol without exception.

**Core Principles:**
- **Golden Path:** Follow the prescribed sequence for all development and integration.
- **Anti-Patterns:** Strictly avoid forbidden practices that compromise project integrity.
- **Manual Confirmation:** Critical, high-impact operations require explicit user approval.

---
> **📖 Detailed Implementation Guide**
>
> The complete, step-by-step guide for the Golden Workflow Path, including all protocols, checklists, and anti-patterns, is maintained in the following document:
>
> ### ➡️ **[`examples/golden-workflow.md`](./examples/golden-workflow.md)**
>
> *This external document is the single source of truth for all "how-to" execution details.*
---

## 🎯 Executive Summary {#executive-summary}

### Frontend Mission Statement
Build a production-ready, accessible, and privacy-compliant frontend interface that enables Traditional Chinese Medicine practitioners and pharmacies to create, manage, and fulfill prescriptions through an intuitive, responsive user experience.

### Key Success Metrics
- **UI/UX Excellence**: Responsive design across all devices with WCAG 2.1 AA compliance
- **Development Velocity**: 60-80% time savings through strategic component reuse
- **Supabase Integration**: 100% client-side integration with Auth, Realtime, and Storage
- **Performance Standards**: <3s load time, Core Web Vitals compliance, 95%+ Lighthouse scores
- **Backend API Dependency Management**: 100% compliance with backend-delivered API specifications
- **Backend Integration**: Seamless API integration following established dependency protocols

---

## 🏗️ Layer 1 Strategic Navigation (Frontend M1 Milestone Coordination)

**本文档Layer 1职责**: Frontend M1里程碑级战略规划 → 为Layer 2 (PRPs) 提供Frontend战略约束和API消费计划 → 管理`main/milestone`分支质量门控。

Frontend战略框架: PLANNING.md (Layer 1战略) → PRPs/PRP-M1.X-*.md (Layer 2战术) → TodoWrite todos (Layer 3执行) → 完整三层架构详见[FRONTEND_PLAYBOOK.md](FRONTEND_PLAYBOOK.md#🏗️-frontend-layer-execution-framework-workspace-implementation)。
```

## 📋 M1 Frontend PRP Index

### M1 Frontend Responsibilities & PRP Index

| M1 Module | Frontend Role | PRP Document | Implementation Focus | Status | IRG Status |
|-----------|---------------|--------------|----------------------|---------|------------|
| **M1.2 - Auth Client Integration** | **Primary Lead** | ✅ **READY - Backend M1.1 Complete** | @supabase/ssr integration, middleware.ts, auth UI components, session management | 🚀 **Ready to Begin** | 📋 **IRG Pending** |
| **M1.4 - Profile Management** | **Primary Lead** | ⚠️ *Pending Backend M1.3 Completion* | User profile interfaces, account settings, responsive design | ⏳ **Blocked - Waiting for Backend** | ⚠️ **IRG Blocked** |
| **M1.5 - User Verification** | UI Coordination | ⚠️ *Pending Backend M1.5 Completion* | Document upload UI, verification status display | ⏳ **Blocked - Waiting for Backend** | ⚠️ **IRG Blocked** |
| **M1.6 - Authentication Security** | UI Coordination | ⚠️ *Pending Backend M1.6 Completion* | MFA interfaces, security settings, auth flows | ⏳ **Blocked - Waiting for Backend** | ⚠️ **IRG Blocked** |

### **🚀 M1.2 Frontend Task Ready Status**

**✅ Backend Dependencies Satisfied:**
- ✅ **Backend M1.1 Complete**: Supabase Auth Infrastructure successfully deployed
- ✅ **Production Environment Ready**: https://dosbevgbkxrtixemfjfl.supabase.co operational
- ✅ **API Documentation Distributed**: Global Architect certified APIv1.md received (2025-08-30)
- ✅ **Performance Validated**: Backend queries <1ms (exceeds targets by 150x)
- ✅ **Security Certified**: HIPAA compliance verified, Zero-PII architecture confirmed

**📋 M1.2 Implementation Requirements:**
- **API Integration**: Use distributed APIv1.md for all authentication endpoints
- **Environment Configuration**: Production Supabase instance (dosbevgbkxrtixemfjfl.supabase.co)
- **Edge Functions Integration**: custom-access-token and auth-email-template-selector support
- **JWT Claims Support**: Enhanced JWT payload with role and profile_status claims
- **RLS Policy Compliance**: Align with backend Row Level Security implementation

**Role Definitions**:
- **Primary Lead**: Frontend owns the complete user experience and coordinates with Backend APIs
- **UI Coordination**: Frontend provides UI components while Backend leads the core implementation
- ✅ **Ready Status**: Can proceed immediately without Backend-First constraints

### Layer 1 决策对下游影响

**技术架构决策的传递**:
- Supabase-First原则 → 影响所有Layer 2 TASK的实现方式
- 隐私合规要求 → 约束所有Layer 2的数据处理模式  
- 质量门控标准 → 定义所有Layer 3 Agent执行的验收标准

**战略约束的执行传递**:
- 本Layer定义的NON-NEGOTIABLE原则 → Layer 2必须严格遵循
- 质量标准和合规要求 → Layer 3开发循环必须验证
- 技术选型约束 → 限定Layer 2和Layer 3的可选技术范围

### Layer 1 协调接口机制 (v6.0简化版)

**基础约束传递机制**:
- **NON-NEGOTIABLE原则**: Supabase-First、Privacy Compliance、Technology Stack约束直接传递至Layer 2
- **质量标准**: 基础验证标准（test/lint/build通过）传递至Layer 3执行
- **架构决策**: 技术选型和安全要求作为开发约束传递

**简化协调检查点**:
- **Phase完成验证**: 功能完成 + 基础测试通过 + 规范符合
- **人工修复机制**: 检查失败时人工识别问题，创建简单修复任务

### 🎨 Layer 2 UI/UX Component Decomposition Requirements (MANDATORY)

**UI/UX用户参与原则**:
Frontend Lead在接收到包含UI/UX开发的PRP任务时，必须在Layer 2 Component分解为Dev-Steps时包含用户参与环节。

**强制用户参与场景**:
- **Authentication UI Components**: 登录/注册界面设计需要用户反馈
- **Dashboard Components**: 仪表板布局和信息架构需要用户验证
- **Data Display Components**: 数据展示方式需要用户偏好确认
- **Form Components**: 表单设计和验证流程需要用户体验测试
- **Navigation Components**: 导航结构需要用户路径验证

**Component分解模式示例** (以Authentication UI为例):
```yaml
Component 3: Authentication UI Components (7 Dev-Steps) # 原5个增加到7个
  Dev-Step 3.1: UI/UX需求分析和用户访谈准备
  Dev-Step 3.2: 创建HTML原型和界面草图
  Dev-Step 3.3: 【用户参与】原型评审和反馈收集
  Dev-Step 3.4: 根据反馈实现登录表单组件
  Dev-Step 3.5: 实现注册表单和角色选择
  Dev-Step 3.6: 【用户参与】UI测试和体验优化
  Dev-Step 3.7: 最终优化和文档完成
```

**执行要求**:
- 使用 `/sc:improve --loop --interactive` 支持迭代设计循环
- HTML原型必须在实现前创建供用户评审
- 用户反馈必须记录在PRP-MX.Y_LOG.md中
- 每个UI/UX Component必须包含至少2个用户参与Dev-Steps

### 📋 IRG Integration Requirements (Layer 2→Module验证)

**IRG与Layer 2 UI/UX分解的集成关系**：
- Layer 2 Component分解必须为IRG验证预留验证节点
- Dev-Steps 3.3和3.6用户参与结果将直接输入Module IRG验证
- 每个UI/UX Component完成后需IRG Checklist预检验证

**IRG预检要求**：
- EdgeFunctionAdapter集成准备验证
- 用户反馈收集完整性检查
- 跨浏览器测试环境准备验证

### 🧩 IRG 前端实施核对清单（可复用片段）

当收到 Global Architect 发牌的 `PRP-MX.Y-*.md` 后用于工程深化与模块集成验证：

```markdown
#### IRG 模块级集成核对清单
- 触发时机：Module 内所有 4-Step QAD 原子任务 completed
- 核对项：
  - [ ] API 集成（EdgeFunctionAdapter：契约遵循 `docs/api/APIv1.md`，错误治理/重试/可观测性）
  - [ ] 用户参与（Dev-Steps 3.3/3.6 反馈已复核并落实）
  - [ ] 跨浏览器（Playwright：Chromium/WebKit/Firefox，桌面+移动配置全部通过）
  - [ ] 性能（核心页面满足性能预算与 Core Web Vitals 目标）
  - [ ] 可访问性（WCAG 2.1 AA 达标）
  - [ ] 文档记录（`PRP-MX.Y_LOG.md` 完整记录：结论、失败项、修复与重验证）
```

### AI Agent估算标准定义 (v6.0简化版) {#ai-agent估算标准定义}

**简化估算体系** (适合敏捷开发的直观指标):
```yaml
AI_Agent_Estimation_Standards_v6:
  步骤数量: [具体数字] (如: 6步，不需要分类)
  代码文件: [文件数量] (如: 3个文件)
  迭代轮次: 1-3轮 (直接预期轮次)
  复杂度: 低/中/高 (简单直观标记)
```

**实用化标准传递**:
- **Layer 1定义简化标准** → **Layer 2直接应用** → **Layer 3快速估算**
- 所有PRPs/TASK0X.md使用此简化标准进行AI Agent估算
- 专注估算的实用性和快速可用性，避免过度分析

### 轻量级质量验证标准 (v6.0敏捷版)

**基础Phase完成验证** (统一标准):
```yaml
Phase_Completion_Validation:
  基础验证标准:
    - 所有原子任务状态 = completed
    - npm run test 通过
    - npm run lint 通过
    - 功能手动验证通过
  
  失败处理机制:
    - 检查通过: 直接进入下一Phase
    - 检查失败: 人工识别问题，创建简单修复任务
    - 修复任务: 使用3+1步骤模式解决具体问题
```

**统一验证流程**:
- **触发时机**: Phase内所有原子任务标记为completed时触发
- **执行内容**: 基础功能验证 + 代码规范检查 + 简单集成测试
- **处理方式**: 通过即继续，失败即人工修复

---

## 🚧 Frontend Planning Boundaries (NON-NEGOTIABLE) {#planning-boundaries}

### Strategic Planning Constraints
**Frontend planning authority is explicitly limited by backend architectural decisions:**

- **API Design Authority**: Frontend cannot plan API endpoints, data schemas, or business logic
- **Integration Timeline Dependencies**: All frontend milestones depend on backend deliverable completion
- **Technology Stack Constraints**: Frontend technology choices must align with backend service capabilities
- **Data Model Limitations**: Frontend data planning constrained by backend-provided schemas

### Planning Dependency Hierarchy
1. **Backend delivers** → API specifications, data schemas, integration requirements
2. **Frontend consumes** → API contracts, follows data models, implements UI layer
3. **Frontend cannot proceed** → without official backend deliverables from `~/APIdocs/APIv1.md`

### Violation Protocol
**Any frontend planning that assumes backend capabilities or designs APIs constitutes a boundary violation requiring immediate correction.**

---

## 🏗️ Architecture & Technology Constraints {#architecture}

### Supabase-First Frontend Principles (NON-NEGOTIABLE)

| Frontend Component    | ❌ Avoid              | ✅ Frontend Implementation              | Strategic Benefit             |
| --------------------- | -------------------- | -------------------------------------- | ----------------------------- |
| **Authentication UI** | Custom auth forms    | Supabase Auth integration              | Secure, tested auth flows     |
| **Data Display**      | Static mock data     | Supabase Realtime subscriptions        | Live data updates             |
| **File Handling**     | Local file storage   | Supabase Storage integration           | Cloud-native file management  |
| **State Management**  | Complex global state | Supabase client state + local UI state | Simplified state architecture |

### Privacy & Compliance Requirements (MANDATORY) {#privacy-and-rls}
```typescript
// ✅ FRONTEND RESPONSIBILITY - Anonymous UI Data Models
interface FrontendPrescriptionModel {
  id: string;
  prescriptionCode: string;    // Display identifier only
  practitionerId: string;      // For UI filtering and display
  status: 'DRAFT' | 'PAID' | 'FULFILLED' | 'COMPLETED';
  totalAmount: number;         // Display in NZD format
  medicines: FrontendMedicineModel[];
  // ❌ NO patient data in frontend models
}
```

### Technology Stack Requirements
- **Framework**: Next.js 14 + TypeScript + App Router (MANDATORY)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend Integration**: Supabase Client SDK (NO custom HTTP clients)
- **Authentication**: Supabase Auth UI components (NO custom JWT)
- **Testing**: Jest + React Testing Library + Playwright
- **Deployment**: Vercel with Supabase integration

### Git Workflow Management Strategy (NON-NEGOTIABLE)

**Golden Workflow Path Integration**:
All Git operations must follow the unified **Golden Workflow Path** with Medical Compliance Checks to ensure audit trail integrity and regulatory compliance.

---
> **📖 Complete Git Workflow Specification**
>
> The detailed Git workflow strategy and compliance requirements:
>
> ### ➡️ **[`examples/golden-workflow.md`](./examples/golden-workflow.md)**
>
> *This unified workflow preserves all critical compliance principles while simplifying development operations from 9-step validation to enhanced Pre-Flight Checklist.*
---

**Key Strategic Principles Preserved**:
- **Local Priority Principle**: Local branches must lead or equal remote branches to prevent audit trail loss
- **Version Consistency**: Deterministic version states required for medical software compliance
- **Audit Trail Integrity**: Complete traceability of all changes to specific tasks and requirements
- **Quality Gate Integration**: All Git operations must pass validation (test/lint/build)

**Architecture Constraints**:
- **Branch Naming**: `TASKXX/short-description` format for feature branches
- **Merge Strategy**: Pull Request workflow with quality validation
- **Compliance Validation**: Enhanced Pre-Flight Checklist before all PR submissions

**Emergency Protocols**: See [`examples/emergency-recovery.md`](./examples/emergency-recovery.md) for recovery procedures

---

## 🚀 M1 Execution Roadmap {#m1-execution-roadmap}

### M1.4 - Profile Management Frontend (Primary)
**PRP**: ⚠️ *Pending Governance Fix*
**Dependencies**: M1.1 (Backend Auth), M1.2 (Backend Registration)

**Deliverables**:
- User profile management interfaces for all user roles
- Account settings and credential management UI
- Responsive profile editing with real-time validation
- Accessibility compliance (WCAG 2.1 AA) verification

### M1.2 - Registration UI Coordination
**PRP**: ⚠️ *Backend Workspace Assignment*
**Dependencies**: M1.1 (Backend Auth), M1.2 (Backend Registration System)

**Coordination Scope**:
- Multi-role registration forms (TCM practitioners, pharmacies)
- Email verification UI components and flows
- User onboarding interfaces and welcome processes

### M1 Backend Dependencies {#m1-backend-dependencies}
**Critical Coordination Points**: Frontend development blocked without Backend completion

**🚨 BACKEND-FIRST ENFORCEMENT**: 
- **API Documentation**: Must receive `~/APIdocs/APIv1.md` updates from Backend PRPs
- **No Self-Mocking**: Frontend cannot proceed without Backend M1.1/M1.2/M1.3/M1.5/M1.6 completion
- **CKP-1 Requirement**: API contract validation required before Frontend integration

**📋 Corrected Backend Dependencies** (After PRP_GENERATION_PLAN fix):
- M1.1 → M1.2 → M1.3 (Backend Primary Path must complete first)
- M1.4 (Frontend Profile Management) - Can start parallel after M1.2 completion

### M1.5/M1.6 - Security & Verification UI Coordination
**PRPs**: ⚠️ *Pending Governance Fix*
**Dependencies**: Backend M1.5/M1.6 completion per Backend-First constraint

**Coordination Scope**:
- Document upload interfaces for professional license verification
- Verification status display and progress tracking
- Multi-factor authentication UI components and flows
- Security settings and advanced session management interfaces

---

## 🔄 Backend API Dependencies {#api-dependencies}

### API Documentation Requirements
**Single Source of Truth**: `~/APIdocs/APIv1.md`
- **Maintained by**: Backend development team
- **Exclusive Authority**: Backend team has sole authority over API design and specification
- **Frontend Dependency**: Cannot proceed with API integration without this documentation
- **Frontend Constraint**: All frontend planning, development, and testing constrained by backend-provided API specifications
- **No Self-Mocking**: Frontend must wait for official API specifications
- **No Frontend API Assumptions**: Frontend cannot assume, design, or implement API contracts independently
- **Specification Completeness**: Backend responsible for complete, accurate, and timely API documentation delivery

### M1 Module Dependencies {#m1-module-dependencies}
- **📋 M1.1 Dependency**: Backend Core Authentication complete before Frontend auth flows
- **📋 M1.2 Dependency**: Backend Registration system ready for Frontend UI coordination
- **📋 M1.4 Dependency**: Backend RBAC policies complete before Frontend role-based UI
- **📋 M1.5 Dependency**: Backend Verification workflow ready for Frontend UI components
- **📋 M1.6 Dependency**: Backend Security features complete before Frontend MFA interfaces

---

## 🛡️ Quality Gates & Standards {#quality-gates}

### Layer 1 Quality Standards Definition (NON-NEGOTIABLE)

**Technical Quality Requirements** (适用于所有Layer 2&3实施):
- **TypeScript**: >95% coverage with strict mode, zero `any` types
- **Performance**: Core Web Vitals compliance, Lighthouse Score >95
- **Accessibility**: WCAG 2.1 AA compliance validation
- **ACD Compliance**: 敏捷组件驱动开发，灵活测试策略，保持MVP开发效率
- **Testing**: >90% component coverage, 100% user workflow coverage, 功能测试套件完整

**Security & Compliance Standards** (强制传递到所有层级):
- **Privacy**: Zero patient PII in frontend, anonymous identifiers only
- **Authentication**: Supabase Auth exclusively, no custom JWT
- **Data Access**: Supabase Client + RLS policies, no direct SQL

**IRG Module Integration Standards** (强制传递到所有层级):
- **EdgeFunctionAdapter**: 统一API消费适配器，严格遵循`docs/api/APIv1.md`契约
- **User Participation**: Dev-Steps 3.3/3.6用户参与阶段强制执行和结果记录
- **Cross-Browser Verification**: 使用Playwright进行自动化跨浏览器验证（Chromium/WebKit/Firefox）
- **Integration Documentation**: 在`PRP-MX.Y_LOG.md`中完整记录IRG验证结果

### 轻量级验证触发机制 (v6.0简化版)

**简化验证策略**:
```yaml
Simplified_Validation_Chain:
  1. Phase内所有原子任务完成
  2. 自动执行基础验证（test/lint/build）
  3. 通过 → 进入下一Phase
  4. 失败 → 人工review创建修复任务
```

**敏捷失败处理**:
- **基础验证失败** → 人工识别问题，创建简单修复任务
- **修复任务执行** → 使用4步ACD循环模式解决（分析-实现-验证-集成）
- **持续改进** → 基于实际执行数据定期优化验证标准

**Implementation Commands**: See `DevEnv.md#commands` for all quality gate commands

---

## 🎯 Risk Management {#risks}

### Critical Frontend Risks
- **API Dependency**: Frontend blocked without `~/APIdocs/APIv1.md`
- **Privacy Compliance**: Any patient PII handling violates GDPR/HIPAA
- **Performance Risk**: Large bundle sizes affecting Core Web Vitals
- **Browser Compatibility**: Cross-browser testing for medical compliance

### Mitigation Strategies
- **API Documentation**: Enforce dependency checkpoints
- **Privacy Validation**: Automated PII detection in CI/CD
- **Performance Monitoring**: Bundle analysis and Core Web Vitals tracking
- **Testing Strategy**: Comprehensive cross-browser test coverage

---

## 📋 M1 Technical Guidelines {#m1-technical-guidelines}

### Supabase-First Frontend Architecture
**Compliance Requirements**: Align with M1 Backend architecture decisions
- Supabase Auth client integration for all M1 authentication flows
- Supabase Client direct integration (no custom HTTP clients for M1 modules)
- RLS policy compliance in all M1 user data access patterns
- Real-time subscription integration for user status updates
- Zero patient PII architecture maintained across all M1 UI components
- HIPAA compliance validation for all M1 user interface elements

---

## 📋 Document Ownership & Governance {#ownership}

**Document Owner**: Frontend Development Team  
**Last Updated**: [Current Date]  
**Review Cycle**: Weekly during active development  
**Status**: Active Frontend Development Phase  

### Change Management
- **Strategic changes** (architecture/constraints): Update this document first
- **Execution changes**: Update `.claude/CLAUDE.md` or `PRPs/TASK0x.md` 
- **Environment changes**: Update `DevEnv.md`
- **API changes**: Backend team updates `~/APIdocs/APIv1.md`

**Document References**: [`INITIAL.md`](./INITIAL.md) (Navigation) | [`.claude/CLAUDE.md`](./.claude/CLAUDE.md) (Execution) | [`DevEnv.md`](./DevEnv.md) (Environment) | [`PRPs/TASK0x.md`](./PRPs/) (Tasks)

### Changelog {#changelog}
- **v1.0**: Initial strategic plan established
- **v1.1**: Document boundaries clarified, removed execution details
- **v1.2**: Consolidated environment details to DevEnv.md, enhanced reference index
- **v1.3**: Enhanced Layer 1 responsibilities with v5.0 framework compliance
  - Added Layer 1 协调接口机制 with YAML protocol definition
  - Established 智能质量门控标准定义 with three-level system
  - Enhanced Component Type分类标准 for quality gate mapping
  - Improved 技术架构决策传递机制 with clear validation chain
- **v6.0**: Agile framework upgrade for MVP development efficiency
  - Simplified AI Agent estimation from four-dimensional to direct indicators
  - Replaced three-tier quality gates with unified Phase completion validation
  - Removed complex Component Type classification system
  - Simplified Layer 1 coordination interface to basic constraint propagation
  - Implemented lightweight validation trigger mechanism for agile development
 - **v6.1**: IRG integration enhancements
   - Added "IRG Status" column to M1 PRP Index
   - Added IRG integration requirements to Layer 2 UI/UX decomposition
   - Added IRG Module Integration Standards to Quality Gates

---

**This PLANNING.md serves as the M1 PRP Index for frontend development. Strategic governance is centralized in global documents (`~/INITIAL.md`, `~/SOP.md`, `~/GOVERNANCE.md`), execution details are in individual PRP files, and technical workflows are in `FRONTEND_PLAYBOOK.md`.**