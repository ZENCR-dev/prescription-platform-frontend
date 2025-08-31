# 中医处方平台设计系统 | TCM Platform Design System

## 🎨 核心设计理念

### 设计哲学
- **极简主义为主**：清晰、简洁、专注于内容
- **传统中医元素点缀**：太极、经典引言、传统配色
- **响应式优先**：桌面端和移动端自适应
- **双语支持**：纯前端切换，无需路由变更

### 设计原则
1. **清晰层次**：使用留白和线条区分内容层级
2. **优雅动效**：微妙的过渡效果增强用户体验
3. **专业可信**：医疗级的视觉呈现
4. **文化融合**：现代设计与传统元素和谐共存

---

## 🎨 颜色系统

### 主色调
```css
/* Sage - 主色调，鼠尾草绿 */
--sage-50: #f6f7f6;
--sage-100: #e5ebe8;
--sage-200: #ccd7d1;
--sage-300: #b2c2b9;
--sage-400: #98aea2;
--sage-500: #7e998a;  /* 默认 */
--sage-600: #637e6f;
--sage-700: #4a5e53;
--sage-800: #313f37;
--sage-900: #191f1c;

/* Cambridge - 强调色，剑桥蓝 */
--cambridge-50: #f0f6f4;
--cambridge-100: #e5f2ee;
--cambridge-200: #cbe5dd;
--cambridge-300: #b2d8cd;
--cambridge-400: #98cbbc;
--cambridge-500: #7fbeab;  /* 默认 */
--cambridge-600: #55a88f;
--cambridge-700: #407e6b;
--cambridge-800: #2a5448;
--cambridge-900: #152a24;
```

### 语义颜色
```css
/* 状态色 */
--success: #48bb78;    /* 成功 */
--warning: #f59e0b;    /* 警告 */
--error: #dc2626;      /* 错误 */
--info: #3b82f6;       /* 信息 */

/* 中性色 */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;
```

---

## 📐 排版系统

### 字体族
```css
font-family: 'Inter', 'Noto Sans SC', system-ui, -apple-system, sans-serif;
```

### 字号规范
```css
--text-xs: 0.75rem;    /* 12px - 辅助信息 */
--text-sm: 0.875rem;   /* 14px - 次要文本 */
--text-base: 1rem;     /* 16px - 正文 */
--text-lg: 1.125rem;   /* 18px - 小标题 */
--text-xl: 1.25rem;    /* 20px - 标题 */
--text-2xl: 1.5rem;    /* 24px - 页面标题 */
--text-3xl: 1.875rem;  /* 30px - 大标题 */
```

### 字重
```css
--font-light: 300;     /* 轻体 - 优雅的标题 */
--font-normal: 400;    /* 常规 - 正文 */
--font-medium: 500;    /* 中等 - 强调 */
--font-semibold: 600;  /* 半粗 - 按钮 */
--font-bold: 700;      /* 粗体 - 重要标题 */
```

---

## 🔲 间距系统

基于8px网格系统：
```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## 🎭 组件样式

### 输入框（极简风格）
```html
<input type="text" 
       class="w-full px-0 py-2 border-0 border-b-2 border-gray-200 
              focus:border-cambridge-500 focus:outline-none 
              transition-colors text-gray-800 placeholder-gray-400">
```

### 按钮（主按钮）
```html
<button class="py-3 px-6 bg-sage-600 text-white font-light tracking-wide 
               hover:bg-sage-700 transition-all transform 
               hover:scale-[1.02] active:scale-[0.98]">
    按钮文字
</button>
```

### 切换开关（自定义）
```html
<label class="flex items-center cursor-pointer">
    <input type="checkbox" class="sr-only peer">
    <div class="relative w-10 h-5 bg-gray-200 rounded-full 
                peer-checked:bg-cambridge-500 transition-colors">
        <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full 
                    transition-transform duration-200 
                    peer-checked:translate-x-5"></div>
    </div>
    <span class="ml-3">标签文字</span>
</label>
```

### 第三方登录按钮
```html
<button class="w-full py-2.5 border border-gray-200 
               hover:border-gray-300 hover:bg-gray-50 
               transition-all flex items-center justify-center gap-3">
    <svg><!-- 图标 --></svg>
    <span>按钮文字</span>
