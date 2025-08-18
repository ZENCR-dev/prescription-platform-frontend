# MVP0.8 功能分析报告
## 新西兰中医处方平台 - 当前开发状态

### 📊 总体进度概览
- **整体完成度**: 75%
- **核心功能**: QR码扫描 ✅ 完成
- **UI框架**: 95% 完成
- **业务逻辑**: 60% 完成
- **数据交互**: 40% 完成

---

## 🟢 已完全实现的功能模块

### 1. 认证与权限系统 (100%)
**位置**: `src/hooks/useAuth.ts`, `src/components/auth/`
- ✅ JWT模拟认证流程
- ✅ 角色基础访问控制 (admin/doctor/pharmacy)
- ✅ 受保护路由实现
- ✅ 登录/登出状态管理
- ✅ 会话持久化存储

### 2. QR码扫描核心功能 (100%)
**位置**: `src/pages/pharmacy/scan.tsx`, `src/components/pharmacy/QrScanner.tsx`
- ✅ 摄像头访问和管理
- ✅ QR码实时扫描
- ✅ 多摄像头选择
- ✅ 扫描错误处理和恢复
- ✅ 手动输入备选方案

### 3. 处方数据解析 (100%)
**位置**: `src/utils/qrParser.ts`, `src/utils/prescriptionCalculator.ts`
- ✅ QR码文本解析和验证
- ✅ 处方数据结构验证
- ✅ 业务规则验证
- ✅ 价格计算逻辑
- ✅ 错误处理机制

### 4. 医师处方创建 (95%)
**位置**: `src/pages/prescription/create.tsx`
- ✅ 药品搜索和选择
- ✅ 处方药品列表管理
- ✅ 用量和帖数设置
- ✅ 处方预览和QR码生成
- ✅ PDF导出功能

### 5. 基础数据管理 (90%)
**位置**: `src/mocks/`, `src/services/`
- ✅ 504种中药模拟数据
- ✅ 用户数据模拟
- ✅ 药品搜索服务
- ✅ 基础CRUD操作模拟

---

## 🟡 仅有UI但缺少完整交互的功能

### 1. 管理员用户管理 (UI: 90%, 交互: 60%)
**位置**: `src/pages/admin/index.tsx`, `src/pages/admin/users/`

#### 已实现UI:
- ✅ 用户列表展示界面
- ✅ 用户搜索和过滤界面
- ✅ 用户详情查看界面
- ✅ 创建用户表单界面

#### 缺少的交互:
- ❌ 用户编辑功能的前端交互
- ❌ 用户删除确认流程
- ❌ 批量操作功能
- ❌ 用户状态切换的实时反馈
- ❌ 医生账户审核流程的完整UI

#### 需要完善的Mock交互:
```typescript
// 位置: src/services/admin/userService.ts
// 需要完善以下功能的前端调用:
- updateUser() // 已有后端逻辑，缺少前端表单
- deleteUser() // 已有后端逻辑，缺少确认对话框
- approveDoctorAccount() // 已有后端逻辑，缺少审核界面
```

### 2. 药品管理系统 (UI: 80%, 交互: 40%)
**位置**: `src/pages/admin/medicines/`

#### 已实现UI:
- ✅ 药品列表展示
- ✅ 药品搜索界面
- ✅ 创建药品表单

#### 缺少的交互:
- ❌ 药品编辑功能
- ❌ 药品删除功能
- ❌ 批量导入/导出功能
- ❌ 药品分类管理
- ❌ 价格历史记录

#### 需要实现的Mock服务:
```typescript
// 位置: src/services/medicineService.ts
// 需要新增以下功能:
- updateMedicine(id: string, data: MedicineUpdateData)
- deleteMedicine(id: string)
- bulkImportMedicines(data: Medicine[])
- getMedicineHistory(id: string)
```

### 3. 药房处方管理 (UI: 70%, 交互: 30%)
**位置**: `src/pages/pharmacy/`

#### 已实现UI:
- ✅ 药房主控制台
- ✅ 处方扫描界面
- ✅ 处方查询界面框架

#### 缺少的交互:
- ❌ 处方列表的完整展示
- ❌ 处方状态管理 (待处理/处理中/已完成)
- ❌ 报价单生成和提交
- ❌ 处方历史记录查看
- ❌ 药房设置管理

