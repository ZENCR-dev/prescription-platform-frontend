# 🔄 代码复用资产包 - B2B2C中医处方履约平台

**创建日期**: 2025年8月2日  
**原项目**: B2B2C中医处方履约平台  
**目标架构**: Supabase-First架构迁移  
**复用标准**: 企业级代码复用标准  
**隐私合规**: GDPR/HIPAA合规要求  

## 📦 复用资产清单

### 📁 核心业务组件 (4个文件)

| 组件名称                            | 复用等级 | 适配要求                      | 测试状态     |
| ------------------------------- | ---- | ------------------------- | -------- |
| **PrescriptionCreator.tsx**     | 二级复用 | 移除患者隐私信息字段，集成Supabase数据提交 | ✅ 完整测试   |
| **PrescriptionDashboard.tsx**   | 二级复用 | 适配Supabase实时订阅和RLS策略      | ✅ 性能测试通过 |
| **MedicineSearch.tsx**          | 一级复用 | 保留搜索算法，适配Supabase药品表      | ✅ 单元测试通过 |
| **PrescriptionDetailModal.tsx** | 一级复用 | 适配新数据模型展示                 | ✅ UI测试通过 |

### 🔐 认证权限组件 (2个文件)

| 组件名称 | 复用等级 | 适配要求 | 测试状态 |
|---------|----------|----------|----------|
| **GuestModeGuard.tsx** | 一级适配 | 适配Supabase Auth状态检查 | ✅ 24个测试通过 |
| **withAuth.tsx** | 一级适配 | 完全重写为Supabase Auth HOC | ✅ 认证测试通过 |

### ⚙️ 业务逻辑工具 (3个文件)

| 工具名称 | 复用等级 | 适配要求 | 测试状态 |
|---------|----------|----------|----------|
| **prescriptionCalculator.ts** | 一级复用 | 迁移到Supabase Edge Functions | ✅ 准确性测试通过 |
| **guestDataManager.ts** | 一级复用 | 适配Supabase匿名认证和本地存储 | ✅ 数据一致性测试通过 |
| **qrParser.ts** | 一级复用 | 无需修改，直接复用 | ✅ 解析测试通过 |

### 🛠️ 工具函数库 (2个文件)

| 服务名称 | 复用等级 | 适配要求 | 测试状态 |
|---------|----------|----------|----------|
| **medicineService.ts** | 三级适配 | 改为Supabase Client调用，集成RLS策略 | ✅ API集成测试通过 |
| **prescriptionService.ts** | 三级适配 | 集成Supabase实时订阅和数据库直连 | ✅ 状态管理测试通过 |

### 📚 技术文档 (1个文件)

| 文档名称 | 内容 | 状态 |
|---------|------|------|
| **READMEfrontend-revised.md** | Supabase-First架构重构PRD技术要素文档 | ✅ 已完成修订 |

## 🎯 复用等级说明

### 一级复用 (直接迁移)
- **特征**: 经过完整测试验证，零修改即可使用
- **数量**: 6个组件
- **预计节省时间**: 80-90%

### 二级复用 (适配迁移)
- **特征**: 需要适配Supabase架构和隐私合规要求
- **数量**: 2个组件
- **预计节省时间**: 60-70%

### 三级适配 (架构调整)
- **特征**: 需要从传统API改为Supabase Client + Realtime
- **数量**: 2个服务
- **预计节省时间**: 40-50%

### 一级适配 (认证重写)
- **特征**: 认证相关组件，需要完全适配Supabase Auth
- **数量**: 2个组件
- **预计节省时间**: 30-40%

## 🚨 Supabase适配关键要求

### 1. 认证系统完全替换
```typescript
// ❌ 原JWT认证模式 - 完全废弃
const authenticateUser = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    headers: { Authorization: `Bearer ${jwt}` }
  });
};

// ✅ Supabase Auth模式 - 强制使用
const authenticateUser = async (credentials) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password
  });
};
```

### 2. 数据模型隐私合规
```typescript
// ❌ 原隐私数据模型 - 必须移除
interface OldPrescriptionModel {
  patientName: string;     // 违反GDPR/HIPAA
  patientAge?: number;     // 违反隐私合规
  patientPhone?: string;   // 敏感信息
}

// ✅ 新匿名化数据模型 - 强制使用
interface NewPrescriptionModel {
  id: string;
  prescriptionCode: string;    // 🆕 匿名处方编号
  practitionerId: string;      // 仅保留医师信息
  status: 'DRAFT' | 'PAID' | 'FULFILLED' | 'COMPLETED';
  totalAmount: number;         // NZD cents精度
  medicines: PrescriptionMedicineModel[];
}
```

### 3. API架构完全替换
```typescript
// ❌ 原API客户端模式 - 完全废弃
const fetchPrescriptions = async () => {
  const response = await fetch('/api/prescriptions', {
    headers: { Authorization: `Bearer ${jwt}` }
  });
};

// ✅ Supabase直接访问模式 - 强制使用
const fetchPrescriptions = async () => {
  const { data, error } = await supabase
    .from('prescriptions')
    .select('*');
  // RLS策略自动过滤，只返回用户有权限的数据
};
```

## 📋 使用指南

### Step 1: 复用准备
1. 将`recycle/`目录复制到新项目
2. 安装必要的依赖项
3. 配置Supabase环境变量

### Step 2: 适配优先级
1. **优先迁移**: 一级复用组件（6个）
2. **数据适配**: 二级复用组件（2个）
3. **API重构**: 三级适配服务（2个）
4. **认证重写**: 一级适配组件（2个）

### Step 3: 质量验证
1. ESLint检查无错误
2. TypeScript类型安全验证
3. Supabase RLS策略测试
4. 隐私合规检查

## ⚠️ 重要提醒

### 1. 架构变更不可逆
- Supabase-First决策已确定，不得回退到原JWT方案
- 所有组件必须适配新架构，旧版本将不被支持

### 2. 隐私合规强制要求
- 任何包含患者隐私信息的代码都不得复用
- 数据模型必须完全匿名化，违反者承担法律责任
- GDPR/HIPAA合规检查作为代码审查强制项

### 3. 测试覆盖要求
- RLS策略覆盖率: 100%
- 核心业务逻辑覆盖率: >85%
- Supabase集成测试: 100%

## 📞 技术支持

- **迁移指导**: 参考`READMEfrontend-revised.md`文档
- **架构问题**: 联系Supabase技术支持群
- **测试验证**: 使用项目内置测试套件

---

**📝 文档版本**: v1.0.0 - Supabase代码复用资产包  
**🕐 创建时间**: 2025年8月2日  
**👥 维护团队**: Frontend Architecture Team  
**🎯 适配目标**: Supabase-First架构 100%兼容