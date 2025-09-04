# FRONTEND_PLAYBOOK.md - Frontend Workspace Governance Projection

> **📋 Document Purpose**: Self-contained governance projection enabling frontend workspace execution without external dependencies

**Version**: v3.1 - Self-Contained Governance Projection  
**Status**: ✅ Access Constraint Compliant  
**Role**: Complete frontend execution guidance via embedded global governance content  

---

## 📝 Changelog

**v3.1 (2025-08-26)**: Self-contained governance projection with embedded content
- Fixed: Removed all inaccessible external links to global documents
- Added: Embedded essential governance content from global framework
- Created: Self-contained projection accessible within frontend workspace only

**v3.0**: Governance projection with external links (deprecated - access violations)
**v2.0**: Legacy PRP generation guide (archived)

---

## 🏗️ Frontend Layer Execution Framework (Workspace Implementation)

> **📋 Framework Reference**: Complete three-layer architecture defined in global governance documents. This section provides frontend-specific implementation guidance only.

### **Frontend Layer Execution Pattern**
```yaml
Frontend_Execution_Flow:
  Layer_1_Navigation: "PLANNING.md → Frontend strategic constraints and API consumption planning"
  Layer_2_Implementation: "PRPs/PRP-M1.X-*.md → Frontend PRP work orders from Global Architect"
  Layer_3_Execution: "TodoWrite todos → Frontend 4-Step QAD cycles with strict zero-mock API compliance"

Frontend_Specific_Responsibilities:
  API_Consumer_Role: "Read-only consumption of Global Architect distributed API documentation"
  Quality_Gates: "Module Exit Criteria (MEM) validation + API integration verification"
  Integration_Points: "Backend-First dependency timing + UI/UX implementation"
```

---

## 🎯 Global Governance Framework (Embedded Content)

### Core Constitutional Principles

**Value Stream Delivery Principle**:
All development work is organized into **Milestones**, which represent complete, end-to-end slices of business value that are independently testable and deliver tangible user outcomes. Progress tracking is based on Milestone completion, not individual task completion.

**Backend-First & Contract-Driven Collaboration Principle**:
The backend delivers a stable, documented API contract **before** the frontend begins development, creating a clear and reliable interface between teams.

**Implementation Protocol**:
1. Backend API design and documentation completion
2. Frontend contract review and approval  
3. Backend implementation and testing
4. API documentation finalization
5. Frontend development commencement
6. Integration testing and validation

**API Documentation Consumer Role Mandate**:
Frontend workspace consumes API documentation distributed by Global Architect from Backend source. Frontend maintains read-only access to local `docs/api/APIv1.md` with version-specific integration tracking and feedback mechanisms.

**Zero Patient PII Mandate**:
The **inviolable architectural and ethical constraint** that the system must not store or process any personally identifiable patient information. The platform operates on prescription fulfillment, not patient care, through anonymous QR code access.

### "Deal the Card" PRP Distribution System

**Core Principle**: Frontend team RECEIVES PRP work orders via global "Deal the Card" mechanism. Frontend team NEVER generates PRPs.

**Distribution Protocol**:
```yaml
Distribution Criteria:
  Module_Readiness: Previous module MEM satisfaction required
  Workspace_Capacity: Team bandwidth validation
  Dependency_Satisfaction: All upstream dependencies completed

Distribution Process:
  1. MEM_Validation: Previous module completion verified
  2. PRP_Generation: Module-specific PRP created from official template
  3. Workspace_Placement: PRP file placed in frontend workspace /PRPs/ directory
  4. Team_Notification: Frontend team notified with implementation expectations
  5. Progress_Monitoring: Implementation tracking and status updates
```