#### 需要实现的Mock服务:
```typescript
// 位置: src/services/pharmacyService.ts (需要创建)
// 需要新增以下功能:
- getPrescriptions(params: PrescriptionSearchParams)
- updatePrescriptionStatus(id: string, status: PrescriptionStatus)
- generateQuote(prescriptionId: string)
- submitQuote(quoteData: QuoteData)
```

### 4. 医师工作站扩展功能 (UI: 30%, 交互: 10%)
**位置**: `src/pages/doctor/`

#### 已实现UI:
- ✅ 医师主页基础框架
- ✅ 导航链接

#### 缺少的交互:
- ❌ 患者管理界面
- ❌ 处方历史查看
- ❌ 患者病历管理
- ❌ 处方模板功能

#### 需要实现的页面和服务:
```typescript
// 需要创建的页面:
- src/pages/doctor/patients/index.tsx
- src/pages/doctor/prescriptions/index.tsx
- src/pages/doctor/templates/index.tsx

// 需要创建的服务:
- src/services/patientService.ts
- src/services/prescriptionHistoryService.ts
```

---

## 🔴 完全未实现的功能模块

### 1. 患者端功能 (0%)
**位置**: `src/pages/patient/` (仅有空白页面)

#### 需要实现的功能:
- ❌ 患者注册和登录
- ❌ 处方查看和下载
- ❌ 就诊历史记录
- ❌ 个人信息管理
- ❌ 药房选择和预约

### 2. 报告和统计功能 (0%)
#### 需要实现的功能:
- ❌ 处方统计报告
- ❌ 药品使用分析
- ❌ 用户活跃度统计
- ❌ 收入统计 (模拟)
- ❌ 数据导出功能

### 3. 通知和消息系统 (0%)
#### 需要实现的功能:
- ❌ 实时通知组件
- ❌ 消息中心
- ❌ 邮件通知模拟
- ❌ 系统公告管理

### 4. 高级搜索和过滤 (0%)
#### 需要实现的功能:
- ❌ 高级药品搜索
- ❌ 处方高级过滤
- ❌ 用户高级搜索
- ❌ 搜索历史记录

---

## 🎯 MVP1.0 前端Mock优先级任务

### 优先级1: 核心业务流程完善
1. **药房报价单生成** (预计2天)
   - 完善 `src/pages/pharmacy/scan.tsx` 的价格展示
   - 实现报价单确认和提交流程
   - 添加打印和导出功能

2. **处方状态管理** (预计1.5天)
   - 创建处方状态枚举和类型
   - 实现状态切换的UI组件
   - 添加状态历史记录

### 优先级2: 管理功能完善
3. **用户管理交互完善** (预计2天)
   - 实现用户编辑表单
   - 添加删除确认对话框
   - 完善医生审核流程

4. **药品管理CRUD** (预计1.5天)
   - 实现药品编辑功能
   - 添加删除确认机制
   - 实现批量操作界面

### 优先级3: 扩展功能
5. **医师工作站扩展** (预计3天)
   - 创建患者管理界面
   - 实现处方历史查看
   - 添加处方模板功能

6. **处方查询和历史** (预计2天)
   - 完善药房处方查询功能
   - 实现处方历史记录界面
   - 添加高级搜索功能

---

## 📋 技术债务和优化建议

### 1. 代码结构优化
- **状态管理**: 考虑将更多全局状态迁移到Zustand
- **类型安全**: 完善TypeScript类型定义
- **错误处理**: 统一错误处理机制

### 2. 性能优化
- **组件懒加载**: 实现路由级别的代码分割
- **图片优化**: 添加图片压缩和懒加载
- **缓存策略**: 实现API响应缓存

### 3. 用户体验优化
- **加载状态**: 统一加载状态组件
- **错误边界**: 添加全局错误边界
- **响应式设计**: 优化移动端体验

---

## 🚀 MVP1.0 接口设计准备

基于当前前端Mock实现，为后端开发准备的接口规范：

### 认证接口
```typescript
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
GET /api/auth/profile
```

### 用户管理接口
```typescript
GET /api/admin/users
POST /api/admin/users
PUT /api/admin/users/:id
DELETE /api/admin/users/:id
POST /api/admin/users/:id/approve
```

### 药品管理接口
```typescript
GET /api/medicines
POST /api/medicines
PUT /api/medicines/:id
DELETE /api/medicines/:id
GET /api/medicines/search
```

### 处方管理接口
```typescript
POST /api/prescriptions
GET /api/prescriptions/:id
PUT /api/prescriptions/:id/status
GET /api/pharmacy/prescriptions
POST /api/pharmacy/quotes
```

