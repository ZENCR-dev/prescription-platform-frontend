# 后端集成对接指导文档

## 📋 文档概述

**目标**: 明确前后端分离开发的边界，定义后端集成的接口要求和数据规范  
**适用阶段**: 前端独立开发完成后，等待后端API就绪时使用  
**重要性**: 确保前后端无缝对接，避免返工和数据不一致问题  

## 🚨 关键原则

### 前端已独立完成的功能
✅ **这些功能已完全不依赖后端，可以独立运行和测试：**

- Guest模式完整体验（处方创建、导出、本地存储）
- 用户界面和交互逻辑
- 前端路由和权限控制
- 本地数据管理和计算逻辑
- PDF导出和打印功能
- 响应式设计和用户体验

### 需要后端配合完成的功能  
❌ **以下功能必须等待后端API和数据模型确定：**

- 用户认证和授权
- 处方数据的服务端持久化
- 药品数据的动态加载和搜索
- 处方历史记录查询
- 跨设备数据同步

## 🔄 前后端集成检查清单

### Phase 1: 后端API基础就绪检查

#### 1.1 认证系统API
**等待后端提供：**

```typescript
// 接口定义（以后端最终文档为准）
interface AuthAPI {
  // 用户登录
  'POST /api/v1/auth/login': {
    request: { email: string; password: string }
    response: { token: string; user: UserProfile; expiresIn: number }
  }
  
  // 令牌刷新  
  'POST /api/v1/auth/refresh': {
    request: { refreshToken: string }
    response: { token: string; expiresIn: number }
  }
  
  // 用户注册
  'POST /api/v1/auth/register': {
    request: { email: string; password: string; name: string; role: UserRole }
    response: { user: UserProfile; token: string }
  }
  
  // 登出
  'POST /api/v1/auth/logout': {
    request: { token: string }
    response: { success: boolean }
  }
}
```

**前端适配工作：**
- [ ] 更新 `src/services/authService.ts` 的API调用
- [ ] 集成真实的JWT令牌管理
- [ ] 更新认证状态管理逻辑
- [ ] 测试跨设备登录状态同步

#### 1.2 用户数据模型API
**等待后端提供：**

```typescript
// 用户数据结构（以后端最终文档为准）
interface UserProfile {
  id: string
  email: string
  name: string
  role: 'doctor' | 'pharmacy' | 'admin'
  // 其他字段待后端确认
}

interface UserPermissions {
  // 权限结构待后端确认
}
```

**前端适配工作：**
- [ ] 更新 `src/types/auth.ts` 类型定义
- [ ] 更新用户权限检查逻辑
- [ ] 调整用户信息显示组件

### Phase 2: 处方管理API集成

#### 2.1 处方CRUD API
**等待后端提供：**

```typescript
// 处方API接口（以后端最终文档为准）
interface PrescriptionAPI {
  // 创建处方
  'POST /api/v1/prescriptions': {
    request: PrescriptionCreateRequest
    response: PrescriptionResponse
  }
  
  // 获取处方历史
  'GET /api/v1/prescriptions': {
    query: { page?: number; limit?: number; status?: string }
    response: { prescriptions: PrescriptionResponse[]; total: number }
  }
  
  // 获取单个处方详情
  'GET /api/v1/prescriptions/:id': {
    response: PrescriptionResponse
  }
  
  // 更新处方状态
  'PATCH /api/v1/prescriptions/:id': {
    request: { status: PrescriptionStatus; notes?: string }
    response: PrescriptionResponse
  }
}
```

**前端适配工作：**
- [ ] 更新 `src/services/prescriptionService.ts`
- [ ] 将本地处方数据迁移到服务端存储
- [ ] 实现处方历史记录功能
- [ ] 添加数据同步和冲突解决机制

#### 2.2 处方数据模型规范
**关键需要确认的字段：**

