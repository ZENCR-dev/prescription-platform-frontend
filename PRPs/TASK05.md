# TASK05.md - Component Migration & Adaptation
## Migrate Legacy Components to Supabase-First Architecture

**Task Category**: Frontend Development & Component Integration  
**Phase**: Week 3-4 - Core Features  
**Priority**: High (Enables user interface functionality)  
  
### AI Agent估算
- **步骤数量**: 20步
- **代码文件**: 12个文件
- **迭代轮次**: 3轮
- **复杂度**: 高
**Prerequisites**: TASK04 completed successfully  
**Backend Coordination**: Component data access patterns and API integration points

---

## 🎯 Task Objectives

Migrate and adapt reusable components from legacy codebase to Supabase-First architecture, implementing privacy compliance and modern UI framework integration across different adaptation levels.

### User Stories Served
- **US11**: As a developer, I want legacy components migrated so I can reuse existing UI functionality
- **US12**: As a user, I want familiar UI components so the platform is intuitive to use
- **US13**: As a privacy advocate, I want all components privacy-compliant with no patient PII
- **US14**: As a medical practitioner, I want prescription creation components so I can create prescriptions efficiently
- **US15**: As a pharmacy, I want medicine search functionality so I can find required medications

### Success Criteria
- [ ] All legacy components from `recycle/` directory successfully migrated
- [ ] Privacy compliance verified (zero patient PII in any component)
- [ ] Components adapted to use Supabase data models from TASK04
- [ ] API calls converted from custom HTTP to Supabase Client operations
- [ ] Medical platform UI components fully functional
- [ ] TypeScript integration complete with proper type safety

---

## 🔧 统一4步ACD敏捷模板

### 标准4步ACD循环序列
Step_1: 需求分析与设计 (主实现角色: frontend)
  - 分析atomic task需求和技术方案
  - 设计实现路径和技术架构
  - 识别依赖关系和潜在风险
  - 确定验证标准和成功指标

Step_2: 实现与自测 (同一主实现角色: frontend)
  - 完成功能实现
  - 编写基础单元测试确保功能正确
  - 执行代码格式化和基础lint检查
  - 满足验收标准

Step_3: 集成准备 (同一主实现角色: frontend)
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
**验证类型**: 基础检查 (UI组件迁移)  
**基础检查内容**:
- npm run test 通过
- npm run lint 通过  
- npm run build 通过
- 功能手动验证通过

### SuperClaude优化建议
- **Magic** (`--magic`): UI组件生成、设计系统集成、响应式布局
- **Context7** (`--c7`): React组件模式、Supabase集成最佳实践
- **Frontend Focus**: 组件迁移、UI/UX一致性、性能优化

---

## 📋 原子任务分解 (4步ACD循环模式)

### Atomic Task 05.1: 组件清单分析与迁移策略制定
**AI Agent Estimation**:
```yaml
步骤数量: 5步
代码文件: 2个文件
迭代轮次: 2轮
复杂度: 中
```

**4步ACD循环执行**:
1. **需求分析与设计** (frontend persona)
   - 审计`recycle/`目录中所有遗留组件
   - 设计组件适配级别分类系统(1-4级)
   - 规划隐私合规要求评估标准
   
2. **实现与自测** (frontend persona)
   - 建立完整组件清单文档
   - 分类组件适配级别(直接复用/数据更新/API迁移/重写)
   - 创建迁移优先级矩阵和依赖关系映射
   
3. **集成准备** (frontend persona) 
   - 验证组件分类准确性
   - 确认与TASK04数据模型对齐
   - 准备迁移执行计划
   
4. **质量验证与提交** (qa persona)
   - 清单完整性验证
   - 分类逻辑一致性检查
   - Git提交: `docs(components): create migration inventory and strategy`

**SuperClaude Commands**:
```bash
/sc:analyze recycle/ --focus components --migration-strategy
/sc:classify --adaptation-levels --privacy-compliance
/sc:design priority-matrix --dependency-mapping
```

**Acceptance Criteria**:
- [ ] 完整的遗留组件清单文档
- [ ] 适配级别分类完成(1: 直接复用, 2: 数据模型更新, 3: API迁移, 4: 完全重写)
- [ ] 所有组件的隐私合规评估完成
- [ ] 组件依赖关系映射建立
- [ ] 基于功能重要性的迁移优先级矩阵
- [ ] 每种适配级别的测试策略定义

---

### Atomic Task 05.2: Level 1-2组件迁移(直接复用和数据适配)
**AI Agent Estimation**:
```yaml
步骤数量: 6步
代码文件: 4个文件
迭代轮次: 2轮
复杂度: 中
```

**4步ACD循环执行**:
1. **需求分析与设计** (frontend persona)
   - 分析Level 1(直接复用)和Level 2(数据更新)组件需求
   - 设计Supabase数据模型适配方案
   - 规划隐私合规改造策略
   
2. **实现与自测** (frontend persona)
   - 迁移Level 1组件，移除所有患者PII字段
   - 适配Level 2组件使用TASK04数据模型
   - 更新API调用为Supabase Client操作
   - 实现TypeScript接口兼容性
   
3. **集成准备** (frontend persona) 
   - 使用匿名化数据测试组件功能
   - 验证与Supabase数据模型集成
   - 准备隐私合规验证文档
   
4. **质量验证与提交** (qa persona)
   - 隐私合规性全面验证
   - 组件功能完整性测试
   - Git提交: `feat(components): migrate Level 1-2 components to Supabase`