---

**文档生成时间**: 2024年12月19日
**当前版本**: MVP0.8
**下一个里程碑**: MVP1.0 (预计完成时间: 2025年1月15日)

## 待开发功能模块详细定义

### 1. 管理员用户管理
- **功能**: 列出用户、查看详情、创建、编辑、删除用户；搜索和过滤用户；批准医生账户注册。
- **UI/UX**: 使用数据表格展示用户列表，包含分页、排序、搜索/过滤输入框。用户详情、创建和编辑使用模态框或独立页面中的表单。删除操作需要确认对话框。医生账户批准需要明确的按钮或流程指示。界面需要清晰的状态显示（如活跃/非活跃，待审核）。
- **技术路线 (前端Mock)**: 基于现有 `src/pages/admin/users/` 目录，使用 `@/services/admin/userService.ts` 中的Mock函数模拟API调用。利用 `react-hook-form` 和 `zod` 进行表单处理和验证。使用 `shadcn/ui` 的 `DataTable`, `Dialog`, `Form`, `Input`, `Select` 等组件构建界面。利用 `zustand` 或组件自身状态管理用户列表的数据加载、过滤、分页和表单状态。需要实现用户编辑和删除的模态框/表单组件，以及医生账户批准的UI逻辑。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 对接报告中已列出的用户管理接口：`GET /api/admin/users` (带查询参数 for search/filter/pagination), `POST /api/admin/users`, `PUT /api/admin/users/:id`, `DELETE /api/admin/users/:id`, `POST /api/admin/users/:id/approve`。
    - **后端**: 实现基于角色的访问控制，确保只有管理员能调用这些接口。实现用户数据的CRUD操作和搜索/过滤逻辑。实现医生账户注册申请的接收、查看和批准流程（更新用户状态）。
    - **数据库**: 需要设计 `users` 表，存储用户基本信息（姓名、邮箱、角色、状态、创建时间等）、联系信息（电话、地址）、医生特有信息（HPI编号、APC证书状态）等字段。需要考虑用户密码的存储（加密）。

### 2. 药品管理系统
- **功能**: 列出中药信息、查看详情、创建、编辑、删除中药；搜索中药；支持批量导入/导出；管理药品分类；查看价格历史记录。
- **UI/UX**: 使用数据表格展示中药列表，包含搜索/过滤、分页。中药详情、创建和编辑使用模态框或表单页面。删除需要确认。提供批量导入导出按钮。药品分类管理界面。价格历史图表或列表。
- **技术路线 (前端Mock)**: 基于现有 `src/pages/admin/medicines/` 目录，扩展 `@/services/medicineService.ts` 添加编辑、删除、批量导入和价格历史的Mock函数。使用 `react-hook-form` + `zod` 处理药品表单。使用 `shadcn/ui` 的数据表格、模态框、表单、输入、文件上传等组件。实现药品数据的管理和展示逻辑。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 需要新增以下接口：`PUT /api/medicines/:id`, `DELETE /api/medicines/:id`, `POST /api/medicines/import` (for bulk import), `GET /api/medicines/export` (for export), `GET /api/medicines/:id/history` (for price history), `GET /api/medicine-categories` (for categories).
    - **后端**: 实现管理员权限检查。实现中药数据的CRUD操作。处理批量导入逻辑（解析文件，验证数据，批量写入数据库）。记录药品价格变动历史。管理药品分类数据。
    - **数据库**: 需要设计 `medicines` 表，存储中药信息（ID、中英文名、拼音、价格、属性、分类等）。需要设计 `medicine_price_history` 表记录价格变动。需要设计 `medicine_categories` 表。

