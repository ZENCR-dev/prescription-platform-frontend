# PLANNING.md - Frontend Development Strategic Plan
## Medical Prescription Platform - Frontend Layer Strategy

> **📋 Document Boundaries & References**
> 
> This document contains **strategic constraints and upper-level requirements only**:
> - Execution rules & workflows: see `CLAUDE.md`
> - Task navigation & progress: see `INITIAL.md`
> - Development environment/ports/CORS/commands: see `DevEnv.md`
> - Page/component/data contracts & acceptance: see `PRPs/TASK0x.md`
> - API contracts: see `~/APIdocs/APIv1.md` & `APIv1_log.md`

**Document Type**: Strategic Planning Document (Layer 1)  
**Project**: Traditional Chinese Medicine Prescription Platform - Frontend UI/UX  
**Architecture**: Supabase-First Frontend Integration  
**Timeline**: 7-Week Frontend MVP Delivery  
**Repository Scope**: Frontend UI/UX Development Only  

---

## 🎯 Executive Summary {#executive-summary}

### Frontend Mission Statement
Build a production-ready, accessible, and privacy-compliant frontend interface that enables Traditional Chinese Medicine practitioners and pharmacies to create, manage, and fulfill prescriptions through an intuitive, responsive user experience.

### Key Success Metrics
- **UI/UX Excellence**: Responsive design across all devices with WCAG 2.1 AA compliance
- **Development Velocity**: 60-80% time savings through strategic component reuse
- **Supabase Integration**: 100% client-side integration with Auth, Realtime, and Storage
- **Performance Standards**: <3s load time, Core Web Vitals compliance, 95%+ Lighthouse scores
- **Backend Coordination**: Seamless API integration following established protocols

---

## 🏛️ 三层任务树协作开发系统 - Layer 1 定义 {#task-tree-layer1}

### 本文档在任务树架构中的定位

**PLANNING.md 职责定义**: Layer 1 Feature Level 文档
- **核心责任**: 业务价值定义、技术架构决策、质量门控标准制定
- **目标受众**: 架构师、项目经理、技术领导
- **决策范围**: 战略层面约束、技术选型、合规要求

### 三层任务树架构概览

```
Layer 1: Feature Level (本文档 - PLANNING.md)
├── 业务价值定义 → Frontend Mission Statement
├── 技术架构决策 → Supabase-First Principles & Technology Stack
└── 质量门控标准 → Quality Gates & Security Standards

Layer 2: User Story/Component Level (INITIAL.md + PRPs/TASK0X.md)
├── 具体功能描述 → 每个TASK的objectives和user stories
├── 接口契约定义 → API documentation要求和数据模型
└── 验收标准 → 每个atomic task的acceptance criteria

Layer 3: TDD Atomic Task Sequence (Agent临时生成)
├── 测试驱动开发强制执行 → 红灯-绿灯-重构-验证循环
├── 串行原子任务执行 → 一次只执行一个原子任务的3+1 TDD步骤
├── TDD-Todos临时生成 → 使用TodoWrite工具为当前原子任务创建
└── 完整TDD开发循环 → 3+1 TDD步骤模式 (参见CLAUDE.md)
```

### Layer 1 到 Layer 2 映射关系

本文档的开发阶段与Layer 2执行任务(PRPs/TASK0X.md)的对应关系：

| Layer 1 Development Phase | Timeline | Layer 2 Implementation Tasks | Strategic Objectives |
|---------------------------|----------|------------------------------|---------------------|
| **Phase 1: Foundation Setup** | Week 1 | [`TASK01`](./PRPs/TASK01.md): Next.js + Supabase Foundation<br>[`TASK02`](./PRPs/TASK02.md): Shared Project & AUTH Setup | 建立开发环境和基础架构 |
| **Phase 2: Authentication & UI** | Week 2-4 | [`TASK03`](./PRPs/TASK03.md): AUTH System Migration<br>[`TASK04`](./PRPs/TASK04.md): Database & RLS Policies<br>[`TASK05`](./PRPs/TASK05.md): Component Migration | 实现核心认证和UI组件 |
| **Phase 3: Data Integration** | Week 5 | [`TASK06`](./PRPs/TASK06.md): Edge Functions & Payment<br>[`TASK07`](./PRPs/TASK07.md): Realtime & Notifications | 完成后端数据集成 |
| **Phase 4: Production Deployment** | Week 6-7 | [`TASK08`](./PRPs/TASK08.md): Production Deployment<br>[`TASK09`](./PRPs/TASK09.md): Quality Assurance & E2E Testing | 生产环境部署和质量保证 |

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