**PRP Template Structure (Layer 2 Tactical Documents for Frontend)**:
```markdown
# PRP-MX.Y-ModuleName.md

## **Architect Zone (Immutable Section - Layer 1战略到Layer 2传递)**
- Milestone Context & Business Value (from Layer 1 PLANNING.md)
- Module Objectives & Success Criteria (Layer 1 Frontend战略约束)
- Technical Constraints & Dependencies (Layer 1架构决策，Backend-First原则)
- Module Exit Criteria (MEM) - Layer 2到Layer 1验证要求，API消费验证标准

## **Engineer Zone (Flexible Implementation Section - Layer 2到Layer 3 Frontend指导)**
- Component Breakdown & Implementation Plan (Layer 3 Frontend原子任务分解指导)
- Testing Strategy & Quality Assurance (Layer 3 Frontend质量验证标准)
- Risk Assessment & Mitigation (Layer 3 Frontend执行风险控制，零Mock API)
- Timeline & Resource Allocation (Layer 3 TodoWrite估算指导，Backend依赖时序)

## **Layer 3 Frontend执行集成要求**
- 4-Step QAD Cycle Integration: 研究设计 → 实现验证 → 测试优化 → 提交更新
- TodoWrite Usage Standards: Frontend Lead使用TodoWrite创建Frontend原子任务todos
- Git Branch Mapping: Frontend PRP对应task/module分支，Frontend todos对应atomic/component分支
- API Consumption Only: 严禁Mock API，仅消费Global Architect分发的API文档
```

---

## 🚨 Frontend-Specific Governance Adaptations

### PRP Reception and Execution (NOT Generation)

**Reception Workflow**:
1. **Global Architect** distributes PRP work order to `PRPs/PRP-MX.Y-*.md`
2. **Frontend Team Lead** receives PRP and initiates execution
3. **AI Agent** executes 4-Step QAD Cycle for atomic tasks within PRP
4. **Team Lead** validates completion against Module Exit Criteria (MEM)

### 4-Step QAD (Quality Assurance Driven) Cycle Execution

**Standard Execution Pattern**:
```yaml
Step 1 - Research & Design: 
  - MCP tools integration + React/Next.js best practices discovery
  - Component architecture planning + Supabase Client integration patterns
  - Accessibility requirements analysis + performance optimization research

Step 2 - Implement & Validate: 
  - React/Next.js component implementation + TypeScript integration
  - Supabase Client SDK integration (no direct database access)
  - UI component creation + responsive design implementation

Step 3 - Test & Optimize: 
  - End-to-end testing with Playwright + unit testing with Jest
  - Performance optimization + Core Web Vitals validation  
  - Accessibility validation (WCAG 2.1 AA) + cross-browser testing

Step 4 - Commit & Update: 
  - Quality gates validation + code review completion
  - Git commit with proper naming + development log updates
  - Progress tracking + MEM validation preparation
```

### Frontend Core Constraints

**🚨 ABSOLUTE PROHIBITIONS**:
- **Zero Self-Mocking**: NEVER create fake APIs or mock endpoints - violates Backend-First Collaboration
- **Zero API Generation**: NEVER modify API documentation - Backend exclusive authority
- **Zero Direct DB Access**: NEVER bypass Supabase Client for direct database operations
- **Zero PRP Generation**: NEVER create own PRP work orders - Global Architect exclusive

**✅ MANDATORY REQUIREMENTS**:
- **Backend-First Compliance**: Wait for Backend API contract completion before development
- **API Consumer Role**: Exclusively consume API specifications from backend documentation
- **Module Exit Criteria**: Complete all atomic tasks before MEM validation
- **Quality Gates**: Pass all validation steps per quality framework

### Three-Workspace API Governance (Frontend Perspective)

