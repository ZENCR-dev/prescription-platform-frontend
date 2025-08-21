# 前端遗留资产技术规格清单

**文档版本**: v2.0 Enhanced  
**创建日期**: 2025-08-20  
**分析范围**: docs/old_MVPdocs/, frontend-rebuild-docs/, recycle/, examples/  
**项目**: B2B2C中医处方履约平台 - Supabase-First架构重构  

---

## 📚 PRD/SOP元素 - 产品需求与流程规范

### MVP 2.0 开发指导文档体系

**源文件**: `docs/old_MVPdocs/PRDSOPMVP2.0.md`

#### 业务架构 - 螺旋式配对开发模式

一个四螺旋、7-8周的医疗平台开发框架。第一螺旋(1-3周)：后端API优先，包含医师端、药房端、管理员端、患者端四个并行模块。第二螺旋(3-5周)：前端集成，包含处方创建、扫码履约、审核界面、地图导航。第三螺旋(5-7周)：跨端状态同步和实时通知。第四螺旋(7-8周)：集成测试和生产部署。每个螺旋都有明确的测试驱动开发(TDD)标准，单元测试覆盖率>85%，API端点100%覆盖。

#### 医师端核心功能 - 处方创建与持久化系统

一个RESTful API系统(`POST /api/v1/prescriptions`)，支持药品库存实时校验、价格验证、幂等性保证。响应时间<500ms，支持并发创建，包含数据完整性验证和异常数据处理。集成Stripe充值系统，支持余额支付和状态管理(created→paid→dispensed→completed)，事务保证支付与状态更新的原子性，WebSocket推送状态变更通知。

#### 药房端核心功能 - 处方扫码与履约凭证系统

一个基于QR码的处方验证系统(`POST /api/v1/prescriptions/scan`)，支持处方有效性和支付状态验证，返回处方详情和药品清单。履约凭证上传(`POST /api/v1/fulfillments`)支持最大5MB的JPEG/PNG图片，集成OCR重量识别，状态自动更新为paid→dispensed。PO自动生成基于价目表进行价格计算，一对一绑定处方和PO，自动加入审核队列。

#### 管理员端核心功能 - 全局数据查询与审核系统

一个统一查询接口支持多种资源类型(处方、PO、Invoice)，包含高级筛选、多条件组合查询、CSV/Excel数据导出、实时统计仪表板。审核系统(`PATCH /api/v1/purchase-orders/:id/approve`)支持批量审核、审核日志记录、结果实时通知。财务操作包含原子性事务的余额充值转账(`POST /api/v1/transfers`)，二次验证和操作限额控制。

#### 患者端核心功能 - 药房地理位置与匿名评价系统

一个位置服务API(`GET /api/v1/pharmacies/nearby?lat=&lng=&radius=`)，集成主流地图服务，显示实时营业状态和库存情况，支持最短路径计算。匿名评价系统(`POST /api/v1/feedbacks`)基于设备ID/IP的频率限制(每日一次)，数据完全脱敏不关联个人信息，支持统计分析和评价数据聚合。

### MVP 1.9 Guest模式灰度测试规范

**源文件**: `docs/old_MVPdocs/MVP1.9-PRD-Guest-Mode.md`

#### Guest模式处方工具 - 纯前端处方生成系统

一个完全本地化的处方创建工具，访问路径`/prescription/create`作为Guest模式默认首页。基于442条真实药品数据，支持中英文多语言搜索(chineseName、englishName、pinyinName、sku)，8个药品分类(补益药、活血药、止咳药、安神药、清热药、理气药、化痰药、其他中药)。实时金额计算统一使用纽元NZD$，处方预览界面、QR码生成(基于本地生成的处方ID)、PDF导出、打印功能。零API调用，不保存到后端，提供手动清空功能。

#### 多语言支持系统 - 全局中英文界面切换

一个完整的国际化系统，支持全局中英文界面切换，药品名称多语言显示切换，界面文本多语言支持，处方PDF导出支持中英文模式。数据结构包含中文名、英文名、拼音名三种语言形式，确保医疗专业术语的准确性和可读性。

#### 处方数据结构 - 符合后端API格式的数据模型

一个严格匹配后端API的数据结构系统。`PrescriptionCreateRequest`包含medicines数组(medicineId、weight)、copies帖数(1-30)、notes处方备注。`PrescriptionResponse`包含id(UUID)、prescriptionId(RX-YYYY-XXX格式)、medicines详细数组(medicineId、pinyinName、englishName、chineseName、weight、unitPrice、unit)、copies、grossWeight总克重、totalPrice总价格、status(固定为'DRAFT')、createdAt时间戳。