### 3. 药房处方管理
- **功能**: 药房接收处方（通过扫描或查询）；展示处方详情；管理处方状态（待处理/处理中/待配发/已完成等）；生成报价单；提交报价单；查看处方历史记录；药房信息设置。
- **UI/UX**: 药房主页展示待处理处方概览。扫描页面已基本实现。处方详情页面展示药品列表、帖数、医嘱等，并显示计算出的价格。状态切换按钮或下拉菜单。报价单预览界面和提交按钮。处方历史列表页面，包含搜索和过滤。药房设置表单。
- **技术路线 (前端Mock)**: 完善 `src/pages/pharmacy/scan.tsx` 和 `src/pages/pharmacy/prescriptions.tsx`。需要创建 `src/services/pharmacyService.ts` 并实现Mock函数用于获取处方列表、更新状态、生成/提交报价单等。使用 `zustand` 管理药房的处方列表和状态。利用现有处方预览组件，并进行修改以显示药房端价格。需要实现报价单生成和提交的模态框/流程。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 对接报告中已列出的部分接口：`GET /api/pharmacy/prescriptions` (带查询/状态参数), `PUT /api/pharmacy/prescriptions/:id/status`, `POST /api/pharmacy/quotes`。可能还需要 `GET /api/pharmacy/prescriptions/:id` (获取单个处方详情), `PUT /api/pharmacy/settings` 等接口。
    - **后端**: 实现药房角色权限检查。实现处方数据的查询（按ID、状态等）。实现处方状态更新逻辑。实现根据处方内容和药房价格计算报价的逻辑。接收和处理药房提交的报价单。记录处方处理历史。管理药房配置信息。
    - **数据库**: 处方数据可以存储在 `prescriptions` 表中，包含处方ID、医生ID、患者ID、药品列表、帖数、医嘱、创建时间、当前状态等字段。报价单数据可以存储在 `quotes` 表中，关联到处方ID，包含总价、药房ID、生成时间、提交状态等。需要 `pharmacies` 表存储药房信息。