**SuperClaude Commands**:
```bash
/sc:implement migration --level-1-2 --supabase-data
/sc:test components --privacy-compliance --functionality
/sc:validate integration --typescript --data-models
```

**Acceptance Criteria**:
- [ ] 所有Level 1组件完成隐私验证迁移
- [ ] Level 2组件适配Supabase数据模型
- [ ] API调用转换为Supabase Client操作
- [ ] TypeScript接口更新为Supabase兼容
- [ ] 隐私合规验证通过所有迁移组件
- [ ] 组件功能使用匿名化数据测试通过

---

### Atomic Task 05.3: Level 3-4组件迁移(API集成和重写)
**AI Agent Estimation**:
```yaml
步骤数量: 7步
代码文件: 4个文件
迭代轮次: 3轮
复杂度: 高
```

**4步ACD循环执行**:
1. **需求分析与设计** (frontend persona)
   - 分析Level 3(API迁移)和Level 4(重写)组件需求
   - 设计Supabase Realtime集成方案
   - 规划医疗特定功能实现
   
2. **实现与自测** (frontend persona)
   - 迁移Level 3组件到Supabase API集成
   - 重写Level 4组件使用现代框架模式
   - 实现医疗处方创建和药物搜索功能
   - 集成Supabase Realtime订阅
   
3. **集成准备** (frontend persona) 
   - 验证复杂组件功能完整性
   - 测试Realtime功能和性能
   - 准备医疗工作流验证
   
4. **质量验证与提交** (qa persona)
   - 复杂组件全面功能测试
   - 医疗工作流验证
   - Git提交: `feat(components): migrate Level 3-4 components with advanced features`

**SuperClaude Commands**:
```bash
/sc:implement migration --level-3-4 --realtime --medical
/sc:test components --complex --medical-workflows
/sc:validate realtime --performance --subscriptions
```

**Acceptance Criteria**:
- [ ] Level 3组件完成API集成迁移
- [ ] Level 4组件使用现代框架重写完成
- [ ] 处方创建组件功能完整(PrescriptionCreator)
- [ ] 药物搜索功能实现(MedicineSearch)
- [ ] Supabase Realtime集成验证通过
- [ ] 医疗工作流端到端测试通过

---

### Atomic Task 05.4: 组件集成测试与UI一致性验证
**AI Agent Estimation**:
```yaml
步骤数量: 4步
代码文件: 2个文件
迭代轮次: 2轮
复杂度: 低
```

**4步ACD循环执行**:
1. **需求分析与设计** (frontend persona)
   - 分析所有迁移组件的集成需求
   - 设计UI一致性验证标准
   - 规划无障碍功能测试策略
   
2. **实现与自测** (frontend persona)
   - 执行组件间集成测试
   - 验证UI设计系统一致性
   - 测试无障碍功能(WCAG 2.1 AA)
   - 验证响应式设计
   
3. **集成准备** (frontend persona) 
   - 准备用户验收测试环境
   - 验证医疗平台品牌一致性
   - 确认性能基准达标
   
4. **质量验证与提交** (qa persona)
   - 全面UI一致性验证
   - 无障碍功能合规检查
   - Git提交: `test(components): verify integration and UI consistency`

**SuperClaude Commands**:
```bash
/sc:test integration --ui-consistency --accessibility
/sc:validate design-system --brand-compliance
/sc:test performance --components --responsive
```

**Acceptance Criteria**:
- [ ] 所有迁移组件集成测试通过
- [ ] UI设计系统一致性验证100%
- [ ] WCAG 2.1 AA无障碍功能合规
- [ ] 响应式设计在所有设备正常
- [ ] 医疗平台品牌一致性验证
- [ ] 组件性能基准测试达标

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

## 🔄 组件迁移协调要求

**迁移策略**:
- 从`recycle/`目录迁移经过验证的组件
- 移除所有患者PII，改用匿名化标识符
- 适配TASK04数据模型和RLS策略
- 保持用户界面的医疗专业性

**质量标准**:
- 零患者PII政策严格执行
- Supabase-First架构100%合规
- WCAG 2.1 AA无障碍标准
- 医疗品牌一致性验证

**测试要求**:
- 使用匿名化数据进行所有测试
- 医疗工作流端到端验证
- 跨设备响应式设计测试
- 隐私合规自动化检查

---

## ✅ Phase完成标准

### 功能完成验证
- [ ] 所有原子任务(05.1-05.4)完成并通过验证
- [ ] `recycle/`目录所有组件成功迁移
- [ ] 隐私合规验证100%通过(零患者PII)
- [ ] Supabase集成功能完整且稳定
- [ ] 医疗UI组件符合专业标准
- [ ] 无障碍功能合规WCAG 2.1 AA

### 轻量级验证通过
- [ ] 基础检查所有项目通过
- [ ] 无阻塞性UI问题
- [ ] 隐私合规性验证达标
- [ ] 组件功能正常

### 集成就绪确认
- [ ] 与TASK04数据模型集成验证
- [ ] 为TASK06支付功能提供UI基础
- [ ] 医疗工作流用户体验验证
- [ ] 组件复用性和可维护性确认

---

**依赖**: TASK04 (Database & RLS Implementation)  
**下一任务**: TASK06 (Edge Functions & Payment) - 基于迁移的UI组件  
**分支策略**: `feature/task05-components` → `main` (需要UI/UX review)  
**关键成功因素**: 完整的隐私合规验证，医疗专业UI标准，Supabase集成稳定性