#### 匿名化权限控制 - 登录引导转化机制

一个智能的权限边界控制系统，Guest模式允许路径包含`/prescription/create`、`/auth/login`、`/auth/register`、首页。需要登录的功能(`/doctor/history`、`/doctor/templates`、`/pharmacy`、`/admin`)触发登录引导弹窗，提供清晰的价值主张说明、友好转化文案、多种登录选项、"继续演示"回退选项。路由重定向规则：首页自动跳转到处方创建页。

### DDD架构设计规范

**源文件**: `docs/old_MVPdocs/SOPv2.0_DDD_Architecture_MVP1.0.md`

#### 领域驱动设计架构 - 三层DDD架构体系

一个完整的领域驱动设计架构，包含订单领域(Order Domain)、支付领域(Payment Domain)、编排领域(Orchestration Domain)。三层架构：业务编排层(OrderPaymentOrchestrator订单支付编排服务)、领域服务层(OrderManagement订单实体管理75%完成、PaymentEngine支付引擎77%完成)、基础设施层(Database数据持久化、External APIs第三方服务、Event Bus事件总线)。遵循单一职责、接口隔离、依赖倒置、事件驱动四大设计原则。

#### 技术标准与质量门禁 - 企业级代码质量标准

一个严格的质量保证体系：TypeScript严格模式启用所有类型检查禁止any类型，测试覆盖率要求核心业务逻辑≥95%支付相关功能100%，代码复杂度控制圈复杂度≤10函数长度≤50行，文档完整性要求所有公共接口必须有JSDoc注释。性能基准：响应时间P95≤200ms P99≤500ms，并发能力支持1000+并发操作，系统可用性≥99.9%故障恢复时间≤5分钟。

#### 风险管控体系 - P0级关键风险管控

一个分级风险管控系统，P0级风险包含业务编排层缺失(违背DDD三层架构)、服务集成数据一致性风险、并发控制安全风险。缓解策略包含立即优先级提升、技术预研NestJS CQRS+Saga模式、分阶段实施先基础事件监听再复杂编排逻辑、事务边界控制明确定义、事件溯源机制建立完整历史追踪、补偿机制实施分布式事务回滚。

---

## 🔧 Supabase-First架构重构指导

### Supabase-First渐进式复现策略

**源文件**: `frontend-rebuild-docs/READMEfrontend-revised.md`

#### Supabase-First架构变更 - 核心技术栈完全替换

一个彻底的架构转换系统：认证系统从自定义JWT+Passport.js完全替换为Supabase Auth(GoTrue)，数据访问从Prisma ORM+自定义权限替换为Supabase Client+RLS策略，实时通信从WebSocket替换为Supabase Realtime，文件存储从本地文件系统替换为Supabase Storage，数据模型从包含患者隐私信息转为完全匿名化处方。373行自定义认证代码0%复用率，需要完全废弃。

#### MVP交付里程碑 - 7阶段Supabase集成模式

一个系统性的7周MVP交付框架：

- **MVP 0.1** Supabase环境搭建(三环境+CLI配置+基础认证+RLS策略理解)
- **MVP 0.2** Supabase Auth集成(完全替代JWT+RLS策略实现+类型安全集成+实时会话管理)
- **MVP 0.3** 数据模型适配(隐私合规数据模型+匿名化处方+Supabase表结构+实时数据订阅)
- **MVP 0.4** Edge Functions集成(价格计算迁移+Stripe集成优化+文件上传+性能优化)
- **MVP 0.5** Supabase Realtime完整集成(实时数据同步+订阅管理优化+离线数据同步+监控集成)
- **MVP 1.0** Vercel生产部署(生产环境配置+环境变量配置+监控告警+系统测试)

#### 高价值组件适配策略 - 11个核心组件分级适配

一个精确的组件迁移策略：

- **一级适配组件2个**(GuestModeGuard.tsx、withAuth.tsx)需要完全重写为Supabase Auth
- **二级适配组件3个**(PrescriptionCreator.tsx、PrescriptionDashboard.tsx、LoginPromptModal.tsx)需要适配匿名化数据模型和Supabase Client调用
- **三级适配组件2个**(medicineService.ts、prescriptionService.ts)需要从传统API改为Supabase Client+Realtime
- **一级复用组件4个**可直接迁移

**预计节省时间**: 一级复用80-90%，二级复用60-70%，三级适配40-50%，一级适配30-40%

