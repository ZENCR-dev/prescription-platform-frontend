# MVP1.9 Guest模式灰度测试版本 - PRD文档

## 📋 文档信息

**版本**: MVP1.9  
**创建日期**: 2025-07-22  
**分支名称**: Grey test July  
**文档类型**: 产品需求文档 (PRD)  
**优先级**: P0 (灰度测试关键路径)  

## 🎯 产品目标

### 核心目标
将现有MVP2.2的**Mock环境模块**改造为**Guest模式**，允许非登录用户试用处方创建功能，提供独立的纯前端处方生成工具，用于灰度测试和用户体验验证。

### 商业价值
- **市场验证**: 在无需注册情况下验证用户对处方生成功能的接受度
- **功能限制控制**: 在纯前端页面环境下，弹出的登录/注册窗口是阻止用户继续访问尚未开发完全功能的方式
- **技术演示**: 为潜在客户提供功能演示环境
- **风险控制**: 灰度测试降低大规模部署风险

## 🔄 功能范围定义

### ✅ Guest模式可用功能 (无需登录)

#### 1. 处方创建工具 (核心功能)
**访问路径**: `/prescription/create` (设置为Guest模式默认首页)
**功能描述**: 完整的处方创建流程，基于本地Mock数据

**详细功能**:
- ✅ 药品搜索 (基于开发者提供的真实药品数据 - 442条药品)
- ✅ 药品添加到处方
- ✅ 帖数设置和医嘱输入
- ✅ 实时金额计算 (统一使用纽元NZD$)
- ✅ 处方预览界面
- ✅ QR码生成 (基于本地生成的处方ID)
- ✅ PDF导出功能
- ✅ 打印功能

**限制条件**:
- 🚫 不显示真实药品价格 (使用开发者提供的演示价格数据)
- 🚫 不保存处方到后端 (Guest模式下零API调用)
- 🚫 不发送任何网络请求
- ✅ 手动清空处方功能 (导出或打印完成后可清理已生成的处方)

**界面简化要求**:
- 🚫 隐藏页面右下角"联调环境/Mock环境"切换组件
- 🚫 移除医师登录验证，直接访问处方创建功能
- ✅ 保持完整的处方创建用户体验

**处方数据结构 (符合后端API格式)**:
```typescript
// 处方创建请求体格式 (Guest模式本地生成)
interface PrescriptionCreateRequest {
  medicines: Array<{
    medicineId: string;    // 药品ID
    weight: number;        // 单味药克重
  }>;
  copies: number;          // 帖数 (1-30)
  notes?: string;          // 处方整体备注
}

// 处方响应格式 (Guest模式本地模拟)
interface PrescriptionResponse {
  id: string;
  prescriptionId: string;  // RX-YYYY-XXX 格式
  medicines: Array<{
    medicineId: string;
    pinyinName: string;
    englishName: string;
    chineseName: string;
    weight: number;
    unitPrice: number;     // basePrice
    unit: string;
  }>;
  copies: number;
  grossWeight: number;     // 总克重
  totalPrice: number;      // 总价格
  status: 'DRAFT';
  notes?: string;
  createdAt: string;
}
```

**多语言支持**:
- ✅ 全局中英文界面切换功能
- ✅ 药品名称多语言显示 (中文名/英文名切换)
- ✅ 界面文本多语言支持
- ✅ 处方PDF导出支持中英文模式

#### 2. 药品搜索功能
**访问路径**: 处方创建页面内嵌
**功能描述**: 基于442条真实药品数据的药品搜索，数据结构符合后端API格式要求

**详细功能**:
- ✅ 中文名称搜索 (chineseName)
- ✅ 英文名称搜索 (englishName)
- ✅ 拼音名搜索支持 (pinyinName)
- ✅ SKU代码搜索 (sku)
- ✅ 分类筛选 (category: 补益药、活血药、止咳药、安神药、清热药、理气药、化痰药、其他中药)
- ✅ 搜索建议和自动完成
- ✅ 药品基本信息展示 (chineseName、englishName、pinyinName、category、unit)

