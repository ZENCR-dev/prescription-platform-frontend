# Dev-Step 4.2 修复指南 - ProtectedRoute HOC 架构纠偏

**修复日期**: 2025-09-05  
**架构师指令**: QAD-Research 阶段设计缺陷纠偏  
**关联文档**: [DEV-STEP-4.2-DESIGN-SPECIFICATION.md](./DEV-STEP-4.2-DESIGN-SPECIFICATION.md)

---

## 1. 研究原型冻结边界

### 1.1 useAuthGuard Hook 状态定义

**文件位置**: `hooks/auth/useAuthGuard.ts`  
**当前状态**: Prototype-Research - 禁止生产集成  
**用途**: 纯逻辑权限验证研究，从ProtectedRoute抽取的逻辑架构验证

### 1.2 集成限制边界

**严格禁止**:
- ❌ 不得在 ProtectedRoute HOC 中使用
- ❌ 不得在生产路径中集成  
- ❌ 不得引入路由或重定向副作用

**允许范围**:
- ✅ 仅限 Pure Logic 层研究
- ✅ 仅限单元测试验证
- ✅ 架构可行性实验

### 1.3 冻结期限约束

**冻结期限**: 保持冻结至 QAD-Implement 阶段再评估  
**解冻条件**: 架构师明确批准进入生产集成阶段  
**当前职责**: 验证专门化设计原则的理论可行性

### 1.4 验证要求

**MQG验证点**:
```bash
# 验证HOC未引用Hook
grep -n "useAuthGuard" components/auth/ProtectedRoute.tsx

# 验证仓库内无生产代码引用
grep -r "import.*useAuthGuard" --include="*.tsx" --include="*.ts" .

# 验证Hook仅被隔离测试引用
find . -name "*.test.ts*" -exec grep -l "useAuthGuard" {} \;
```

**预期结果**: 所有命令无输出，证明Hook处于完全隔离状态

---

## 2. 类型单一事实源与缓存策略

### 2.1 拒绝码迁移计划

**现阶段架构**:
- DenialCode 定义在 HOC 内部 (`components/auth/ProtectedRoute.tsx:36-41`)
- HOC 内部自用，维护业务逻辑完整性

**目标架构** (QAD-Implement阶段):
- 拒绝码迁移至中立层 `security/denial.ts`
- 成为整个权限系统的统一类型源
- HOC 和 Hook 均从中立层导入

### 2.2 分层架构约束

**严格分层规则（强化）**:
- ❌ Hook 禁止从 HOC 反向 import 任何类型（包括 DenialCode）
- ❌ Hook 不得反向导入 `@/components/auth/ProtectedRoute` 的任何内容
- ❌ Hook 内不得导出公共拒绝码类型  
- ✅ Hook 可使用本地私有拒绝码映射（不导出）
- ✅ 仅保留一个公共拒绝码导出位置（HOC）

**当前合规状态（已修正）**:
- ✅ useAuthGuard 已移除对 ProtectedRoute 的反向 import
- ✅ Hook 内使用 LocalDenialCode 本地私有枚举（不导出）
- ✅ 测试文件使用 TestDenialCode 本地常量，避免反向依赖
- ✅ 无重复类型导出（已通过 grep 验证）

### 2.3 缓存策略硬约束

**HOC 主路径限制**:
```typescript
// 仅允许使用 'auth' 缓存类型
const userClaims = await getUserClaims('auth')  // 30s TTL
```

**研究级实验范围**:
```typescript
// 仅限 Hook 研究原型使用，不得进入HOC或生产路径
cacheType?: 'ui' | 'auth' | 'mfa'
// ui: 180000ms (3分钟) - UI状态缓存
// mfa: 300000ms (5分钟) - MFA会话缓存
```

### 2.4 合约验证登记

**来源**: `lib/supabase/client.ts:107-118`
```typescript
interface CacheConfig {
  ui: number    // 180000 - 3分钟，研究级实验
  auth: number  // 30000 - 30秒，HOC主路径专用  
  mfa: number   // 300000 - 5分钟，研究级实验
}

const CACHE_CONFIG: CacheConfig = {
  ui: 180000,
  auth: 30000,
  mfa: 300000
}

export async function getUserClaims(cacheType: keyof CacheConfig = 'ui'): Promise<UserClaims | null>
```

**约束说明**:
- HOC 生产路径强制使用 `getUserClaims('auth')`
- `'ui'` 和 `'mfa'` 类型仅限研究原型在mock测试中使用
- 不得将研究级缓存策略引入生产代码

---

## 3. 测试隔离要求

### 3.1 隔离测试文件规范

**文件位置**: `hooks/auth/__tests__/useAuthGuard.research.test.tsx`  
**测试性质**: 研究原型专属，与生产回归解耦  
**覆盖目标**: 验证Hook逻辑完整性，不测试集成效果

### 3.2 测试覆盖矩阵

