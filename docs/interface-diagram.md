# Dev-Step 4.3 接口关系图

**Loading States and Session Management Hooks - Interface Relationships**  
**Supporting Document for DEV-STEP-4.3-DESIGN-SPECIFICATION.md**

---

## 🏗️ 组件接口关系图

```mermaid
graph TB
    subgraph "Existing Architecture (不可修改)"
        AuthProvider[contexts/AuthProvider.tsx]
        ProtectedRoute[components/auth/ProtectedRoute.tsx]
        getUserClaims[lib/supabase/client.ts - getUserClaims('auth')]
        middleware[middleware.ts]
    end

    subgraph "New Components (Dev-Step 4.3)"
        LoadingStates[components/auth/LoadingStates.tsx]
        useSessionLoading[hooks/auth/useSessionLoading.ts]
        useAuthState[hooks/auth/useAuthState.ts]
        loadingStrategies[utils/auth/loadingStrategies.ts]
    end

    subgraph "Component Details"
        LoadingStates --> AuthLoadingSkeleton[AuthLoadingSkeleton]
        LoadingStates --> SessionCheckingSpinner[SessionCheckingSpinner]
        LoadingStates --> LoadingStateProvider[LoadingStateProvider]
        
        useSessionLoading --> SessionLoadingHook[UseSessionLoadingResult]
        useAuthState --> AuthStateHook[UseAuthStateResult]
        loadingStrategies --> PerformanceTracker[LoadingPerformanceTracker]
    end

    %% 集成关系
    useSessionLoading -.-> getUserClaims
    useAuthState -.-> AuthProvider
    useAuthState -.-> getUserClaims
    LoadingStates -.-> ProtectedRoute
    loadingStrategies -.-> useSessionLoading
    
    %% 数据流
    getUserClaims -->|30s TTL + 去重| useSessionLoading
    AuthProvider -->|事件协同| useAuthState
    useAuthState -->|状态| LoadingStates
    useSessionLoading -->|加载状态| LoadingStates
```

## 🔄 数据流关系

### 1. 缓存协同流程
```
getUserClaims('auth') [30s TTL]
    ↓ 
useSessionLoading [监听缓存状态]
    ↓
LoadingStates [根据缓存状态显示]
    ↓
用户界面 [loading/loaded状态]
```

### 2. 认证事件流程  
```
AuthProvider [SIGNED_IN/OUT/USER_UPDATED/TOKEN_REFRESHED]
    ↓
useAuthState [事件监听器]
    ↓ 
权限重新验证 [通过getUserClaims]
    ↓
useSessionLoading [更新加载状态]
    ↓
LoadingStates [UI状态更新]
```

### 3. ProtectedRoute协同流程
```
ProtectedRoute [checking状态]
    ↕ 双向协同
LoadingStates [AuthLoadingSkeleton]
    ↓
统一的loading UX体验
```

## 📋 接口类型依赖图

```typescript
// 类型依赖关系 (单一事实源)
@/lib/supabase/client
├── UserRole (导出)
├── UserClaims (导出)  
└── getUserClaims('auth') (函数)

// Dev-Step 4.3 组件导入关系
components/auth/LoadingStates.tsx
├── import { UserRole } from '@/lib/supabase/client' ✅
└── import { useAuthState } from '@/hooks/auth/useAuthState'

hooks/auth/useSessionLoading.ts
├── import { UserClaims } from '@/lib/supabase/client' ✅
└── import { getUserClaims } from '@/lib/supabase/client'

hooks/auth/useAuthState.ts  
├── import { UserRole, UserClaims } from '@/lib/supabase/client' ✅
└── import { useAuth } from '@/contexts/AuthProvider'

utils/auth/loadingStrategies.ts
└── import { UserRole, UserClaims } from '@/lib/supabase/client' ✅
```

---

*Created: 2025-09-05 | Dev-Step 4.3 QAD-Research | Interface Relationships*