### 4. 医师工作站扩展功能
- **功能**: 患者管理（添加、编辑、查看患者信息）；处方历史查看（医生开具的所有处方）；患者病历管理；处方模板创建和使用。
- **UI/UX**: 患者列表页面（搜索、分页）。患者详情/编辑/添加表单。处方历史列表页面（搜索、过滤）。病历详情和编辑界面。处方模板列表和编辑界面。
- **技术路线 (前端Mock)**: 需要创建新的页面文件：`src/pages/doctor/patients/index.tsx`, `src/pages/doctor/prescriptions/index.tsx`, `src/pages/doctor/templates/index.tsx`。需要创建新的Mock服务文件：`src/services/patientService.ts`, `src/services/prescriptionHistoryService.ts`。使用 `react-hook-form` + `zod` 处理表单。使用 `shadcn/ui` 的数据表格、表单等组件。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 需要新增接口：`GET /api/doctor/patients` (with search/pagination), `POST /api/doctor/patients`, `PUT /api/doctor/patients/:id`, `GET /api/doctor/patients/:id`, `GET /api/doctor/prescriptions` (doctor's history), `GET /api/doctor/patients/:id/records` (patient records), `POST /api/doctor/patients/:id/records`, `PUT /api/doctor/patients/:id/records/:recordId`, `GET /api/doctor/templates`, `POST /api/doctor/templates`, `PUT /api/doctor/templates/:id`, `DELETE /api/doctor/templates/:id`。
    - **后端**: 实现医生角色权限检查。实现医生对患者数据的管理（通常医生只能管理自己的患者）。实现处方历史查询（按医生ID过滤）。实现病历数据的存储和管理。实现处方模板的存储和管理。
    - **数据库**: 需要 `patients` 表（如果与users表分开的话，需要关联医生ID）。需要 `patient_records` 表。需要 `prescription_templates` 表（关联医生ID）。处方数据 (`prescriptions` 表) 已经存在，只需添加按医生ID查询的逻辑。

### 5. 患者端功能
- **功能**: 患者注册和登录；查看自己的处方；下载处方PDF；查看就诊历史记录；管理个人信息；选择药房和预约（可选）。
- **UI/UX**: 注册/登录页面。患者控制台主页。处方列表页面，包含处方详情查看和PDF下载按钮。就诊历史列表。个人信息查看和编辑表单。药房列表和预约流程界面。
- **技术路线 (前端Mock)**: 需要创建新的页面文件 `src/pages/patient/` 下的各个子页面。需要创建新的Mock服务 `src/services/patientAuthService.ts`, `src/services/patientPrescriptionService.ts`, `src/services/appointmentService.ts`。使用 `react-hook-form` + `zod` 处理表单。使用 `shadcn/ui` 组件。需要实现患者认证流程的Mock。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 需要新增接口：`POST /api/auth/patient/register`, `POST /api/auth/patient/login`, `GET /api/patient/profile`, `PUT /api/patient/profile`, `GET /api/patient/prescriptions`, `GET /api/patient/prescriptions/:id/pdf` (for download), `GET /api/patient/visits`, `GET /api/pharmacies` (for patient to choose), `POST /api/appointments`。
    - **后端**: 实现患者认证和授权逻辑（患者只能访问自己的数据）。实现患者信息管理。实现根据患者ID查询处方和就诊记录。生成处方PDF。实现药房列表查询。实现预约功能逻辑。
    - **数据库**: 需要 `patients` 表（如果与users表分开的话，需要关联）。处方数据 (`prescriptions` 表)需要添加患者ID字段。需要 `patient_visits` 表。需要 `appointments` 表。

### 6. 报告和统计功能
- **功能**: 提供管理员仪表盘的统计数据；处方统计报告（按时间、医生、药房等）；药品使用分析；用户活跃度统计；收入统计（模拟）；数据导出（如CSV）。
- **UI/UX**: 管理员仪表盘已部分实现，需要完善和添加更多统计卡片和图表。独立的报告页面，提供过滤选项和图表/表格展示。导出按钮。
- **技术路线 (前端Mock)**: 扩展 `src/pages/admin/index.tsx` 和 `src/services/admin/dashboardService.ts` 添加更多Mock统计数据。需要引入图表库（如 Recharts 或 Chart.js）来展示数据。如果需要独立的报告页面，创建新页面文件和Mock服务。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 对接现有 `GET /api/admin/dashboard/stats` 并扩展返回更多数据。需要新增接口：`GET /api/admin/reports/prescriptions` (with filter params), `GET /api/admin/reports/medicines`, `GET /api/admin/reports/users`, `GET /api/admin/reports/revenue`, `GET /api/admin/reports/:type/export`。
    - **后端**: 实现管理员权限检查。编写复杂的数据库查询和聚合逻辑来生成各种统计报告数据。处理数据导出请求（生成CSV等文件）。
    - **数据库**: 需要能够高效查询 `users`, `prescriptions`, `quotes` 等表以生成报告。可能需要物化视图或预计算的汇总表来提高报告查询性能。

### 7. 通知和消息系统
- **功能**: 实时通知（如医生账户被批准，新处方到达药房）；站内消息中心；邮件通知（模拟）；系统公告管理。
- **UI/UX**: 顶部导航栏的通知图标/计数。下拉式通知列表。独立的站内消息中心页面（收件箱、发件箱、撰写）。管理员发布系统公告的界面。
- **技术路线 (前端Mock)**: 需要一个全局状态管理（Zustand）来存储和管理通知。需要创建一个通知组件（可能是Toast或Modal）。消息中心和公告管理需要新的页面和Mock服务。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 需要新增接口：`GET /api/notifications` (fetch user notifications), `PUT /api/notifications/:id/read`, `GET /api/messages` (fetch user messages), `POST /api/messages`, `GET /api/admin/announcements`, `POST /api/admin/announcements`。可能需要WebSocket连接来实现实时通知。
    - **后端**: 实现通知的生成和分发逻辑（基于用户角色和事件）。实现消息的存储和查询。实现系统公告的发布和管理。需要考虑实时通知的推送机制。
    - **数据库**: 需要 `notifications` 表（存储通知内容、接收用户、状态、时间戳）。需要 `messages` 表（发件人、收件人、主题、内容、时间戳）。需要 `announcements` 表。

### 8. 高级搜索和过滤
- **功能**: 为药品、处方、用户等列表提供更灵活、多条件的搜索和过滤选项；保存常用搜索条件；查看搜索历史。
- **UI/UX**: 在现有列表页面添加"高级搜索"入口，打开模态框或折叠区域，提供多个字段的输入框、下拉选择框、日期范围选择器等。保存/加载搜索条件的UI。搜索历史列表。
- **技术路线 (前端Mock)**: 在需要高级搜索的页面（如药品列表、药房处方列表、用户列表）添加UI组件。修改现有的Mock服务，使其能够处理更复杂的查询参数。
- **后端/DB/API对接 (MVP1.0)**:
    - **API**: 扩展现有列表接口（如 `GET /api/medicines`, `GET /api/pharmacy/prescriptions`, `GET /api/admin/users`），使其能接受包含多个过滤条件的复杂查询参数对象。需要新增接口用于保存/加载搜索条件。
    - **后端**: 实现后端查询逻辑，根据前端传递的复杂参数构建数据库查询语句。实现搜索条件的存储和管理。
    - **数据库**: 数据库查询性能需要优化，确保多条件查询的高效性。 