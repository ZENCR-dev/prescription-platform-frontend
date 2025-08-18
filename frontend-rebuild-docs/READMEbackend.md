# 🚨 PRD逆向工程总结 - Supabase优先技术转移资产

## 📋 项目概述

本目录包含了**B2B2C中医处方履约平台**的完整技术转移文档，基于Supabase-first架构原则，通过逆向工程方法重构了符合现代云原生标准的产品需求文档（PRD）和标准操作程序（SOP）。

### 核心业务模型
- **医师端**：匿名处方创建、账户余额管理、QR码生成
- **药房端**：扫码履约、价格表管理、批量结算  
- **平台端**：差价盈利、审核管理、资金调控

### 收益模式（NZD cents精度）
```
收益 = basePrice(医师收费) - pharmacyPrice(药房成本)
所有金额以cents为单位存储，避免浮点精度问题
```

### 🚨 隐私合规更新
- **❌ 移除**：患者隐私信息收集（patientName等字段）
- **✅ 匿名化**：处方仅包含医师信息、药品信息、用法用量
- **✅ 合规**：符合GDPR、HIPAA等隐私保护法规要求

## 📚 文档架构总览

### 🎯 技术转移文档清单

| 文档 | 内容概要 | 目标读者 | 完成度 |
|------|----------|----------|--------|
| **01-Technical-Transfer-Overview.md** | 🚨 Supabase优先技术栈、RLS权限、业务流程 | 技术经理、架构师 | ✅ 100% |
| **02-Development-Environment-Setup.md** | 🚨 Supabase CLI、Edge Functions、环境配置 | 开发工程师 | ✅ 100% |
| **03-Backend-Architecture-Specification.md** | 🚨 Supabase Auth、RLS策略、隐私合规 | 后端工程师 | ✅ 100% |
| **04-Database-Schema-Implementation.md** | PostgreSQL+Supabase数据模型、RLS设计 | 数据库工程师 | ⏳ 待更新 |
| **05-API-Implementation-Guide.md** | Supabase API、Edge Functions、实时订阅 | API开发工程师 | ⏳ 待更新 |
| **06-Deployment-Operations-Guide.md** | Vercel集成、Supabase监控、运维策略 | DevOps工程师 | ⏳ 待更新 |

## 🏗️ 🚨 Supabase优先技术架构

### 核心技术栈（强制要求）
- **Frontend**: Vercel Next.js 14 + Supabase Starter Kit
- **Database + Auth**: Supabase（PostgreSQL + GoTrue认证）
- **Real-time**: Supabase Realtime subscriptions
- **Storage**: Supabase Storage（替代本地文件系统）
- **Backend**: NestJS Edge Functions（仅处理复杂业务逻辑）
- **Payment**: Stripe API

### 🚨 架构优先级原则
1. **Supabase原生功能优先**：Auth、RLS、Realtime、Storage直接使用
2. **Edge Functions补充**：仅在Supabase无法满足时添加后端逻辑
3. **避免重复实现**：不得重建Supabase已有功能

### 数据架构核心（更新）
**Supabase集成数据架构**：
1. **auth.users** - Supabase内置用户认证表（替代自定义User表）
2. **user_profiles** - 用户扩展信息（关联auth.users.id）
3. **medicines** - 药品主数据（basePrice基准价格，NZD cents）
4. **prescriptions** - 处方主表（❌不包含患者隐私信息）
5. **prescription_medicines** - 处方药品明细（重量+用法）
6. **practitioner_accounts** - 医师账户余额管理
7. **pharmacies + pharmacy_accounts** - 药房信息和账户余额
8. **pharmacy_price_lists** - 药房价格表和审核流程
9. **purchase_orders + fulfillment_proofs** - 履约订单和凭证
10. **withdrawal_requests** - 批量提现申请

**Row Level Security (RLS)策略**：
- 医师仅能访问自有数据（基于auth.uid()）
- 药房仅能处理分配的订单
- 管理员全局访问权限