**Frontend Lead API Consumer Role**:
```yaml
Read_Only_Access:
  - Frontend workspace docs/api/APIv1.md is distributed by Global Architect
  - No modification rights to API documentation files
  - Version-controlled consumption with integration tracking
  - Structured feedback mechanism through architect coordination channel

Integration_Operations:
  - Consume latest APIv1.md distributed by Global Architect
  - Analyze version changes and assess frontend integration impact
  - Implement frontend code based on certified API specifications
  - Report API usage issues through proper feedback channels
  
Documentation_Protocol:
  - No direct modification of APIv1.md (read-only consumption)
  - Record version understanding and integration notes in APIv1_log.md
  - Document frontend-specific API usage patterns and constraints
  - Maintain integration testing results and compatibility matrices
```

**APIv1_log.md Content (Frontend Integration Focus)**:
```yaml
Version_Consumption_Analysis:
  - New API version reception and acknowledgment records
  - Version change analysis and frontend integration impact assessment
  - API integration development progress and testing results
  - Frontend-specific usage issues and feedback for architect review
  - Cross-version compatibility testing and migration notes
```

**Global Architect Coordination Interface**:
- **Version Reception**: Receive new API versions distributed by Global Architect
- **Change Analysis**: Assess impact of API changes on frontend integration
- **Feedback Channel**: Provide structured feedback on API usage through architect
- **Integration Support**: Request clarification on API specifications when needed

---

## 🔗 Integration Readiness Gate (IRG) - Frontend Module/PRP Integration Standards

### IRG定义（Module/PRP层级）
- IRG面向 Module/PRP 的集成验证，不在 4-Step QAD 原子任务层级执行。
- 目标：在模块完成后统一验证 API 集成、用户体验和跨浏览器兼容，确保“可集成、可发布”。

### 成功实践基线（M1.1/M1.2）
- 采用 EdgeFunctionAdapter 的统一 API 消费模式作为前端集成基线。
- 以 M1.1/M1.2 已验证流程为参照：统一入口调用、错误与边界条件集中处理、契约遵循 `docs/api/APIv1.md`。

### 用户参与强制要求（与Layer 2保持一致）
- Dev-Steps 3.3：原型评审与用户反馈收集（【强制】）。
- Dev-Steps 3.6：UI 测试与体验优化（【强制】）。
- 两个用户参与节点的结论需在模块 IRG 验证时复核并纳入结果记录。

### 前端IRG职责
- 使用 EdgeFunctionAdapter 进行统一 API 消费与异常治理。
- 执行跨浏览器验证（Desktop/Mobile 主流浏览器，自动化优先）。
- 复核 UI/UX 达标（可访问性、响应式、交互一致性）。
- 严格遵循已分发的 API 契约文档（`docs/api/APIv1.md`）。

### 与 4-Step QAD 的关系
- 4-Step QAD：聚焦原子任务/组件级质量（实现、测试、优化、提交）。
- IRG：在模块级执行最终集成验证，确保组件“组合为模块”后可用、可集成。

### 技术实现规范
```yaml
EdgeFunctionAdapter:
  role: "前端统一API调用适配器层，集中处理契约、错误、重试与可观测性"
  contract: "严格消费 docs/api/APIv1.md，禁止自定义或修改契约"

User_Involvement:
  required_steps:
    - 3.3: 原型评审 + 反馈收集
    - 3.6: UI测试 + 体验优化
  recording: "将关键反馈与结论写入 PRP-MX.Y_LOG.md"

Cross_Browser_Verification:
  tool: "Playwright"
  scope: [Chromium, WebKit, Firefox]
  device_profiles: [Desktop, Mobile]
  result: "输出自动化报告并在IRG记录中归档"
```

### 质量验证要求（IRG Gate）
```yaml
IRG_Trigger:
  when: "Module内所有 4-Step QAD 原子任务均完成后"

IRG_Checklist:
  - API集成: "EdgeFunctionAdapter 调用全通过，错误处理可控，契约符合 APIv1.md"
  - 用户体验: "可访问性(≥WCAG 2.1 AA)、响应式、关键交互一致性达标"
  - 跨浏览器: "Playwright 全套用例通过(Chromium/WebKit/Firefox, 桌面+移动)"
  - 性能: "核心页面符合性能预算与Core Web Vitals 目标"

Documentation:
  log: "所有IRG验证结果必须记录在 PRP-MX.Y_LOG.md（含失败项与修复记录）"
  decision: "通过 → 标记模块为 Integration Ready；不通过 → 进入模块修复与重验证"
```

