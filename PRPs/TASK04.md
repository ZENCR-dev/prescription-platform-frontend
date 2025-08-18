# TASK04.md - Data Model & RLS Implementation
## Privacy-Compliant Database Schema & Security Policies

**Task Category**: Database & Security  
**Phase**: Week 3 - Core Architecture  
**Priority**: Critical (Enables all data operations)  
  
### AI Agent估算
- **步骤数量**: 22步
- **代码文件**: 8个文件
- **迭代轮次**: 4轮
- **复杂度**: 高
**Prerequisites**: TASK03 (Authentication System Migration) completed successfully  
**Backend Coordination**: 🚨 **REQUIRED** - Cannot proceed without backend data schema confirmation

---

## 🎯 Task Objectives

Complete implementation of privacy-compliant database schema with comprehensive Row Level Security (RLS) policies for Traditional Chinese Medicine prescription platform, ensuring zero patient PII storage and secure data isolation.

### User Stories Served
- **US11**: As a platform architect, I need a comprehensive database schema that supports TCM prescriptions with privacy compliance
- **US12**: As a medical practitioner, I want secure data isolation so my prescription data remains private
- **US13**: As a pharmacy, I want access to relevant prescription data without seeing patient information
- **US14**: As a privacy officer, I want RLS policies enforced so data access is automatically controlled
- **US15**: As a developer, I want clear data models so I can build features with proper data structures

### Success Criteria
- [ ] Complete medical platform database schema with 10+ core tables
- [ ] Traditional Chinese Medicine data structure with categories, properties, meridians
- [ ] Anonymous prescription workflow (prescription_code instead of patient info)
- [ ] Comprehensive RLS policies validated with real user sessions
- [ ] Privacy compliance verified (zero patient PII columns)
- [ ] Performance optimized with proper indexes and relationships

---

## 🔧 统一4步ACD敏捷模板

### 标准4步ACD循环序列
Step_1: 需求分析与设计 (主实现角色: backend)
  - 分析atomic task需求和技术方案
  - 设计实现路径和技术架构
  - 识别依赖关系和潜在风险
  - 确定验证标准和成功指标

Step_2: 实现与自测 (同一主实现角色: backend)
  - 完成功能实现
  - 编写基础单元测试确保功能正确
  - 执行代码格式化和基础lint检查
  - 满足验收标准

Step_3: 集成准备 (同一主实现角色: backend)
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

失败处理: 人工识别问题，创建简单修复任务，使用4步ACD循环解决

### 轻量级验证配置
**验证类型**: 基础检查 (数据安全关键组件)  
**基础检查内容**:
- npm run test 通过
- npm run lint 通过  
- npm run build 通过
- 功能手动验证通过

### SuperClaude优化建议
- **Context7** (`--c7`): Supabase RLS patterns, medical data compliance standards
- **Sequential** (`--seq`): Complex schema analysis, multi-step RLS policy design
- **Architecture Focus**: Database design, security policy implementation

---

## 📋 原子任务分解 (4步ACD循环模式)