### 业务流程核心（隐私合规版）
```
医师登录(Supabase Auth) → 匿名处方创建(DRAFT) → 账户扣款 → 处方支付(PAID) 
→ QR码生成 → 药房扫码 → 履约上传 → PO生成(PENDING_REVIEW) 
→ 管理员审核 → PO通过(APPROVED) → 药房余额更新 → 批量提现
```

**🚨 关键业务规则**（不可变更）：
- 医师仅能访问自有处方数据
- 药房价格表必须 ≤ basePrice（管理员审核）
- 所有资金操作使用数据库事务保证
- ❌ 不得收集患者隐私信息（patientName等）
- 支付成功后立即确认平台收入
- PO审核通过后确认平台成本

## 🚀 Supabase-First项目重启指南

### Phase 1: Supabase环境搭建 (Week 1)
#### 1.1 Supabase项目初始化
- [ ] Supabase项目创建（开发、测试、生产三个环境）
- [ ] Supabase CLI安装和登录验证
- [ ] 数据库迁移文件创建：`supabase migration new create_core_tables`
- [ ] RLS策略定义和启用
- [ ] 参考文档：`02-Development-Environment-Setup.md`

#### 1.2 前端仓库初始化
- [ ] Vercel Next.js + Supabase Starter Kit部署
- [ ] TypeScript类型生成：`supabase gen types typescript`
- [ ] Supabase Auth配置和测试
- [ ] Real-time订阅测试

### Phase 2: 核心数据架构实现 (Week 2-3)
#### 2.1 数据库Schema实现
- [ ] auth.users扩展配置（user_metadata设置）
- [ ] 10张核心表结构定义和关联关系
- [ ] RLS策略实现：医师数据隔离、药房权限控制
- [ ] 种子数据和测试数据准备（符合隐私合规）
- [ ] 参考文档：`04-Database-Schema-Implementation.md`

#### 2.2 Supabase Auth集成
- [ ] ❌ 移除：所有自定义JWT认证代码
- [ ] ✅ 集成：Supabase Auth (GoTrue)
- [ ] RLS策略测试和权限验证
- [ ] 用户角色管理（user_metadata.role）
- [ ] 参考文档：`03-Backend-Architecture-Specification.md`

### Phase 3: 业务逻辑实现 (Week 4-5)
#### 3.1 处方管理模块（隐私合规版）
- [ ] ❌ 移除：患者隐私信息字段（patientName等）
- [ ] ✅ 实现：匿名处方CRUD和状态管理
- [ ] 🚨 服务器端价格计算（Edge Functions）
- [ ] Stripe支付集成和账户扣费逻辑
- [ ] QR码生成和处方验证机制
- [ ] 参考文档：`05-API-Implementation-Guide.md`

#### 3.2 药房管理模块  
- [ ] 药房注册、价格表上传和审核
- [ ] 履约流程、凭证上传、PO生成
- [ ] 批量提现申请和审核流程
- [ ] Supabase Storage文件上传集成

### Phase 4: Real-time功能和优化 (Week 6)
#### 4.1 Supabase Realtime集成
- [ ] 处方状态变更实时推送
- [ ] 账户余额变更实时同步
- [ ] 新订单通知和履约状态更新
- [ ] WebSocket连接管理和错误处理

#### 4.2 性能优化
- [ ] 数据库查询优化和索引调优
- [ ] RLS策略性能测试
- [ ] Supabase Edge Functions优化
- [ ] API响应时间优化（P95 < 500ms）

### Phase 5: Vercel部署和监控 (Week 7)
#### 5.1 Vercel生产环境部署
- [ ] Vercel项目配置和环境变量设置
- [ ] Supabase生产环境配置和域名设置
- [ ] Stripe生产环境集成和Webhook配置
- [ ] HTTPS和域名配置
- [ ] 参考文档：`06-Deployment-Operations-Guide.md`

#### 5.2 Supabase监控告警
- [ ] Supabase Dashboard监控配置
- [ ] Edge Functions性能监控
- [ ] 数据库性能监控和告警
- [ ] 业务指标监控（处方量、支付成功率等）

## 📊 重启成功验收标准