---

## 📊 Engineering Unit Definitions (EUDs) - Objective Effort Estimation System

### **EUDs概念定义**
Engineering Unit Definitions (EUDs) 是一套**客观、可计算的工程量度系统**，用于替代主观的时间预估，实现基于工作量本质的精确规划和进度跟踪。

### **EUDs四层架构体系**
```yaml
# EUD层次结构 (自顶向下)
Milestone (里程碑级):
  definition: "完整的端到端业务价值交付单元"
  composition: "3-7个Module组成"
  example: "M1: 核心认证与用户管理系统"
  
Module (模块级):
  definition: "里程碑内的功能组件单元"
  composition: "5-15个Component组成"
  example: "M1.2: 用户注册客户端集成, M1.3: 角色访问控制UI"
  
Component (组件级):
  definition: "模块内的技术实现单元"
  composition: "3-8个Dev-Step组成"
  example: "认证UI组件, 会话管理组件, 路由保护组件"
  
Dev-Step (原子级):
  definition: "最小工作单元 = 一个完整的4-Step QAD循环"
  composition: "Research → Implement → Test → Commit"
  example: "一个完整的研究-实现-测试-提交周期"
```

### **EUDs计算规则**
```yaml
# 标准计算公式
Dev-Step = 1 complete 4-Step QAD Cycle:
  - 1 Research phase (需求分析和技术方案)
  - 1 Implementation phase (功能实现)
  - 1 Testing phase (质量验证)
  - 1 Commit phase (代码提交和文档更新)

Component = 3-8 Dev-Steps:
  - Simple Component: 3-4 Dev-Steps
  - Medium Component: 5-6 Dev-Steps  
  - Complex Component: 7-8 Dev-Steps

Module = 5-15 Components:
  - Foundation Module: 5-8 Components
  - Integration Module: 9-12 Components
  - Complex Module: 13-15 Components

Milestone = 3-7 Modules:
  - MVP Milestone: 3-4 Modules
  - Feature Milestone: 5-6 Modules
  - Platform Milestone: 7 Modules
```

### **EUDs替代时间预估的核心原理**

**传统时间预估的问题**:
- ❌ **主观性**: "这个组件大概需要3天" (基于个人经验，难以验证)
- ❌ **不可比较**: 不同开发者的"1天"工作量差异巨大
- ❌ **难以追踪**: 时间流逝但工作量完成度不明确
- ❌ **积累偏差**: 多个不准确估算累积导致项目延期

**EUDs客观预估的优势**:
- ✅ **客观可量化**: "这个组件需要12个Dev-Steps" (明确的工作量单位)
- ✅ **标准化**: 每个Dev-Step都是标准的4-Step QAD循环
- ✅ **可验证**: 可以实时统计完成的Dev-Steps数量
- ✅ **可预测**: 基于历史数据的Dev-Step完成速率进行预测

### **EUD-to-Time通信映射系统**

**内部规划**: 纯EUD单位
```yaml
# 内部开发规划 (团队使用)
Project Planning:
  - Module M1.2: 28 Dev-Steps  
  - Module M1.3: 22 Dev-Steps
  - Module M1.4: 18 Dev-Steps
  Total: 68 Dev-Steps
```