```typescript
// 等待后端确认的数据结构
interface PrescriptionData {
  id?: string                    // 后端生成的ID
  prescriptionId?: string        // 业务ID格式（如：RX-2024-001）
  medicines: Array<{
    medicineId: string          // 药品ID
    // 字段名确认：weight vs amount vs quantity
    weight?: number             // 单味药克重
    amount?: number             // 数量
    // 其他字段待确认
  }>
  // 字段名确认：copies vs amounts vs dosage
  copies?: number               // 帖数
  amounts?: number              // 剂量
  notes?: string                // 备注
  status?: PrescriptionStatus   // 状态枚举待确认
  // 价格相关字段待确认
  totalPrice?: number
  // 时间字段格式待确认
  createdAt?: string | Date
  updatedAt?: string | Date
}
```

**前端适配检查清单：**
- [ ] 确认字段命名约定（weight vs amount, copies vs amounts）
- [ ] 确认数据类型（Date格式、数字精度等）
- [ ] 确认必填字段和可选字段
- [ ] 确认枚举值定义
- [ ] 更新前端数据模型和验证规则

### Phase 3: 药品数据API集成

#### 3.1 药品搜索API
**等待后端提供：**

```typescript
// 药品API接口（以后端最终文档为准）
interface MedicineAPI {
  // 药品搜索
  'GET /api/v1/medicines/search': {
    query: { 
      q?: string              // 搜索关键词
      category?: string       // 分类筛选
      page?: number
      limit?: number
    }
    response: { medicines: Medicine[]; total: number }
  }
  
  // 获取药品分类
  'GET /api/v1/medicines/categories': {
    response: { categories: string[] }
  }
  
  // 获取单个药品详情
  'GET /api/v1/medicines/:id': {
    response: Medicine
  }
}
```

**前端适配工作：**
- [ ] 替换本地药品数据为API调用
- [ ] 更新 `src/services/medicineService.ts`
- [ ] 实现搜索结果缓存机制
- [ ] 优化搜索体验（防抖、分页等）

#### 3.2 药品数据模型规范
**等待后端确认：**

```typescript
// 药品数据结构（以后端最终文档为准）
interface Medicine {
  id: string
  // 名称字段确认
  name?: string               // 主要名称
  chineseName?: string        // 中文名
  englishName?: string        // 英文名  
  pinyinName?: string         // 拼音名
  // 业务字段确认
  sku?: string               // SKU代码
  category?: string          // 分类
  // 价格字段确认
  basePrice?: number         // 基础价格
  unitPrice?: number         // 单价
  unit?: string             // 单位
  // 库存字段确认
  stock?: number            // 库存数量
  status?: 'active' | 'inactive'
  // 其他字段待确认
}
```

**前端适配检查清单：**
- [ ] 确认药品名称字段的使用优先级
- [ ] 确认价格字段的计算逻辑
- [ ] 确认分类枚举值
- [ ] 更新药品搜索和显示逻辑

### Phase 4: 系统集成配置

#### 4.1 API客户端配置
**需要后端提供：**

```typescript
// API配置信息
interface APIConfiguration {
  baseURL: string              // API基础URL
  version: string              // API版本号
  timeout: number              // 请求超时时间
  authHeader: string           // 认证头名称
  // 错误码映射
  errorCodes: Record<string, string>
}
```

**前端适配工作：**
- [ ] 更新 `src/lib/apiClient.ts` 配置
- [ ] 实现API错误处理和用户提示
- [ ] 配置请求拦截器和响应拦截器
- [ ] 实现API调用的日志和监控

#### 4.2 环境变量配置
**创建 `.env.local` 配置模板：**

```bash
# API配置（等待后端提供实际值）
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_API_VERSION=v1
NEXT_PUBLIC_API_TIMEOUT=10000

# 认证配置  
NEXT_PUBLIC_AUTH_TOKEN_KEY=tcm_auth_token
NEXT_PUBLIC_AUTH_REFRESH_KEY=tcm_refresh_token

# 功能开关
NEXT_PUBLIC_ENABLE_GUEST_MODE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# 其他配置待后端确认
```