### Atomic Task 04.1: 数据库架构设计与规划
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 3个文件
迭代轮次: 3轮
复杂度: 中
```

**4步ACD循环执行**:
1. **需求分析与设计** (architect persona)
   - 分析医疗处方平台数据需求
   - 设计隐私合规的数据结构
   - 规划传统中医数据模型(药材分类、经络属性)
   
2. **实现与自测** (architect persona)
   - 创建10+核心表设计文档
   - 设计匿名处方工作流(prescription_code)
   - 定义外键关系和数据约束
   
3. **集成准备** (architect persona) 
   - 验证与认证系统集成
   - 准备后端团队审查文档
   - 检查隐私合规性要求
   
4. **质量验证与提交** (qa persona)
   - 架构设计完整性验证
   - 隐私合规检查
   - Git提交: `feat(schema): design privacy-compliant database architecture`

**SuperClaude Commands**:
```bash
/sc:design schema --medical --tcm --privacy-compliant
/sc:analyze privacy --compliance --zero-pii
/sc:validate architecture --relationships --constraints
```

**Acceptance Criteria**:
- [ ] 10+ 核心表设计: medicines, prescriptions, practitioner_accounts, pharmacies, purchase_orders
- [ ] 传统中医数据结构: 药材分类、属性、经络归经
- [ ] 匿名处方工作流: prescription_code 代替患者信息
- [ ] 财务跟踪表: 从业者和药房的收入追踪
- [ ] 采购订单和配送工作流支持
- [ ] 合理的外键关系和数据库索引规划
- [ ] 隐私合规验证: 零患者PII字段

**Dependencies**: TASK03 (auth.users表和user_profiles可用)  
**Backend Coordination**: 架构设计必须获得后端团队批准才能实施

---

### Atomic Task 04.2: 数据库迁移文件实现
**AI Agent Estimation**:
```yaml
步骤数量: 5步
代码文件: 2个文件
迭代轮次: 2轮
复杂度: 中
```

**Prerequisites**: Task 04.1架构设计获得后端团队批准

**4步ACD循环执行**:
1. **需求分析与设计** (architect persona)
   - 基于批准的架构设计创建迁移计划
   - 设计数据库创建序列和依赖关系
   - 规划自定义枚举类型和约束
   
2. **实现与自测** (architect persona)
   - 创建Supabase迁移文件
   - 实现所有10+表结构和自定义ENUM类型
   - 添加性能优化索引和约束
   
3. **集成准备** (architect persona) 
   - 在开发环境测试迁移执行
   - 验证表创建和关系完整性
   - 准备生产环境部署文档
   
4. **质量验证与提交** (qa persona)
   - 迁移文件语法和逻辑验证
   - 数据完整性测试
   - Git提交: `feat(migration): implement complete database schema`

**SuperClaude Commands**:
```bash
/sc:implement migration --supabase --schema-complete
/sc:test migration --dev-environment --validate
/sc:validate data-integrity --constraints --performance
```

**Acceptance Criteria**:
- [ ] Supabase迁移文件创建，包含完整架构
- [ ] 所有10+表成功创建，数据类型正确
- [ ] 自定义ENUM类型实现 (medicine_category, prescription_status等)
- [ ] 性能优化索引添加到关键查询字段
- [ ] 外键约束和数据完整性规则强制执行
- [ ] 开发环境迁移测试成功
- [ ] 生产部署文档准备完整

---

### Atomic Task 04.3: 行级安全策略实施
**AI Agent Estimation**:
```yaml
步骤数量: 7步
代码文件: 3个文件
迭代轮次: 3轮
复杂度: 高
```

**4步ACD循环执行**:
1. **需求分析与设计** (architect persona)
   - 分析数据访问权限需求
   - 设计多层级RLS策略架构
   - 规划角色基础访问控制
   
2. **实现与自测** (architect persona)
   - 为所有敏感表实现RLS策略
   - 创建基于用户角色的数据隔离
   - 实现处方数据的从业者隔离
   
3. **集成准备** (architect persona) 
   - 使用真实用户会话测试RLS策略
   - 验证数据隔离有效性
   - 准备安全测试文档
   
4. **质量验证与提交** (qa persona)
   - RLS策略有效性全面测试
   - 安全漏洞检查
   - Git提交: `feat(security): implement comprehensive RLS policies`

**SuperClaude Commands**:
```bash
/sc:design rls-policies --role-based --data-isolation
/sc:implement security --rls --comprehensive
/sc:test security --data-access --penetration
```

**Acceptance Criteria**:
- [ ] 所有敏感表的RLS策略启用
- [ ] 基于用户角色的数据访问控制
- [ ] 从业者只能访问自己的处方数据
- [ ] 药房只能看到分配给他们的订单
- [ ] 管理员具有适当的系统级访问权限
- [ ] 真实用户会话的安全测试通过
- [ ] 数据泄露预防验证

---

### Atomic Task 04.4: TypeScript类型定义与集成
**AI Agent Estimation**:
```yaml
步骤数量: 4步
代码文件: 2个文件
迭代轮次: 2轮
复杂度: 低
```

**4步ACD循环执行**:
1. **需求分析与设计** (architect persona)
   - 基于数据库架构设计TypeScript接口
   - 规划前端数据模型映射
   - 设计类型安全的API调用接口
   
2. **实现与自测** (architect persona)
   - 使用Supabase CLI生成TypeScript类型
   - 创建前端友好的数据模型接口
   - 实现类型安全的查询辅助函数
   
3. **集成准备** (architect persona) 
   - 验证类型定义与数据库架构一致性
   - 测试TypeScript编译和类型检查
   - 准备前端集成文档
   
4. **质量验证与提交** (qa persona)
   - TypeScript类型准确性验证
   - 编译错误检查
   - Git提交: `feat(types): add database TypeScript definitions`

**SuperClaude Commands**:
```bash
/sc:generate types --supabase --typescript
/sc:implement interfaces --frontend-friendly
/sc:validate types --consistency --compile
```

**Acceptance Criteria**:
- [ ] 完整的数据库TypeScript类型定义
- [ ] 前端友好的接口抽象
- [ ] 类型安全的查询辅助函数
- [ ] TypeScript编译无错误
- [ ] 与Supabase客户端完全兼容
- [ ] 前端开发者集成文档完整

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
- 人工review，创建修复任务，使用4步ACD循环解决

---

## 🔄 Backend协调要求

**架构确认**: 
- Task 04.1设计必须获得后端团队书面批准
- 数据模型必须与backend API设计保持一致
- RLS策略需要与backend权限模型协调

**协调时机**:
- Task 04.1完成后暂停，等待backend确认
- Task 04.2-04.4仅在获得批准后执行

**协调文档**: 
- 数据库架构设计文档
- RLS策略说明文档
- TypeScript接口集成指南

---

## ✅ Phase完成标准

### 功能完成验证
- [ ] 所有原子任务(04.1-04.4)完成并通过验证
- [ ] 数据库架构设计获得后端团队批准
- [ ] 完整的医疗平台数据库架构实施
- [ ] 全面的RLS安全策略验证通过
- [ ] TypeScript类型定义完整且准确
- [ ] 隐私合规性100%验证通过

### 轻量级验证通过
- [ ] 基础检查所有项目通过
- [ ] 无阻塞性问题
- [ ] 功能验证达标
- [ ] 集成准备完成

### 集成就绪确认
- [ ] 与TASK03认证系统集成验证
- [ ] 为TASK05组件迁移提供数据模型
- [ ] Backend团队协调完成
- [ ] 生产环境部署准备就绪

---

**依赖**: TASK03 (Authentication System Migration)  
**下一任务**: TASK05 (Component Migration) - 基于此数据模型  
**分支策略**: `feature/task04-database` → `main` (需要backend review)  
**关键成功因素**: 获得backend团队架构批准，完整的隐私合规验证，RLS策略有效性验证