**外部沟通**: EUD转换为时间区间
```yaml
# 沟通兼容层 (对外报告)
Communication Formula:
  Team Velocity: X Dev-Steps per week (基于历史数据)
  Time Range: EUDs ÷ Velocity = Weeks
  
Example Calculation:
  - Frontend Velocity: 12 Dev-Steps/week (前端开发速率)
  - Remaining Work: 68 Dev-Steps
  - Time Estimate: 68 ÷ 12 = 5.7 weeks
  - Communication: "预计5-7周完成" (加入缓冲区间)

# 动态调整机制
Velocity Tracking:
  - 每周更新实际完成的Dev-Steps
  - 重新计算剩余时间区间
  - 基于数据调整预期而非主观判断
```

### **EUDs实际应用指南**

**1. 任务分解阶段**:
```yaml
Breakdown Process:
  Business Requirement → Milestone (business value)
  Milestone → Modules (functional units)
  Module → Components (technical units)  
  Component → Dev-Steps (atomic work units)
  
Example - M1.2 Auth Client Integration:
  - Component 1: @supabase/ssr Integration (5 Dev-Steps)
  - Component 2: Next.js Middleware Setup (4 Dev-Steps)
  - Component 3: Auth UI Components (6 Dev-Steps)
  - Component 4: Route Protection (3 Dev-Steps)
  Total: 18 Dev-Steps
```

**2. 进度追踪阶段**:
```yaml
Progress Tracking:
  Completed Dev-Steps: 8/18 (44%)
  Current Velocity: 2.5 Dev-Steps/day
  Remaining Work: 10 Dev-Steps
  Estimated Completion: 4 days (10÷2.5)
  
Status Communication:
  Internal: "M1.2模块完成44%, 剩余10个Dev-Steps"
  External: "M1.2模块预计4-5天内完成"
```

**3. 质量验证阶段**:
```yaml
Quality Validation:
  - Each Dev-Step must complete full 4-Step QAD cycle
  - No partial Dev-Step completion allowed
  - Component completion = All Dev-Steps completed + validated
  - Module completion = All Components completed + integration tested
```

### **EUDs与AI Agent估算系统的关系**

**AI Agent简化估算**是EUDs的**实用简化版本**，用于快速评估:
```yaml
# AI Agent估算 → EUD映射
AI Estimation Dimensions → EUD Conversion:
  步骤数量 (3-15步) → Dev-Steps直接对应
  代码文件 (1-10个) → Component复杂度指标
  迭代轮次 (1-3轮) → 质量验证轮次
  复杂度 (低/中/高) → Dev-Steps per Component调整系数
  
Conversion Formula:
  EUD Dev-Steps = 步骤数量 × 复杂度系数
  - 低复杂度: 系数1.0
  - 中复杂度: 系数1.3  
  - 高复杂度: 系数1.6
```

### **Frontend Lead使用EUDs的标准流程**

**Phase 1: PRP接收和EUD分解**
```bash
1. 接收Global Architect分发的Frontend PRP任务
2. 分析PRP需求，按EUD架构分解:
   - 识别需要创建的Frontend Components
   - 估算每个Component的Dev-Steps数量
   - 计算总EUD工作量
3. 记录EUD分解到PRP执行日志
```

**Phase 2: EUD驱动的4-Step QAD执行**
```bash
1. 按Dev-Step为单位创建TodoWrite todos
2. 每个Dev-Step执行完整4-Step QAD循环
3. 实时更新完成的Dev-Steps计数
4. 基于实际完成速率调整剩余预估
```

**Phase 3: EUD完成验证和汇报**
```bash
1. 验证所有Dev-Steps完整完成
2. 计算实际vs预估的EUD偏差
3. 向Global Architect汇报Module完成状态
4. 更新团队EUD速率历史数据
```

### **Frontend Lead特定的EUD考虑**

**API消费依赖的EUD计算**:
```yaml
API-Dependent Components:
  Backend API Ready: 标准EUD计算 (如上所述)
  Backend API Pending: EUD × 1.5 (等待Backend的缓冲系数)
  Mock API Prohibited: 无法计算EUD (违反Backend-First原则)
  
Example:
  - Auth UI Component (Backend Ready): 6 Dev-Steps
  - Profile Component (Backend Pending): 4 × 1.5 = 6 Dev-Steps
  - Custom API Component: 不可估算 (违规，需Global Architect协调)
```