### 功能完整性 ✅
- [ ] 医师端：Supabase Auth登录、匿名处方创建、支付完成、QR码生成
- [ ] 药房端：Supabase Auth登录、价格表管理、履约上传、提现申请
- [ ] 管理员端：用户审核、价格表审核、PO审核、Supabase监控查看
- [ ] API文档完整性和错误处理规范性
- [ ] 🚨 隐私合规：无患者隐私信息收集

### 性能质量 ⚡
- [ ] API响应时间P95 < 500ms
- [ ] 并发支持100用户同时操作
- [ ] 数据库查询优化和索引覆盖
- [ ] 测试覆盖率 > 80%

### 安全合规 🔒
- [ ] Supabase Auth认证和RLS权限控制
- [ ] HTTPS数据传输加密
- [ ] 敏感信息脱敏和加密存储
- [ ] API调用审计日志完整
- [ ] 🚨 隐私合规：GDPR、HIPAA标准符合

## 💡 关键技术决策记录

### 1. 🚨 架构迁移决策
- **自定义认证 → Supabase Auth**: 373行自定义JWT代码（0%复用率）完全替换为Supabase Auth
- **Prisma ORM → Supabase Client**: 直接使用Supabase SDK，简化数据访问层
- **应用层权限 → RLS策略**: 数据库层权限控制，提高安全性和性能
- **本地存储 → Supabase Storage**: 云原生文件存储，自动CDN和权限控制

### 2. 隐私合规设计
- **患者隐私保护**: 完全移除patientName等隐私字段，符合GDPR要求
- **匿名处方设计**: 处方仅包含医师信息、药品信息、用法用量
- **数据脱敏**: 所有日志和监控数据自动脱敏处理

### 3. 安全架构考虑
- **RLS数据隔离**: 医师仅能访问自有数据，药房仅处理分配订单
- **服务器端计算**: 所有价格计算在Edge Functions执行，防止前端操控
- **审核机制**: 管理员审核所有价格表和履约凭证
- **NZD cents精度**: 避免浮点数精度问题，符合金融系统标准

## 🔄 迭代计划建议

### MVP 1.0 (Month 1-2) - Supabase基础
- Supabase Auth用户认证系统
- 简化匿名处方流程（无支付）
- 基础药房管理功能
- RLS策略和权限控制

### MVP 2.0 (Month 3-4) - 支付集成  
- Stripe支付流程集成
- 账户余额管理系统
- Edge Functions价格计算
- 基础审核工作流

### MVP 3.0 (Month 5-6) - 完整业务
- 完整履约和结算流程
- Supabase Storage文件管理
- 批量提现功能
- Supabase Realtime实时功能
- 完善监控和告警系统

## 📞 技术转移支持

### 文档使用说明
1. **架构理解**: 从`01-Technical-Transfer-Overview.md`开始了解Supabase优先架构
2. **环境搭建**: 按照`02-Development-Environment-Setup.md`配置Supabase开发环境  
3. **分模块实现**: 参考`03-06`各专业文档进行Supabase集成开发
4. **部署上线**: 使用`06-Deployment-Operations-Guide.md`完成Vercel生产部署

### 团队协作建议
- **技术经理**: 负责Supabase架构方案审查和里程碑管控
- **前端工程师**: 负责Next.js + Supabase Starter Kit实现
- **后端工程师**: 负责Edge Functions和复杂业务逻辑
- **数据库工程师**: 负责PostgreSQL优化和RLS策略配置
- **DevOps工程师**: 负责Vercel部署和Supabase监控

---

**📝 文档版本**: v2.0.0 - Supabase优先架构  
**🕐 最后更新**: 2025-08-01  
**👥 维护团队**: Backend Architecture Team + Frontend Coordination  
**📧 技术支持**: 请创建GitHub Issue或联系项目维护团队

> 💡 **重要提醒**: 本技术转移文档基于Supabase-first架构原则，包含了隐私合规的设计和云原生最佳实践。所有自定义认证代码已被Supabase Auth替代，确保项目重启的安全性、合规性和可维护性。