### Guest模式系统实施指导

**源文件**: `frontend-rebuild-docs/03-auth-system/guest-mode-implementation.md`

#### Guest模式状态管理 - Zustand持久化状态系统

一个基于Zustand的Guest模式状态管理器，使用sessionStorage持久化(浏览器关闭自动清理)。状态包含isGuestMode布尔值、allowedRoutes数组、sessionStartTime时间戳。方法包含enableGuestMode()、disableGuestMode()、isRouteAllowed(path)路由权限检查、shouldRedirectToHome()重定向判断、clearGuestSession()会话清理。允许路由列表：'/prescription/create'、'/auth/login'、'/auth/register'、'/'。

#### 路由保护系统 - GuestModeGuard组件集成

一个完整的路由保护架构，核心组件GuestModeGuard.tsx(已通过24个测试验证)、LoginPromptModal.tsx、withAuth.tsx。路由权限配置包含Guest允许路由、认证必需路由、重定向规则、默认重定向。GuestModeProvider在根布局集成，处理首页重定向逻辑(Guest模式下从'/'重定向到'/prescription/create')。

#### 用户体验优化 - Guest模式标识系统

一个用户友好的Guest模式体验系统，包含GuestModeBanner组件显示演示模式标识(amber色彩Alert组件+Info图标+Badge标识)，LoginPromptModal包含清晰价值主张说明、友好转化文案、多种登录选项、"继续演示"回退选项。认证页面结构包含登录表单、引导文案、返回演示模式链接。完整的端到端功能验证包含自动重定向、正常显示、登录引导、演示模式标识。

---

## 🔄 可复用组件技术规格

### 核心业务组件

**源目录**: `recycle/components/`

#### 处方创建组件 - PrescriptionCreator.tsx

一个多步骤的处方创建向导组件，支持medicines、details、review、payment四个步骤。状态管理包含currentStep步骤控制、prescriptionData处方数据(已移除患者隐私字段遵循API v3.3规范)、isLoading加载状态、errors错误数组。核心功能包含药品选择(集成MedicineSearch组件)、处方详情编辑(帖数、医嘱、用法说明)、实时价格计算、处方预览、QR码生成、PDF导出。集成BalancePaymentModal支付模态框，使用useAuth hooks进行认证检查。Props接口支持onSuccess回调、onCancel回调、initialData初始数据、mode创建或编辑模式。

#### 药品搜索组件 - MedicineSearch.tsx

一个高性能的实时搜索组件，支持中文名、英文名、拼音名、SKU代码的模糊匹配搜索。技术特性包含useRef管理input和dropdown引用、useState管理搜索词和结果、防抖输入处理、分类筛选、搜索结果高亮。键盘导航使用react-hotkeys-hook支持上下箭头选择、Enter确认、ESC取消。UI特性包含最大下拉高度自定义(默认300px)、自动滚动到选中项、点击外部关闭下拉、最多显示15个结果。数据结构兼容mockMedicines格式，包含id、name、chineseName、englishName、pinyinName、category、pricePerGram字段。

#### 处方仪表板组件 - PrescriptionDashboard.tsx

一个完整的处方管理界面组件，提供处方列表展示、状态筛选、搜索功能、分页浏览。状态筛选支持DRAFT、PENDING、PROCESSING、COMPLETED四种状态，搜索支持处方ID、医师名称搜索。UI组件集成Card、Badge、Button、Input、Select等shadcn/ui组件。数据管理使用getPrescriptions服务函数，支持PrescriptionSearchParams参数(query、status、pharmacyId、dateFrom、dateTo、page、limit)。每个处方项显示基本信息(ID、状态、创建时间、总金额)、状态标识Badge、操作按钮组。预留集成处方详情模态框、状态更新操作、批量操作功能接口。

#### 处方详情模态框 - PrescriptionDetailModal.tsx

一个全功能的处方详情展示组件，使用Dialog模态框架构。详情展示包含处方基本信息(ID、状态、创建时间、医师信息)、药品清单表格(药品名称、用量、单价、小计)、处方说明(用法用量、医嘱备注)、价格汇总(单剂价格、总价格、帖数)。状态管理支持处方状态更新操作、历史记录查看。UI设计包含响应式布局、打印友好样式、状态颜色标识。数据适配支持隐私合规的匿名化处方数据模型，移除所有患者标识字段。操作功能包含关闭模态框、打印处方、状态更新、历史查看。

### 认证权限组件

**源目录**: `recycle/auth/`

