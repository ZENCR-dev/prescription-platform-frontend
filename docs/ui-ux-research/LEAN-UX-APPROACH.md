# 极简UX工作方式 - Frontend Lead与用户直接对话

## 核心理念：直接对话，快速迭代

**参与者**：仅Frontend Lead + 用户（您）
**方式**：直接展示HTML样稿，收集反馈，立即迭代
**时间**：每次15-30分钟对话
**输出**：HTML原型 + 简短反馈记录

---

## 工作流程（极简3步）

### Step 1: 快速HTML原型（2小时）
Frontend Lead创建基础HTML样稿：
```html
<!-- 直接在 prototypes/ 目录创建 -->
prototypes/
├── login-v1.html      # 登录页面
├── dashboard-v1.html  # 主界面
└── styles.css        # 基础样式
```

### Step 2: 直接对话（30分钟）
```markdown
Frontend Lead: "这是登录页面设计，您觉得如何？"
用户: "按钮太小了，颜色不够醒目"
Frontend Lead: "我马上调整，稍等5分钟"
[实时修改HTML]
Frontend Lead: "现在呢？"
用户: "好多了，但还需要..."
```

### Step 3: 记录关键点（5分钟）
```markdown
## 2025-08-30 对话记录
- ✅ 按钮放大到48px高度
- ✅ 主色调改为医疗蓝 #0F4C81
- ✅ 添加记住密码选项
- ⏳ 下次讨论：角色切换功能
```

---

## HTML样稿模板（立即可用）

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>认证UI原型 - v1</title>
    <style>
        body { 
            font-family: system-ui; 
            max-width: 400px; 
            margin: 50px auto; 
            padding: 20px;
        }
        .login-form { 
            border: 1px solid #ddd; 
            padding: 30px; 
            border-radius: 8px;
        }
        input { 
            width: 100%; 
            padding: 12px; 
            margin: 10px 0; 
            font-size: 16px;
        }
        button { 
            width: 100%; 
            padding: 14px; 
            background: #0F4C81; 
            color: white; 
            border: none; 
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
        }
        button:hover { 
            background: #0a3a63;
        }
    </style>
</head>
<body>
    <div class="login-form">
        <h2>医疗处方平台登录</h2>
        <form>
            <input type="email" placeholder="邮箱">
            <input type="password" placeholder="密码">
            <label>
                <input type="checkbox"> 记住我
            </label>
            <button type="submit">登录</button>
        </form>
    </div>
</body>
</html>
```

---

## 对话要点（每次关注3-5个）

### 本次对话重点
1. **颜色偏好**：医疗蓝？传统绿？中医金？
2. **按钮大小**：手机上是否容易点击？
3. **必要功能**：记住密码？快速切换用户？
4. **文字说明**：需要更多引导文字吗？
5. **整体感觉**：专业？友好？简洁？

### 快速决策模板
```
用户："我觉得___不太好"
Frontend Lead："我可以改成___，您看如何？"
用户："可以" / "还是改成___吧"
[立即修改，5分钟内展示新版本]
```

---

## 文件组织（极简）

```
docs/ui-ux-research/
├── LEAN-UX-APPROACH.md     # 本文档
├── prototypes/              # HTML原型
│   ├── login-v1.html
│   ├── login-v2.html       # 迭代版本
│   └── feedback-notes.md   # 简短反馈记录
└── final/                   # 最终确定版本
    └── auth-ui-final.html
```

---

## 反馈记录模板（超简）

```markdown
## 日期：2025-08-30
### 讨论内容
- 登录页面布局
- 颜色方案
- 按钮样式

### 用户反馈
- ✅ 喜欢：简洁的布局
- ❌ 不喜欢：按钮太小
- 💡 建议：添加指纹登录选项

### 下次修改
1. 按钮增大到48px
2. 添加生物识别图标
3. 调整颜色对比度

### HTML文件
- 当前版本：login-v1.html
- 下次展示：login-v2.html
```

---

## 立即开始

1. **Frontend Lead创建**：`prototypes/login-v1.html`（10分钟）
2. **展示给用户**："这是初版登录页面，请看看"
3. **收集反馈**：记录3-5个关键点
4. **快速修改**：创建v2版本（5分钟）
5. **再次确认**："修改后的版本如何？"
6. **完成或继续**：满意则结束，不满意继续迭代

**核心原则**：
- 不需要专业UX流程
- 不需要大量文档
- 不需要外部参与者
- 只需要Frontend Lead和用户的直接、快速、有效对话

---

**状态**：立即可用
**下一步**：创建第一个HTML原型，开始对话