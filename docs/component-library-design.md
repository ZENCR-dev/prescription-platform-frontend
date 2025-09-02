# Authentication Component Library Design
## Dev-Step 3.10: Component Library Extensions

### 📊 Implementation Status
- **✅ Implemented**: 4 core components (AuthInput, AuthButton, AuthForm, AuthCard)
- **📋 Planned**: Additional components for future iterations (marked with 📋 below)
- **Last Updated**: 2025-09-02

### 🎯 Architecture Overview

```
components/auth/library/
├── index.ts                 # Unified exports
├── primitives/             # Base components
│   ├── AuthInput.tsx       # ✅ Input with validation (Implemented)
│   ├── AuthButton.tsx      # ✅ Button with loading states (Implemented)
│   ├── AuthCheckbox.tsx    # 📋 Checkbox with validation (Planned)
│   └── AuthSelect.tsx      # 📋 Select with validation (Planned)
├── compounds/              # Composite components
│   ├── AuthForm.tsx        # ✅ Form wrapper with validation (Implemented)
│   ├── AuthCard.tsx        # ✅ Card container (Implemented)
│   ├── AuthHeader.tsx      # 📋 Branded header (Planned)
│   └── AuthFooter.tsx      # 📋 Compliance footer (Planned)
├── layouts/                # Layout components (All Planned)
│   ├── AuthLayout.tsx      # 📋 Full page layout (Planned)
│   ├── AuthSidebar.tsx     # 📋 Sidebar layout (Planned)
│   └── AuthSplitView.tsx   # 📋 Split screen layout (Planned)
└── types/                  # TypeScript definitions
    └── index.ts            # Shared types
```

### 📦 Component API Design Principles

1. **Consistent Props Interface**
   - All components extend base HTML element props
   - Common props: `className`, `disabled`, `loading`, `error`, `success`
   - Validation props: `required`, `rules`, `validateOn`

2. **Composition Over Configuration**
   - Small, focused components
   - Composable building blocks
   - Minimal prop drilling

3. **TypeScript First**
   - Full type safety
   - Exported types for all props
   - Generic components where appropriate

4. **Accessibility Built-in**
   - ARIA attributes by default
   - Keyboard navigation support
   - Screen reader friendly

### 🧩 Component Specifications

#### Primitive Components

**AuthInput**
```typescript
interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  hint?: string
  required?: boolean
  loading?: boolean
  validation?: ValidationConfig
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}
```

**AuthButton**
```typescript
interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  loadingText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}
```

**AuthCheckbox**
```typescript
interface AuthCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  required?: boolean
}
```

**AuthSelect**
```typescript
interface AuthSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Array<{ value: string; label: string }>
  error?: string
  success?: string
  hint?: string
  required?: boolean
  loading?: boolean
  placeholder?: string
}
```

#### Compound Components

**AuthForm**
```typescript
interface AuthFormProps extends FormHTMLAttributes<HTMLFormElement> {
  validation?: FormValidationConfig
  onSubmit: (values: Record<string, any>) => Promise<void>
  loading?: boolean
  error?: string | Error
  success?: string
}
```

**AuthCard**
```typescript
interface AuthCardProps {
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  variant?: 'default' | 'elevated' | 'bordered'
  className?: string
}
```

**AuthHeader**
```typescript
interface AuthHeaderProps {
  logo?: ReactNode
  title?: string
  subtitle?: string
  showLanguageSwitch?: boolean
  currentLanguage?: 'en' | 'zh'
  onLanguageChange?: (lang: 'en' | 'zh') => void
}
```

**AuthFooter**
```typescript
interface AuthFooterProps {
  showCompliance?: boolean
  showLinks?: boolean
  links?: Array<{ label: string; href: string }>
  copyright?: string
}
```

#### Layout Components

**AuthLayout**
```typescript
interface AuthLayoutProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  sidebar?: ReactNode
  variant?: 'centered' | 'split' | 'sidebar'
  backgroundImage?: string
}
```

### 🎨 Design System Integration

**Color Palette** (TCM Theme)
- Primary: Sage Green (#5F7E5F)
- Secondary: Cambridge Blue (#92B4A7)
- Accent: Gold (#FFD700)
- Error: Red (#EF4444)
- Success: Emerald (#10B981)
- Warning: Amber (#F59E0B)

**Typography**
- Headings: Inter/Noto Sans SC
- Body: Inter/Noto Sans SC
- Monospace: Fira Code

**Spacing Scale**
- xs: 0.25rem
- sm: 0.5rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- 2xl: 3rem

**Border Radius**
- sm: 0.125rem
- md: 0.375rem
- lg: 0.5rem
- xl: 0.75rem
- full: 9999px

### 🔌 Integration with Existing Hooks

All components will integrate with Dev-Step 3.9 hooks:

1. **Field Validation**
   ```typescript
   // AuthInput internally uses:
   const validation = useFieldValidation(validationConfig)
   ```

2. **Form Validation**
   ```typescript
   // AuthForm internally uses:
   const form = useFormValidation(formConfig)
   ```

3. **Loading States**
   ```typescript
   // Components use LoadingOverlay for fullscreen loading
   // AuthButton uses inline spinner for button loading
   ```

4. **Error Handling**
   ```typescript
   // All components wrapped with ErrorBoundary
   // Retryable errors use RetryableError component
   ```

### 📚 Storybook Structure

```
stories/
├── Introduction.stories.mdx
├── primitives/
│   ├── AuthInput.stories.tsx
│   ├── AuthButton.stories.tsx
│   ├── AuthCheckbox.stories.tsx
│   └── AuthSelect.stories.tsx
├── compounds/
│   ├── AuthForm.stories.tsx
│   ├── AuthCard.stories.tsx
│   ├── AuthHeader.stories.tsx
│   └── AuthFooter.stories.tsx
└── layouts/
    ├── AuthLayout.stories.tsx
    └── Examples.stories.tsx
```

### 🚀 Implementation Priority

1. **Phase 1: Core Primitives** (AuthInput, AuthButton)
2. **Phase 2: Form Components** (AuthCheckbox, AuthSelect, AuthForm)
3. **Phase 3: Layout Components** (AuthCard, AuthLayout)
4. **Phase 4: Branding Components** (AuthHeader, AuthFooter)
5. **Phase 5: Documentation** (Storybook, Examples, Guidelines)

### 📊 Success Metrics

- [ ] All components have TypeScript definitions
- [ ] All components have Storybook stories
- [ ] All components pass accessibility audit
- [ ] Component bundle size < 50KB
- [ ] 100% prop type coverage
- [ ] Zero runtime errors
- [ ] < 100ms render time for all components

### 🔄 Migration Strategy

Existing components will be refactored to use the new library:
1. Replace direct HTML elements with Auth components
2. Migrate validation logic to use shared hooks
3. Update styling to use design system tokens
4. Add Storybook stories for all variations

This design ensures a cohesive, reusable, and maintainable component library that accelerates authentication UI development while maintaining consistency and quality.