### Git分支管理架构策略 (NON-NEGOTIABLE)

**三层分支映射原则**:
- **Branch 1 (Main)**: 预备发布版本，仅接收完整TASK文档合并
- **Branch 2 (TASK0X)**: 任务文档分支，聚合Phase级别进度  
- **Branch 3 (Date)**: 原子任务分支，执行3+1步骤开发循环

**架构约束**:
- **Branch命名规范**: main, TASK01-TASK09, YYYY-MM-DD-HHMM
- **分支数量控制**: 最多11个分支 (1+9+1)
- **合并策略**: 使用--no-ff保持历史，通过质量验证后合并

**Layer 1决策传递**:
- 所有Layer 2和Layer 3必须遵循此分支架构约束
- Git操作必须与三层任务树状态同步
- 违反分支管理策略视为架构违规

### 强制性分支操作协议 (MANDATORY PRE-OPERATION PROTOCOLS)

**Phase 1: 操作前强制验证** (3步验证循环):
```yaml
Pre_Operation_Validation_Protocol:
  步骤1_本地分支状态检查:
    - git status 验证工作目录清洁
    - git branch -vv 检查本地分支追踪状态
    - 确认当前分支与预期操作分支一致
  步骤2_远程分支同步验证:
    - git fetch origin 获取最新远程状态
    - git log --oneline -10 对比本地与远程commit历史
    - 验证本地分支领先或等同于对应远程分支
  步骤3_分支版本一致性确认:
    - 确认main分支不领先于TASK分支
    - 验证TASK分支包含所有本地开发进度
    - 检查不存在未追踪的重要文件变更
```

**Phase 2: 远程分支管理策略** (4步管理流程):
```yaml
Remote_Branch_Management_Strategy:
  步骤1_本地优先原则执行:
    - 本地开发进度必须始终领先或等同于远程分支
    - 禁止远程分支领先本地TASK分支的情况
    - 发现版本倒置时立即暂停操作并分析原因
  步骤2_三层分支推送策略:
    - Branch 3推送: git push -u origin YYYY-MM-DD-HHMM
    - Branch 2合并: 合并Branch 3到TASK0X后推送更新
    - Branch 1保护: 仅通过PR方式合并完整TASK到main
  步骤3_分支健康状态监控:
    - 定期检查远程分支与本地分支的同步状态
    - 监控未合并的分支数量不超过架构限制
    - 确保分支命名规范和生命周期管理合规
  步骤4_冲突预防与解决:
    - 操作前执行强制验证避免版本冲突
    - 发现问题时使用git log分析分支分歧点
    - 建立标准化冲突解决流程和回滚机制
```

**Phase 3: 操作执行与验证** (2步执行验证):
```yaml
Operation_Execution_Validation:
  步骤1_Git操作执行:
    - 按照验证通过的计划执行Git操作
    - 使用--no-ff保持分支历史完整性
    - 每步操作后立即验证预期结果
  步骤2_操作后状态确认:
    - git status确认操作成功完成
    - git log --graph验证分支历史结构正确
    - 更新INITIAL.md Progress Tracker分支状态
```

**估算标准**: 完整协议执行需要9步操作 (3+4+2步验证管理流程)，适合所有Git分支操作的标准化预防性检查。

---

## 📅 Development Roadmap {#roadmap}

### Phase 1: Foundation Setup (Week 1)
**Deliverable**: Fully operational frontend development environment
**Reference**: Environment setup details in `DevEnv.md`

**Milestones**:
- Next.js 14 + Supabase starter kit initialization
- TypeScript configuration and Supabase type generation
- Component library setup and development toolchain