**失败优先级序列测试** (1→2→3→4):
```typescript
// 优先级1: NOT_AUTHENTICATED - 未认证用户优先处理
// 优先级2: MFA_REQUIRED - 已认证但MFA不足  
// 优先级3: NOT_VERIFIED - 已认证但未验证专业身份
// 优先级4: ROLE_MISMATCH - 已认证已验证但角色不匹配
```

**缓存类型分支测试**:
```typescript
// Mock getUserClaims 覆盖三种缓存类型
// 'ui' - 基础UI状态缓存测试
// 'auth' - 权威授权验证缓存测试  
// 'mfa' - MFA会话缓存测试
```

### 3.3 副作用隔离约束

**严格禁止的副作用**:
- 路由导航 (router.push/replace)
- 重定向处理
- sessionStorage 操作
- 外部状态修改

**允许的纯逻辑测试**:
- 权限判定逻辑验证
- 拒绝码优先级验证  
- 缓存类型参数验证
- Hook状态管理验证

### 3.4 覆盖率要求

**覆盖率目标**: 针对Hook内部逻辑 >90%  
**覆盖率排除**: 不包含路由、重定向等生产副作用  
**报告要求**: 产出覆盖率报告纳入证据链

---

## 4. 证据链要求

### 4.1 grep验证证据

**命令清单**:
```bash
# 1. 验证HOC未导入Hook
grep -n "useAuthGuard" components/auth/ProtectedRoute.tsx

# 2. 验证仓库内无生产代码导入Hook
grep -r "import.*useAuthGuard" --include="*.tsx" --include="*.ts" .

# 3. 验证无重复拒绝码导出
grep -r "export.*DenialReason" --include="*.ts*" .

# 4. 验证唯一拒绝码导出位置
grep -r "export.*DenialCode" --include="*.ts*" .
```

### 4.2 合约验证片段

**来源定位**: `lib/supabase/client.ts:107-118` 和 `lib/supabase/client.ts:135-138`  
**验证内容**: CacheConfig 接口定义和 getUserClaims 函数签名  
**约束确认**: 三种缓存类型合法性验证

### 4.3 测试执行证据

**测试报告**:
- Jest 测试执行结果
- 覆盖率报告 (Istanbul/NYC)
- 失败优先级测试矩阵验证结果

**性能指标**:
- Hook逻辑执行时间
- Mock调用次数验证
- 内存泄露检查结果

### 4.4 证据链日志文件

**日志位置**: `/Users/renjie/dev/logs/LOG-DEV-STEP-4.2-RESEARCH-FREEZE.md`  
**内容结构**:
- 执行时间戳
- grep验证完整结果
- 合约验证代码片段
- 测试执行完整日志
- 覆盖率数据
- MQG达成确认

---

## 5. 关联文档链接

### 5.1 主设计文档章节

- [接口规范 - ProtectedRouteProps](./DEV-STEP-4.2-DESIGN-SPECIFICATION.md#1-接口规范---protectedrouteprops-最终版)
- [失败优先级与单一拒绝码](./DEV-STEP-4.2-DESIGN-SPECIFICATION.md#13-失败优先级与单一拒绝码)
- [测试矩阵映射](./DEV-STEP-4.2-DESIGN-SPECIFICATION.md#5-测试矩阵到用例映射)
- [文件与使用边界](./DEV-STEP-4.2-DESIGN-SPECIFICATION.md#7-文件与使用边界)

### 5.2 实施文档链接

- [ProtectedRoute HOC 实现](./components/auth/ProtectedRoute.tsx)
- [useAuthGuard Hook 研究原型](./hooks/auth/useAuthGuard.ts)
- [认证客户端合约](./lib/supabase/client.ts)

---

## 6. 修复执行检查清单

### 6.1 文档修订检查

- [ ] 主设计文档添加 7.3/7.4 节链接
- [ ] 修复指南文档完整且 ≤500 行  
- [ ] 所有链接有效，无复制主文档内容

### 6.2 代码状态检查

- [ ] useAuthGuard Hook 冻结标识保持
- [ ] HOC 未导入 Hook (grep 验证)
- [ ] 仓库内唯一拒绝码导出位置
- [ ] 缓存策略边界明确

### 6.3 测试覆盖检查

- [ ] 隔离测试文件创建
- [ ] 失败优先级 1→2→3→4 全覆盖
- [ ] 三种缓存类型 mock 测试
- [ ] 无副作用验证通过
- [ ] 覆盖率报告生成

### 6.4 证据链检查  

- [ ] 所有 grep 命令执行并记录结果
- [ ] 合约验证片段准确定位
- [ ] 测试执行日志完整
- [ ] MQG 放行条件全部达成

---

**🚦 MQG 一次性放行标准**  
全部检查项通过 + 证据链文件完整 + 架构师 Reality Sync 确认

**总行数**: 约450行 ✓