</button>
```

---

## 🌏 双语切换系统

### HTML结构
```html
<!-- 中文内容 -->
<span class="zh">中文文本</span>
<!-- 英文内容 -->
<span class="en hidden">English Text</span>
```

### JavaScript控制
```javascript
// 切换语言
function toggleLanguage() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    
    // 显示/隐藏对应语言内容
    document.querySelectorAll('.zh').forEach(el => {
        el.style.display = currentLang === 'zh' ? 'inline' : 'none';
    });
    
    document.querySelectorAll('.en').forEach(el => {
        el.style.display = currentLang === 'en' ? 'inline' : 'none';
    });
    
    // 保存到localStorage
    localStorage.setItem('preferredLanguage', currentLang);
}
```

### 语言切换按钮
```html
<button class="px-4 py-2 bg-white/80 backdrop-blur 
               border border-gray-200 rounded-full 
               text-sm font-medium text-gray-700 
               hover:bg-white transition-all shadow-sm">
    <svg><!-- 地球图标 --></svg>
    <span id="lang-toggle-text">English</span>
</button>
```

---

## 🎬 动画效果

### 基础过渡
```css
/* 颜色过渡 */
transition-colors: 200ms;

/* 所有属性过渡 */
transition-all: 200ms;

/* 变换过渡 */
transition-transform: 200ms;
```

### 悬停效果
```css
/* 按钮悬停 */
hover:scale-[1.02]
active:scale-[0.98]

/* 背景悬停 */
hover:bg-gray-50

/* 边框悬停 */
hover:border-gray-300
```

### 特殊动画
```css
/* 太极旋转 */
@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}
.yin-yang {
    animation: rotate 20s linear infinite;
}

/* 淡入效果 */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
.fade-in {
    animation: fadeIn 0.3s ease-in;
}
```

---

## 📱 响应式设计

### 断点
```css
sm: 640px   /* 小屏幕 */
md: 768px   /* 平板 */
lg: 1024px  /* 桌面 */
xl: 1280px  /* 大屏幕 */
2xl: 1536px /* 超大屏幕 */
```

### 响应式类示例
```html
<!-- 桌面显示，移动隐藏 -->
<div class="hidden lg:flex">...</div>

<!-- 移动显示，桌面隐藏 -->
<div class="lg:hidden">...</div>

<!-- 响应式内边距 -->
<div class="px-4 sm:px-6 lg:px-8">...</div>
```

---

## 🏥 中医元素

### 太极图标（SVG）
```html
<svg class="w-24 h-24 text-sage-600" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="48" fill="currentColor" opacity="0.1"/>
    <path d="M50,2 A48,48 0 0,1 50,98 A24,24 0 0,0 50,50 A24,24 0 0,1 50,2" 
          fill="currentColor" opacity="0.3"/>
    <circle cx="50" cy="26" r="8" fill="currentColor" opacity="0.3"/>
    <circle cx="50" cy="74" r="8" fill="white"/>
</svg>
```

### 装饰性引言
```html
<div class="border-l-2 border-cambridge-300 pl-4">
    <p class="text-sage-700 italic">
        "上工治未病，不治已病"
    </p>
    <p class="text-sm text-sage-500 mt-1">
        《黄帝内经》
    </p>
</div>
```

### 装饰线条
```html
<div class="flex items-center">
    <div class="w-8 h-px bg-cambridge-400 mr-4"></div>
    <span>文本内容</span>
</div>
```

---

## 📋 使用指南

### 1. 新页面创建
- 使用相同的颜色系统和排版规范
- 保持极简主义设计风格
- 确保双语支持从一开始就实现
- 遵循响应式设计原则

### 2. 组件复用
- 输入框统一使用底线样式
- 按钮使用sage配色
- 切换开关使用自定义样式
- 保持动画效果的一致性

### 3. 中医元素运用
- 适度使用，不要过度装饰
- 主要用于品牌识别和文化体现
- 保持现代感和专业性的平衡

### 4. 质量检查清单
- [ ] 双语文本都已实现
- [ ] 响应式布局正常工作
- [ ] 动画效果流畅
- [ ] 颜色使用符合设计系统
- [ ] 无障碍性考虑（对比度、键盘导航等）

---

## 📐 实施示例

参考文件：`docs/ui-ux-research/prototypes/login-v3-minimal-tcm.html`

这是我们的设计系统的完整实现示例，包含：
- 极简主义布局
- 中医元素装饰
- 双语切换功能
- 响应式设计
- 所有组件样式

---

**文档状态**：✅ 定稿  
**版本**：1.0  
**最后更新**：2025-08-30  
**适用范围**：整个前端项目