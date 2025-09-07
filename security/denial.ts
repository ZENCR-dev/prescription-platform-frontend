/**
 * 安全拒绝码与类型定义 - 中立层模块
 * 
 * @purpose 为认证系统提供单一事实源的拒绝类型定义
 * @architecture 纯TypeScript模块，无React/Next/框架依赖
 * @usage 供HOC、测试、服务模块导入使用
 * 
 * @constraints
 * - 禁止import任何React/Next框架
 * - 禁止import任何components/hooks/contexts路径
 * - 仅导出类型定义与枚举
 * - 无副作用，纯定义模块
 */

/**
 * 架构师定义枚举错误码
 * 失败优先级：NOT_AUTHENTICATED → MFA_REQUIRED → NOT_VERIFIED → ROLE_MISMATCH
 */
export enum DenialCode {
  NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',  // 优先级1 - 未认证
  MFA_REQUIRED = 'MFA_REQUIRED',           // 优先级2 - MFA不足
  NOT_VERIFIED = 'NOT_VERIFIED',           // 优先级3 - 未验证
  ROLE_MISMATCH = 'ROLE_MISMATCH'          // 优先级4 - 角色不匹配
}

/**
 * 用户类型导入与重导出（从lib/supabase/client导入避免循环依赖）
 */
import type { UserRole, UserClaims } from '@/lib/supabase/client'
export type { UserRole, UserClaims }

/**
 * 拒绝上下文信息
 */
export interface DenialContext {
  code: DenialCode
  reason: string
  userClaims: UserClaims | null
  requestedPath: string
  timestamp: number
}

/**
 * 拒绝响应处理配置
 */
export interface DenialResponse {
  action: 'redirect' | 'fallback' | 'custom'
  redirectTo?: string  // 必须经过安全校验，仅允许同源相对路径
  fallback?: any       // 泛型以避免React依赖
  preventDefault?: boolean
}