#### Guest模式路由守卫 - GuestModeGuard.tsx

一个高阶路由保护组件(已通过24个完整测试)，使用React forwardRef和useImperativeHandle模式。认证检查通过useGuestModeStore的isGuestMode和isRouteAllowed方法，路由拦截使用useRouter和usePathname hooks。权限控制支持requireAuth强制认证、redirectTo自定义重定向路径、onUnauthorizedAccess未授权回调。核心逻辑包含Guest模式下首页重定向到处方创建页、检查当前路由权限、显示登录引导模态框、处理未授权访问。安全特性包含router安全检查确保函数存在、路由权限动态检查、登录提示模态框状态管理。集成LoginPromptModal组件提供登录引导界面。

#### 高阶认证组件 - withAuth.tsx

一个HOC(高阶组件)认证包装器，需要完全重写为Supabase Auth集成。原架构基于JWT token localStorage检查，新架构需要使用supabase.auth.getSession()和supabase.auth.onAuthStateChange()实现。HOC模式支持包装任意React组件，提供认证状态检查、未认证重定向、认证加载状态、错误处理。新Supabase版本需要集成Session管理、实时认证状态变更监听、token自动刷新、logout处理。返回增强组件包含认证用户信息、权限检查方法、logout方法、认证状态。

### 业务逻辑服务

**源目录**: `recycle/services/`

#### 处方计算器服务 - prescriptionCalculator.ts

一个高精度的处方价格计算引擎，支持NZD cents精度计算防止浮点数问题。核心算法包含根据药品ID和名称查找药品信息(findMedicineById、findMedicineByName)、批发价和成本价计算(批发价=零售价×75%，成本价=零售价×55%)、处方总价计算(单剂价格×帖数)。数据模型包含PharmacyMedicineInfo(扩展Medicine添加wholesalePrice、costPrice、found字段)、PrescriptionCalculationResult(包含success、error、药品详情、价格汇总、未找到药品列表)。工具函数包含价格格式化formatPrice、利润率计算calculateProfitMargin、四舍五入到两位小数。需要迁移到Supabase Edge Functions进行服务器端计算。

#### Guest数据管理器 - guestDataManager.ts

一个完全内存化的Guest模式数据管理器，零localStorage依赖。数据模型包含MedicineItem(药品项目：id、name、quantity、pricePerGram、subtotal)、LocalPrescription(本地处方：id、medicines、instructions、dosage、totalAmount、createdAt、isDemo)。GuestDataManager类提供savePrescription保存处方、getPrescriptions获取所有处方、clearPrescriptions清空所有处方、clearAfterExport导出后清空。私有方法generateId生成唯一ID(格式：guest_timestamp_random)。便利方法getCount获取数量、hasData检查是否有数据。完全匹配后端PrescriptionResponse格式确保API兼容性。需要适配Supabase匿名认证和本地缓存集成。

#### QR码解析器 - qrParser.ts

一个QR码数据解析和生成工具，支持处方二维码的编码解码。解析功能支持PrescriptionQRData格式(prescriptionId、items数组、copies、instructions)，每个item包含id、name、quantity字段。生成功能创建符合后端标准的QR码数据结构，支持JSON序列化和Base64编码。验证功能包含数据完整性检查、必填字段验证、数据类型验证、格式规范验证。错误处理包含解析异常捕获、数据格式错误处理、损坏QR码恢复。集成二维码库(qrcode.js或类似)支持QR码图像生成、自定义尺寸、错误纠正级别。无需修改可直接复用。

### 工具函数库

**源目录**: `recycle/utils/`

#### 药品服务 - medicineService.ts

一个药品数据管理服务，需要从传统API改为Supabase Client调用。原架构使用mockMedicines数据和传统fetch API，新架构需要集成Supabase medicines表和RLS策略。核心功能包含药品搜索searchMedicinesEnhanced(支持多字段模糊搜索、分类筛选、分页查询)、药品详情获取getMedicineById、药品分类列表getMedicineCategories。搜索算法支持中文名、英文名、拼音名、SKU的组合搜索，权重排序算法(精确匹配>前缀匹配>包含匹配)。Supabase集成需要使用supabase.from('medicines').select()、.textSearch()、.filter()方法，RLS策略确保数据访问权限。缓存策略使用Supabase本地缓存，减少重复查询。

#### 处方服务 - prescriptionService.ts

