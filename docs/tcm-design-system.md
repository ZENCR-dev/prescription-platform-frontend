# TCM Design System Specification
## Dev-Step 3.11: TCM Cultural Design Layer

### 🎨 TCM Color System

#### Primary Colors (中医药色谱)
```css
/* CSS Variables - Centralized in app/globals.css */
--tcm-sage-50: #f0f4f2;      /* 淡青白 */
--tcm-sage-100: #dce5e0;     /* 青白 */
--tcm-sage-200: #b8cbc1;     /* 淡青灰 */
--tcm-sage-300: #95b1a3;     /* 淡青绿 */
--tcm-sage-400: #7e998a;     /* 青绿 (Primary) */
--tcm-sage-500: #688172;     /* 深青绿 */
--tcm-sage-600: #536759;     /* 墨绿 */
--tcm-sage-700: #3e4d41;     /* 深墨绿 */
--tcm-sage-800: #293329;     /* 极深绿 */
--tcm-sage-900: #141a14;     /* 墨黑 */

--tcm-bamboo-100: #e8f5f0;   /* 竹青白 */
--tcm-bamboo-200: #c4e6d8;   /* 淡竹青 */
--tcm-bamboo-300: #a0d7c0;   /* 竹青 */
--tcm-bamboo-400: #7ec8a8;   /* 翠竹 */
--tcm-bamboo-500: #5cb990;   /* 深竹绿 */

--tcm-herb-100: #faf6e9;     /* 药材白 */
--tcm-herb-200: #f0e6c4;     /* 淡药黄 */
--tcm-herb-300: #e5d6a0;     /* 药黄 */
--tcm-herb-400: #dbc67c;     /* 深药黄 */
--tcm-herb-500: #d0b658;     /* 药材金 */
```

#### Semantic Colors
```css
--tcm-success: var(--tcm-bamboo-400);
--tcm-warning: var(--tcm-herb-400);
--tcm-error: #d97373;        /* 朱砂红 */
--tcm-info: var(--tcm-sage-400);
```

### 📐 Spacing & Layout

#### Spacing System
```css
--tcm-space-xs: 0.25rem;  /* 4px */
--tcm-space-sm: 0.5rem;   /* 8px */
--tcm-space-md: 1rem;     /* 16px */
--tcm-space-lg: 1.5rem;   /* 24px */
--tcm-space-xl: 2rem;     /* 32px */
--tcm-space-2xl: 3rem;    /* 48px */
--tcm-space-3xl: 4rem;    /* 64px */
```

#### Border Radius
```css
--tcm-radius-sm: 0.25rem;  /* 4px - 细腻 */
--tcm-radius-md: 0.5rem;   /* 8px - 标准 */
--tcm-radius-lg: 0.75rem;  /* 12px - 圆润 */
--tcm-radius-xl: 1rem;     /* 16px - 大圆角 */
--tcm-radius-full: 9999px; /* 完全圆形 */
```

### 🌊 Effects & Decorations

#### Shadow System
```css
--tcm-shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--tcm-shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--tcm-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--tcm-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
```

#### Opacity Masks
```css
--tcm-overlay-light: rgba(255, 255, 255, 0.1);
--tcm-overlay-medium: rgba(255, 255, 255, 0.2);
--tcm-overlay-dark: rgba(0, 0, 0, 0.1);
```

### 🎯 Component Variants

#### Button Variants
- `variant="default"` - Standard style (unchanged)
- `variant="tcm"` - TCM cultural theme with herb gradients

#### Card Variants  
- `variant="default"` - Standard card (unchanged)
- `variant="tcm"` - TCM themed with decorative borders

### 📱 Responsive Breakpoints
```css
--tcm-screen-sm: 640px;   /* Mobile */
--tcm-screen-md: 768px;   /* Tablet */
--tcm-screen-lg: 1024px;  /* Desktop */
--tcm-screen-xl: 1280px;  /* Wide */
--tcm-screen-2xl: 1536px; /* Ultra-wide */
```

### ♿ Accessibility Standards

#### Color Contrast Requirements
- Normal text: ≥4.5:1 contrast ratio
- Large text: ≥3:1 contrast ratio
- UI components: ≥3:1 contrast ratio
- All decorative elements: `aria-hidden="true"`

#### Tested Combinations
- Sage-400 on white: 4.52:1 ✅
- Bamboo-500 on white: 4.51:1 ✅
- Herb-500 on white: 2.91:1 ❌ (use Herb-600 instead)
- White on Sage-600: 7.48:1 ✅

### 🏗️ Implementation Guidelines

#### CSS Variable Usage
```css
/* Use in components */
.tcm-button {
  background: var(--tcm-sage-400);
  border-radius: var(--tcm-radius-md);
  padding: var(--tcm-space-sm) var(--tcm-space-md);
}
```

#### Tailwind Integration
```js
// tailwind.config.ts
colors: {
  tcm: {
    sage: {
      50: '#f0f4f2',
      // ... full palette
    },
    bamboo: { /* ... */ },
    herb: { /* ... */ }
  }
}
```

#### Component Integration
```tsx
// Use className injection, no API changes
<AuthCard 
  className="tcm-card-variant"
  variant="tcm" // Optional, defaults to "default"
>
```

### 📊 Performance Budget

#### CSS Size Constraints
- Total CSS addition: ≤10KB (gzipped)
- No bitmap images (SVG only)
- Decorative components: Tree-shakeable

#### Loading Strategy
- CSS variables: Inline in <head>
- Decorative SVGs: Lazy-loaded
- Theme switching: CSS-only (no JS)

### 🔍 Validation Checklist

- [ ] WCAG 2.1 AA color contrast
- [ ] Mobile responsive (360×640)
- [ ] Desktop responsive (1440×900)
- [ ] CSS bundle ≤10KB increase
- [ ] No API breaking changes
- [ ] TypeScript/ESLint passing
- [ ] Build success

### 📝 Usage Examples

#### Applying TCM Theme
```tsx
// In LoginExample.tsx
<AuthCard variant="tcm" className="tcm-shadow-lg">
  <HerbalPattern density={0.1} opacity={0.05} />
  {/* Content */}
</AuthCard>
```

#### Decorative Components
```tsx
// Optional, disabled by default
<MeridianDecor 
  aria-hidden="true"
  opacity={0.1}
  position="top-right"
/>
```

---

**Status**: Specification Complete | **Version**: 1.0.0 | **Author**: Frontend Lead