**API格式兼容**:
```typescript
interface Medicine {
  id: string;
  name: string;              // 对应中文名
  chineseName: string;       // 中文名
  englishName: string;       // 英文名  
  pinyinName: string;        // 拼音名
  sku: string;              // SKU代码
  category: string;         // 分类
  basePrice: number;        // 基础价格 (NZD$)
  unit: string;            // 单位
  status: 'active';        // 状态
}
```

**数据来源**: `archived-docs/medicine-data-450.CSV-processed.csv`
- 总计442条有效药品数据
- 符合后端Medicine模型字段要求
- 8个药品分类完整覆盖
- 纽元NZD$价格数据

**限制条件**:
- 🚫 不显示供应商信息
- 🚫 不显示真实库存信息
- ✅ 显示演示价格 (标注"演示价格")

#### 3. 原默认首页 (隐藏)
**访问路径**: `/` (首页) - **在Guest模式下隐藏测试集成页面**
**功能描述**: 原有的测试集成功能页面在Guest模式下完全隐藏

**隐藏内容**:
- 🚫 测试集成页面 
- 🚫 环境切换功能
- 🚫 开发者测试工具
- 🚫 API调试界面

**路由重定向**: `/` → `/prescription/create` (自动跳转到处方创建页)

### 🔒 需要登录的功能 (触发登录引导)

*注：MVP1.9阶段纯前端验证不开发真实登录/注册功能，仅以弹窗提示*

#### 1. 处方历史管理
**访问路径**: `/doctor/history`, `/doctor/templates`
**行为**: 显示登录引导弹窗

#### 2. 账户相关功能
**访问路径**: `/doctor/account`, `/doctor/settings`
**行为**: 显示登录引导弹窗

#### 3. 管理功能
**访问路径**: `/admin/*`, `/pharmacy/*`
**行为**: 显示角色权限说明 + 登录引导

### 🔄 登录引导机制

#### 引导弹窗设计
```typescript
interface LoginPromptModal {
  title: "体验完整功能需要登录"
  message: "您当前在演示模式下，要使用完整功能请先登录或注册"
  actions: [
    { text: "立即登录", action: "openLoginModal" },
    { text: "免费注册", action: "openRegisterModal" },
    { text: "继续演示", action: "closeModal", style: "secondary" }
  ]
}
```

#### 触发场景
1. 访问受限路由时
2. 尝试保存处方时  
3. 尝试查看历史数据时
4. 尝试使用账户功能时

## 🎨 用户体验设计

### Guest模式标识系统
1. **页面横幅**: "演示模式 - 数据仅供参考"
2. **功能标签**: "演示版本" Badge显示
3. **数据标识**: 所有价格显示 "演示价格"
4. **操作提示**: 保存操作显示"演示保存成功"

### 用户流程设计
```
Guest用户访问 → 自动跳转处方创建页 → 完整处方创建体验 → PDF导出/打印 → 手动清空
```

### 响应式设计要求
- **桌面端**: 完整功能布局
- **平板端**: 适配触摸操作
- **移动端**: 简化界面，核心功能保留

## 🔧 技术实现方案

### 架构设计
```typescript
// Guest模式状态管理
interface GuestModeState {
  isGuestMode: boolean;
  allowedFeatures: string[];
  tempData: {
    prescriptions: LocalPrescription[];
    lastAccess: timestamp;
  };
  language: 'zh' | 'en';     // 语言设置
}

// 多语言状态管理
interface LanguageState {
  currentLanguage: 'zh' | 'en';
  switchLanguage: (lang: 'zh' | 'en') => void;
  getText: (key: string) => string;
}
```

### 路由保护机制
```typescript
// 路由中间件
const GuestModeGuard = (Component) => {
  return (props) => {
    const { pathname } = useRouter();
    const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);
    
    if (isProtectedRoute && isGuestMode) {
      return <LoginPromptModal />;
    }
    
    return <Component {...props} />;
  };
};
```