### Phase 2: Authentication & UI Components (Week 2-4)
**Deliverable**: Complete authentication UI and core components

**Milestones**:
- Supabase Auth UI integration
- Component migration from `recycle/` directory
- Anonymous prescription creation UI (GDPR/HIPAA compliant)

### Phase 3: Data Integration (Week 5) {#phase-3-data-integration}
**Deliverable**: Complete frontend-backend data integration

**🚨 BACKEND COORDINATION REQUIRED**: 
- **API Documentation**: Must receive `~/APIdocs/APIv1.md` before proceeding
- **No Self-Mocking**: Frontend cannot proceed without official API specifications

### Phase 4: Production Deployment (Week 6-7)
**Deliverable**: Production-ready frontend with comprehensive testing

---

## 🔄 Backend Coordination Protocol {#syncpoints}

### API Documentation Requirements
**Single Source of Truth**: `~/APIdocs/APIv1.md`
- **Maintained by**: Backend development team
- **Frontend Dependency**: Cannot proceed with API integration without this documentation
- **No Self-Mocking**: Frontend must wait for official API specifications

### Critical Synchronization Points {#syncpoints-detail}
- **🔄 Sync Point A**: Week 3 - Data model alignment
- **🔄 Sync Point B**: Week 4 - API contract review  
- **🔄 Sync Point C**: Week 5 - Edge Functions integration
- **🔄 Sync Point D**: Week 6 - Production API validation

---

## 🛡️ Quality Gates & Standards {#quality-gates}

### Layer 1 Quality Standards Definition (NON-NEGOTIABLE)

**Technical Quality Requirements** (适用于所有Layer 2&3实施):
- **TypeScript**: >95% coverage with strict mode, zero `any` types
- **Performance**: Core Web Vitals compliance, Lighthouse Score >95
- **Accessibility**: WCAG 2.1 AA compliance validation
- **TDD Compliance**: 强制测试驱动开发，先写测试后写实现，禁止跳过TDD流程
- **Testing**: >90% component coverage, 100% user workflow coverage, TDD测试套件完整

**Security & Compliance Standards** (强制传递到所有层级):
- **Privacy**: Zero patient PII in frontend, anonymous identifiers only
- **Authentication**: Supabase Auth exclusively, no custom JWT
- **Data Access**: Supabase Client + RLS policies, no direct SQL

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
- **修复任务执行** → 使用3+1 TDD步骤模式解决（红灯-绿灯-重构-验证）
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
- **API Documentation**: Enforce coordination checkpoints
- **Privacy Validation**: Automated PII detection in CI/CD
- **Performance Monitoring**: Bundle analysis and Core Web Vitals tracking
- **Testing Strategy**: Comprehensive cross-browser test coverage

---

## 📋 Component Reuse Strategy {#component-reuse}

### Legacy Component Migration (from `recycle/`)
**Adaptation Requirements**: See `CLAUDE.md#legacy-component-migration` for complete procedure
- Remove all patient PII fields completely
- Replace API calls with Supabase Client calls
- Add RLS policy integration
- Implement Supabase Realtime subscriptions
- Test with anonymized data only
- Validate privacy compliance

---

## 📋 Document Ownership & Governance {#ownership}

**Document Owner**: Frontend Development Team  
**Last Updated**: [Current Date]  
**Review Cycle**: Weekly during active development  
**Status**: Active Frontend Development Phase  

### Change Management
- **Strategic changes** (architecture/constraints): Update this document first
- **Execution changes**: Update `CLAUDE.md` or `PRPs/TASK0x.md` 
- **Environment changes**: Update `DevEnv.md`
- **API changes**: Backend team updates `~/APIdocs/APIv1.md`

**Document References**: [`INITIAL.md`](./INITIAL.md) (Navigation) | [`CLAUDE.md`](./CLAUDE.md) (Execution) | [`DevEnv.md`](./DevEnv.md) (Environment) | [`PRPs/TASK0x.md`](./PRPs/) (Tasks)

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

---

**This PLANNING.md serves as the authoritative strategic specification for frontend development. All execution details and environment configuration are maintained in linked documents to prevent duplication and ensure single source of truth.**