**Frontend质量验证的EUD增强**:
```yaml
Frontend-Specific Quality Gates:
  - Accessibility Testing: +1 Dev-Step per UI Component
  - Cross-browser Validation: +1 Dev-Step per complex Component  
  - Mobile Responsiveness: +1 Dev-Step per layout Component
  - Performance Optimization: +1 Dev-Step per data-heavy Component
  
Adjusted EUD Calculation:
  Base Component EUDs + Quality Enhancement EUDs = Total Frontend EUDs
```

**EUDs成功应用的关键要素**:
- ✅ **标准化**: 严格遵循4-Step QAD循环定义Dev-Step
- ✅ **可验证**: 每个Dev-Step有明确的完成标准
- ✅ **数据驱动**: 基于历史EUD速率数据调整预测
- ✅ **持续改进**: 定期回顾EUD预估准确性并优化
- ✅ **Backend-First遵循**: Frontend EUDs必须考虑Backend API依赖时序

---

## 🔧 Frontend Execution Standards

### Branch Naming Convention (Unified Standard)
```bash
# Atomic task branches (consistent with backend)
^prp-m1\.[1-6]-[a-z0-9-]+-atomic-[0-9]{3}$

# Examples:
prp-m1.3-profile-frontend-atomic-001
prp-m1.4-dashboard-ui-atomic-002
```

### Development Log Standards
```markdown
# Log file naming: PRPs/PRP-MX.Y-*_LOG.md
# Format: [YYYY-MM-DD HH:MM:SS] 🎯 QAD-Step - PRP-MX.Y-ModuleName
```

### Technology Stack Boundaries
```yaml
Frontend Exclusive Technologies:
  - Next.js 14 + App Router: Complete frontend framework
  - React Components + TypeScript: UI component architecture
  - Supabase Client SDK: Database interaction (not direct DB access)
  - Tailwind CSS + UI Libraries: Styling and design system
  - Frontend Testing: Jest unit tests + Playwright E2E testing

Shared Technologies (Backend Configured, Frontend Consumed):
  - Supabase Auth: Authentication system integration
  - Supabase Realtime: Real-time data subscriptions
  - Supabase Storage: File storage operations

Prohibited Technologies:
  - Direct PostgreSQL connections: Backend exclusive
  - RLS policy modifications: Backend exclusive  
  - Edge Functions development: Backend exclusive
  - API specification modifications: Backend exclusive
```

---

## 🛡️ Compliance and Validation Framework

### Quality Gates (Embedded Global Framework)
```yaml
Pre-Implementation Quality Gates:
  - PRP received from Global Architect ✓
  - Backend API contract available and validated ✓
  - No mock APIs or fake endpoints planned ✓
  - Component architecture aligned with business requirements ✓

Implementation Validation Gates:
  - 4-Step QAD Cycle completed for all components ✓
  - Supabase Client integration (no direct database access) ✓
  - Accessibility compliance validated (WCAG 2.1 AA) ✓
  - Performance budget adherence (<3s load time, <500KB initial bundle) ✓
  - Cross-browser compatibility verified ✓

Pre-Commit Validation Gates:
  - Frontend boundary validation passed ✓
  - No API specification modifications attempted ✓
  - All quality gates completed successfully ✓
  - Component testing coverage >80% achieved ✓
```

### Medical Platform Compliance Requirements
```yaml
HIPAA Compliance (Frontend Responsibilities):
  - Zero patient PII in frontend components ✓
  - Anonymous QR code handling without data storage ✓
  - Secure client-side session management ✓
  - Audit trail integration for user actions ✓
  
User Experience Compliance:
  - Accessibility compliance (WCAG 2.1 AA minimum) ✓
  - Mobile responsiveness across all devices ✓
  - Performance optimization (<3s load time on 3G) ✓
  - Error handling with user-friendly messages ✓

Security Compliance (Client-Side):
  - Secure authentication token handling ✓
  - No sensitive data exposure in client code ✓
  - HTTPS-only communication enforcement ✓
  - Cross-site scripting (XSS) prevention ✓
```

