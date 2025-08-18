import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';
import { WithAuthOptions } from '@/types/auth';

/**
 * 认证保护高阶组件
 * 用于保护需要登录才能访问的页面
 * 
 * @param Component 要保护的组件
 * @param options 配置选项
 * @returns 包装后的组件，处理认证逻辑
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const { allowedRoles, redirectTo = '/' } = options;
  
  const WithAuthComponent: React.FC<P> = (props) => {
    const { isAuthenticated, user, hasRole } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
      // 如果未认证，重定向到指定页面
      if (!isAuthenticated) {
        router.replace(redirectTo);
        return;
      }
      
      // 如果指定了角色限制，检查用户是否具有权限
      if (allowedRoles && allowedRoles.length > 0 && user) {
        const hasAccess = hasRole(allowedRoles);
        if (!hasAccess) {
          router.replace(redirectTo);
        }
      }
    }, [isAuthenticated, user, router, hasRole]);
    
    // 等待认证状态加载完成或未认证时不渲染内容
    if (!isAuthenticated) {
      return null;
    }
    
    // 如果有角色限制且用户没有权限，不渲染内容
    if (allowedRoles && allowedRoles.length > 0) {
      const hasAccess = hasRole(allowedRoles);
      if (!hasAccess) {
        return null;
      }
    }
    
    // 通过所有检查，渲染组件
    return <Component {...props} />;
  };
  
  WithAuthComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
  
  return WithAuthComponent;
} 