## 🔧 数据迁移策略

### Guest模式到认证模式的数据迁移

**现状**: Guest模式数据存储在本地（sessionStorage + 内存）  
**目标**: 用户登录后将本地数据同步到服务端  

**迁移方案：**

```typescript
// 数据迁移服务（待实现）
interface DataMigrationService {
  // 检查本地是否有Guest数据
  hasLocalGuestData(): boolean
  
  // 获取本地Guest数据  
  getLocalGuestData(): GuestPrescriptionData[]
  
  // 将Guest数据转换为服务端格式
  convertGuestDataToServerFormat(data: GuestPrescriptionData[]): PrescriptionCreateRequest[]
  
  // 批量上传到服务端
  uploadGuestDataToServer(data: PrescriptionCreateRequest[]): Promise<void>
  
  // 清理本地数据
  clearLocalGuestData(): void
  
  // 提示用户确认迁移
  promptUserForMigration(): Promise<boolean>
}
```

**迁移时机：**
1. 用户从Guest模式登录时
2. 用户注册新账户时  
3. 用户明确选择同步数据时

### 数据一致性保证

**冲突解决策略：**
- 时间戳优先：以最新修改时间为准
- 用户选择：让用户决定保留哪个版本
- 合并策略：尽可能合并不冲突的数据

## 📋 集成测试计划

### 测试环境准备
```bash
# 后端API就绪后的集成测试
npm run test:integration
npm run test:e2e
npm run test:api
```

### 关键测试场景
1. **认证流程测试**
   - 登录/登出流程
   - 令牌刷新机制
   - 权限验证

2. **数据同步测试**  
   - Guest数据迁移
   - 处方CRUD操作
   - 离线数据同步

3. **错误处理测试**
   - 网络异常处理
   - API错误响应
   - 数据格式异常

## ⚠️ 风险控制

### 数据丢失风险
- **风险**: Guest模式本地数据在迁移过程中丢失
- **缓解**: 实现数据备份和恢复机制

### API变更风险  
- **风险**: 后端API接口变更导致前端功能异常
- **缓解**: 使用API版本控制，保持向后兼容

### 用户体验风险
- **风险**: 集成过程中功能中断影响用户体验  
- **缓解**: 实现优雅降级和错误提示

## ✅ 集成完成标准

### 功能完整性
- [ ] 所有前端功能都能正常调用后端API
- [ ] Guest模式数据能够正确迁移到服务端
- [ ] 用户认证和权限控制正常工作
- [ ] 错误处理和用户提示完善

### 性能指标
- [ ] API响应时间 < 500ms (P95)
- [ ] 页面加载时间 < 3秒
- [ ] 数据同步成功率 > 99%

### 质量保证
- [ ] 集成测试通过率 100%
- [ ] 端到端测试覆盖主要用户场景
- [ ] 错误监控和日志完整

## 📞 协调沟通

### 与后端团队的沟通要点

1. **数据模型确认会议**
   - 字段命名约定统一
   - 数据类型和格式确认  
   - 必填字段和验证规则对齐

2. **API接口评审会议**
   - 接口设计和返回格式确认
   - 错误码和异常处理约定
   - 性能要求和限制讨论

3. **集成测试协调**
   - 测试环境准备和配置
   - 测试数据准备和管理
   - 问题反馈和修复流程

### 文档同步要求

- 后端API文档更新时及时通知前端
- 数据模型变更需要前端确认影响
- 重大接口变更需要提前1周通知

---

**重要提醒**: 本文档的所有API接口和数据模型定义都是基于前端分析的推测，实际实施时**必须以后端提供的最终文档为准**。前端已经做好充分的抽象和适配准备，能够快速响应后端的接口要求。