一个处方业务逻辑服务，需要集成Supabase实时订阅和数据库直连。原架构使用内存模拟数据和传统Promise模式，新架构需要完全重写为Supabase架构。核心功能包含处方CRUD操作(getPrescriptions、createPrescription、updatePrescriptionStatus、cancelPrescription)、处方统计getPrescriptionStats、分页查询支持。数据模型已适配隐私合规移除患者信息字段，使用practitionerId和prescriptionCode进行识别。Supabase集成包含supabase.from('prescriptions')操作、RLS策略权限控制、实时订阅supabase.channel().on('postgres_changes')、状态管理。事务操作使用Supabase事务保证数据一致性。实时功能支持处方状态变更推送、账户余额更新、药房状态同步。

---

## 🏗️ 架构模式与最佳实践

**源目录**: `examples/architecture/`

### Supabase-First架构模式 - 云原生优先架构设计

一个完整的Supabase优先架构模式，包含认证层(Supabase Auth GoTrue)、数据层(PostgreSQL + RLS策略)、API层(Supabase Client + Edge Functions)、实时层(Supabase Realtime)、存储层(Supabase Storage)。架构原则包含服务器端优先(Edge Functions执行业务逻辑)、数据库优先(RLS策略控制权限)、实时优先(Realtime订阅数据变更)、类型安全优先(TypeScript类型生成)。集成模式包含Next.js App Router、Vercel部署、TypeScript严格模式、Tailwind CSS、shadcn/ui组件库。

### 代码复用资产包 - 企业级代码复用标准

一个系统化的代码复用分级体系：

- **一级复用**(直接迁移，80-90%时间节省)
- **二级复用**(适配迁移，60-70%时间节省)
- **三级适配**(架构调整，40-50%时间节省)
- **一级适配**(认证重写，30-40%时间节省)

质量标准包含完整测试验证、TypeScript类型安全、ESLint规范检查、隐私合规验证。复用流程包含复用准备(依赖安装+环境配置)、适配优先级(按复用等级排序)、质量验证(测试覆盖率检查)。

### 匿名化数据模型 - GDPR/HIPAA合规设计

一个完全匿名化的医疗数据架构，移除所有患者隐私信息使用prescriptionCode替代患者标识。数据模型包含匿名化处方(id、prescriptionCode、practitionerId、status、medicines数组、totalAmount、时间戳)、医师信息(practitionerId、displayName、practiceNumber、role)、药品信息(medicineId、多语言名称、category、basePrice、unit)。隐私保护措施包含数据脱敏、匿名标识符、最小化数据收集、数据保留期限控制、访问日志记录。合规验证包含GDPR第25条设计隐私保护、HIPAA安全规则、数据处理记录、用户权利响应机制。

---

## 🎯 技术迁移优先级建议

### 立即可用 (一级复用)

**时间节省**: 80-90%

- **MedicineSearch.tsx** - 药品搜索核心算法
- **PrescriptionDetailModal.tsx** - 详情展示组件
- **qrParser.ts** - QR码解析工具
- **prescriptionCalculator.ts** - 价格计算引擎
- **guestDataManager.ts** - Guest数据管理

### 适配迁移 (二级复用)

**时间节省**: 60-70%

- **PrescriptionCreator.tsx** - 隐私合规适配
- **PrescriptionDashboard.tsx** - Supabase实时订阅集成

### 架构重构 (三级适配)

**时间节省**: 40-50%

- **medicineService.ts** - Supabase Client改造
- **prescriptionService.ts** - 实时订阅集成

### 认证重写 (一级适配)

**时间节省**: 30-40%

- **GuestModeGuard.tsx** - Supabase Auth集成
- **withAuth.tsx** - HOC重写

---

## 📋 实施建议

### 净室重启策略

1. **代码回滚**: 执行到commit `25670bf`保留纯前端基础架构
2. **组件迁移**: 按优先级系统性迁移可复用组件
3. **架构适配**: 严格遵循Supabase-First架构原则
4. **隐私合规**: 确保所有数据模型完全匿名化

### 质量保证措施

- **测试覆盖率**: 核心组件≥95%，认证组件100%
- **类型安全**: TypeScript严格模式，禁止any类型
- **代码规范**: ESLint配置，代码复杂度≤10
- **隐私合规**: GDPR/HIPAA合规验证

此详尽的技术规格清单为前端团队提供了完整的遗留资产复用指南，确保高效的Supabase-First架构重构和净室重启实施。

---

**文档维护**: 本文档应随着架构重构进展定期更新  
**版本控制**: 所有变更需要通过架构审查委员会批准  
**联系方式**: Frontend Architecture Team