---

## 📋 Traditional Chinese Medicine Platform Context

### Business Model Understanding
**Practitioner-Pays Model**: TCM practitioners fund prescription fulfillment from their platform accounts, enabling patients to access traditional medicine through QR codes without payment barriers.

**Frontend Role in Business Flow**:
1. **Practitioner Interface**: Account balance management and prescription creation
2. **QR Code Display**: Anonymous patient access to prescriptions (no login required)
3. **Pharmacy Interface**: QR code scanning and fulfillment workflow

### Medical Platform Specific Requirements
```yaml
TCM Prescription Management:
  - Herb specification interface with dosage controls ✓
  - Traditional medicine database integration ✓
  - Prescription validation and safety checking ✓
  - Professional practitioner workflow optimization ✓

Anonymous Patient Access:
  - QR code scanning without account creation ✓
  - Prescription display with zero PII storage ✓
  - Privacy-first architecture implementation ✓
  - Seamless pharmacy integration workflow ✓

Financial Interface (Practitioner Account):
  - Account balance display and management ✓
  - Real-time cost calculation for prescriptions ✓
  - Transaction history and reporting dashboard ✓
  - NZD currency precision handling ✓
```

---

## 📋 PRP Execution Entry Point

### Active PRP Navigation
- **Current Work Orders**: Check [`PLANNING.md`](PLANNING.md) for active M1 Frontend PRP index
- **PRP Documents**: Execute tasks from `PRPs/PRP-MX.Y-*.md` files
- **Execution Rules**: Follow [`.claude/CLAUDE.md`](.claude/CLAUDE.md) for detailed AI Agent execution protocols

### Backend API Coordination Protocol
```yaml
API Dependency Management:
  - Monitor backend completion status for API contract availability
  - Validate API documentation completeness before development start
  - Report integration issues through proper escalation channels
  - Coordinate with backend team for API contract modifications

Quality Coordination:
  - Align component quality gates with backend Module Exit Criteria (MEM)
  - Coordinate integration testing with backend completion timelines
  - Participate in cross-team quality reviews and validation sessions
```

---

## 🔗 Workspace Reference System

### Execution Documents (This Workspace)
- **Task Navigation**: [`PLANNING.md`](PLANNING.md) - Frontend PRP tracking and status
- **Execution Rules**: [`.claude/CLAUDE.md`](.claude/CLAUDE.md) - AI Agent execution protocols
- **Environment Setup**: [`DevEnv.md`](DevEnv.md) - Development environment configuration

### Archive and History
- **Previous Version**: [`archive/FRONTEND_PLAYBOOK_v3.0.md`](archive/FRONTEND_PLAYBOOK_v3.0.md)

### Validation Scripts (Local Workspace)
- **PRP Boundary Validator**: [`scripts/prp-boundary-validator.sh`](scripts/prp-boundary-validator.sh)
- **API Consistency Checker**: [`scripts/api-consistency-checker.sh`](scripts/api-consistency-checker.sh)

---

**📊 Document Status**: ✅ **Self-Contained Governance Projection** | 🔗 **Access Constraint Compliant** | 🚀 **Frontend Execution Ready**

**🔍 Cross-Workspace Access Test**: Backend Lead successfully accessed and modified this frontend document on 2025-01-20 09:45 UTC - Cross-workspace read/write permissions confirmed functional.

*This document serves as a complete self-contained projection of global governance framework for frontend workspace execution. All essential governance content is embedded to ensure accessibility within workspace boundaries. No external document dependencies required.*