### 数据层改造
1. **API Client改造**: 添加Guest模式检测
2. **Mock数据集成**: 集成442条真实药品数据，符合后端Medicine模型格式
3. **本地存储**: 内存中临时处方数据管理，使用后端API数据结构
4. **状态管理**: Zustand添加Guest模式状态和多语言状态
5. **路由配置**: 默认首页重定向到处方创建页
6. **组件隐藏**: 移除环境切换组件和测试集成页面
7. **多语言系统**: 支持中英文界面切换和药品名称多语言显示

### 多语言实现方案
1. **语言切换组件**: 页面右上角语言切换按钮 (中/EN)
2. **文本国际化**: 使用i18n库管理界面文本翻译
3. **药品名称显示**: 根据语言设置显示中文名或英文名
4. **PDF导出**: 支持中英文处方格式导出

### 打印和导出功能
1. **PDF生成**: 使用react-pdf，添加"演示版本"水印
2. **打印样式**: CSS print media优化
3. **QR码**: 基于本地生成ID，包含演示标识

## 📊 成功指标

### 功能指标
- ✅ 处方创建成功率 > 95%
- ✅ PDF导出成功率 > 90%
- ✅ 页面加载时间 < 3秒
- ✅ 移动端适配完整度 > 90%

### 转化指标
- 🎯 Guest → 注册转化率 > 15%
- 🎯 功能使用深度 > 3个操作/会话
- 🎯 会话时长 > 5分钟
- 🎯 返回访问率 > 30%

### 技术指标
- ✅ 零网络请求 (除静态资源)
- ✅ 零API调用 (纯前端运行，仍需网络连接)
- ✅ 浏览器兼容性 > 95%
- ✅ 无JavaScript错误

## 🚀 实施计划

### Phase 1: 基础改造 (2天)
**目标**: 建立Guest模式基础架构
- [x] 创建PRD和SOP文档
- [ ] 创建Git分支 `Grey test July`
- [ ] 实现Guest模式状态管理
- [ ] 改造路由保护机制

### Phase 2: 功能实现 (3天)
**目标**: 核心功能Guest模式适配
- [ ] 处方创建页面Guest模式改造
- [ ] 本地数据存储机制
- [ ] PDF导出演示版本水印
- [ ] 登录引导弹窗实现

### Phase 3: 用户体验优化 (2天)
**目标**: 完善用户体验和转化机制
- [ ] Guest模式标识系统
- [ ] 响应式设计优化
- [ ] 登录转化流程优化
- [ ] 首页演示引导页面

### Phase 4: 测试和部署 (1天)
**目标**: 质量保证和灰度发布
- [ ] 功能测试验证
- [ ] 跨浏览器兼容性测试
- [ ] 性能优化
- [ ] 部署到灰度测试环境

## 🔍 风险评估

### 技术风险
- **风险**: 本地存储数据丢失
- **缓解**: 添加数据恢复提示和导出功能

### 产品风险  
- **风险**: Guest体验过于简化影响转化
- **缓解**: 保留核心功能完整性，仅限制数据持久化

### 运营风险
- **风险**: 用户混淆演示数据与真实数据
- **缓解**: 明确的演示标识和用户教育

## 📝 验收标准

### 功能验收
- [ ] Guest用户可以完整创建处方
- [ ] PDF导出包含演示标识
- [ ] 受限功能正确引导登录
- [ ] 本地数据24小时自动清理

### 体验验收
- [ ] 首次使用时功能引导清晰
- [ ] 登录转化引导自然流畅
- [ ] 演示标识明显但不影响体验
- [ ] 移动端体验完整可用

### 技术验收
- [ ] 零后端依赖，完全离线可用
- [ ] 浏览器兼容性测试通过
- [ ] 性能指标达到要求
- [ ] 代码质量通过CodeReview

---

**文档状态**: ✅ PRD完成  
**下一步**: 创建SOP实施指南  
**负责人**: Claude Code Assistant  
**审核状态**: 待产品团队审核  

*本文档遵循SuperClaude RIPER方法学，基于MVP TCM Platform架构设计*